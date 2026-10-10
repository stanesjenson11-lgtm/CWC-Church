import Link from 'next/link';
import { ADDRESS, CHURCH, LINKS, NAV } from './content';
import { CTA, Swap } from './ui';

/** Revealed from under the page on every route. */
export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="footer-fixed">
        <div className="footer-panel">
          <canvas className="contours" data-tone="paper" aria-hidden="true" />
          <h2 className="display footer-head" data-words>Come as you are<span className="accent">.</span></h2>
          <nav className="footer-nav" aria-label="Footer">
            {NAV.map(([href, label]) => <Link key={href} href={href} data-letters>{label}</Link>)}
          </nav>
          <div className="footer-info">
            <address>{ADDRESS[0]}<br />{ADDRESS[1]}</address>
            <p>English · Sundays 11:30 AM</p>
          </div>
          <div className="footer-row">
            <p className="legal">© 2026 {CHURCH.name}. All rights reserved.</p>
            <CTA href={LINKS.maps} label="Get directions" cursor="Map" />
            <div className="socials">
              <a href={LINKS.instagram} target="_blank" rel="noreferrer"><Swap text="Instagram" /></a>
              <a href={LINKS.facebook} target="_blank" rel="noreferrer"><Swap text="Facebook" /></a>
              <a href={LINKS.youtube} target="_blank" rel="noreferrer"><Swap text="YouTube" /></a>
              <a href={LINKS.tel}><Swap text="Call" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
