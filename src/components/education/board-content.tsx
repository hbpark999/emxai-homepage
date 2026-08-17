"use client";

/**
 * 실시간 교육 게시판 — 본문 렌더러
 *
 * 용도 : Notion에 적은 텍스트를 화면에 보기 좋게 표시한다.
 *        외부 마크다운 라이브러리 없이 교육 게시판에 필요한 문법만 처리한다.
 *
 * 지원 문법
 *   ```python ... ```   코드블록 (우측 상단에 복사 버튼)
 *   - 항목               목록
 *   **굵게**             강조
 *   `인라인코드`         인라인 코드
 *   [이름](주소)         링크
 *   https://...          자동 링크
 *
 * 코드블록 복사 버튼이 있어 수강생이 실습 코드를 그대로 붙여넣을 수 있다.
 */

import { useState, type ReactNode } from "react";

type Block =
  | { kind: "code"; lang: string; code: string }
  | { kind: "list"; items: string[] }
  | { kind: "para"; lines: string[] };

const FENCE = /^\s*```/;
const BULLET = /^\s*[-*]\s+/;

function parseBlocks(text: string): Block[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (FENCE.test(line)) {
      const lang = line.trim().replace(/^```/, "").trim();
      const code: string[] = [];
      index += 1;

      while (index < lines.length && !FENCE.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1; // 닫는 펜스 건너뛰기

      blocks.push({ kind: "code", lang, code: code.join("\n") });
      continue;
    }

    if (BULLET.test(line)) {
      const items: string[] = [];

      while (index < lines.length && BULLET.test(lines[index])) {
        items.push(lines[index].replace(BULLET, ""));
        index += 1;
      }

      blocks.push({ kind: "list", items });
      continue;
    }

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() !== "" &&
      !FENCE.test(lines[index]) &&
      !BULLET.test(lines[index])
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }

    blocks.push({ kind: "para", lines: paragraph });
  }

  return blocks;
}

const INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)\s]+\))|(https?:\/\/[^\s<>()]+)/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let count = 0;

  INLINE.lastIndex = 0;

  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${keyPrefix}-${count}`;
    count += 1;

    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.92em] text-slate-800"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-bold text-slate-950">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("[")) {
      const label = token.slice(1, token.indexOf("]"));
      const href = token.slice(token.indexOf("(") + 1, -1);
      nodes.push(
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sky-600 underline underline-offset-2 hover:text-sky-700"
        >
          {label}
        </a>,
      );
    } else {
      nodes.push(
        <a
          key={key}
          href={token}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-semibold text-sky-600 underline underline-offset-2 hover:text-sky-700"
        >
          {token}
        </a>,
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="group relative my-3 overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="rounded border border-slate-600 px-3 py-1 text-xs font-bold text-slate-200 transition hover:border-sky-400 hover:text-sky-300"
        >
          {copied ? "복사됨" : "복사"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3">
        <code className="font-mono text-[13px] leading-6 text-slate-100">{code}</code>
      </pre>
    </div>
  );
}

export function BoardContent({ text }: { text: string }) {
  if (!text.trim()) {
    return null;
  }

  const blocks = parseBlocks(text);

  return (
    <div className="text-base leading-7 text-slate-700">
      {blocks.map((block, blockIndex) => {
        if (block.kind === "code") {
          return <CodeBlock key={blockIndex} lang={block.lang} code={block.code} />;
        }

        if (block.kind === "list") {
          return (
            <ul key={blockIndex} className="my-2 list-disc space-y-1 pl-5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item, `${blockIndex}-${itemIndex}`)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={blockIndex} className="my-2 whitespace-pre-wrap">
            {block.lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {renderInline(line, `${blockIndex}-${lineIndex}`)}
                {lineIndex < block.lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
