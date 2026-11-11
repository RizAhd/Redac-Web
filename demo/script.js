// REDAC & Associates demo — interactions (vanilla JS, no dependencies)
document.documentElement.classList.add('js');

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  io.observe(el);
});

// Statement: words light up as the paragraph scrolls through the screen
const st = document.querySelector('[data-words]');
if (st) {
  st.innerHTML = st.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span> `).join('');
  const words = [...st.querySelectorAll('.w')];
  const paint = () => {
    const r = st.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.4)));
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  };
  window.addEventListener('scroll', paint, { passive: true });
  paint();
}

// Who we help: the stacked cards fan out when the section comes into view
const fan = document.querySelector('[data-fan]');
if (fan) {
  new IntersectionObserver(([e]) => fan.classList.toggle('is-open', e.isIntersecting), { threshold: 0.45 }).observe(fan);
}

// Active nav pill follows the section on screen
const links = [...document.querySelectorAll('.nav__pill a')];
const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' }).observe && sections.forEach((s) => {
  new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + s.id));
  }), { rootMargin: '-45% 0px -50% 0px' }).observe(s);
});

// Mobile menu
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('mobile-menu');
const setMenu = (open) => {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
};
toggle.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

// Booking form: simple validation; the real send is wired to the client's form service later
const form = document.querySelector('.form');
if (form) {
  form.addEventListener('submit', (e) => {
    let firstBad = null;
    form.querySelectorAll('[required]').forEach((f) => {
      const err = f.parentElement.querySelector('.err');
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.setAttribute('aria-invalid', String(bad));
      if (err) err.hidden = !bad;
      if (bad && !firstBad) firstBad = f;
    });
    if (firstBad) { e.preventDefault(); firstBad.focus(); }
  });
}
