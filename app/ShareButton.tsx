'use client';
import { useState } from 'react';

const TEXT = 'But as for me and my house, we will serve the LORD. — Joshua 24:15';

export default function ShareButton() {
  const [label, setLabel] = useState('Share this verse');

  async function share() {
    const data = { title: 'Joshua 24:15', text: TEXT, url: location.href };
    if (navigator.share) return navigator.share(data).catch(() => {});
    await navigator.clipboard.writeText(`${TEXT}\n${location.href}`);
    setLabel('Copied');
    setTimeout(() => setLabel('Share this verse'), 2000);
  }

  return (
    <button className="cta" onClick={share} data-cursor="Share" data-magnetic>
      <svg viewBox="0 0 220 50" preserveAspectRatio="none" aria-hidden="true">
        <path className="cta-body" d="M0.5 0.5H219.5V42L212.5 49.5H0.5Z" />
        <path className="cta-flood" d="M0.5 0.5H219.5V42L212.5 49.5H0.5Z" />
        <path className="cta-ring" d="M0.5 0.5H219.5V42L212.5 49.5H0.5Z" />
      </svg>
      <span className="cta-label" aria-live="polite">{label}</span>
    </button>
  );
}
