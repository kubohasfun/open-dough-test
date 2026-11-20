import assert from "node:assert/strict";
import test from "node:test";
import { axisPositions, sumIntegers } from "./calculator.mjs";

test("adds signed integers", () => {
  assert.equal(sumIntegers(" 12 ", "-5"), "7");
  assert.equal(sumIntegers("-3", "-4"), "-7");
});

test("keeps large integer sums exact", () => {
  assert.equal(sumIntegers("9007199254740993", "7"), "9007199254741000");
});

test("rejects empty and non-integer input", () => {
  for (const invalid of ["", "1.5", "abc", "2e3"]) {
    assert.throws(() => sumIntegers(invalid, "2"), /valid integer/);
  }
});

test("places inputs and output on one numerical scale", () => {
  assert.deepEqual(axisPositions("-3", "5", "2"), {
    min: "-3", max: "5", percentages: [0, 100, 62.5],
  });
  assert.deepEqual(axisPositions("0", "0", "0"), {
    min: "-1", max: "1", percentages: [50, 50, 50],
  });
});

test("positions large integers without losing precision", () => {
  assert.deepEqual(axisPositions("9007199254740993", "7", "9007199254741000"), {
    min: "7", max: "9007199254741000", percentages: [99.9999, 0, 100],
  });
});
