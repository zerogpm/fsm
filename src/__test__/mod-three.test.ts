import { modThree } from "../../src";

describe("modThree function functionality", () => {
  // Core functionality tests (examples from the exercise)
  // Example 1 from the exercise
  it("should calculate mod 3 of binary 110", () => {
    expect(modThree("110")).toBe(0);
  });
});
