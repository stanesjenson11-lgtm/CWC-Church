// Every fact and sentence on the site lives here once, so no page repeats another's copy.
// Wording marked "old site" is the church's own, from cwcindia.org.

export const CHURCH = {
  name: 'Compassion Worship Center',
  short: 'CWC',
  tagline: 'A place to grow in faith, experience powerful worship, and build meaningful community.', // old site
  bio: 'Reaching, touching and changing lives in the name of Jesus.', // Instagram bio
};

export const LINKS = {
  maps: 'https://maps.app.goo.gl/jeS5XHMwu5tMQQ9Y6',
  instagram: 'https://www.instagram.com/compassionworshipcenter/',
  facebook: 'https://www.facebook.com/CompassionWorshipCenter',
  youtube: 'https://www.youtube.com/@Compassionworshipcenter',
  youtubeLive: 'https://www.youtube.com/@Compassionworshipcenter/live',
  phone: '+91 94836 81892',
  tel: 'tel:+919483681892',
  whatsapp: '919483681892',
};

export const CHANNEL_ID = 'UC8qJgB3JGFFNbXQCBEbibew';
export const ADDRESS = ['Vadarapalya, Hennur Gardens', 'Bengaluru, Karnataka 560113'];

export const NAV = [
  ['/about', 'About'],
  ['/events', 'Events'],
  ['/connect', 'Connect'],
] as const;

export type ServiceSlug = 'telugu-kannada' | 'tamil' | 'english';
export const SERVICES: {
  slug: ServiceSlug;
  lang: string;
  greeting: string; // the old site's own welcome on each language page
  when: string | null; // null until the church confirms a time
  photo: string;
  alt: string;
}[] = [
  { slug: 'telugu-kannada', lang: 'Telugu / Kannada', greeting: 'స్వాగతం / ಸ್ವಾಗತ', when: null, photo: 'lang1', alt: 'A worship leader leading the congregation from the stage' },
  { slug: 'tamil', lang: 'Tamil', greeting: 'வரவேற்கிறோம்', when: null, photo: 'lang3', alt: 'The congregation worshipping with hands raised under the stage lights' },
  { slug: 'english', lang: 'English', greeting: 'Welcome', when: 'Sundays · 11:30 AM', photo: 'lang2', alt: 'The main hall during a Sunday service, lit from the stage' },
];
export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const WELCOME =
  'We are a community built on worship, faith, and connection. Whether you’re exploring faith or looking for a church family, you’ll find a place here.'; // old site

export const STORY = [
  'Compassion Worship Center exists to lead people into a meaningful relationship with Jesus and to build a community rooted in faith, love, and purpose.',
  'What began as a small gathering has grown into a church where people from different walks of life come together to worship, learn, and support one another. Our focus is simple—create a place where anyone can feel welcomed, connected, and encouraged in their journey of faith.',
]; // old site

export const VALUES = [
  { word: 'Worship', img: 'w4', copy: 'We believe in wholehearted, spirit-filled worship that brings people closer to God.' },
  { word: 'Word', img: 'w5', copy: 'We are grounded in the Bible, teaching practical truths that guide everyday life.' },
  { word: 'Community', img: 'w11', copy: 'We build strong relationships where people support, grow, and walk together.' },
  { word: 'Mission', img: 'w2', copy: 'We are committed to outreach—serving people and impacting lives beyond the church.' },
]; // old site

export const MINISTRIES = [
  { name: "The King's Men", who: "Men's fellowship", img: 'w6', copy: 'A space for men to grow in faith, build strength, and walk in accountability together.' },
  { name: 'Ladies of the Light', who: "Women's fellowship", img: 'w7', copy: 'A community of women growing in faith, encouragement, and purpose.' },
  { name: 'Zois', who: 'Youth church', img: 'w9', copy: 'A vibrant space for young people to discover identity, purpose, and faith.' },
  { name: 'KiKin Kids', who: 'Kids church', img: 'w8', copy: 'A safe and engaging environment where children learn and grow in faith.' },
]; // old site

export const LEADERSHIP_INTRO =
  'Our pastors and leaders are dedicated to guiding the church with integrity, care, and a heart for people. They are here to support you, pray with you, and help you grow in your faith journey.'; // old site

export const LEADERS = [
  ['pm', 'Pradeep Mcwin'],
  ['pk', 'Pichai Kani'],
  ['yk', 'Yohan Kondepogu'],
  ['ac', 'Anthony Christopher'],
] as const;

export const OUTREACH =
  'Our Outreach Ministry is committed to serving those in need, sharing love and hope through various programs and initiatives. We tirelessly work toward reaching marginalized groups and serving under-resourced communities, embodying the love of Christ in all we do. By partnering with local organizations and engaging in service projects, we aim to uplift the community and show God’s love through action.'; // old site

export const CONNECT_INTRO = 'We’re here to help. Reach out with any questions or connect with us directly.'; // old site

export const GIVE_VERSE = {
  text: 'Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver.',
  ref: '2 Corinthians 9:7',
}; // KJV, bible-api.com

/** Responsive photo: a 900px file for phones, the full file for everything else. */
export const photo = (name: string) => ({
  src: `/img/photos/${name}.webp`,
  srcSet: `/img/photos/${name}-sm.webp 900w, /img/photos/${name}.webp 1800w`,
});
