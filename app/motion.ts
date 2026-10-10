import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);
// Phones resize the viewport when the URL bar slides; re-measuring every pin on that is what makes pages jump.
ScrollTrigger.config({ ignoreMobileResize: true });

export const prefersReduced = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isPhone = () => typeof window !== 'undefined' && innerWidth < 768;

let lenis: Lenis | null | undefined;

/** One smooth-scroll instance for the whole visit, shared by every page. null when motion is reduced. */
export function getLenis() {
  if (lenis !== undefined || typeof window === 'undefined') return lenis ?? null;
  if (prefersReduced()) return (lenis = null);
  lenis = new Lenis({ anchors: true, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/** The veil only plays on the first page of a visit, not on every return to the home page. */
export const visit = { firstLoad: true };
