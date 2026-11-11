import { useRef } from 'react';
import { gsap, useGSAP, revealIn, reduced } from '../lib/motion.js';
import { Btn } from '../components/ui.jsx';

export function Center({ children, tick = false }) {
  const ref = useRef(null);
  useGSAP(() => {
    revealIn(ref.current);
    if (reduced() || !tick) return;
    gsap.from('.done__tick', { scale: 0, rotate: -90, duration: 1.4, ease: 'elastic.out(1, 0.5)' });
    gsap.fromTo('.done__tick path', { strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: 0.8, delay: 0.5, ease: 'power2.out' });
  }, { scope: ref });
  return (
    <section className="done" ref={ref}>
      {tick && <div className="done__tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></div>}
      {children}
    </section>
  );
}

export default function ThankYou() {
  return (
    <Center tick>
      <h1 className="h1" data-split data-now>Thank you, <span className="accent accent--light">we got it</span></h1>
      <p className="lead" data-reveal>Your enquiry has been received. We will reply by email to confirm the next steps.</p>
      <div className="btn-row btn-row--center" data-reveal><Btn to="/" variant="white">Back to home</Btn><Btn to="/services" variant="glass" arrow={false}>Explore services</Btn></div>
    </Center>
  );
}
