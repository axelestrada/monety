
import { expect, test } from "@jest/globals";

import calculateOffset from "./calculateOffset";

test("El resultado de 0 y 100 debe dar 10", () => {
  expect(calculateOffset(100, 0)).toBe(10);
});

test("El resultado de 500 y 600 debe dar 60", () => {
  expect(calculateOffset(600, 500)).toBe(60);
});

test("El resultado de 500 y 1000 debe dar 50", () => {
  expect(calculateOffset(1000, 500)).toBe(100);
});

test('El resultado de 500 y 500 debe dar 3', () => {
  expect(calculateOffset(500, 500)).toBe(50)
});

test('El resultado de 10 y 20 debe dar 3', () => {
  expect(calculateOffset(20, 10)).toBe(3)
});