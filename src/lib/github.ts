// public github api (no token): 60 requests/hour per visitor, so every caller has a static fallback
export const GITHUB_USER = "The4Caster13";
export const GITHUB_URL = `https://github.com/${GITHUB_USER}`;
export const repoUrl = (repo: string) => `${GITHUB_URL}/${repo}`;

const API = "https://api.github.com";

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
}

const getJson = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${API}${path}`, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return res.json();
};

export const fetchRepo = (repo: string) => getJson<GitHubRepo>(`/repos/${GITHUB_USER}/${repo}`);

export const fetchLanguages = (repo: string) =>
  getJson<Record<string, number>>(`/repos/${GITHUB_USER}/${repo}/languages`);

export const fetchUserRepos = () =>
  getJson<GitHubRepo[]>(`/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);

// github's own language colours
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Dockerfile: "#384d54",
};
export const languageColor = (lang: string | null) => (lang && LANGUAGE_COLORS[lang]) || "#9ca3af";
