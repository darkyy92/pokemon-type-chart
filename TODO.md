# Pokemon Legends Z-A Battle Helper - Future Features

## Priority: High

### "My Team" Feature
**Goal:** Save your 6 Pokemon team and get personalized battle recommendations

**Implementation:**
- Bottom nav: Add "My Team" tab
- Team management page:
  - Add/remove Pokemon (max 6)
  - Show team grid with sprites
  - Persist to localStorage
- Enhanced Pokemon detail page:
  - New section: "🎯 USE FROM YOUR TEAM"
  - Show which of user's Pokemon counter the enemy best
  - Sort by effectiveness (4×, 2×, 1×, etc.)
  - Big "Switch to this!" buttons
  - "❌ Don't use from your team" section (Pokemon that are weak)
- Search results: Mark team Pokemon with ⭐ indicator

**User Experience:**
```
Enemy: Hawlucha appears
↓
User searches "hawl"
↓
Sees: "⭐ USE Gardevoir (BEST!) - Psychic deals 2× damage"
↓
Switches to Gardevoir
↓
Wins battle in < 10 seconds
```

---

## Priority: Medium

### German Language Support
**Goal:** Re-enable DE translations for German-speaking players

**Implementation:**
- Data already exists in typeMatchupsOffense/Defense.ts
- Add language switcher to bottom nav or settings
- Update all UI strings to use translation keys
- Create `translations.ts` with EN/DE strings
- Test all screens in both languages

---

### Offensive Mode (What Pokemon Should I Use?)
**Goal:** Reverse lookup - "I want to use Fire type, what should I attack?"

**Implementation:**
- Toggle on Pokemon detail: "Defense" / "Offense" tabs
- Offense view shows:
  - "✅ STRONG AGAINST" (super effective targets)
  - "❌ WEAK AGAINST" (resisted/immune targets)
- Use existing offense matchup data

---

### Type Chart Enhancements
**Goal:** Make the full type chart more useful during battles

**Implementation:**
- Search/filter types on type chart
- Highlight specific matchups
- Add "bookmark" feature for frequently checked types
- Mobile swipe navigation between tabs

---

## Priority: Low

### Advanced Search
**Goal:** Find Pokemon by criteria beyond name

**Features:**
- Search by type: "flying fighting" → finds Hawlucha
- Search by generation
- Search by stats (when data available)
- Filter Megas separately

---

### Battle History
**Goal:** Track recent battles for learning

**Implementation:**
- localStorage: Save last 10 searches
- "Recent battles" section on homepage
- Quick access to frequently checked Pokemon
- Clear history button

---

### Dark Mode
**Goal:** Better visibility in low-light conditions

**Implementation:**
- System preference detection
- Manual toggle in settings
- Adjust gradient background
- Maintain type badge visibility
- Test all colors for accessibility

---

### PWA/Offline Support
**Goal:** Work without internet during gameplay

**Implementation:**
- Add Vite PWA plugin
- Service worker for caching
- Install prompt for iOS/Android
- Offline sprite fallbacks (or cache sprites)
- manifest.json for app installation

---

### Stats & Abilities
**Goal:** Show more Pokemon data beyond types

**Features:**
- Base stats (HP, Attack, Defense, etc.)
- Abilities and their effects
- Recommended movesets
- Evolution chain

**Note:** Requires expanded Pokemon database

---

### Terastallization Support (Future)
**Goal:** Handle Tera types if added to Legends Z-A

**Implementation:**
- Checkbox: "Is Terastallized?"
- Dropdown: Select Tera type
- Recalculate matchups with Tera type override
- Visual indicator (Tera crown icon)

---

## Completed ✅

- ✅ Search-first mobile interface
- ✅ Pokemon search with autocomplete
- ✅ Dual-type effectiveness calculator
- ✅ Pokemon detail page with USE/AVOID sections
- ✅ Legends Z-A Lumiose Pokedex (304 Pokemon + Megas)
- ✅ Type chart (Attack/Defense tabs)
- ✅ Mobile-optimized responsive design
- ✅ Pokemon sprites from PokeAPI
- ✅ Type badges with emojis
- ✅ Fuzzy search (partial names work)
