'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { contours, dissolve } from './fx';
import { getLenis, isPhone, prefersReduced, visit } from './motion';

gsap.registerPlugin(useGSAP);

/** Motion every page shares. Page-specific scenes (the home page's pins) run first, in their own components. */
export default function Shell({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Cursor and magnetic buttons: set up once, by delegation, so they survive page changes.
  useEffect(() => {
    if (prefersReduced() || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const cursor = document.querySelector<HTMLElement>('.cursor')!;
    const label = cursor.querySelector<HTMLElement>('.cursor-label')!;
    const cx = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
    const cy = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });
    const pulls = new WeakMap<Element, [gsap.QuickToFunc, gsap.QuickToFunc]>();
    let held: Element | null = null;
    const move = (e: PointerEvent) => {
      cx(e.clientX);
      cy(e.clientY);
      cursor.classList.add('is-on');
      const m = (e.target as Element).closest?.('[data-magnetic]') ?? null;
      if (held && held !== m) pulls.get(held)?.forEach((f) => f(0));
      held = m;
      if (!m) return;
      if (!pulls.has(m)) pulls.set(m, [gsap.quickTo(m, 'x', { duration: 0.6, ease: 'power3.out' }), gsap.quickTo(m, 'y', { duration: 0.6, ease: 'power3.out' })]);
      const r = m.getBoundingClientRect();
      const [mx, my] = pulls.get(m)!;
      mx((e.clientX - r.left - r.width / 2) * 0.25);
      my((e.clientY - r.top - r.height / 2) * 0.35);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element).closest?.('a, button, [data-cursor]');
      cursor.classList.toggle('is-link', !!t);
      label.textContent = t?.getAttribute('data-cursor') ?? '';
    };
    const leave = () => cursor.classList.remove('is-on');
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerover', over);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduce = prefersReduced();
      const phone = isPhone();
      const html = document.documentElement;
      html.classList.add('js', reduce ? 'still' : 'moving');
      const lenis = getLenis();
      if (!visit.firstLoad) {
        lenis?.scrollTo(0, { immediate: true, force: true });
        scrollTo(0, 0);
      }
      const off: (() => void)[] = [];
      const tokens = getComputedStyle(html);
      const color = (name: string) => tokens.getPropertyValue(name).trim();

      /* contour lines: only animate while on screen; slower and coarser on phones */
      const loops = q('canvas.contours').map((cv) => {
        const draw = contours(cv as HTMLCanvasElement, cv.getAttribute('data-tone') === 'ink' ? 'rgb(14 14 14 / 0.09)' : 'rgb(245 245 245 / 0.13)', phone ? 56 : 96);
        let visible = false;
        let last = 0;
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
        io.observe(cv);
        off.push(() => io.disconnect());
        return { draw, tick: (now: number) => visible && now - last > (phone ? 60 : 33) && ((last = now), draw(now)) };
      });
      const tick = () => loops.forEach((l) => l.tick(performance.now()));
      if (reduce) loops.forEach((l) => l.draw());
      else {
        gsap.ticker.add(tick);
        off.push(() => gsap.ticker.remove(tick));
      }

      if (!reduce) {
        /* pixel-dissolve seams (created after any page pins, so their spacing is counted) */
        q('canvas.dissolve').forEach((cv) => {
          const draw = dissolve(cv as HTMLCanvasElement, color(cv.getAttribute('data-carry') === 'light' ? '--page' : '--ink'), color('--accent'));
          ScrollTrigger.create({ trigger: cv.parentElement, start: 'top bottom', end: 'top top', onUpdate: (s) => draw(s.progress), onRefresh: (s) => draw(s.progress) });
        });

        /* text arrives once: words, letters, or a plain rise */
        const once = (el: Element, anim: gsap.core.Tween, start = 'top 85%') =>
          ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => anim.play() });
        q('[data-words]:not(.hero-title)').forEach((el) =>
          once(el, gsap.from(SplitText.create(el, { type: 'words', aria: 'auto' }).words, { opacity: 0, y: '0.35em', duration: 0.9, stagger: 0.11, ease: 'power3.out', paused: true })),
        );
        q('[data-letters]').forEach((el) =>
          once(el, gsap.from(SplitText.create(el, { type: 'chars', aria: 'auto' }).chars, { opacity: 0, y: '0.3em', duration: 0.6, stagger: 0.026, ease: 'power3.out', paused: true }), el.closest('footer') ? 'top 98%' : 'top 80%'),
        );
        q('[data-rise]').forEach((el) => once(el, gsap.from(el, { opacity: 0, y: 24, duration: 0.9, ease: 'power3.out', paused: true }), 'top 90%'));

        /* photographs drift a little inside their frames */
        q('[data-drift] .plate-fill img').forEach((img) =>
          gsap.fromTo(img, { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.closest('.plate'), start: 'top bottom', end: 'bottom top', scrub: true } }),
        );

        /* the values rail: a thread and a turning marker; three depths per row */
        const rail = q('.rail')[0] as HTMLElement | undefined;
        if (rail) {
          gsap.timeline({ scrollTrigger: { trigger: rail, start: 'top center', end: 'bottom bottom', scrub: 0.6 } })
            .fromTo('.rail-run', { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0)
            .fromTo('.rail-mark', { y: 0, rotation: 0 }, { y: () => rail.offsetHeight, rotation: 1800, ease: 'none' }, 0);
          q('.row').forEach((row) => {
            if (phone) return;
            const span = { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true };
            const travel = row.classList.contains('side') ? 60 : 20;
            gsap.fromTo(row.querySelector('.row-plate'), { y: travel }, { y: -travel, ease: 'none', scrollTrigger: span });
            gsap.fromTo(row.querySelector('.plate-fill img'), { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: row, start: 'top bottom', end: 'top center', scrub: true } });
            const copy = row.querySelector('.row-copy');
            if (copy) gsap.fromTo(copy, { y: 110 }, { y: -110, ease: 'none', scrollTrigger: span });
          });
        }

        /* leaders: the figure rides up as the section arrives */
        if (q('.figure').length && !phone)
          gsap.fromTo('.figure', { yPercent: 6 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.leaders', start: 'top bottom', end: 'bottom bottom', scrub: true } });
      }

      /* leaders: hover, focus or press a name to bring that person forward */
      const show = (id: string) => {
        q('.figure img').forEach((img) => {
          const hit = img.getAttribute('data-leader') === id;
          img.classList.toggle('is-on', hit);
          img.setAttribute('alt', hit ? (q(`[data-show="${id}"]`)[0]?.textContent ?? '') : '');
        });
        q('[data-show]').forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute('data-show') === id)));
      };
      q('[data-show]').forEach((b) => {
        const id = b.getAttribute('data-show')!;
        const fn = () => show(id);
        ['mouseenter', 'focus', 'click'].forEach((t) => b.addEventListener(t, fn));
        off.push(() => ['mouseenter', 'focus', 'click'].forEach((t) => b.removeEventListener(t, fn)));
      });

      visit.firstLoad = false;
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => off.forEach((f) => f());
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  return <div ref={root}>{children}</div>;
}
