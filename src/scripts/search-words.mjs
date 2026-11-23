// Shared by the docs search dialog and the word list it loads
// (src/pages/search-words.json.ts). Pure functions, so they're unit-tested
// in scripts/test-docs-search.mjs.
import { stem as porter2 } from "porter2";

// Words that say little about what someone is looking for: they appear on
// most pages, so searching them only adds noise. Queries written as sentences
// ("my mom says she needs…") are full of them.
export const fillerWords = new Set(
  `a also an and any are as at be been but by can could did do does doing for
  from get got had has have he her hers him his how i i'm im if in into is it
  its it's just me my need needs of on or our please really said say says she
  should so some that the their them then there these they this to too up us
  want wants was we were what when where which who why will with would you
  your`.split(/\s+/),
);

/**
 * Pagefind's stem for a word: Porter2, the Snowball English stemmer Pagefind
 * uses for its index. Forms that share a stem ("restore", "restoring") match
 * the same pages, so the word list treats a form the docs never use as a real
 * word, and a query counts such forms once.
 */
export const stem = (word) => porter2(word);

/** Lowercase words of three or more letters or digits, apostrophes removed. */
export function searchWords(text) {
  return (text.toLowerCase().replace(/['’]/g, "").match(/[\p{L}\p{N}]+/gu) ?? [])
    .filter((word) => word.length >= 3 && !/^\d+$/.test(word));
}

/** Query words worth matching on their own: no filler, no repeats. */
export function contentWords(query) {
  const words = query.toLowerCase().replace(/['’]/g, "").match(/[\p{L}\p{N}]+/gu) ?? [];
  return [...new Set(words.filter((word) => !fillerWords.has(word)))];
}

/**
 * Edit distance counting a swap of neighbouring letters as one edit
 * ("tarnscode"), stopping early once it exceeds `max`.
 */
export function editDistance(a, b, max = Infinity) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let before = null;
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(previous[j] + 1, row[j - 1] + 1, previous[j - 1] + cost);
      if (before && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, before[j - 2] + 1);
      }
      row.push(value);
      best = Math.min(best, value);
    }
    if (best > max) return max + 1;
    before = previous;
    previous = row;
  }
  return previous[b.length];
}

const sameLetters = (a, b) => [...a].sort().join("") === [...b].sort().join("");

/** How many edits a word of this length may need and still count as a typo. */
const allowedEdits = (word) => (word.length < 4 ? 0 : word.length < 7 ? 1 : 2);

const stemsOf = new WeakMap();
const docsStems = (counts) => {
  if (!stemsOf.has(counts)) stemsOf.set(counts, new Set(Object.keys(counts).map(stem)));
  return stemsOf.get(counts);
};

// Endings that turn one English word into another form of it, for forms the
// stem doesn't catch ("children" for "child"). A longer list would also
// accept misspellings ("playbak" is "play" plus "bak").
const ENDING = /^(?:s|es|d|ed|ing|er|ers|ren|ly)$/;

/**
 * Whether the docs use this word or a form of it: the word itself, another
 * form of it ("restoring" for "restore", "children" for "child"), or the
 * start of a longer word ("configur", or a word still being typed).
 */
export function isDocsWord(word, counts) {
  if (counts[word] || word.length < 4 || /\d/.test(word)) return true;
  if (docsStems(counts).has(stem(word))) return true;
  return Object.keys(counts).some(
    (known) =>
      known.startsWith(word) ||
      (known.length >= 4 && word.startsWith(known) && ENDING.test(word.slice(known.length))),
  );
}

/**
 * The docs word closest to a misspelled one, or null when the word is spelled
 * as the docs spell it or nothing is close. `counts` maps each docs word to
 * how often it appears; ties go to the more common word.
 */
export function suggestWord(word, counts) {
  if (isDocsWord(word, counts)) return null;
  const max = allowedEdits(word);
  let best = null;
  let bestDistance = max + 1;
  for (const [known, count] of Object.entries(counts)) {
    // Typos rarely change the first letter, and allowing it turns real words
    // into different ones ("kick" into "pick").
    if (known[0] !== word[0] || Math.abs(known.length - word.length) > max) continue;
    // In a short word, changing one letter for another usually gives a
    // different real word ("messed", "missed"). Missing, extra, and swapped
    // letters are still corrected ("dockr", "trancoding", "subtitels").
    if (word.length < 7 && known.length === word.length && !sameLetters(word, known)) continue;
    const distance = editDistance(word, known, max);
    if (distance < bestDistance || (distance === bestDistance && count > counts[best])) {
      best = known;
      bestDistance = distance;
    }
  }
  return bestDistance <= max ? best : null;
}

/**
 * Rank pages for a query searched one word at a time. `matches` holds one
 * list of Pagefind results per word. Each word adds the page's score for that
 * word, relative to the best page for it, so a page earns its place from how
 * well it matches each word rather than from containing every word. That
 * lets a page whose keywords match two words strongly outrank one that
 * mentions all three in passing.
 *
 * Returns [{ id, score, missing, strongest }]: `missing` lists the words the
 * page doesn't contain, and `strongest` is the index of the word that added
 * most to its score (ties go to the alphabetically first word, so the choice
 * doesn't depend on word order).
 */
export function rankPages(words, matches) {
  const pages = new Map();
  words.forEach((word, index) => {
    const results = matches[index] ?? [];
    const best = Math.max(...results.map(({ score }) => score), Number.MIN_VALUE);
    for (const { id, score } of results) {
      const page = pages.get(id) ?? { id, score: 0, found: new Set(), strongest: index, top: -1 };
      const share = score / best;
      page.score += share;
      page.found.add(word);
      if (share > page.top || (share === page.top && word < words[page.strongest])) {
        page.top = share;
        page.strongest = index;
      }
      pages.set(id, page);
    }
  });
  return [...pages.values()]
    .sort((a, b) => b.score - a.score)
    .map(({ id, score, found, strongest }) => ({
      id,
      score,
      strongest,
      missing: words.filter((word) => !found.has(word)),
    }));
}

/**
 * Turn what someone typed into the words to search for: filler removed,
 * misspellings corrected, and words no page uses set aside, since Pagefind
 * would otherwise return nothing for the rest. Without a word list (it failed
 * to load), every content word is searched as typed.
 */
export function planQuery(query, counts = {}) {
  const words = contentWords(query);
  if (!Object.keys(counts).length) return { words, terms: words, corrections: [], unknown: [] };
  const terms = [];
  const corrections = [];
  const unknown = [];
  for (const word of words) {
    if (isDocsWord(word, counts)) {
      terms.push(word);
      continue;
    }
    const suggestion = suggestWord(word, counts);
    if (suggestion) {
      terms.push(suggestion);
      corrections.push([word, suggestion]);
    } else {
      unknown.push(word);
    }
  }
  const stems = new Set();
  const unique = terms.filter((term) => !stems.has(stem(term)) && stems.add(stem(term)));
  return { words, terms: unique, corrections, unknown };
}

// Results scoring below this share of the best result are left out.
const WEAK_MATCH = 0.25;

/**
 * Run a query against Pagefind, one word at a time, and rank the pages with
 * rankPages. `search` is Pagefind's `search`. Each result is Pagefind's result
 * for the page's strongest word, so its excerpt and sections show that word.
 * Returns { plan, results: [{ result, missing }], complete }: `missing`
 * includes words left out of the search, and `complete` says whether any
 * result has every word. A partial match can outrank a complete one, so the
 * first result alone doesn't tell.
 */
export async function searchDocs(search, query, counts) {
  const plan = planQuery(query, counts);
  if (!plan.terms.length) return { plan, results: [], complete: false };
  const matches = await Promise.all(plan.terms.map(async (term) => (await search(term)).results));
  const ranked = rankPages(plan.terms, matches);
  // Pages far below the best one only mention a common word in passing.
  const cutoff = (ranked[0]?.score ?? 0) * WEAK_MATCH;
  const results = ranked
    .filter(({ score }) => score >= cutoff)
    .map(({ id, missing, strongest }) => ({
      result: matches[strongest].find((result) => result.id === id),
      missing: [...missing, ...plan.unknown],
    }));
  return { plan, results, complete: results.some(({ missing }) => !missing.length) };
}
