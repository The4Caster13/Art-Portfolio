export interface MediaItem {
  url: string;
  type: "image" | "video" |"model";
}
//fixes the unorganized string problem
export interface ProgressionStage {
  stage: string;
  title: string;
  description: string;
  image: string;
  icon?: string;
  details: {
    process: string;
    tools: string[];
    timeline: string;
    deliverables: string[];
  };
}

// research reports (IAs + labs): a chart of the real data on the project page
export interface ResearchPoint {
  x: number;
  y: number;
  err?: number;
}

export interface ResearchChart {
  title: string;
  caption: string;
  xLabel: string;
  yLabel: string;
  xDomain: [number, number];
  yDomain: [number, number];
  xTicks: number[];
  yTicks: number[];
  points: ResearchPoint[];
  connect: boolean;
  fit?: { slope: number; intercept: number; label: string };
}

export interface ResearchStat {
  label: string;
  value: string;
}

export interface ResearchInfo {
  subject: string;
  researchQuestion: string;
  hypothesis?: string;
  variables?: {
    independent: string;
    dependent: string;
    controlled: string[];
  };
  method: string[];
  stats: ResearchStat[];
  chart: ResearchChart;
  findings: string[];
  limitations: string[];
  pdf: string;
  pdfName: string;
  pages: number;
  wordCount?: number;
}

// github case studies: live repo stats come from src/lib/github.ts
export interface CodeInfo {
  repo: string;
  tagline: string;
  problem: string;
  howItWorks: string[];
  features: string[];
  stack: string[];
  liveUrl?: string;
  fallbackLanguages: Record<string, number>; // snapshot of /languages for when the api is unavailable
}

export interface Project {
  title: string;
  image: string;
  description: string;
  year: string;
  location: string;
  featured: boolean;
  construction?: boolean;
  details?: string;
  images?: MediaItem[];
  progressionStages?: ProgressionStage[];
  research?: ResearchInfo; // gives the project the research layout
  code?: CodeInfo; // gives the project the github case-study layout
}
