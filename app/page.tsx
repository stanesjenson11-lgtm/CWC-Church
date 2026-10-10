import Story from './Story';
import ShareButton from './ShareButton';
import { joshua24 } from './joshua24';

const MAPS = 'https://maps.app.goo.gl/jeS5XHMwu5tMQQ9Y6';
const INSTAGRAM = 'https://www.instagram.com/compassionworshipcenter/';
const PHONE = '+91 94836 81892';
const TEL = `tel:${PHONE.replace(/\s/g, '')}`;
const CLAUSE = 'but as for me and my house, we will serve the LORD.';

// The stepped-corner plate the photographs sit in, normalised for clipPathUnits="objectBoundingBox".
const PLATE_CLIP =
  'M0.01915,0.00107H0.98085C0.98574,0.00107 0.99044,0.003 0.9939,0.00642C0.99736,0.00984 0.9993,0.01449 0.9993,0.01933V0.88815C0.9993,0.89299 0.99736,0.89763 0.9939,0.90105C0.99044,0.90448 0.98574,0.9064 0.98085,0.9064H0.64733C0.63864,0.9064 0.63007,0.90834 0.62224,0.91206C0.61442,0.91579 0.60754,0.92122 0.60212,0.92794L0.56153,0.9783C0.55635,0.98474 0.54976,0.98993 0.54227,0.9935C0.53478,0.99707 0.52656,0.99892 0.51825,0.99892H0.01915C0.01426,0.99892 0.00956,0.997 0.0061,0.99358C0.00264,0.99016 0.0007,0.98551 0.0007,0.98067V0.01933C0.0007,0.01449 0.00264,0.00984 0.0061,0.00642C0.00956,0.003 0.01426,0.00107 0.01915,0.00107Z';

/* ---------- small server-side pieces ---------- */

/** Letter-swap hover: two stacked copies of the label; each letter rolls on its own delay. */
const Swap = ({ text }: { text: string }) => {
  const row = (hidden: boolean) => (
    <span className="swap-row" aria-hidden={hidden || undefined}>
      {[...text].map((c, i) => (
        <span key={i} style={{ '--i': i } as React.CSSProperties}>{c === ' ' ? ' ' : c}</span>
      ))}
    </span>
  );
  return <span className="swap">{row(false)}{row(true)}</span>;
};

/** Four corner strokes, one path drawn four ways. */
const Brackets = () => (
  <>
    {['tl', 'tr', 'br', 'bl'].map((c) => (
      <svg key={c} className={`bracket ${c}`} viewBox="0 0 10.5 10.5" aria-hidden="true"><path d="M0 0.5H10V10.5" /></svg>
    ))}
  </>
);

const Arrow = () => (
  <svg className="arrow" viewBox="0 0 13.7 10.7" aria-hidden="true"><path d="M0 5.35H13M8 10.35L13 5.35L8 0.35" /></svg>
);

/** Chamfered call to action: a body, a flood that fills on hover, and the outline. */
const CTA = ({ href, label, solid, external }: { href: string; label: string; solid?: boolean; external?: boolean }) => (
  <a
    className={`cta${solid ? ' cta-solid' : ''}`}
    href={href}
    data-cursor={label.split(' ')[0]}
    data-magnetic
    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
  >
    <svg viewBox="0 0 220 50" preserveAspectRatio="none" aria-hidden="true">
      <path className="cta-body" d="M0.5 0.5H219.5V42L212.5 49.5H0.5Z" />
      <path className="cta-flood" d="M0.5 0.5H219.5V42L212.5 49.5H0.5Z" />
      <path className="cta-ring" d="M0.5 0.5H219.5V42L212.5 49.5H0.5Z" />
    </svg>
    <span className="cta-label">{label}<Arrow /></span>
  </a>
);

const Plate = ({ src, alt, className = '' }: { src: string; alt: string; className?: string }) => (
  <div className={`plate ${className}`}>
    <div className="plate-fill"><img src={src} alt={alt} loading="lazy" /></div>
    <svg className="plate-line" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true"><path d={PLATE_CLIP} /></svg>
  </div>
);

const lord = (t: string) => t.split(/(LORD)/).map((s, i) => (s === 'LORD' ? <span key={i} className="sc">LORD</span> : s));

const Verses = ({ from, to, live }: { from: number; to: number; live?: boolean }) => (
  <>
    {joshua24.slice(from - 1, to).map(([n, t]) => (
      <p key={n} id={live && n === 15 ? 'v15' : undefined}>
        {n === 1 ? <span className="dropcap">24</span> : <sup>{n}</sup>}
        {live && n === 15 ? (
          <>
            {lord(t.slice(0, t.indexOf(CLAUSE)))}
            <span className="hl-clause">{lord(CLAUSE)}</span>
          </>
        ) : (
          lord(t)
        )}
      </p>
    ))}
  </>
);

/** One Bible page. Sized entirely in container units, so the 3D page and the flat close-up lay out identically. */
const Sheet = ({ from, to, live, head = true }: { from: number; to: number; live?: boolean; head?: boolean }) => (
  <div className="folio">
    {head && <p className="folio-head"><span>Joshua</span><span>24</span></p>}
    <div className="folio-cols"><Verses from={from} to={to} live={live} /></div>
  </div>
);

/* ---------- content ---------- */

type Row = { word: string; img: string; copy: [string, string] } | { side: string; align: 'left' | 'right' };
const values: Row[] = [
  { word: 'Worship', img: 'w4', copy: ['Wholehearted, spirit-filled worship', 'that draws people closer to God.'] },
  { side: 'w1', align: 'right' },
  { word: 'Word', img: 'w5', copy: ['Grounded in the Bible,', 'with teaching for everyday life.'] },
  { side: 'w3', align: 'left' },
  { word: 'Community', img: 'w11', copy: ['People who support one another', 'and grow together.'] },
  { side: 'w10', align: 'right' },
  { word: 'Mission', img: 'w2', copy: ['Outreach that serves people', 'and changes lives beyond our walls.'] },
];

const ministries = [
  { name: "The King's Men", who: "Men's fellowship", img: 'w6' },
  { name: 'Ladies of the Light', who: "Women's fellowship", img: 'w7' },
  { name: 'KiKin Kids', who: 'Kids church', img: 'w8' },
  { name: 'Zois', who: 'Youth church', img: 'w9' },
];

const leaders = [
  ['pm', 'Pradeep Mcwin'],
  ['pk', 'Pichai Kani'],
  ['yk', 'Yohan Kondepogu'],
  ['ac', 'Anthony Christopher'],
];

const services = [
  { lang: 'Telugu / Kannada', when: 'Call for times' },
  { lang: 'Tamil', when: 'Call for times' },
  { lang: 'English', when: 'Sunday · 11:30 AM', live: true },
];

const nav = [
  ['book', 'The Book'],
  ['verse', 'The Verse'],
  ['house', 'The House'],
  ['contact', 'Contact'],
];

export default function Home() {
  return (
    <Story>
      <noscript><style>{'.veil{display:none}'}</style></noscript>
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <clipPath id="plate" clipPathUnits="objectBoundingBox"><path d={PLATE_CLIP} /></clipPath>
      </svg>

      {/* Loading veil: the heart mark fills from the top while the page loads. */}
      <div className="veil" role="status" aria-label="Loading Compassion Worship Center">
        <div className="veil-content">
          <div className="veil-mark"><span className="veil-shell" /><span className="veil-fill" /></div>
          <p className="veil-name">Compassion Worship Center</p>
        </div>
        <div className="veil-meter"><span /></div>
      </div>

      <div className="cursor" aria-hidden="true"><span className="cursor-dot" /><span className="cursor-label" /></div>

      <header className="masthead">
        <a href="#book" className="brand" aria-label="Compassion Worship Center, back to top">
          <span className="brand-mark" />
          <span className="brand-word">CWC</span>
        </a>
        <nav aria-label="Primary" className="nav">
          <ul>
            {nav.map(([id, label]) => (
              <li key={id}><a href={`#${id}`} data-nav={id}><Swap text={label} /></a></li>
            ))}
          </ul>
          <span className="nav-dot" aria-hidden="true" />
        </nav>
        <a className="visit" href={MAPS} target="_blank" rel="noreferrer" data-cursor="Map">
          <span aria-hidden="true">[ </span><Swap text="Plan a visit" /><span aria-hidden="true"> → ]</span>
        </a>
        <button className="burger" aria-label="Open menu" aria-expanded="false" aria-controls="sheet"><span /><span /></button>
      </header>

      <div className="sheet" id="sheet" role="dialog" aria-modal="true" aria-label="Menu">
        <button className="sheet-close" aria-label="Close menu"><span /><span /></button>
        <nav className="sheet-nav">
          {nav.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          <a href={MAPS} target="_blank" rel="noreferrer">Plan a visit</a>
        </nav>
        <p className="sheet-foot">Sundays 11:30 AM · Hennur Gardens, Bengaluru</p>
      </div>

      <main>
        {/* 1 · THE BOOK: the hero, then the Bible opens to Joshua 24 in one pinned stage. */}
        <section id="book" className="hero" data-section="book">
          <canvas className="contours" data-tone="ink" aria-hidden="true" />

          <div className="camera">
          <div className="scene" aria-hidden="true">
            <div className="book-tilt">
              <div className="book">
                <div className="face back" />
                <div className="face spine"><span>Holy Bible</span></div>
                <div className="face edge-top" />
                <div className="face edge-bottom" />
                <div className="face edge-fore" />
                <div className="face pageblock">
                  <Sheet from={15} to={33} />
                </div>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div className="leaf" key={i} style={{ '--i': i } as React.CSSProperties}>
                    <div className="leaf-front"><Sheet from={2 + i * 3} to={16 + i * 3} head={false} /></div>
                    <div className="leaf-back"><Sheet from={1} to={14} /></div>
                  </div>
                ))}
                <div className="cover">
                  <div className="cover-front"><span className="cover-frame" /><span className="cover-title">Holy Bible</span></div>
                  <div className="cover-back" />
                </div>
                <div className="ribbon" />
              </div>
            </div>
          </div>

          {/* The flat twin of the right-hand page: laid exactly over the 3D page, then the camera keeps going. */}
          <div className="page-layer" aria-label="Joshua chapter 24, verses 15 to 33, King James Version">
            <div className="page">
              <Sheet from={15} to={33} live />
              <span className="page-ribbon" aria-hidden="true" />
            </div>
          </div>
          </div>

          <div className="hero-ui">
            <div className="hero-mid">
              <div className="identity">
                <p className="eyebrow muted">Hennur Gardens · Bengaluru</p>
                <h1 className="display hero-title" data-words>Compassion Worship Center</h1>
                <ul className="meta">
                  <li><span className="sq" />Sundays · 11:30 AM</li>
                  <li><span className="sq" />English · Telugu · Kannada · Tamil</li>
                  <li><span className="sq" />Come as you are</li>
                </ul>
              </div>
              <div className="panels">
                <div className="bpanel">
                  <Brackets />
                  <p className="eyebrow accent">This Sunday</p>
                  <dl>
                    <dt>English service</dt>
                    <dd>11:30 AM</dd>
                    <dd>Vadarapalya, Hennur Gardens</dd>
                  </dl>
                </div>
                <div className="bpanel">
                  <Brackets />
                  <p className="eyebrow accent">The verse</p>
                  <p className="panel-figure">Joshua 24:15</p>
                  <p className="panel-note">As for me and my house</p>
                </div>
              </div>
            </div>
            <div className="hero-foot">
              <a className="foot-link" href={INSTAGRAM} target="_blank" rel="noreferrer" data-cursor="Open"><Swap text="Instagram" /></a>
              <CTA href="#verse" label="Open the book" solid />
              <p className="foot-link right">Scroll to open</p>
            </div>
          </div>

          <div className="hero-caption" aria-hidden="true">
            <p className="display cap-title">More than <br />a book.</p>
            <p className="cap-body">Handed down through generations, read at tables and bedsides, worn soft at the edges. Still open. Still speaking.</p>
          </div>

          <p className="page-caption"><span className="accent">Red letter</span> · Joshua 24:15</p>
        </section>

        {/* 2 · THE VERSE */}
        <section id="verse" className="verse dark" data-section="verse">
          <canvas className="dissolve" data-carry="light" aria-hidden="true" />
          <div className="verse-inner">
            <h2 className="display verse-text" data-read>But as for me and my house, we will serve the Lord.</h2>
            <div className="verse-foot">
              <p className="credit">Joshua 24:15 · KJV</p>
              <ShareButton />
            </div>
          </div>
          <div className="shade" aria-hidden="true" />
        </section>

        {/* 3 · THE HOUSE: the ark draws itself on the waters, then we go through its door. */}
        <section id="house" className="house dark" data-section="house">
          <canvas className="contours" data-tone="paper" aria-hidden="true" />
          <div className="ark-wrap">
            <svg className="ark" viewBox="0 0 1000 520" role="img" aria-label="Line drawing of Noah's ark with its door open">
              <defs>
                <clipPath id="door"><path d="M472 292V214Q500 192 528 214V292Z" /></clipPath>
              </defs>
              <g className="ark-door">
                <rect x="472" y="192" width="56" height="100" className="door-light" clipPath="url(#door)" />
                <image href="/img/photos/house.webp" x="436" y="192" width="128" height="100" preserveAspectRatio="xMidYMid slice" clipPath="url(#door)" className="door-photo" />
              </g>
              <g className="ark-lines" fill="none">
                <path pathLength={1} d="M40 262C80 300 98 392 210 410H790C902 392 920 300 960 262" />
                <path pathLength={1} d="M40 262H960" />
                <path pathLength={1} d="M88 306H912M122 346H878M168 382H832" />
                <path pathLength={1} d="M230 262V172H770V262" />
                <path pathLength={1} d="M196 178L500 92L804 178" />
                <path pathLength={1} d="M472 292V214Q500 192 528 214V292" />
                <path pathLength={1} d="M472 292L360 452M528 292L416 452M445 330H500M418 370H473M391 410H446" />
                <path pathLength={1} d="M282 198h28v24h-28zM338 198h28v24h-28zM394 198h28v24h-28zM578 198h28v24h-28zM634 198h28v24h-28zM690 198h28v24h-28z" />
                <path pathLength={1} d="M0 450Q60 438 120 450T240 450T360 450M640 450Q700 438 760 450T880 450T1000 450M60 486Q120 474 180 486T300 486M700 486Q760 474 820 486T940 486" />
              </g>
            </svg>
          </div>
          <div className="house-caption">
            <h2 className="display">Come thou and all thy house into the ark<span className="accent">.</span></h2>
            <p className="credit">Genesis 7:1</p>
          </div>
          <div className="house-inside">
            <img src="/img/photos/house.webp" alt="The congregation of Compassion Worship Center gathered for Sunday worship" />
            <div className="house-inside-ui">
              <p className="display">This is <br />the house<span className="accent">.</span></p>
              <p className="lead">People from every background, worshipping in four languages, under one roof in Hennur Gardens. There is room for you.</p>
            </div>
          </div>
        </section>

        {/* 4 · LIFE: what the house is built on, as a rail of photographs. */}
        <section id="life" className="life dark" data-section="house">
          <div className="life-inner">
            <h2 className="display life-head" data-words>What we build on<span className="accent">.</span></h2>
            <div className="rail" aria-hidden="true">
              <span className="rail-track" />
              <span className="rail-run" />
              <span className="rail-mark" />
            </div>
            {values.map((v, i) =>
              'word' in v ? (
                <div className="row centre" key={i}>
                  <div className="row-plate"><Plate src={`/img/photos/${v.img}.webp`} alt={`${v.word} at Compassion Worship Center`} /></div>
                  <p className="row-word display" data-letters>{v.word}</p>
                  <p className="row-copy"><strong>{v.copy[0]}</strong> {v.copy[1]}</p>
                </div>
              ) : (
                <div className={`row side ${v.align}`} key={i}>
                  <div className="row-plate"><Plate src={`/img/photos/${v.side}.webp`} alt="" /></div>
                </div>
              ),
            )}
          </div>
        </section>

        {/* 5 · MINISTRIES: a horizontal run, pinned. */}
        <section id="ministries" className="ministries" data-section="house">
          <canvas className="dissolve" data-carry="dark" aria-hidden="true" />
          <div className="track">
            <div className="panel intro-panel">
              <h2 className="display" data-words>Find your people<span className="accent">.</span></h2>
              <p className="lead">Four fellowships, one family. There is a place for every age.</p>
            </div>
            {ministries.map((m) => (
              <article className="panel min-panel" key={m.name}>
                <Plate src={`/img/photos/${m.img}.webp`} alt={`${m.name}, ${m.who.toLowerCase()}`} />
                <div className="min-text">
                  <p className="eyebrow accent">{m.who}</p>
                  <h3 className="display">{m.name}</h3>
                </div>
              </article>
            ))}
          </div>
          <div className="track-progress" aria-hidden="true"><span /></div>
        </section>

        {/* 6 · WHO LEADS THE HOUSE: a figure on a dark band that carries the service strip. */}
        <section id="leaders" className="leaders" data-section="contact">
          <canvas className="contours" data-tone="ink" aria-hidden="true" />
          <h2 className="display leaders-head" data-words>Who leads the house<span className="accent">.</span></h2>
          <div className="figure">
            {leaders.map(([id, name], i) => (
              <img key={id} src={`/img/leaders/${id}.webp`} alt={i === 0 ? name : ''} className={i === 0 ? 'is-on' : ''} data-leader={id} />
            ))}
          </div>
          <div className="leaders-intro">
            <p className="lead">Reaching, touching and changing lives in the name of Jesus. Come and say hello after the service.</p>
            <CTA href={MAPS} label="Plan your visit" external />
          </div>
          <div className="bpanel leader-list">
            <Brackets />
            <p className="eyebrow accent">Leadership</p>
            <ul>
              {leaders.map(([id, name], i) => (
                <li key={id}><button data-show={id} aria-pressed={i === 0}><span className="sq" />{name}</button></li>
              ))}
            </ul>
          </div>
          <div className="band">
            <div className="strip">
              {services.map((s, i) => (
                <div className={`svc${s.live ? ' live' : ''}`} key={s.lang}>
                  <p className="svc-when">{s.when}</p>
                  <p className="svc-lang">{s.lang}</p>
                  <span className="svc-mark">{s.live && <span className="pulse" />}</span>
                  {i < services.length - 1 && <svg className="svc-link" aria-hidden="true"><line x1="0" y1="0.5" x2="100%" y2="0.5" /></svg>}
                </div>
              ))}
            </div>
            <a className="svc-call" href={TEL}>{PHONE}</a>
          </div>
        </section>
      </main>

      {/* 7 · CONTACT: the footer is revealed from under the page. */}
      <footer id="contact" className="footer" data-section="contact">
        <div className="footer-fixed">
          <div className="footer-panel">
            <canvas className="contours" data-tone="paper" aria-hidden="true" />
            <h2 className="display footer-head" data-words>Come as you are<span className="accent">.</span></h2>
            <nav className="footer-nav" aria-label="Footer">
              <a href="#book" data-letters>The Book</a>
              <a href="#verse" data-letters>The Verse</a>
              <a href="#house" data-letters>The House</a>
              <a href="#ministries" data-letters>Ministries</a>
            </nav>
            <div className="footer-info">
              <address>Vadarapalya, Hennur Gardens<br />Bengaluru, Karnataka 560113</address>
              <p>Sunday · English · 11:30 AM</p>
            </div>
            <div className="footer-row">
              <p className="legal">© 2026 Compassion Worship Center. All rights reserved.</p>
              <CTA href={MAPS} label="Get directions" external />
              <div className="socials">
                <a href={INSTAGRAM} target="_blank" rel="noreferrer"><Swap text="Instagram" /></a>
                <a href={TEL}><Swap text="Call" /></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </Story>
  );
}
