import { Router, type IRouter } from "express";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "0utLawzz";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const router: IRouter = Router();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cache: { data: unknown; ts: number } | null = null;

router.get("/github", async (req, res): Promise<void> => {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    res.json(cache.data);
    return;
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "OutlawzLabs-Portfolio",
  };

  if (GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  }

  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=public`,
        { headers },
      ),
    ]);

    if (!profileRes.ok || !reposRes.ok) {
      req.log.warn(
        { profileStatus: profileRes.status, reposStatus: reposRes.status },
        "GitHub API error",
      );
      res.status(502).json({ error: "GitHub API error" });
      return;
    }

    const profile = await profileRes.json();
    const allRepos = await reposRes.json();

    const repos = (allRepos as Array<Record<string, unknown>>)
      .filter((r) => !r.fork)
      .map((r) => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        html_url: r.html_url,
        description: r.description ?? null,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        language: r.language ?? null,
        updated_at: r.updated_at,
        topics: r.topics ?? [],
        fork: r.fork,
        private: r.private,
        homepage: r.homepage ?? null,
        open_issues_count: r.open_issues_count ?? 0,
        size: r.size ?? 0,
      }));

    const data = {
      profile: {
        login: profile.login,
        name: profile.name ?? null,
        bio: profile.bio ?? null,
        avatar_url: profile.avatar_url,
        html_url: profile.html_url,
        public_repos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
      },
      repos,
    };

    cache = { data, ts: Date.now() };
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch GitHub data");
    res.status(502).json({ error: "Failed to reach GitHub API" });
  }
});

export default router;
