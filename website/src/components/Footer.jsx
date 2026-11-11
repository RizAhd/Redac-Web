import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, C, CONTACT } from '../lib/data.js';
import { gsap, useGSAP, reduced, SplitText } from '../lib/motion.js';
import { Btn, Icon, Tbc } from './ui.jsx';
import { Logo } from './Nav.jsx';
import { Ticker } from './blocks.jsx';

export default function Footer() {
  const ref = useRef(null);
  useGSAP(() => {
    if (reduced()) return;
    const head = SplitText.create('.footer__head h2', { type: 'lines', mask: 'lines' });
    gsap.from(head.lines, { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } });
    gsap.from('.footer__head [data-f]', { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.3, scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } });
    // the giant wordmark: each letter rises in turn as the page bottom arrives (OneFin)
    gsap.fromTo('.footer__word span', { yPercent: 100 }, {
      yPercent: 0, ease: 'none', stagger: 0.08,
      scrollTrigger: { trigger: '.footer__word', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
    });
  }, { scope: ref });

  return (
    <footer className="footer" ref={ref}>
      <div className="wrap footer__head">
        <div>
          <h2 className="h2">Let&rsquo;s sort out your <span className="accent accent--light">tax and accounts</span></h2>
        </div>
        <div className="footer__actions">
          <div className="btn-row" data-f>
            <Btn to="/book">Book a consultation</Btn>
            <Btn to="/contact" variant="glass" arrow={false}>Send an enquiry</Btn>
          </div>
          <dl className="footer__contact" data-f>
            <div><dt><Icon name="phone" size={16} />Phone</dt><dd>{CONTACT.phone ? <a href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a> : <Tbc label="Phone number" />}</dd></div>
            <div><dt><Icon name="mail" size={16} />Email</dt><dd>{CONTACT.email ? <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> : <Tbc label="Email address" />}</dd></div>
            <div><dt><Icon name="clock" size={16} />Hours</dt><dd>{CONTACT.hours || <Tbc label="Business hours" />}</dd></div>
          </dl>
        </div>
      </div>

      <Ticker items={SERVICES.map((s) => s.title)} light />

      <div className="footer__panel">
        <div className="footer__brand">
          <Link to="/" aria-label="Home"><Logo /></Link>
          <p>{C.tagline}. Returns, statements, books, payroll, advice and company filings from one firm.</p>
        </div>
        <div>
          <h4>Main pages</h4>
          <Link to="/">Home</Link><Link to="/about">About us</Link><Link to="/team">Our team</Link>
          <Link to="/who-we-help">Who we help</Link><Link to="/insights">News and insights</Link><Link to="/contact">Contact us</Link>
        </div>
        <div>
          <h4>Services</h4>
          {SERVICES.map((s) => <Link key={s.slug} to={`/services/${s.slug}`}>{s.title}</Link>)}
        </div>
        <div>
          <h4>Help &amp; legal</h4>
          <Link to="/faq">FAQ</Link><Link to="/book">Book a consultation</Link>
          <Link to="/privacy">Privacy policy</Link><Link to="/terms">Disclaimer and terms</Link><Link to="/credits">Photo credits</Link>
        </div>
      </div>

      <p className="footer__word" aria-hidden="true">{C.short.split('').map((l, i) => <span key={i}>{l}</span>)}</p>

      <div className="footer__legal">
        <span>&copy; {new Date().getFullYear()} {C.name}</span>
        <span>{C.tagline}</span>
      </div>
    </footer>
  );
}
