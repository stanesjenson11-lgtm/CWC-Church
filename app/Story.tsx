'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { contours, dissolve } from './fx';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const HERO_VH = 6; // hero → book opens → page close-up, in viewport heights of scroll
const ARK_VH = 4;

export default function Story({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      history.scrollRestoration = 'manual';
      scrollTo(0, 0);
      const q = gsap.utils.selector(root);
      const one = <T extends Element = HTMLElement>(s: string) => q(s)[0] as unknown as T;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
      const tokens = getComputedStyle(document.documentElement);
      const color = (name: string) => tokens.getPropertyValue(name).trim();
      const off: (() => void)[] = [];
      const on = <K extends keyof WindowEventMap>(t: Window | Document | Element, type: K | string, fn: (e: never) => void, opts?: AddEventListenerOptions) => {
        t.addEventListener(type, fn as EventListener, opts);
        off.push(() => t.removeEventListener(type, fn as EventListener));
      };
      let alive = true;
      document.documentElement.classList.add('js', reduce ? 'still' : 'moving');

      /* ---------- smooth scroll ---------- */
      const lenis = reduce ? null : new Lenis({ anchors: true, autoRaf: false });
      const raf = (t: number) => lenis?.raf(t * 1000);
      if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        lenis.stop();
      }

      /* ---------- canvases ---------- */
      const contourLoops = q('canvas.contours').map((cv) => {
        const draw = contours(cv as HTMLCanvasElement, cv.getAttribute('data-tone') === 'ink' ? 'rgb(14 14 14 / 0.09)' : 'rgb(245 245 245 / 0.13)');
        let visible = false;
        let last = 0;
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
        io.observe(cv);
        off.push(() => io.disconnect());
        return { draw, tick: (now: number) => visible && now - last > 33 && ((last = now), draw(now)) };
      });
      const tickContours = () => contourLoops.forEach((l) => l.tick(performance.now()));
      if (reduce) contourLoops.forEach((l) => l.draw());
      else gsap.ticker.add(tickContours);


      /* ---------- text engine: words / letters rise once, when they arrive ---------- */
      const words = (el: Element, delay = 0) =>
        gsap.from(SplitText.create(el, { type: 'words', aria: 'auto' }).words, { opacity: 0, y: '0.35em', duration: 0.9, stagger: 0.11, delay, ease: 'power3.out', paused: true });
      const letters = (el: Element) =>
        gsap.from(SplitText.create(el, { type: 'chars', aria: 'auto' }).chars, { opacity: 0, y: '0.3em', duration: 0.6, stagger: 0.026, ease: 'power3.out', paused: true });
      const onArrive = (el: Element, anim: gsap.core.Tween, start = 'top 82%') =>
        ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => anim.play() });

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

      let intro: gsap.core.Timeline | undefined;
      let heroTl: gsap.core.Timeline | undefined;
      if (!reduce) {
        intro = gsap
          .timeline({ paused: true, defaults: { ease: 'power3.out' } })
          .from('.masthead', { autoAlpha: 0, y: -16, duration: 0.8 }, 0)
          .from('.book-tilt', { y: 200, autoAlpha: 0, duration: 2, ease: 'power2.out' }, 0)
          .from('#book .contours', { autoAlpha: 0, duration: 1.6 }, 0.2)
          .from('.identity .eyebrow', { autoAlpha: 0, duration: 0.6 }, 0.18)
          .add(words(one('.hero-title')).play(), 0.18)
          .from('.meta li', { autoAlpha: 0, y: 12, stagger: 0.13, duration: 0.7 }, 0.44)
          .from('.panels', { autoAlpha: 0, y: 20, duration: 1 }, 0.9)
          .from('.hero-foot', { autoAlpha: 0, y: 20, duration: 1 }, 1.5);

        // The book leans toward the cursor while the hero is at rest.
        let tiltOn = true;
        const rx = gsap.quickTo('.book-tilt', 'rotationX', { duration: 0.9, ease: 'power3.out' });
        const ry = gsap.quickTo('.book-tilt', 'rotationY', { duration: 0.9, ease: 'power3.out' });
        if (finePointer) on(window, 'pointermove', (e: PointerEvent) => {
          if (!tiltOn) return;
          rx((0.5 - e.clientY / innerHeight) * 10);
          ry((e.clientX / innerWidth - 0.5) * 14);
        });

        // One pinned stage: UI leaves, the book tilts to a 3/4 view, opens, pages turn, the camera dives into Joshua 24.
        heroTl = gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '#book', pin: true, start: 'top top', end: () => `+=${innerHeight * HERO_VH}`, scrub: 1,
              onUpdate: (s) => {
                const rest = s.progress < 0.02;
                if (rest !== tiltOn) { tiltOn = rest; if (!rest) { rx(0); ry(0); } }
              },
            },
          })
          .to('.identity > *', { y: -60, autoAlpha: 0, stagger: 0.01, duration: 0.07 }, 0)
          .to('.panels', { x: 80, autoAlpha: 0, duration: 0.07 }, 0)
          .to('.hero-foot', { y: 40, autoAlpha: 0, duration: 0.05 }, 0)
          .to(book, { rotationX: 48, rotationZ: -12, scale: 1.06, duration: 0.22, ease: 'power1.inOut' }, 0.04)
          .fromTo('.cap-title', { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.08 }, 0.08)
          .fromTo('.cap-body', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.08 }, 0.12)
          .to('.hero-caption > *', { y: -30, autoAlpha: 0, duration: 0.06, stagger: 0.01 }, 0.3)
          .to(book, { xPercent: 50, duration: 0.14, ease: 'power2.inOut' }, 0.28)
          .to('.cover', { rotationY: -179.6, duration: 0.14, ease: 'power2.inOut' }, 0.28)
          .to('.leaf', { rotationY: -179.4, z: (i) => depth() / 2 + 1 + i * 0.5, duration: 0.1, stagger: 0.035, ease: 'power2.inOut' }, 0.4)
          .to(book, { rotationX: 14, rotationZ: 0, scale: 1.2, duration: 0.1, ease: 'power1.inOut' }, 0.56)
          .to('.scene', { scale: 7, duration: 0.12, ease: 'power2.in' }, 0.65)
          .to('#book .contours', { autoAlpha: 0, duration: 0.08 }, 0.65)
          .fromTo('.page-layer', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.73)
          .fromTo('.page', { scale: 1.6 }, { scale: 1, duration: 0.1, ease: 'power2.out' }, 0.73)
          .to('.page', { scale: 1.1, duration: 0.2 }, 0.83)
          .fromTo('.page-caption', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.86)
          .to({}, { duration: 0 }, 1);
      }

      // Frame the close-up on verse 15 (the page is wider and taller than the screen).
      const page = one('.page');
      const v15 = one('#v15');
      const centerPage = () => {
        const col = v15.offsetParent as HTMLElement;
        // On a phone the verse is wider than the screen, so pin its left edge 20px in instead of centring it.
        const x = col.offsetLeft + v15.offsetLeft + (innerWidth < 700 ? innerWidth / 2 - 20 : v15.offsetWidth / 2);
        const y = col.offsetTop + v15.offsetTop + v15.offsetHeight * 0.65;
        gsap.set(page, { x: innerWidth / 2 - x, y: innerHeight / 2 - y, transformOrigin: `${x}px ${y}px` });
      };
      centerPage();
      ScrollTrigger.addEventListener('refreshInit', centerPage);
      ScrollTrigger.addEventListener('refresh', seatBook);

      // Red letter: a crimson marker stroke drawn one line at a time across "but as for me and my house…".
      const clause = one('.hl-clause');
      SplitText.create(clause, {
        type: 'words', tag: 'span', autoSplit: true,
        onSplit: (s) => {
          const host = clause.closest('.page-col') as HTMLElement;
          host.querySelectorAll('.hl-bar').forEach((b) => b.remove());
          const box = host.getBoundingClientRect();
          const k = box.width / host.offsetWidth || 1;
          const lines: DOMRect[][] = [];
          (s.words as HTMLElement[]).map((w) => w.getBoundingClientRect()).forEach((r) => {
            const line = lines.at(-1);
            if (line && Math.abs(line[0].top - r.top) < r.height / 2) line.push(r);
            else lines.push([r]);
          });
          const bars = lines.map((l) => {
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
            host.append(bar);
            return bar;
          });
          if (!heroTl) return;
          // Drawn inside the hero's own scrubbed timeline. A separate trigger keyed off the pinned
          // section would get the pin's spacing added twice and start a whole stage late.
          const draw = gsap.fromTo(bars, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 0.16 / bars.length, stagger: 0.16 / bars.length });
          heroTl.add(draw, 0.8);
          return draw;
        },
      });

      if (!reduce) {
        /* ---------- 2 · the verse: read word by word, then the house slides over it ---------- */
        SplitText.create('.verse-text', {
          type: 'words', aria: 'auto',
          onSplit: (s) =>
            gsap.fromTo(s.words, { opacity: 0.16 }, {
              opacity: 1, stagger: 0.1, ease: 'none',
              scrollTrigger: { trigger: '#verse', start: 'top 55%', end: 'top -10%', scrub: true },
            }),
        });
        gsap.from('.verse-foot > *', { y: 24, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '#verse', start: 'top 20%', toggleActions: 'play none none reverse' } });
        ScrollTrigger.create({ trigger: '#verse', start: 'bottom bottom', end: '+=100%', pin: true, pinSpacing: false });
        const recede = { trigger: '#house', start: 'top bottom', end: 'top top', scrub: true };
        gsap.to('#verse .verse-inner', { scale: 0.9, ease: 'none', scrollTrigger: recede });
        gsap.to('#verse .shade', { opacity: 0.55, ease: 'none', scrollTrigger: recede });

        /* ---------- 3 · the house: draw the ark, then go in through its door ---------- */
        gsap
          .timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '#house', pin: true, start: 'top top', end: () => `+=${innerHeight * ARK_VH}`, scrub: 1 } })
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

        /* ---------- 4 · life: a rail with a thread and a turning marker; three parallax depths per row ---------- */
        const rail = one('.rail');
        gsap.timeline({ scrollTrigger: { trigger: rail, start: 'top center', end: 'bottom bottom', scrub: 0.6 } })
          .fromTo('.rail-run', { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0)
          .fromTo('.rail-mark', { y: 0, rotation: 0 }, { y: () => rail.offsetHeight, rotation: 1800, ease: 'none' }, 0);
        q('.row').forEach((row) => {
          const span = { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true };
          const travel = row.classList.contains('side') ? 60 : 20;
          gsap.fromTo(row.querySelector('.row-plate'), { y: travel }, { y: -travel, ease: 'none', scrollTrigger: span });
          gsap.fromTo(row.querySelector('.plate-fill img'), { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: row, start: 'top bottom', end: 'top center', scrub: true } });
          const copy = row.querySelector('.row-copy');
          if (copy) {
            gsap.fromTo(copy, { y: 110 }, { y: -110, ease: 'none', scrollTrigger: span });
            gsap.from(copy, { autoAlpha: 0, duration: 0.9, delay: 0.22, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 75%', once: true } });
          }
        });

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

        /* ---------- 6 · leaders: the figure rides up; the strip arrives card by card ---------- */
        gsap.fromTo('.figure', { yPercent: 6 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '#leaders', start: 'top bottom', end: 'bottom bottom', scrub: true } });
        gsap.from('.svc', { y: 16, autoAlpha: 0, stagger: 0.09, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.band', start: 'top 85%', once: true } });
        gsap.from('.svc-link', { scaleX: 0, stagger: 0.09, duration: 0.8, delay: 0.3, ease: 'power3.out', scrollTrigger: { trigger: '.band', start: 'top 85%', once: true } });
        gsap.from('.leader-list, .leaders-intro', { y: 24, autoAlpha: 0, stagger: 0.14, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '#leaders', start: 'top 55%', once: true } });

        /* ---------- generic word / letter reveals ---------- */
        q('[data-words]').forEach((el) => el.classList.contains('hero-title') || onArrive(el, words(el)));
        q('.row-word, .footer-nav a').forEach((el) => onArrive(el, letters(el), el.closest('footer') ? 'top 98%' : 'top 75%'));
        gsap.from('.footer-info, .footer-row > *', { y: 12, autoAlpha: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '#contact', start: 'top 50%', once: true } });
      }

      /* ---------- pixel-dissolve seams (created after the pins, so their spacing is counted) ---------- */
      if (!reduce)
        q('canvas.dissolve').forEach((cv) => {
          const draw = dissolve(cv as HTMLCanvasElement, color(cv.getAttribute('data-carry') === 'light' ? '--page' : '--ink'), color('--accent'));
          ScrollTrigger.create({
            trigger: cv.parentElement, start: 'top bottom', end: 'top top',
            onUpdate: (s) => draw(s.progress), onRefresh: (s) => draw(s.progress),
          });
        });

      /* ---------- nav: active section, sliding dot ---------- */
      const dot = one('.nav-dot');
      const links = q('.nav [data-nav]');
      const setActive = (id: string) => {
        const a = links.find((l) => l.getAttribute('data-nav') === id);
        links.forEach((l) => l.classList.toggle('is-active', l === a));
        if (a) gsap.to(dot, { x: a.offsetLeft + a.offsetWidth / 2, autoAlpha: 1, duration: reduce ? 0 : 0.6, ease: 'expo.out' });
      };
      q('[data-section]').forEach((el) =>
        ScrollTrigger.create({
          trigger: el, start: 'top center', end: 'bottom center',
          // enter / enterBack rather than toggle: pinned sections overlap, and the newest one should win
          onEnter: () => setActive(el.getAttribute('data-section')!),
          onEnterBack: () => setActive(el.getAttribute('data-section')!),
        }),
      );

      /* ---------- leaders: hover or press a name to bring that person forward ---------- */
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
        on(b, 'mouseenter', () => show(id));
        on(b, 'focus', () => show(id));
        on(b, 'click', () => show(id));
      });

      /* ---------- menu sheet (below 1024px) ---------- */
      const html = document.documentElement;
      const burger = one<HTMLButtonElement>('.burger');
      const openSheet = (open: boolean) => {
        html.classList.toggle('menu-open', open);
        burger.setAttribute('aria-expanded', String(open));
        if (open) {
          lenis?.stop();
          gsap.fromTo('.sheet-nav a', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, stagger: 0.055, delay: 0.12, duration: 0.6, ease: 'power3.out' });
          one<HTMLButtonElement>('.sheet-close').focus();
        } else {
          lenis?.start();
          burger.focus();
        }
      };
      on(burger, 'click', () => openSheet(true));
      on(one('.sheet-close'), 'click', () => openSheet(false));
      q('.sheet-nav a').forEach((a) => on(a, 'click', () => html.classList.contains('menu-open') && openSheet(false)));
      on(window, 'keydown', (e: KeyboardEvent) => e.key === 'Escape' && html.classList.contains('menu-open') && openSheet(false));

      /* ---------- cursor + magnetic buttons (fine pointers only) ---------- */
      if (finePointer && !reduce) {
        const cursor = one('.cursor');
        const label = one('.cursor-label');
        const cx = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
        const cy = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });
        on(window, 'pointermove', (e: PointerEvent) => {
          cx(e.clientX);
          cy(e.clientY);
          cursor.classList.add('is-on');
        });
        on(document, 'pointerover', (e: PointerEvent) => {
          const t = (e.target as Element).closest('a, button, [data-cursor]');
          cursor.classList.toggle('is-link', !!t);
          label.textContent = t?.getAttribute('data-cursor') ?? '';
        });
        on(document.documentElement, 'pointerleave', () => cursor.classList.remove('is-on'));
        q('[data-magnetic]').forEach((el) => {
          const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
          const my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
          on(el, 'pointermove', (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            mx((e.clientX - r.left - r.width / 2) * 0.25);
            my((e.clientY - r.top - r.height / 2) * 0.35);
          });
          on(el, 'pointerleave', () => (mx(0), my(0)));
        });
      }

      /* ---------- the loading veil: the mark creeps to 70%, completes when ready, then lifts ---------- */
      const veil = one('.veil');
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
              veil.remove();
              lenis?.start();
              ScrollTrigger.refresh();
            });
        }),
      );

      return () => {
        alive = false;
        off.forEach((f) => f());
        lenis?.destroy();
        gsap.ticker.remove(raf);
        gsap.ticker.remove(tickContours);
        ScrollTrigger.removeEventListener('refreshInit', centerPage);
        ScrollTrigger.removeEventListener('refresh', seatBook);
        document.documentElement.classList.remove('js', 'still', 'moving', 'menu-open');
      };
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
