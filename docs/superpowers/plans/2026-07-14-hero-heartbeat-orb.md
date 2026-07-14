# Hero Heartbeat Orb Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a visibility-aware orange heartbeat circle to the home hero without moving or resizing any content.

**Architecture:** A decorative element inside `.editorial-hero` supplies the solid orb and a pseudo-element supplies its halo. Native CSS runs the `4.8s` double heartbeat, while a focused `IntersectionObserver` and `visibilitychange` handler toggle a single active class so the animation pauses offscreen or in a hidden tab.

**Tech Stack:** Semantic HTML, native CSS animations, progressive vanilla JavaScript, Node.js `node:test`.

## Global Constraints

- Use the existing `--signal` orange; introduce no new accent color.
- Animate only `transform` and `opacity`; do not animate font metrics, layout properties, or `box-shadow`.
- Hide the decorative orb below the existing `760px` breakpoint.
- Keep it static under `prefers-reduced-motion: reduce`.
- Do not change hero copy, line wrapping, CTA, navigation, or grid dimensions.
- Add no dependency, canvas, SVG, GSAP, or global scroll listener.
- Keep `motion-options-preview.html` and `motion-background-options-preview.html` outside every commit.

---

### Task 1: Add the visibility-aware heartbeat orb

**Files:**
- Modify: `tests/portfolio.test.mjs`
- Modify: `index.html:53-58`
- Modify: `styles.css:207-258`
- Modify: `styles.css:909-928`
- Modify: `styles.css:1047-1069`
- Modify: `styles.css:1071-1210`
- Modify: `styles.css:1212-1229`
- Modify: `script.js:30-66`

**Interfaces:**
- Consumes: `.editorial-hero`, `--signal`, the existing `.js` progressive-enhancement class, `IntersectionObserver`, and `document.hidden`.
- Produces: `[data-hero-orb]`, `.hero-heartbeat-orb`, `.is-ambient-active`, `@keyframes hero-heartbeat`, and `@keyframes hero-heartbeat-halo`.

- [ ] **Step 1: Write the failing contract test**

Add this test after `wide and tall desktops use the balanced editorial hero` in `tests/portfolio.test.mjs`:

```js
test("hero exposes a visibility-aware heartbeat orb", () => {
  const html = read("index.html");
  const css = read("styles.css");
  const javascript = read("script.js");

  assert.match(
    html,
    /class="hero-heartbeat-orb"[^>]*data-hero-orb[^>]*aria-hidden="true"/,
  );
  assert.match(css, /@keyframes\s+hero-heartbeat\s*\{/);
  assert.match(css, /animation:\s*hero-heartbeat 4\.8s/);
  assert.match(
    css,
    /\.hero-heartbeat-orb\.is-ambient-active[\s\S]*animation-play-state:\s*running/,
  );
  assert.match(
    css,
    /@media\s*\(max-width:\s*760px\)[\s\S]*\.hero-heartbeat-orb\s*\{[\s\S]*display:\s*none/,
  );
  assert.match(
    css,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.hero-heartbeat-orb[\s\S]*animation:\s*none/,
  );
  assert.match(javascript, /querySelector\("\[data-hero-orb\]"\)/);
  assert.match(javascript, /classList\.toggle\("is-ambient-active"/);
  assert.match(javascript, /visibilitychange/);
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```powershell
node --test --test-name-pattern="heartbeat orb" tests\portfolio.test.mjs
```

Expected: FAIL because `index.html` does not contain `.hero-heartbeat-orb`.

- [ ] **Step 3: Add the decorative markup**

Insert the orb as the first child of the home hero in `index.html`:

```html
<section class="editorial-hero" id="inicio" data-section>
  <span class="hero-heartbeat-orb" data-hero-orb aria-hidden="true"></span>
  <div class="hero-header" data-reveal>
```

- [ ] **Step 4: Add the base positioning and heartbeat CSS**

Extend `.editorial-hero` and add the orb rules immediately after it in `styles.css`:

```css
.editorial-hero {
  position: relative;
  display: flex;
  min-height: calc(100dvh - 68px);
  overflow: clip;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(36px, 6vw, 76px) 0 clamp(54px, 7vw, 92px);
  isolation: isolate;
}

.editorial-hero > :not(.hero-heartbeat-orb) {
  position: relative;
  z-index: 1;
}

.hero-heartbeat-orb {
  position: absolute;
  top: 50%;
  left: 62%;
  z-index: 0;
  width: clamp(130px, 8vw, 230px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--signal);
  opacity: 0.78;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(1);
  animation: hero-heartbeat 4.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-play-state: paused;
  isolation: isolate;
  will-change: transform, opacity;
}

.hero-heartbeat-orb::before {
  content: "";
  position: absolute;
  inset: -55%;
  z-index: -1;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 113, 66, 0.42) 0,
    rgba(255, 113, 66, 0.16) 34%,
    transparent 70%
  );
  opacity: 0.38;
  transform: scale(0.92);
  animation: hero-heartbeat-halo 4.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-play-state: paused;
  will-change: transform, opacity;
}

.hero-heartbeat-orb.is-ambient-active,
.hero-heartbeat-orb.is-ambient-active::before {
  animation-play-state: running;
}

@keyframes hero-heartbeat {
  0%,
  8%,
  16%,
  100% {
    opacity: 0.78;
    transform: translate(-50%, -50%) scale(1);
  }

  4% {
    opacity: 0.98;
    transform: translate(-50%, -50%) scale(1.08);
  }

  12% {
    opacity: 0.9;
    transform: translate(-50%, -50%) scale(1.04);
  }
}

@keyframes hero-heartbeat-halo {
  0%,
  8%,
  16%,
  100% {
    opacity: 0.38;
    transform: scale(0.92);
  }

  4% {
    opacity: 0.62;
    transform: scale(1.08);
  }

  12% {
    opacity: 0.5;
    transform: scale(1);
  }
}
```

- [ ] **Step 5: Add responsive placement and reduced-motion behavior**

Add the following declarations inside the existing media queries:

```css
@media (max-width: 980px) {
  .hero-heartbeat-orb {
    top: 42%;
    left: 78%;
    width: clamp(110px, 15vw, 150px);
  }
}

@media (min-width: 1440px) and (min-height: 900px) {
  .hero-heartbeat-orb {
    top: 50%;
    left: 64%;
    width: clamp(170px, 8vw, 260px);
  }
}

@media (max-width: 760px) {
  .hero-heartbeat-orb {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-heartbeat-orb,
  .hero-heartbeat-orb::before {
    animation: none;
  }
}
```

- [ ] **Step 6: Add visibility-aware animation control**

Insert this block after the section-navigation observer and before the reveal observer in `script.js`:

```js
const heroOrb = document.querySelector("[data-hero-orb]");
const heroSection = heroOrb?.closest(".editorial-hero");

if (heroOrb && heroSection) {
  let heroVisible = true;

  const syncHeroOrb = () => {
    heroOrb.classList.toggle(
      "is-ambient-active",
      heroVisible && !document.hidden,
    );
  };

  syncHeroOrb();

  if ("IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        syncHeroOrb();
      },
      { threshold: 0.15 },
    );

    heroObserver.observe(heroSection);
  }

  document.addEventListener("visibilitychange", syncHeroOrb);
}
```

- [ ] **Step 7: Run the focused test and confirm GREEN**

Run:

```powershell
node --test --test-name-pattern="heartbeat orb" tests\portfolio.test.mjs
```

Expected: 1 test passes and the remaining tests are skipped by the name filter.

- [ ] **Step 8: Run the full regression suite**

Run:

```powershell
node --test tests\portfolio.test.mjs
```

Expected: all tests pass with zero failures.

- [ ] **Step 9: Verify local behavior and responsive geometry**

Open `http://127.0.0.1:4173/` and verify:

- at `3840x2160`, the orb sits in the negative space between headline and aside;
- at `1440x900`, it does not cover the CTA or reduce headline contrast;
- after scrolling beyond the hero, DevTools shows the animation play state paused;
- at `390px`, the orb is hidden and no horizontal overflow appears;
- with reduced motion enabled, the orb is visible but static.

- [ ] **Step 10: Check the intended diff and commit**

Run:

```powershell
git diff --check
git status --short
```

Stage only the implementation files and commit:

```powershell
git add index.html styles.css script.js tests/portfolio.test.mjs docs/superpowers/plans/2026-07-14-hero-heartbeat-orb.md
git commit -m "feat: add ambient heartbeat orb"
```

Expected: the commit excludes `.codex-remote-attachments/`, `landing-mock.*`, and both `motion-*-preview.html` files.
