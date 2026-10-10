'use client';
import { useEffect, useState } from 'react';
import { LINKS, MINISTRIES, SERVICES } from '../content';
import { CtaFrame, Arrow } from '../ui';

const INTERESTS = ['Plan a visit', 'Join a fellowship', 'Prayer request', 'Talk to a pastor', 'Serve with outreach'];

/**
 * The connect card. There is no server to receive it, so it writes the message for the visitor and hands it
 * to WhatsApp or SMS on their own phone, addressed to the church number. Nothing is stored or sent by the site.
 */
export default function ConnectCard() {
  const [join, setJoin] = useState('');
  const [service, setService] = useState('');
  const [error, setError] = useState('');

  // Ministry buttons on the home page link here as /connect?join=Zois#card.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const j = params.get('join');
    if (j && MINISTRIES.some((m) => m.name === j)) setJoin(j);
    const s = SERVICES.find((x) => x.slug === params.get('service'));
    if (s) setService(s.lang);
  }, []);

  function compose(form: HTMLFormElement) {
    const d = new FormData(form);
    const name = String(d.get('name') ?? '').trim().slice(0, 80);
    const phone = String(d.get('phone') ?? '').trim().slice(0, 20);
    const message = String(d.get('message') ?? '').trim().slice(0, 600);
    const interests = d.getAll('interest').map(String);
    const service = String(d.get('service') ?? '');
    const fellowship = String(d.get('fellowship') ?? '');
    return [
      'Connect card · Compassion Worship Center',
      `Name: ${name}`,
      `Phone: ${phone}`,
      service && `Service: ${service}`,
      interests.length > 0 && `I'd like to: ${interests.join(', ')}`,
      fellowship && `Fellowship: ${fellowship}`,
      message && `Message: ${message}`,
    ].filter(Boolean).join('\n');
  }

  function send(form: HTMLFormElement, via: 'whatsapp' | 'sms') {
    if (!form.reportValidity()) return setError('Please add your name and a phone number we can reach you on.');
    setError('');
    const text = encodeURIComponent(compose(form));
    location.href = via === 'whatsapp' ? `https://wa.me/${LINKS.whatsapp}?text=${text}` : `sms:+${LINKS.whatsapp}?&body=${text}`;
  }

  return (
    <form className="card-form" onSubmit={(e) => (e.preventDefault(), send(e.currentTarget, 'whatsapp'))} noValidate>
      <div className="field">
        <label htmlFor="cc-name">Your name</label>
        <input id="cc-name" name="name" autoComplete="name" required maxLength={80} />
      </div>
      <div className="field">
        <label htmlFor="cc-phone">Phone</label>
        <input id="cc-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required pattern="[0-9+\s\-()]{7,20}" maxLength={20} />
      </div>
      <div className="field">
        <label htmlFor="cc-service">Which service?</label>
        <select id="cc-service" name="service" value={service} onChange={(e) => setService(e.target.value)}>
          <option value="">Not sure yet</option>
          {SERVICES.map((s) => <option key={s.slug}>{s.lang}</option>)}
        </select>
      </div>
      <fieldset className="field field-wide">
        <legend>I’d like to</legend>
        <div className="checks">
          {INTERESTS.map((i) => (
            <label key={i} className="check">
              <input type="checkbox" name="interest" value={i} defaultChecked={i === 'Join a fellowship' && !!join} />
              <span>{i}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="field">
        <label htmlFor="cc-fellowship">Fellowship</label>
        <select id="cc-fellowship" name="fellowship" value={join} onChange={(e) => setJoin(e.target.value)}>
          <option value="">None</option>
          {MINISTRIES.map((m) => <option key={m.name}>{m.name}</option>)}
        </select>
      </div>
      <div className="field field-wide">
        <label htmlFor="cc-message">Anything we should know? (optional)</label>
        <textarea id="cc-message" name="message" rows={4} maxLength={600} />
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="card-actions field-wide">
        <button type="submit" className="cta cta-solid" data-cursor="Send">
          <CtaFrame />
          <span className="cta-label">Send on WhatsApp<Arrow /></span>
        </button>
        <button type="button" className="text-link" onClick={(e) => send(e.currentTarget.form!, 'sms')}>
          Send as a text message instead<Arrow />
        </button>
      </div>
      <p className="card-note field-wide">This opens your own WhatsApp or messages app with your card written out, addressed to {LINKS.phone}. Nothing is stored on this website.</p>
    </form>
  );
}
