'use client';
import { useEffect, useRef, useState } from 'react';
import Video from '../Video';
import { SERVICES } from '../content';
import type { Video as V } from '../youtube';

const FILTERS = [{ slug: 'all', lang: 'All' }, ...SERVICES.map(({ slug, lang }) => ({ slug, lang }))];
const LABEL: Record<string, string> = Object.fromEntries([...SERVICES.map((s) => [s.slug, s.lang]), ['bilingual', 'Tamil & English']]);
const day = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function SermonList({ videos }: { videos: V[] }) {
  const [filter, setFilter] = useState('all');
  const [picked, setPicked] = useState<string | null>(null);
  const player = useRef<HTMLDivElement>(null);

  // A language page links here as /events?lang=tamil#recent.
  useEffect(() => {
    const lang = new URLSearchParams(location.search).get('lang');
    if (lang && FILTERS.some((f) => f.slug === lang)) setFilter(lang);
  }, []);

  const shown = videos.filter((v) => filter === 'all' || v.lang === filter || (v.lang === 'bilingual' && (filter === 'tamil' || filter === 'english')));
  const current = shown.find((v) => v.id === picked) ?? shown[0];

  return (
    <div className="sermons">
      <div className="chips" role="group" aria-label="Filter by language">
        {FILTERS.map((f) => (
          <button key={f.slug} className="chip" aria-pressed={filter === f.slug} onClick={() => (setFilter(f.slug), setPicked(null))}>
            {f.lang}
          </button>
        ))}
      </div>

      {current ? (
        <>
          <div className="sermon-now" ref={player}>
            <Video key={current.id} id={current.id} title={current.name} />
            <div className="sermon-now-text">
              <p className="eyebrow accent">{current.lang ? LABEL[current.lang] : 'Service'} · {day.format(new Date(current.date))}</p>
              <h3 className="display sermon-title">{current.name}</h3>
            </div>
          </div>
          <ul className="sermon-grid">
            {shown.map((v) => (
              <li key={v.id}>
                <button
                  className="sermon-card"
                  aria-current={v.id === current.id || undefined}
                  onClick={() => {
                    setPicked(v.id);
                    player.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  <img src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`} alt="" loading="lazy" decoding="async" />
                  <span className="sermon-card-meta">{v.lang ? LABEL[v.lang] : 'Service'} · {day.format(new Date(v.date))}</span>
                  <span className="sermon-card-title">{v.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="lead">No services in this language yet. Try another, or open the channel on YouTube.</p>
      )}
    </div>
  );
}
