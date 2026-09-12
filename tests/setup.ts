import { createElement } from "react";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// Next's image network/optimization path is checked against the production server.
// DOM tests use a normal image and exercise the real interaction and Motion code.
vi.mock("next/image", () => ({
  default: (input: Record<string, unknown>) => {
    const props = { ...input };
    for (const key of ["fill", "preload", "unoptimized", "quality"]) delete props[key];
    return createElement("img", props);
  },
}));

class TestPointerEvent extends MouseEvent {
  readonly pointerType: string;
  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerType = init.pointerType ?? "mouse";
  }
}

beforeEach(() => {
  // jsdom lacks the native dialog methods; their browser behavior is covered
  // by the live checks. Keep this shim limited to the platform's open state.
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
  vi.stubGlobal("PointerEvent", TestPointerEvent);
  vi.stubGlobal("matchMedia", (query: string) => ({
    // A hybrid device with a mouse, touch, and reduced motion enabled.
    matches: query.includes("prefers-reduced-motion") || query === "(hover: hover)",
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return true; },
  }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
