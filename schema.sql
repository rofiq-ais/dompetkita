-- Schema untuk Cloudflare D1 (SQLite)
CREATE TABLE IF NOT EXISTS transactions (
  id         TEXT    PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  created_at TEXT    NOT NULL    DEFAULT (datetime('now')),
  transaction_date TEXT NOT NULL,
  company_name     TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK(transaction_type IN ('Pemasukan', 'Pengeluaran')),
  amount           REAL NOT NULL CHECK(amount > 0),
  description      TEXT
);

CREATE INDEX IF NOT EXISTS idx_tx_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_company    ON transactions(company_name);
