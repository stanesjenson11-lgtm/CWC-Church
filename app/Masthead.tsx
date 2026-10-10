'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { NAV, CHURCH } from './content';
import { Swap } from './ui';
import { getLenis } from './motion';

export default function Masthead() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  // A new page closes the menu.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const lenis = getLenis();
    document.documentElement.classList.toggle('menu-open', open);
    if (!open) {
      lenis?.start();
      return;
    }
    lenis?.stop();
    close.current?.focus();
    gsap.fromTo(sheet.current!.querySelectorAll('.sheet-nav a'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, stagger: 0.05, delay: 0.1, duration: 0.6, ease: 'power3.out' });
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && (setOpen(false), burger.current?.focus());
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  const active = (href: string) => pathname === href;

  // The mark always goes to the hero. On the home page itself there's no navigation to do, so scroll up to it.
  const toHero = (e: React.MouseEvent) => {
    if (pathname !== '/') return;
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0 });
  };

  return (
    <>
      <header className="masthead">
        <Link href="/" className="brand" aria-label={`${CHURCH.name}, home`} onClick={toHero}>
          <span className="brand-mark" />
          <span className="brand-word">{CHURCH.short}</span>
        </Link>
        <nav aria-label="Primary" className="nav">
          <ul>
            {NAV.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className={active(href) ? 'is-active' : undefined} aria-current={pathname === href ? 'page' : undefined}>
                  <Swap text={label} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link className="visit" href="/connect#card" data-cursor="Visit">
          <span aria-hidden="true">[ </span><Swap text="Plan a visit" /><span aria-hidden="true"> → ]</span>
        </Link>
        <button ref={burger} className="burger" aria-label="Open menu" aria-expanded={open} aria-controls="sheet" onClick={() => setOpen(true)}><span /><span /></button>
      </header>

      <div ref={sheet} className="sheet" id="sheet" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open} inert={!open}>
        <button ref={close} className="sheet-close" aria-label="Close menu" onClick={() => (setOpen(false), burger.current?.focus())}><span /><span /></button>
        <nav className="sheet-nav" aria-label="Menu">
          <Link href="/">Home</Link>
          {NAV.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>{label}</Link>)}
        </nav>
        <Link className="sheet-visit" href="/connect#card">Plan a visit</Link>
        <p className="sheet-foot">Sundays 11:30 AM English · Hennur Gardens, Bengaluru</p>
      </div>
    </>
  );
}
