import React from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Github } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { caseStudyRepos } from "@/data/projects";
import { GITHUB_URL, fetchUserRepos, languageColor } from "@/lib/github";

// repos that already have their own page (or are this site) aren't repeated here
const HIDDEN = new Set(["Art-Portfolio", ...caseStudyRepos]);

// "More on GitHub": every other public repo, pulled live
const GitHubStrip = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["gh-repos"],
    queryFn: fetchUserRepos,
    staleTime: 60 * 60 * 1000,
    retry: false,
  });

  if (isError) return null;

  const repos = (data ?? [])
    .filter((r) => !r.fork && !HIDDEN.has(r.name))
    .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at));

  if (!isLoading && repos.length === 0) return null;

  return (
    <section className="mt-20">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">More on GitHub</h2>
          <div className="w-16 h-1 bg-gray-900 mt-3" />
        </div>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium uppercase tracking-wide flex items-center gap-2 hover:text-gray-600"
        >
          <Github size={16} />
          View all on GitHub →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-36 rounded-lg" />)
          : repos.map((r) => (
              <div
                key={r.name}
                className="relative bg-white/80 border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-gray-300 transition"
              >
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-lg hover:text-forest-green after:absolute after:inset-0"
                >
                  {r.name}
                </a>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {r.description || "No description yet"}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-xs text-muted-foreground">
                  {r.language && (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: languageColor(r.language) }} />
                      {r.language}
                    </span>
                  )}
                  <span>updated {formatDistanceToNow(new Date(r.pushed_at), { addSuffix: true })}</span>
                  {r.homepage && (
                    <a
                      href={r.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 inline-flex items-center gap-1 text-forest-green hover:underline"
                    >
                      <ExternalLink size={12} />
                      {r.homepage.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  )}
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

export default GitHubStrip;
