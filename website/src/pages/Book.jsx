import { useMemo, useRef, useState } from 'react';
import { INTEGRATIONS } from '../lib/data.js';
import { PageHero, EnquiryForm, usePageReveal } from '../components/blocks.jsx';

const TIMES = ['9:00 am', '10:00 am', '11:00 am', '1:00 pm', '2:00 pm', '3:00 pm'];
const fmt = (d) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

function Calendar({ onPick }) {
  const today = useMemo(() => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; }, []);
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const first = (view.getDay() + 6) % 7;
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const canPrev = view > new Date(today.getFullYear(), today.getMonth(), 1);
  const pick = (t) => { setTime(t); onPick(`${fmt(day)} at ${t}`); };
  return (
    <div className="cal" data-reveal>
      <div className="cal__head">
        <b>{view.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</b>
        <div className="cal__nav">
          <button type="button" aria-label="Previous month" disabled={!canPrev} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}>&larr;</button>
          <button type="button" aria-label="Next month" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}>&rarr;</button>
        </div>
      </div>
      <div className="cal__grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <span className="dow" key={d}>{d}</span>)}
        {Array.from({ length: first }, (_, i) => <span key={`e${i}`} />)}
        {Array.from({ length: days }, (_, i) => {
          const d = new Date(view.getFullYear(), view.getMonth(), i + 1);
          const off = d < today || d.getDay() === 0 || d.getDay() === 6;
          const on = day && d.getTime() === day.getTime();
          return <button type="button" key={i} disabled={off} aria-pressed={!!on} aria-label={fmt(d)} onClick={() => { setDay(d); setTime(null); onPick(''); }}>{i + 1}</button>;
        })}
      </div>
      <div className="slots">
        {day ? TIMES.map((t) => <button type="button" key={t} aria-pressed={time === t} onClick={() => pick(t)}>{t}</button>) : <p>Choose a day to see available times.</p>}
      </div>
      {day && time && <p className="picked">Selected: {fmt(day)} at {time}</p>}
    </div>
  );
}

export default function Book() {
  const ref = useRef(null);
  const [slot, setSlot] = useState('');
  usePageReveal(ref);
  return (
    <div ref={ref}>
      <PageHero crumbs={[{ label: 'Book a consultation' }]} title="Book a" accent="consultation" ghost="Book" photoKey="step-book"
        lead="Pick a day and time, tell us what you need, and we confirm by email."
        facts={[{ icon: 'calendar', label: 'Weekdays' }, { icon: 'mail', label: 'Confirmed by email' }, { icon: 'chat', label: 'In person or online' }]} note={{ icon: 'clock', title: 'Takes 2 minutes', text: 'Choose a time, add your details.' }} />
      <section className="sec">
        <div className="wrap">
          {INTEGRATIONS.calendly_url
            ? <iframe className="calendly" src={INTEGRATIONS.calendly_url} title="Book a consultation" />
            : (
              <div className="booker">
                <Calendar onPick={setSlot} />
                <div><h2 className="h3 form-title" data-split>Your details</h2><EnquiryForm submitLabel="Book a consultation" slot={slot} /></div>
              </div>
            )}
        </div>
      </section>
    </div>
  );
}
