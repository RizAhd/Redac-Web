import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SERVICES, INTEGRATIONS, POSTS } from '../lib/data.js';
import { gsap, useGSAP, ScrollTrigger, revealIn, reduced, isDesktop } from '../lib/motion.js';
import { Btn, Icon, Photo, Eyebrow } from './ui.jsx';

/* Hook: run the standard reveals for everything inside a page */
export function usePageReveal(ref) {
  useGSAP(() => { revealIn(ref.current); }, { scope: ref });
}

/* ---------------------------------------------------------------- page hero
   Light frame (not another blue block), photo with a floating note, fact chips. */
export function PageHero({ crumbs = [], title, accent, lead, photoKey, ghost, facts = [], note, children }) {
  const ref = useRef(null);
  useGSAP(() => {
    if (reduced()) return;
    revealIn(ref.current);
    gsap.from('.phero__photo', { clipPath: 'inset(20% 16% 20% 16% round 40px)', duration: 1.6, ease: 'expo.inOut', delay: 0.1 });
    gsap.from('.phero__photo img', { scale: 1.35, duration: 2, ease: 'expo.out', delay: 0.1 });
    gsap.from('.phero__note', { y: 40, autoAlpha: 0, duration: 1.2, ease: 'back.out(1.4)', delay: 0.9 });
    gsap.from('.phero__facts li', { y: 24, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.6 });
    gsap.to('.phero__photo img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.fromTo('.phero__ghost', { xPercent: 4 }, { xPercent: -14, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } });
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
          {lead && <p className="lead" data-words data-now data-delay="0.35">{lead}</p>}
          {children}
          {facts.length > 0 && (
            <ul className="phero__facts">{facts.map((f) => <li key={f.label}><Icon name={f.icon} size={18} />{f.label}</li>)}</ul>
          )}
        </div>
        {photoKey && (
          <div className="phero__media">
            <div className="phero__photo"><Photo k={photoKey} alt="" eager /></div>
            {note && <div className="phero__note"><span><Icon name={note.icon || 'check'} size={20} /></span><div><b>{note.title}</b><small>{note.text}</small></div></div>}
          </div>
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------------- ticker (Quadro) */
export function Ticker({ items, light = false }) {
  const row = [...items, ...items];
  return (
    <div className={`ticker${light ? ' ticker--light' : ''}`} aria-hidden="true">
      <div className="ticker__track">
        {[0, 1].map((k) => (
          <div className="ticker__set" key={k}>
            {row.map((t, i) => <span key={i}>{t}<i /></span>)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- live "return status" card (OneFin-style UI) */
export function StatusCard({ className = '' }) {
  const steps = [
    { t: 'Documents received', s: 'done' },
    { t: 'Return prepared', s: 'done' },
    { t: 'Waiting for your approval', s: 'now' },
    { t: 'Lodged', s: 'next' },
  ];
  return (
    <div className={`status ${className}`}>
      <div className="status__top">
        <span className="status__ico"><Icon name="doc" size={18} /></span>
        <div><b>Your tax return</b><small>Prepared by REDAC</small></div>
        <span className="status__pct">75%</span>
      </div>
      <div className="status__bar"><i /></div>
      <ul>
        {steps.map((x) => (
          <li key={x.t} className={`is-${x.s}`}><span aria-hidden="true">{x.s === 'done' && <svg viewBox="0 0 12 12" width="10" height="10"><path d="M2.5 6.2l2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}</span>{x.t}</li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------- Kora-style service list, photo follows the cursor */
export function ServiceList({ items = SERVICES }) {
  const ref = useRef(null);
  const [cur, setCur] = useState(0);
  const { contextSafe } = useGSAP({ scope: ref });
  const move = contextSafe((e) => {
    if (reduced() || !isDesktop()) return;
    const r = ref.current.getBoundingClientRect();
    gsap.to('.slist__float', { x: e.clientX - r.left, y: e.clientY - r.top, duration: 0.7, ease: 'power3.out' });
  });
  const show = contextSafe((on) => { if (!reduced()) gsap.to('.slist__float', { autoAlpha: on ? 1 : 0, scale: on ? 1 : 0.6, duration: 0.5, ease: 'expo.out' }); });
  return (
    <div className="slist" ref={ref} onMouseMove={move} onMouseEnter={() => show(true)} onMouseLeave={() => show(false)}>
      <div className="slist__float" aria-hidden="true">
        {items.map((s, i) => <Photo key={s.slug} k={`svc-${s.slug}`} alt="" className={i === cur ? 'is-on' : ''} />)}
      </div>
      {items.map((s, i) => (
        <Link className="slist__row" key={s.slug} to={`/services/${s.slug}`} onMouseEnter={() => setCur(i)} onFocus={() => setCur(i)} data-reveal>
          <span className="slist__no">{String(SERVICES.indexOf(s) + 1).padStart(2, '0')}</span>
          <span className="slist__title">{s.title}</span>
          <span className="slist__short">{s.short}</span>
          <span className="slist__tags">{s.tags.slice(0, 2).map((t) => <em key={t}>{t}</em>)}</span>
          <span className="slist__go"><Icon name="arrow" size={18} /></span>
        </Link>
      ))}
    </div>
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
      gsap.fromTo(card.querySelector('.stk__inner'), { scale: 1, filter: 'brightness(1)' }, {
        scale: 0.94, filter: 'brightness(0.9)', ease: 'none', immediateRender: false,
        scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 110px', scrub: true },
      });
    });
    cards.forEach((card) => {
      gsap.fromTo(card.querySelector('.stk__photo img'), { scale: 1.25 }, {
        scale: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 110px', scrub: true },
      });
      gsap.from(card.querySelectorAll('.chips li'), { y: 16, autoAlpha: 0, stagger: 0.05, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 60%', once: true } });
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
                  <span className="stk__no">{String(n).padStart(2, '0')}<small>/{String(SERVICES.length).padStart(2, '0')}</small></span>
                </div>
                <h3 className="stk__title">{s.title}</h3>
                <p className="stk__desc">{s.intro}</p>
                <div className="stk__offer">
                  <p>What we offer</p>
                  <ul className="chips">{s.includes.slice(0, 4).map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
                <Link className="stk__bar" to={`/services/${s.slug}`}>View service <Icon name="arrow" size={18} /></Link>
              </div>
              <div className="stk__photo">
                <Photo k={`svc-${s.slug}`} alt={s.title} />
                <div className="stk__for"><small>Best for</small><b>{s.for[0]}</b></div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------- compact service grid */
export function ServiceGrid({ items = SERVICES }) {
  return (
    <div className="sgrid" data-stagger>
      {items.map((s) => {
        const n = SERVICES.indexOf(s) + 1;
        return (
          <Link className="sgrid__card" key={s.slug} to={`/services/${s.slug}`}>
            <div className="sgrid__img"><Photo k={`svc-${s.slug}`} alt="" /><span className="sgrid__ico"><Icon name={s.icon} size={20} /></span></div>
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

/* ------------------------------------------------- steps with drawn connector */
export function Steps({ items, light = false }) {
  return (
    <div className={`steps${light ? ' steps--light' : ''}`}>
      <div className="steps__line" data-line aria-hidden="true" />
      <ol className="steps__list" data-stagger>
        {items.map((p, i) => (
          <li key={p.title}>
            <span className="steps__dot"><Icon name={p.icon || 'check'} size={22} /></span>
            <b>{String(i + 1).padStart(2, '0')}</b>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </li>
        ))}
      </ol>
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
    ref.current.querySelectorAll('.qa__a').forEach((p, j) => {
      gsap.to(p, { height: j === next ? p.scrollHeight : 0, duration: reduced() ? 0 : 0.6, ease: 'expo.out' });
    });
    setOpen(next);
  });
  return (
    <div className={`qa-list${dark ? ' qa-list--dark' : ''}`} ref={ref}>
      {items.map((f, i) => (
        <div className={`qa${openIdx === i ? ' is-open' : ''}`} key={f.q} data-reveal>
          <button className="qa__q" type="button" aria-expanded={openIdx === i} onClick={() => toggle(i)}>
            <span><em>{String(i + 1).padStart(2, '0')}</em>{f.q}</span><i aria-hidden="true"><Icon name="plus" size={16} /></i>
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
            <h2 className="h2" data-split>{title} <span className="accent accent--light">{accent}</span></h2>
            <p className="lead">{text}</p>
            <div className="btn-row">
              <Btn to="/book" variant="white">Book a consultation</Btn>
              <Btn to="/contact" variant="glass" arrow={false}>Ask a question</Btn>
            </div>
            <ul className="cta__ticks">
              <li><Icon name="calendar" size={18} />Pick a time online</li>
              <li><Icon name="check" size={18} />Nothing lodged without your approval</li>
            </ul>
          </div>
          <div className="cta__photo" data-img><Photo k={photoKey} alt="" /><StatusCard className="cta__status" /></div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- article cards */
export function PostCards({ items = POSTS }) {
  return (
    <div className="posts" data-stagger>
      {items.map((p) => (
        <Link className="post" key={p.slug} to={`/insights/${p.slug}`}>
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
