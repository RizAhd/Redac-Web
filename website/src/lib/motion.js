// Motion setup: GSAP + ScrollTrigger + SplitText, Lenis smooth scrolling.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText, useGSAP };

// Animations always run. reduced() is kept so components have one place to check.
export const reduced = () => false;
export const isDesktop = () => window.matchMedia('(min-width: 961px)').matches;

export const EASE = { out: 'expo.out', soft: 'power3.out', spring: 'back.out(1.5)' };

let lenis = null;
export function startLenis() {
  if (lenis || reduced()) return lenis;
  lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
export const getLenis = () => lenis;

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

/**
 * Reveal helpers used inside useGSAP scopes. Every element stays visible if JS fails,
 * because the hidden state is only set here, right before its trigger is created.
 * - [data-split]   headline lines rise out of a mask (data-now: on load, not on scroll)
 * - [data-words]   words fade up one after another
 * - [data-reveal]  element rises and fades in (batched, staggered)
 * - [data-pop]     element pops in with a soft spring
 * - [data-stagger] direct children rise in one after another
 * - [data-img]     photo frame opens from a rounded inset, photo settles from a zoom
 * - [data-line]    a line draws from the left
 * - [data-count]   number counts up from zero (keeps leading zeros and suffix)
 * - [data-parallax="12"] element drifts on scroll by that many percent
 */
export function revealIn(scope) {
  if (reduced() || !scope) return;
  const q = gsap.utils.selector(scope);
  const onScroll = (el, start = 'top 88%') => (el.dataset.now !== undefined ? undefined : { trigger: el, start, once: true });

  q('[data-split]').forEach((el) => {
    const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'sl' });
    gsap.from(split.lines, { yPercent: 110, duration: 1.2, ease: EASE.out, stagger: 0.09, delay: parseFloat(el.dataset.delay || 0), scrollTrigger: onScroll(el) });
  });

  q('[data-words]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words' });
    gsap.from(split.words, { y: 18, autoAlpha: 0, duration: 0.9, ease: EASE.soft, stagger: 0.025, delay: parseFloat(el.dataset.delay || 0), scrollTrigger: onScroll(el, 'top 90%') });
  });

  const rise = q('[data-reveal]');
  if (rise.length) {
    gsap.set(rise, { y: 48, autoAlpha: 0, transition: 'none' });
    ScrollTrigger.batch(rise, {
      start: 'top 92%', once: true,
      onEnter: (els) => gsap.to(els, { y: 0, autoAlpha: 1, duration: 1.1, ease: EASE.out, stagger: 0.09, overwrite: true, clearProps: 'transform,transition' }),
    });
  }

  const pop = q('[data-pop]');
  if (pop.length) {
    gsap.set(pop, { y: 50, scale: 0.92, autoAlpha: 0, transition: 'none' });
    ScrollTrigger.batch(pop, {
      start: 'top 94%', once: true,
      onEnter: (els) => gsap.to(els, { y: 0, scale: 1, autoAlpha: 1, duration: 1.1, ease: 'back.out(1.2)', stagger: 0.08, overwrite: true, clearProps: 'transform,transition' }),
    });
  }

  q('[data-stagger]').forEach((el) => {
    // transitions are paused while the stagger runs, so a card's own hover transition cannot leave it offset
    const kids = [...el.children];
    gsap.fromTo(kids, { y: 36, autoAlpha: 0, transition: 'none' }, { y: 0, autoAlpha: 1, duration: 1, ease: EASE.out, stagger: 0.07, scrollTrigger: onScroll(el, 'top 90%'), clearProps: 'transform,transition' });
  });

  q('[data-img]').forEach((el) => {
    const img = el.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: onScroll(el, 'top 90%'), delay: el.dataset.now !== undefined ? 0.2 : 0 });
    tl.from(el, { clipPath: 'inset(14% 10% 14% 10% round 40px)', duration: 1.5, ease: 'expo.inOut' });
    if (img) tl.from(img, { scale: 1.3, duration: 1.8, ease: 'expo.out' }, 0.1);
  });

  q('[data-line]').forEach((el) => {
    gsap.from(el, { scaleX: 0, transformOrigin: '0 50%', duration: 1.4, ease: 'expo.inOut', scrollTrigger: onScroll(el, 'top 92%') });
  });

  q('[data-count]').forEach((el) => {
    const raw = el.dataset.count;
    const end = parseFloat(raw);
    const pad = raw.length;
    const obj = { v: 0 };
    el.textContent = '0'.padStart(pad, '0');
    gsap.to(obj, {
      v: end, duration: 1.8, ease: 'power2.out', scrollTrigger: onScroll(el, 'top 90%'),
      onUpdate: () => { el.textContent = String(Math.round(obj.v)).padStart(pad, '0'); },
    });
  });

  q('[data-parallax]').forEach((el) => {
    gsap.fromTo(el, { yPercent: -parseFloat(el.dataset.parallax || 10) }, {
      yPercent: parseFloat(el.dataset.parallax || 10), ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/**
 * Card rows that scroll sideways on phones and tablets (.stk, .fan, .sgrid, .aud, .posts)
 * drift continuously and seamlessly, like a ticker: the cards are repeated once (hidden from
 * screen readers) and the row wraps when it reaches the copy. Touching or swiping pauses it,
 * then it carries on from where the visitor left it. Runs only while the row is on screen.
 */
export function autoRows(root = document) {
  const rows = [...root.querySelectorAll('.stk, .fan, .sgrid, .aud, .posts')];
  const stops = [];
  rows.forEach((row) => {
    if (row.scrollWidth <= row.clientWidth + 4) return; // not a sideways row at this width
    const originals = [...row.children];
    const clones = originals.map((el) => {
      const c = el.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.setAttribute('inert', '');
      c.dataset.clone = '';
      // copies start clean: never carry a half-finished reveal
      [c, ...c.querySelectorAll('[style]')].forEach((n) => { n.style.removeProperty('transform'); n.style.removeProperty('opacity'); n.style.removeProperty('visibility'); n.style.removeProperty('transition'); n.style.removeProperty('translate'); });
      row.appendChild(c);
      return c;
    });
    const snap = row.style.scrollSnapType;
    row.style.scrollSnapType = 'none';
    const loop = () => clones[0].offsetLeft - originals[0].offsetLeft;
    let pos = row.scrollLeft;
    let held = 0;
    let visible = false;
    let last = performance.now();
    let raf = 0;
    const hold = () => { held = performance.now(); };
    const onScroll = () => { if (performance.now() - held < 2500) pos = row.scrollLeft; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.2 });
    io.observe(row);
    row.addEventListener('pointerdown', hold, { passive: true });
    row.addEventListener('touchstart', hold, { passive: true });
    row.addEventListener('touchmove', hold, { passive: true });
    row.addEventListener('wheel', hold, { passive: true });
    row.addEventListener('scroll', onScroll, { passive: true });
    const frame = (now) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (visible && now - held > 2500) {
        pos += dt * 0.045; // about 45px a second: calm, readable drift
        const L = loop();
        if (pos >= L) pos -= L;
        if (pos < 0) pos += L;
        row.scrollLeft = pos;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    stops.push(() => {
      cancelAnimationFrame(raf); io.disconnect();
      ['pointerdown', 'touchstart', 'touchmove', 'wheel'].forEach((t) => row.removeEventListener(t, hold));
      row.removeEventListener('scroll', onScroll);
      clones.forEach((c) => c.remove());
      row.style.scrollSnapType = snap;
    });
  });
  return () => stops.forEach((s) => s());
}
