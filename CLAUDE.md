@AGENTS.md

# Skills grid / cursor field

`lib/skills.ts` is the single source of truth for the technical-skills list
and its icons (CDN `simpleicons.org` URLs, plus a few original inline SVGs for
tools with no official mark — see `ORIGINAL_ICONS` in `CursorField.tsx`).
`components/SkillsMatrix.tsx` renders the grid; `components/CursorField.tsx`
renders the floating icon layer.

Architecture, current as of the last session's work:

- Each icon is **one** React element, never two. It lives either in the fixed
  floating layer or portalled into its grid slot (`SkillCell` in
  `SkillsMatrix.tsx` renders a deliberately empty `<div id="skill-slot-{id}">`
  — no `<img>` of its own). Both locations share a Framer Motion `layoutId`,
  so the shared-layout engine handles the position/size morph between them.
  Earlier versions tried keeping a real `<img>` in the grid slot and fading
  it in/out in sync with the floating copy; that always drifted out of sync
  under continuous scroll and produced a visible "twin icon" glitch. Don't
  reintroduce a second element per icon.
- Docking is **hover-driven**, not scroll-driven: a `useAnimationFrame` loop
  compares live cursor position against `#stack`'s (the skills section)
  bounding rect every frame. Modes: `idle` (pointer off-page), `swarm`
  (pointer on page, outside the skills section — icons cluster loosely near
  the cursor with a randomized, slow-changing offset), `docked` (pointer
  inside `#stack` — icons fly home to their grid slots), `resting` (page has
  scrolled to `#notes` or beyond — swarm is suspended outright regardless of
  pointer position, icons sit dim and static, fading to fully invisible by
  the time `#site-footer` is in view).
- Mode changes go through hysteresis + a ~140ms debounce
  (`MODE_DEBOUNCE_MS`, `UNDOCK_MARGIN`, `QUIET_ZONE_ENTER`/`EXIT` in
  `CursorField.tsx`). Without this, real mouse movement (or scrolling a
  section boundary past a stationary cursor) flickers the mode every frame
  and restarts the dock/undock animation mid-flight. If you touch this logic,
  test with an actual continuous scroll/mouse gesture, not just a single
  jump-and-hold — that's what hid the original bug for several review passes.
- The footer fade-to-zero is computed from the footer's own measured height,
  not a fixed viewport-height fraction — the footer is the last element on
  the page, so its `top` can never scroll past `(viewport height − footer
  height)`, and a fixed fraction below that can leave the fade permanently
  stuck above zero on short viewports/footers.
- Reduced-motion / coarse-pointer visitors never get the floating field at
  all (`CursorField` returns early). Their fallback is pure CSS: the grid's
  `<img>` (normally `display:none` via `.skill-slot-fallback` in
  `app/globals.css`) is revealed by the same media queries that disable the
  field, so it works even with JS disabled.

Section order on the page is Hero → Projects → **Skills** → Philosophy →
Track Record → Notes → Contact → Footer (Skills and Philosophy were swapped
from their original order; `components/Nav.tsx` and each section's
`SectionLabel` number were updated to match — keep those in sync if the order
changes again).
