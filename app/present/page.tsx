import { bio } from '@/components/data';

export default function Present() {
  return (
    <main className="min-h-screen flex flex-col justify-center px-8 md:px-16">
      <div className="max-w-3xl py-32">
        <p className="text-[10px] tracking-[0.3em] uppercase text-site-subtle mb-14">Present</p>
        <p
          className="font-display font-light text-site-text leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
        >
          {bio.blurb}.
        </p>
      </div>
    </main>
  );
}
