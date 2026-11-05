import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Construction from "./construction";
import { projectsData } from "@/data/projects";
import type { MediaItem, Project } from "@/types/project";
import STLViewer from "@/components/STLViewer";
import ResearchDetail from "@/components/ResearchDetail";
import CodeDetail from "@/components/CodeDetail";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const projectIndex = Number(id);
  const project: Project | undefined = projectsData[projectIndex];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) navigate("/");
    setCurrentImageIndex(0);
  }, [project, navigate]);

  if (!project) return null;

  //construction page popup (if there is nothing there)
  if (project.construction) {
    return <Construction project={project} />;
  }

  // research reports get their own layout (summary + pdf download)
  if (project.research) {
    return <ResearchDetail title={project.title} year={project.year} research={project.research} />;
  }

  // github case studies get their own layout too
  if (project.code) {
    return <CodeDetail title={project.title} year={project.year} code={project.code} />;
  }

  const media: MediaItem[] =
    project.images && project.images.length > 0
      ? project.images
      : [{ url: project.image, type: "image" }];

  const currentMedia = media[currentImageIndex];

  const goNext = () =>
    setCurrentImageIndex((i) => (i + 1) % media.length);

  const goPrev = () =>
    setCurrentImageIndex((i) => (i - 1 + media.length) % media.length);

  const stages = project.progressionStages ?? [];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container px-6 md:px-12 py-24">
          {/* back button */}
          <button
            onClick={() => navigate("/")}
            className="text-charcoal mb-6 hover:text-forest-green"
          >
            ← Back to projects
          </button>

          <div
            ref={imageRef}
            className="relative w-full overflow-hidden rounded-xl shadow-lg bg-white group mb-12"
          >
            {currentMedia.type === "video" && (
              <video
                src={currentMedia.url}
                controls
                autoPlay
                loop
                muted
                className="w-full object-contain"
              />
            )}

            {currentMedia.type === "image" && (
              <img
                src={currentMedia.url}
                className="w-full object-contain"
              />
            )}

            {currentMedia.type === "model" && (
              <STLViewer url={currentMedia.url} />
            )}

            {/* arrow buttons */}
            {media.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 p-3 rounded-full hover:bg-white"
                >
                  ❮
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 p-3 rounded-full hover:bg-white"
                >
                  ❯
                </button>
              </>
            )}
          </div>

          {/* progress text */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-forest-green mb-6">
              Design Progression
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stages.map((stage, idx) => (
                <button
                  key={stage.stage}
                  onClick={() =>
                    setSelectedStage(
                      selectedStage === idx ? null : idx
                    )
                  }
                  className={`bg-white rounded-xl shadow hover:shadow-lg transition ${
                    selectedStage === idx &&
                    "ring-2 ring-forest-green scale-[1.02]"
                  }`}
                >
                  <img
                    src={stage.image}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="p-4">
                    <p className="text-xs uppercase text-forest-green">
                      {stage.stage}
                    </p>
                    <h4 className="font-bold">{stage.title}</h4>
                  </div>
                </button>
              ))}
            </div>

            {selectedStage !== null && (
              <div className="bg-white rounded-xl shadow p-6 mt-6">
                <h3 className="text-xl font-bold text-forest-green">
                  {stages[selectedStage].title}
                </h3>
                <p className="text-charcoal mt-2">
                  {stages[selectedStage].details.process}
                </p>
              </div>
            )}
          </div>

          {/* text */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl shadow p-8">
              <span className="text-charcoal/60 text-sm">
                {project.year} • {project.location}
              </span>
              <h1 className="text-3xl font-bold mt-4 text-forest-green">
                {project.title}
              </h1>
              <p className="mt-4 text-charcoal/80">
                {project.description}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-8">
              <h3 className="text-xl font-semibold text-forest-green mb-4">
                Project Details
              </h3>
              <p className="text-charcoal/70">
              {project.details}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProjectDetail;
