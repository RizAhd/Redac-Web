import { useRef } from 'react';
import { C, CONTACT } from '../lib/data.js';
import { PageHero, usePageReveal } from '../components/blocks.jsx';
import { Tbc } from '../components/ui.jsx';

function LegalPage({ title, accent, ghost, lead, children }) {
  const ref = useRef(null);
  usePageReveal(ref);
  return (
    <div ref={ref}>
      <PageHero crumbs={[{ label: `${title} ${accent}` }]} title={title} accent={accent} ghost={ghost} lead={lead} />
      <section className="sec">
        <div className="wrap">
          <div className="prose prose--narrow" data-reveal>
            <p><span className="todo">Draft for review: to be checked and approved by REDAC &amp; Associates before publication.</span></p>
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}

export function Privacy() {
  return (
    <LegalPage title="Privacy" accent="policy" ghost="Privacy" lead="How we collect, use and protect your personal information.">
      <h2>Information we collect</h2><p>When you send an enquiry or book a consultation, we collect the details you give us, such as your name, email address, phone number and message.</p>
      <h2>How we use it</h2><p>We use your information to respond to your enquiry, arrange consultations and provide our services. We do not sell your personal information.</p>
      <h2>How we protect it</h2><p>The website uses an encrypted connection (HTTPS), and access to client information is limited to the people who need it to do their work.</p>
      <h2>Your choices</h2><p>You can ask to see, correct or delete the personal information we hold about you by contacting us.</p>
      <h2>Contact</h2><p>Questions about this policy: {CONTACT.email || <Tbc label="Contact email" />}</p>
    </LegalPage>
  );
}

export function Terms() {
  return (
    <LegalPage title="Disclaimer" accent="and terms" ghost="Terms" lead="The terms that apply when you use this website.">
      <h2>General information only</h2><p>Content on this website is general information and does not take your personal circumstances into account. It is not financial, tax or legal advice. Please book a consultation before acting on it.</p>
      <h2>No liability for reliance</h2><p>While we take care to keep information accurate and current, we do not accept responsibility for loss arising from reliance on the content of this website.</p>
      <h2>Third-party links and services</h2><p>This website may link to or use third-party services, such as an online booking tool. Their own terms and privacy policies apply.</p>
      <h2>Copyright</h2><p>The content and design of this website belong to {C.name}, except where third-party licences apply.</p>
    </LegalPage>
  );
}
