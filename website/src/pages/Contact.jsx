import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT, FAQ } from '../lib/data.js';
import { PageHero, EnquiryForm, FaqList, usePageReveal } from '../components/blocks.jsx';
import { Btn, Icon, Tbc } from '../components/ui.jsx';

function Row({ icon, label, value, href, missing }) {
  const body = <><i><Icon name={icon} /></i><span><small>{label}</small><b>{value || <Tbc label={missing} />}</b></span></>;
  return value && href ? <a className="info__row" href={href}>{body}</a> : <div className="info__row">{body}</div>;
}

export default function Contact() {
  const ref = useRef(null);
  usePageReveal(ref);
  return (
    <div ref={ref}>
      <PageHero crumbs={[{ label: 'Contact us' }]} title="Contact" accent="us" ghost="Contact" photoKey="contact"
        lead="Send an enquiry, call, or book a consultation online. We reply to every enquiry."
        facts={[{ icon: 'mail', label: 'Reply by email' }, { icon: 'calendar', label: 'Book online' }, { icon: 'shield', label: 'Details kept private' }]}
        note={{ icon: 'chat', title: 'Not sure what you need?', text: 'Tell us in a few words. We point you the right way.' }} />
      <section className="sec">
        <div className="wrap contact">
          <div className="info" data-stagger>
            <Row icon="phone" label="Call us" value={CONTACT.phone} href={CONTACT.phone && `tel:${CONTACT.phone}`} missing="Phone number" />
            <Row icon="mail" label="Email" value={CONTACT.email} href={CONTACT.email && `mailto:${CONTACT.email}`} missing="Email address" />
            <Row icon="pin" label="Office" value={CONTACT.address} missing="Office address" />
            <Row icon="clock" label="Hours" value={CONTACT.hours} missing="Business hours" />
            {CONTACT.map_embed_url
              ? <iframe className="map" src={CONTACT.map_embed_url} title="Office location" loading="lazy" />
              : <div className="map"><Icon name="pin" size={28} /><span>Map appears here once the office address is confirmed</span></div>}
            <div className="info__book">
              <b>Prefer to pick a time?</b>
              <p>Choose a day and time and we confirm by email.</p>
              <Btn to="/book" variant="white">Book a consultation</Btn>
            </div>
          </div>
          <div>
            <h2 className="h3 form-title" data-split>Send an enquiry</h2>
            <p className="muted form-sub" data-reveal>Fill in the form and we get back to you by email. Fields marked optional can be left empty.</p>
            <EnquiryForm />
            <ol className="next" data-stagger>
              <li><span>1</span><div><b>We read your enquiry</b><p>Every message goes to a person, not a queue.</p></div></li>
              <li><span>2</span><div><b>We reply by email</b><p>With next steps and the documents we may need.</p></div></li>
              <li><span>3</span><div><b>We meet</b><p>In person, by phone or online, whichever suits you.</p></div></li>
            </ol>
          </div>
        </div>
      </section>
      <section className="sec sec--tight band-light">
        <div className="wrap faq-page">
          <div className="faq-page__head"><h2 className="h3" data-split>Before you get in touch</h2><Link className="link link--big" to="/faq">All questions <Icon name="arrow" size={16} /></Link></div>
          <FaqList items={FAQ.slice(0, 4)} />
        </div>
      </section>
    </div>
  );
}
