/**
 * Shared body-scroll lock for ProjectModal and MobileMenu, both of which can
 * legitimately be open at once (the nav overlay sits on top of a project
 * modal already open underneath it). A naive "read the current value, set
 * hidden, restore on close" in each component would clobber the other's
 * saved value: whichever one closes first would restore overflow to
 * whatever it saw *before either was open*, unlocking scroll while the
 * other is still supposed to be holding it locked. Reference-counting here
 * means only the first lock call captures the pre-lock styles and only the
 * last matching unlock restores them.
 */
let lockCount = 0;
let previousOverflow = "";
let previousPaddingRight = "";

/** Locks body scroll (with scrollbar-width compensation so the layout
 * doesn't shift when the scrollbar disappears) and returns an idempotent
 * unlock function. Call once per effect; call the returned function on
 * cleanup. */
export function lockBodyScroll(): () => void {
  if (lockCount === 0) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    previousOverflow = document.body.style.overflow;
    previousPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
  lockCount++;

  let released = false;
  return function unlock() {
    if (released) return;
    released = true;
    lockCount--;
    if (lockCount === 0) {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    }
  };
}
