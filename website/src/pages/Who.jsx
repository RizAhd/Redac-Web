import { useRef } from 'react';
import { AUDIENCES, SVC } from '../lib/data.js';
import { PageHero, ServiceGrid, CtaBand, usePageReveal } from '../components/blocks.jsx';
import { Eyebrow, Photo } from '../components/ui.jsx';

export default function Who() {
  const ref = useRef(null);
  usePageReveal(ref);
  return (
    <div ref={ref}>
      <PageHero crumbs={[{ to: '/about', label: 'About' }, { label: 'Who we help' }]} title="Who we" accent="help" ghost="Clients" photoKey="who-small-businesses"
        lead="Individuals, small businesses and companies. Find the services that fit your situation." />
      {AUDIENCES.map((a, i) => (
        <section className={`sec${i === 1 ? ' band-light' : ''}`} id={a.slug} key={a.slug}>
          <div className="wrap">
            <div className={`who-row${i % 2 ? ' who-row--flip' : ''}`}>
              <div>
                <Eyebrow>{a.title}</Eyebrow>
                <h2 className="h2" data-split>{a.headline}</h2>
                <p className="lead muted" data-reveal>{a.text}</p>
              </div>
              <div className="who-row__img" data-reveal><Photo k={`who-${a.slug}`} alt={a.title} /></div>
            </div>
            <ServiceGrid items={a.services.map((s) => SVC[s])} />
          </div>
        </section>
      ))}
      <CtaBand />
    </div>
  );
}
