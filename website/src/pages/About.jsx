import { useRef } from 'react';
import { ABOUT, C } from '../lib/data.js';
import { PageHero, ServiceGrid, CtaBand, usePageReveal } from '../components/blocks.jsx';
import { Btn, Eyebrow, Photo, Tbc } from '../components/ui.jsx';

export default function About() {
  const ref = useRef(null);
  usePageReveal(ref);
  return (
    <div ref={ref}>
      <PageHero crumbs={[{ label: 'About us' }]} title="About" accent="REDAC" ghost="About" photoKey="about" lead={ABOUT.intro} />

      <section className="sec">
        <div className="wrap about-split">
          <div className="prose" data-reveal>
            <Eyebrow>Our story</Eyebrow>
            <h2 className="h3">Who we are</h2>
            <p>{ABOUT.intro}</p>
            <p>{ABOUT.story || <Tbc label="Firm history and story from REDAC" />}</p>
            <dl className="facts">
              <div><dt>Established</dt><dd>{C.year_founded || <Tbc label="Year founded" />}</dd></div>
              <div><dt>Registrations</dt><dd>{C.registrations || <Tbc label="Tax agent and professional registrations" />}</dd></div>
            </dl>
          </div>
          <div className="about-photos" data-reveal>
            <div className="about-photos__a"><Photo k="who-companies" alt="" /></div>
            <div className="about-photos__b"><Photo k="step-book" alt="" /></div>
          </div>
        </div>
      </section>

      <section className="sec band-light">
        <div className="wrap">
          <div className="head-split"><div><Eyebrow>How we work</Eyebrow><h2 className="h2" data-split>What you can <span className="accent">expect</span></h2></div><Btn to="/team" variant="blue">Meet the team</Btn></div>
          <div className="values">
            {ABOUT.values.map((v, i) => (
              <article className="value" key={v.title} data-pop><b>{String(i + 1).padStart(2, '0')}</b><h3>{v.title}</h3><p>{v.text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="head-split"><div><Eyebrow>Services</Eyebrow><h2 className="h2" data-split>What we <span className="accent">do</span></h2></div></div>
          <ServiceGrid />
        </div>
      </section>
      <CtaBand />
    </div>
  );
}
