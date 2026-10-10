import type { Metadata } from 'next';
import Link from 'next/link';
import { LINKS, MINISTRIES, SERVICES } from '../content';
import { Arrow, CTA, PageHero } from '../ui';

export const metadata: Metadata = { title: 'Events', description: 'When Compassion Worship Center gathers: Sunday services in three languages, the New Month Promise Service, and fellowships.' };

const fellowships = MINISTRIES.map((m) => m.name).join(', ');

// Only what the church already does: Sunday services, the bilingual service that opens each month, and fellowships.
const rhythm = [
  // One row for Sundays: each service already has its own page, so it isn't repeated here.
  { when: 'Every Sunday', what: 'Sunday services', detail: SERVICES.map((s) => s.lang).join(', '), href: '/#services', cta: 'Choose a service' },
  { when: 'Each new month', what: 'New Month Promise Service', detail: 'Tamil and English, bilingual', href: '/watch', cta: 'Watch live' },
  { when: 'Fellowships', what: 'Fellowship gatherings', detail: fellowships, href: '/connect#card', cta: 'Ask when they meet' },
];

export default function Events() {
  return (
    <main>
      <PageHero title="When we gather" lead="Sundays are the heartbeat of the house. Here’s our rhythm, and where to hear about what’s coming up next." />

      <section className="rhythm" aria-label="Our rhythm">
        <ol className="rhythm-list">
          {rhythm.map((r) => (
            <li key={r.what} className="rhythm-row" data-rise>
              <p className="rhythm-when">{r.when}</p>
              <h2 className="rhythm-what">{r.what}</h2>
              <p className="rhythm-detail">{r.detail}</p>
              {r.href.startsWith('/') ? (
                <Link className="text-link" href={r.href}>{r.cta}<Arrow /></Link>
              ) : (
                <a className="text-link" href={r.href} target="_blank" rel="noreferrer">{r.cta}<Arrow /></a>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="announce dark" aria-labelledby="announce-head">
        <canvas className="dissolve" data-carry="light" aria-hidden="true" />
        <canvas className="contours" data-tone="paper" aria-hidden="true" />
        <div className="announce-inner">
          <h2 id="announce-head" className="display" data-words>Special services and events are announced on our socials first<span className="accent">.</span></h2>
          <div className="announce-actions">
            <CTA href={LINKS.instagram} label="Follow on Instagram" cursor="Follow" />
            <CTA href={LINKS.facebook} label="Follow on Facebook" cursor="Follow" />
          </div>
        </div>
      </section>
    </main>
  );
}
