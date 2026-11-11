import { useRef } from 'react';
import { FAQ } from '../lib/data.js';
import { PageHero, FaqList, CtaBand, usePageReveal } from '../components/blocks.jsx';
import { Btn, Eyebrow } from '../components/ui.jsx';

export default function Faq() {
  const ref = useRef(null);
  usePageReveal(ref);
  return (
    <div ref={ref}>
      <PageHero crumbs={[{ label: 'FAQ' }]} title="Frequently asked" accent="questions" ghost="FAQ"
        lead="Answers to the questions we hear most. Cannot find yours? Send us an enquiry." />
      <section className="sec">
        <div className="wrap faq-page">
          <div className="faq-page__head" data-reveal>
            <Eyebrow>Still unsure?</Eyebrow>
            <h2 className="h3">Ask us directly</h2>
            <p className="muted">Send your question and we reply by email.</p>
            <Btn to="/contact" variant="blue">Send an enquiry</Btn>
          </div>
          <FaqList items={FAQ} />
        </div>
      </section>
      <CtaBand />
    </div>
  );
}
