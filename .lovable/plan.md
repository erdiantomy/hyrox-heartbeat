# Add CAPEX to Live Model (synchronized)

Currently the Live Model slide (`SModel` in `src/routes/index.tsx`, ~line 1079) has 3 sliders (Members, ARPU, Monthly OPEX) and a fixed `CAPEX_TOTAL_M = 10400`. Payback and the scenario readout hard-reference the 10.4B raise. Goal: add a 4th slider for CAPEX and recompute every dependent number live.

## Changes (single file: `src/routes/index.tsx`)

### 1. Add CAPEX to BASE + state
- Extend `BASE` to `{ members: 380, arpu: 1.15, opex: 279, capex: 10400 }`.
- Add `const [capex, setCapex] = useState(BASE.capex)`.
- Include `capex` in `reset()`.

### 2. Add 4th slider
- In the slider grid, add:
  `<ModelInput label="CAPEX RAISE" unit="IDR M" value={capex} min={6000} max={15000} step={100} base={BASE.capex} onChange={setCapex} />`
- Grid already uses `auto-fit minmax(240px, 1fr)` — 4 cards flow responsively.

### 3. Rebalance all derived metrics off the live `capex`
- `paybackMo = noi > 0 ? capex / noi : Infinity` (replaces `CAPEX_TOTAL_M`).
- Add a new stat card: `CAPEX` showing `IDR {(capex/1000).toFixed(2)}B` with delta vs base.
- Add 5-Yr CAPEX Multiple stat: `(annualNOI * 5) / capex` shown as `{x.toFixed(2)}×`.
- Update the SCENARIO READOUT sentence: replace the hard-coded "IDR 10.4B raise" with `IDR {(capex/1000).toFixed(2)}B raise`.

### 4. Keep the projection chart logic unchanged
The 12-month ramp depends only on members/arpu/opex — CAPEX changes only affect payback & multiple, which is the intended "everything that uses this number" surface inside the Live Model slide.

### 5. Hint
Update the on-slide hint text (if shown for this slide) to mention 4 sliders. (No `SLIDE_HINTS` entry currently exists for Live Model, so nothing to change there.)

## Out of scope
Other slides (CAPEX breakdown chart on slide 7, headline "IDR 8.2B raise" in root meta, FAQ copy) keep their static numbers — the Live Model is the sandbox; rewriting committed pitch figures elsewhere would misrepresent the deck. Confirm if you also want those rewired.
