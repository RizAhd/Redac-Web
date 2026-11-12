import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { C, PROCESS, AUDIENCES, POSTS, SERVICES } from '../lib/data.js';
import { gsap, ScrollTrigger, SplitText, useGSAP, revealIn, reduced, isDesktop } from '../lib/motion.js';
import { Btn, Icon, Photo, Eyebrow } from '../components/ui.jsx';
import { ServiceStack, CtaBand, Ticker, StatusCard } from '../components/blocks.jsx';

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
    tl.from('.hero__frame', { clipPath: 'inset(6% 5% 6% 5% round 24px)', duration: 1.8, ease: 'expo.inOut' })
      // desktop: the photo fills the frame and settles; phones: the framed photo opens below the text
      .from('.hero__frame > img', desk ? { scale: 1.3, duration: 2.4 } : { clipPath: 'inset(20% 12% 20% 12% round 24px)', autoAlpha: 0, duration: 1.6, ease: 'expo.inOut' }, desk ? 0 : 0.9)
      .from(SplitText.create('.hero h1', { type: 'lines', mask: 'lines' }).lines, { yPercent: 110, duration: 1.3, stagger: 0.1 }, 0.55)
      .from('.hero [data-in]', { y: 30, autoAlpha: 0, duration: 1.1, stagger: 0.1 }, 0.85)
      .from('.hero__side > *', { x: 80, autoAlpha: 0, duration: 1.4, stagger: 0.15 }, 0.95);
    if (desk) {
      const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero__frame', { scale: 0.96, borderRadius: 24, ease: 'none', scrollTrigger: st });
      gsap.to('.hero__frame > img', { yPercent: 12, ease: 'none', scrollTrigger: { ...st } });
      gsap.to('.hero__side', { y: -70, ease: 'none', scrollTrigger: { ...st } });
    }

    /* 2. statement: words fill in with the scroll, highlights sweep, photo pills open (Quadro) */
    const words = SplitText.create('.statement__text', { type: 'words', wordsClass: 'sw' }).words;
    gsap.fromTo(words, { opacity: 0.15 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top 75%', end: 'bottom 65%', scrub: true } });
    gsap.from('.mosaic__chip', { y: 20, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.12, delay: 0.6, scrollTrigger: { trigger: '.mosaic', start: 'top 80%', once: true } });
    gsap.utils.toArray('.hl').forEach((h) => {
      gsap.fromTo(h, { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%', ease: 'none', scrollTrigger: { trigger: h, start: 'top 75%', end: 'top 45%', scrub: true } });
    });

    /* 4. at a glance: bento tiles pop, photo drifts, service icons orbit in */
    gsap.from('.bento__svc li', { x: -40, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '.bento', start: 'top 70%', once: true } });
    gsap.from('.bento__groups li', { x: -30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.bento', start: 'top 60%', once: true } });

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

    ScrollTrigger.refresh();
  }, { scope: ref });

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
          <div className="hero__side">
            <StatusCard className="status--glass" />
          </div>
        </div>
      </section>

      <Ticker items={SERVICES.map((s) => s.title)} />

      {/* 2. STATEMENT */}
      <section className="statement sec">
        <div className="wrap statement__grid">
          <div className="statement__copy">
            <p className="statement__text">
              We handle your <mark className="hl">tax returns</mark>, your <mark className="hl">books and payroll</mark>, and your <mark className="hl">company filings</mark>, so you can focus on your life and your business.
            </p>
            <div className="statement__foot" data-stagger>
              <Btn to="/about" variant="blue">About REDAC</Btn>
              <Btn to="/team" variant="outline" arrow={false}>Meet the team</Btn>
            </div>
          </div>
          <div className="mosaic">
            {[
              { k: 'pill-1', to: '/services/individual-tax-returns', icon: 'receipt', label: 'Tax returns' },
              { k: 'pill-2', to: '/services/bookkeeping-and-payroll', icon: 'book', label: 'Books and payroll' },
              { k: 'pill-3', to: '/services/company-registration-and-asic', icon: 'building', label: 'Company filings' },
            ].map((t, i) => (
              <Link key={t.k} to={t.to} className={`mosaic__tile mosaic__tile--${i}`} data-img>
                <Photo k={t.k} alt="" />
                <span className="mosaic__chip"><Icon name={t.icon} size={16} />{t.label}<Icon name="arrow" size={14} /></span>
              </Link>
            ))}
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

      {/* 6. WHO WE HELP */}
      <section className="who sec">
        <p className="who__ghost" aria-hidden="true">Who we help &middot; Who we help</p>
        <div className="wrap">
          <div className="head-center"><Eyebrow n="03">Who we help</Eyebrow><h2 className="h2" data-split>Built for every <span className="accent">stage</span></h2></div>
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

      {/* 8. INSIGHTS */}
      <section className="sec">
        <div className="wrap">
          <div className="head-split">
            <div><Eyebrow n="04">News and insights</Eyebrow><h2 className="h2" data-split>Useful <span className="accent">reading</span></h2></div>
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

      {/* 10. CTA */}
      <CtaBand />
    </div>
  );
}
