import type { Metadata } from 'next';
import { ADDRESS, CONNECT_INTRO, LINKS } from '../content';
import { Brackets, CTA, PageHero, Swap } from '../ui';
import ConnectCard from './ConnectCard';

export const metadata: Metadata = { title: 'Connect', description: CONNECT_INTRO };

export default function Connect() {
  return (
    <main>
      <PageHero title="Get in touch" lead={CONNECT_INTRO}>
        <div className="connect-grid">
          <div className="bpanel" data-rise>
            <Brackets />
            <p className="eyebrow accent">Call</p>
            <a className="connect-big" href={LINKS.tel}>{LINKS.phone}</a>
          </div>
          <div className="bpanel" data-rise>
            <Brackets />
            <p className="eyebrow accent">Visit</p>
            <address className="connect-address">{ADDRESS[0]}<br />{ADDRESS[1]}</address>
            <CTA href={LINKS.maps} label="Get directions" cursor="Map" />
          </div>
          <div className="bpanel" data-rise>
            <Brackets />
            <p className="eyebrow accent">Follow</p>
            <ul className="connect-socials">
              <li><a href={LINKS.instagram} target="_blank" rel="noreferrer"><Swap text="Instagram" /></a></li>
              <li><a href={LINKS.facebook} target="_blank" rel="noreferrer"><Swap text="Facebook" /></a></li>
              <li><a href={LINKS.youtube} target="_blank" rel="noreferrer"><Swap text="YouTube" /></a></li>
            </ul>
          </div>
        </div>
      </PageHero>

      <section id="card" className="connect-card dark" aria-labelledby="card-head">
        <canvas className="dissolve" data-carry="light" aria-hidden="true" />
        <div className="connect-card-inner">
          <div className="card-intro">
            <h2 id="card-head" className="display" data-words>Connect card<span className="accent">.</span></h2>
            <p className="lead" data-rise>New here, or ready to take a next step? Tell us a little about you and someone from the church will be in touch.</p>
          </div>
          <ConnectCard />
        </div>
      </section>
    </main>
  );
}
