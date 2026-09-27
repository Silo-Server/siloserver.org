// Reads the feature cards from the published 1.0 milestone page so the manual's
// app-support table and the milestone cannot drift apart.
export const clientColumns = [
  { key: 'web', label: 'Web' },
  { key: 'ios', label: 'iPhone & iPad' },
  { key: 'tvos', label: 'Apple TV' },
  { key: 'android', label: 'Android' },
  { key: 'androidtv', label: 'Android TV' },
];

export const milestonePath = 'public/milestone/1.0/index.html';

export function parseMilestoneFeatures(html) {
  const card = /<div class="fcard" id="(feature-[^"]+)" data-scope="([^"]*)">\s*<div class="fcard-head"><h4>([\s\S]*?)<\/h4>/g;
  return [...html.matchAll(card)].map(([, id, scope, heading]) => ({
    id,
    scope: scope.split(/\s+/).filter(Boolean),
    title: heading
      .replace(/<span class="sr-only">[\s\S]*?<\/span>/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/#/g, '')
      .replace(/&amp;/g, '&')
      .trim(),
  }));
}
