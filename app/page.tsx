import Link from 'next/link';
import HomeStory from './HomeStory';
import { joshua24 } from './joshua24';
import { CHURCH, LEADERS, LEADERSHIP_INTRO, MINISTRIES, SERVICES, WELCOME, photo } from './content';
import { Arrow, Brackets, CTA, Plate } from './ui';

const CLAUSE = 'but as for me and my house, we will serve the LORD.';

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
const Folio = ({ from, to, live, head = true }: { from: number; to: number; live?: boolean; head?: boolean }) => (
  <div className="folio">
    {head && <p className="folio-head"><span>Joshua</span><span>24</span></p>}
    <div className="folio-cols"><Verses from={from} to={to} live={live} /></div>
  </div>
);

const english = SERVICES.find((s) => s.slug === 'english')!;

export default function Home() {
  return (
    <HomeStory>
      {/* Loading veil: the heart mark fills from the top while the page loads. */}
      <div className="veil" role="status" aria-label={`Loading ${CHURCH.name}`}>
        <div className="veil-content">
          <div className="veil-mark"><span className="veil-shell" /><span className="veil-fill" /></div>
          <p className="veil-name">{CHURCH.name}</p>
        </div>
        <div className="veil-meter"><span /></div>
      </div>

      <main>
        {/* THE BOOK: the hero, then the Bible opens to Joshua 24 in one pinned stage. */}
        <section id="book" className="hero">
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
                  <div className="face pageblock"><Folio from={15} to={33} /></div>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div className="leaf" key={i}>
                      <div className="leaf-front"><Folio from={2 + i * 3} to={16 + i * 3} head={false} /></div>
                      <div className="leaf-back"><Folio from={1} to={14} /></div>
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
                <Folio from={15} to={33} live />
                <span className="page-ribbon" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="hero-ui">
            <div className="hero-mid">
              <div className="identity">
                <p className="eyebrow muted">Hennur Gardens · Bengaluru</p>
                <h1 className="display hero-title" data-words>{CHURCH.name}</h1>
                <p className="hero-lead">{CHURCH.tagline}</p>
              </div>
              <div className="panels">
                <Link className="bpanel panel-link" href="/services/english">
                  <Brackets />
                  <p className="eyebrow accent">This Sunday</p>
                  <dl>
                    <dt>English service</dt>
                    <dd>{english.when}</dd>
                    <dd>Telugu, Kannada and Tamil too</dd>
                  </dl>
                </Link>
                <div className="bpanel">
                  <Brackets />
                  <p className="eyebrow accent">The verse</p>
                  <p className="panel-figure">Joshua 24:15</p>
                  <p className="panel-note">As for me and my house</p>
                </div>
              </div>
            </div>
            <div className="hero-foot">
              <p className="foot-link">Sundays · Four languages</p>
              <CTA href="#house" label="Open the book" solid />
              <p className="foot-link right">Scroll to open</p>
            </div>
          </div>

          <div className="hero-caption" aria-hidden="true">
            <p className="display cap-title">More than <br />a book.</p>
            <p className="cap-body">Handed down through generations, read at tables and bedsides, worn soft at the edges. Still open. Still speaking.</p>
          </div>

          <p className="page-caption"><span className="accent">Red letter</span> · Joshua 24:15</p>
        </section>

        {/* THE HOUSE: the ark draws itself on the waters, then we go through its door. */}
        <section id="house" className="house dark">
          <canvas className="dissolve" data-carry="light" aria-hidden="true" />
          <canvas className="contours" data-tone="paper" aria-hidden="true" />
          <div className="ark-wrap">
            <svg className="ark" viewBox="0 0 1000 520" role="img" aria-label="Line drawing of Noah's ark with its door open">
              <defs>
                <clipPath id="door"><path d="M472 292V214Q500 192 528 214V292Z" /></clipPath>
              </defs>
              <g className="ark-door">
                <rect x="472" y="192" width="56" height="100" className="door-light" clipPath="url(#door)" />
                <image href="/img/photos/house-sm.webp" x="436" y="192" width="128" height="100" preserveAspectRatio="xMidYMid slice" clipPath="url(#door)" className="door-photo" />
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
            <img src={photo('house').src} srcSet={photo('house').srcSet} sizes="100vw" alt="The congregation of Compassion Worship Center gathered for Sunday worship" />
            <div className="house-inside-ui">
              <p className="display">This is <br />the house<span className="accent">.</span></p>
              <p className="lead">{WELCOME}</p>
            </div>
          </div>
        </section>

        {/* ONE HOUSE, THREE SERVICES: each language has its own page. */}
        <section id="services" className="services">
          <canvas className="dissolve" data-carry="dark" aria-hidden="true" />
          <div className="services-head">
            <h2 className="display" data-words>One house, three services<span className="accent">.</span></h2>
            <p className="lead" data-rise>Every Sunday we worship in English, in Telugu and Kannada, and in Tamil. Choose yours.</p>
          </div>
          <ul className="service-cards">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="service-card" data-cursor="Open">
                  <Plate name={s.photo} alt={s.alt} sizes="(max-width: 900px) 90vw, 33vw" className="service-plate" />
                  <span className="service-greeting" lang={s.slug === 'tamil' ? 'ta' : s.slug === 'english' ? 'en' : 'te'}>{s.greeting}</span>
                  <span className="service-meta">
                    <span className="service-lang">{s.lang}</span>
                    <span className="service-when">{s.when ?? 'Call for times'}</span>
                  </span>
                  <span className="service-go">Visit the {s.lang} service<Arrow /></span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* MINISTRIES: a horizontal run, pinned. */}
        <section id="ministries" className="ministries">
          <div className="track">
            <div className="panel intro-panel">
              <h2 className="display" data-words>Find your community<span className="accent">.</span></h2>
              <p className="lead">Grow with people who share your journey.</p>
            </div>
            {MINISTRIES.map((m) => (
              <article className="panel min-panel" key={m.name}>
                <Plate name={m.img} alt={`${m.name}, ${m.who.toLowerCase()}`} sizes="(max-width: 900px) 84vw, 62vw" />
                <div className="min-text">
                  <div>
                    <p className="eyebrow accent">{m.who}</p>
                    <h3 className="display">{m.name}</h3>
                  </div>
                  <div className="min-side">
                    <p className="min-copy">{m.copy}</p>
                    <Link className="min-join" href={`/connect?join=${encodeURIComponent(m.name)}#card`}>Join {m.name}<Arrow /></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="track-progress" aria-hidden="true"><span /></div>
        </section>

        {/* Leadership: hover or press a name to bring that person forward. */}
        <section className="leaders" aria-labelledby="leaders-head">
          <canvas className="contours" data-tone="ink" aria-hidden="true" />
          <h2 id="leaders-head" className="display leaders-head" data-words>Our leadership<span className="accent">.</span></h2>
          <div className="figure">
            {LEADERS.map(([id, name], i) => (
              <img key={id} src={`/img/leaders/${id}.webp`} alt={i === 0 ? name : ''} className={i === 0 ? 'is-on' : ''} data-leader={id} />
            ))}
          </div>
          <div className="leaders-intro">
            <p className="lead" data-rise>{LEADERSHIP_INTRO}</p>
            <CTA href="/connect#card" label="Talk to a pastor" cursor="Talk" />
          </div>
          <div className="bpanel leader-list" data-rise>
            <Brackets />
            <p className="eyebrow accent">Pastors and leaders</p>
            <ul>
              {LEADERS.map(([id, name], i) => (
                <li key={id}><button data-show={id} aria-pressed={i === 0}><span className="sq" />{name}</button></li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </HomeStory>
  );
}
