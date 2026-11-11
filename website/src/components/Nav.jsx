import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SERVICES, C } from '../lib/data.js';
import { gsap, getLenis } from '../lib/motion.js';
import { Btn, Icon } from './ui.jsx';

const LINKS = [
  { to: '/services', label: 'Services', menu: 'services' },
  { to: '/about', label: 'About', menu: 'about' },
  { to: '/insights', label: 'Insights' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];
const ABOUT = [
  { to: '/about', label: 'About us', text: 'Who we are and how we work' },
  { to: '/team', label: 'Our team', text: 'The people behind REDAC' },
  { to: '/who-we-help', label: 'Who we help', text: 'Individuals, businesses, companies' },
];

export function Logo() {
  return (
    <span className="logo">
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" /><path d="M11 23V9h6.2a4.3 4.3 0 0 1 0 8.6H11m6 0 4.8 5.4" /></svg>
      </span>
      <span className="logo__name">{C.short}<em> &amp; Associates</em></span>
    </span>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const sheet = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let last = 0;
    const on = () => {
      const y = window.scrollY;
      setHidden(y > 500 && y > last);
      setSolid(y > 40);
      last = y;
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    document.body.style.overflow = open ? 'hidden' : '';
    if (lenis) open ? lenis.stop() : lenis.start();
    if (open && sheet.current) {
      gsap.fromTo(sheet.current.querySelectorAll('[data-sheet-item]'),
        { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.15 });
    }
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  return (
    <>
      <header className={`nav${hidden && !open ? ' is-hidden' : ''}${solid ? ' is-solid' : ''}`}>
        <div className="nav__pill">
          <Link to="/" className="nav__logo" aria-label={`${C.name} home`}><Logo /></Link>
          <nav aria-label="Main">
            <ul className="nav__links">
              {LINKS.map((l) => (
                <li key={l.to} className={l.menu ? 'has-menu' : ''}>
                  <NavLink to={l.to} className={({ isActive }) => (isActive || (l.menu === 'services' && pathname.startsWith('/services')) || (l.menu === 'about' && ['/team', '/who-we-help'].includes(pathname)) ? 'is-active' : '')}>
                    {l.label}
                    {l.menu && <svg className="chev" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>}
                  </NavLink>
                  {l.menu === 'services' && (
                    <div className="mega">
                      <div className="mega__grid">
                        {SERVICES.map((s, i) => (
                          <Link key={s.slug} to={`/services/${s.slug}`} className="mega__item">
                            <span className="mega__no">{String(i + 1).padStart(2, '0')}</span>
                            <span><b>{s.title}</b><small>{s.short}</small></span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {l.menu === 'about' && (
                    <div className="mega mega--narrow">
                      {ABOUT.map((a) => (
                        <Link key={a.to} to={a.to} className="mega__item"><span><b>{a.label}</b><small>{a.text}</small></span></Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <Btn to="/book" className="nav__cta">Book a consultation</Btn>
        <button className={`burger${open ? ' is-open' : ''}`} type="button" aria-expanded={open} aria-controls="sheet" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </header>

      <div id="sheet" className={`sheet${open ? ' is-open' : ''}`} ref={sheet} aria-hidden={!open}>
        <div className="sheet__inner">
          {[{ to: '/', label: 'Home' }, ...LINKS, { to: '/team', label: 'Our team' }, { to: '/who-we-help', label: 'Who we help' }].map((l) => (
            <div className="sheet__row" key={l.to + l.label}><Link data-sheet-item to={l.to} tabIndex={open ? 0 : -1}>{l.label}<Icon name="arrow" size={22} /></Link></div>
          ))}
          <div className="sheet__row"><div data-sheet-item><Btn to="/book" tabIndex={open ? 0 : -1}>Book a consultation</Btn></div></div>
        </div>
      </div>
    </>
  );
}
