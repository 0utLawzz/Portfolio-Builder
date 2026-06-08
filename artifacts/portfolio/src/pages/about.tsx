import { useEffect } from "react";
import Navbar from "@/components/navbar";

const skills = [
  "Python", "Node.js", "TypeScript", "React", "Next.js", "Supabase",
  "PostgreSQL", "OpenAI", "Claude", "Gemini", "GitHub Actions", "Docker",
  "Automation", "OCR", "Web Scraping", "Workflow Design",
];

const story = [
  {
    period: "THE START",
    text: "Started as a developer in 2017, building web applications and learning the full stack. Realized early on that the real leverage wasn't in writing more code — it was in making systems work automatically.",
  },
  {
    period: "THE SHIFT",
    text: "Moved into automation in 2019. Built my first serious workflow automation for a logistics company, cutting hours of manual data entry to minutes. That was the moment everything changed.",
  },
  {
    period: "GOING DEEPER",
    text: "Expanded into OCR systems, internal dashboards, and process automation for businesses across multiple industries. Each project added tools to the arsenal and sharpened the systems thinking.",
  },
  {
    period: "AI ERA",
    text: "When AI became viable as an engineering primitive, not just a research topic, everything accelerated. Combined AI with automation to build agents, pipelines, and SaaS products that operate at a different level.",
  },
  {
    period: "NOW",
    text: "Focused on building serious automation infrastructure — AI workflows, OCR systems, business software, and SaaS platforms. Not a freelancer. A systems architect who builds things that actually run.",
  },
];

export default function About() {
  useEffect(() => {
    document.title = "About | OUTLAWZ LABS™";
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0E8]" style={{ fontFamily: "'Space Mono', monospace" }}>
      <Navbar />

      {/* Header */}
      <section className="bg-black border-b-[3px] border-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-9xl font-bold text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            ABOUT
          </h1>
          <div className="w-24 h-[3px] bg-[#FFE600] mt-4" />
          <p className="text-gray-400 font-mono text-sm mt-4 max-w-xl">
            AI Automation Specialist. Systems Architect. SaaS Builder. 8+ years of building things that work.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6 border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black uppercase mb-12" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            THE STORY
          </h2>
          <div className="space-y-0">
            {story.map((s, i) => (
              <div key={s.period} className={`flex flex-col md:flex-row border-[3px] border-black ${i > 0 ? "border-t-0" : ""}`}>
                <div className="md:w-48 bg-black text-[#FFE600] px-6 py-6 font-bold text-sm uppercase tracking-widest flex items-center border-b-[3px] md:border-b-0 md:border-r-[3px] border-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {s.period}
                </div>
                <div className="flex-1 p-6 bg-[#F5F0E8]">
                  <p className="font-mono text-sm leading-relaxed text-gray-700">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="py-20 px-6 border-b-[3px] border-black bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white uppercase mb-12" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            TECHNICAL STACK
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0">
            {skills.map((skill, i) => (
              <div
                key={skill}
                className={`border-[3px] border-white px-6 py-4 font-bold uppercase text-sm hover:bg-[#FFE600] hover:text-black hover:border-[#FFE600] transition-colors cursor-default text-white ${
                  i % 4 !== 3 ? "border-r-0" : ""
                } ${i >= 4 ? "border-t-0" : ""}`}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 px-6 bg-[#FFE600] border-b-[3px] border-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-black uppercase mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            THE PHILOSOPHY
          </h2>
          <blockquote className="border-l-[6px] border-black pl-8 text-left">
            <p className="text-xl md:text-2xl font-bold text-black leading-relaxed">
              "Every hour of manual work is a bug waiting to be fixed. I build the fix."
            </p>
            <footer className="mt-4 font-mono text-sm text-black/60">— Muhammad Nadeem</footer>
          </blockquote>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t-[3px] border-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-gray-500 font-mono text-xs">© 2025 OUTLAWZ LABS™ — Muhammad Nadeem</span>
        </div>
      </footer>
    </div>
  );
}
