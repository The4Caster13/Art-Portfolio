import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { ExternalLink, Github } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { CodeInfo } from "@/types/project";
import { fetchLanguages, fetchRepo, languageColor, repoUrl } from "@/lib/github";

interface CodeDetailProps {
  title: string;
  year: string;
  code: CodeInfo;
}

const HOUR = 60 * 60 * 1000;

const LinkButtons: React.FC<{ code: CodeInfo }> = ({ code }) => (
  <div className="flex flex-wrap gap-3">
    <a
      href={repoUrl(code.repo)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-forest-green text-white px-5 py-3 rounded-lg font-medium hover:bg-forest-green/90 transition-colors"
    >
      <Github size={18} />
      View code on GitHub
    </a>
    {code.liveUrl && (
      <a
        href={code.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-forest-green text-forest-green px-5 py-3 rounded-lg font-medium hover:bg-forest-green/5 transition-colors"
      >
        <ExternalLink size={18} />
        Live demo
      </a>
    )}
  </div>
);

// proportional colour bar + legend, like github's language bar
const LanguageBar: React.FC<{ languages: Record<string, number> }> = ({ languages }) => {
  const entries = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, b]) => sum + b, 0) || 1;
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
        {entries.map(([lang, bytes]) => (
          <div
            key={lang}
            style={{ width: `${(bytes / total) * 100}%`, backgroundColor: languageColor(lang) }}
            title={lang}
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-charcoal/80">
        {entries.map(([lang, bytes]) => (
          <li key={lang} className="inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: languageColor(lang) }} />
            {lang}{" "}
            <span className="text-charcoal/50">
              {bytes / total < 0.001 ? "<0.1" : ((bytes / total) * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CodeDetail: React.FC<CodeDetailProps> = ({ title, year, code }) => {
  const navigate = useNavigate();

  // live data; on failure these just stay undefined and the page uses the static fallback
  const repo = useQuery({ queryKey: ["gh-repo", code.repo], queryFn: () => fetchRepo(code.repo), staleTime: HOUR, retry: false });
  const langs = useQuery({ queryKey: ["gh-langs", code.repo], queryFn: () => fetchLanguages(code.repo), staleTime: HOUR, retry: false });

  const languages = langs.data && Object.keys(langs.data).length ? langs.data : code.fallbackLanguages;

  const tiles = repo.data
    ? [
        { label: "Last updated", value: formatDistanceToNow(new Date(repo.data.pushed_at), { addSuffix: true }) },
        { label: "Main language", value: repo.data.language ?? "n/a" },
        // stars once there are some, otherwise when the project started
        repo.data.stargazers_count > 0
          ? { label: "Stars", value: repo.data.stargazers_count.toLocaleString() }
          : { label: "Started", value: format(new Date(repo.data.created_at), "MMMM yyyy") },
      ]
    : [];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container px-6 md:px-12 py-24 space-y-8">
          <button onClick={() => navigate("/projects")} className="text-charcoal hover:text-forest-green">
            ← Back to projects
          </button>

          {/* header */}
          <div className="bg-white rounded-xl shadow p-8 md:p-10">
            <span className="text-xs uppercase tracking-widest text-forest-green">Code · GitHub • {year}</span>
            <h1 className="text-3xl md:text-4xl font-bold mt-3 text-charcoal">{title}</h1>
            <p className="text-lg md:text-xl text-charcoal/70 mt-3">{code.tagline}</p>
            <div className="mt-8">
              <LinkButtons code={code} />
            </div>
          </div>

          {/* live repo stats (hidden if github is unreachable) */}
          {tiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tiles.map((t) => (
                <div key={t.label} className="bg-white rounded-xl shadow p-5">
                  <p className="text-xs uppercase tracking-wide text-charcoal/60">{t.label}</p>
                  <p className="text-xl font-bold text-forest-green mt-2">{t.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* problem + languages/stack */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="bg-white rounded-xl shadow p-6 md:p-8 lg:col-span-3">
              <h2 className="text-xl font-semibold text-forest-green mb-4">The problem</h2>
              <p className="text-charcoal/80 leading-relaxed">{code.problem}</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 md:p-8 lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-forest-green mb-4">Languages</h2>
                <LanguageBar languages={languages} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-forest-green mb-3">Tech stack</h2>
                <ul className="flex flex-wrap gap-2">
                  {code.stack.map((s) => (
                    <li key={s} className="text-sm px-3 py-1 rounded-full bg-forest-green/10 text-forest-green">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* how it works + features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow p-6 md:p-8">
              <h2 className="text-xl font-semibold text-forest-green mb-4">How it works</h2>
              <ol className="space-y-4">
                {code.howItWorks.map((step, i) => (
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
              <h2 className="text-xl font-semibold text-forest-green mb-4">Features</h2>
              <ul className="space-y-3">
                {code.features.map((f, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-forest-green" />
                    <p className="text-charcoal/80">{f}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* closing cta */}
          <div className="bg-forest-green/5 border border-forest-green/20 rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-charcoal">See the code</h2>
            <p className="text-charcoal/70 mt-2 mb-6">The full source, setup instructions and history are on GitHub.</p>
            <div className="flex justify-center">
              <LinkButtons code={code} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CodeDetail;
