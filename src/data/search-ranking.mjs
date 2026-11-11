// Pagefind ranking settings for docs search, shared by the site
// (astro.config.mjs) and the search check (scripts/check-search.mjs), so the
// check ranks results exactly as readers' browsers do.
//
// These are Pagefind's own defaults. Starlight replaces them with flatter
// values (term frequency and page length 0.1), which suit Pagefind's
// all-words matching but rank worse with the per-word scoring in
// src/scripts/search-words.mjs: fewer queries find their page in the top three.
// Run `bun run build` after changing them; the search check reports the effect.
export const searchRanking = {
  pageLength: 0.75,
  termFrequency: 1,
  termSaturation: 1.4,
  termSimilarity: 1,
};
