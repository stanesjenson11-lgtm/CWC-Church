import type { Metadata, Viewport } from 'next';
import { Archivo, EB_Garamond } from 'next/font/google';
import './globals.css';

// One family, two voices: the width axis gives a condensed display cut and a regular text cut.
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-sans' });
// Scripture only: the Bible page is set the way a Bible is set.
const garamond = EB_Garamond({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'Compassion Worship Center — As for me and my house',
  description: 'Reaching, touching and changing lives in the name of Jesus. Come as you are. Sundays 11:30 AM, Hennur Gardens, Bengaluru.',
};

export const viewport: Viewport = { themeColor: '#0e0e0e' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${garamond.variable}`}>
      <body>{children}</body>
    </html>
  );
}
