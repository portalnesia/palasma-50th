# PALASMA 50th - OpenCode Agent Guidelines

## Essential Commands
- Install: `bun install`
- Dev server: `bun run dev` (runs at http://localhost:4321)
- Unit tests: `bun run test` (Vitest)
- E2E tests: `bun run test:e2e` (Playwright, requires dev server on port 4321)
- Format: `bun run format` (Prettier with Astro plugin)
- Format check: `bun run format:check` (used in CI)
- Build: `bun run build` (static output to dist/)
- Preview: `bun run preview` (preview production build)

## Project Structure
- **src/components/** - Astro components (SplashScreen, HeroSection, etc.)
- **src/layouts/** - Page layouts (DefaultLayout)
- **src/pages/** - Route-based pages (currently just index.astro)
- **src/styles/** - Global CSS (global.css for Tailwind base)
- **src/utils/** - GSAP animations and helper functions
- **src/config/** - Centralized configuration (site.ts, content.ts, links.ts, assets.ts, contacts.ts)
- **public/assets/** - Static assets (images, audio, fonts)
- **e2e/** - Playwright end-to-end tests
- **src/__tests__/** - Vitest unit tests

## Key Conventions
- **TypeScript path aliases**: `@config/*`, `@components/*`, `@layouts/*`, `@utils/*`, `@assets/*` (configured in tsconfig.json and vitest.config.ts)
- **GSAP usage**: Import from `src/utils/gsap.ts` - call `initGSAP()` then use animations
- **Configuration**: Edit files in `src/config/` for all text, links, assets, and site info
- **Styling**: Tailwind CSS v4 - no custom CSS needed in most cases
- **File types**: `.astro` for components/pages, `.ts` for logic/utils, `.spec.ts` for tests

## Testing Notes
- Unit tests: Vitest with happy-dom environment, match `src/**/*.{test,spec}.{ts,js}`
- E2E tests: Playwright, configured to run against dev server on port 4321
- Test order in CI: format check → unit tests → e2e tests → build
- GSAP animations degrade gracefully - content visible without JS

## Development Gotchas
- Bun v1.3.14+ required (check .github/workflows for exact version in CI)
- Dev server port: 4321 (hardcoded in playwright.config.ts)
- GSAP plugins must be registered via `src/utils/gsap.ts`
- All animations use ScrollTrigger - call `refreshScrollTrigger()` after dynamic DOM changes
- Prettier requires `prettier-plugin-astro` for .astro files
- Static site output: `bun run build` produces deployable static files in `dist/`

## Configuration Files
- Site info: `src/config/site.ts` (title, description, event details)
- Content: `src/config/content.ts` (all text strings)
- Links: `src/config/links.ts` (external links)
- Assets: `src/config/assets.ts` (image paths)
- Contacts: `src/config/contacts.ts` (panitia contact info)