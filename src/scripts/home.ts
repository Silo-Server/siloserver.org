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

/* ---------- Scenes variant: show each room once its picture can paint ---------- */

document.querySelectorAll<HTMLElement>(".room").forEach((room) => {
  const img = room.querySelector("img");
  // Async images can fire load before their pixels are decoded. Keep the
  // room (including its grain) hidden until the picture can paint with it.
  const ready = async () => {
    if (!img) return;
    try {
      await img.decode();
      room.classList.add("is-ready");
    } catch {
      // A failed image must not reveal the grain on its own.
    }
  };
  if (!img || (img.complete && img.naturalWidth)) ready();
  else img.addEventListener("load", ready, { once: true });
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

/* ---------- Hero: fit the height to the screen in tall windows ---------- */

// The plain hero fills the window, and its screen grows to fit the space
// under the text. In a tall, narrow window the screen runs out of width
// first and floats in empty space, so the hero shrinks to hold the text and
// the screen at its full width. Phones size the hero to its content in CSS.
const plainHero = document.querySelector<HTMLElement>(".hero:not(.hero--scene)");
const heroIntro = plainHero?.querySelector<HTMLElement>(".hero__intro");
const heroStage = plainHero?.querySelector<HTMLElement>(".hero__stage");
const heroScreen = heroStage?.querySelector<HTMLElement>(".scene-anchor--hero");
const phoneHero = matchMedia("(max-width: 560px)");
const fitHero = () => {
  if (!plainHero || !heroIntro || !heroStage || !heroScreen) return;
  plainHero.style.height = "";
  if (phoneHero.matches) return;
  const full = plainHero.offsetHeight;
  // With room to spare, the screen's height is set by its width alone.
  plainHero.style.height = "10000px";
  const screenHeight = heroScreen.offsetHeight;
  plainHero.style.height = "";
  const hero = getComputedStyle(plainHero);
  const fit =
    parseFloat(hero.paddingTop) +
    heroIntro.offsetHeight +
    parseFloat(getComputedStyle(heroStage).marginTop) +
    screenHeight +
    parseFloat(hero.paddingBottom);
  if (fit < full) plainHero.style.height = `${Math.ceil(fit)}px`;
};
fitHero();
addEventListener("resize", fitHero);
document.fonts?.ready.then(fitHero);

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
  };

  const phone = scene.querySelector<HTMLElement>(".experience__phone");
  const tvset = scene.querySelector<HTMLElement>("[data-tvset]");
  const playerElapsed = scene.querySelector<HTMLElement>("[data-player-elapsed]");
  const playerRemaining = scene.querySelector<HTMLElement>("[data-player-remaining]");
  const playerBar = scene.querySelector<HTMLElement>("[data-player-bar]");
  const head = scene.querySelector<HTMLElement>(".experience__head");
  const stepList = scene.querySelector<HTMLElement>(".experience__steps");
  const phoneLayout = matchMedia("(max-width: 560px)");

  // Where the phone goes in step 4: centred on the TV, turned to landscape,
  // and as wide as most of the TV. Measured from the untransformed layout.
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
    phone.style.setProperty("--lx", `${tv.left + tv.width / 2 - (left + w / 2)}px`);
    phone.style.setProperty("--ly", `${centerY - (top + h / 2)}px`);
    phone.style.setProperty("--ls", scale.toFixed(3));
  };
  placePhone();
  addEventListener("resize", placePhone);

  const home = scene.querySelector<HTMLElement>(".ios-home");
  const picker = scene.querySelector<HTMLElement>("[data-picker]");
  const pickerRow = scene.querySelector<HTMLElement>("[data-picker-row]");
  const remoteBtn = scene.querySelector<HTMLElement>("[data-remote-btn]");
  const firstCard = scene.querySelector<HTMLElement>("[data-cw-first]");
  const tap = scene.querySelector<HTMLElement>("[data-tap]");
  let timers: number[] = [];

  // Show a touch on a control inside the phone. The indicator lives in the
  // phone's stage, which is scaled, so convert from screen pixels.
  const touch = (target: HTMLElement | null) => {
    const stageEl = tap?.parentElement;
    if (!tap || !target || !stageEl) return;
    const st = stageEl.getBoundingClientRect();
    const r = target.getBoundingClientRect();
    const s = st.width / stageEl.offsetWidth;
    tap.style.left = `${(r.left + r.width / 2 - st.left) / s}px`;
    tap.style.top = `${(r.top + r.height / 2 - st.top) / s}px`;
    tap.classList.remove("is-tapping");
    void tap.offsetWidth;
    tap.classList.add("is-tapping");
  };

  // Playing on the TV: the picture starts, the phone's remote opens on the
  // running episode, and the clock ticks on both.
  const setPlaying = (on: boolean) => {
    playing?.classList.toggle("is-on", on);
    remote?.classList.toggle("is-up", on);
    pp?.classList.toggle("is-paused", !on);
    clearInterval(clock);
    clock = on ? window.setInterval(tick, 1000) : 0;
  };
  const setEngaged = (on: boolean) => home?.classList.toggle("is-engaged", on);

  // Step 2 as it happens in the iOS app: Remote → Living Room → tap the
  // episode in Continue Watching, which plays on the chosen TV.
  const startFromPhone = () => {
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    at(250, () => touch(remoteBtn));
    at(550, () => picker?.classList.add("is-up"));
    at(1350, () => {
      touch(pickerRow);
      pickerRow?.classList.add("is-pressed", "is-connecting");
    });
    at(2050, () => {
      picker?.classList.remove("is-up");
      pickerRow?.classList.remove("is-pressed", "is-connecting");
      setEngaged(true);
    });
    at(2800, () => touch(firstCard));
    at(3100, () => setPlaying(true));
  };
  const cancelSequence = () => {
    timers.forEach(clearTimeout);
    timers = [];
    picker?.classList.remove("is-up");
    pickerRow?.classList.remove("is-pressed", "is-connecting");
  };

  const setStage = (next: number) => {
    if (next === stage) return;
    const prev = stage;
    stage = next;
    steps.forEach((s, i) => s.classList.toggle("is-on", i === next));
    cancelSequence();
    if (next === 1 && prev <= 0 && !reduce) {
      setEngaged(false);
      setPlaying(false);
      startFromPhone();
    } else {
      setEngaged(next >= 1);
      setPlaying(next >= 1);
    }
    phone?.classList.toggle("is-aside", next === 2);
    if (next >= 3) placePhone();
    phone?.classList.toggle("is-landscape", next >= 3);
    tvset?.classList.toggle("is-off", next >= 3);
  };

  // Clicking a step scrolls to its start in the pinned track. Clicking the
  // step already showing moves on to the next one (on phones only the
  // current step is visible, so this is how you advance).
  const goTo = (i: number) => {
    const track = scene.offsetHeight - innerHeight;
    const top = scene.getBoundingClientRect().top + scrollY;
    const n = steps.length;
    const target = i >= n ? top + track + 1 : top + ((i + 0.04) / n) * track;
    scrollTo({ top: Math.round(target), behavior: reduce ? "auto" : "smooth" });
  };
  steps.forEach((s, i) => s.addEventListener("click", () => goTo(i === stage ? i + 1 : i)));

  listeners.push((el, p) => {
    if (el !== scene) return;
    setStage(Math.min(3, Math.floor(p * 4)));
    // Each step's bar fills across its quarter of the scroll.
    steps.forEach((s, i) => s.style.setProperty("--fill", String(clamp(p * 4 - i))));
  });
}

measure();
root.classList.add("motion-ready");
