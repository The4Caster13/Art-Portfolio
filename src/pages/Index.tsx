import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Philosophy from "@/components/Philosophy";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import LeafScroll from "@/components/LeafScroll";
import garden from "../Assets/smiskis/Garden_nc.jpg";
import sign from "../Assets/night/sign.jpg";
import bridge from "../Assets/nature/bridge.jpg";

import RevolvingGallery, { type GalleryPhoto } from "@/components/ui/gallery.tsx";

const Index = () => {
  useEffect(() => {
    document.title = "Architecture Portfolio";
  }, []);

  const highlightPhotos: GalleryPhoto[] = [
    {
      src: garden,
      alt: "Garden",
      label: "Sour Patch Collection",
      caption: "The comfort of nature",
    },
    {
      src: sign,
      alt: "Sign",
      label: "Night-Time Collection",
      caption: "Photos are a thousand words",
    },
    {
      src: bridge,
      alt: "Bridge",
      label: "Nature Collection",
      caption: "The winding path",
    },
  ];
  return (
    <>
      <ScrollReveal />
      <LeafScroll />
      <Navbar />
      <Hero />
      <section className="bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <RevolvingGallery photos={highlightPhotos} intervalMs={3200} />
        </div>
      </section>
      <Projects />
      <About />
      <Philosophy />
      <Contact />
      <Footer />
    </>
  );
};

export default Index;
