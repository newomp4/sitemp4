import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { test } from "vitest";
import { ageAt } from "../lib/age.ts";
import { profile, path } from "../lib/content.ts";
import { fitPhoto } from "../lib/photo-layout.ts";

test("age advances on the birthday, without rounding up beforehand", () => {
  const birthday = Date.parse("2026-12-01T00:00:00-05:00");
  assert.equal(Math.floor(ageAt(profile.birthday, birthday - 1)), 19);
  assert.equal(ageAt(profile.birthday, birthday), 20);
  assert.ok(ageAt(profile.birthday, birthday + 1) > 20);
});

test("age handles leap years and invalid dates", () => {
  assert.equal(ageAt("2000-02-29T00:00:00Z", Date.parse("2024-02-29T00:00:00Z")), 24);
  assert.ok(Number.isNaN(ageAt("invalid", Date.now())));
  assert.ok(Number.isNaN(ageAt(profile.birthday, NaN)));
});

test("portrait and landscape photos, including their captions, fit supported viewport sizes", () => {
  for (const [width, height] of [[320, 568], [375, 812], [812, 375], [1024, 300], [1280, 720], [1920, 1080]]) {
    for (const ratio of [0.2, 0.66, 1, 1.5, 5]) {
      for (const hasCaption of [false, true]) {
        const box = fitPhoto(ratio, width, height, hasCaption);
        assert.ok(box.width > 0 && box.height > 0);
        assert.ok(box.left >= 0 && box.top >= 24);
        assert.ok(box.left + box.width <= width);
        assert.ok(box.top + box.height + (hasCaption ? 104 : 0) <= height);
        assert.ok(Math.abs(box.width / box.height - ratio) < 1e-10);
      }
    }
  }
});

test("resizing an open desktop photo to a phone produces a new visible target", () => {
  const desktop = fitPhoto(1.5, 1280, 720, true);
  const phone = fitPhoto(1.5, 375, 812, true);
  assert.ok(desktop.width > 375);
  assert.ok(phone.left + phone.width < 375);
  assert.ok(phone.width < desktop.width);
});

test("photos awaiting dimensions have a finite square fallback", () => {
  for (const ratio of [0, -1, NaN, Infinity]) {
    const box = fitPhoto(ratio, 375, 812, true);
    assert.equal(box.width, box.height);
    assert.ok(Object.values(box).every(Number.isFinite));
  }
});

test("every configured career logo and both profile photos exist", async () => {
  const assets = [...path.map(item => item.logo).filter(Boolean), "/photos/avatar.jpg", "/photos/owen-nyc.jpg"];
  await Promise.all(assets.map(asset => access(resolve("public", asset.slice(1)))));
});
