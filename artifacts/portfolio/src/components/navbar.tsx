import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/github", label: "GITHUB" },
  { href: "/experience", label: "EXPERIENCE" },
  { href: "/contact", label: "CONTACT" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black border-b-[3px] border-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="font-display text-3xl md:text-4xl text-white tracking-wide hover:text-[#FFE600] transition-colors"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          OUTLAWZ LABS™
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-1 items-center">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors border-2 ${
                location === l.href
                  ? "bg-[#FFE600] text-black border-[#FFE600]"
                  : "text-white border-transparent hover:border-white hover:text-[#FFE600]"
              }`}
              data-testid={`nav-${l.label.toLowerCase()}`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="ml-4 px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 border-2 border-gray-700 hover:border-gray-400 hover:text-gray-300 transition-colors"
          >
            ADMIN
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white border-2 border-white p-2"
          onClick={() => setOpen(!open)}
          data-testid="button-mobile-menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t-[3px] border-white bg-black">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-6 py-4 font-bold uppercase text-lg border-b-2 border-gray-800 transition-colors ${
                location === l.href
                  ? "bg-[#FFE600] text-black"
                  : "text-white hover:text-[#FFE600]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
