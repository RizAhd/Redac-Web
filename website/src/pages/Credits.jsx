import { useRef } from 'react';
import { CREDITS } from '../lib/data.js';
import { PageHero, usePageReveal } from '../components/blocks.jsx';

export default function Credits() {
  const ref = useRef(null);
  usePageReveal(ref);
  return (
    <div ref={ref}>
      <PageHero crumbs={[{ label: 'Photo credits' }]} title="Photo" accent="credits" ghost="Credits" lead="Photographs used on this site and their licences." />
      <section className="sec">
        <div className="wrap">
          <div className="prose prose--narrow" data-reveal>
            <p>These openly licensed photographs are stand-ins and will be replaced with REDAC's own photographs where available.</p>
            <ul>
              {CREDITS.map((c) => (
                <li key={c.file}>
                  <b>{c.title || c.file}</b><br />
                  by {c.creator || 'unknown'}, licence <a href={c.license_url} rel="noopener noreferrer" target="_blank">{String(c.license).toUpperCase()}</a>, <a href={c.source} rel="noopener noreferrer" target="_blank">source</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
