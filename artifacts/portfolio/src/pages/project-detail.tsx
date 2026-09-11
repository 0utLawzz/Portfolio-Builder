import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import Navbar from "@/components/navbar";
import { useGetProjectBySlug, getGetProjectBySlugQueryKey } from "@workspace/api-client-react";
import { ExternalLink, Github, ArrowLeft, Star, Eye, GitFork, Scale, BookOpen } from "lucide-react";

type GitHubRepoInfo = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  license: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  languages: { name: string; percent: number }[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
};

function parseGitHubUrl(url: string | null | undefined): { owner: string; repo: string } | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("github.com")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
  } catch {}
  return null;
}

function RepoInfoBox({ githubUrl }: { githubUrl: string }) {
  const [info, setInfo] = useState<GitHubRepoInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const parsed = parseGitHubUrl(githubUrl);
    if (!parsed) {
      setLoading(false);
      setError(true);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(false);

    fetch(`/api/github/${parsed.owner}/${parsed.repo}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((data: GitHubRepoInfo) => {
        setInfo(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });

    return () => controller.abort();
  }, [githubUrl]);

  if (loading) {
    return (
      <div className="border-[3px] border-black bg-white p-6 animate-pulse">
        <div className="h-6 bg-gray-200 mb-4 w-1/2" />
        <div className="h-4 bg-gray-200 mb-2" />
        <div className="h-4 bg-gray-200 w-3/4" />
      </div>
    );
  }

  if (error || !info) return null;

  return (
    <div className="border-[3px] border-black bg-white overflow-hidden">
      <div className="bg-black px-5 py-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#FFE600] uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          REPO INFO
        </h3>
        <a href={info.html_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors" title="View on GitHub">
          <Github size={16} />
        </a>
      </div>

      <div className="p-5 space-y-4">
        {info.description && (
          <div>
            <p className="text-[10px] font-mono uppercase text-gray-500 mb-1">About</p>
            <p className="font-mono text-xs text-gray-800 leading-relaxed">{info.description}</p>
          </div>
        )}

        {info.topics && info.topics.length > 0 && (
          <div>
            <p className="text-[10px] font-mono uppercase text-gray-500 mb-2">Topics</p>
            <div className="flex flex-wrap gap-1.5">
              {info.topics.map((t) => (
                <span key={t} className="border border-black bg-[#F5F0E8] px-2 py-0.5 text-[10px] font-mono uppercase">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 border-t-[2px] border-b-[2px] border-black py-3">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-black">
              <Star size={12} />
              <span className="font-bold font-mono text-sm">{info.stargazers_count}</span>
            </div>
            <p className="text-[9px] font-mono uppercase text-gray-500 mt-0.5">Stars</p>
          </div>
          <div className="text-center border-x border-gray-300">
            <div className="flex items-center justify-center gap-1 text-black">
              <Eye size={12} />
              <span className="font-bold font-mono text-sm">{info.watchers_count}</span>
            </div>
            <p className="text-[9px] font-mono uppercase text-gray-500 mt-0.5">Watchers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-black">
              <GitFork size={12} />
              <span className="font-bold font-mono text-sm">{info.forks_count}</span>
            </div>
            <p className="text-[9px] font-mono uppercase text-gray-500 mt-0.5">Forks</p>
          </div>
        </div>

        <div className="space-y-2">
          {info.license && (
            <div className="flex items-center gap-2 font-mono text-xs">
              <Scale size={12} className="text-gray-500 shrink-0" />
              <span className="text-gray-600">License:</span>
              <span className="font-bold uppercase">{info.license}</span>
            </div>
          )}
          <div className="flex items-center gap-2 font-mono text-xs">
            <BookOpen size={12} className="text-gray-500 shrink-0" />
            <a href={`${info.html_url}#readme`} target="_blank" rel="noreferrer" className="text-black hover:underline">README</a>
            <span className="text-gray-400">·</span>
            <a href={`${info.html_url}/blob/${info.default_branch}/LICENSE`} target="_blank" rel="noreferrer" className="text-black hover:underline">License file</a>
          </div>
        </div>

        {info.languages && info.languages.length > 0 && (
          <div>
            <p className="text-[10px] font-mono uppercase text-gray-500 mb-2">Languages</p>
            <div className="h-2 flex overflow-hidden border border-black mb-2">
              {info.languages.map((lang, i) => (
                <div
                  key={lang.name}
                  style={{
                    width: `${lang.percent}%`,
                    backgroundColor: i === 0 ? "#FFE600" : i === 1 ? "#00FF41" : "#000",
                  }}
                  title={`${lang.name} ${lang.percent}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {info.languages.slice(0, 4).map((lang, i) => (
                <span key={lang.name} className="font-mono text-[10px] text-gray-700">
                  <span
                    className="inline-block w-2 h-2 mr-1 border border-black"
                    style={{ backgroundColor: i === 0 ? "#FFE600" : i === 1 ? "#00FF41" : "#000" }}
                  />
                  {lang.name} {lang.percent}%
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="font-mono text-[10px] text-gray-500 pt-1 border-t border-gray-200">
          Updated {new Date(info.updated_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        </p>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: project, isLoading } = useGetProjectBySlug(slug ?? "", {
    query: {
      enabled: !!slug,
      queryKey: getGetProjectBySlugQueryKey(slug ?? ""),
    },
  });

  useEffect(() => {
    if (project) document.title = `${project.title} | OUTLAWZ LABS™`;
  }, [project]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8]" style={{ fontFamily: "'Space Mono', monospace" }}>
        <Navbar />
        <div className="py-20 px-6 max-w-5xl mx-auto space-y-6">
          <div className="h-12 bg-gray-200 border-[3px] border-black animate-pulse" />
          <div className="h-64 bg-gray-200 border-[3px] border-black animate-pulse" />
          <div className="h-40 bg-gray-200 border-[3px] border-black animate-pulse" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F5F0E8]" style={{ fontFamily: "'Space Mono', monospace" }}>
        <Navbar />
        <div className="py-20 px-6 max-w-5xl mx-auto">
          <div className="border-[3px] border-black p-16 text-center bg-white">
            <h1 className="text-5xl font-bold uppercase mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>PROJECT NOT FOUND</h1>
            <Link href="/projects" className="inline-block border-[3px] border-black px-6 py-3 font-bold uppercase hover:bg-black hover:text-white transition-colors">
              BACK TO PROJECTS
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]" style={{ fontFamily: "'Space Mono', monospace" }}>
      <Navbar />

      <div className="border-b-[3px] border-black bg-black">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link href="/projects" className="flex items-center gap-2 text-gray-400 hover:text-white font-mono text-sm uppercase transition-colors">
            <ArrowLeft size={14} />
            BACK TO PROJECTS
          </Link>
        </div>
      </div>

      {project.cover_image && (
        <div className="border-b-[3px] border-black">
          <div className="max-w-5xl mx-auto">
            <img
              src={project.cover_image}
              alt={project.title}
              className="w-full h-64 md:h-96 object-cover border-x-0"
            />
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="border-[3px] border-black bg-[#F5F0E8] p-8 mb-6 shadow-[6px_6px_0_#0A0A0A]">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.category && (
              <span className="px-3 py-1 border-[2px] border-black bg-[#FFE600] text-black font-bold text-xs uppercase">
                {project.category}
              </span>
            )}
            <span className={`px-3 py-1 border-[2px] border-black font-bold text-xs uppercase ${
              project.status === "active" ? "bg-[#00FF41] text-black" :
              project.status === "wip" ? "bg-[#FFE600] text-black" :
              "bg-gray-300 text-black"
            }`}>
              {project.status}
            </span>
            {project.featured && (
              <span className="px-3 py-1 border-[2px] border-black bg-black text-[#FFE600] font-bold text-xs uppercase">
                FEATURED
              </span>
            )}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-black uppercase mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {project.title}
          </h1>
          <p className="font-mono text-gray-700 text-sm leading-relaxed mb-6">{project.description}</p>

          <div className="flex flex-wrap gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                data-testid="link-github"
                className="flex items-center gap-2 border-[3px] border-black px-5 py-3 font-bold uppercase text-sm bg-black text-white hover:bg-[#FFE600] hover:text-black transition-colors"
              >
                <Github size={14} />
                GITHUB
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                data-testid="link-live"
                className="flex items-center gap-2 border-[3px] border-black px-5 py-3 font-bold uppercase text-sm bg-[#FFE600] text-black hover:bg-black hover:text-white transition-colors"
              >
                <ExternalLink size={14} />
                LIVE DEMO
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {project.long_description && (
              <div className="border-[3px] border-black bg-white p-6">
                <h2 className="text-2xl font-bold uppercase mb-4 border-b-[3px] border-black pb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>OVERVIEW</h2>
                <p className="font-mono text-sm text-gray-700 leading-relaxed whitespace-pre-line">{project.long_description}</p>
              </div>
            )}
            {project.problem && (
              <div className="border-[3px] border-black bg-white p-6">
                <h2 className="text-2xl font-bold uppercase mb-4 border-b-[3px] border-black pb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>THE PROBLEM</h2>
                <p className="font-mono text-sm text-gray-700 leading-relaxed">{project.problem}</p>
              </div>
            )}
            {project.solution && (
              <div className="border-[3px] border-black bg-[#FFE600] p-6">
                <h2 className="text-2xl font-bold uppercase mb-4 border-b-[3px] border-black pb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>THE SOLUTION</h2>
                <p className="font-mono text-sm text-black/80 leading-relaxed">{project.solution}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {project.github_url && <RepoInfoBox githubUrl={project.github_url} />}

            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="border-[3px] border-black bg-black p-6">
                <h3 className="text-xl font-bold text-white uppercase mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>TECH STACK</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((t) => (
                    <span key={t} className="border-2 border-[#FFE600] text-[#FFE600] px-2 py-1 text-xs font-mono uppercase">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="border-[3px] border-black bg-[#F5F0E8] p-6">
              <h3 className="text-xl font-bold uppercase mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>ADDED</h3>
              <p className="font-mono text-sm text-gray-600">
                {new Date(project.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
              </p>
            </div>
          </div>
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-6 border-[3px] border-black bg-white p-6">
            <h2 className="text-2xl font-bold uppercase mb-6 border-b-[3px] border-black pb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>GALLERY</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.gallery.map((img, i) => (
                <div key={i} className="border-[3px] border-black overflow-hidden">
                  <img src={img} alt={`Gallery ${i + 1}`} className="w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="bg-black border-t-[3px] border-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-gray-500 font-mono text-xs">© 2025 OUTLAWZ LABS™</span>
        </div>
      </footer>
    </div>
  );
}
