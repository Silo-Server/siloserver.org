import assert from "node:assert/strict";
import test from "node:test";
import {
  contentWords,
  editDistance,
  isDocsWord,
  planQuery,
  rankPages,
  searchDocs,
  searchWords,
  stem,
  suggestWord,
} from "../src/scripts/search-words.mjs";

test("contentWords drops filler words, apostrophes, and repeats", () => {
  assert.deepEqual(contentWords("How do I watch outside my house?"), ["watch", "outside", "house"]);
  assert.deepEqual(contentWords("My movies won't play, won't play"), ["movies", "wont", "play"]);
  assert.deepEqual(contentWords("how do i"), []);
});

test("searchWords keeps words of three or more letters and skips bare numbers", () => {
  assert.deepEqual(searchWords("Set up HDR on a 4K TV in 2026"), ["set", "hdr"]);
  assert.deepEqual(searchWords("Silo's Quick Sync"), ["silos", "quick", "sync"]);
});

test("editDistance counts a swap of neighbouring letters as one edit", () => {
  assert.equal(editDistance("tarnscoding", "transcoding"), 1);
  assert.equal(editDistance("trancoding", "transcoding"), 1);
  assert.equal(editDistance("subtitels", "subtitles"), 1);
  assert.equal(editDistance("abc", "xyz", 1), 2);
});

const counts = { transcoding: 40, transcode: 30, subtitles: 90, subtitle: 50, playback: 60, plays: 3 };

test("suggestWord corrects a word the docs don't use", () => {
  assert.equal(suggestWord("trancoding", counts), "transcoding");
  assert.equal(suggestWord("subtitels", counts), "subtitles");
  assert.equal(suggestWord("playbak", counts), "playback");
});

test("suggestWord leaves known, short, numeric, and unmatched words alone", () => {
  assert.equal(suggestWord("subtitles", counts), null);
  assert.equal(suggestWord("tvs", counts), null);
  assert.equal(suggestWord("h265", counts), null);
  assert.equal(suggestWord("zebra", counts), null);
  assert.equal(suggestWord("lays", counts), null, "a different first letter is a different word");
});

test("suggestWord leaves a short word alone when one letter is swapped for another", () => {
  assert.equal(suggestWord("messed", { missed: 5 }), null, "a different real word");
  assert.equal(suggestWord("dockr", { docker: 5 }), "docker", "a missing letter");
  assert.equal(suggestWord("vidoe", { video: 5 }), "video", "swapped neighbours");
});

test("planQuery drops pronouns and conversational words and counts word forms once", () => {
  assert.deepEqual(planQuery("she says her tv needs to see what he sees", { see: 1, sees: 1 }).terms, ["tv", "see"]);
});

test("stem gives forms of one word the same root and keeps different words apart", () => {
  const families = [
    ["see", "sees"],
    ["setting", "settings"],
    ["movie", "movies"],
    ["move", "moving"],
    ["upgrade", "upgrading", "upgraded"],
    ["restore", "restoring"],
    ["reset", "resetting"],
    ["configure", "configuring"],
    ["cache", "caching"],
    ["hog", "hogging"],
    ["study", "studies", "studying"],
    ["try", "tries", "tried", "trying"],
    ["copy", "copies", "copied"],
    ["play", "plays", "played", "playing"],
    ["stop", "stopped", "stopping"],
    ["watch", "watches", "watched"],
    ["library", "libraries"],
    ["access", "accessing"],
    ["status", "statuses"],
  ];
  for (const family of families) {
    assert.equal(new Set(family.map(stem)).size, 1, family.join(", "));
  }
  for (const [a, b] of [["move", "movie"], ["user", "use"], ["play", "plan"], ["cast", "case"]]) {
    assert.notEqual(stem(a), stem(b), `${a} and ${b}`);
  }
  for (const word of ["see", "hog", "tvs", "use"]) assert.equal(stem(word), word, `${word} stays whole`);
});

test("planQuery keeps different words that share letters", () => {
  assert.deepEqual(planQuery("move my movie", { move: 1, movie: 1 }).terms, ["move", "movie"]);
});

test("isDocsWord accepts other forms of a docs word and unfinished words", () => {
  const docs = { ...counts, play: 9, restore: 4, configure: 6, child: 2 };
  assert.equal(isDocsWord("subtit", docs), true, "still being typed");
  assert.equal(isDocsWord("restoring", docs), true);
  assert.equal(isDocsWord("configuring", docs), true);
  assert.equal(isDocsWord("children", docs), true);
  assert.equal(isDocsWord("subtitel", docs), false);
  assert.equal(isDocsWord("playbak", docs), false, "not play plus an ending");
  assert.equal(suggestWord("playbak", docs), "playback");
  assert.equal(suggestWord("subtitel", docs), "subtitle");
});

test("planQuery drops filler, corrects typos, and sets aside unknown words", () => {
  assert.deepEqual(planQuery("how do I fix trancoding on my zebra", { ...counts, fix: 5 }), {
    words: ["fix", "trancoding", "zebra"],
    terms: ["fix", "transcoding"],
    corrections: [["trancoding", "transcoding"]],
    unknown: ["zebra"],
  });
  assert.deepEqual(planQuery("trancoding zebra", {}).terms, ["trancoding", "zebra"]);
});

// A stand-in for Pagefind: a page matches when it contains every word.
const pages = { a: "watch outside home", b: "watch movies", c: "outside access", d: "house rules" };
const fakeSearch = async (term) => ({
  results: Object.entries(pages)
    .filter(([, text]) => term.split(" ").every((word) => text.includes(word)))
    .map(([id]) => ({ id, score: 1 })),
});
const pageWords = Object.fromEntries(Object.values(pages).join(" ").split(" ").map((word) => [word, 1]));

test("searchDocs ranks every page that matches any word, noting missing words", async () => {
  const { results } = await searchDocs(fakeSearch, "how do I watch outside", pageWords);
  assert.deepEqual(results.map(({ result, missing }) => [result.id, missing]), [
    ["a", []],
    ["b", ["outside"]],
    ["c", ["watch"]],
  ]);
});

test("searchDocs counts words left out of the search as missing", async () => {
  const { plan, results } = await searchDocs(fakeSearch, "watch zebra", pageWords);
  assert.deepEqual(plan.unknown, ["zebra"]);
  assert.deepEqual(results.map(({ result, missing }) => [result.id, missing]), [
    ["a", ["zebra"]],
    ["b", ["zebra"]],
  ]);
});

test("searchDocs reports a complete match even when a partial one ranks first", async () => {
  // "strong" matches two words well; "full" matches all three weakly.
  const scores = { watch: { strong: 10, full: 1 }, outside: { strong: 10, full: 1 }, home: { full: 1 } };
  const search = async (term) => ({
    results: Object.entries(scores[term] ?? {}).map(([id, score]) => ({ id, score })),
  });
  const words = { watch: 1, outside: 1, home: 1 };
  const { results, complete } = await searchDocs(search, "watch outside home", words);
  assert.deepEqual(results.map(({ result, missing }) => [result.id, missing]), [
    ["strong", ["home"]],
    ["full", []],
  ]);
  assert.equal(complete, true);
  assert.equal((await searchDocs(search, "watch zebra", words)).complete, false, "a left-out word is missing everywhere");
});

test("searchDocs leaves out pages far weaker than the best match", async () => {
  const weak = async (term) => ({
    results: term === "watch" ? [{ id: "a", score: 10 }] : [{ id: "a", score: 10 }, { id: "z", score: 1 }],
  });
  const { results } = await searchDocs(weak, "watch outside", { watch: 1, outside: 1 });
  assert.deepEqual(results.map(({ result }) => result.id), ["a"]);
});

test("searchDocs returns nothing when no word is worth searching", async () => {
  assert.deepEqual((await searchDocs(fakeSearch, "how do I", pageWords)).results, []);
});

test("rankPages lets strong matches on some words beat weak matches on all", () => {
  // "backup" matches two words strongly (say, in its keywords); "nodes"
  // mentions all three in passing.
  const ranked = rankPages(
    ["move", "new", "machine"],
    [
      [{ id: "backup", score: 10 }, { id: "nodes", score: 1 }],
      [{ id: "backup", score: 8 }, { id: "nodes", score: 1 }],
      [{ id: "nodes", score: 2 }],
    ],
  );
  assert.deepEqual(ranked.map(({ id, missing }) => [id, missing]), [
    ["backup", ["machine"]],
    ["nodes", []],
  ]);
});

test("rankPages picks each page's strongest word the same way in any word order", () => {
  const forward = rankPages(["plex", "history"], [[{ id: "p", score: 4 }], [{ id: "p", score: 4 }]]);
  const backward = rankPages(["history", "plex"], [[{ id: "p", score: 4 }], [{ id: "p", score: 4 }]]);
  assert.equal(["plex", "history"][forward[0].strongest], "history");
  assert.equal(["history", "plex"][backward[0].strongest], "history");
});
