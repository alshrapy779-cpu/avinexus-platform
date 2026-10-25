# AviNexus Windows R8.1 — Programming Hotfix 2

## Reason
A real Windows test showed that a natural-language sizing question such as:

> flock of 5000 birds, 2 days old, house 60 m × 12 m; how much space, feed, drinkers and feeders?

did not receive the expected scientific calculation.

## Root causes found
1. The R8.1 contextual intelligence endpoint required an already-registered active `flock_cycle_id`.
2. The older general AI advisor fell back to a generic answer when `GEMINI_API_KEY` was absent.
3. The local UI calculator did not parse numbers from a natural-language question; it used the calculator panel's current/default values.
4. R8.1 had FCR and mortality rules but did not yet expose the uploaded source's unambiguous brooding/equipment equations as deterministic chat calculations.

## Fix
Added `PoultryScientificCalculatorR81.ts` with deterministic, source-traceable calculations for:
- week-1 brooding/stocking area (30–40 chicks/m²);
- brooding feed trays (1/50 chicks);
- manual jumbo feeders and automatic pan feeders (1/50–70 chicks);
- chain feeder length (1 linear metre/80–100 birds);
- nipple points (1/12 birds);
- manual 4–5 L and jumbo drinkers (1/80–100 birds);
- starter-feed total for the starter phase (400–500 g/bird).

The calculation works in both Arabic and English natural-language queries, with or without external Gemini configuration. The external model, when configured, receives the deterministic result as context rather than inventing the arithmetic.

## Scientific guard
The uploaded equation source contains internally inconsistent wording around a day-based feed/water formula. Hotfix 2 therefore does **not** activate that ambiguous daily-feed number. Exact daily feed/water must come from an approved breed/region curve or a separately expert-approved equation. This is intentional scientific governance, not a missing feature.

## Example deterministic result
For 5,000 birds, age 2 days, house 60×12 m:
- full house area: 720 m²;
- current brooding/occupied area: 125.0–166.7 m²;
- brooding trays: 100;
- manual jumbo/pan feeders: 72–100;
- chain feeder: 50.0–62.5 linear m;
- nipple points: 417;
- manual/jumbo drinkers: 50–63;
- starter feed total for starter phase: 2,000–2,500 kg.
