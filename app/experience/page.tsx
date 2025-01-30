"use client";
import { useEffect, useState } from "react";
import experience from "./data";

export default function Experience() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  // Set initial selected job from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    setSelectedJob(hash || experience[0].company.toLowerCase());
  }, []);

  // Update selected job when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setSelectedJob(hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="container p-4 rounded-lg border-2 border-purple-500">
      {/* Navigation links */}
      <nav className="mb-4 flex flex-wrap gap-1.5">
        {experience.map((job) => (
          <a
            key={job.company.toLowerCase()}
            href={`#${job.company.toLowerCase()}`}
            className={`px-3 py-1.5 border transition-colors duration-150 font-pixel text-sm ${
              selectedJob === job.company.toLowerCase()
                ? "border-yellow-400 bg-yellow-400 text-black"
                : "border-purple-400 text-purple-400 hover:border-yellow-400 hover:text-yellow-400"
            }`}
          >
            {`${job.company} '${job.end.slice(-2)}`}
          </a>
        ))}
      </nav>

      {/* Only show selected experience section */}
      <main className="space-y-4">
        {experience.map((job) => (
          <section
            key={job.company.toLowerCase()}
            id={job.company.toLowerCase()}
            className={`scroll-mt-4 p-4 border border-cyan-500 rounded transition-opacity duration-200 ${
              selectedJob === job.company.toLowerCase()
                ? "block opacity-100"
                : "hidden opacity-0"
            }`}
            aria-hidden={selectedJob !== job.company.toLowerCase()}
          >
            <h2 className="text-xl font-pixel text-cyan-400 mb-1">
              {job.title}
            </h2>
            <h3 className="text-lg mb-1">
              <a
                href={job.website}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                {job.company}
              </a>
            </h3>
            <p className="text-gray-400 text-sm mb-3">
              {job.start} - {job.end}
            </p>
            <div>
              <h4 className="font-pixel text-yellow-400 mb-2">Stack:</h4>
              <ul className="flex flex-wrap-reverse justify-between gap-2">
                {job.stack.map((tech) => (
                  <li
                    key={tech}
                    className="bg-purple-900 px-2 py-1 text-sm rounded-sm border basis-[45%] border-purple-400 text-purple-100"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
