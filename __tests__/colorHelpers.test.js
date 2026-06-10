/**
 * Property-Based Tests — UI Redesign Light Mode
 *
 * Menggunakan fast-check untuk memvalidasi invariant warna/style
 * yang harus berlaku untuk semua nilai input yang valid.
 *
 * Feature: ui-redesign-light-mode
 */

import * as fc from "fast-check";
import {
  getSaldoColor,
  getToggleStyle,
  getTransactionBadgeStyle,
  getAmountColor,
  shouldShowEmptyState,
} from "../lib/colorHelpers.js";

// ---------------------------------------------------------------------------
// Property 1: Saldo Negatif Selalu Ditandai Danger
// Validates: Requirements 4.6
// ---------------------------------------------------------------------------
describe("Property 1: getSaldoColor — Saldo Negatif Selalu Ditandai Danger", () => {
  test("nilai negatif selalu menghasilkan var(--color-danger)", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer({ min: -1_000_000_000, max: -1 }),
          fc.float({ min: -1e9, max: -Number.EPSILON, noNaN: true })
        ),
        (n) => getSaldoColor(n) === "var(--color-danger)"
      ),
      { numRuns: 200 }
    );
  });

  test("nilai nol selalu menghasilkan var(--color-primary)", () => {
    expect(getSaldoColor(0)).toBe("var(--color-primary)");
  });

  test("nilai positif selalu menghasilkan var(--color-primary)", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer({ min: 1, max: 1_000_000_000 }),
          fc.float({ min: Number.EPSILON, max: 1e9, noNaN: true })
        ),
        (n) => getSaldoColor(n) === "var(--color-primary)"
      ),
      { numRuns: 200 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 2: Toggle Button Active State Eksklusif
// Validates: Requirements 5.7, 5.8
// ---------------------------------------------------------------------------
describe("Property 2: getToggleStyle — Active State Eksklusif", () => {
  const TYPES = ["Pemasukan", "Pengeluaran"];

  test("saat type !== selectedType selalu background #FFFFFF", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...TYPES),
        fc.constantFrom(...TYPES),
        (type, selectedType) => {
          fc.pre(type !== selectedType);
          const style = getToggleStyle(type, selectedType);
          return (
            style.background === "#FFFFFF" &&
            style.border === "1px solid var(--color-border)"
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  test("saat type === selectedType style aktif diterapkan dengan benar", () => {
    fc.assert(
      fc.property(fc.constantFrom(...TYPES), (type) => {
        const style = getToggleStyle(type, type);
        if (type === "Pemasukan") {
          return (
            style.background === "rgba(16,185,129,0.1)" &&
            style.border === "1px solid rgba(16,185,129,0.4)" &&
            style.color === "var(--color-success)"
          );
        } else {
          return (
            style.background === "rgba(239,68,68,0.1)" &&
            style.border === "1px solid rgba(239,68,68,0.4)" &&
            style.color === "var(--color-danger)"
          );
        }
      }),
      { numRuns: 100 }
    );
  });

  test("tidak ada dua tombol aktif secara bersamaan ketika type berbeda", () => {
    fc.assert(
      fc.property(fc.constantFrom(...TYPES), (selectedType) => {
        const styles = TYPES.map((t) => ({
          type: t,
          style: getToggleStyle(t, selectedType),
        }));
        const activeCount = styles.filter(
          (s) => s.style.background !== "#FFFFFF"
        ).length;
        return activeCount === 1;
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 3: Badge Jenis Transaksi Konsisten dengan Nilai
// Validates: Requirements 6.3, 6.4
// ---------------------------------------------------------------------------
describe("Property 3: getTransactionBadgeStyle — Badge Konsisten", () => {
  test("Pemasukan selalu menghasilkan style success", () => {
    fc.assert(
      fc.property(fc.constant("Pemasukan"), (type) => {
        const style = getTransactionBadgeStyle(type);
        return (
          style.background === "rgba(16,185,129,0.12)" &&
          style.color === "var(--color-success)"
        );
      }),
      { numRuns: 100 }
    );
  });

  test("Pengeluaran selalu menghasilkan style danger", () => {
    fc.assert(
      fc.property(fc.constant("Pengeluaran"), (type) => {
        const style = getTransactionBadgeStyle(type);
        return (
          style.background === "rgba(239,68,68,0.12)" &&
          style.color === "var(--color-danger)"
        );
      }),
      { numRuns: 100 }
    );
  });

  test("setiap input valid menghasilkan output yang konsisten (idempoten)", () => {
    fc.assert(
      fc.property(fc.constantFrom("Pemasukan", "Pengeluaran"), (type) => {
        const result1 = getTransactionBadgeStyle(type);
        const result2 = getTransactionBadgeStyle(type);
        return (
          result1.background === result2.background &&
          result1.color === result2.color
        );
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4: Warna Nominal Konsisten dengan Jenis Transaksi
// Validates: Requirements 6.6
// ---------------------------------------------------------------------------
describe("Property 4: getAmountColor — Warna Nominal Konsisten", () => {
  test("Pemasukan selalu menghasilkan var(--color-success)", () => {
    fc.assert(
      fc.property(fc.constant("Pemasukan"), (type) => {
        return getAmountColor(type) === "var(--color-success)";
      }),
      { numRuns: 100 }
    );
  });

  test("Pengeluaran selalu menghasilkan var(--color-danger)", () => {
    fc.assert(
      fc.property(fc.constant("Pengeluaran"), (type) => {
        return getAmountColor(type) === "var(--color-danger)";
      }),
      { numRuns: 100 }
    );
  });

  test("tidak ada transaksi Pemasukan yang menggunakan warna danger", () => {
    fc.assert(
      fc.property(fc.constant("Pemasukan"), (type) => {
        return getAmountColor(type) !== "var(--color-danger)";
      }),
      { numRuns: 100 }
    );
  });

  test("tidak ada transaksi Pengeluaran yang menggunakan warna success", () => {
    fc.assert(
      fc.property(fc.constant("Pengeluaran"), (type) => {
        return getAmountColor(type) !== "var(--color-success)";
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 5: Empty State Muncul Tepat Saat Data Kosong
// Validates: Requirements 6.9
// ---------------------------------------------------------------------------
describe("Property 5: shouldShowEmptyState — Empty State Logic", () => {
  const transactionArb = fc.record({
    id: fc.string({ minLength: 1, maxLength: 36 }),
    transaction_date: fc.string({ minLength: 10, maxLength: 10 }),
    company_name: fc.constantFrom(
      "Santrikita Foundation",
      "PT Rakkita",
      "PT Penakita",
      "PT Madraskita"
    ),
    transaction_type: fc.constantFrom("Pemasukan", "Pengeluaran"),
    amount: fc.integer({ min: 1, max: 1_000_000_000 }),
    description: fc.option(fc.string(), { nil: undefined }),
  });

  test("array kosong selalu menampilkan empty state", () => {
    expect(shouldShowEmptyState([])).toBe(true);
  });

  test("array dengan N transaksi tidak pernah menampilkan empty state", () => {
    fc.assert(
      fc.property(
        fc.array(transactionArb, { minLength: 1, maxLength: 50 }),
        (transactions) => shouldShowEmptyState(transactions) === false
      ),
      { numRuns: 200 }
    );
  });

  test("empty state konsisten: shouldShowEmptyState(arr) === (arr.length === 0)", () => {
    fc.assert(
      fc.property(
        fc.array(transactionArb, { minLength: 0, maxLength: 50 }),
        (transactions) =>
          shouldShowEmptyState(transactions) === (transactions.length === 0)
      ),
      { numRuns: 200 }
    );
  });
});
