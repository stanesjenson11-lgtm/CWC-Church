import type { Metadata } from 'next';
import Link from 'next/link';
import Video from '../Video';
import { LINKS, MINISTRIES, SERVICES, photo } from '../content';
import { getVideos } from '../youtube';
import { Arrow, CTA, PageHero } from '../ui';
import SermonList from './SermonList';

export const metadata: Metadata = { title: 'Events', description: 'When Compassion Worship Center gathers: Sunday services in three languages, the New Month Promise Service and fellowships. Watch live on Sundays, or catch up on recent services.' };
export const revalidate = 3600;

const fellowships = MINISTRIES.map((m) => m.name).join(', ');
const english = SERVICES.find((s) => s.slug === 'english')!;

// Only what the church already does: Sunday services, the bilingual service that opens each month, and fellowships.
const rhythm = [
  // One row for Sundays: each service already has its own page, so it isn't repeated here.
  { when: 'Every Sunday', what: 'Sunday services', detail: SERVICES.map((s) => s.lang).join(', '), href: '/#services', cta: 'Choose a service' },
  { when: 'Each new month', what: 'New Month Promise Service', detail: 'Tamil and English, bilingual', href: '#watch', cta: 'Watch live' },
  { when: 'Fellowships', what: 'Fellowship gatherings', detail: fellowships, href: '/connect#card', cta: 'Ask when they meet' },
];

/** When we gather, then the same gatherings to watch: the live stream, every recent service, and where news goes first. */
export default async function Events() {
  const videos = await getVideos();
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
                <a className="text-link" href={r.href}>{r.cta}<Arrow /></a>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section id="watch" className="sermons-section" aria-labelledby="watch-head">
        <h2 id="watch-head" className="display recent-head" data-words>Watch live<span className="accent">.</span></h2>
        <p className="lead page-lead" data-rise>{`Every Sunday service is streamed live on our YouTube channel: English at ${english.when?.replace('Sundays · ', '')}, with Telugu and Kannada, and Tamil services too. When we’re live, it plays right here.`}</p>
        <div className="live-player" data-rise>
          <Video live title="Compassion Worship Center live stream" poster={photo('lang2').src} />
        </div>
        <div className="live-actions">
          <CTA href={LINKS.youtubeLive} label="Open on YouTube" solid cursor="YouTube" />
        </div>
      </section>

      <section id="recent" className="sermons-section" aria-labelledby="recent-head">
        <h2 id="recent-head" className="display recent-head" data-words>Recent services<span className="accent">.</span></h2>
        {videos.length ? (
          <SermonList videos={videos} />
        ) : (
          <p className="lead">Recent services couldn’t be loaded just now. Every one of them is on our YouTube channel.</p>
        )}
      </section>

      <section className="announce dark" aria-labelledby="announce-head">
        <canvas className="dissolve" data-carry="light" aria-hidden="true" />
        <canvas className="contours" data-tone="paper" aria-hidden="true" />
        <div className="announce-inner">
          <h2 id="announce-head" className="display" data-words>Special services and events are announced on our socials first<span className="accent">.</span></h2>
          <div className="announce-actions">
            <CTA href={LINKS.youtube} label="Subscribe on YouTube" cursor="Subscribe" />
            <CTA href={LINKS.instagram} label="Follow on Instagram" cursor="Follow" />
            <CTA href={LINKS.facebook} label="Follow on Facebook" cursor="Follow" />
          </div>
        </div>
      </section>
    </main>
  );
}
