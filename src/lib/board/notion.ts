/**
 * 실시간 교육 게시판 — Notion 데이터 조회 모듈
 *
 * 용도 : Notion 데이터베이스를 게시판 저장소로 사용한다.
 *        강사(대표)가 Notion 앱(PC/폰)에 글을 올리면 홈페이지 게시판에 표시된다.
 *
 * 필요 환경변수
 *   NOTION_TOKEN        : Notion 내부 통합(Integration) 시크릿  (ntn_... 로 시작)
 *   NOTION_BOARD_DB_ID  : 게시판용 데이터베이스 ID (32자리 hex)
 *
 * 캐시 : 수강생 여러 명이 동시에 5초 간격으로 폴링해도 Notion API 호출이
 *        몰리지 않도록, 서버 메모리에 CACHE_TTL_MS 동안 결과를 보관한다.
 *
 * 속성 인식 : 데이터베이스의 속성 "이름"에 의존하지 않고 "타입"으로 찾는다.
 *             (title 타입 = 제목, rich_text 타입 = 내용, checkbox = 공개, select = 과정)
 *             따라서 속성 이름을 한글/영문 어느 쪽으로 만들어도 동작한다.
 */

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
const CACHE_TTL_MS = 5_000;
const PAGE_SIZE = 50;

export type BoardPost = {
  id: string;
  title: string;
  content: string;
  course: string | null;
  createdAt: string;
  origin: "web" | "notion";
};

type NotionRichText = { plain_text?: string };

type NotionProperty = {
  type: string;
  title?: NotionRichText[];
  rich_text?: NotionRichText[];
  checkbox?: boolean;
  number?: number | null;
  select?: { name?: string } | null;
  date?: { start?: string } | null;
};

type NotionPage = {
  id: string;
  created_time: string;
  properties: Record<string, NotionProperty>;
};

let cache: { at: number; posts: BoardPost[] } | null = null;

/** 같은 타입의 속성 중 첫 번째를 찾는다. 이름이 달라도 동작하게 하기 위함. */
function findByType(properties: Record<string, NotionProperty>, type: string) {
  for (const value of Object.values(properties)) {
    if (value?.type === type) {
      return value;
    }
  }
  return undefined;
}

/** 이름으로 먼저 찾고, 없으면 타입으로 대체 검색한다. */
function pick(
  properties: Record<string, NotionProperty>,
  names: string[],
  type: string,
) {
  for (const name of names) {
    const value = properties[name];
    if (value?.type === type) {
      return value;
    }
  }
  return findByType(properties, type);
}

/** rich_text 배열은 2000자 단위로 쪼개져 오므로 이어 붙인다. */
function joinText(items: NotionRichText[] | undefined) {
  if (!items?.length) {
    return "";
  }
  return items.map((item) => item.plain_text ?? "").join("");
}

function toPost(page: NotionPage): BoardPost {
  const properties = page.properties ?? {};

  const title = joinText(pick(properties, ["제목", "이름", "Name", "Title"], "title")?.title);
  const content = joinText(pick(properties, ["내용", "본문", "Content"], "rich_text")?.rich_text);
  const course = pick(properties, ["과정", "교육", "Course"], "select")?.select?.name ?? null;
  const dateProperty = pick(properties, ["작성일", "날짜", "Date"], "date")?.date?.start;
  const source = properties["출처"]?.select?.name;

  return {
    id: page.id,
    title: title.trim() || "(제목 없음)",
    content: content.trim(),
    course,
    createdAt: dateProperty ?? page.created_time,
    origin: source === "홈페이지" ? "web" : "notion",
  };
}

/** "공개" 체크박스가 있으면 그 값을 따르고, 속성이 없으면 공개로 간주한다. */
function isVisible(page: NotionPage) {
  const checkbox = pick(page.properties ?? {}, ["공개", "게시", "Published"], "checkbox");
  return checkbox?.checkbox ?? true;
}

export function isBoardConfigured() {
  return Boolean(process.env.NOTION_TOKEN && process.env.NOTION_BOARD_DB_ID);
}

const RICH_TEXT_BLOCK_LIMIT = 2000;
const RICH_TEXT_MAX_BLOCKS = 90; // Notion 한 속성에 넣을 수 있는 rich_text 블록당 2000자 제한을 우회하기 위해 여러 블록으로 쪼갠다(스크린샷 붙여넣기 등 긴 내용 대비).

/** 긴 텍스트(붙여넣은 이미지의 data URL 등)를 그대로 한 블록에 자르지 않고,
 * 2000자 블록 여러 개로 쪼개 담는다. 단순 truncate보다 훨씬 큰 내용을 보존할 수 있다. */
function richText(content: string) {
  const chunks: { type: "text"; text: { content: string } }[] = [];

  for (let offset = 0; offset < content.length && chunks.length < RICH_TEXT_MAX_BLOCKS; offset += RICH_TEXT_BLOCK_LIMIT) {
    chunks.push({
      type: "text",
      text: { content: content.slice(offset, offset + RICH_TEXT_BLOCK_LIMIT) },
    });
  }

  return chunks.length > 0 ? chunks : [{ type: "text" as const, text: { content: "" } }];
}

/** 교육생이 게시판에 글을 올린다. 통합(Integration) 토큰으로 직접 쓰기 때문에
 * Notion의 "링크가 있는 사람 편집" 유료 제한과 무관하게 동작한다. */
export async function createBoardPost({
  name,
  content,
  course,
}: {
  name: string;
  content: string;
  course: string | null;
}) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_BOARD_DB_ID;

  if (!token || !databaseId) {
    throw new Error("NOTION_TOKEN 또는 NOTION_BOARD_DB_ID 환경변수가 설정되지 않았습니다.");
  }

  const properties: Record<string, unknown> = {
    Name: { title: richText(name.slice(0, 100)) },
    내용: { rich_text: richText(content) },
    공개: { checkbox: true },
    출처: { select: { name: "홈페이지" } },
  };

  if (course) {
    properties["과정"] = { select: { name: course.slice(0, 100) } };
  }

  const response = await fetch(`${NOTION_API}/pages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`게시글 작성 실패 (${response.status}). ${detail.slice(0, 300)}`);
  }

  cache = null;
}

/** 과정 게시판의 "작업완료" 카운터. 별도 Notion 페이지 하나의 두 숫자 속성을 그대로 쓴다.
 * 모든 수강생이 같은 값을 보도록 서버(Notion)에 저장하며, 브라우저별 상태가 아니다.
 *
 * 카운트 : 현재 완료 인원 수
 * 회차   : "초기화"를 누를 때마다 1씩 늘어난다. 학생 화면은 자신이 클릭했던 회차를
 *          localStorage에 저장해 두고, 서버의 회차와 다르면(=강사가 초기화함) 다시
 *          누를 수 있게 한다 — 한 회차당 한 번만 반영되게 하는 용도.
 */
export type CompleteCounterState = { count: number; round: number };

export function isCompleteCounterConfigured() {
  return Boolean(process.env.NOTION_TOKEN && process.env.NOTION_COMPLETE_COUNTER_PAGE_ID);
}

async function fetchCounterState(): Promise<CompleteCounterState> {
  const token = process.env.NOTION_TOKEN;
  const pageId = process.env.NOTION_COMPLETE_COUNTER_PAGE_ID;

  if (!token || !pageId) {
    throw new Error("NOTION_TOKEN 또는 NOTION_COMPLETE_COUNTER_PAGE_ID 환경변수가 설정되지 않았습니다.");
  }

  const response = await fetch(`${NOTION_API}/pages/${pageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`카운터 조회 실패 (${response.status}). ${detail.slice(0, 300)}`);
  }

  const page = (await response.json()) as NotionPage;
  const properties = page.properties ?? {};

  return {
    count: properties["카운트"]?.number ?? 0,
    round: properties["회차"]?.number ?? 0,
  };
}

async function writeCounterState(state: CompleteCounterState) {
  const token = process.env.NOTION_TOKEN;
  const pageId = process.env.NOTION_COMPLETE_COUNTER_PAGE_ID;

  if (!token || !pageId) {
    throw new Error("NOTION_TOKEN 또는 NOTION_COMPLETE_COUNTER_PAGE_ID 환경변수가 설정되지 않았습니다.");
  }

  const response = await fetch(`${NOTION_API}/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        카운트: { number: state.count },
        회차: { number: state.round },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`카운터 갱신 실패 (${response.status}). ${detail.slice(0, 300)}`);
  }

  return state;
}

export async function getCompleteCount() {
  return fetchCounterState();
}

export async function incrementCompleteCount() {
  const current = await fetchCounterState();
  return writeCounterState({ count: current.count + 1, round: current.round });
}

export async function resetCompleteCount() {
  const current = await fetchCounterState();
  return writeCounterState({ count: 0, round: current.round + 1 });
}

/** 교시/휴식 타이머. 같은 "완료 카운터" Notion 페이지의 날짜 속성(종료시각)에
 * 종료 시각(ISO 문자열)을 저장한다. 강사가 "남은 시간(분)"을 입력하면 그 시점 +
 * N분을 계산해 저장하고, 모든 화면은 이 절대 시각을 기준으로 각자 카운트다운한다. */
export async function getTimerEndsAt(): Promise<string | null> {
  const token = process.env.NOTION_TOKEN;
  const pageId = process.env.NOTION_COMPLETE_COUNTER_PAGE_ID;

  if (!token || !pageId) {
    throw new Error("NOTION_TOKEN 또는 NOTION_COMPLETE_COUNTER_PAGE_ID 환경변수가 설정되지 않았습니다.");
  }

  const response = await fetch(`${NOTION_API}/pages/${pageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`타이머 조회 실패 (${response.status}). ${detail.slice(0, 300)}`);
  }

  const page = (await response.json()) as NotionPage;
  return page.properties?.["종료시각"]?.date?.start ?? null;
}

async function writeTimerEndsAt(endsAt: string | null) {
  const token = process.env.NOTION_TOKEN;
  const pageId = process.env.NOTION_COMPLETE_COUNTER_PAGE_ID;

  if (!token || !pageId) {
    throw new Error("NOTION_TOKEN 또는 NOTION_COMPLETE_COUNTER_PAGE_ID 환경변수가 설정되지 않았습니다.");
  }

  const response = await fetch(`${NOTION_API}/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        종료시각: { date: endsAt ? { start: endsAt } : null },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`타이머 갱신 실패 (${response.status}). ${detail.slice(0, 300)}`);
  }

  return endsAt;
}

export async function startTimer(minutes: number) {
  const endsAt = new Date(Date.now() + minutes * 60_000).toISOString();
  return writeTimerEndsAt(endsAt);
}

export async function clearTimer() {
  return writeTimerEndsAt(null);
}

/** HTML 실습 1/2 공유 슬롯. 같은 "완료 카운터" Notion 페이지에 슬롯마다 코드(rich_text)와
 * "사용 중" 체크박스를 저장한다. 참가자 아무나 두 슬롯 중 하나에 코드를 붙여넣으면,
 * 그 슬롯을 폴링하는 모두의 화면에 코드와 렌더링 결과가 그대로 반영된다. */
export type HtmlSlotState = { code: string; inUse: boolean };
export type HtmlSlotsState = { slot1: HtmlSlotState; slot2: HtmlSlotState };

const HTML_SLOT_PROPERTY_NAMES = {
  1: { code: "입력1", inUse: "입력1사용중" },
  2: { code: "입력2", inUse: "입력2사용중" },
} as const;

export async function getHtmlSlots(): Promise<HtmlSlotsState> {
  const token = process.env.NOTION_TOKEN;
  const pageId = process.env.NOTION_COMPLETE_COUNTER_PAGE_ID;

  if (!token || !pageId) {
    throw new Error("NOTION_TOKEN 또는 NOTION_COMPLETE_COUNTER_PAGE_ID 환경변수가 설정되지 않았습니다.");
  }

  const response = await fetch(`${NOTION_API}/pages/${pageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`실습 슬롯 조회 실패 (${response.status}). ${detail.slice(0, 300)}`);
  }

  const page = (await response.json()) as NotionPage;
  const properties = page.properties ?? {};

  return {
    slot1: {
      code: joinText(properties[HTML_SLOT_PROPERTY_NAMES[1].code]?.rich_text),
      inUse: properties[HTML_SLOT_PROPERTY_NAMES[1].inUse]?.checkbox ?? false,
    },
    slot2: {
      code: joinText(properties[HTML_SLOT_PROPERTY_NAMES[2].code]?.rich_text),
      inUse: properties[HTML_SLOT_PROPERTY_NAMES[2].inUse]?.checkbox ?? false,
    },
  };
}

export async function setHtmlSlot(
  slot: 1 | 2,
  update: { code?: string; inUse?: boolean },
) {
  const token = process.env.NOTION_TOKEN;
  const pageId = process.env.NOTION_COMPLETE_COUNTER_PAGE_ID;

  if (!token || !pageId) {
    throw new Error("NOTION_TOKEN 또는 NOTION_COMPLETE_COUNTER_PAGE_ID 환경변수가 설정되지 않았습니다.");
  }

  const names = HTML_SLOT_PROPERTY_NAMES[slot];
  const properties: Record<string, unknown> = {};

  if (update.code !== undefined) {
    properties[names.code] = { rich_text: richText(update.code) };
  }
  if (update.inUse !== undefined) {
    properties[names.inUse] = { checkbox: update.inUse };
  }

  const response = await fetch(`${NOTION_API}/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`실습 슬롯 갱신 실패 (${response.status}). ${detail.slice(0, 300)}`);
  }
}

export async function getBoardPosts(): Promise<BoardPost[]> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_BOARD_DB_ID;

  if (!token || !databaseId) {
    throw new Error(
      "NOTION_TOKEN 또는 NOTION_BOARD_DB_ID 환경변수가 설정되지 않았습니다.",
    );
  }

  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) {
    return cache.posts;
  }

  const response = await fetch(`${NOTION_API}/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page_size: PAGE_SIZE,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Notion 조회 실패 (${response.status}). 통합 연결과 데이터베이스 ID를 확인하세요. ${detail.slice(0, 300)}`,
    );
  }

  const payload = (await response.json()) as { results?: NotionPage[] };
  const posts = (payload.results ?? []).filter(isVisible).map(toPost);

  cache = { at: now, posts };

  return posts;
}
