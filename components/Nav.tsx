'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { label: 'me',      href: '/' },
  { label: 'past',    href: '/past' },
  { label: 'present', href: '/present' },
  { label: 'future',  href: '/future' },
] as const;

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-8 bg-white/40 backdrop-blur-md border border-white/70 rounded-full px-10 py-3 shadow-sm">
        {NAV.map(({ label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`text-xs tracking-[0.2em] transition-colors ${
                active
                  ? 'text-site-text font-medium'
                  : 'text-site-muted hover:text-site-text'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
