# moodlicious.com

Documentation site for [Moodlicious](https://github.com/moodlicious) Moodle plugins.

Built with [Nextra](https://nextra.site) — a static site generator built on Next.js.

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Fetching plugin docs

Plugin documentation is fetched from GitHub repos at build time:

```bash
bun run fetch-plugin-docs
```

## Scripts

| Script                      | Description                    |
| --------------------------- | ------------------------------ |
| `bun run dev`               | Start dev server               |
| `bun run build`             | Build for production           |
| `bun run lint`              | Run ESLint                     |
| `bun run format:check`      | Check formatting with Prettier |
| `bun run format:write`      | Format all files with Prettier |
| `bun run fetch-plugin-docs` | Clone latest docs from GitHub  |

## CI/CD

- **CI** (`.github/workflows/ci.yml`) — runs on every PR: fetch docs → format check → lint → build
- **Deploy** (`.github/workflows/deploy.yml`) — deploys to GitHub Pages on push to `main`
