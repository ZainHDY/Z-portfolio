import Link from 'next/link';
import Image from 'next/image';

export default function ProjectCard({ href, tag, title, summary, image, featured = false, viewLabel = 'View project ↗' }: { href:string; tag:string; title:string; summary:string; image?:string; featured?:boolean; viewLabel?:string }) {
  return <Link className={`card project-card${featured ? ' featured-project' : ''}`} href={href}>
    {image && <div className="thumb"><Image src={image} alt="" width={featured ? 1400 : 900} height={featured ? 780 : 600} style={{width:'100%',height:'auto'}} /></div>}
    <div className="project-info">
      <div className="tag">{tag}</div>
      <h3>{title}</h3>
      <p>{summary}</p>
      <span className="project-link">{viewLabel}</span>
    </div>
  </Link>;
}
