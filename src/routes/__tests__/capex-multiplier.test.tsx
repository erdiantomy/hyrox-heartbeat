import { describe, it, expect } from "vitest";
import { act } from "react";
import { render } from "@testing-library/react";
import { CapexProvider, useCapex } from "@/routes/index";

type Ctx = ReturnType<typeof useCapex>;

function Capture({ onReady }: { onReady: (ctx: Ctx) => void }) {
  const ctx = useCapex();
  onReady(ctx);
  return (
    <div>
      <span data-testid="total">{ctx.totalM}</span>
    </div>
  );
}

function sumAll(ctx: Ctx) {
  return ctx.capex.reduce((s, c) => s + c.items.reduce((a, b) => a + b.cost, 0), 0);
}

describe("CAPEX multiplier (scaleTotalTo)", () => {
  it("rescales every line item and keeps total consistent", () => {
    let ctx: Ctx | null = null;
    render(
      <CapexProvider>
        <Capture onReady={(c) => { ctx = c; }} />
      </CapexProvider>
    );
    expect(ctx).not.toBeNull();

    const baseTotal = ctx!.totalM;
    const baseItems = ctx!.capex.flatMap(c => c.items.map(it => it.cost));
    expect(baseTotal).toBeGreaterThan(0);
    expect(baseTotal).toBe(sumAll(ctx!));

    const newTotal = Math.round(baseTotal * 1.5);
    act(() => { ctx!.scaleTotalTo(newTotal); });

    // total recomputes from items — should be within rounding tolerance
    const scaledTotal = ctx!.totalM;
    expect(scaledTotal).toBe(sumAll(ctx!));
    expect(Math.abs(scaledTotal - newTotal)).toBeLessThanOrEqual(ctx!.capex.length * 4);

    // every item scaled by ~1.5 (rounded, non-negative integers)
    const scaledItems = ctx!.capex.flatMap(c => c.items.map(it => it.cost));
    expect(scaledItems.length).toBe(baseItems.length);
    scaledItems.forEach((cost, i) => {
      expect(cost).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(cost)).toBe(true);
      const expected = Math.round(baseItems[i] * 1.5);
      expect(Math.abs(cost - expected)).toBeLessThanOrEqual(1);
    });
  });

  it("ignores invalid multipliers (0, negative, NaN)", () => {
    let ctx: Ctx | null = null;
    render(
      <CapexProvider>
        <Capture onReady={(c) => { ctx = c; }} />
      </CapexProvider>
    );
    const before = ctx!.capex.flatMap(c => c.items.map(it => it.cost));
    act(() => { ctx!.scaleTotalTo(0); });
    act(() => { ctx!.scaleTotalTo(-100); });
    act(() => { ctx!.scaleTotalTo(NaN); });
    const after = ctx!.capex.flatMap(c => c.items.map(it => it.cost));
    expect(after).toEqual(before);
  });
});
