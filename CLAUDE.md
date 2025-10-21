# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pokémon Legends Z-A Battle Helper** - A modern, production-grade Single Page Application (SPA) built with React 18 and TypeScript. This is a mobile-first web app designed to help players quickly find type matchups during battles. The primary use case is: enemy appears → search Pokemon → see counters → win battle in < 10 seconds.

**Architecture:**
This is a **full-featured React/TypeScript web application**, NOT a simple HTML file. The codebase follows modern web development best practices with:
- Component-based architecture
- Type-safe data models and utilities
- Client-side routing (SPA)
- Build-time optimization and code splitting
- Hot Module Replacement (HMR) for development

**Tech Stack:**
- **React 18** - Component framework with hooks
- **TypeScript** - Strict type safety throughout
- **Vite** - Modern build tool with instant HMR
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible component primitives built on Radix UI
- **Fuse.js** - Client-side fuzzy search engine
- **React Router** - Hash-based routing (for GitHub Pages compatibility)

## Core Development Rules

### 1. **Mobile-First, iPhone Optimized** 🎯
**CRITICAL:** The primary platform is iPhone. Desktop is secondary.

- Always design for iPhone first (375×667 viewport)
- Minimum tap target size: **44px** (Apple HIG)
- Font sizes: 32px+ for headings, 18px+ for body on mobile
- Test all features on iPhone Safari before considering done
- Bottom navigation for thumb reach
- Auto-focus search input on page load

### 2. **Main Focus: UX/UI Ease of Use** ⚡
**PRIORITY #1:** Fast, intuitive user experience over everything else.

- Battle lookup flow must be < 10 seconds
- Clear visual hierarchy: Green = USE, Red = AVOID
- Large, readable text and buttons
- No cognitive load - instant understanding
- Hide neutral (1×) matchups to reduce clutter
- Search-first interface (not type chart)

**NOT priorities:**
- SEO (internal tool, not public-facing)
- Over-engineering (keep features simple and focused)
- Adding features that slow down the core battle lookup flow

### 3. **Use Premade Components - Don't Reinvent the Wheel** 🧩

**Always use shadcn/ui components when available:**
- Need a button? Use shadcn Button
- Need a card? Use shadcn Card
- Need a dialog? Use shadcn Dialog
- Need navigation? Use shadcn Tabs/Sheet

**Why?**
- Battle-tested accessibility
- Consistent design system
- Faster development
- Less bugs

**Custom components only when:**
- shadcn doesn't have what we need
- Pokemon-specific styling required (TypeBadge, etc.)

### 4. **Language Strategy** 🌐

- **UI:** English only for now (simpler, faster iteration)
- **Data layer:** Keep German translations (already exists in data files)
- **Re-enable later:** Just show language switcher in settings when needed
- **Never delete translations** - they're already implemented, just hidden

### 5. **Performance & Speed** ⚡

- Fuzzy search must respond in < 100ms
- No loading spinners for local data
- Lazy load Pokemon sprites (PokeAPI CDN)
- Keep bundle size reasonable with code splitting

### 6. **Type Safety** 🔒

- TypeScript strict mode enabled
- All Pokemon data strongly typed
- Type matchup calculations must be type-safe
- No `any` types unless absolutely necessary

### 7. **Use Parallel Subagents** 🤖

**When to use subagents:**
- Researching/gathering information (web search, reading docs)
- Testing with Chrome DevTools (visual verification)
- Complex multi-step tasks that can run autonomously

**Run subagents in parallel when possible:**
```
Good: Launch 3 subagents simultaneously to research different topics
Bad: Launch subagents sequentially when they don't depend on each other
```

### 8. **Git Commit Strategy** 💾

**Commit automatically after meaningful changes, but ONLY after verification:**

1. **Verify first:**
   - Use Chrome DevTools to test the feature works
   - OR ask user to confirm it works
   - Never assume it works without testing!

2. **Then commit:**
   - Descriptive commit message (what + why)
   - Only commit related changes together
   - Don't commit work-in-progress code

3. **When to commit:**
   - ✅ After completing a feature (tested + working)
   - ✅ After fixing a bug (verified fix works)
   - ✅ After meaningful refactor (no breaking changes)
   - ❌ NOT after every file change
   - ❌ NOT before testing

**Example flow:**
```
1. Build search feature
2. Test with Chrome DevTools (verify search works)
3. Commit: "Add Pokemon search with fuzzy autocomplete"
```

## Project Structure

**Modern React/TypeScript SPA with feature-based organization:**

```
pokemon-type-chart/
├── src/                           # Source code (TypeScript/TSX)
│   ├── components/                # Reusable React components
│   │   ├── TypeBadge.tsx          # Pokemon type badge with colors
│   │   ├── BottomNav.tsx          # Fixed bottom navigation
│   │   └── ui/                    # shadcn/ui components (Radix-based)
│   ├── data/                      # Static data modules (type-safe)
│   │   ├── pokemon.ts             # All 304 Pokemon (232 + 74 Megas)
│   │   ├── typeMatchupsOffense.ts # Offensive matchups (18 types)
│   │   └── typeMatchupsDefense.ts # Defensive matchups (18 types)
│   ├── pages/                     # Route-level components (React Router)
│   │   ├── Search.tsx             # Search-first homepage with autocomplete
│   │   ├── PokemonDetail.tsx      # USE/AVOID sections (dynamic route)
│   │   └── TypeChart.tsx          # Full type chart (Attack/Defense tabs)
│   ├── utils/                     # Business logic utilities
│   │   └── typeCalculator.ts      # Dual-type effectiveness calculator
│   ├── types.ts                   # Global TypeScript interfaces & types
│   ├── App.tsx                    # Root component (routes + layout)
│   ├── main.tsx                   # React entry point (ReactDOM.render)
│   └── index.css                  # Tailwind imports + global styles
├── dist/                          # Build output (Vite generates this)
├── node_modules/                  # NPM dependencies
├── public/                        # Static assets (copied as-is)
├── .github/workflows/             # CI/CD (GitHub Actions for deployment)
├── lumiose-pokedex.md             # Pokemon data source (Legends Z-A)
├── TODO.md                        # Future features (My Team, etc.)
├── package.json                   # NPM dependencies & scripts
├── tsconfig.json                  # TypeScript compiler config
├── tailwind.config.js             # Tailwind CSS config (custom colors)
├── vite.config.ts                 # Vite build configuration
└── index.html                     # HTML entry point (Vite injects bundle)
```

## Key Features

### 1. Search-First Interface
- **Homepage:** Large auto-focused search box
- **Autocomplete:** Shows top 5 results as you type
- **Fuzzy search:** "hawl" finds Hawlucha
- **Visual results:** Sprite + name + type badges
- **Fast:** < 10 second flow from search to counter selection

### 2. Dual-Type Effectiveness Calculator
**Core algorithm:** Multiplies defense matchups for each attacking type

Example: Hawlucha (Flying/Fighting)
- Bug attacks: Flying resists (0.5×) × Fighting resists (0.5×) = **0.25×**
- Ground attacks: Flying immune (0×) × Fighting weak (2×) = **0×**

**Implementation:** `src/utils/typeCalculator.ts` → `calculateDefenseMatchups()`

### 3. Pokemon Detail Page
**Mobile-optimized layout:**
- ✅ **USE THESE TYPES** (green section) - All 2× and 4× matchups
- ❌ **AVOID THESE TYPES** (red section) - All resistances and immunities
- Large tap targets, clear multipliers
- Sprite from PokeAPI

### 4. Type Chart (Legacy Feature)
- Preserves original 18-type grid
- Attack/Defense tabs
- Mobile-responsive
- Access via bottom navigation

### 5. Bottom Navigation
- Fixed position (thumb-friendly)
- Two tabs: Search, Type Chart
- Active state indication
- Always visible

## Data Sources

### Pokemon Database (`src/data/pokemon.ts`)
- **304 total Pokemon:**
  - 232 regular Pokemon (IDs 1-230)
  - 74 Mega Evolutions (IDs 1000+)
- **Source:** Legends Z-A Lumiose Pokedex (researched from Serebii/Bulbapedia)
- **Format:** `{ id, name, types[] }`

### Type Matchups
- **Offense:** `src/data/typeMatchupsOffense.ts` - What each type is strong/weak against
- **Defense:** `src/data/typeMatchupsDefense.ts` - What each type resists/is weak to
- **Source:** Official Pokemon type effectiveness data (verified against Bulbapedia/Serebii)
- **Format:** TypeScript objects with type-safe mappings

### Pokemon Sprites
- **Source:** PokemonDB.net (free, no auth required, more reliable than PokeAPI)
- **URL pattern:** Uses Pokemon name-based URLs for better Mega Evolution support
- **Lazy loaded:** Only load when Pokemon appears in search results

## Development Workflow

### Local Development
**This is a build-based application** - changes to TypeScript/React files require Vite's dev server to compile and serve.

```bash
npm install       # Install dependencies (first time only)
npm run dev       # Start Vite dev server with HMR (http://localhost:5173)
npm run build     # Production build (outputs to dist/)
npm run preview   # Preview production build locally
npm run lint      # Run ESLint (if configured)
```

**Development flow:**
1. Run `npm run dev` to start the dev server
2. Edit files in `src/` - Vite will auto-reload with HMR
3. Test changes at `http://localhost:5173`
4. Build for production with `npm run build`
5. Preview production build with `npm run preview`

### Testing Checklist
Before marking a feature complete:
1. ✅ Test on desktop (Chrome)
2. ✅ Test on iPhone viewport (375×667) in Chrome DevTools
3. ✅ Verify touch targets are 44px+ height
4. ✅ Check search performance (< 100ms)
5. ✅ Verify type calculations are accurate
6. ✅ Test navigation flow (back buttons, bottom nav)
7. ✅ Check responsive layout (no horizontal scroll)

### Making Changes

#### Adding shadcn/ui Components
```bash
# Install shadcn CLI (if not already)
npx shadcn-ui@latest init

# Add a component
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

#### Adding a New Pokemon Feature
1. Check if data exists in `pokemon.ts`
2. Create/update TypeScript types in `types.ts`
3. Build mobile-first UI component
4. Test on iPhone viewport
5. Add to TODO.md if not implemented

#### Modifying Type Matchups
**IMPORTANT:** Type matchup data is critical - triple check accuracy!
1. Edit `src/data/typeMatchupsOffense.ts` or `typeMatchupsDefense.ts`
2. Verify against official Pokemon sources
3. Test with dual-type Pokemon to ensure calculations work
4. Check both search detail page AND type chart

## Deployment

### GitHub Pages (Current Strategy)
- **URL:** `https://joel.github.io/pokemon-type-chart/`
- **Routing:** Hash-based (`/#/pokemon/hawlucha`) to avoid 404s
- **Base path:** `/pokemon-type-chart/` (configured in `vite.config.ts`)
- **Deployment:** GitHub Actions (auto-deploy on push to main)

### Future: Vercel/Netlify (If Needed)
- Better routing (no `#` in URLs)
- Automatic preview deployments
- Faster builds

## Common Tasks

### Add a New Page
1. Create component in `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx`
3. Add navigation link (bottom nav or back button)
4. Test routing on both desktop and mobile

### Add a New Pokemon Type
1. Update `PokemonType` union in `src/types.ts`
2. Add color in `tailwind.config.js` and `getTypeColor()`
3. Add emoji in `TypeBadge.tsx`
4. Update all type matchup data files

### Fix a Calculation Bug
1. Check `src/utils/typeCalculator.ts` → `calculateDefenseMatchups()`
2. Verify defense matchup data in `src/data/typeMatchupsDefense.ts`
3. Test with affected Pokemon (e.g., Hawlucha for Flying/Fighting)
4. Add console logs to debug multiplier calculations

## Future Features (TODO.md)

High priority features tracked in `TODO.md`:
- 🎯 **"My Team" feature** - Save 6 Pokemon, get personalized recommendations
- 🌐 **German language toggle** - Re-enable DE translations
- 📊 **Advanced search** - Search by type, generation, etc.
- 🌙 **Dark mode** - Better for low-light play

## Troubleshooting

### Search not working
- Check `pokemon.ts` has correct data
- Verify Fuse.js is imported correctly
- Check fuzzy search threshold (0.3 = balanced)

### Type colors wrong
- Check `tailwind.config.js` color definitions
- Verify `getTypeColor()` in `typeCalculator.ts`

### Sprites not loading
- Verify PokemonDB.net URL format
- Check Pokemon name formatting (lowercase, hyphens for Mega forms)
- Check browser console for CORS or network errors
- Test sprite URL directly in browser

### Calculation wrong
- Verify defense matchup data accuracy
- Check dual-type multiplication logic
- Test with known Pokemon (Hawlucha: Bug should be 0.25×)

## Remember

**The golden rule:** If your wife can't find a Pokemon counter in < 10 seconds, the UX needs improvement! 🎮
