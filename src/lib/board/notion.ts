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
};

type NotionRichText = { plain_text?: string };

type NotionProperty = {
  type: string;
  title?: NotionRichText[];
  rich_text?: NotionRichText[];
  checkbox?: boolean;
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

  return {
    id: page.id,
    title: title.trim() || "(제목 없음)",
    content: content.trim(),
    course,
    createdAt: dateProperty ?? page.created_time,
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

function richText(content: string) {
  return [{ type: "text", text: { content: content.slice(0, 2000) } }];
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
