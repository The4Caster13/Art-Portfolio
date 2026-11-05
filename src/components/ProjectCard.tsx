
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
  year: string;
  location: string;
  index: number;
}
  // each project's different specs
const ProjectCard: React.FC<ProjectCardProps> = ({ 
  image, 
  title, 
  description, 
  year, 
  location,
  index
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      }, 
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const animationClass = index % 2 === 0 ? 'from-left' : 'from-right';

  return (
    <div
      ref={cardRef}
      className={`reveal ${animationClass} flex flex-col md:flex-row mb-24 last:mb-0`}
    >
      {/* main project image (will def change this code) */}
      <div className={`w-full md:w-7/12 ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <img 
            src={image} 
            alt={title} 
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      {/* project info (i need to change the entire project part) */}
      <div className={`w-full md:w-5/12 ${index % 2 !== 0 ? 'md:order-1 md:pr-12' : 'md:pl-12'} flex flex-col justify-center mt-6 md:mt-0`}>
        <div className="border-b border-gray-300 pb-2 mb-4">
          <span className="text-sm text-gray-500">{year}{location && ` | ${location}`}</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold mb-4">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <Link to={`/project/${index}`} className="mt-6 text-sm font-medium uppercase tracking-wide flex items-center group">
          View Project
          <span className="ml-2 w-5 h-px bg-gray-900 transform transition-all group-hover:w-8"></span>
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
