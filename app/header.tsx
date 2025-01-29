"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed w-full bg-background/80 backdrop-blur-sm border-b border-black/[.08] dark:border-white/[.08] px-4 py-3 flex justify-between items-center">
      <Link
        href="/"
        className="text-lg font-medium hover:opacity-70 transition-opacity"
      >
        connerjevning.com
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-8">
        <a href="/about" className="hover:opacity-70 transition-opacity">
          about
        </a>
        <a href="/experience" className="hover:opacity-70 transition-opacity">
          experience
        </a>
        <a href="/projects" className="hover:opacity-70 transition-opacity">
          projects
        </a>
        <a href="/connect" className="hover:opacity-70 transition-opacity">
          connect
        </a>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button
          className="p-2 hover:bg-black/[.05] dark:hover:bg-white/[.06] rounded transition-colors"
          onClick={() => {
            const nav = document.querySelector(".mobile-nav");
            nav?.classList.toggle("hidden");
          }}
          aria-label="Toggle navigation menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <nav className="mobile-nav hidden absolute top-full left-0 right-0 bg-background/80 backdrop-blur-sm border-b border-black/[.08] dark:border-white/[.08] p-4 flex flex-col gap-4">
          <a href="/about" className="hover:opacity-70 transition-opacity">
            about
          </a>
          <a href="/experience" className="hover:opacity-70 transition-opacity">
            experience
          </a>
          <a href="/projects" className="hover:opacity-70 transition-opacity">
            projects
          </a>
          <a href="/connect" className="hover:opacity-70 transition-opacity">
            connect
          </a>
        </nav>
      </div>
    </header>
  );
}
