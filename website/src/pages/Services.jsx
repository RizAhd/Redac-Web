import { useRef } from 'react';
import { PROCESS } from '../lib/data.js';
import { PageHero, ServiceStack, CtaBand, usePageReveal } from '../components/blocks.jsx';
import { Eyebrow } from '../components/ui.jsx';

export default function Services() {
  const ref = useRef(null);
  usePageReveal(ref);
  return (
    <div ref={ref}>
      <PageHero crumbs={[{ label: 'Services' }]} title="Our" accent="services" ghost="Services" photoKey="svc-business-tax-and-financial-reports"
        lead="Eight tax and accounting services for individuals, small businesses and companies. Choose one to see exactly what is included." />
      <section className="sec"><div className="wrap"><ServiceStack /></div></section>
      <section className="sec band-blue">
        <div className="wrap">
          <div className="head-split"><div><Eyebrow light>How it works</Eyebrow><h2 className="h2" data-split>From enquiry to <span className="accent accent--light">lodgement</span></h2></div></div>
          <ol className="steps4">
            {PROCESS.map((p, i) => (
              <li key={p.title} data-pop><b>{String(i + 1).padStart(2, '0')}</b><h3>{p.title}</h3><p>{p.text}</p></li>
            ))}
          </ol>
        </div>
      </section>
      <CtaBand />
    </div>
  );
}
