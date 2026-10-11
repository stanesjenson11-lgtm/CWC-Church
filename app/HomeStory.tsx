'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { getLenis, isPhone, prefersReduced, visit } from './motion';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Pinned scroll lengths, in viewport heights. Shorter on phones, where a thumb covers less ground per swipe.
const heroVh = () => (isPhone() ? 4.5 : 6); // hero → book opens → page close-up
const arkVh = () => (isPhone() ? 3 : 4);

/** The home page's own scenes. Shared motion (reveals, seams, cursor, menu) lives in Shell. */
export default function HomeStory({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const first = visit.firstLoad;
      if (first) {
        history.scrollRestoration = 'manual';
        scrollTo(0, 0);
      }
      const q = gsap.utils.selector(root);
      const one = <T extends Element = HTMLElement>(s: string) => q(s)[0] as unknown as T;
      const reduce = prefersReduced();
      const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
      const off: (() => void)[] = [];
      let alive = true;
      const lenis = getLenis();
      if (first) lenis?.stop();

      const words = (el: Element) =>
        gsap.from(SplitText.create(el, { type: 'words', aria: 'auto' }).words, { opacity: 0, y: '0.35em', duration: 0.9, stagger: 0.11, ease: 'power3.out', paused: true });

      /* ---------- 1 · hero: veil hands over to an entrance ---------- */
      const book = one('.book');
      const depth = () => one('.edge-fore').offsetWidth;
      const seatBook = () => {
        const D = depth();
        gsap.set('.cover', { z: D / 2 + 0.3 });
        gsap.set('.leaf', { z: (i) => D / 2 - 0.4 - i * 0.3 });
        gsap.set('.ribbon', { z: D / 2 - 1.6 });
      };
      seatBook();

      /* ---------- the close-up: a flat twin of the right-hand page, under one camera with the book ---------- */
      const HANDOFF = 0.66; // the book lies flat from here; the twin takes over the page and the camera keeps moving
      const camera = one('.camera');
      const block = one('.pageblock');
      const page = one('.page');
      const v15 = one('#v15');
      const clause = one('.hl-clause');
      const sheet = clause.closest('.folio') as HTMLElement;
      const hlWords = SplitText.create(clause, { type: 'words', tag: 'span' }).words as HTMLElement[];
      const hl = { p: reduce ? 1 : 0 };
      let bars: HTMLElement[] = [];
      const paintBars = () => bars.forEach((b, i) => (b.style.transform = `scaleX(${Math.min(1, Math.max(0, hl.p * bars.length - i))})`));
      // Red letter: one crimson marker stroke per line of "but as for me and my house…", drawn left to right.
      const layoutBars = () => {
        sheet.querySelectorAll('.hl-bar').forEach((b) => b.remove()); // including any left from a previous visit
        const box = sheet.getBoundingClientRect();
        const k = box.width / sheet.offsetWidth || 1; // undo whatever scale the page is drawn at
        const lines: DOMRect[][] = [];
        hlWords.map((w) => w.getBoundingClientRect()).forEach((r) => {
          const line = lines.at(-1);
          if (line && Math.abs(line[0].top - r.top) < r.height / 2) line.push(r);
          else lines.push([r]);
        });
        bars = lines.map((l) => {
          const a = l[0];
          const b = l[l.length - 1];
          const bar = document.createElement('span');
          bar.className = 'hl-bar';
          Object.assign(bar.style, {
            left: `calc(${(a.left - box.left) / k}px - .15em)`,
            top: `${(a.top - box.top) / k}px`,
            width: `calc(${(b.right - a.left) / k}px + .3em)`,
            height: `${a.height / k}px`,
          });
          sheet.append(bar);
          return bar;
        });
        paintBars();
      };

      let geo: { ox: number; oy: number; zoom: number; tx: number; ty: number } | null = null;
      const cam = { t: 0 };
      // Lay the flat page exactly over the 3D page, and work out where the camera has to end up.
      const measure = () => {
        gsap.set(camera, { x: 0, y: 0, scale: 1 });
        const r = block.getBoundingClientRect();
        const aspect = r.height / r.width;
        gsap.set(page, { x: 0, y: 0, scale: 1, width: 1000, height: 1000 * aspect });
        const column = Math.min(innerWidth * 0.86, 620); // how wide verse 15's column reads once the camera arrives
        const P = (1000 * column) / v15.getBoundingClientRect().width;
        gsap.set(page, { width: P, height: P * aspect, x: r.left, y: r.top, scale: r.width / P });
        const v = v15.getBoundingClientRect();
        const ox = v.left + v.width / 2;
        const oy = v.top + Math.min(v.height, innerHeight * 0.7) / 2;
        // Arriving at zoom P / r.width puts the page back at its natural size: the text is crisp, not a scaled-up bitmap.
        geo = { ox, oy, zoom: P / r.width, tx: innerWidth / 2 - ox, ty: innerHeight / 2 - oy };
        layoutBars();
      };
      const applyCamera = () => {
        if (!geo) measure();
        const g = geo!;
        // Exponential zoom reads as a steady dolly; linear zoom would rush at the end.
        gsap.set(camera, { transformOrigin: `${g.ox}px ${g.oy}px`, scale: g.zoom ** cam.t, x: g.tx * cam.t, y: g.ty * cam.t });
      };
      const onCameraRefresh = () => {
        geo = null;
        if (cam.t > 0) applyCamera();
      };
      ScrollTrigger.addEventListener('refresh', onCameraRefresh);
      off.push(() => ScrollTrigger.removeEventListener('refresh', onCameraRefresh));

      let intro: gsap.core.Timeline | undefined;
      let heroTl: gsap.core.Timeline | undefined;
      if (!reduce) {
        intro = gsap
          .timeline({ paused: true, defaults: { ease: 'power3.out' } })
          .from('.masthead', { autoAlpha: 0, y: -16, duration: 0.8 }, 0)
          .from('.book-tilt', { y: 200, autoAlpha: 0, duration: 2, ease: 'power2.out' }, 0)
          .from('#book .contours', { autoAlpha: 0, duration: 1.6 }, 0.2)
          // The intro moves the children; the scroll below moves their containers. Never the same element,
          // or the scroll records the pre-intro (hidden) state and restores it on the way back up.
          .from('.identity .eyebrow', { autoAlpha: 0, duration: 0.6 }, 0.18)
          .add(words(one('.hero-title')).play(), 0.18)
          .from('.panels > *', { autoAlpha: 0, y: 20, stagger: 0.12, duration: 1 }, 0.9)
          .from('.hero-foot > *', { autoAlpha: 0, y: 20, stagger: 0.08, duration: 1 }, 1.5);

        // The book leans toward the cursor while the hero is at rest.
        let tiltOn = true;
        const rx = gsap.quickTo('.book-tilt', 'rotationX', { duration: 0.9, ease: 'power3.out' });
        const ry = gsap.quickTo('.book-tilt', 'rotationY', { duration: 0.9, ease: 'power3.out' });
        const lean = (e: PointerEvent) => {
          if (!tiltOn) return;
          rx((0.5 - e.clientY / innerHeight) * 10);
          ry((e.clientX / innerWidth - 0.5) * 14);
        };
        if (finePointer) {
          window.addEventListener('pointermove', lean);
          off.push(() => window.removeEventListener('pointermove', lean));
        }

        // One pinned stage: UI leaves, the book tilts to a 3/4 view, opens, pages turn, the camera dives into Joshua 24.
        heroTl = gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '#book', pin: true, start: 'top top', end: () => `+=${innerHeight * heroVh()}`, scrub: 1,
              onUpdate: (s) => {
                const rest = s.progress < 0.02;
                if (rest !== tiltOn) { tiltOn = rest; if (!rest) { rx(0); ry(0); } }
              },
            },
          })
          .to('.identity', { y: -60, autoAlpha: 0, duration: 0.07 }, 0)
          .to('.panels', { x: 80, autoAlpha: 0, duration: 0.07 }, 0)
          .to('.hero-foot', { y: 40, autoAlpha: 0, duration: 0.05 }, 0)
          .to(book, { rotationX: 48, rotationZ: -12, scale: 1.06, duration: 0.22, ease: 'power1.inOut' }, 0.04)
          .fromTo('.cap-title', { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.08 }, 0.08)
          .fromTo('.cap-body', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.08 }, 0.12)
          .to('.hero-caption > *', { y: -30, autoAlpha: 0, duration: 0.06, stagger: 0.01 }, 0.3)
          .to(book, { xPercent: 50, duration: 0.14, ease: 'power2.inOut' }, 0.28)
          .to('.cover', { rotationY: -179.6, duration: 0.14, ease: 'power2.inOut' }, 0.28)
          .to('.leaf', { rotationY: -179.4, z: (i) => depth() / 2 + 1 + i * 0.5, duration: 0.1, stagger: 0.035, ease: 'power2.inOut' }, 0.4)
          // The book settles flat, facing the camera, so its right page is a true rectangle on screen.
          .to(book, { rotationX: 0, rotationZ: 0, scale: 1.12, duration: 0.1, ease: 'power2.inOut' }, 0.56)
          // One continuous move: the twin page appears exactly over the 3D page, then a single camera carries both.
          .set('.page-layer', { autoAlpha: 1 }, HANDOFF)
          .to(cam, { t: 1, duration: 0.2, ease: 'power2.inOut', onUpdate: applyCamera }, HANDOFF)
          .fromTo('#book .contours', { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.1, immediateRender: false }, HANDOFF) // the intro fades these in too
          .to(hl, { p: 1, duration: 0.08, onUpdate: paintBars }, 0.87)
          .fromTo('.page-caption', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.9)
          // Everything but the verse falls back.
          .to(page, { '--ink-a': 0.2, duration: 0.05 }, 0.95)
          .to({}, { duration: 0 }, 1);
        if (!isPhone()) heroTl.fromTo('.scene', { filter: 'blur(0px)' }, { filter: 'blur(5px)', duration: 0.2, ease: 'power2.in' }, HANDOFF); // a blur over a 3D layer is too much for a phone

        // "Open the book" plays the opening and stops on the verse, instead of Lenis racing past it to #house.
        const heroST = heroTl.scrollTrigger!;
        const openBtn = one('.hero-foot .cta');
        const openBook = (e: MouseEvent) => {
          if (!lenis) return;
          e.preventDefault();
          e.stopPropagation(); // Lenis's anchor handler listens on window
          lenis.scrollTo(heroST.end, { duration: heroVh(), easing: (t) => 0.5 - Math.cos(Math.PI * t) / 2 });
        };
        openBtn.addEventListener('click', openBook);
        off.push(() => openBtn.removeEventListener('click', openBook));
      }

      ScrollTrigger.addEventListener('refresh', seatBook);

      if (!reduce) {
        /* ---------- 2 · the house: draw the ark, then go in through its door ---------- */
        gsap
          .timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '#house', pin: true, start: 'top top', end: () => `+=${innerHeight * arkVh()}`, scrub: 1 } })
          .fromTo('.ark-lines path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3, stagger: 0.015 }, 0)
          .fromTo('.door-light', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.22)
          .fromTo('.house-caption > *', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.03, duration: 0.1 }, 0.12)
          .to('.house-caption', { y: -40, autoAlpha: 0, duration: 0.08 }, 0.42)
          .fromTo('.door-photo', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.4)
          .to('.ark-wrap', { scale: 34, duration: 0.36, ease: 'power3.in' }, 0.45)
          .to('#house .contours', { autoAlpha: 0, duration: 0.2 }, 0.45)
          .fromTo('.house-inside', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.76)
          .fromTo('.house-inside img', { scale: 1.3 }, { scale: 1, duration: 0.2, ease: 'power2.out' }, 0.76)
          .fromTo('.house-inside-ui > *', { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.04, duration: 0.1 }, 0.84)
          .to({}, { duration: 0 }, 1);

        /* ---------- 5 · ministries: pinned horizontal run ---------- */
        const track = one('.track');
        const run = () => track.scrollWidth - innerWidth;
        const horizontal = gsap
          .timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '#ministries', pin: true, start: 'top top', end: () => `+=${run()}`, scrub: 1, invalidateOnRefresh: true } })
          .to(track, { x: () => -run() }, 0)
          .fromTo('.track-progress span', { scaleX: 0 }, { scaleX: 1 }, 0);
        q('.min-panel').forEach((panel) => {
          const along = { trigger: panel, containerAnimation: horizontal, start: 'left right', end: 'right left', scrub: true };
          gsap.fromTo(panel.querySelector('img'), { xPercent: -10, scale: 1.2 }, { xPercent: 10, scale: 1.2, ease: 'none', scrollTrigger: along });
          gsap.from(SplitText.create(panel.querySelector('h3')!, { type: 'chars', aria: 'auto' }).chars, {
            yPercent: 110, opacity: 0, stagger: 0.02, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: panel, containerAnimation: horizontal, start: 'left 70%', toggleActions: 'play none none reverse' },
          });
        });

      }

      /* ---------- the loading veil: the mark creeps to 70%, completes when ready, then lifts ---------- */
      // Hidden, never removed: React owns this node and keeps the page alive between visits.
      const veil = one('.veil');
      const hideVeil = () => (veil.style.display = 'none');
      if (!first) {
        hideVeil();
        intro?.progress(1);
      } else {
      const progress = { v: 0 };
      const paint = () => gsap.set('.veil-fill, .veil-meter span', { scaleY: (i) => (i === 0 ? progress.v : 1), scaleX: (i) => (i === 1 ? progress.v : 1) });
      const creep = gsap.to(progress, { v: 0.7, duration: 3, ease: 'power1.out', onUpdate: paint });
      // `load`, not `decode()`: decode never settles in a background tab. The race is the backstop.
      const loaded = (src: string) => new Promise((r) => Object.assign(new Image(), { onload: r, onerror: r, src }));
      const ready = Promise.race([
        Promise.all([document.fonts.ready, new Promise((r) => setTimeout(r, reduce ? 300 : 1400)), loaded('/img/photos/house.webp'), loaded('/img/photos/w4.webp')]),
        new Promise((r) => setTimeout(r, 6000)),
      ]);
      ready.then(
        contextSafe!(() => {
          if (!alive) return;
          creep.kill();
          gsap
            .timeline()
            .to(progress, { v: 1, duration: 0.5, ease: 'power3.out', onUpdate: paint })
            .to('.veil-content, .veil-meter', { autoAlpha: 0, y: -12, duration: 0.43, ease: 'power2.out' })
            .to(veil, { autoAlpha: 0, duration: reduce ? 0.2 : 0.8, ease: 'power2.out' }, '+=0.24')
            .add(() => {
              veil.setAttribute('aria-label', 'Loaded');
              intro?.play();
            }, '<')
            .add(() => {
              hideVeil();
              lenis?.start();
              ScrollTrigger.refresh();
            });
        }),
      );
      }

      return () => {
        alive = false;
        off.forEach((f) => f());
        bars.forEach((b) => b.remove());
        ScrollTrigger.removeEventListener('refresh', seatBook);
        lenis?.start();
      };
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
