import calculateStepValue from "./calculateStepValue";

test("El resultado de 0 y 100 debe dar 100 / 3", () => {
  expect(calculateStepValue(100, 0)).toBe(100 / 3);
});

test("El resultado de 500 y 600 debe dar 100 / 3", () => {
  expect(calculateStepValue(600, 500)).toBe(600 / 3);
});

test("El resultado de 500 y 1000 debe dar 500 / 3", () => {
  expect(calculateStepValue(1000, 500)).toBe(1000 / 3);
});

test("El resultado de 500 y 500 debe dar 3", () => {
  expect(calculateStepValue(500, 500)).toBe(500 / 3);
});

test("El resultado de 1 y 2 debe dar 3", () => {
  expect(calculateStepValue(2, 1)).toBe(10);
});
