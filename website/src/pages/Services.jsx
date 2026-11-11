import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { PROCESS, AUDIENCES, SVC, FAQ } from '../lib/data.js';
import { PageHero, ServiceList, Steps, CtaBand, FaqList, usePageReveal } from '../components/blocks.jsx';
import { Eyebrow, Icon, Photo } from '../components/ui.jsx';

export default function Services() {
  const ref = useRef(null);
  usePageReveal(ref);
  return (
    <div ref={ref}>
      <PageHero crumbs={[{ label: 'Services' }]} title="Our" accent="services" ghost="Services" photoKey="svc-business-tax-and-financial-reports"
        lead="Eight tax and accounting services for individuals, small businesses and companies. Choose one to see exactly what is included."
        facts={[{ icon: 'doc', label: '8 services' }, { icon: 'person', label: 'Individuals and businesses' }, { icon: 'check', label: 'You approve first' }]}
        note={{ icon: 'calendar', title: 'Book online', text: 'Pick a time that suits you.' }} />

      <section className="sec">
        <div className="wrap">
          <div className="head-split">
            <div><Eyebrow n="01">All services</Eyebrow><h2 className="h2" data-split>Choose a <span className="accent">service</span></h2></div>
            <p className="lead muted" data-words>Hover a service to preview it, or open it to see what is included and who it is for.</p>
          </div>
          <ServiceList />
        </div>
      </section>

      <section className="sec band-light">
        <div className="wrap">
          <div className="head-split">
            <div><Eyebrow n="02">By client</Eyebrow><h2 className="h2" data-split>Find yours by <span className="accent">who you are</span></h2></div>
          </div>
          <div className="aud" data-stagger>
            {AUDIENCES.map((a) => (
              <article className="aud__card" key={a.slug}>
                <div className="aud__img"><Photo k={`who-${a.slug}`} alt={a.title} /></div>
                <div className="aud__body">
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                  <ul>{a.services.map((s) => <li key={s}><Link to={`/services/${s}`}>{SVC[s].title}<Icon name="arrow" size={14} /></Link></li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="head-split"><div><Eyebrow n="03">How it works</Eyebrow><h2 className="h2" data-split>From enquiry to <span className="accent">lodgement</span></h2></div></div>
          <Steps items={PROCESS} />
        </div>
      </section>

      <section className="sec sec--tight">
        <div className="wrap faq-page">
          <div className="faq-page__head"><h2 className="h3" data-split>Common questions</h2><Link className="link link--big" to="/faq">All questions <Icon name="arrow" size={16} /></Link></div>
          <FaqList items={FAQ.slice(0, 4)} />
        </div>
      </section>
      <CtaBand />
    </div>
  );
}
