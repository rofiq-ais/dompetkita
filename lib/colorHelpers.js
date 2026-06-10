/**
 * Color & Style Helper Functions — UI Redesign Light Mode
 *
 * Pure functions extracted for testability.
 * Used by page.js and property-based tests.
 */

/**
 * Menentukan warna nilai Sisa Saldo Kas.
 * @param {number} sisaSaldo
 * @returns {string} CSS variable string
 */
export const getSaldoColor = (sisaSaldo) =>
  sisaSaldo >= 0 ? "var(--color-primary)" : "var(--color-danger)";

/**
 * Menentukan style tombol toggle Pemasukan/Pengeluaran.
 * @param {"Pemasukan"|"Pengeluaran"} type - tipe tombol ini
 * @param {"Pemasukan"|"Pengeluaran"} selectedType - tipe yang sedang aktif
 * @returns {object} style object
 */
export const getToggleStyle = (type, selectedType) => {
  if (type !== selectedType) {
    return {
      background: "#FFFFFF",
      border: "1px solid var(--color-border)",
      color: "var(--color-text-secondary)",
    };
  }
  return type === "Pemasukan"
    ? {
        background: "rgba(16,185,129,0.1)",
        border: "1px solid rgba(16,185,129,0.4)",
        color: "var(--color-success)",
      }
    : {
        background: "rgba(239,68,68,0.1)",
        border: "1px solid rgba(239,68,68,0.4)",
        color: "var(--color-danger)",
      };
};

/**
 * Menentukan style badge berdasarkan jenis transaksi.
 * @param {"Pemasukan"|"Pengeluaran"} transactionType
 * @returns {object} style object
 */
export const getTransactionBadgeStyle = (transactionType) =>
  transactionType === "Pemasukan"
    ? { background: "rgba(16,185,129,0.12)", color: "var(--color-success)" }
    : { background: "rgba(239,68,68,0.12)", color: "var(--color-danger)" };

/**
 * Menentukan warna teks nominal berdasarkan jenis transaksi.
 * @param {"Pemasukan"|"Pengeluaran"} transactionType
 * @returns {string} CSS variable string
 */
export const getAmountColor = (transactionType) =>
  transactionType === "Pemasukan"
    ? "var(--color-success)"
    : "var(--color-danger)";

/**
 * Menentukan apakah empty state harus ditampilkan.
 * @param {Array} transactions
 * @returns {boolean}
 */
export const shouldShowEmptyState = (transactions) => transactions.length === 0;
