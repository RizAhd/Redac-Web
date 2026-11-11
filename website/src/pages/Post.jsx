import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { POSTS } from '../lib/data.js';
import { PageHero, PostCards, usePageReveal } from '../components/blocks.jsx';
import { Btn } from '../components/ui.jsx';
import NotFound from './NotFound.jsx';

export default function Post() {
  const { slug } = useParams();
  const p = POSTS.find((x) => x.slug === slug);
  const ref = useRef(null);
  usePageReveal(ref);
  if (!p) return <NotFound />;
  const words = p.title.split(' ');
  const cut = Math.ceil(words.length * 0.6);
  return (
    <div ref={ref} key={slug}>
      <PageHero crumbs={[{ to: '/insights', label: 'Insights' }, { label: p.tag }]} title={words.slice(0, cut).join(' ')} accent={words.slice(cut).join(' ')}
        ghost={p.tag.split(' ')[0]} photoKey={`post-${p.slug}`} lead={p.excerpt} />
      <section className="sec">
        <div className="wrap article">
          <article className="prose" data-reveal>
            {p.body.map((para, i) => (para.startsWith('## ') ? <h2 key={i}>{para.slice(3)}</h2> : <p key={i}>{para}</p>))}
          </article>
          <aside className="side-card" data-reveal>
            <h3>Need a hand?</h3>
            <p>Talk to us about your situation.</p>
            <Btn to="/book" variant="white">Book a consultation</Btn>
          </aside>
        </div>
      </section>
      <section className="sec band-light">
        <div className="wrap"><h2 className="h3 more-title" data-split>More articles</h2><PostCards items={POSTS.filter((x) => x.slug !== slug)} /></div>
      </section>
    </div>
  );
}
