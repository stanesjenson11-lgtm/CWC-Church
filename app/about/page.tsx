import { Fragment } from 'react';
import type { Metadata } from 'next';
import { LEADERS, LEADERSHIP_INTRO, OUTREACH, STORY, VALUES } from '../content';
import { Brackets, CTA, PageHero, Plate } from '../ui';

export const metadata: Metadata = { title: 'About', description: STORY[0] };

const SIDE_PHOTOS = [
  { name: 'w1', align: 'right' },
  { name: 'w3', align: 'left' },
  { name: 'w10', align: 'right' },
];

export default function About() {
  return (
    <main>
      <PageHero title="Our story" lead={STORY[0]}>
        <div className="story-body" data-drift>
          <Plate name="lang2" alt="The main hall during a Sunday service, lit from the stage" sizes="(max-width: 900px) 90vw, 55vw" className="story-plate" />
          <p className="story-text" data-rise>{STORY[1]}</p>
        </div>
      </PageHero>

      {/* What the house is built on, as a rail of photographs. */}
      <section className="life dark" aria-labelledby="values-head">
        <canvas className="dissolve" data-carry="light" aria-hidden="true" />
        <div className="life-inner">
          <h2 id="values-head" className="display life-head" data-words>What we build on<span className="accent">.</span></h2>
          <div className="rail" aria-hidden="true">
            <span className="rail-track" />
            <span className="rail-run" />
            <span className="rail-mark" />
          </div>
          {VALUES.map((v, i) => (
            <Fragment key={v.word}>
              <div className="row centre">
                <div className="row-plate"><Plate name={v.img} alt={`${v.word} at Compassion Worship Center`} /></div>
                <p className="row-word display" data-letters>{v.word}</p>
                <p className="row-copy">{v.copy}</p>
              </div>
              {SIDE_PHOTOS[i] && (
                <div className={`row side ${SIDE_PHOTOS[i].align}`}>
                  <div className="row-plate"><Plate name={SIDE_PHOTOS[i].name} alt="" sizes="(max-width: 900px) 86vw, 25vw" /></div>
                </div>
              )}
            </Fragment>
          ))}
        </div>
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

      {/* Outreach: the old site's own words. */}
      <section className="outreach dark" aria-labelledby="outreach-head">
        <canvas className="dissolve" data-carry="light" aria-hidden="true" />
        <canvas className="contours" data-tone="paper" aria-hidden="true" />
        <div className="outreach-inner">
          <p className="credit" data-rise>Making a difference</p>
          <h2 id="outreach-head" className="display outreach-head" data-words>Serving our community<span className="accent">.</span></h2>
          <p className="outreach-copy" data-rise>{OUTREACH}</p>
          <CTA href="/connect#card" label="Serve with us" cursor="Serve" />
        </div>
      </section>
    </main>
  );
}
