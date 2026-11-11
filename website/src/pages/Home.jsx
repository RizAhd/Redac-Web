import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { C, STATS, PROCESS, AUDIENCES, POSTS, FAQ, SERVICES } from '../lib/data.js';
import { gsap, ScrollTrigger, SplitText, useGSAP, revealIn, reduced, isDesktop } from '../lib/motion.js';
import { Btn, Icon, Photo, Eyebrow } from '../components/ui.jsx';
import { ServiceStack, FaqList, CtaBand } from '../components/blocks.jsx';

export default function Home() {
  const ref = useRef(null);

  useGSAP(() => {
    const root = ref.current;
    revealIn(root);
    if (reduced()) return;
    const desk = isDesktop();

    /* 1. hero: frame opens, photo settles, lines rise, cards fly in (OneFin springs) */
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
    (document.fonts?.ready || Promise.resolve()).then(() => tl.play());
    tl.from('.hero__frame', { clipPath: 'inset(8% 6% 8% 6% round 48px)', duration: 1.8 })
      .from('.hero__frame > img', { scale: 1.25, duration: 2.2 }, 0)
      .from(SplitText.create('.hero h1', { type: 'lines', mask: 'lines' }).lines, { yPercent: 110, duration: 1.3, stagger: 0.1 }, 0.35)
      .from('.hero [data-in]', { y: 30, autoAlpha: 0, duration: 1.1, stagger: 0.1 }, 0.7)
      .from('.hcard--a', { x: 120, y: 60, rotate: 6, autoAlpha: 0, duration: 1.6 }, 0.6)
      .from('.hcard--b', { x: 80, y: -40, rotate: -6, autoAlpha: 0, duration: 1.6 }, 0.75)
      .from('.hchip', { scale: 0.6, y: 30, autoAlpha: 0, duration: 1.2, ease: 'back.out(1.6)', stagger: 0.1 }, 0.9);
    if (desk) {
      gsap.to('.hero__frame', { scale: 0.94, borderRadius: 56, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__frame > img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hcard--a', { y: -80, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* 2. statement: words fill in with the scroll; photo pills open */
    const words = SplitText.create('.statement__text', { type: 'words', wordsClass: 'sw' }).words;
    gsap.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top 70%', end: 'bottom 60%', scrub: true } });
    gsap.from('.pill', { width: 0, duration: 1.2, ease: 'expo.out', stagger: 0.15, scrollTrigger: { trigger: '.statement', start: 'top 65%' } });

    /* 4. numbers: pinned stack, each card replaces the last */
    if (desk) {
      const cards = gsap.utils.toArray('.ncard');
      gsap.set(cards.slice(1), { yPercent: 130, rotate: 10, autoAlpha: 0 });
      const ntl = gsap.timeline({ scrollTrigger: { trigger: '.numbers', start: 'top top', end: '+=200%', pin: true, scrub: 0.6 } });
      cards.slice(1).forEach((c, i) => {
        ntl.to(cards[i], { yPercent: -16, scale: 0.86, rotate: -6, autoAlpha: 0.35, duration: 1 })
          .to(c, { yPercent: 0, rotate: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' }, '<');
      });
    }

    /* 5. process: pinned, photo and step change together */
    if (desk) {
      const steps = gsap.utils.toArray('.proc__step');
      const pics = gsap.utils.toArray('.proc__pic');
      gsap.set(pics.slice(1), { clipPath: 'inset(100% 0% 0% 0% round 36px)' });
      const ptl = gsap.timeline({
        scrollTrigger: {
          trigger: '.proc', start: 'top top', end: '+=300%', pin: true, scrub: 0.6,
          onUpdate: (st) => {
            const idx = Math.min(steps.length - 1, Math.floor(st.progress * steps.length * 0.999));
            steps.forEach((s, i) => s.classList.toggle('is-on', i === idx));
          },
        },
      });
      ptl.to('.proc__bar i', { scaleX: 1, ease: 'none', duration: pics.length - 1 }, 0);
      pics.slice(1).forEach((p, i) => {
        ptl.to(p, { clipPath: 'inset(0% 0% 0% 0% round 36px)', duration: 0.6, ease: 'power2.inOut' }, i + 0.4);
      });
    }

    /* 6. who we help: giant type slides, cards fan out (Quadro) */
    gsap.fromTo('.who__ghost', { xPercent: 12 }, { xPercent: -28, ease: 'none', scrollTrigger: { trigger: '.who', start: 'top bottom', end: 'bottom top', scrub: true } });
    if (desk) {
      const fan = [[-108, 34, -9], [0, 0, 1], [108, 40, 9]];
      gsap.utils.toArray('.fcard').forEach((c, i) => {
        gsap.fromTo(c, { xPercent: 0, y: 160, rotate: [-20, 14, 28][i], autoAlpha: 0.3 }, {
          xPercent: fan[i][0], y: fan[i][1], rotate: fan[i][2], autoAlpha: 1, ease: 'none',
          scrollTrigger: { trigger: '.fan', start: 'top 85%', end: 'top 25%', scrub: 0.8 },
        });
      });
    }

    /* 7. promise: three rows of giant words slide against each other */
    gsap.utils.toArray('.bw__row').forEach((row, i) => {
      gsap.fromTo(row, { xPercent: i % 2 ? -30 : 0 }, { xPercent: i % 2 ? 0 : -30, ease: 'none', scrollTrigger: { trigger: '.bw', start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    ScrollTrigger.refresh();
  }, { scope: ref });

  const words = ['Clarity', 'Compliance', 'Confidence'];
  const [p0, ...rest] = POSTS;

  return (
    <div ref={ref}>
      {/* 1. HERO */}
      <section className="hero">
        <div className="hero__frame">
          <Photo k="hero" alt="An adviser and a client shaking hands over coffee" eager />
          <div className="hero__shade" aria-hidden="true" />
          <div className="hero__content">
            <p className="eyebrow eyebrow--light" data-in>Tax &middot; Accounting &middot; Advisory</p>
            <h1 className="h1 hero__title">Tax and accounting for people and businesses</h1>
            <p className="lead hero__lead" data-in>{C.description}</p>
            <div className="btn-row" data-in>
              <Btn to="/book">Book a consultation</Btn>
              <Btn to="/services" variant="glass" arrow={false}>Explore services</Btn>
            </div>
          </div>
          <div className="hcard hcard--a">
            <div className="hcard__img"><Photo k="svc-company-registration-and-asic" alt="" /></div>
            <div>
              <span className="tag tag--green">8 services</span>
              <b>Tax, books, payroll and company filings, under one roof.</b>
              <Link to="/services" className="hcard__link">See all services <Icon name="arrow" size={14} /></Link>
            </div>
          </div>
          <div className="hcard hcard--b">
            <span className="hcard__ico"><Icon name="check" /></span>
            <div><b>You approve first</b><small>Nothing is lodged until you agree.</small></div>
          </div>
          <span className="hchip hchip--1" aria-hidden="true"><Icon name="doc" /></span>
        </div>
      </section>

      {/* 2. STATEMENT */}
      <section className="statement sec">
        <div className="wrap">
          <p className="statement__text">
            We handle your <span className="pill"><Photo k="pill-1" alt="" /></span> tax returns, your <span className="pill"><Photo k="pill-2" alt="" /></span> books and payroll, and your <span className="pill"><Photo k="pill-3" alt="" /></span> company filings, so you can focus on your life and your business.
          </p>
        </div>
      </section>

      {/* 3. SERVICES */}
      <section className="sec services" id="services">
        <div className="wrap">
          <div className="head-split">
            <div><Eyebrow>Our services</Eyebrow><h2 className="h2" data-split>Eight services, <span className="accent">one firm</span></h2></div>
            <p className="lead muted" data-reveal>Every service you need for your tax and accounts. Scroll through them, or open one to see exactly what is included.</p>
          </div>
          <ServiceStack />
        </div>
      </section>

      {/* 4. NUMBERS */}
      <section className="numbers">
        <div className="numbers__glow" aria-hidden="true" />
        <div className="wrap numbers__grid">
          <div>
            <Eyebrow light>REDAC in numbers</Eyebrow>
            <h2 className="h2">Everything under <span className="accent accent--light">one roof</span></h2>
            <p className="lead">One firm for returns, statements, books, payroll, advice and company filings.</p>
          </div>
          <div className="ncards">
            {STATS.map((s, i) => (
              <article className={`ncard ncard--${i}`} key={s.value}>
                <b>{s.value}</b>
                <div><p>{s.label}</p><small>{s.note}</small></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROCESS */}
      <section className="proc">
        <div className="wrap proc__grid">
          <div className="proc__visual">
            {PROCESS.map((p, i) => (
              <div className="proc__pic" key={p.title} style={{ zIndex: i }}>
                <Photo k={['step-book', 'step-talk', 'step-prepare', 'step-approve'][i]} alt="" />
                <div className="proc__badge"><span>{String(i + 1).padStart(2, '0')}</span>{p.title}</div>
              </div>
            ))}
          </div>
          <div className="proc__text">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="h2">Four steps, <span className="accent">no surprises</span></h2>
            <ol className="proc__steps">
              {PROCESS.map((p, i) => (
                <li className={`proc__step${i === 0 ? ' is-on' : ''}`} key={p.title}>
                  <span className="proc__no">{String(i + 1).padStart(2, '0')}</span>
                  <div><h3>{p.title}</h3><p>{p.text}</p></div>
                </li>
              ))}
            </ol>
            <div className="proc__bar" aria-hidden="true"><i /></div>
          </div>
        </div>
      </section>

      {/* 6. WHO WE HELP */}
      <section className="who sec">
        <p className="who__ghost" aria-hidden="true">Who we help &middot; Who we help</p>
        <div className="wrap">
          <div className="head-center"><Eyebrow>Who we help</Eyebrow><h2 className="h2" data-split>Built for every <span className="accent">stage</span></h2></div>
          <div className="fan">
            {AUDIENCES.map((a, i) => (
              <article className={`fcard fcard--${i}`} key={a.slug}>
                <div className="fcard__img"><Photo k={`who-${a.slug}`} alt={a.title} /></div>
                <div className="fcard__body">
                  <span className="tag">{a.title}</span>
                  <h3>{a.headline}</h3>
                  <p>{a.text}</p>
                  <Link className="link" to="/who-we-help">See how we help <Icon name="arrow" size={14} /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PROMISE */}
      <section className="bw" aria-label="Clarity, compliance, confidence">
        {[0, 1, 2].map((r) => (
          <div className={`bw__row bw__row--${r}`} key={r} aria-hidden="true">
            {[...words, ...words, ...words].map((w, i) => <span key={i}>{w}<i>&bull;</i></span>)}
          </div>
        ))}
      </section>

      {/* 8. INSIGHTS */}
      <section className="sec">
        <div className="wrap">
          <div className="head-split">
            <div><Eyebrow>News and insights</Eyebrow><h2 className="h2" data-split>Useful <span className="accent">reading</span></h2></div>
            <Link className="link link--big" to="/insights" data-reveal>All articles <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="feat">
            <Link className="feat__main" to={`/insights/${p0.slug}`} data-reveal>
              <div className="feat__img"><Photo k={`post-${p0.slug}`} alt="" /></div>
              <div className="feat__body"><span className="post__tag">{p0.tag}</span><h3>{p0.title}</h3><p>{p0.excerpt}</p><span className="post__go">Read article <Icon name="arrow" size={16} /></span></div>
            </Link>
            <div className="feat__side">
              {rest.map((p) => (
                <Link className="feat__item" key={p.slug} to={`/insights/${p.slug}`} data-reveal>
                  <div className="feat__thumb"><Photo k={`post-${p.slug}`} alt="" /></div>
                  <div><span className="post__tag">{p.tag}</span><h3>{p.title}</h3></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="sec">
        <div className="wrap">
          <div className="faqp">
            <div className="faqp__head">
              <Eyebrow light>FAQ</Eyebrow>
              <h2 className="h2">Questions before you <span className="accent accent--light">book</span></h2>
              <div className="faqp__photo"><Photo k="faq" alt="" /></div>
              <Btn to="/faq" variant="glass" arrow={false}>All questions</Btn>
            </div>
            <FaqList items={FAQ.slice(0, 5)} dark />
          </div>
        </div>
      </section>

      {/* 10. CTA */}
      <CtaBand />
      <p className="sr-only">{SERVICES.length} services</p>
    </div>
  );
}
