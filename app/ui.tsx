import Link from 'next/link';
import { photo } from './content';

// Shared presentational pieces. No hooks, so they render on the server and inside client components alike.

/** The stepped-corner plate the photographs sit in, normalised for clipPathUnits="objectBoundingBox". */
export const PLATE_CLIP =
  'M0.01915,0.00107H0.98085C0.98574,0.00107 0.99044,0.003 0.9939,0.00642C0.99736,0.00984 0.9993,0.01449 0.9993,0.01933V0.88815C0.9993,0.89299 0.99736,0.89763 0.9939,0.90105C0.99044,0.90448 0.98574,0.9064 0.98085,0.9064H0.64733C0.63864,0.9064 0.63007,0.90834 0.62224,0.91206C0.61442,0.91579 0.60754,0.92122 0.60212,0.92794L0.56153,0.9783C0.55635,0.98474 0.54976,0.98993 0.54227,0.9935C0.53478,0.99707 0.52656,0.99892 0.51825,0.99892H0.01915C0.01426,0.99892 0.00956,0.997 0.0061,0.99358C0.00264,0.99016 0.0007,0.98551 0.0007,0.98067V0.01933C0.0007,0.01449 0.00264,0.00984 0.0061,0.00642C0.00956,0.003 0.01426,0.00107 0.01915,0.00107Z';

export const PlateDefs = () => (
  <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
    <clipPath id="plate" clipPathUnits="objectBoundingBox"><path d={PLATE_CLIP} /></clipPath>
  </svg>
);

/** Letter-swap hover: two stacked copies of the label; each letter rolls on its own delay. */
export const Swap = ({ text }: { text: string }) => {
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
export const Brackets = () => (
  <>
    {['tl', 'tr', 'br', 'bl'].map((c) => (
      <svg key={c} className={`bracket ${c}`} viewBox="0 0 10.5 10.5" aria-hidden="true"><path d="M0 0.5H10V10.5" /></svg>
    ))}
  </>
);

export const Arrow = () => (
  <svg className="arrow" viewBox="0 0 13.7 10.7" aria-hidden="true"><path d="M0 5.35H13M8 10.35L13 5.35L8 0.35" /></svg>
);

const CtaFrame = () => (
  <svg viewBox="0 0 220 50" preserveAspectRatio="none" aria-hidden="true">
    <path className="cta-body" d="M0.5 0.5H219.5V42L212.5 49.5H0.5Z" />
    <path className="cta-flood" d="M0.5 0.5H219.5V42L212.5 49.5H0.5Z" />
    <path className="cta-ring" d="M0.5 0.5H219.5V42L212.5 49.5H0.5Z" />
  </svg>
);

/** Chamfered call to action. Internal paths use client navigation; everything else opens as a plain link. */
export const CTA = ({ href, label, solid, cursor }: { href: string; label: string; solid?: boolean; cursor?: string }) => {
  const props = { className: `cta${solid ? ' cta-solid' : ''}`, 'data-cursor': cursor ?? label.split(' ')[0], 'data-magnetic': true };
  const inner = <><CtaFrame /><span className="cta-label">{label}<Arrow /></span></>;
  if (href.startsWith('/')) return <Link href={href} {...props}>{inner}</Link>;
  const external = href.startsWith('http');
  return <a href={href} {...props} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{inner}</a>;
};
export { CtaFrame };

export const Plate = ({ name, alt, sizes = '(max-width: 900px) 90vw, 50vw', className = '' }: { name: string; alt: string; sizes?: string; className?: string }) => (
  <div className={`plate ${className}`}>
    <div className="plate-fill"><img src={photo(name).src} srcSet={photo(name).srcSet} sizes={sizes} alt={alt} loading="lazy" decoding="async" /></div>
    <svg className="plate-line" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true"><path d={PLATE_CLIP} /></svg>
  </div>
);

/** The opening block every inner page shares: a big title over the moving contour lines. */
export const PageHero = ({ title, lead, children }: { title: string; lead?: string; children?: React.ReactNode }) => (
  <section className="page-hero">
    <canvas className="contours" data-tone="ink" aria-hidden="true" />
    <div className="page-hero-inner">
      <h1 className="display page-title" data-words>{title}<span className="accent">.</span></h1>
      {lead && <p className="lead page-lead" data-rise>{lead}</p>}
      {children}
    </div>
  </section>
);
