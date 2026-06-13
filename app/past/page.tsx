import { projects } from '@/components/data';
import ProjectCard from '@/components/ProjectCard';

export default function Past() {
  return (
    <main className="min-h-screen flex flex-col justify-center px-8 md:px-16">
      <div className="max-w-2xl py-32">
        <p className="text-[10px] tracking-[0.3em] uppercase text-site-subtle mb-14">Past</p>
        <div className="space-y-5">
          {projects.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </div>
    </main>
  );
}
