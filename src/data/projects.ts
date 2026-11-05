// ALL PROJECTS, in one place.
//
// - Order here = order on the All Projects page, and the /project/N links (N = position, starting at 0).
// - featured: true also puts a project in "Featured Projects" on the home page.
// - image is the card thumbnail. Thumbnails for the research and code projects live in
//   src/Assets/thumbnails/: drop your own .jpg over the placeholder with the same name.
// - A project with a `research` block gets the research layout (chart + PDF download);
//   one with a `code` block gets the GitHub case-study layout. Everything else uses the gallery layout.
import type { MediaItem, Project, ResearchChart } from "@/types/project";

// ---------- design assets ----------
// snowboard
import initial from "../Assets/snowboard/initialplans.jpg";
import video from "../Assets/snowboard/creativetimelapse.mp4";
import prop from "../Assets/snowboard/ProperDrawing.jpg";
import deed from "../Assets/snowboard/3d.stl";
// cpt (bayside mansion)
import ai from "../Assets/cpt/aiart.jpg";
import concept from "../Assets/cpt/concept.jpg";
import drawing from "../Assets/cpt/drawing.jpg";
import plan1 from "../Assets/cpt/floorplan1.jpg";
import plan2 from "../Assets/cpt/floorplan2.jpg";
import plan3 from "../Assets/cpt/floorplan3.jpg";
import plan4 from "../Assets/cpt/floorplan4.jpg";
import line from "../Assets/cpt/line.jpg";
import sketch from "../Assets/cpt/sketch.jpg";
import vid from "../Assets/cpt/timelapsec.mp4";
// road
import original from "../Assets/road/original.jpg";
import change from "../Assets/road/changes.jpg";
import vid2 from "../Assets/road/changes.mp4";
import vid3 from "../Assets/road/original.mp4";
// sketchup (tiny house)
import first from "../Assets/sketchup/house.stl";
import hero from "../Assets/sketchup/house.png";

// ---------- research assets ----------
import physicsPdf from "../Assets/research/paper-airplane-physics-ia.pdf";
import chemistryPdf from "../Assets/research/spinach-vitamin-c-chemistry-ia.pdf";
import momentumPdf from "../Assets/research/momentum-lab-report.pdf";
import physicsThumb from "../Assets/thumbnails/paper-airplane.jpg";
import chemistryThumb from "../Assets/thumbnails/vitamin-c-spinach.jpg";
import momentumThumb from "../Assets/thumbnails/momentum-lab.jpg";

// ---------- code assets ----------
import morraThumb from "../Assets/thumbnails/morraai.jpg";
import dashboardThumb from "../Assets/thumbnails/financial-dashboard.jpg";
import agentsThumb from "../Assets/thumbnails/multi-agent-equity-research.jpg";

const normalizeImages = (arr: (string | MediaItem)[]): MediaItem[] => {
  return arr.map((item) => {
    if (typeof item === "string") {
      const isVideo = item.toLowerCase().endsWith(".mp4");
      return { url: item, type: isVideo ? "video" : "image" };
    }
    return { url: item.url, type: item.type };
  });
};

// ---------- research chart data (from the reports) ----------
// physics ia: paper airplane wing area
const physicsChart: ResearchChart = {
  title: "Mean horizontal displacement vs. wing surface area",
  caption:
    "Each point is the mean of 8 launches; error bars are the uncertainty of the mean (σ/√n). Dashed line is the linear regression.",
  xLabel: "Wing surface area (cm²)",
  yLabel: "Displacement (m)",
  xDomain: [120, 185],
  yDomain: [2.8, 4.2],
  xTicks: [120, 130, 140, 150, 160, 170, 180],
  yTicks: [2.8, 3.0, 3.2, 3.4, 3.6, 3.8, 4.0, 4.2],
  connect: false,
  points: [
    { x: 124, y: 3.04, err: 0.09 },
    { x: 138, y: 3.43, err: 0.06 },
    { x: 153, y: 3.57, err: 0.07 },
    { x: 167, y: 3.58, err: 0.08 },
    { x: 181, y: 4.02, err: 0.09 },
  ],
  // regression from the report: 147.3 m/m² = 0.01473 m/cm², b = 1.280 m
  fit: { slope: 0.01473, intercept: 1.28, label: "y = 147.3x + 1.280 (r = 0.948)" },
};

// chemistry ia: vitamin c in boiled spinach
const chemistryChart: ResearchChart = {
  title: "Ascorbic acid concentration vs. boiling time",
  caption:
    "Each point is the mean of 5 iodine titrations; error bars are the propagated absolute uncertainty.",
  xLabel: "Boiling time (min)",
  yLabel: "Concentration (×10⁻⁴ M)",
  xDomain: [0, 8],
  yDomain: [0, 5.5],
  xTicks: [0, 2, 4, 6, 8],
  yTicks: [0, 1, 2, 3, 4, 5],
  connect: true,
  points: [
    { x: 0, y: 4.6, err: 0.4 },
    { x: 2, y: 2.9, err: 0.2 },
    { x: 4, y: 1.9, err: 0.2 },
    { x: 6, y: 1.8, err: 0.2 },
    { x: 8, y: 1.5, err: 0.2 },
  ],
};

// momentum lab: total system momentum around the collision
const momentumChart: ResearchChart = {
  title: "Total system momentum through the collision",
  caption:
    "p = 0.5447·v₁ + 0.5342·v₂ from Logger Pro. The sign flips because the carts reverse direction; the magnitude drops from 0.199 to 0.184 kg·m/s.",
  xLabel: "Time (s)",
  yLabel: "Momentum (kg·m/s)",
  xDomain: [4.3, 5.0],
  yDomain: [-0.22, 0.22],
  xTicks: [4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0],
  yTicks: [-0.2, -0.1, 0, 0.1, 0.2],
  connect: true,
  points: [
    { x: 4.3, y: 0.199 },
    { x: 4.35, y: 0.19 },
    { x: 4.4, y: 0.17 },
    { x: 4.45, y: 0.126 },
    { x: 4.5, y: 0.048 },
    { x: 4.55, y: -0.045 },
    { x: 4.6, y: -0.12 },
    { x: 4.65, y: -0.161 },
    { x: 4.7, y: -0.178 },
    { x: 4.75, y: -0.184 },
    { x: 4.8, y: -0.185 },
    { x: 4.85, y: -0.184 },
    { x: 4.9, y: -0.184 },
    { x: 4.95, y: -0.185 },
    { x: 5.0, y: -0.184 },
  ],
};

export const projectsData: Project[] = [
  // =====================================================================
  // DESIGN & ARCHITECTURE
  // =====================================================================

  // grade 10 cpt
  {
    image: drawing,
    title: "Bayside Mansion",
    description:
      "Harmonizing with the surrounding landscape, this retreat employs sustainable materials...",
    year: "2024-2025",
    location: "San Jose, CA",
    featured: true,
    details:
      "The Bayside Mansion was a project that began in 10th grade during Art Class when we were told to create a meaningful art project. My passion for architecture, as well as my ",
    images: normalizeImages([
      drawing,
      line,
      { url: vid, type: "video" },
      sketch,
      plan1,
      plan2,
      plan3,
      plan4,
      concept,
      ai,
    ]),
    progressionStages: [],
  },

  // road
  {
    image: change,
    title: "Road Reconstruction",
    description:
      "Renovation project that transformed a traditional suburban house into a contemporary living space...",
    year: "2025",
    location: "Toronto, ON",
    featured: true,
    details: "",
    images: normalizeImages([
      { url: change, type: "image" },
      { url: original, type: "image" },
      { url: vid2, type: "video" },
      { url: vid3, type: "video" },
    ]),
    progressionStages: [],
  },

  // sketchup
  {
    image: hero,
    title: "Tiny House",
    description:
      "While drawings and sketches are great for brainstorming and idea generation, ultimately bringing your ideas into 3D helps to visualize the real end-product. My goal was to learn SketchUp and become proficient in using 3D modelling softwares to improve my technical skills and help bring my ideas to life.",
    year: "2025",
    location: "Thornhill, ON",
    featured: false,
    details:
      "While drawings and sketches are great for brainstorming and idea generation, ultimately bringing your ideas into 3D helps to visualize the real end-product. My goal was to learn SketchUp and become proficient in using 3D modelling softwares to improve my technical skills and help bring my ideas to life.",
    images: normalizeImages([
      { url: hero, type: "image" },
      { url: first, type: "model" },
    ]),
    progressionStages: [],
  },

  // cas project
  {
    image: prop,
    title: "Snowboard Launcher",
    description:
      "What began as a simple desire to practice snowboard tricks at home evolved into a full architectural exploration...",
    year: "2024",
    location: "North York, ON",
    featured: true,
    images: [
      { url: prop, type: "image" },
      { url: initial, type: "image" },
      { url: deed, type: "model" },
      { url: video, type: "video" },
    ],
    progressionStages: [],
  },

  // =====================================================================
  // RESEARCH (IAs + lab reports)
  // =====================================================================

  // physics ia
  {
    image: physicsThumb,
    title: "Paper Airplane Wing Area",
    description:
      "A physics investigation into how wing surface area changes how far a slingshot-launched paper airplane flies, linking lift and drag to measured range.",
    year: "2026",
    location: "Thornhill, ON",
    featured: false,
    research: {
      subject: "Physics · Internal Assessment",
      researchQuestion:
        "How does the horizontal displacement (in m) of a paper airplane depend on the surface area of its wings when it is launched from an inclined slingshot at a height of 1.016 ± 0.0005 m?",
      hypothesis:
        "Since lift is proportional to wing area (L = ½ρv²·Cₗ·A), reducing the wing area should reduce the horizontal displacement.",
      variables: {
        independent: "Wing surface area: 181, 167, 153, 138, 124 cm² (±3 cm²)",
        dependent: "Horizontal displacement of the plane (m)",
        controlled: [
          "Plane mass: 4.90 g ± 0.05 g",
          "Launch height: 1.016 m ± 0.0005 m",
          "Launch angle (checked with a protractor daily)",
          "Rubber band extension: 0.165 m",
          "Folding pattern and paper type",
          "Indoor room with doors and windows closed",
        ],
      },
      method: [
        "Folded a dart-style plane from letter paper and taped the tail so the slingshot wouldn't deform it, trimming the mass to 4.90 g.",
        "Launched each plane from a slingshot rail fixed at 1.016 m, pulling the band back 0.165 m every time.",
        "Measured the horizontal distance from the launch point's floor projection to the back of the plane with a tape measure.",
        "Reduced the wing area in ~14 cm² steps by folding the trailing edge along preset parallel lines, with 8 launches per area (40 total).",
      ],
      stats: [
        { label: "Wing areas tested", value: "5" },
        { label: "Total launches", value: "40" },
        { label: "Range", value: "3.04 → 4.02 m" },
        { label: "Gradient", value: "151 ± 26 m/m²" },
        { label: "Correlation", value: "r = 0.948" },
      ],
      chart: physicsChart,
      findings: [
        "Flight distance increased with wing area in a strong, near-linear trend: about 0.15 m of extra range for every 10 cm² of wing.",
        "More wing area means more lift, which reduces the net downward acceleration, keeps the plane in the air longer, and so carries it further (Δx = vₓt).",
        "Drag also changes with area, but induced and parasite drag move in opposite directions and partly cancel, so lift dominates over the tested range.",
        "An RMSE of 0.13 m (about 3–4%) shows the linear model is a good approximation within 124–181 cm², not a universal law.",
      ],
      limitations: [
        "Repeated launches slightly deformed the planes, shifting the centre of pressure relative to the centre of mass and adding torque.",
        "Small folding inconsistencies were hard to see until a plane veered off course.",
        "Simplifying lift to L = C·A assumes constant velocity, but drag slows the plane during flight.",
        "The separate effects of induced and parasite drag could not be measured.",
      ],
      pdf: physicsPdf,
      pdfName: "Paper_Airplane_Wing_Area_Physics_IA.pdf",
      pages: 16,
      wordCount: 2985,
    },
  },

  // chemistry ia
  {
    image: chemistryThumb,
    title: "Vitamin C in Boiled Spinach",
    description:
      "A chemistry investigation using iodine redox titration to measure how quickly boiling destroys the vitamin C in baby spinach.",
    year: "2026",
    location: "Thornhill, ON",
    featured: false,
    research: {
      subject: "Chemistry · Internal Assessment",
      researchQuestion:
        "How does boiling time (0–8 minutes) affect the concentration of ascorbic acid in spinach, as determined by iodine redox titration?",
      hypothesis:
        "Longer boiling will lower the ascorbic acid concentration, because vitamin C oxidizes and breaks down with heat, and leaches into the cooking water.",
      variables: {
        independent: "Boiling time: 0, 2, 4, 6, 8 min (raw, blanched, cooked, stewed, puréed)",
        dependent: "Ascorbic acid concentration (mol dm⁻³)",
        controlled: [
          "Spinach mass: 5.00 g ± 0.01 g",
          "Boiling water: 150 mL ± 2 mL distilled, at 100 °C",
          "Aliquot volume: 10.0 mL ± 0.1 mL",
          "Iodine solution: 0.00100 M ± 0.00001 M",
          "Blending time: 1 min; filtration: 30 min, same filter paper",
          "Spinach and water blended together so leached vitamin C is counted",
        ],
      },
      method: [
        "Boiled 5.00 g of baby spinach in 150 mL of distilled water at 100 °C for the set time, then let it cool for 10 minutes.",
        "Blended the spinach together with its cooking water for 1 minute and filtered it for 30 minutes.",
        "Titrated 10 mL of filtrate (with 20 mL of water, 5 mL of 0.5 M HCl and starch indicator) against 0.00100 M iodine until a blue-black colour held for 10–15 s.",
        "Ran 5 trials per boiling time (25 titrations) and found the concentration from the 1:1 reaction C₆H₈O₆ + I₂ → C₆H₆O₆ + 2H⁺ + 2I⁻.",
      ],
      stats: [
        { label: "Titrations", value: "25" },
        { label: "Raw spinach", value: "4.6 × 10⁻⁴ M" },
        { label: "After 8 min", value: "1.5 × 10⁻⁴ M" },
        { label: "Vitamin C lost", value: "≈ 67%" },
        { label: "Best-fit model", value: "1st order, R² ≈ 0.95" },
      ],
      chart: chemistryChart,
      findings: [
        "Ascorbic acid concentration fell from 4.6 to 1.5 × 10⁻⁴ M: about two-thirds of the vitamin C was gone after 8 minutes, and over a third after just 2 minutes of blanching.",
        "The loss slows down over time. Plotting ln[A] against time gave the best fit (R² ≈ 0.95, vs 0.91 for zero order and 0.92 for second order), which points to first-order kinetics.",
        "First-order behaviour means the rate of loss is proportional to how much vitamin C is left, which fits collision theory for the oxidation to dehydroascorbic acid.",
        "Practical takeaway: raw spinach keeps by far the most vitamin C, so even short cooking costs a lot of it.",
      ],
      limitations: [
        "Spinach kept oxidizing in storage, even refrigerated in a sealed container.",
        "The iodine solution slowly degraded despite being stored in the dark.",
        "Polyphenols and flavonoids also reduce iodine, so the titration measures more than vitamin C alone.",
        "Some vitamin C may have stayed in the filtered-out pulp, and the starch end point is a visual judgement.",
        "Improvement: HPLC would measure ascorbic acid on its own, without relying on a visual end point.",
      ],
      pdf: chemistryPdf,
      pdfName: "Vitamin_C_Spinach_Chemistry_IA.pdf",
      pages: 14,
      wordCount: 2870,
    },
  },

  // momentum lab
  {
    image: momentumThumb,
    title: "Momentum & Friction in Collisions",
    description:
      "A lab using motion detectors and magnetic carts to test whether momentum is conserved in a collision, and to measure friction from the momentum lost.",
    year: "2026",
    location: "Thornhill, ON",
    featured: false,
    research: {
      subject: "Physics · Lab Report (SPH4U)",
      researchQuestion:
        "Is momentum conserved when two magnetic carts collide on a track, and how large is the friction force acting on them?",
      method: [
        "Placed two carts with repelling magnets (544.7 g and 534.2 g) at opposite ends of an aluminium track and gently pushed them toward each other.",
        "Recorded position–time data for both carts with Vernier motion detectors, and let Logger Pro calculate their velocities.",
        "Calculated total momentum at every time step as p = 0.5447·v₁ + 0.5342·v₂.",
        "Fitted lines to the momentum–time graph before and after the collision and found friction from the slope, F = Δp/Δt.",
      ],
      stats: [
        { label: "Momentum before", value: "0.199 kg·m/s" },
        { label: "Momentum after", value: "0.184 kg·m/s" },
        { label: "Difference", value: "7.83%" },
        { label: "Friction force", value: "0.0392 ± 0.0013 N" },
        { label: "Total uncertainty", value: "3.35%" },
      ],
      chart: momentumChart,
      findings: [
        "Total momentum dropped from 0.199 to 0.184 kg·m/s across the collision (7.83%). That loss matches friction's impulse (J = Δp), so the collision itself effectively conserved momentum.",
        "The momentum–time slopes were −0.0364 N before the collision and +0.0420 N after, which average to a friction force of 0.0392 ± 0.0013 N.",
        "Nearly all of the uncertainty came from sensor noise: the scale contributed only 0.037% of the 3.35% total.",
        "Rigid plastic wheels on an aluminium rail keep rolling friction very low, and the rail stops the carts drifting sideways.",
      ],
      limitations: [
        "The detectors have a minimum range, so overlapping pulses created a false dip between 4.4 and 4.8 s. Only data from before and after the collision was used.",
        "The slopes before and after differed by about 0.0056 N, suggesting a slightly tilted track. That systematic error is about 4× the random uncertainty.",
        "Improvement: level the track precisely with a bubble or laser level.",
      ],
      pdf: momentumPdf,
      pdfName: "Momentum_Lab_Report.pdf",
      pages: 9,
    },
  },

  // =====================================================================
  // CODE (GitHub case studies)
  // =====================================================================

  // morraai
  {
    image: morraThumb,
    title: "MorraAI",
    description:
      "An AI practice examiner for the IB French B Individual Oral: it transcribes your presentation live, asks follow-up questions, and scores you against the IB criteria.",
    year: "2026",
    location: "Thornhill, ON",
    featured: false,
    code: {
      repo: "MorraAI",
      tagline: "An AI examiner for IB French oral practice",
      problem:
        "The IB French B Individual Oral is spontaneous: you present on an image tied to an IB theme, then answer unpredictable follow-up questions live. Practice options were talking to a wall, asking a classmate whose French is as shaky as yours, or paying a tutor a lot for 15 minutes. MorraAI gives students unlimited, low-stakes practice with an examiner that speaks excellent French and never gets tired.",
      howItWorks: [
        "The app gives a mock prompt from one of the five core IB themes (Identities, Sharing the Planet, and so on).",
        "You record a 10-minute presentation on the spot, and MorraAI transcribes it in real time.",
        "It analyzes your vocabulary and level, then asks follow-up questions pitched to you, the way a real examiner would.",
        "At the end you get a full performance breakdown, scored against the actual IB assessment criteria.",
      ],
      features: [
        "Live transcription streamed over WebSockets during the presentation",
        "Adaptive follow-up questions based on what you actually said",
        "Prompts covering all five IB themes",
        "Feedback scored against the official IB French B IO criteria",
        "Containerized with Docker",
      ],
      stack: ["TypeScript", "React", "Fastify", "WebSockets", "Gemini API", "Prisma", "Supabase", "Docker"],
      fallbackLanguages: { TypeScript: 407353, CSS: 2755, Dockerfile: 991, HTML: 295, JavaScript: 81 },
    },
  },

  // financial dashboard
  {
    image: dashboardThumb,
    title: "Financial Research Dashboard",
    description:
      "A Python/Dash terminal for equity analysis: live market overview, company financials, peer comps, a stock screener, commodities and news sentiment.",
    year: "2026",
    location: "Thornhill, ON",
    featured: false,
    code: {
      repo: "Financial-Dashboard",
      tagline: "A live equity research terminal in Python",
      problem:
        "Investment-banking-style research means jumping between quote screens, filings, comps spreadsheets and news sites. This dashboard puts those workflows in one terminal that runs out of the box on free, no-key data providers.",
      howItWorks: [
        "Market data is pulled through the OpenBB Platform, mostly from yfinance, with SEC data for ticker search.",
        "Each data call has its own cache lifetime, so fundamentals are cached for hours while prices stay fresh.",
        "The Overview, Company and Commodities pages auto-refresh every 30 seconds, with a 'Live · updated' indicator.",
        "Comps and the Screener are run on demand, because multiples and screens are deliberate analysis, not a live feed.",
      ],
      features: [
        "Overview: Fear & Greed Index, major indices, sector performance, top movers, commodities",
        "Company: profile, key stats, 12-month chart, analyst consensus, full financial statements",
        "Comps: auto-suggested peer group with P/E, EV/EBITDA, EV/Revenue, margins, growth and leverage",
        "Screener: filter by sector, market cap, price, beta and volume",
        "Commodities: gold, silver, oil, natural gas, copper, corn and wheat with price and volume charts",
        "News & Sentiment: Fear & Greed history plus ticker and market news",
      ],
      stack: ["Python", "Dash", "Plotly", "OpenBB", "yfinance"],
      fallbackLanguages: { Python: 67758, CSS: 5517 },
    },
  },

  // multi-agent equity research
  {
    image: agentsThumb,
    title: "Multi-Agent Equity Research",
    description:
      "A team of Gemini AI agents that reads filings and macro news, values a company several ways, and writes a full research report.",
    year: "2026",
    location: "Thornhill, ON",
    featured: false,
    code: {
      repo: "Multi-Agent-Equity-Research",
      tagline: "AI agents that write equity research reports",
      problem:
        "A real equity research team splits the work: someone tracks macro events, someone reads the filings, someone builds the valuation, and someone makes the call. This project rebuilds that structure with AI agents, so a full research report can be produced end to end.",
      howItWorks: [
        "The program pulls up-to-date financial documents and filings for a company.",
        "Gemini agents process them, each covering a part of the analysis, from macro events to company-specific developments.",
        "The agents value the company using several valuation techniques.",
        "Their work is combined into a closed-loop research report with a final decision, structured like a hedge fund's research team.",
      ],
      features: [
        "Multiple specialized Gemini agents working together",
        "Live financial documents and filings as input",
        "Several valuation methods combined into one view",
        "End-to-end report generation with a final recommendation",
        "Python agent service with a React Native (Expo) app front end",
      ],
      stack: ["Python", "Gemini API", "TypeScript", "React Native (Expo)", "Express", "NativeWind"],
      fallbackLanguages: { TypeScript: 82749, Python: 60390, HTML: 33849, CSS: 18967, JavaScript: 12600 },
    },
  },
];

// repos that already have a case study, so the live "More on GitHub" strip doesn't repeat them
export const caseStudyRepos = projectsData.flatMap((p) => (p.code ? [p.code.repo] : []));
