// Run: node scripts/check-youtube.ts — the one check for the YouTube title parser.
import assert from 'node:assert/strict';
import { parseTitle } from '../app/youtube-title.ts';

assert.deepEqual(parseTitle('ONLINE l WORSHIP SUNDAY SERVICE l ENGLISH l 27-09- 2026 l CWC TV l'), { name: 'Worship Sunday Service', lang: 'english' });
assert.deepEqual(parseTitle('ONLINE l WORSHIP SUNDAY SERVICE l TELUGU l KANADA l 20-09- 2026 l CWC TV l'), { name: 'Worship Sunday Service', lang: 'telugu-kannada' });
assert.deepEqual(parseTitle('ONLINE l NEW MONTH PROMISE  SERVICE l TAMIL &amp;  ENGLISH BILINGUAL l 01-10- 2026 l CWC TV l'), { name: 'New Month Promise Service', lang: 'bilingual' });
assert.deepEqual(parseTitle('ONLINE l COMMUNION SUNDAY WORSHIP  SERVICE l TAMIL  l 04-10- 2026 l CWC TV l'), { name: 'Communion Sunday Worship Service', lang: 'tamil' });
assert.deepEqual(parseTitle('You Lifted Me Up | Compassion worship center | English Service | Live Church Worship'), { name: 'You Lifted Me Up', lang: 'english' });
console.log('parseTitle ok');
