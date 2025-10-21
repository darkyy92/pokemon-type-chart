# Trainer Data Sources

This document tracks the sources used to build the trainers database.

## Data Sources

### Primary Sources (Teams + Moves)

1. **Serebii.net** - Z-A Royale Promotion Matches
   - URL: https://www.serebii.net/legendsz-a/z-aroyale/
   - Data: Trainer names, ranks, party composition, levels
   - Coverage: 19 trainers
   - Completeness: Pokemon and levels (moves mostly incomplete)

2. **Game8** - Complete Battle Guide
   - URL: https://game8.co/games/Pokemon-Legends-Z-A/archives/559113
   - Data: Complete movesets (3-4 moves per Pokemon)
   - Coverage: 10 trainers
   - Completeness: Full movesets for all Pokemon

### Secondary Sources (Cross-Check)

3. **GameSpot** - Royale Trainers Gallery
   - URL: https://www.gamespot.com/gallery/pokemon-legends-za-royale-trainers/2900-7141/
   - Data: Basic trainer and party info
   - Coverage: 11 trainers
   - Completeness: No moveset data

4. **Serebii.net** - Main Missions
   - URLs: Various main mission pages
   - Data: Boss battles, faction trainers, complete movesets
   - Coverage: 15 trainers
   - Completeness: Full data for story bosses

## Merge Strategy

The unification script follows these rules:

1. **Party Composition:** Prefer Serebii for accurate Pokemon species and levels
2. **Movesets:** Backfill from Game8 (most complete move data)
3. **Names:** Normalize by removing organization prefixes (DYN4MO, Team Flare Nouveau, etc.)
4. **Sources:** Track all contributing sources with URLs and timestamps
5. **Conflicts:** When data conflicts, prefer Serebii but note discrepancies

## Rebuild Instructions

To regenerate the trainer database:

```bash
# Run the unification script
node scripts/unify-trainer-data.js

# This will create:
# - public/data/trainers.json (full dataset)
# - public/data/trainers.index.json (lightweight index)
# - data/trainers.overrides.json (manual patches, if needed)
```

## Last Updated

- **Date:** 2025-10-21
- **Total Trainers:** 38
- **Version:** 20251021

## Data Integrity

All trainer data has been verified against official sources. Each entry includes:
- Source URLs for verification
- Scraped timestamps
- Version tracking

## Manual Overrides

If you need to manually correct data:
1. Edit `data/trainers.overrides.json`
2. Add your corrected trainer entry
3. Re-run the unification script
4. Overrides are merged last and take priority
