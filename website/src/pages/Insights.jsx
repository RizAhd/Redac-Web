import { useRef } from 'react';
import { PageHero, PostCards, CtaBand, usePageReveal } from '../components/blocks.jsx';

export default function Insights() {
  const ref = useRef(null);
  usePageReveal(ref);
  return (
    <div ref={ref}>
      <PageHero crumbs={[{ label: 'News and insights' }]} title="News and" accent="insights" ghost="Insights" photoKey="post-bookkeeping-habits-for-tax-time"
        lead="Practical articles on tax, bookkeeping and running a business. New articles are added every month." />
      <section className="sec"><div className="wrap"><PostCards /></div></section>
      <CtaBand />
    </div>
  );
}
