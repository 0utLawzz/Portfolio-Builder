# Changelog

All notable changes to **Portfolio Builder (OUTLAWZ LABS™)** are documented here.

## [1.0.0] — 2026-09-16

### Status: **COMPLETE** (production milestone)

### Added
- Live portfolio site on Vercel with neo-brutalist UI (black / `#FFE600`)
- GitHub auto-sync: all public repos listed; hide via private or topic `portfolio-hide`
- Neon PostgreSQL case studies: Overview, Problem, Solution for **21** projects
- API (`outlawz-portfolio-api`): `/api/github`, `/api/projects`, `/api/projects/featured`, `/api/projects/by-slug/:slug`
- Featured projects on home (recent GitHub repos) + full project detail pages
- Social preview SVG (`social-preview.svg`) + README documentation
- Vercel monorepo build: portfolio-only filter + SPA / API rewrites
- Admin login surface (default local password documented in README)

### Fixed
- API HTTP **508** infinite rewrite loops (empty `vercel.json` + filesystem routes)
- TypeScript session cast in `api-server` admin routes (Vercel typecheck)
- Missing project images fallback to GitHub Open Graph previews

### Removed / cleaned
- Outdated Hostinger deploy tarball
- npm `package-lock.json` (pnpm workspace)
- Expanded `.gitignore` for tarballs, bak files, local deploy junk

### Live
- Portfolio: https://outlawz-labs-portfolio.vercel.app
- API: https://outlawz-portfolio-api.vercel.app

---

## [0.0.0] — prior

Initial Replit / monorepo scaffold.
