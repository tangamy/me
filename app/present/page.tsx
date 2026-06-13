import ConstructionBarrier from '@/components/ConstructionBarrier';

export default function Present() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-8">
      <ConstructionBarrier className="w-72 md:w-96" />
      <p className="font-display font-light text-5xl tracking-widest text-site-muted">WIP</p>
    </main>
  );
}
