import { useRef } from 'react';
import { CONTACT } from '../lib/data.js';
import { PageHero, EnquiryForm, usePageReveal } from '../components/blocks.jsx';
import { Icon, Tbc } from '../components/ui.jsx';

function Row({ icon, label, value, href, missing }) {
  const body = <><i><Icon name={icon} /></i><span><small>{label}</small><b>{value || <Tbc label={missing} />}</b></span></>;
  return value && href ? <a className="info__row" href={href} data-reveal>{body}</a> : <div className="info__row" data-reveal>{body}</div>;
}

export default function Contact() {
  const ref = useRef(null);
  usePageReveal(ref);
  return (
    <div ref={ref}>
      <PageHero crumbs={[{ label: 'Contact us' }]} title="Contact" accent="us" ghost="Contact" photoKey="contact"
        lead="Send an enquiry, call, or book a consultation online. We reply to every enquiry." />
      <section className="sec">
        <div className="wrap contact">
          <div className="info">
            <Row icon="phone" label="Call us" value={CONTACT.phone} href={CONTACT.phone && `tel:${CONTACT.phone}`} missing="Phone number" />
            <Row icon="mail" label="Email" value={CONTACT.email} href={CONTACT.email && `mailto:${CONTACT.email}`} missing="Email address" />
            <Row icon="pin" label="Office" value={CONTACT.address} missing="Office address" />
            <Row icon="clock" label="Hours" value={CONTACT.hours} missing="Business hours" />
            {CONTACT.map_embed_url
              ? <iframe className="map" src={CONTACT.map_embed_url} title="Office location" loading="lazy" />
              : <div className="map" data-reveal><span>Google Map appears here once the office address is confirmed</span></div>}
          </div>
          <div>
            <h2 className="h3 form-title" data-split>Send an enquiry</h2>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
}
