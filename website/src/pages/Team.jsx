import { useRef } from 'react';
import { TEAM } from '../lib/data.js';
import { PageHero, CtaBand, usePageReveal } from '../components/blocks.jsx';
import { Icon, Tbc } from '../components/ui.jsx';

export default function Team() {
  const ref = useRef(null);
  usePageReveal(ref);
  return (
    <div ref={ref}>
      <PageHero crumbs={[{ to: '/about', label: 'About' }, { label: 'Our team' }]} title="Our" accent="team" ghost="Team" photoKey="cta"
        lead="The people behind REDAC & Associates. Qualified, approachable and easy to reach."
        facts={[{ icon: 'chat', label: 'Same people every time' }, { icon: 'shield', label: 'Registered professionals' }]}
        note={{ icon: 'person', title: 'Meet us first', text: 'Your first consultation is a conversation.' }} />
      <section className="sec">
        <div className="wrap team" data-stagger>
          {TEAM.map((m, i) => (
            <article className="member" key={i}>
              <div className="member__ph">
                {m.photo ? <img src={`${import.meta.env.BASE_URL}img/team/${m.photo}`} alt={m.name || ''} loading="lazy" /> : <><Icon name="user" size={96} /><em>Photo from REDAC</em></>}
              </div>
              <div className="member__body">
                <h3>{m.name || 'Team member'}</h3>
                <p className="member__role">{m.role || 'Role to be confirmed'}</p>
                {m.qualifications && <p>{m.qualifications}</p>}
                <p>{m.bio || <Tbc label="Name, qualifications and bio" />}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CtaBand title="Talk to" accent="our team" text="Book a consultation and meet the people who will look after your tax and accounts." />
    </div>
  );
}
