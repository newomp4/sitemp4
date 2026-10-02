import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import PhotoGrid from "../app/gallery/PhotoGrid";

const photos = [{
  src: { src: "/test.jpg", width: 1818, height: 1228 },
  alt: "Test photo",
}];

test("gallery restores focus only after the photo tile is visible and the modal is removed", async () => {
  render(<PhotoGrid photos={photos} />);
  const tile = screen.getByRole("button", { name: "Open photo 1: Test photo" });
  tile.focus();
  fireEvent.click(tile);
  await waitFor(() => expect(document.querySelector("dialog")?.open).toBe(true));

  const states: { lifted: boolean; modalPresent: boolean }[] = [];
  vi.spyOn(tile, "focus").mockImplementation((options) => {
    states.push({
      lifted: tile.hasAttribute("data-lifted"),
      modalPresent: document.querySelector("dialog") !== null,
    });
    HTMLElement.prototype.focus.call(tile, options);
  });
  fireEvent(document.querySelector("dialog")!, new Event("cancel", { cancelable: true }));

  await waitFor(() => expect(document.querySelector("dialog")).toBeNull());
  expect(states).toEqual([{ lifted: false, modalPresent: false }]);
  expect(document.activeElement).toBe(tile);
});

test("unmounting the gallery does not try to focus its removed tile", async () => {
  const { unmount } = render(<PhotoGrid photos={photos} />);
  const tile = screen.getByRole("button", { name: "Open photo 1: Test photo" });
  fireEvent.click(tile);
  await waitFor(() => expect(document.querySelector("dialog")?.open).toBe(true));
  const focus = vi.spyOn(tile, "focus");

  unmount();

  expect(focus).not.toHaveBeenCalled();
  expect(document.documentElement.style.overflow).toBe("");
});
