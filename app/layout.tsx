import type { Metadata, Viewport } from 'next';
import { Archivo, EB_Garamond, Noto_Sans_Kannada, Noto_Sans_Tamil, Noto_Sans_Telugu } from 'next/font/google';
import Masthead from './Masthead';
import Shell from './Shell';
import Footer from './Footer';
import { PlateDefs } from './ui';
import './globals.css';

// One family, two voices: the width axis gives a condensed display cut and a regular text cut.
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-sans' });
// Scripture only: the Bible page is set the way a Bible is set.
const garamond = EB_Garamond({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-serif' });
// The language pages greet people in their own script. Files only download where those glyphs appear.
const telugu = Noto_Sans_Telugu({ subsets: ['telugu'], weight: ['700'], variable: '--font-telugu' });
const kannada = Noto_Sans_Kannada({ subsets: ['kannada'], weight: ['700'], variable: '--font-kannada' });
const tamil = Noto_Sans_Tamil({ subsets: ['tamil'], weight: ['700'], variable: '--font-tamil' });

export const metadata: Metadata = {
  title: { default: 'Compassion Worship Center · Hennur Gardens, Bengaluru', template: '%s · Compassion Worship Center' },
  description: 'Reaching, touching and changing lives in the name of Jesus. Sunday services in English, Telugu, Kannada and Tamil at Hennur Gardens, Bengaluru.',
};

export const viewport: Viewport = { themeColor: '#0e0e0e' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [archivo, garamond, telugu, kannada, tamil].map((f) => f.variable).join(' ');
  return (
    <html lang="en" className={fonts}>
      <body>
        <PlateDefs />
        <div className="cursor" aria-hidden="true"><span className="cursor-dot" /><span className="cursor-label" /></div>
        <Masthead />
        <Shell>
          {children}
          <Footer />
        </Shell>
      </body>
    </html>
  );
}
