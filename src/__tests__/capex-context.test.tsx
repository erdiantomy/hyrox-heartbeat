import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CapexProvider, useCapex } from "@/routes/index";

function Probe() {
  const ctx = useCapex();
  return (
    <div>
      <span data-testid="total">{ctx.totalM}</span>
      <span data-testid="cats">{ctx.capex.length}</span>
    </div>
  );
}

describe("CapexProvider", () => {
  it("renders and exposes a usable context without throwing", () => {
    expect(() =>
      render(
        <CapexProvider>
          <Probe />
        </CapexProvider>
      )
    ).not.toThrow();
  });

  it("provides a numeric total and non-empty categories", () => {
    const { getByTestId } = render(
      <CapexProvider>
        <Probe />
      </CapexProvider>
    );
    expect(Number(getByTestId("total").textContent)).toBeGreaterThan(0);
    expect(Number(getByTestId("cats").textContent)).toBeGreaterThan(0);
  });
});
