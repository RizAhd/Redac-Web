import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, C, CONTACT } from '../lib/data.js';
import { gsap, useGSAP, reduced } from '../lib/motion.js';
import { Btn } from './ui.jsx';
import { Logo } from './Nav.jsx';

export default function Footer() {
  const ref = useRef(null);
  useGSAP(() => {
    if (reduced()) return;
    // floating words drift and the giant wordmark rises as the footer arrives
    gsap.from('.footer__float span', {
      y: 80, autoAlpha: 0, duration: 1.3, ease: 'expo.out', stagger: 0.12,
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    });
    gsap.fromTo('.footer__word', { yPercent: 40 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.footer__word', start: 'top bottom', end: 'bottom bottom', scrub: true },
    });
  }, { scope: ref });

  return (
    <footer className="footer" ref={ref}>
      <div className="footer__float" aria-hidden="true">
        <span>Tax.</span><span>Accounts.</span><span>Advisory.</span>
      </div>
      <p className="footer__word" aria-hidden="true">{C.short}</p>
      <div className="footer__panel">
        <div className="footer__brand">
          <Link to="/" aria-label="Home"><Logo /></Link>
          <p>{C.tagline}.</p>
          <Btn to="/book">Book a consultation</Btn>
        </div>
        <div>
          <h4>Main pages</h4>
          <Link to="/">Home</Link><Link to="/about">About us</Link><Link to="/team">Our team</Link>
          <Link to="/who-we-help">Who we help</Link><Link to="/insights">News and insights</Link><Link to="/contact">Contact us</Link>
        </div>
        <div>
          <h4>Services</h4>
          {SERVICES.slice(0, 6).map((s) => <Link key={s.slug} to={`/services/${s.slug}`}>{s.title}</Link>)}
          <Link to="/services">All services</Link>
        </div>
        <div>
          <h4>Help &amp; legal</h4>
          <Link to="/faq">FAQ</Link><Link to="/book">Book a consultation</Link>
          <Link to="/privacy">Privacy policy</Link><Link to="/terms">Disclaimer and terms</Link><Link to="/credits">Photo credits</Link>
          {CONTACT.email && <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>}
        </div>
      </div>
      <div className="footer__legal"><span>&copy; 2026 {C.name}</span><span>{C.tagline}</span></div>
    </footer>
  );
}
