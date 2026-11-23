// Words used in the docs, with how often each appears. The search dialog
// fetches it on the first search to tell real words from misspellings and to
// suggest corrections. It must cover everything search indexes for a page,
// including the hidden keywords and questions, or a word that only appears
// there gets "corrected" into a different one.
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { searchWords } from "../scripts/search-words.mjs";

export const GET: APIRoute = async () => {
  const docs = await getCollection("docs");
  const counts = new Map<string, number>();
  for (const { data, body = "" } of docs) {
    const text = [
      data.title,
      data.description ?? "",
      ...(data.keywords ?? []),
      ...(data.questions ?? []),
      body,
    ].join(" ");
    for (const word of searchWords(text)) counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  // Most frequent first, so a tie in spelling distance goes to the common word.
  const words = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return new Response(JSON.stringify(Object.fromEntries(words)), {
    headers: { "Content-Type": "application/json" },
  });
};
