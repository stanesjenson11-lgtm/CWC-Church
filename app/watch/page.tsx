import type { Metadata } from 'next';
import Video from '../Video';
import { LINKS, SERVICES, photo } from '../content';
import { getVideos } from '../youtube';
import { CTA, PageHero } from '../ui';
import SermonList from './SermonList';

export const metadata: Metadata = { title: 'Watch', description: 'Watch Compassion Worship Center live on Sundays, or catch up on recent services in English, Tamil, Telugu and Kannada.' };
export const revalidate = 3600;

const english = SERVICES.find((s) => s.slug === 'english')!;

/** Live and past services on one page: the stream on top, every recent service below. */
export default async function Watch() {
  const videos = await getVideos();
  return (
    <main>
      <PageHero title="Watch" lead={`Every Sunday service is streamed live on our YouTube channel: English at ${english.when?.replace('Sundays · ', '')}, with Telugu and Kannada, and Tamil services too. When we’re live, it plays right here.`}>
        <div className="live-player" data-rise>
          <Video live title="Compassion Worship Center live stream" poster={photo('lang2').src} />
        </div>
        <div className="live-actions">
          <CTA href={LINKS.youtubeLive} label="Open on YouTube" solid cursor="YouTube" />
        </div>
      </PageHero>

      <section id="recent" className="sermons-section" aria-labelledby="recent-head">
        <h2 id="recent-head" className="display recent-head" data-words>Recent services<span className="accent">.</span></h2>
        {videos.length ? (
          <SermonList videos={videos} />
        ) : (
          <p className="lead">Recent services couldn’t be loaded just now. Every one of them is on our YouTube channel.</p>
        )}
        <CTA href={LINKS.youtube} label="All services on YouTube" cursor="YouTube" />
      </section>
    </main>
  );
}
