# Hero Heartbeat Orb Design

**Date:** 2026-07-14

## Objective

Add a subtle ambient motion layer to the home hero so the page feels alive on large desktop displays without animating the headline or changing its layout.

## Chosen Direction

The selected treatment is a solid orange circle placed behind the hero content. The circle performs a restrained double heartbeat and remains still between pulses.

This replaces the rejected typography treatments. No letters, words, CTA elements, or grid columns move or resize.

## Visual Behavior

- Use the existing `--signal` orange as the only accent color.
- Render one solid circle with a soft orange halo.
- Run a double heartbeat every `4.8s`:
  - first pulse scales from `1` to approximately `1.08`;
  - second pulse scales to approximately `1.04`;
  - the circle returns to its base state for the remainder of the cycle.
- Vary opacity and halo intensity slightly during the pulses.
- Animate only compositor-friendly properties: `transform` and `opacity`. Build the halo as a pseudo-element so its pulse does not animate `box-shadow`.
- The animation must be clearly visible on a 4K display while remaining secondary to the headline.

## Placement and Layering

- Place the circle inside `.editorial-hero` as a decorative, `aria-hidden` element.
- Position it in the hero's negative space, behind the content and away from the CTA.
- Keep the headline, aside, and navigation above the circle through explicit stacking.
- Do not let the circle change the dimensions of the hero or participate in the grid.
- Prevent horizontal overflow at every breakpoint.

## Responsive Behavior

- Scale the circle responsively with `clamp()` so it grows on wide and 4K displays.
- Use a smaller circle and adjusted position on tablet widths.
- Hide the circle below the existing `760px` breakpoint so it cannot compete with the mobile headline.

## Motion Lifecycle and Accessibility

- Run the heartbeat only while the hero is visible.
- Pause it when the page is hidden or the user has scrolled beyond the hero.
- Reuse `IntersectionObserver`; do not add a global scroll listener.
- Under `prefers-reduced-motion: reduce`, keep the circle static and remove the heartbeat.
- The element is decorative and must not be announced by assistive technology.

## Implementation Boundaries

- Modify only `index.html`, `styles.css`, `script.js`, and the focused portfolio test file.
- Use native HTML, CSS, and the existing progressive JavaScript approach.
- Do not add GSAP, animation libraries, canvas, SVG, or new dependencies.
- Do not change the hero copy, its line wrapping rules, CTA, navigation, or responsive grid.
- Do not include the local motion comparison pages in the implementation commit.

## Verification

Automated checks must confirm:

- the decorative orb exists and is hidden from assistive technology;
- the heartbeat uses the approved `4.8s` cadence;
- the active state is controlled without a scroll listener;
- reduced motion disables the animation;
- all existing portfolio tests remain green.

Visual checks must cover:

- large desktop and 4K proportions;
- desktop entry, pulse, rest, and pause behavior;
- no overlap with headline or CTA;
- no horizontal overflow;
- tablet and `390px` mobile behavior;
- the static reduced-motion state.

## Acceptance Criteria

The feature is accepted when the hero feels visibly alive during a full heartbeat cycle, the circle remains a background accent, and no content moves, reflows, or loses readability.
