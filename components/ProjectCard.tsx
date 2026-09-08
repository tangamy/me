interface Props {
  title: string;
  description: string;
  url: string;
}

export default function ProjectCard({ title, description, url }: Props) {
  return (
    <a
      href={url}
      className="group block p-6 bg-white/40 backdrop-blur-sm border border-white/70 rounded-xl hover:bg-white/60 hover:border-site-text transition-all duration-300"
    >
      <h3 className="font-display font-semibold text-xl text-site-text mb-2 group-hover:underline underline-offset-4">
        {title}
      </h3>
      <p className="text-sm text-site-muted leading-relaxed tracking-wide">{description}</p>
    </a>
  );
}
