'use client';
import { useState } from 'react';
import { CHANNEL_ID } from './content';

/**
 * A YouTube player that costs nothing until pressed: a poster and a play button, swapped for the
 * real (privacy-enhanced) embed on click. Keeps phones from loading a megabyte of player per video.
 */
export default function Video({ id, title, poster, live }: { id?: string; title: string; poster?: string; live?: boolean }) {
  const [on, setOn] = useState(false);
  const src = live
    ? `https://www.youtube-nocookie.com/embed/live_stream?channel=${CHANNEL_ID}&autoplay=1`
    : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
  const thumb = poster ?? `https://i.ytimg.com/vi/${id}/hq720.jpg`;

  if (on)
    return (
      <div className="video">
        <iframe src={src} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      </div>
    );
  return (
    <button className="video video-poster" onClick={() => setOn(true)} data-cursor="Play" aria-label={`Play: ${title}`}>
      <img src={thumb} alt="" loading="lazy" decoding="async" onError={(e) => { if (id) e.currentTarget.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`; }} />
      <span className="video-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg></span>
    </button>
  );
}
