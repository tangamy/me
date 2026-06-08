interface Props {
  title: string;
  description: string;
  url: string;
}

export default function ProjectCard({ title, description, url }: Props) {
  return (
    <a
      href={url}
      className="group block p-6 border border-neutral-200 rounded-xl hover:border-neutral-400 transition-colors"
    >
      <h3 className="font-semibold text-neutral-900 mb-2 group-hover:underline">{title}</h3>
      <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
    </a>
  );
}
