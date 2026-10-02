import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import ToolsList from "../app/tools/ToolsList";

test("the paid tool opens a purchase destination without a source link", () => {
  render(<ToolsList />);
  const petal = screen.getByRole("button", { name: /petal.bar.*Paid/ });
  fireEvent.click(petal);
  const details = screen.getByRole("region", { name: "petal.bar" });
  expect(details.hasAttribute("inert")).toBe(false);
  expect(within(details).getByRole("link", { name: "Visit petal.bar" }).getAttribute("href"))
    .toBe("https://petal.bar");
  expect(within(details).queryByRole("link", { name: "Source" })).toBeNull();
});

test("tool navigation follows keyboard focus even when the pointer is over another row", () => {
  render(<ToolsList />);
  const petal = screen.getByRole("button", { name: /petal.bar/ });
  const twitch = screen.getByRole("button", { name: /twitchsim/ });
  const last = screen.getByRole("button", { name: /ID4/ });
  petal.focus();
  fireEvent.pointerEnter(last, { pointerType: "mouse" });
  fireEvent.keyDown(petal, { key: "ArrowDown" });
  expect(document.activeElement).toBe(twitch);
  expect(twitch.getAttribute("aria-expanded")).toBe("true");
  fireEvent.keyDown(twitch, { key: "End" });
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
  const petal = screen.getByRole("button", { name: /petal.bar/ });
  fireEvent.click(petal);
  const link = screen.getByRole("link", { name: "Visit petal.bar" });
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
  fireEvent.click(screen.getByRole("button", { name: /petal.bar/ }));
  const link = screen.getByRole("link", { name: "Visit petal.bar" });
  link.focus();
  expect(fireEvent.keyDown(link, { key: "ArrowDown" })).toBe(true);
  expect(document.activeElement).toBe(link);
});
