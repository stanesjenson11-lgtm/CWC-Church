import { CHANNEL_ID } from './content';
import { parseTitle, type Video } from './youtube-title';

export type { Video };

/** The channel's own feed: the latest 15 uploads. Refreshed hourly; an outage returns an empty list, never an error page. */
export async function getVideos(): Promise<Video[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([, e]) => {
      const id = e.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
      const title = e.match(/<title>(.*?)<\/title>/)?.[1];
      const date = e.match(/<published>(.*?)<\/published>/)?.[1];
      return id && title && date ? [{ id, date: date.slice(0, 10), ...parseTitle(title) }] : [];
    });
  } catch {
    return [];
  }
}
