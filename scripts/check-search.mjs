// Runs the queries in scripts/search-queries.json through the built search
// (dist/pagefind and dist/search-words.json, ranked by searchDocs as the
// search dialog does) and fails if a query's expected page drops out of the
// top three results. Run after `astro build`.
//
// Each entry is { "query", "expect": ["docs/slug", ...] }. A query that
// doesn't find its page yet can carry "knownMiss": "<why>"; the check reports
// it but doesn't fail. Once it passes, the check fails until the knownMiss is
// removed, so the improvement is protected from then on.
import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { searchRanking } from "../src/data/search-ranking.mjs";
import { searchDocs } from "../src/scripts/search-words.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = `${root}dist`;
const TOP = 3;

// Pagefind's search script is written for browsers: serve its index files
// from disk instead of over HTTP.
globalThis.fetch = async (url) => {
  const path = new URL(url).pathname.replace(/^.*\/pagefind\//, `${dist}/pagefind/`);
  return new Response(await readFile(path));
};
const pagefind = await import(pathToFileURL(`${dist}/pagefind/pagefind.js`).href);
await pagefind.options({ basePath: "http://localhost/pagefind/", ranking: searchRanking });

const counts = JSON.parse(await readFile(`${dist}/search-words.json`, "utf8"));
const queries = JSON.parse(await readFile(`${root}scripts/search-queries.json`, "utf8"));
const slugOf = (url) => url.replace(/^.*?\/(docs(?:\/[^#?]*?)?)(?:\.html)?(?:[#?].*)?$/, "$1");

const failures = [];
const stillMissing = [];
const nowPassing = [];
let found = 0;
for (const { query, expect, knownMiss } of queries) {
  if (knownMiss !== undefined && (typeof knownMiss !== "string" || !knownMiss.trim())) {
    failures.push(`  "${query}": knownMiss must say why the query misses`);
  }
  const { results } = await searchDocs(pagefind.search, query, counts);
  const top = await Promise.all(results.slice(0, TOP).map(async ({ result }) => slugOf((await result.data()).url)));
  const ok = top.some((slug) => expect.includes(slug));
  found += ok;
  const line = `  "${query}" -> ${top.join(", ") || "no results"} (expected ${expect.join(" or ")})`;
  if (!ok && !knownMiss) failures.push(line);
  if (!ok && knownMiss) stillMissing.push(`${line}: ${knownMiss}`);
  if (ok && knownMiss) nowPassing.push(`  "${query}"`);
}

console.log(`Search: ${found} of ${queries.length} queries find an expected page in the top ${TOP}.`);
if (stillMissing.length) console.log(`Known misses:\n${stillMissing.join("\n")}`);
if (nowPassing.length) {
  console.error(`These known misses now pass. Remove their "knownMiss" so they stay passing:\n${nowPassing.join("\n")}`);
}
if (failures.length) {
  console.error(`These queries don't find their page in the top ${TOP}:\n${failures.join("\n")}`);
  console.error("Check recent keyword, title, or ranking changes, or update scripts/search-queries.json.");
}
if (failures.length || nowPassing.length) process.exit(1);
