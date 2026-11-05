import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ErrorBar,
} from "recharts";
import { Download, ExternalLink, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ResearchInfo, ResearchChart } from "@/types/project";

interface ResearchDetailProps {
  title: string;
  year: string;
  research: ResearchInfo;
}

const GREEN = "#2E7D32";
const TERRA = "#E27D60";

const DataChart: React.FC<{ chart: ResearchChart }> = ({ chart }) => {
  const hasErr = chart.points.some((p) => p.err !== undefined);
  const fitData = chart.fit
    ? chart.xDomain.map((x) => ({ x, y: chart.fit!.slope * x + chart.fit!.intercept }))
    : [];

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="x"
          domain={chart.xDomain}
          ticks={chart.xTicks}
          allowDuplicatedCategory={false}
          tick={{ fontSize: 12, fill: "#555" }}
          label={{ value: chart.xLabel, position: "insideBottom", offset: -18, fontSize: 13, fill: "#333" }}
        />
        <YAxis
          type="number"
          domain={chart.yDomain}
          ticks={chart.yTicks}
          tick={{ fontSize: 12, fill: "#555" }}
          label={{ value: chart.yLabel, angle: -90, position: "insideLeft", offset: 0, fontSize: 13, fill: "#333", style: { textAnchor: "middle" } }}
        />
        <Tooltip
          formatter={(value: number, name: string) => [Number(value).toFixed(3), name]}
          labelFormatter={(label) => `${chart.xLabel}: ${label}`}
        />
        {chart.fit && (
          <Line
            data={fitData}
            dataKey="y"
            name="Linear fit"
            stroke={TERRA}
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        )}
        <Line
          data={chart.points}
          dataKey="y"
          name="Measured"
          stroke={GREEN}
          strokeWidth={chart.connect ? 2.5 : 0}
          dot={{ r: chart.connect ? 3 : 5, fill: GREEN, stroke: GREEN }}
          isAnimationActive={false}
        >
          {hasErr && <ErrorBar dataKey="err" width={6} stroke={GREEN} direction="y" />}
        </Line>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const DownloadButtons: React.FC<{ research: ResearchInfo }> = ({ research }) => (
  <div className="flex flex-wrap gap-3">
    <a
      href={research.pdf}
      download={research.pdfName}
      className="inline-flex items-center gap-2 bg-forest-green text-white px-5 py-3 rounded-lg font-medium hover:bg-forest-green/90 transition-colors"
    >
      <Download size={18} />
      Download full report (PDF)
    </a>
    <a
      href={research.pdf}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 border border-forest-green text-forest-green px-5 py-3 rounded-lg font-medium hover:bg-forest-green/5 transition-colors"
    >
      <ExternalLink size={18} />
      Open in new tab
    </a>
  </div>
);

const ResearchDetail: React.FC<ResearchDetailProps> = ({ title, year, research }) => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container px-6 md:px-12 py-24 space-y-8">
          <button onClick={() => navigate("/projects")} className="text-charcoal hover:text-forest-green">
            ← Back to projects
          </button>

          {/* header: research question + download */}
          <div className="bg-white rounded-xl shadow p-8 md:p-10">
            <span className="text-xs uppercase tracking-widest text-forest-green">
              {research.subject} • {year}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mt-3 text-charcoal">{title}</h1>

            <div className="mt-6 border-l-4 border-forest-green pl-5">
              <p className="text-xs uppercase tracking-wide text-charcoal/60 mb-1">Research question</p>
              <p className="text-lg md:text-xl text-charcoal/90 leading-relaxed">{research.researchQuestion}</p>
            </div>

            {research.hypothesis && (
              <p className="mt-4 text-charcoal/70">
                <span className="font-semibold text-charcoal">Hypothesis: </span>
                {research.hypothesis}
              </p>
            )}

            <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
              <DownloadButtons research={research} />
              <span className="inline-flex items-center gap-2 text-sm text-charcoal/60">
                <FileText size={16} />
                {research.pages} pages
                {research.wordCount ? ` • ${research.wordCount.toLocaleString()} words` : ""}
              </span>
            </div>
          </div>

          {/* key numbers */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {research.stats.map((s) => (
              <div key={s.label} className="bg-white rounded-xl shadow p-5">
                <p className="text-xs uppercase tracking-wide text-charcoal/60">{s.label}</p>
                <p className="text-xl font-bold text-forest-green mt-2">{s.value}</p>
              </div>
            ))}
          </div>

          {/* results chart + variables */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className={`bg-white rounded-xl shadow p-6 md:p-8 ${research.variables ? "lg:col-span-3" : "lg:col-span-5"}`}>
              <h2 className="text-xl font-semibold text-forest-green">{research.chart.title}</h2>
              <div className="mt-4">
                <DataChart chart={research.chart} />
              </div>
              <p className="text-sm text-charcoal/60 mt-2">{research.chart.caption}</p>
              {research.chart.fit && (
                <p className="text-sm text-charcoal/70 mt-1">
                  <span className="inline-block w-4 border-t-2 border-dashed align-middle mr-2" style={{ borderColor: TERRA }} />
                  {research.chart.fit.label}
                </p>
              )}
            </div>

            {research.variables && (
              <div className="bg-white rounded-xl shadow p-6 md:p-8 lg:col-span-2">
                <h2 className="text-xl font-semibold text-forest-green mb-4">Variables</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-charcoal/60">Independent</dt>
                    <dd className="text-charcoal mt-1">{research.variables.independent}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-charcoal/60">Dependent</dt>
                    <dd className="text-charcoal mt-1">{research.variables.dependent}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-charcoal/60">Controlled</dt>
                    <dd>
                      <ul className="mt-1 space-y-1 text-charcoal/80 text-sm list-disc pl-5">
                        {research.variables.controlled.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>

          {/* method + findings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow p-6 md:p-8">
              <h2 className="text-xl font-semibold text-forest-green mb-4">Method</h2>
              <ol className="space-y-4">
                {research.method.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-forest-green/10 text-forest-green text-sm font-semibold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-charcoal/80">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-white rounded-xl shadow p-6 md:p-8">
              <h2 className="text-xl font-semibold text-forest-green mb-4">Key findings</h2>
              <ul className="space-y-4">
                {research.findings.map((f, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-forest-green" />
                    <p className="text-charcoal/80">{f}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* limitations */}
          <div className="bg-white rounded-xl shadow p-6 md:p-8">
            <h2 className="text-xl font-semibold text-forest-green mb-4">Limitations &amp; improvements</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {research.limitations.map((l, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-terra-cotta" />
                  <p className="text-charcoal/80 text-sm">{l}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* closing cta */}
          <div className="bg-forest-green/5 border border-forest-green/20 rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-charcoal">Want the full analysis?</h2>
            <p className="text-charcoal/70 mt-2 mb-6">
              The complete report includes the raw data, every calculation, uncertainty propagation and graphs.
            </p>
            <div className="flex justify-center">
              <DownloadButtons research={research} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ResearchDetail;
