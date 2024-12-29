import { describe, expect, test } from "@jest/globals";
import { formatDateRange } from "@/utils/formatDateRange";

describe("Intervalo por dia", () => {
  test("Debe mostrar el intervalo de fechas en formato 'MMMM DD YYYY'", () => {
    expect(
      formatDateRange({
        from: 1733464800,
        to: 1733551199,
        interval: "day",
      })
    ).toBe("December 06 2024");
  });
});

describe("Intervalo por semana", () => {
  test("Si es diferente año debe mostrar el formato 'MMM DD YYYY - MMM DD YYYY'", () => {
    expect(
      formatDateRange({
        from: 1735452000,
        to: 1736056799,
        interval: "week",
      })
    ).toBe("Dec 29 2024 - Jan 04 2025");
  });

  test("Si es diferente mes pero mismo año debe mostrar el formato 'MMM DD - MMM DD YYYY'", () => {
    expect(
      formatDateRange({
        from: 1730008800,
        to: 1730613599,
        interval: "week",
      })
    ).toBe("Oct 27 - Nov 02 2024");
  });

  test("Si es el mismo mes y año debe mostrar el formato 'MMM DD - DD YYYY'", () => {
    expect(
      formatDateRange({
        from: 1733032800,
        to: 1733637599,
        interval: "week",
      })
    ).toBe("Dec 01 - 07 2024");
  });
});

describe("Intervalo por mes", () => {
  test("Si es el mismo año que el año actual debe mostrar el formato 'MMMM'", () => {
    expect(
      formatDateRange({
        from: 1733032800,
        to: 1735711199,
        interval: "month",
      })
    ).toBe("December");
  });

  test("Si es diferente año al año actual debe mostrar el formato 'MMMM YYYY'", () => {
    expect(
      formatDateRange({
        from: 1735711200,
        to: 1738389599,
        interval: "month",
      })
    ).toBe("January 2025");
  });
});

describe("Intervalo por año", () => {
  test("Unicamente debe mostrar el año", () => {
    expect(
      formatDateRange({
        from: 1704088800,
        to: 1735711199,
        interval: "year",
      })
    ).toBe("2024");
  });
});

describe("Intervalo personalizado", () => {
  test("Si es diferente año debe mostrar el formato 'MMM DD YYYY - MMM DD YYYY'", () => {
    expect(
      formatDateRange({
        from: 1735452000,
        to: 1736056799,
        interval: "custom",
      })
    ).toBe("Dec 29 2024 - Jan 04 2025");
  });

  test("Si es diferente mes pero mismo año debe mostrar el formato 'MMM DD - MMM DD YYYY'", () => {
    expect(
      formatDateRange({
        from: 1730008800,
        to: 1730613599,
        interval: "custom",
      })
    ).toBe("Oct 27 - Nov 02 2024");
  });

  test("Si es el mismo mes y año debe mostrar el formato 'MMM DD - DD YYYY'", () => {
    expect(
      formatDateRange({
        from: 1733032800,
        to: 1733637599,
        interval: "custom",
      })
    ).toBe("Dec 01 - 07 2024");
  });

  test("Si es el mismo dia debe mostrar la fecha en formato 'MMMM DD YYYY'", () => {
    expect(
      formatDateRange({
        from: 1733464800,
        to: 1733551199,
        interval: "custom",
      })
    ).toBe("December 06 2024");
  });
});

describe("Intervalo 'all time'", () => {
  test("Debe mostrar 'All time'", () => {
    expect(
      formatDateRange({
        from: 0,
        to: 1733551199,
        interval: "all time",
      })
    ).toBe("All time");
  });
});
