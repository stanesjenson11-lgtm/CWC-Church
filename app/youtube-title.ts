import type { ServiceSlug } from './content';

export type Video = { id: string; name: string; lang: ServiceSlug | 'bilingual' | null; date: string };

const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const titleCase = (s: string) => s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase()).replace(/\s+/g, ' ').trim();

/** "ONLINE l WORSHIP SUNDAY SERVICE l ENGLISH l 27-09- 2026 l CWC TV l" → name "Worship Sunday Service", lang "english". */
export function parseTitle(raw: string): Pick<Video, 'name' | 'lang'> {
  const t = decode(raw);
  const lang: Video['lang'] = /TELUGU|KANNADA|KANADA/i.test(t)
    ? 'telugu-kannada'
    : /TAMIL/i.test(t) && /ENGLISH/i.test(t)
      ? 'bilingual'
      : /TAMIL/i.test(t)
        ? 'tamil'
        : /ENGLISH/i.test(t)
          ? 'english'
          : null;
  const parts = t.split(/\s+[l|]\s+|\s*\|\s*/).map((p) => p.trim()).filter(Boolean);
  const name = parts.find((p) => !/^online$/i.test(p)) ?? t;
  return { name: titleCase(name), lang };
}
