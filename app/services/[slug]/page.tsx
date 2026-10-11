import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Video from '../../Video';
import { ADDRESS, LINKS, SERVICES, serviceBySlug } from '../../content';
import { getVideos } from '../../youtube';
import { Arrow, CTA, Plate } from '../../ui';

export const revalidate = 3600;
export const generateStaticParams = () => SERVICES.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = serviceBySlug((await params).slug);
  return s ? { title: `${s.lang} service`, description: `The ${s.lang} Sunday service at Compassion Worship Center, Hennur Gardens, Bengaluru.` } : {};
}

const day = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
const SCRIPT: Record<string, string> = { 'telugu-kannada': 'te', tamil: 'ta', english: 'en' };

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = serviceBySlug((await params).slug);
  if (!s) notFound();
  const latest = (await getVideos()).find((v) => v.lang === s.slug);
  const others = SERVICES.filter((o) => o.slug !== s.slug);

  return (
    <main>
      {/* Each language page opens with the welcome the old site gave it, in its own script. */}
      <section className="lang-hero dark">
        <canvas className="contours" data-tone="paper" aria-hidden="true" />
        <div className="lang-hero-inner">
          <p className="eyebrow lang-kicker">{s.lang} service</p>
          <h1 className={`lang-greeting script-${s.slug}`} lang={SCRIPT[s.slug]} data-words>{s.greeting}</h1>
          <div className="lang-facts" data-rise>
            <p><span className="eyebrow accent">When</span>{s.when ?? `Sundays · Call ${LINKS.phone} for the time`}</p>
            <p><span className="eyebrow accent">Where</span>{ADDRESS[0]}, Bengaluru</p>
          </div>
          <div className="lang-actions">
            <CTA href={`/connect?service=${s.slug}#card`} label="Get in touch" solid cursor="Connect" />
            <CTA href="/events#watch" label="Watch live" cursor="Live" />
          </div>
        </div>
        <div className="lang-plate" data-drift>
          <Plate name={s.photo} alt={s.alt} sizes="(max-width: 900px) 90vw, 45vw" />
        </div>
      </section>

      <section className="lang-latest" aria-labelledby="latest-head">
        <canvas className="dissolve" data-carry="dark" aria-hidden="true" />
        <h2 id="latest-head" className="display" data-words>Last Sunday in {s.lang}<span className="accent">.</span></h2>
        {latest ? (
          <div className="lang-video" data-rise>
            <Video id={latest.id} title={latest.name} />
            <p className="lang-video-meta"><span className="eyebrow accent">{day.format(new Date(latest.date))}</span>{latest.name}</p>
          </div>
        ) : (
          <p className="lead">The latest service will appear here. Meanwhile, every service is on our YouTube channel.</p>
        )}
        <div className="lang-more">
          <Link className="text-link" href={`/events?lang=${s.slug}#recent`}>More {s.lang} services<Arrow /></Link>
          <span className="lang-also">
            Also at CWC:{' '}
            {others.map((o, i) => (
              <span key={o.slug}>
                {i > 0 && ' · '}
                <Link className="text-link" href={`/services/${o.slug}`}>{o.lang}</Link>
              </span>
            ))}
          </span>
        </div>
      </section>
    </main>
  );
}
