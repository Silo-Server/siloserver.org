// Homepage motion. Everything here is progressive: without JavaScript the
// page shows each section's first state, and reduced motion keeps content
// changes but drops movement and the rotating word.

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const params = new URLSearchParams(location.search);
const root = document.documentElement;

/* ---------- Reveal on load ---------- */

// Text animates in once, on the first frame after load, rather than as each
// section scrolls into view. Blocks below the fold have finished by the time
// anyone reaches them.
requestAnimationFrame(() => {
  document.querySelector(".hero")?.classList.add("is-loaded");
  document.querySelectorAll(".rise, .reveal-lines, [data-reveal-group]").forEach((el) => el.classList.add("is-in"));
});

/* ---------- Rooms: show each room once its picture can paint ---------- */

document.querySelectorAll<HTMLElement>(".room").forEach((room) => {
  const img = room.querySelector("img");
  // Async images can fire load before their pixels are decoded. Keep the
  // room (including its grain) hidden until the picture can paint with it.
  // Either way the room settles, which releases its screens: a failed picture
  // leaves the room hidden but must not hide the app with it.
  const settle = (ok: boolean) => room.classList.add("is-settled", ...(ok ? ["is-ready"] : []));
  if (!img) return settle(false);
  img
    .decode()
    .then(() => settle(true))
    .catch(() => {
      // decode() also rejects for a lazy picture that hasn't loaded yet
      // (Safari); wait for it before giving up.
      if (img.complete) return settle(img.naturalWidth > 0);
      img.addEventListener("load", () => img.decode().then(() => settle(true), () => settle(false)), { once: true });
      img.addEventListener("error", () => settle(false), { once: true });
    });
});

/* ---------- Library: show the screen once its pictures can paint ---------- */

// The library screen has no room to wait for, so it waits for the pictures
// in its first view instead (not the pages it opens later). They stay lazy
// until the section is a window away, then all load at once: a lazy picture
// clipped by the screen's edge might otherwise never load, and the screen
// would never show.
document.querySelectorAll<HTMLElement>("[data-wait-images]").forEach((el) => {
  const imgs = Array.from(el.querySelectorAll("img")).filter((img) => !img.closest("[data-push]"));
  new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      imgs.forEach((img) => (img.loading = "eager"));
    },
    { rootMargin: "100% 0px" },
  ).observe(el);
  Promise.all(imgs.map((img) => img.decode().catch(() => undefined))).then(() => el.classList.add("is-ready"));
});

/* ---------- Header ---------- */

const header = document.querySelector<HTMLElement>("[data-header]");

/* ---------- Scroll progress ---------- */
// [data-progress] gets --p from 0 to 1. "enter" mode (default) runs from the
// element's top reaching the bottom of the viewport until it has travelled
// range × viewport height; "pin" mode runs across a tall sticky track.

const progressEls = Array.from(document.querySelectorAll<HTMLElement>("[data-progress]"));
const listeners: Array<(el: HTMLElement, p: number) => void> = [];
const clamp = (v: number) => Math.min(1, Math.max(0, v));

function measure() {
  const vh = innerHeight || 800;
  header?.classList.toggle("is-scrolled", scrollY > 8);
  for (const el of progressEls) {
    const r = el.getBoundingClientRect();
    const p =
      el.dataset.progressMode === "pin"
        ? clamp(-r.top / Math.max(1, r.height - vh))
        : clamp((vh - r.top) / (vh * Number(el.dataset.progressRange ?? 1)));
    el.style.setProperty("--p", p.toFixed(4));
    listeners.forEach((fn) => fn(el, p));
  }
}
let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    measure();
  });
};
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);

/* ---------- Visibility helper ---------- */

function whileVisible(el: Element | null, start: () => void, stop: () => void) {
  if (!el) return;
  let visible = false;
  const sync = () => (visible && !document.hidden ? start() : stop());
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    sync();
  }).observe(el);
  document.addEventListener("visibilitychange", sync);
}

/* ---------- Hero: rotating word drives tvOS focus ---------- */

const rotator = document.querySelector<HTMLElement>("[data-rotator]");
const tvHome = document.querySelector<HTMLElement>("[data-tv-home]");

if (rotator && tvHome) {
  const words = Array.from(rotator.querySelectorAll<HTMLElement>(".rotator__word"));
  const bgs = tvHome.querySelectorAll<HTMLElement>(".tvh__bg");
  const mqs = tvHome.querySelectorAll<HTMLElement>(".tvh__mq");
  const cards = tvHome.querySelectorAll<HTMLElement>(".tv-still");
  const track = tvHome.querySelector<HTMLElement>("[data-tv-track]");
  let index = 0;

  const sizeTo = (el: HTMLElement) => {
    rotator.style.width = `${el.offsetWidth}px`;
  };

  if (reduce || params.has("static")) {
    words.forEach((w, i) => {
      w.classList.toggle("is-on", i === 0);
      if (i === 0) w.textContent = rotator.dataset.staticWord ?? w.textContent;
    });
    rotator.classList.add("is-static");
  } else {
    sizeTo(words[0]);
    addEventListener("resize", () => sizeTo(words[index]));
    document.fonts?.ready.then(() => sizeTo(words[index]));

    const show = (next: number) => {
      const prev = index;
      index = next;
      rotator.classList.add("is-cycling");
      words.forEach((w) => w.classList.remove("is-out"));
      words[prev].classList.remove("is-on");
      words[prev].classList.add("is-out");
      words[next].classList.add("is-on");
      words.forEach((w, i) => w.setAttribute("aria-hidden", i === next ? "false" : "true"));
      sizeTo(words[next]);

      // Focus moves one card along the row; the marquee follows it.
      cards.forEach((c, i) => c.classList.toggle("is-focused", i === next));
      bgs.forEach((b, i) => b.classList.toggle("is-on", i === next));
      mqs.forEach((m, i) => m.classList.toggle("is-on", i === next));
      // Like tvOS, the row only moves when focus would leave the screen, and
      // then just far enough to keep the focused card in view (80pt inset).
      const card = cards[next];
      const overflow = card ? card.offsetLeft + card.offsetWidth + 80 - tvHome.offsetWidth : 0;
      track?.style.setProperty("--row-x", String(Math.max(0, overflow)));
    };

    // From the end of the row, getting back to the first card takes Back
    // (focus goes up to the Home tab) and then Select on Home, which returns
    // focus to the first card and scrolls the row back.
    const bar = tvHome.querySelector<HTMLElement>(".tvbar");
    const homeTab = tvHome.querySelector<HTMLElement>('[data-tab="Home"]');
    let timers: number[] = [];
    const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const backToStart = () => {
      cards.forEach((c) => c.classList.remove("is-focused"));
      bar?.classList.add("is-active");
      homeTab?.classList.add("is-focused");
      later(500, () => homeTab?.classList.add("is-pressed"));
      later(600, () => {
        homeTab?.classList.remove("is-pressed", "is-focused");
        bar?.classList.remove("is-active");
        show(0);
      });
    };
    // Each card rests 1.9s; the trip back to the first card adds 0.6s.
    const tick = () => {
      if (index === words.length - 1) {
        backToStart();
        later(600 + 1900, tick);
      } else {
        show(index + 1);
        later(1900, tick);
      }
    };

    whileVisible(
      tvHome,
      () => {
        if (!timers.length) later(1900, tick);
      },
      () => {
        timers.forEach(clearTimeout);
        timers = [];
        homeTab?.classList.remove("is-pressed", "is-focused");
        bar?.classList.remove("is-active");
        if (!cards[index]?.classList.contains("is-focused")) show(index);
      },
    );
  }
}

/* ---------- Library: browse the grid, open a series, go back ---------- */
// Focus moves along the Series grid like a remote; on a title with a page
// drawn ([data-push]), a press opens it, it stays a moment, then Back.

const grid = document.querySelector<HTMLElement>("[data-tv-grid]");
const browse = grid?.closest<HTMLElement>("[data-tv-browse]");
if (grid && browse) {
  const cells = Array.from(grid.querySelectorAll<HTMLElement>(".tvb__cell"));
  const pages = Array.from(browse.parentElement?.querySelectorAll<HTMLElement>("[data-push]") ?? []);
  const pageFor = (i: number) => pages.find((p) => Number(p.dataset.from) === i);
  const focus = (i: number) => cells.forEach((c, n) => c.classList.toggle("is-focused", n === i));
  // [cell, how long to rest there]; a cell with a page is opened after resting.
  const route: Array<[number, number]> = [[0, 900], [1, 550], [2, 550], [3, 900], [2, 550], [1, 550]];
  let timers: number[] = [];
  let running = false;
  const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
  const run = () => {
    let t = 0;
    for (const [cell, rest] of route) {
      at(t, () => focus(cell));
      t += rest;
      const page = pageFor(cell);
      if (page) {
        at(t, () => cells[cell]?.classList.add("is-pressed"));
        at(t + 180, () => {
          cells[cell]?.classList.remove("is-pressed");
          browse.classList.add("is-covered");
          page.classList.add("is-on");
        });
        at(t + 3200, () => {
          page.classList.remove("is-on");
          browse.classList.remove("is-covered");
        });
        t += 3800;
      }
    }
    at(t, run);
  };
  const stop = () => {
    timers.forEach(clearTimeout);
    timers = [];
    running = false;
    pages.forEach((p) => p.classList.remove("is-on"));
    browse.classList.remove("is-covered");
    focus(0);
  };
  if (!reduce) {
    whileVisible(
      grid,
      () => {
        if (running) return;
        running = true;
        run();
      },
      stop,
    );
  }
}

/* ---------- Experience: pinned TV + iPhone scene ---------- */

const scene = document.querySelector<HTMLElement>("[data-scene]");
if (scene) {
  const steps = scene.querySelectorAll<HTMLElement>("[data-step]");
  const remote = scene.querySelector<HTMLElement>("[data-remote]");
  const playing = scene.querySelector<HTMLElement>("[data-tv-playing]");
  const pp = scene.querySelector<HTMLElement>("[data-playpause]");
  const scrub = scene.querySelector<HTMLElement>("[data-scrub]");
  const elapsedEl = scene.querySelector<HTMLElement>("[data-elapsed]");
  const remainingEl = scene.querySelector<HTMLElement>("[data-remaining]");
  const total = Number(scrub?.dataset.total ?? 0);
  let seconds = Number(scrub?.dataset.start ?? 0);
  let stage = -1;
  let clock = 0;

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    const mm = h ? String(m).padStart(2, "0") : String(m);
    return `${h ? `${h}:` : ""}${mm}:${String(sec).padStart(2, "0")}`;
  };
  const tick = () => {
    seconds = Math.min(total, seconds + 1);
    scrub?.style.setProperty("--p", String(seconds / total));
    if (elapsedEl) elapsedEl.textContent = fmt(seconds);
    if (remainingEl) remainingEl.textContent = `-${fmt(total - seconds)}`;
    // The phone player uses a true minus sign (MobilePlayerControls.swift).
    if (playerElapsed) playerElapsed.textContent = fmt(seconds);
    if (playerRemaining) playerRemaining.textContent = `\u2212${fmt(total - seconds)}`;
    playerBar?.style.setProperty("--p", String(seconds / total));
    if (seconds >= total) syncClock();
  };

  const phone = scene.querySelector<HTMLElement>(".experience__phone");
  const tvset = scene.querySelector<HTMLElement>("[data-tvset]");
  const playerElapsed = scene.querySelector<HTMLElement>("[data-player-elapsed]");
  const playerRemaining = scene.querySelector<HTMLElement>("[data-player-remaining]");
  const playerBar = scene.querySelector<HTMLElement>("[data-player-bar]");
  const head = scene.querySelector<HTMLElement>(".experience__head");
  const stageEl = scene.querySelector<HTMLElement>(".experience__stage");
  const stepList = scene.querySelector<HTMLElement>(".experience__steps");
  const phoneLayout = matchMedia("(max-width: 560px)");

  // Where the phone goes in step 3: centred on the stage, turned to
  // landscape, and as wide as most of the TV. Measured from the untransformed layout.
  const placePhone = () => {
    if (!phone || !tvset) return;
    const tv = tvset.getBoundingClientRect();
    const w = phone.offsetWidth;
    const h = phone.offsetHeight;
    const left = phone.offsetLeft + (phone.offsetParent as HTMLElement).getBoundingClientRect().left;
    const top = phone.offsetTop + (phone.offsetParent as HTMLElement).getBoundingClientRect().top;
    const scale = Math.min((tv.width * 0.86) / h, (tv.height * 1.05) / w);
    // On phones the TV sits high on the screen, so the phone lands centred
    // between the headline and the step text instead.
    let centerY = tv.top + tv.height / 2;
    if (phoneLayout.matches && head && stepList) {
      centerY = (head.getBoundingClientRect().bottom + stepList.getBoundingClientRect().top) / 2;
    }
    // The TV sits left of centre to leave the phone room beside it, so the
    // phone centres on the stage, not the TV.
    const stageBox = (stageEl ?? tvset).getBoundingClientRect();
    phone.style.setProperty("--lx", `${stageBox.left + stageBox.width / 2 - (left + w / 2)}px`);
    phone.style.setProperty("--ly", `${centerY - (top + h / 2)}px`);
    phone.style.setProperty("--ls", scale.toFixed(3));
  };
  placePhone();
  addEventListener("resize", placePhone);

  const home = scene.querySelector<HTMLElement>(".ios-home");
  // Playing on the TV: the picture starts, the phone's remote opens on the
  // running episode, and the clock ticks on both.
  // The clock ticks only while an episode plays, the scene is on screen, and
  // the episode hasn't reached its end.
  let isPlaying = false;
  let sceneVisible = false;
  function syncClock() {
    const run = isPlaying && sceneVisible && seconds < total;
    if (run && !clock) clock = window.setInterval(tick, 1000);
    if (!run && clock) {
      clearInterval(clock);
      clock = 0;
    }
  }
  whileVisible(
    scene,
    () => {
      sceneVisible = true;
      syncClock();
    },
    () => {
      sceneVisible = false;
      syncClock();
    },
  );
  const setPlaying = (on: boolean) => {
    playing?.classList.toggle("is-on", on);
    remote?.classList.toggle("is-up", on);
    pp?.classList.toggle("is-paused", !on);
    isPlaying = on;
    syncClock();
  };
  const setEngaged = (on: boolean) => home?.classList.toggle("is-engaged", on);

  let focusOnArrival = -1;
  const setStage = (next: number) => {
    if (next === stage) return;
    stage = next;
    steps.forEach((s, i) => s.classList.toggle("is-on", i === next));
    // On phones only the current step shows, so the step that was clicked to
    // advance disappears; hand its focus to the step the scene arrives at.
    if (next === focusOnArrival) {
      steps[next].querySelector<HTMLElement>("[data-goto]")?.focus({ preventScroll: true });
      focusOnArrival = -1;
    }
    // One state per step: from step 2 the episode plays on the TV and the
    // phone shows its remote, with no taps played out in between.
    setEngaged(next >= 1);
    setPlaying(next >= 1);
    if (next >= 2) placePhone();
    phone?.classList.toggle("is-landscape", next >= 2);
    tvset?.classList.toggle("is-off", next >= 2);
  };

  // How much scroll each step gets, in window heights. The first is short so
  // the phone takes over soon after the scene pins, which shows that scrolling
  // drives it. The track's height in CSS (.experience__track) is one window
  // plus their sum.
  const spans = [0.25, 0.55, 0.55];
  const spanSum = spans.reduce((a, b) => a + b, 0);
  const bounds = spans.reduce((b, s) => [...b, b[b.length - 1] + s / spanSum], [0]);
  const stepAt = (p: number) => {
    let i = 0;
    while (i < spans.length - 1 && p >= bounds[i + 1]) i++;
    return i;
  };

  // Clicking a step scrolls to its start in the pinned track. Clicking the
  // step already showing moves on to the next one (on phones only the
  // current step is visible, so this is how you advance).
  const goTo = (i: number) => {
    const track = scene.offsetHeight - innerHeight;
    const top = scene.getBoundingClientRect().top + scrollY;
    const target =
      i >= steps.length ? top + track + 1 : top + (bounds[i] + 0.04 * (bounds[i + 1] - bounds[i])) * track;
    scrollTo({ top: Math.round(target), behavior: reduce ? "auto" : "smooth" });
  };
  steps.forEach((s, i) =>
    s.addEventListener("click", () => {
      const target = i === stage ? i + 1 : i;
      if (target < steps.length) focusOnArrival = target;
      goTo(target);
    }),
  );

  listeners.push((el, p) => {
    if (el !== scene) return;
    setStage(stepAt(p));
    // Each step's bar fills across its own stretch of the scroll.
    steps.forEach((s, i) =>
      s.style.setProperty("--fill", String(clamp((p - bounds[i]) / (bounds[i + 1] - bounds[i])))),
    );
  });
}

measure();
root.classList.add("motion-ready");
