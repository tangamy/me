import { bio, projects, links } from '@/components/data';
import ProjectCard from '@/components/ProjectCard';

export default function Home() {
  return (
    <>
      <nav className="sticky top-0 z-10 bg-site-bg/80 backdrop-blur border-b border-site-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="font-semibold text-site-text">{bio.name}</span>
          <div className="flex gap-6 text-sm text-site-muted">
            <a href="#portfolio" className="hover:text-site-text transition-colors">Work</a>
            <a href="#links" className="hover:text-site-text transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6">
        <section id="hero" className="py-24">
          <h1 className="text-4xl font-bold mb-4 text-site-text">{bio.name}</h1>
          <p className="text-xl text-site-muted leading-relaxed max-w-xl">{bio.blurb}</p>
        </section>

        <section id="portfolio" className="py-16 border-t border-site-border">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-site-subtle mb-8">Work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.title} {...p} />
            ))}
          </div>
        </section>

        <section id="links" className="py-16 border-t border-site-border">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-site-subtle mb-8">Contact</h2>
          <div className="flex flex-wrap gap-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.url}
                className="px-4 py-2 rounded-full border border-site-border text-sm text-site-muted hover:border-site-text hover:text-site-text transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="max-w-3xl mx-auto px-6 py-10 border-t border-site-border">
        <p className="text-sm text-site-subtle">&copy; {new Date().getFullYear()} {bio.name}</p>
      </footer>
    </>
  );
}
