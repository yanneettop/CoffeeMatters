# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (accessible on local network via host: true)
npm run build     # Type-check with tsc, then build with Vite
npm run lint      # Run ESLint
npm run preview   # Preview the production build locally
```

## Architecture

This is a single-page React 19 + TypeScript app for the Coffee Matters café website, built with Vite, Tailwind CSS v3, and shadcn/ui components.

### Routing

There is no router library. Navigation is hash-based and managed entirely in `src/App.tsx`. The `Page` type (`'home' | 'menu' | 'about'`) drives which content renders. `PAGE_HASHES` maps URL hashes to pages. The `navigateTo` helper handles transitions, including deferred scroll-to-section when returning from a sub-page back to the home page. Browser back/forward is handled via `popstate`.

### Page Structure

- **Home** — a single scrollable page composed of stacked sections from `src/sections/`: `Hero`, `OurCoffee`, `SweetsBrunch`, `HostEvents`, `AboutUs`, `NewsletterCTA`, `Footer`.
- **Menu page** (`#menu`) — rendered via `src/pages/MenuPage.tsx`, uses tabbed layout driven by `src/data/menuData.ts`.
- **About page** (`#about`) — rendered via `src/pages/AboutUsPage.tsx`.

### Animations

GSAP with `ScrollTrigger` is used for scroll-based animations. `ScrollTrigger` is registered globally in `App.tsx` and refreshed on every page change (300ms debounce).

### Data

All menu content lives in `src/data/menuData.ts` as typed static data (`MenuTab → MenuCategory → MenuItemData`). Dietary tags (`'V' | 'VG' | 'GF'`) are rendered by `src/components/menu/DietaryBadge.tsx`.

### Styling

- Tailwind CSS v3 with shadcn/ui theme — all design tokens are CSS variables (`hsl(var(--...))`) defined in `src/index.css`.
- Custom `bg-cream` utility class used across sections.
- `tailwindcss-animate` plugin is active.
- Path alias `@/` resolves to `src/`.

### Components

- `src/components/ui/` — full shadcn/ui component library (40+ components, import from `@/components/ui/<name>`).
- `src/components/menu/` — menu-specific components: `MenuItem`, `MenuCategoryCard`, `DietaryBadge`.
- `src/components/Navbar.tsx` — accepts `forceGlass` prop that activates the glass style when on non-home pages.
