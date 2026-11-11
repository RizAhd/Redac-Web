import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SERVICES, INTEGRATIONS, POSTS } from '../lib/data.js';
import { gsap, useGSAP, ScrollTrigger, revealIn, reduced, isDesktop } from '../lib/motion.js';
import { Btn, Icon, Photo, Eyebrow } from './ui.jsx';

/* Hook: run the standard reveals for everything inside a page */
export function usePageReveal(ref) {
  useGSAP(() => { revealIn(ref.current); }, { scope: ref });
}

/* ---------------------------------------------------------------- page hero */
export function PageHero({ crumbs = [], title, accent, lead, photoKey, ghost, children }) {
  const ref = useRef(null);
  useGSAP(() => {
    if (reduced()) return;
    revealIn(ref.current);
    gsap.from('.phero__photo', { clipPath: 'inset(18% 18% 18% 18% round 32px)', scale: 1.08, duration: 1.6, ease: 'expo.out', delay: 0.15 });
    gsap.to('.phero__photo img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.phero__ghost', { xPercent: -12, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } });
  }, { scope: ref });
  return (
    <section className={`phero${photoKey ? ' phero--photo' : ''}`} ref={ref}>
      {ghost && <p className="phero__ghost" aria-hidden="true">{ghost}</p>}
      <div className="wrap phero__grid">
        <div className="phero__text">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            {crumbs.map((c) => (c.to ? <Link key={c.label} to={c.to}>{c.label}</Link> : <span key={c.label}>{c.label}</span>))}
          </nav>
          <h1 className="h1" data-split data-now>{title} {accent && <span className="accent">{accent}</span>}</h1>
          {lead && <p className="lead" data-reveal>{lead}</p>}
          {children}
        </div>
        {photoKey && <div className="phero__photo"><Photo k={photoKey} alt="" eager /></div>}
      </div>
    </section>
  );
}

/* ---------------------------------------------------- Kora-style stacking service cards */
export function ServiceStack({ items = SERVICES }) {
  const ref = useRef(null);
  useGSAP(() => {
    if (reduced() || !isDesktop()) return;
    const cards = gsap.utils.toArray('.stk__card', ref.current);
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      // as the next card slides over, this one shrinks back and dims
      gsap.to(card.querySelector('.stk__inner'), {
        scale: 0.94, opacity: 0.55, ease: 'none',
        scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 110px', scrub: true },
      });
    });
    cards.forEach((card) => {
      gsap.fromTo(card.querySelector('.stk__photo img'), { scale: 1.25 }, {
        scale: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 110px', scrub: true },
      });
    });
  }, { scope: ref });
  return (
    <div className="stk" ref={ref}>
      {items.map((s) => {
        const n = SERVICES.indexOf(s) + 1;
        return (
          <article className="stk__card" key={s.slug}>
            <div className="stk__inner">
              <div className="stk__text">
                <div className="stk__top">
                  <span className="chip"><Icon name={s.icon} size={16} />{s.tags[0]}</span>
                  <span className="stk__no">{String(n).padStart(2, '0')}</span>
                </div>
                <h3 className="stk__title">{s.title}</h3>
                <p className="stk__desc">{s.intro}</p>
                <div className="stk__offer">
                  <p>What we offer</p>
                  <ul className="chips">{s.includes.slice(0, 4).map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
                <Link className="stk__bar" to={`/services/${s.slug}`}>View service <Icon name="arrow" size={18} /></Link>
              </div>
              <div className="stk__photo"><Photo k={`svc-${s.slug}`} alt={s.title} /></div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------- compact service grid */
export function ServiceGrid({ items = SERVICES, dark = false }) {
  return (
    <div className={`sgrid${dark ? ' sgrid--dark' : ''}`}>
      {items.map((s) => {
        const n = SERVICES.indexOf(s) + 1;
        return (
          <Link className="sgrid__card" key={s.slug} to={`/services/${s.slug}`} data-reveal>
            <div className="sgrid__img"><Photo k={`svc-${s.slug}`} alt="" /></div>
            <div className="sgrid__body">
              <span className="sgrid__no">{String(n).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.short}</p>
              <span className="sgrid__go">View service <Icon name="arrow" size={16} /></span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------- FAQ */
export function FaqList({ items, dark = false }) {
  const [openIdx, setOpen] = useState(0);
  const ref = useRef(null);
  const { contextSafe } = useGSAP({ scope: ref });
  const toggle = contextSafe((i) => {
    const next = openIdx === i ? -1 : i;
    const panels = ref.current.querySelectorAll('.qa__a');
    panels.forEach((p, j) => {
      const target = j === next ? p.scrollHeight : 0;
      gsap.to(p, { height: target, duration: 0.6, ease: 'expo.out' });
    });
    setOpen(next);
  });
  return (
    <div className={`qa-list${dark ? ' qa-list--dark' : ''}`} ref={ref}>
      {items.map((f, i) => (
        <div className={`qa${openIdx === i ? ' is-open' : ''}`} key={f.q} data-reveal>
          <button className="qa__q" type="button" aria-expanded={openIdx === i} onClick={() => toggle(i)}>
            <span>{f.q}</span><i aria-hidden="true"><Icon name="plus" size={16} /></i>
          </button>
          <div className="qa__a" style={{ height: i === 0 ? 'auto' : 0 }}><p>{f.a}</p></div>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- CTA band */
export function CtaBand({ title = 'Ready to talk', accent = 'numbers?', text = 'Book a consultation and tell us what you need. We take it from there.', photoKey = 'cta' }) {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="cta" data-reveal>
          <div className="cta__text">
            <Eyebrow light>Get started</Eyebrow>
            <h2 className="h2">{title} <span className="accent accent--light">{accent}</span></h2>
            <p className="lead">{text}</p>
            <Btn to="/book" variant="white">Book a consultation</Btn>
          </div>
          <div className="cta__photo"><Photo k={photoKey} alt="" /></div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- article cards */
export function PostCards({ items = POSTS }) {
  return (
    <div className="posts">
      {items.map((p) => (
        <Link className="post" key={p.slug} to={`/insights/${p.slug}`} data-reveal>
          <div className="post__img"><Photo k={`post-${p.slug}`} alt="" /></div>
          <div className="post__body">
            <span className="post__tag">{p.tag}</span>
            <h3>{p.title}</h3>
            <p>{p.excerpt}</p>
            <span className="post__go">Read article <Icon name="arrow" size={16} /></span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- enquiry form */
export function EnquiryForm({ submitLabel = 'Send enquiry', preset = '', slot = '' }) {
  const nav = useNavigate();
  const [errors, setErrors] = useState({});
  const onSubmit = (e) => {
    const f = e.currentTarget;
    if (f.website.value) { e.preventDefault(); return; } // spam trap
    const errs = {};
    if (!f.name.value.trim()) errs.name = 'Please write your name.';
    if (!/^\S+@\S+\.\S+$/.test(f.email.value)) errs.email = 'Please write a valid email address.';
    if (!f.service.value) errs.service = 'Please choose a service.';
    setErrors(errs);
    if (Object.keys(errs).length) { e.preventDefault(); f[Object.keys(errs)[0]].focus(); return; }
    if (!INTEGRATIONS.enquiry_form_action) { e.preventDefault(); nav('/thank-you'); }
  };
  const field = (name, label, input) => (
    <div className={`field${name === 'message' ? ' field--full' : ''}`}>
      <label htmlFor={`f-${name}`}>{label}</label>
      {input}
      {errors[name] && <small className="err" id={`e-${name}`}>{errors[name]}</small>}
    </div>
  );
  return (
    <form className="form" method="post" action={INTEGRATIONS.enquiry_form_action || undefined} onSubmit={onSubmit} noValidate data-reveal>
      {field('name', 'Full name', <input id="f-name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} />)}
      {field('email', 'Email', <input id="f-email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'e-email' : undefined} />)}
      {field('phone', 'Phone (optional)', <input id="f-phone" name="phone" type="tel" autoComplete="tel" />)}
      {field('service', 'Service',
        <select id="f-service" name="service" defaultValue={preset} aria-invalid={!!errors.service}>
          <option value="">Choose a service</option>
          {SERVICES.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
          <option>Not sure yet</option>
        </select>)}
      {field('message', 'Message', <textarea id="f-message" name="message" rows="4" placeholder="A few words about what you need" />)}
      <input className="hp" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />
      <input type="hidden" name="slot" value={slot} />
      <div className="field--full form__foot">
        <Btn type="submit">{submitLabel}</Btn>
        <p className="form__note">Protected against spam. You get an email confirming we received your enquiry.</p>
      </div>
    </form>
  );
}

export { ScrollTrigger };
