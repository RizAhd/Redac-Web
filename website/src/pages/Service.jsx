import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SVC, SERVICES, FAQ } from '../lib/data.js';
import { PageHero, ServiceGrid, CtaBand, Steps, FaqList, StatusCard, usePageReveal } from '../components/blocks.jsx';
import { Btn, Icon, Eyebrow, Photo } from '../components/ui.jsx';
import NotFound from './NotFound.jsx';

export default function Service() {
  const { slug } = useParams();
  const s = SVC[slug];
  const ref = useRef(null);
  usePageReveal(ref);
  if (!s) return <NotFound />;
  const n = SERVICES.indexOf(s) + 1;
  const words = s.title.split(' ');
  const cut = Math.ceil(words.length / 2);
  const others = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 4);
  const steps = [
    { title: 'Book', text: `Choose a time or send an enquiry about ${s.title.replace(/^(\w)(\w*\s)/, (m, a, b) => (/[A-Z]{2}/.test(m) ? m : a.toLowerCase() + b))}.`, icon: 'calendar' },
    { title: 'Share', text: 'We tell you which documents we need and go through them with you.', icon: 'chat' },
    { title: 'Approve', text: 'We prepare the work. Nothing is lodged until you agree.', icon: 'check' },
  ];
  return (
    <div ref={ref} key={slug}>
      <PageHero crumbs={[{ to: '/services', label: 'Services' }, { label: s.title }]} title={words.slice(0, cut).join(' ')} accent={words.slice(cut).join(' ')}
        ghost={String(n).padStart(2, '0')} photoKey={`svc-${s.slug}`} lead={s.intro}
        facts={s.tags.map((t) => ({ icon: s.icon, label: t }))}
        note={{ icon: 'check', title: 'You approve first', text: 'Nothing is lodged until you agree.' }}>
        <div className="btn-row" data-reveal><Btn to="/book">Book a consultation</Btn><Btn to="/contact" variant="outline" arrow={false}>Ask a question</Btn></div>
      </PageHero>

      <section className="sec">
        <div className="wrap svc-detail">
          <div>
            <Eyebrow n="01">What is included</Eyebrow>
            <h2 className="h2" data-split>What we do <span className="accent">for you</span></h2>
            <ol className="incl" data-stagger>
              {s.includes.map((x, i) => (
                <li key={x}><span>{String(i + 1).padStart(2, '0')}</span><b>{x}</b><Icon name="check" size={20} /></li>
              ))}
            </ol>
          </div>
          <aside className="side-card" data-reveal>
            <div className="side-card__img"><Photo k={`svc-${s.slug}`} alt="" /><span className="side-card__ico"><Icon name={s.icon} size={26} /></span></div>
            <div className="side-card__body">
              <h3>Who it is for</h3>
              <ul>{s.for.map((x) => <li key={x}>{x}</li>)}</ul>
              <Btn to="/book" variant="white">Book a consultation</Btn>
              <Link className="link link--light" to="/contact">Or send an enquiry <Icon name="arrow" size={14} /></Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="sec band-light">
        <div className="wrap split2">
          <div>
            <Eyebrow n="02">How it works</Eyebrow>
            <h2 className="h2" data-split>Three simple <span className="accent">steps</span></h2>
            <p className="lead muted" data-words>You always know where your work is. We keep you updated at every step and nothing goes out without your approval.</p>
            <StatusCard className="status--float" />
          </div>
          <Steps items={steps} />
        </div>
      </section>

      <section className="sec sec--tight">
        <div className="wrap faq-page">
          <div className="faq-page__head"><h2 className="h3" data-split>Questions about this service</h2><Link className="link link--big" to="/faq">All questions <Icon name="arrow" size={16} /></Link></div>
          <FaqList items={FAQ.slice(0, 4)} />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="head-split"><div><Eyebrow n="03">More services</Eyebrow><h2 className="h2" data-split>Other <span className="accent">services</span></h2></div><Link className="link link--big" to="/services">All services <Icon name="arrow" size={16} /></Link></div>
          <ServiceGrid items={others} />
        </div>
      </section>
      <CtaBand />
    </div>
  );
}
