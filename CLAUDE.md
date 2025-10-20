# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Pokémon Legends Z-A type chart web application - a single-file HTML application that displays type effectiveness relationships for both attacking (offense) and defending (defense) scenarios. The application is self-contained with embedded CSS and JavaScript.

## Project Structure

- **pokemon-type-chart.html** - The sole application file containing:
  - HTML structure for rendering type cards and tabs
  - Embedded CSS styling (flexbox/grid responsive layout)
  - Embedded JavaScript for interactivity (tab switching, language switching)

## Key Features

1. **Tab Navigation** - Two tabs for "Attack" and "Defense" views
2. **Language Switching** - Toggle between English (EN) and German (DE)
3. **Type Cards** - 18 cards (one per Pokémon type) showing:
   - Super effective matchups (2×)
   - Not very effective matchups (½×)
   - No effect / immunity matchups (0×)
4. **Responsive Design** - Grid layout adapts to mobile devices (single column on screens < 640px)
5. **Type-Specific Colors** - Each Pokémon type has a distinct background color

## Development Commands

Since this is a single-file application, there's no build step required. To develop:

```bash
# Open in browser
open pokemon-type-chart.html

# Or serve locally for testing (if needed)
python3 -m http.server 8000
# Then visit http://localhost:8000/pokemon-type-chart.html
```

## Key Implementation Details

### Translation System
- **Location**: JavaScript section, lines 1702-1777
- Supports English (en) and German (de)
- Translations object with keys: types, offense/defense section labels, footer text
- `switchLanguage()` function (lines 1780-1821) updates all elements with `data-lang-*` attributes

### Tab Switching
- **Function**: `switchTab()` (lines 1823-1844)
- Manages `.tab-content` visibility and `.active` class on buttons
- Automatically scrolls to top when switching tabs

### Data Attributes System
- Type cards use `data-type` to link visual styling with content
- Section titles use `data-section` and `data-category` for translation lookup
- This decouples translation keys from HTML structure

### Responsive Design
- Main grid uses `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`
- Mobile breakpoint at 640px switches to single column
- Uses `clamp()` for responsive font sizing

## Making Changes

### Adding a New Language
1. Add translation object to `translations` (line 1705)
2. Add language button in HTML (line 329-332)
3. Update `switchLanguage()` to handle new language code

### Adding a New Type or Modifying Matchups
1. Duplicate a type-card div and update:
   - `.type-header` with new type class and `data-type`
   - Type name text
   - Type badge content within effectiveness sections
2. Ensure new type color is defined in CSS (lines 209-226)

### Styling Changes
- All CSS is in the `<style>` section (lines 7-323)
- Type colors: lines 209-226
- Tab styling: lines 245-323
- Card styling: lines 129-206

## Testing Checklist for Changes
- Test both Attack and Defense tabs
- Verify language switching updates all elements correctly
- Check responsive layout on mobile (< 640px viewport)
- Ensure type matchup data is accurate
- Validate new colors display correctly on both light and dark backgrounds
