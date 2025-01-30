"use client";
import { useEffect, useState } from "react";

export const experience = [
  {
    title: "Founding Engineer",
    company: "Continuum",
    website: "https://www.joincontinuum.com",
    start: "May 2021",
    end: "November 2024",
    stack: [
      "JavaScript",
      "React.js",
      "Node.js",
      "HTML",
      "styled-components",
      "REST",
      "Github Actions",
      "Python",
      "Docker",
    ],
  },
  {
    title: "Staff Software Engineer",
    company: "Chegg",
    website: "https://www.chegg.com",
    start: "October 2018",
    end: "April 2021",
    stack: [
      "JavaScript",
      "React.js",
      "Node.js",
      "HTML",
      "styled-components",
      "REST",
      "Gitlab",
      "PHP",
      "Docker",
    ],
  },
  {
    title: "Lead Software Developer, Web",
    company: "Firefly",
    website: "https://fireflyon.com",
    start: "March 2018",
    end: "July 2018",
    stack: [
      "JavaScript",
      "React.js",
      "Node.js",
      "HTML",
      "CSS-in-JS",
      "REST",
      "Python",
      "CircleCI",
    ],
  },
  {
    title: "CTO",
    company: "Synocate",
    website: "https://synocate.com",
    start: "September 2015",
    end: "February 2018",
    stack: [
      "JavaScript",
      "React.js",
      "Node.js",
      "HTML",
      "SCSS",
      "REST",
      "PostgreSQL",
      "CircleCI",
    ],
  },
  {
    title: "Software Developer, Website Builder Apps",
    company: "GoDaddy",
    website: "https://www.godaddy.com/websites/website-builder",
    start: "July 2014",
    end: "March 2016",
    stack: [
      "JavaScript",
      "React.js",
      "Node.js",
      "HTML",
      "CSS",
      "C#",
      ".NET",
      "SQL",
      "Ruby",
      "REST",
    ],
  },
];

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
    <div className="container  p-6 rounded-lg border-4 border-purple-500">
      {/* Navigation links */}
      <nav className="mb-6 flex flex-wrap gap-2">
        {experience.map((job) => (
          <a
            key={job.company.toLowerCase()}
            href={`#${job.company.toLowerCase()}`}
            className={`px-4 py-2 border-2 transition-all duration-200 ${
              selectedJob === job.company.toLowerCase()
                ? "border-yellow-400 bg-yellow-400 text-black font-pixel font-bold transform scale-105"
                : "border-purple-400 text-purple-400 hover:border-yellow-400 hover:text-yellow-400 hover:scale-105"
            }`}
          >
            {`${job.company} '${job.end.slice(-2)}`}
          </a>
        ))}
      </nav>

      {/* Only show selected experience section */}
      <main className="space-y-8">
        {experience.map((job) => (
          <section
            key={job.company.toLowerCase()}
            id={job.company.toLowerCase()}
            className={`scroll-mt-4 p-6 border-2 border-cyan-500 rounded-lg transform transition-all duration-300 ${
              selectedJob === job.company.toLowerCase()
                ? "block scale-100 opacity-100"
                : "hidden scale-95 opacity-0"
            }`}
            aria-hidden={selectedJob !== job.company.toLowerCase()}
          >
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">
              {job.title}
            </h2>
            <h3 className="text-xl mb-2">
              <a
                href={job.website}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                {job.company}
              </a>
            </h3>
            <p className="text-gray-400 mb-4">
              {job.start} - {job.end}
            </p>
            <div className="mt-4">
              <h4 className="font-medium text-yellow-400 mb-3">Tech Stack:</h4>
              <ul className="flex flex-wrap gap-3">
                {job.stack.map((tech) => (
                  <li
                    key={tech}
                    className="bg-purple-700 px-3 py-1.5 rounded border border-purple-400 text-purple-100 shadow-lg hover:transform hover:scale-105 transition-transform cursor-pointer"
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
