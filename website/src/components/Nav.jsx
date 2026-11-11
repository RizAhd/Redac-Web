import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SERVICES, C, CONTACT } from '../lib/data.js';
import { gsap, getLenis, reduced } from '../lib/motion.js';
import { Btn, Icon, Photo } from './ui.jsx';

const LINKS = [
  { to: '/services', label: 'Services', menu: 'services' },
  { to: '/about', label: 'About', menu: 'about' },
  { to: '/insights', label: 'Insights' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];
const ABOUT = [
  { to: '/about', label: 'About us', text: 'Who we are and how we work', icon: 'building' },
  { to: '/team', label: 'Our team', text: 'The people behind REDAC', icon: 'handshake' },
  { to: '/who-we-help', label: 'Who we help', text: 'Individuals, businesses, companies', icon: 'team' },
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
  const [open, setOpen] = useState(false);       // mobile sheet
  const [menu, setMenu] = useState(null);        // desktop dropdown: 'services' | 'about' | null
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const sheet = useRef(null);
  const timer = useRef(0);
  const { pathname } = useLocation();

  // close everything on every navigation, and drop focus so nothing stays "open"
  useEffect(() => {
    setOpen(false); setMenu(null);
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
  }, [pathname]);

  useEffect(() => {
    let last = 0;
    const on = () => {
      const y = window.scrollY;
      setHidden(y > 500 && y > last + 2);
      if (y < last - 2) setHidden(false);
      setSolid(y > 40);
      if (Math.abs(y - last) > 30) setMenu(null);
      last = y;
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    document.documentElement.classList.toggle('menu-open', open);
    if (lenis) (open ? lenis.stop() : lenis.start());
    if (open && sheet.current && !reduced()) {
      gsap.fromTo(sheet.current.querySelectorAll('[data-sheet-item]'),
        { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.04, delay: 0.2 });
    }
    const esc = (e) => { if (e.key === 'Escape') { setOpen(false); setMenu(null); } };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  const enter = (m) => { clearTimeout(timer.current); setMenu(m); };
  const leave = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setMenu(null), 160); };
  const close = () => { setOpen(false); setMenu(null); };
  const isActive = (l) => (l.menu === 'services' && pathname.startsWith('/services')) || (l.menu === 'about' && ['/about', '/team', '/who-we-help'].includes(pathname));

  return (
    <>
      <header className={`nav${hidden && !open && !menu ? ' is-hidden' : ''}${solid ? ' is-solid' : ''}`}>
        <div className="nav__pill">
          <Link to="/" className="nav__logo" aria-label={`${C.name} home`} onClick={close}><Logo /></Link>
          <nav aria-label="Main">
            <ul className="nav__links">
              {LINKS.map((l) => (
                <li key={l.to} className={`${l.menu ? 'has-menu' : ''}${menu === l.menu && l.menu ? ' is-open' : ''}`}
                  onMouseEnter={l.menu ? () => enter(l.menu) : undefined} onMouseLeave={l.menu ? leave : undefined}>
                  <NavLink to={l.to} onClick={close} className={({ isActive: a }) => (a || isActive(l) ? 'is-active' : '')}>{l.label}</NavLink>
                  {l.menu && (
                    <button type="button" className="nav__caret" aria-label={`Show ${l.label.toLowerCase()} menu`} aria-expanded={menu === l.menu}
                      onClick={() => setMenu(menu === l.menu ? null : l.menu)}>
                      <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                    </button>
                  )}
                  {l.menu === 'services' && (
                    <div className="mega" onMouseEnter={() => enter('services')}>
                      <div className="mega__grid">
                        {SERVICES.map((s, i) => (
                          <Link key={s.slug} to={`/services/${s.slug}`} className="mega__item" onClick={close} tabIndex={menu === 'services' ? 0 : -1}>
                            <span className="mega__no"><Icon name={s.icon} size={16} /></span>
                            <span><b>{s.title}</b><small>{s.short}</small></span>
                            <span className="mega__idx">{String(i + 1).padStart(2, '0')}</span>
                          </Link>
                        ))}
                      </div>
                      <Link to="/services" className="mega__foot" onClick={close} tabIndex={menu === 'services' ? 0 : -1}>
                        <span className="mega__thumb"><Photo k="svc-business-tax-and-financial-reports" alt="" /></span>
                        <span><b>Not sure which service you need?</b><small>See all eight side by side, or book a short consultation.</small></span>
                        <Icon name="arrow" size={18} />
                      </Link>
                    </div>
                  )}
                  {l.menu === 'about' && (
                    <div className="mega mega--narrow" onMouseEnter={() => enter('about')}>
                      {ABOUT.map((a) => (
                        <Link key={a.to} to={a.to} className="mega__item" onClick={close} tabIndex={menu === 'about' ? 0 : -1}>
                          <span className="mega__no"><Icon name={a.icon} size={16} /></span>
                          <span><b>{a.label}</b><small>{a.text}</small></span>
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <Btn to="/book" className="nav__cta" onClick={close}>Book a consultation</Btn>
        <button className={`burger${open ? ' is-open' : ''}`} type="button" aria-expanded={open} aria-controls="sheet" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
          <span /><span />
        </button>
      </header>
      {menu && <div className="nav__veil" aria-hidden="true" onClick={() => setMenu(null)} />}

      <div id="sheet" className={`sheet${open ? ' is-open' : ''}`} ref={sheet} aria-hidden={!open} inert={!open}>
        <div className="sheet__inner">
          <nav aria-label="Mobile">
            {[{ to: '/', label: 'Home' }, { to: '/services', label: 'Services' }, ...ABOUT, { to: '/insights', label: 'Insights' }, { to: '/faq', label: 'FAQ' }, { to: '/contact', label: 'Contact' }].map((l) => (
              <div className="sheet__row" key={l.to + l.label}>
                <Link data-sheet-item to={l.to} onClick={close} className={pathname === l.to ? 'is-here' : ''}>{l.label}<Icon name="arrow" size={22} /></Link>
              </div>
            ))}
          </nav>
          <div className="sheet__svc" data-sheet-item>
            <p>Services</p>
            <ul>{SERVICES.map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`} onClick={close}>{s.title}</Link></li>)}</ul>
          </div>
          <div className="sheet__foot" data-sheet-item>
            <Btn to="/book" variant="white" onClick={close}>Book a consultation</Btn>
            {CONTACT.email && <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>}
          </div>
        </div>
      </div>
    </>
  );
}
