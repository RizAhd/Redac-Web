// Motion setup: GSAP + ScrollTrigger + SplitText, Lenis smooth scrolling.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isDesktop = () => window.matchMedia('(min-width: 961px)').matches;

// Springy eases close to the Framer springs in the reference templates
export const EASE = {
  out: 'expo.out',
  soft: 'power3.out',
  spring: 'back.out(1.5)',
  bouncy: 'elastic.out(1, 0.65)',
};

let lenis = null;
export function startLenis() {
  if (lenis || reduced()) return lenis;
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
export const getLenis = () => lenis;

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

/**
 * Reveal helpers used inside useGSAP scopes.
 * - [data-split]: headline split into lines, lines rise out of a mask
 * - [data-reveal]: element rises and fades in (batched, staggered)
 * - [data-pop]: element pops in with a spring
 */
export function revealIn(scope) {
  if (reduced()) return;
  const q = gsap.utils.selector(scope);

  q('[data-split]').forEach((el) => {
    const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'sl' });
    gsap.from(split.lines, {
      yPercent: 110, duration: 1.2, ease: EASE.out, stagger: 0.09,
      delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: el.dataset.now !== undefined ? undefined : { trigger: el, start: 'top 88%' },
    });
  });

  const rise = q('[data-reveal]');
  if (rise.length) {
    gsap.set(rise, { y: 48, autoAlpha: 0 });
    ScrollTrigger.batch(rise, {
      start: 'top 90%',
      onEnter: (els) => gsap.to(els, { y: 0, autoAlpha: 1, duration: 1.1, ease: EASE.out, stagger: 0.09, overwrite: true }),
    });
  }

  const pop = q('[data-pop]');
  if (pop.length) {
    gsap.set(pop, { y: 40, scale: 0.9, autoAlpha: 0 });
    ScrollTrigger.batch(pop, {
      start: 'top 92%',
      onEnter: (els) => gsap.to(els, { y: 0, scale: 1, autoAlpha: 1, duration: 1.1, ease: 'back.out(1.3)', stagger: 0.08, overwrite: true }),
    });
  }
}
