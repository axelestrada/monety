import formatCurrency from "../formatCurrency";

test("Pasando 123 debe devolver L 123", () => {
  expect(formatCurrency(123, {
    spacing: true
  })).toBe("L 123")
})

test("Pasando 123 debe devolver L123", () => {
  expect(formatCurrency(123)).toBe("L123")
})

test("Pasando 0 debe devolver L0", () => {
  expect(formatCurrency(0)).toBe("L0")
})

test("Pasando -100 debe devolver -L100", () => {
  expect(formatCurrency(-100)).toBe("-L100")
})

test("Pasando 1567 debe devolver L1,567", () => {
  expect(formatCurrency(1567)).toBe("L1,567")
})

test("Pasando 1567.6 debe devolver L1,567.60", () => {
  expect(formatCurrency(1567.6)).toBe("L1,567.60")
})

test("Pasando 24580.45 debe devolver L24,580.45", () => {
  expect(formatCurrency(24580.45)).toBe("L24,580.45")
})