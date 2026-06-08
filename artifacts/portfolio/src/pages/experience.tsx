import { useEffect } from "react";
import Navbar from "@/components/navbar";

const timeline = [
  {
    year: "2017",
    title: "STARTED DEVELOPMENT",
    desc: "Began as a full-stack web developer. Built web apps, learned the fundamentals of software engineering, and discovered a deep interest in systems thinking.",
    tags: ["Web Development", "Full Stack", "PHP", "JavaScript"],
  },
  {
    year: "2019",
    title: "AUTOMATION SYSTEMS",
    desc: "Transitioned to automation engineering. Built first enterprise workflow automation systems, cutting manual processing time by 80%+ for clients in logistics and finance.",
    tags: ["Python", "Process Automation", "Workflow Design", "APIs"],
  },
  {
    year: "2021",
    title: "SAAS PRODUCTS",
    desc: "Architected and shipped multiple SaaS platforms — from internal tooling to customer-facing products. Took full ownership of product: design, engineering, deployment.",
    tags: ["SaaS", "React", "Node.js", "PostgreSQL", "Supabase"],
  },
  {
    year: "2023",
    title: "AI WORKFLOWS",
    desc: "Integrated LLMs and AI primitives into production automation systems. Built AI agents, document intelligence pipelines, and AI-powered business automation at scale.",
    tags: ["OpenAI", "Claude", "Gemini", "AI Agents", "OCR", "LLM Pipelines"],
  },
  {
    year: "2025+",
    title: "ADVANCED AUTOMATION ARCHITECTURES",
    desc: "Designing next-generation automation architectures combining AI, OCR, real-time data pipelines, and autonomous agents — systems that genuinely eliminate repetitive work.",
    tags: ["AI Agents", "Multi-Model", "Enterprise Automation", "Systems Architecture"],
  },
];

export default function Experience() {
  useEffect(() => {
    document.title = "Experience | OUTLAWZ LABS™";
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0E8]" style={{ fontFamily: "'Space Mono', monospace" }}>
      <Navbar />

      {/* Header */}
      <section className="bg-black border-b-[3px] border-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-9xl font-bold text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            EXPERIENCE
          </h1>
          <div className="w-24 h-[3px] bg-[#FFE600] mt-4" />
          <p className="text-gray-400 font-mono text-sm mt-4">
            8+ years of building systems that actually work.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <div key={item.year} className={`flex border-[3px] border-black ${i > 0 ? "border-t-0" : ""} group`}>
                {/* Year column */}
                <div className="w-28 md:w-40 bg-black flex-shrink-0 flex flex-col justify-center items-center py-8 px-4 border-r-[3px] border-white group-hover:bg-[#FFE600] group-hover:border-[#FFE600] transition-colors">
                  <span
                    className="text-[#FFE600] text-3xl md:text-5xl font-bold group-hover:text-black transition-colors"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {item.year}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 md:p-8 bg-[#F5F0E8]">
                  <h3
                    className="text-2xl md:text-3xl font-bold text-black uppercase mb-3"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="font-mono text-sm text-gray-700 leading-relaxed mb-4">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="border-2 border-black px-2 py-0.5 text-xs font-mono uppercase bg-black text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Future indicator */}
          <div className="mt-6 border-[3px] border-dashed border-black p-8 text-center bg-[#FFE600]">
            <p className="font-display text-2xl font-bold text-black uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              THE NEXT CHAPTER IS BEING BUILT RIGHT NOW
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-black border-t-[3px] border-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-gray-500 font-mono text-xs">© 2025 OUTLAWZ LABS™</span>
        </div>
      </footer>
    </div>
  );
}
