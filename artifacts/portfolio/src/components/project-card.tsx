import { Link } from "wouter";
import { ExternalLink, Github } from "lucide-react";

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  tech_stack: string[];
  category?: string | null;
  status: string;
  cover_image?: string | null;
  featured: boolean;
}

interface Props {
  project: Project;
  showFeaturedBadge?: boolean;
}

const categoryColors: Record<string, string> = {
  Automation: "#FFE600",
  AI: "#00FF41",
  SaaS: "#0066FF",
  OCR: "#FF2D20",
  "Internal Tools": "#FF8C00",
  "Web Apps": "#9B59B6",
};

export default function ProjectCard({ project, showFeaturedBadge }: Props) {
  const catColor = categoryColors[project.category ?? ""] ?? "#FFE600";

  return (
    <Link href={`/projects/${project.slug}`} data-testid={`card-project-${project.id}`}>
      <div className="border-[3px] border-black bg-[#F5F0E8] shadow-[6px_6px_0_#0A0A0A] hover:shadow-[8px_8px_0_#FFE600] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer group">
        {project.cover_image ? (
          <div className="border-b-[3px] border-black overflow-hidden h-48">
            <img
              src={project.cover_image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="border-b-[3px] border-black h-48 bg-black flex items-center justify-center">
            <span className="font-mono text-[#FFE600] text-lg uppercase tracking-widest opacity-60">
              {project.category ?? "PROJECT"}
            </span>
          </div>
        )}

        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-2 flex-wrap">
              {project.category && (
                <span
                  className="px-2 py-0.5 border-2 border-black text-xs font-bold uppercase"
                  style={{ backgroundColor: catColor, color: "#0A0A0A" }}
                >
                  {project.category}
                </span>
              )}
              {showFeaturedBadge && project.featured && (
                <span className="px-2 py-0.5 border-2 border-black bg-[#FFE600] text-xs font-bold uppercase">
                  FEATURED
                </span>
              )}
            </div>
            <span
              className={`px-2 py-0.5 border border-black text-xs font-bold uppercase ${
                project.status === "active"
                  ? "bg-[#00FF41] text-black"
                  : project.status === "wip"
                  ? "bg-[#FFE600] text-black"
                  : "bg-gray-300 text-black"
              }`}
            >
              {project.status}
            </span>
          </div>

          <h3 className="font-display text-2xl text-black uppercase mb-2 group-hover:text-[#FF2D20] transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {project.title}
          </h3>
          <p className="text-sm font-mono text-gray-700 mb-4 line-clamp-3">{project.description}</p>

          {project.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.tech_stack.slice(0, 4).map((t) => (
                <span key={t} className="px-1.5 py-0.5 border border-black text-xs font-mono bg-black text-white">
                  {t}
                </span>
              ))}
              {project.tech_stack.length > 4 && (
                <span className="px-1.5 py-0.5 border border-black text-xs font-mono text-gray-500">
                  +{project.tech_stack.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
