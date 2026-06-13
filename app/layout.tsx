import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import { bio } from '@/components/data';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: bio.name,
  description: bio.blurb,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} font-sans bg-site-bg text-site-text antialiased`}>
        <Nav />
        {children}
        <footer className="px-8 md:px-16 py-8 border-t border-site-border">
          <p className="text-[10px] tracking-[0.2em] uppercase text-site-subtle">
            © {new Date().getFullYear()} {bio.name}
          </p>
        </footer>
      </body>
    </html>
  );
}
