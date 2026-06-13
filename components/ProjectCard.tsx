interface Props {
  title: string;
  description: string;
  url: string;
}

export default function ProjectCard({ title, description, url }: Props) {
  return (
    <a
      href={url}
      className="group block p-6 bg-white/40 border border-site-border rounded-xl hover:border-site-text transition-colors"
    >
      <h3 className="font-semibold text-site-text mb-2 group-hover:underline">{title}</h3>
      <p className="text-sm text-site-muted leading-relaxed">{description}</p>
    </a>
  );
}
