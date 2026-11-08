import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import ToolsList from "../app/tools/ToolsList";

test("a paid app opens its own site without a source link", () => {
  render(<ToolsList />);
  const petal = screen.getByRole("button", { name: /Petal.*Paid/ });
  fireEvent.click(petal);
  const details = screen.getByRole("region", { name: "Petal" });
  expect(details.hasAttribute("inert")).toBe(false);
  expect(within(details).getByRole("link", { name: "Visit Petal" }).getAttribute("href"))
    .toBe("https://petal.bar");
  expect(within(details).queryByRole("link", { name: "Source" })).toBeNull();
});

test("a free app opens its own site and is not announced as paid", () => {
  render(<ToolsList />);
  const id4 = screen.getByRole("button", { name: /ID4.*Free/ });
  expect(id4.textContent).not.toContain("Paid");
  fireEvent.click(id4);
  const details = screen.getByRole("region", { name: "ID4" });
  expect(details.hasAttribute("inert")).toBe(false);
  expect(within(details).getByRole("link", { name: "Visit ID4" }).getAttribute("href"))
    .toBe("https://polyviral.org/id4");
  expect(within(details).queryByRole("link", { name: "Source" })).toBeNull();
});

test("tool navigation follows keyboard focus even when the pointer is over another row", () => {
  render(<ToolsList />);
  const petal = screen.getByRole("button", { name: /Petal/ });
  const id4 = screen.getByRole("button", { name: /ID4/ });
  const last = screen.getByRole("button", { name: /mok/ });
  petal.focus();
  fireEvent.pointerEnter(last, { pointerType: "mouse" });
  fireEvent.keyDown(petal, { key: "ArrowDown" });
  expect(document.activeElement).toBe(id4);
  expect(id4.getAttribute("aria-expanded")).toBe("true");
  fireEvent.keyDown(id4, { key: "End" });
  expect(document.activeElement).toBe(last);
  fireEvent.keyDown(last, { key: "ArrowDown" });
  expect(document.activeElement).toBe(petal);
  fireEvent.keyDown(petal, { key: "ArrowUp" });
  expect(document.activeElement).toBe(last);
  fireEvent.keyDown(last, { key: "Home" });
  expect(document.activeElement).toBe(petal);
  expect(screen.getAllByRole("button", { expanded: true })).toHaveLength(1);
});

test("Escape returns focus from detail links before closing the tool", () => {
  render(<ToolsList />);
  const petal = screen.getByRole("button", { name: /Petal/ });
  fireEvent.click(petal);
  const link = screen.getByRole("link", { name: "Visit Petal" });
  link.focus();
  fireEvent.keyDown(link, { key: "Escape" });
  expect(document.activeElement).toBe(petal);
  expect(petal.getAttribute("aria-expanded")).toBe("false");
  expect(document.getElementById(petal.getAttribute("aria-controls")!)?.hasAttribute("inert")).toBe(true);
});

test("arrow keys preserve normal scrolling outside tool buttons", () => {
  render(<ToolsList />);
  const back = screen.getByRole("link", { name: "Back to home" });
  back.focus();
  expect(fireEvent.keyDown(back, { key: "ArrowDown" })).toBe(true);
  expect(document.activeElement).toBe(back);
  expect(screen.queryAllByRole("button", { expanded: true })).toHaveLength(0);
  fireEvent.click(screen.getByRole("button", { name: /Petal/ }));
  const link = screen.getByRole("link", { name: "Visit Petal" });
  link.focus();
  expect(fireEvent.keyDown(link, { key: "ArrowDown" })).toBe(true);
  expect(document.activeElement).toBe(link);
});
