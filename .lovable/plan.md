# Slide 6 (CAPEX): editable line items + reorder by priority + sync with Live Model

Today slide 6 is read-only — every value in `capexDetailed` (line 22) is static, the header reads "IDR 10.4B", and the Live Model's CAPEX slider is independent. Goal: make every CAPEX line item adjustable, recompute everything that depends on it, and re-order categories from highest to lowest gym-operator priority.

## 1. Shared CAPEX state (single source of truth)

Move `capexDetailed` from a module constant to React state shared between slide 6 (`S6`) and the Live Model (`SModel`).

- New file-level `CAPEX_BASE` constant holds the seed array (used for "reset" + delta indicators).
- Add a small context `CapexProvider` in `src/routes/index.tsx`:
  - Wraps `<Deck>` so every slide can read/write.
  - Holds `capex` (typed `CapexCategory[]`), `setItemCost(catIdx, itemIdx, value)`, `setCategory(catIdx, partial)`, `resetCapex()`, and a memoized `totalM` (sum of all items in M IDR).
  - Persists to `localStorage` under `tomshyrox:capex:v1` and re-validates on load (numeric, finite, clamped 0–50,000 per line) using the same `numOr` / `clamp` pattern already in `SModel`. Drop corrupt entries and fall back to `CAPEX_BASE` if the schema doesn't match.

## 2. Slide 6 (S6) — editable rows

Stop calling the generic `CollapsibleSection` (used by OPEX) and inline a dedicated `CapexCategorySection` that mirrors its look but adds:

- A number `<input>` per line item ("IDR ___ M") that calls `setItemCost`. Input clamps on blur and recomputes the category subtotal live.
- Category subtotal row recomputed from the live items (replacing the static `total` field).
- A small "+ ADD LINE" / "× REMOVE" affordance per row so an operator can model trade-offs.
- A "↻ RESET" pill in the section header that restores that category from `CAPEX_BASE`.

The bar chart at the top of S6 reads from the same live `capex` array (so bars resize as you edit). The header title and the "TOTAL CAPEX" footer both read `totalM` instead of the hard-coded `10.4B`.

## 3. Reorder categories — operator priority (top → bottom)

Re-sequence `CAPEX_BASE` in this order, with a short `priority` label rendered as a small pill in the section header (e.g. `P1 · MUST-HAVE TO OPEN`). Order reflects what a world-class gym operator builds first because removing it means the gym cannot open or cannot serve members:

1. **FACILITY BUILDOUT** — P1 · Must-have to open. Without the shell, MEP, HVAC, locker rooms, and fire safety there is no venue.
2. **WORKING CAPITAL (5 MONTHS)** — P1 · Must-have to survive. Payroll + utilities buffer prevents a death spiral in months 1–5.
3. **HYROX EQUIPMENT** — P1 · Core product differentiator. The reason members pay a premium vs a generic gym.
4. **STRENGTH EQUIPMENT** — P2 · Core daily-use kit. Required for the base membership promise.
5. **LEGAL & PERMITS** — P2 · Required to operate. PT, IMB/PBG, insurance — non-negotiable but smaller envelope.
6. **TECHNOLOGY & SYSTEMS** — P2 · Operations backbone. Access control, POS, CCTV, booking — needed at open but cheaper to phase.
7. **PRE-OPENING MARKETING** — P3 · Drives ramp. Can be scaled up/down depending on founding-member traction.
8. **CONTINGENCY (12%)** — P3 · Risk buffer. Last to draw on, first to trim if other rows come in under budget.

Order is encoded in `CAPEX_BASE`; the priority label and rationale ride on each category object.

## 4. Live Model (SModel) sync

- Replace the standalone CAPEX `useState` with `useCapex()` context. The slider now drives `setCapex(totalM)` via a proportional scale across category totals (i.e., dragging the slider scales every category uniformly), OR — preferred — the slider becomes read-only when slide 6 has been edited and shows "Edit line items on slide 6 to change CAPEX". I'll keep the slider editable: dragging it proportionally scales every line item so both views stay consistent, then slide-6 line-level edits override.
- The "CAPEX" stat card, "5-YR MULTIPLE", payback, and scenario readout already read from `capex` — they continue to work unchanged.
- Saved scenarios still snapshot the scalar `capex` value (not the per-line breakdown), so the comparison table behavior is unchanged.

## 5. Validation reuse

The numeric clamp/sanitize helpers added for scenarios (`numOr`, `clamp`) get hoisted to module scope so both `CapexProvider` and `SModel` use the same rules. Per-line input range: 0–50,000M; category totals derived, not stored.

## Files touched
- `src/routes/index.tsx` only (single-file deck).

## Out of scope
- OPEX editing (slide 7) — same pattern would apply but the user only asked for slide 6.
- Editing the chart bars by drag — number inputs are sufficient and clearer.
