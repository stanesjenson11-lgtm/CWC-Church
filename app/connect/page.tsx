import type { Metadata } from 'next';
import { CONNECT_INTRO, GIVE_VERSE, LINKS } from '../content';
import { Brackets, CTA } from '../ui';
import ConnectCard from './ConnectCard';

export const metadata: Metadata = { title: 'Connect', description: `${CONNECT_INTRO} Give in person on Sunday, or call us for other ways to give.` };

/** Give, then the connect card. Phone, address and socials live in the footer. */
export default function Connect() {
  return (
    <main>
      <h1 className="sr-only">Give and connect</h1>

      <section id="give" className="give-verse dark" aria-label={GIVE_VERSE.ref}>
        <canvas className="contours" data-tone="paper" aria-hidden="true" />
        <blockquote>
          <p className="display give-quote" data-words>{GIVE_VERSE.text}</p>
          <footer className="credit" data-rise>{GIVE_VERSE.ref} · KJV</footer>
        </blockquote>
      </section>

      <section className="give-ways" aria-labelledby="give-ways-head">
        <h2 id="give-ways-head" className="display" data-words>How to give<span className="accent">.</span></h2>
        <p className="lead give-lead" data-rise>Your giving keeps the doors open, the services running and our outreach serving the community around us. Thank you.</p>
        <div className="give-grid">
          <div className="bpanel" data-rise>
            <Brackets />
            <p className="eyebrow accent">At church</p>
            <p className="give-title">During any Sunday service</p>
            <p className="give-copy">Give in person during the English, Telugu and Kannada, or Tamil service.</p>
          </div>
          <div className="bpanel" data-rise>
            <Brackets />
            <p className="eyebrow accent">Any other way</p>
            <p className="give-title">Call the church office</p>
            <p className="give-copy">We’ll walk you through the other ways to give.</p>
            <CTA href={LINKS.tel} label={LINKS.phone} cursor="Call" />
          </div>
        </div>
      </section>

      <section id="card" className="connect-card dark" aria-labelledby="card-head">
        <canvas className="dissolve" data-carry="light" aria-hidden="true" />
        <div className="connect-card-inner">
          <div className="card-intro">
            <h2 id="card-head" className="display" data-words>Connect card<span className="accent">.</span></h2>
            <p className="lead" data-rise>New here, or ready to take a next step? Tell us a little about you and someone from the church will be in touch.</p>
          </div>
          <ConnectCard />
        </div>
      </section>
    </main>
  );
}
