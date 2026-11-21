import test from "node:test";
import assert from "node:assert/strict";
import { checkSpots, MAX_SPOTS_PER_CLASS } from "../src/rules/bookingRules.js";

test("accepts an ordinary quantity", () => {
  assert.equal(checkSpots(2, 10).ok, true);
});

test("accepts exactly the maximum of 4 spots", () => {
  assert.equal(MAX_SPOTS_PER_CLASS, 4);
  assert.equal(checkSpots(4, 10).ok, true);
});

test("rejects 5 spots (one above the limit)", () => {
  const result = checkSpots(5, 10);
  assert.equal(result.ok, false);
  assert.match(result.message, /at most 4/);
});

test("rejects more spots than seats left", () => {
  const result = checkSpots(3, 2);
  assert.equal(result.ok, false);
  assert.match(result.message, /Only 2 spots left/);
});

test("rejects 0 spots and a full class", () => {
  assert.equal(checkSpots(0, 10).ok, false);
  assert.equal(checkSpots(1, 0).ok, false);
});
