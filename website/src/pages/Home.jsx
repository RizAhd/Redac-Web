import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { C, PROCESS, AUDIENCES, POSTS, FAQ, SERVICES } from '../lib/data.js';
import { gsap, ScrollTrigger, SplitText, useGSAP, revealIn, reduced, isDesktop } from '../lib/motion.js';
import { Btn, Icon, Photo, Eyebrow } from '../components/ui.jsx';
import { ServiceStack, FaqList, CtaBand, Ticker, StatusCard } from '../components/blocks.jsx';

export default function Home() {
  const ref = useRef(null);

  useGSAP(() => {
    const root = ref.current;
    revealIn(root);
    if (reduced()) return;
    const desk = isDesktop();

    /* 1. hero: frame opens, photo settles, lines rise, cards fly in */
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
    (document.fonts?.ready || Promise.resolve()).then(() => tl.play());
    tl.from('.hero__frame', { clipPath: 'inset(6% 5% 6% 5% round 56px)', duration: 1.8, ease: 'expo.inOut' })
      .from('.hero__frame > img', { scale: 1.3, duration: 2.4 }, 0)
      .from(SplitText.create('.hero h1', { type: 'lines', mask: 'lines' }).lines, { yPercent: 110, duration: 1.3, stagger: 0.1 }, 0.55)
      .from('.hero [data-in]', { y: 30, autoAlpha: 0, duration: 1.1, stagger: 0.1 }, 0.85)
      .from('.hcard--a', { x: 120, y: 60, rotate: 6, autoAlpha: 0, duration: 1.6 }, 0.9)
      .from('.hero .status', { x: 80, y: -40, rotate: -5, autoAlpha: 0, duration: 1.6 }, 1)
      .from('.hchip', { scale: 0.4, autoAlpha: 0, duration: 1.2, ease: 'back.out(1.8)', stagger: 0.12 }, 1.1);
    if (desk) {
      const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero__frame', { scale: 0.95, borderRadius: 56, ease: 'none', scrollTrigger: st });
      gsap.to('.hero__frame > img', { yPercent: 12, ease: 'none', scrollTrigger: { ...st } });
      gsap.to('.hcard--a', { y: -90, ease: 'none', scrollTrigger: { ...st } });
      gsap.to('.hero .status', { y: -50, ease: 'none', scrollTrigger: { ...st } });
      gsap.to('.hchip--1', { y: -160, rotate: -30, ease: 'none', scrollTrigger: { ...st } });
      gsap.to('.hchip--2', { y: -110, rotate: 25, ease: 'none', scrollTrigger: { ...st } });
      gsap.to('.hchip--3', { y: -200, rotate: -12, ease: 'none', scrollTrigger: { ...st } });
    }

    /* 2. statement: words fill in with the scroll, highlights sweep, photo pills open (Quadro) */
    const words = SplitText.create('.statement__text', { type: 'words', wordsClass: 'sw' }).words;
    gsap.fromTo(words, { opacity: 0.15 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top 75%', end: 'bottom 65%', scrub: true } });
    gsap.from('.pill', { width: 0, duration: 1.3, ease: 'expo.out', stagger: 0.15, scrollTrigger: { trigger: '.statement', start: 'top 65%', once: true } });
    gsap.utils.toArray('.hl').forEach((h) => {
      gsap.fromTo(h, { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%', ease: 'none', scrollTrigger: { trigger: h, start: 'top 75%', end: 'top 45%', scrub: true } });
    });

    /* 4. at a glance: bento tiles pop, photo drifts, service icons orbit in */
    gsap.from('.bento__svc li', { x: -40, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '.bento', start: 'top 70%', once: true } });
    gsap.from('.bento__groups li', { x: -30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.bento', start: 'top 60%', once: true } });

    /* 5. process: pinned, photo and step change together (OneFin) */
    if (desk) {
      const steps = gsap.utils.toArray('.proc__step');
      const pics = gsap.utils.toArray('.proc__pic');
      gsap.set(pics.slice(1), { clipPath: 'inset(100% 0% 0% 0% round 36px)' });
      const ptl = gsap.timeline({
        scrollTrigger: {
          trigger: '.proc', start: 'top top', end: '+=260%', pin: true, scrub: 0.6,
          onUpdate: (st) => {
            const idx = Math.min(steps.length - 1, Math.floor(st.progress * steps.length * 0.999));
            steps.forEach((s, i) => s.classList.toggle('is-on', i === idx));
          },
        },
      });
      ptl.to('.proc__bar i', { scaleX: 1, ease: 'none', duration: pics.length - 1 }, 0);
      pics.slice(1).forEach((p, i) => {
        ptl.to(p, { clipPath: 'inset(0% 0% 0% 0% round 36px)', duration: 0.6, ease: 'power2.inOut' }, i + 0.4);
        ptl.from(p.querySelector('img'), { scale: 1.25, duration: 0.8, ease: 'power2.out' }, i + 0.4);
      });
    }

    /* 6. who we help: giant type slides, cards fan out (Quadro) */
    gsap.fromTo('.who__ghost', { xPercent: 10 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.who', start: 'top bottom', end: 'bottom top', scrub: true } });
    if (desk) {
      const fan = [[-106, 34, -8], [0, 0, 0], [106, 40, 8]];
      gsap.utils.toArray('.fcard').forEach((c, i) => {
        gsap.fromTo(c, { xPercent: 0, y: 180, rotate: [-16, 10, 22][i], autoAlpha: 0.2 }, {
          xPercent: fan[i][0], y: fan[i][1], rotate: fan[i][2], autoAlpha: 1, ease: 'none',
          scrollTrigger: { trigger: '.fan', start: 'top 88%', end: 'top 30%', scrub: 0.8 },
        });
      });
    }

    /* 7. promise: rows of giant words slide against each other */
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
            <h1 className="h1 hero__title">Tax and accounting for people and businesses</h1>
            <p className="lead hero__lead" data-in>{C.description}</p>
            <div className="btn-row" data-in>
              <Btn to="/book">Book a consultation</Btn>
              <Btn to="/services" variant="glass" arrow={false}>Explore services</Btn>
            </div>
          </div>
          <StatusCard className="status--glass" />
          <div className="hcard hcard--a">
            <div className="hcard__img"><Photo k="svc-company-registration-and-asic" alt="" /></div>
            <div>
              <b>Tax, books, payroll and company filings, under one roof.</b>
              <Link to="/services" className="hcard__link">See all 8 services <Icon name="arrow" size={14} /></Link>
            </div>
          </div>
          <span className="hchip hchip--1" aria-hidden="true"><Icon name="doc" /></span>
          <span className="hchip hchip--2" aria-hidden="true"><Icon name="chart" /></span>
          <span className="hchip hchip--3" aria-hidden="true"><Icon name="calendar" /></span>
        </div>
      </section>

      <Ticker items={SERVICES.map((s) => s.title)} />

      {/* 2. STATEMENT */}
      <section className="statement sec">
        <div className="wrap">
          <p className="statement__text">
            We handle your <span className="pill"><Photo k="pill-1" alt="" /></span> <mark className="hl">tax returns</mark>, your <span className="pill"><Photo k="pill-2" alt="" /></span> <mark className="hl">books and payroll</mark>, and your <span className="pill"><Photo k="pill-3" alt="" /></span> <mark className="hl">company filings</mark>, so you can focus on your life and your business.
          </p>
          <div className="statement__foot" data-stagger>
            <Btn to="/about" variant="blue">About REDAC</Btn>
            <Link className="link link--big" to="/team">Meet the team <Icon name="arrow" size={16} /></Link>
          </div>
        </div>
      </section>

      {/* 3. SERVICES */}
      <section className="sec services" id="services">
        <div className="wrap">
          <div className="head-split">
            <div><Eyebrow n="01">Services</Eyebrow><h2 className="h2" data-split>Eight services, <span className="accent">one firm</span></h2></div>
            <p className="lead muted" data-words>Every service you need for your tax and accounts. Scroll through them, or open one to see exactly what is included.</p>
          </div>
          <ServiceStack />
        </div>
      </section>

      {/* 4. AT A GLANCE (bento) */}
      <section className="sec glance">
        <div className="wrap">
          <div className="head-split">
            <div><Eyebrow n="02">At a glance</Eyebrow><h2 className="h2" data-split>Everything under <span className="accent">one roof</span></h2></div>
            <p className="lead muted" data-words>One firm for returns, statements, books, payroll, advice and company filings. No juggling separate providers.</p>
          </div>
          <div className="bento">
            <article className="tile tile--blue tile--svc" data-pop>
              <div className="tile__num"><b data-count="08">08</b><span>services</span></div>
              <p>From personal tax returns to company registration and ASIC filings.</p>
              <ul className="bento__svc">{SERVICES.map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`}><i><Icon name={s.icon} size={18} /></i>{s.title}</Link></li>)}</ul>
            </article>
            <article className="tile tile--photo" data-pop>
              <div className="tile__img"><Photo k="svc-business-advisory-and-project-finance" alt="The REDAC team in a meeting" /></div>
              <div className="tile__over"><b>One team for your tax and accounts</b><Link to="/team" className="link link--light">Meet the team <Icon name="arrow" size={14} /></Link></div>
            </article>
            <article className="tile tile--green" data-pop>
              <div className="tile__num"><b data-count="03">03</b><span>client groups</span></div>
              <ul className="bento__groups">
                {AUDIENCES.map((a) => (
                  <li key={a.slug}><span className="bento__av"><Photo k={`who-${a.slug}`} alt="" /></span>{a.title}</li>
                ))}
              </ul>
            </article>
            <article className="tile tile--white" data-pop>
              <div className="tile__num"><b data-count="04">04</b><span>steps</span></div>
              <ol className="bento__steps">{PROCESS.map((p, i) => <li key={p.title}><i>{i + 1}</i>{p.title}</li>)}</ol>
            </article>
            <article className="tile tile--frame" data-pop>
              <StatusCard />
              <p className="tile__cap"><Icon name="shield" size={18} /> You see and approve everything before it is lodged.</p>
            </article>
            <article className="tile tile--deep" data-pop>
              <div className="tile__num"><b data-count="01">01</b><span>point of contact</span></div>
              <p>Book online, share your documents, and talk to the same people every time.</p>
              <Btn to="/book" variant="white">Book a consultation</Btn>
            </article>
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
                <div className="proc__badge"><span><Icon name={p.icon} size={18} /></span>{p.title}</div>
              </div>
            ))}
          </div>
          <div className="proc__text">
            <Eyebrow n="03">How it works</Eyebrow>
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
          <div className="head-center"><Eyebrow n="04">Who we help</Eyebrow><h2 className="h2" data-split>Built for every <span className="accent">stage</span></h2></div>
          <div className="fan">
            {AUDIENCES.map((a, i) => (
              <article className={`fcard fcard--${i}`} key={a.slug}>
                <div className="fcard__img"><Photo k={`who-${a.slug}`} alt={a.title} /></div>
                <div className="fcard__body">
                  <span className="fcard__kicker">{a.title}</span>
                  <h3>{a.headline}</h3>
                  <p>{a.text}</p>
                  <Link className="link" to={`/who-we-help#${a.slug}`}>See how we help <Icon name="arrow" size={14} /></Link>
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
            <div><Eyebrow n="05">News and insights</Eyebrow><h2 className="h2" data-split>Useful <span className="accent">reading</span></h2></div>
            <Link className="link link--big" to="/insights" data-reveal>All articles <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="feat">
            <Link className="feat__main" to={`/insights/${p0.slug}`} data-reveal>
              <div className="feat__img"><Photo k={`post-${p0.slug}`} alt="" /></div>
              <div className="feat__body"><span className="post__tag">{p0.tag}</span><h3>{p0.title}</h3><p>{p0.excerpt}</p><span className="post__go">Read article <Icon name="arrow" size={16} /></span></div>
            </Link>
            <div className="feat__side" data-stagger>
              {rest.map((p) => (
                <Link className="feat__item" key={p.slug} to={`/insights/${p.slug}`}>
                  <div className="feat__thumb"><Photo k={`post-${p.slug}`} alt="" /></div>
                  <div><span className="post__tag">{p.tag}</span><h3>{p.title}</h3><span className="post__go">Read <Icon name="arrow" size={14} /></span></div>
                </Link>
              ))}
              <Link className="feat__more" to="/insights"><b>New articles every month</b><span>Tax dates, bookkeeping tips and business set-up, in plain English.</span><Icon name="arrow" size={20} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="sec sec--tight">
        <div className="wrap">
          <div className="faqp">
            <div className="faqp__head">
              <h2 className="h2" data-split>Questions before you <span className="accent accent--light">book</span></h2>
              <p className="faqp__sub">Short answers to what new clients ask us most.</p>
              <div className="faqp__photo" data-img><Photo k="faq" alt="" /></div>
              <Btn to="/faq" variant="glass" arrow={false}>All questions</Btn>
            </div>
            <FaqList items={FAQ.slice(0, 5)} dark />
          </div>
        </div>
      </section>

      {/* 10. CTA */}
      <CtaBand />
    </div>
  );
}
