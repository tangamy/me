import { links } from '@/components/data';

export default function Future() {
  return (
    <main className="min-h-screen flex flex-col justify-center px-8 md:px-16">
      <div className="py-32">
        <p className="text-[10px] tracking-[0.3em] uppercase text-site-subtle mb-14">Future</p>
        <div className="flex flex-wrap gap-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              className="px-7 py-3 rounded-full border border-site-border text-site-muted text-sm tracking-[0.15em] hover:border-site-text hover:text-site-text transition-all duration-300"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
