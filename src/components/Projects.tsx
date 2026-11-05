import React, { useEffect, useRef } from "react";
import ProjectCard from "./ProjectCard";
// every project (design, research, code) lives in src/data/projects.ts
import { projectsData } from "@/data/projects";

const Projects = () => {
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) observer.observe(titleRef.current);

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
    };
  }, []);

  const featured = projectsData.filter((p) => p.featured);

  return (
    <section id="projects" className="relative py-24 md:py-32 overflow-hidden">
      {/* background pattern */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="rings"
              x="0"
              y="0"
              width="240"
              height="240"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="120"
                cy="120"
                r="40"
                fill="none"
                stroke="#1b1b1b"
                strokeWidth="0.5"
              />
              <circle
                cx="120"
                cy="120"
                r="80"
                fill="none"
                stroke="#1b1b1b"
                strokeWidth="0.5"
              />
              <circle
                cx="120"
                cy="120"
                r="120"
                fill="none"
                stroke="#1b1b1b"
                strokeWidth="0.5"
              />
            </pattern>

            <pattern
              id="waves"
              x="0"
              y="0"
              width="260"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 60 Q60 0 130 60 T260 60"
                fill="none"
                stroke="#1b1b1b"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#rings)" />
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>
      </div>

      {/* leaf decorations */}
      <div className="absolute top-14 left-10 opacity-10">
        <svg width="65" height="65" viewBox="0 0 60 60" fill="none">
          <path d="M30 5C35 15 45 25 30 55C15 25 25 15 30 5Z" fill="#1b1b1b" />
          <path d="M30 5V55" stroke="#1b1b1b" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="absolute bottom-20 right-10 opacity-10 rotate-45">
        <svg width="50" height="50" viewBox="0 0 60 60" fill="none">
          <path d="M30 5C35 15 45 25 30 55C15 25 25 15 30 5Z" fill="#1b1b1b" />
        </svg>
      </div>

      {/* content */}
      <div className="container px-6 md:px-12">
        <div ref={titleRef} className="reveal from-bottom mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-gray-900"></div>
        </div>

        <div className="space-y-12">
          {featured.map((project) => {
            const index = projectsData.findIndex((p) => p === project);
            return (
              <ProjectCard
                key={index}
                image={project.image}
                title={project.title}
                description={project.description}
                year={project.year}
                location={project.location}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
