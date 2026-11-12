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
 * Card rows on phones and tablets (.stk, .fan, .sgrid, .aud, .posts) loop sideways on their own,
 * like a ticker. The cards are repeated once (hidden from screen readers) and every card is moved
 * with the Web Animations API, which runs smoothly on all phone browsers. A finger can drag the
 * row; it carries on looping a moment after release. Returns a cleanup function.
 */
export function autoRows(root = document) {
  const SPEED = 40; // px per second
  const rows = [...root.querySelectorAll('.stk, .fan, .sgrid, .aud, .posts')];
  const stops = [];
  rows.forEach((row) => {
    if (row.scrollWidth <= row.clientWidth + 4) return; // a normal grid at this width
    row.scrollLeft = 0;
    const originals = [...row.children];
    const clones = originals.map((el) => {
      const c = el.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.setAttribute('inert', '');
      c.dataset.clone = '';
      [c, ...c.querySelectorAll('[style]')].forEach((n) => ['transform', 'opacity', 'visibility', 'transition', 'translate'].forEach((p) => n.style.removeProperty(p)));
      row.appendChild(c);
      return c;
    });
    // the reveal on these cards is not needed while they loop: show them now
    gsap.set(originals, { clearProps: 'opacity,visibility,transform,transition' });
    const L = clones[0].offsetLeft - originals[0].offsetLeft;
    const prev = { overflow: row.style.overflowX, touch: row.style.touchAction };
    row.style.overflowX = 'hidden';
    row.style.touchAction = 'pan-y';
    row.classList.add('is-looping');
    const duration = (L / SPEED) * 1000;
    const anims = [...originals, ...clones].map((el) => el.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-' + L + 'px)' }],
      { duration, iterations: Infinity, easing: 'linear' },
    ));
    const setTime = (t) => anims.forEach((a) => { a.currentTime = ((t % duration) + duration) % duration; });
    let drag = null;
    let resume = 0;
    const down = (e) => {
      clearTimeout(resume);
      anims.forEach((a) => a.pause());
      drag = { x: e.clientX, t: anims[0].currentTime || 0, moved: false };
    };
    const move = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      setTime(drag.t - (dx / SPEED) * 1000);
    };
    const up = () => {
      if (!drag) return;
      drag = null;
      resume = setTimeout(() => anims.forEach((a) => a.play()), 1200);
    };
    const click = (e) => { if (row.dataset.dragged) { e.preventDefault(); e.stopPropagation(); } };
    const flag = () => { if (drag && drag.moved) { row.dataset.dragged = '1'; setTimeout(() => delete row.dataset.dragged, 50); } };
    row.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    const release = () => { flag(); up(); };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', up);
    row.addEventListener('click', click, true);
    // pause while off screen to save battery
    const io = new IntersectionObserver(([e]) => { if (!drag) anims.forEach((a) => (e.isIntersecting ? a.play() : a.pause())); });
    io.observe(row);
    stops.push(() => {
      clearTimeout(resume); io.disconnect();
      anims.forEach((a) => a.cancel());
      row.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', up);
      row.removeEventListener('click', click, true);
      clones.forEach((c) => c.remove());
      row.style.overflowX = prev.overflow;
      row.style.touchAction = prev.touch;
      row.classList.remove('is-looping');
    });
  });
  return () => stops.forEach((s) => s());
}
