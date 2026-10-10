import type { Metadata } from 'next';
import { GIVE_VERSE, LINKS } from '../content';
import { Brackets, CTA, PageHero } from '../ui';

export const metadata: Metadata = { title: 'Give', description: 'Give to Compassion Worship Center in person on Sunday, or call us for other ways to give.' };

export default function Give() {
  return (
    <main>
      <PageHero title="Give" lead="Your giving keeps the doors open, the services running and our outreach serving the community around us. Thank you." />

      <section className="give-verse dark" aria-label={GIVE_VERSE.ref}>
        <canvas className="dissolve" data-carry="light" aria-hidden="true" />
        <canvas className="contours" data-tone="paper" aria-hidden="true" />
        <blockquote>
          <p className="display give-quote" data-words>{GIVE_VERSE.text}</p>
          <footer className="credit" data-rise>{GIVE_VERSE.ref} · KJV</footer>
        </blockquote>
      </section>

      <section className="give-ways" aria-labelledby="give-ways-head">
        <h2 id="give-ways-head" className="display" data-words>How to give<span className="accent">.</span></h2>
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
    </main>
  );
}
