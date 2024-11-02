import formatCurrency from "../formatCurrency";

test("Pasando 123 debe devolver L 123", () => {
  expect(formatCurrency(123)).toBe("L 123")
})

test("Pasando 0 debe devolver L 0", () => {
  expect(formatCurrency(0)).toBe("L 0")
})

test("Pasando -100 debe devolver -L 100", () => {
  expect(formatCurrency(-100)).toBe("-L 100")
})

test("Pasando 1567 debe devolver L 1,567", () => {
  expect(formatCurrency(1567)).toBe("L 1,567")
})

test("Pasando 1567.6 debe devolver L 1,567.60", () => {
  expect(formatCurrency(1567.6)).toBe("L 1,567.60")
})

test("Pasando 24580.45 debe devolver L 24,580.45", () => {
  expect(formatCurrency(24580.45)).toBe("L 24,580.45")
})