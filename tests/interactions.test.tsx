import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import NamePortrait from "../app/NamePortrait";
import AgeTicker from "../app/AgeTicker";
import FoldRow from "../app/FoldRow";
import PhotoGrid from "../app/photos/PhotoGrid";
import CopyHandle from "../app/copy-handle";

function tap(element: HTMLElement) {
  fireEvent.pointerDown(element, { pointerType: "touch" });
  fireEvent.pointerUp(element, { pointerType: "touch" });
  fireEvent.click(element, { detail: 1 });
}

test("portrait toggles once per touch on a device that also supports mouse hover", () => {
  render(<NamePortrait>Owen</NamePortrait>);
  const name = screen.getByRole("button", { name: "Owen" });
  tap(name);
  expect(name.getAttribute("aria-expanded")).toBe("true");
  tap(name);
  expect(name.getAttribute("aria-expanded")).toBe("false");
});

test("portrait dismisses with Escape/outside input and can reopen without leaving the name", () => {
  render(<NamePortrait>Owen</NamePortrait>);
  const name = screen.getByRole("button", { name: "Owen" });
  fireEvent.pointerEnter(name, { pointerType: "mouse" });
  expect(name.getAttribute("aria-expanded")).toBe("true");
  fireEvent.keyDown(document, { key: "Escape" });
  expect(name.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(name, { detail: 1 });
  expect(name.getAttribute("aria-expanded")).toBe("true");
  fireEvent.pointerDown(document.body);
  expect(name.getAttribute("aria-expanded")).toBe("false");
});

test("age supports repeated touch toggles on hybrid devices", () => {
  render(<AgeTicker birthday="2006-12-01T00:00:00-05:00">19</AgeTicker>);
  const age = screen.getByRole("button");
  tap(age);
  expect(age.getAttribute("aria-pressed")).toBe("true");
  tap(age);
  expect(age.getAttribute("aria-pressed")).toBe("false");
});

test("touch unfolds a linked chapter before navigation, while modifier clicks remain links", () => {
  // This case needs folded notes, rather than the always-visible reduced-motion notes.
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = (query) => ({ ...originalMatchMedia(query), matches: query === "(hover: hover)" });
  render(<ul><FoldRow hasLink years="2026" index={0} heading={<a href="#job">Job</a>} note={<p>Details</p>} /></ul>);
  const link = screen.getByRole("link", { name: "Job" });
  fireEvent.pointerDown(link, { pointerType: "touch" });
  expect(fireEvent.click(link, { detail: 1, ctrlKey: true })).toBe(true);
  expect(link.closest("li")?.getAttribute("data-open")).toBe("false");
  expect(fireEvent.click(link, { detail: 1 })).toBe(false);
  expect(link.closest("li")?.getAttribute("data-open")).toBe("true");
  expect(fireEvent.click(link, { detail: 1 })).toBe(true);
});

test("reduced-motion gallery closes completely and restores focus and scrolling", async () => {
  render(<PhotoGrid photos={[{ src: "/test.jpg", alt: "Test photo", caption: "A caption" }]} />);
  const tile = screen.getByRole("button", { name: "Open photo 1: Test photo" });
  fireEvent.click(tile);
  await waitFor(() => expect(document.querySelector("dialog")?.open).toBe(true));
  expect(document.documentElement.style.overflow).toBe("hidden");
  fireEvent.click(screen.getByRole("button", { name: "Close photo" }));
  await waitFor(() => expect(document.querySelector("dialog")).toBeNull());
  expect(document.activeElement).toBe(tile);
  expect(document.documentElement.style.overflow).toBe("");
});

test("gallery keyboard focus wraps, and unmount releases its scroll lock", async () => {
  const { unmount } = render(<PhotoGrid photos={[{
    src: "/test.jpg", alt: "Test photo", caption: <a href="#caption">Caption link</a>,
  }]} />);
  fireEvent.click(screen.getByRole("button", { name: "Open photo 1: Test photo" }));
  await waitFor(() => expect(document.querySelector("dialog")?.open).toBe(true));
  const close = screen.getByRole("button", { name: "Close photo" });
  close.focus();
  fireEvent.keyDown(close, { key: "Tab" });
  expect(document.activeElement).toBe(screen.getByRole("link", { name: "Caption link" }));
  unmount();
  expect(document.documentElement.style.overflow).toBe("");
});

test("Discord copy reports success only after the clipboard write succeeds", async () => {
  render(<CopyHandle label="Discord" handle="newomp4" />);
  const button = screen.getByRole("button", { name: /Copy Discord/ });
  fireEvent.click(button);
  await waitFor(() => expect(button.getAttribute("data-copied")).toBe("true"));
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith("newomp4");
});

test("blocked clipboard access exposes the handle instead of a false success", async () => {
  vi.mocked(navigator.clipboard.writeText).mockRejectedValue(new Error("Clipboard denied"));
  render(<CopyHandle label="Discord" handle="newomp4" />);
  const button = screen.getByRole("button", { name: /Copy Discord/ });
  fireEvent.click(button);
  expect(await screen.findByText("Copy this: newomp4")).toBeDefined();
  expect(button.getAttribute("data-copied")).toBe("false");
});
