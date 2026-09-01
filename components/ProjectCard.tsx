import Link from 'next/link';
import Image from 'next/image';

export default function ProjectCard({
  href,
  tag,
  title,
  summary,
  image,
}: {
  href: string;
  tag: string;
  title: string;
  summary: string;
  image?: string;
}) {
  return (
    <Link className="card" href={href}>
      {image && (
        <div className="thumb">
          <Image src={image} alt="" width={1200} height={720} style={{ width: '100%', height: 'auto' }} />
          <span className="thumb-label">View project ↗</span>
        </div>
      )}
      <div className="tag">{tag}</div>
      <h3>{title}</h3>
      <p>{summary}</p>
    </Link>
  );
}
