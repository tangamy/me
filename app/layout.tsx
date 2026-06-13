import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { bio } from '@/components/data';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: bio.name,
  description: bio.blurb,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-site-bg text-site-text antialiased`}>
        {children}
      </body>
    </html>
  );
}
