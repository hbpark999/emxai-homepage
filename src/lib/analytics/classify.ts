import type { VisitorKind } from "./types";

const aiBotPatterns = [
  "gptbot",
  "chatgpt-user",
  "oai-searchbot",
  "claudebot",
  "anthropic-ai",
  "perplexitybot",
  "perplexity-user",
  "ccbot",
  "bytespider",
  "cohere-ai",
  "diffbot",
  "facebookexternalhit",
];

const searchBotPatterns = [
  "googlebot",
  "bingbot",
  "naverbot",
  "yeti",
  "daumoa",
  "duckduckbot",
  "baiduspider",
  "yandexbot",
];

const botPatterns = ["bot", "crawler", "spider", "scraper", "headless", "python-requests", "curl"];

export function classifyVisitor(userAgent: string): {
  kind: VisitorKind;
  label: string;
} {
  const normalized = userAgent.toLowerCase();

  const aiMatch = aiBotPatterns.find((pattern) => normalized.includes(pattern));
  if (aiMatch) {
    return { kind: "ai_bot", label: aiMatch };
  }

  const searchMatch = searchBotPatterns.find((pattern) => normalized.includes(pattern));
  if (searchMatch) {
    return { kind: "search_bot", label: searchMatch };
  }

  const botMatch = botPatterns.find((pattern) => normalized.includes(pattern));
  if (botMatch) {
    return { kind: "bot", label: botMatch };
  }

  if (!userAgent.trim()) {
    return { kind: "unknown", label: "empty user-agent" };
  }

  return { kind: "human", label: "browser" };
}
