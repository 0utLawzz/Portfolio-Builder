import { Link } from "wouter";
import { useEffect } from "react";
import Navbar from "@/components/navbar";
import Terminal from "@/components/terminal";
import ProjectCard from "@/components/project-card";
import { useGetFeaturedProjects } from "@workspace/api-client-react";

const services = [
  { title: "AI Agents", desc: "Autonomous systems that reason, decide, and act on your behalf." },
  { title: "Workflow Automation", desc: "End-to-end automation pipelines that eliminate manual processes." },
  { title: "OCR Systems", desc: "Document parsing and extraction pipelines for any document type." },
  { title: "Internal Business Software", desc: "Custom dashboards and tools built for your specific operations." },
  { title: "SaaS Platforms", desc: "Full-stack software products from architecture to deployment." },
  { title: "Custom Integrations", desc: "Connecting your tools, APIs, and data sources into unified systems." },
];

const stats = [
  { value: "8+", label: "YEARS EXPERIENCE" },
  { value: "50+", label: "PROJECTS BUILT" },
  { value: "∞", label: "HOURS AUTOMATED" },
  { value: "10+", label: "TECH STACKS" },
];

const buildSteps = [
  { n: "01", title: "DISCOVERY", desc: "Understand the problem, map processes, identify automation opportunities." },
  { n: "02", title: "ARCHITECTURE", desc: "Design the system blueprint — data flow, integrations, tech decisions." },
  { n: "03", title: "PROTOTYPE", desc: "Build a working proof of concept to validate the approach." },
  { n: "04", title: "AUTOMATION", desc: "Implement the full automation with error handling and edge cases." },
  { n: "05", title: "DEPLOYMENT", desc: "Ship to production with monitoring, logging, and failsafes." },
  { n: "06", title: "OPTIMIZATION", desc: "Measure performance, remove bottlenecks, scale what works." },
];

export default function Home() {
  useEffect(() => {
    document.title = "OUTLAWZ LABS™ | AI Automation Specialist";
  }, []);

  const { data: featured, isLoading } = useGetFeaturedProjects();

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]" style={{ fontFamily: "'Space Mono', monospace" }}>
      <Navbar />

      {/* HERO */}
      <section className="min-h-[90vh] flex flex-col justify-center items-center text-center px-6 py-20 border-b-[3px] border-black relative overflow-hidden bg-black">
        <div className="absolute top-12 left-6 md:left-16 border-2 border-[#FFE600] text-[#FFE600] px-3 py-1 font-bold text-xs uppercase rotate-[-6deg] shadow-[4px_4px_0_#FFE600]">AUTOMATION</div>
        <div className="absolute top-32 right-6 md:right-20 border-2 border-[#FFE600] text-[#FFE600] px-3 py-1 font-bold text-xs uppercase rotate-[4deg] shadow-[4px_4px_0_#FFE600]">AI SYSTEMS</div>
        <div className="absolute bottom-28 left-1/3 border-2 border-[#FFE600] text-[#FFE600] px-3 py-1 font-bold text-xs uppercase rotate-[-2deg] shadow-[4px_4px_0_#FFE600] hidden md:block">SAAS BUILDER</div>

        <div className="max-w-5xl">
          <h1
            className="text-[5rem] md:text-[10rem] leading-none text-white mb-2 tracking-wide"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            OUTLAWZ LABS™
          </h1>
          <div className="inline-block border-[3px] border-[#FFE600] bg-black px-6 py-2 mb-8 shadow-[6px_6px_0_#FFE600]">
            <span className="text-[#FFE600] font-bold text-xl md:text-3xl uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              AI AUTOMATION SPECIALIST
            </span>
          </div>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 font-mono leading-relaxed">
            I Build Automation Systems, AI Workflows &amp; SaaS Products That Eliminate Repetitive Work.
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-12 font-mono">
            From OCR pipelines and document processing to business software, AI agents, and workflow automation — I design systems that save time and scale operations.
          </p>

          <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
            <Link
              href="/projects"
              data-testid="button-view-projects"
              className="bg-[#FFE600] text-black border-[3px] border-white px-8 py-4 text-lg font-bold uppercase tracking-wider shadow-[6px_6px_0_#fff] hover:shadow-[2px_2px_0_#fff] hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              VIEW PROJECTS
            </Link>
            <Link
              href="/contact"
              data-testid="button-contact-hero"
              className="bg-transparent text-white border-[3px] border-white px-8 py-4 text-lg font-bold uppercase tracking-wider shadow-[6px_6px_0_#FFE600] hover:shadow-[2px_2px_0_#FFE600] hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              CONTACT
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b-[3px] border-black bg-[#F5F0E8]">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`p-8 text-center border-r-[3px] border-black last:border-r-0 ${i >= 2 ? "border-t-[3px] md:border-t-0" : ""}`}
            >
              <div className="text-5xl md:text-6xl font-bold text-black mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {s.value}
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT I BUILD */}
      <section className="py-20 px-6 border-b-[3px] border-black bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-5xl md:text-7xl font-bold text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              WHAT I BUILD
            </h2>
            <div className="w-24 h-[3px] bg-[#FFE600] mt-3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="border-[3px] border-white bg-black p-6 shadow-[6px_6px_0_#FFE600] hover:shadow-[8px_8px_0_#FFE600] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <div className="w-2 h-2 bg-[#FFE600] mb-4" />
                <h3 className="text-2xl font-bold text-white uppercase mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {s.title}
                </h3>
                <p className="text-sm text-gray-400 font-mono leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="py-20 px-6 border-b-[3px] border-black bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-5xl md:text-7xl font-bold text-black uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                FEATURED PROJECTS
              </h2>
              <div className="w-24 h-[3px] bg-[#FFE600] mt-3" />
            </div>
            <Link
              href="/projects"
              className="hidden md:block border-[3px] border-black px-6 py-3 font-bold uppercase text-sm shadow-[4px_4px_0_#0A0A0A] hover:shadow-[2px_2px_0_#0A0A0A] hover:translate-x-0.5 hover:translate-y-0.5 transition-all bg-[#FFE600] text-black"
            >
              ALL PROJECTS
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-[3px] border-black h-80 bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : featured && featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div className="border-[3px] border-black p-12 text-center bg-white">
              <p className="font-mono text-gray-500 uppercase tracking-wider">No featured projects yet</p>
            </div>
          )}

          <div className="mt-8 md:hidden">
            <Link
              href="/projects"
              className="block border-[3px] border-black px-6 py-3 font-bold uppercase text-sm shadow-[4px_4px_0_#0A0A0A] bg-[#FFE600] text-black text-center"
            >
              ALL PROJECTS
            </Link>
          </div>
        </div>
      </section>

      {/* BUILD PROCESS */}
      <section className="py-20 px-6 border-b-[3px] border-black bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-5xl md:text-7xl font-bold text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              BUILD PROCESS
            </h2>
            <div className="w-24 h-[3px] bg-[#FFE600] mt-3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {buildSteps.map((step, idx) => (
              <div
                key={step.n}
                className={`border-[3px] border-white p-6 ${idx % 3 !== 2 ? "border-r-0" : ""} ${idx >= 3 ? "border-t-0" : ""}`}
              >
                <div className="text-[#FFE600] text-4xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {step.n}
                </div>
                <h3 className="text-xl font-bold text-white uppercase mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {step.title}
                </h3>
                <p className="text-xs text-gray-400 font-mono leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TERMINAL */}
      <section className="py-20 px-6 border-b-[3px] border-black bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-black uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              SYSTEMS LIVE
            </h2>
          </div>
          <Terminal />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#FFE600] border-b-[3px] border-black text-center">
        <h2 className="text-5xl md:text-8xl font-bold text-black uppercase mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          LET'S BUILD SOMETHING
        </h2>
        <p className="text-lg font-mono text-black/70 mb-10 max-w-xl mx-auto">
          Have a process to automate? A system to build? Let's talk.
        </p>
        <Link
          href="/contact"
          data-testid="button-cta-contact"
          className="inline-block bg-black text-white border-[3px] border-black px-10 py-5 text-xl font-bold uppercase tracking-wider shadow-[6px_6px_0_#0A0A0A] hover:shadow-[2px_2px_0_#0A0A0A] hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          CONTACT ME
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t-[3px] border-white py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-white font-bold text-xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            OUTLAWZ LABS™
          </span>
          <span className="text-gray-500 font-mono text-xs">
            © 2025 Muhammad Nadeem. Built with precision.
          </span>
          <div className="flex gap-4 text-xs font-mono">
            <a href="https://github.com/0utLawzz" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white border border-gray-700 px-3 py-1 hover:border-white transition-colors uppercase">
              GITHUB
            </a>
            <a href="mailto:net2outlawzz@gmail.com" className="text-gray-400 hover:text-white border border-gray-700 px-3 py-1 hover:border-white transition-colors uppercase">
              EMAIL
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
