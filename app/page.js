"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  HiArrowTrendingUp, HiArrowTrendingDown, HiBanknotes,
  HiPlus, HiArrowPath, HiTrash, HiPencil, HiXMark,
} from "react-icons/hi2";

const COMPANIES = ["Santrikita Foundation", "PT Rakkita", "PT Penakita", "PT Madraskita"];

const fmtRp = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n || 0);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

const EMPTY_FORM = {
  transaction_date: new Date().toISOString().split("T")[0],
  company_name: COMPANIES[0],
  transaction_type: "Pemasukan",
  amount: "",
  description: "",
};

/* ── Shared style helpers ──────────────────────────────── */
const cardStyle = (accentColor) => ({
  background: "#fff",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: "20px 22px",
  boxShadow: "var(--shadow-sm)",
  borderTop: `3px solid ${accentColor}`,
});

const iconBox = (bg) => ({
  width: 36, height: 36, borderRadius: 10,
  background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
});

const sectionCard = {
  background: "#fff", border: "1px solid var(--border)",
  borderRadius: 20, boxShadow: "var(--shadow-sm)", padding: "22px 24px",
};

const labelStyle = {
  display: "block", fontSize: "0.8125rem", fontWeight: 500,
  color: "var(--text-secondary)", marginBottom: 6,
};

const toggleStyle = (active, color, bg) => ({
  flex: 1, padding: "10px 0", borderRadius: 10, fontWeight: 600,
  fontSize: "0.875rem", cursor: "pointer",
  border: `1.5px solid ${active ? color : "var(--border)"}`,
  background: active ? bg : "var(--bg-input)",
  color: active ? color : "var(--text-muted)",
  transition: "all 0.18s",
});

/* ══════════════════════════════════════════════════════════
   EDIT MODAL COMPONENT
   ══════════════════════════════════════════════════════════ */
function EditModal({ tx, onClose, onSave }) {
  const [form, setForm] = useState({
    transaction_date: tx.transaction_date,
    company_name: tx.company_name,
    transaction_type: tx.transaction_type,
    amount: String(tx.amount),
    description: tx.description || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.amount || Number(form.amount) <= 0) return;
    setSaving(true);
    await onSave(tx.id, form);
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box animate-fadeInUp">
        {/* Header */}
        <div className="modal-header">
          <h2 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)" }}>
            ✏️ Edit Transaksi
          </h2>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: "6px 10px" }}>
            <HiXMark style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="form-grid" style={{ marginTop: 4 }}>
            <div>
              <label style={labelStyle}>Tanggal</label>
              <input type="date" value={form.transaction_date}
                onChange={(e) => setForm({ ...form, transaction_date: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Entitas Perusahaan</label>
              <select value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}>
                {COMPANIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Jenis Transaksi</label>
              <div style={{ display: "flex", gap: 10 }}>
                {["Pemasukan", "Pengeluaran"].map((t) => {
                  const active = form.transaction_type === t;
                  const color = t === "Pemasukan" ? "var(--green-text)" : "var(--red-text)";
                  const bg    = t === "Pemasukan" ? "var(--green-bg)" : "var(--red-bg)";
                  return (
                    <button key={t} type="button"
                      onClick={() => setForm({ ...form, transaction_type: t })}
                      style={toggleStyle(active, color, bg)}>
                      {t === "Pemasukan" ? "↑ " : "↓ "}{t}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Nominal (Rp)</label>
              <input type="number" value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Contoh: 500000" min="1" />
            </div>
          </div>
          <div style={{ marginTop: 0, marginBottom: 4 }}>
            <label style={labelStyle}>Keterangan</label>
            <textarea value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detail transaksi (opsional)..." rows={2} />
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-ghost">Batal</button>
          <button onClick={handleSave} className="btn btn-primary" disabled={saving} style={{ minWidth: 120 }}>
            {saving ? "Menyimpan..." : "💾 Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */
export default function Home() {
  const [isAuth,      setIsAuth]      = useState(false);
  const [password,    setPassword]    = useState("");
  const [authErr,     setAuthErr]     = useState("");
  const [transactions,setTransactions]= useState([]);
  const [loading,     setLoading]     = useState(true);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [submitting,  setSubmitting]  = useState(false);
  const [toast,       setToast]       = useState(null);
  const [filter,      setFilter]      = useState("Semua");
  const [editTx,      setEditTx]      = useState(null); // transaksi yang sedang diedit

  /* ── Toast helper ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Fetch data ── */
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions").select("*").order("created_at", { ascending: false });
    if (error) showToast("Gagal mengambil data", "error");
    else setTransactions(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuth) return;
    fetchTransactions();
    const ch = supabase.channel("tx-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, fetchTransactions)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [isAuth, fetchTransactions]);

  /* ── Kalkulasi saldo ── */
  const list     = filter === "Semua" ? transactions : transactions.filter((t) => t.company_name === filter);
  const totalIn  = transactions.filter((t) => t.transaction_type === "Pemasukan").reduce((s,t) => s+Number(t.amount), 0);
  const totalOut = transactions.filter((t) => t.transaction_type === "Pengeluaran").reduce((s,t) => s+Number(t.amount), 0);
  const saldo    = totalIn - totalOut;

  /* ── Handlers ── */
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_MASTER_PASSWORD) { setIsAuth(true); setAuthErr(""); }
    else setAuthErr("Password salah!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) { showToast("Nominal harus lebih dari 0", "error"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("transactions").insert([{
      transaction_date: form.transaction_date,
      company_name:     form.company_name,
      transaction_type: form.transaction_type,
      amount:           Number(form.amount),
      description:      form.description,
    }]);
    if (error) showToast("Gagal: " + error.message, "error");
    else { showToast("Transaksi disimpan ✅"); setForm(EMPTY_FORM); }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus transaksi ini?")) return;
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) showToast("Gagal hapus", "error");
    else showToast("Terhapus");
  };

  /* ── Handler Edit: dipanggil dari EditModal ── */
  const handleEditSave = async (id, updatedForm) => {
    const { error } = await supabase.from("transactions").update({
      transaction_date: updatedForm.transaction_date,
      company_name:     updatedForm.company_name,
      transaction_type: updatedForm.transaction_type,
      amount:           Number(updatedForm.amount),
      description:      updatedForm.description,
    }).eq("id", id);
    if (error) showToast("Gagal update: " + error.message, "error");
    else { showToast("Transaksi diperbarui ✅"); setEditTx(null); }
  };

  /* ════════════════════════════════════════════
     LOGIN SCREEN
     ════════════════════════════════════════════ */
  if (!isAuth) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, background: "linear-gradient(135deg,#EEF2FF,#E0E7FF,#F0F4FF)",
      }}>
        <div className="glass-login animate-fadeInUp" style={{ width: "100%", maxWidth: 380, borderRadius: 24, padding: 36 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#4F46E5,#818CF8)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <HiBanknotes style={{ width: 28, height: 28, color: "#fff" }} />
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }} className="gradient-text">DompetKita</h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: 4 }}>Pencatatan Keuangan Internal</p>
          </div>
          <form onSubmit={handleLogin}>
            <label style={labelStyle}>Master Password</label>
            <input id="login-password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password..."
              style={{ marginBottom: 12 }} />
            {authErr && <p style={{ color: "var(--red)", fontSize: "0.8125rem", marginBottom: 10 }}>{authErr}</p>}
            <button id="login-submit" type="submit" className="btn btn-primary" style={{ width: "100%", padding: "12px 0", marginTop: 4 }}>
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════
     MAIN APP
     ════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>

      {/* Edit Modal */}
      {editTx && (
        <EditModal
          tx={editTx}
          onClose={() => setEditTx(null)}
          onSave={handleEditSave}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="toast">
          <div style={{
            padding: "12px 18px", borderRadius: 12, fontSize: "0.875rem",
            fontWeight: 600, color: "#fff", boxShadow: "var(--shadow-lg)",
            background: toast.type === "error" ? "var(--red)" : "var(--green)",
          }}>
            {toast.msg}
          </div>
        </div>
      )}

      <div className="page-wrap">

        {/* ── HEADER ── */}
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          className="animate-fadeInUp">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#4F46E5,#818CF8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HiBanknotes style={{ width: 20, height: 20, color: "#fff" }} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.125rem", fontWeight: 700 }} className="gradient-text">DompetKita</h1>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 1 }}>Santrikita Foundation</p>
            </div>
          </div>
          <button id="btn-logout" onClick={() => setIsAuth(false)} className="btn btn-ghost"
            style={{ fontSize: "0.8125rem", padding: "8px 16px" }}>
            Keluar
          </button>
        </header>

        {/* ── SUMMARY CARDS ── */}
        <div className="summary-grid animate-fadeInUp">
          {/* Pemasukan */}
          <div style={cardStyle("var(--green)")}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <p style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-secondary)" }}>Total Pemasukan</p>
              <div style={iconBox("var(--green-bg)")}>
                <HiArrowTrendingUp style={{ width: 17, height: 17, color: "var(--green-text)" }} />
              </div>
            </div>
            <p style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--green-text)" }}>{fmtRp(totalIn)}</p>
          </div>

          {/* Pengeluaran */}
          <div style={cardStyle("var(--red)")}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <p style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-secondary)" }}>Total Pengeluaran</p>
              <div style={iconBox("var(--red-bg)")}>
                <HiArrowTrendingDown style={{ width: 17, height: 17, color: "var(--red-text)" }} />
              </div>
            </div>
            <p style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--red-text)" }}>{fmtRp(totalOut)}</p>
          </div>

          {/* Sisa Saldo */}
          <div style={cardStyle(saldo >= 0 ? "var(--brand)" : "var(--red)")}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <p style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-secondary)" }}>Sisa Saldo Kas</p>
              <div style={iconBox("var(--brand-bg)")}>
                <HiBanknotes style={{ width: 17, height: 17, color: "var(--brand)" }} />
              </div>
            </div>
            <p style={{ fontSize: "1.375rem", fontWeight: 700, color: saldo >= 0 ? "var(--brand)" : "var(--red-text)" }}>
              {fmtRp(saldo)}
            </p>
          </div>
        </div>

        {/* ── FORM INPUT ── */}
        <div style={sectionCard} className="animate-fadeInUp">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <HiPlus style={{ width: 18, height: 18, color: "var(--brand)" }} />
            <h2 style={{ fontSize: "1rem", fontWeight: 600 }}>Input Transaksi Baru</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Tanggal */}
              <div>
                <label style={labelStyle}>Tanggal</label>
                <input id="input-date" type="date" value={form.transaction_date}
                  onChange={(e) => setForm({ ...form, transaction_date: e.target.value })} required />
              </div>
              {/* Perusahaan */}
              <div>
                <label style={labelStyle}>Entitas Perusahaan</label>
                <select id="input-company" value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}>
                  {COMPANIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              {/* Jenis */}
              <div>
                <label style={labelStyle}>Jenis Transaksi</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Pemasukan", "Pengeluaran"].map((t) => {
                    const active = form.transaction_type === t;
                    const color  = t === "Pemasukan" ? "var(--green-text)" : "var(--red-text)";
                    const bg     = t === "Pemasukan" ? "var(--green-bg)"   : "var(--red-bg)";
                    return (
                      <button key={t} type="button" id={`btn-type-${t.toLowerCase()}`}
                        onClick={() => setForm({ ...form, transaction_type: t })}
                        style={toggleStyle(active, color, bg)}>
                        {t === "Pemasukan" ? "↑ " : "↓ "}{t}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Nominal */}
              <div>
                <label style={labelStyle}>Nominal (Rp)</label>
                <input id="input-amount" type="number" value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Contoh: 500000" min="1" required />
              </div>
            </div>

            {/* Keterangan */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Keterangan</label>
              <textarea id="input-description" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Detail transaksi (opsional)..." rows={2} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button id="btn-submit" type="submit" className="btn btn-primary" disabled={submitting} style={{ minWidth: 160 }}>
                {submitting
                  ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="animate-spin" style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block" }} />
                      Menyimpan...
                    </span>
                  : "💾 Simpan Transaksi"}
              </button>
            </div>
          </form>
        </div>

        {/* ── RIWAYAT MUTASI ── */}
        <div style={sectionCard} className="animate-fadeInUp">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <HiArrowPath style={{ width: 18, height: 18, color: "var(--brand)" }} />
              <h2 style={{ fontSize: "1rem", fontWeight: 600 }}>Riwayat Mutasi</h2>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "2px 10px", borderRadius: 999, background: "var(--brand-bg)", color: "var(--brand)" }}>
                {list.length}
              </span>
            </div>
            <select id="filter-company" value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ maxWidth: 210, fontSize: "0.875rem" }}>
              <option value="Semua">Semua Perusahaan</option>
              {COMPANIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* State: loading */}
          {loading ? (
            <div style={{ padding: "44px 0", textAlign: "center" }}>
              <div className="animate-spin" style={{ width: 32, height: 32, border: "3px solid #E0E7FF", borderTop: "3px solid var(--brand)", borderRadius: "50%", margin: "0 auto 12px" }} />
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Memuat data...</p>
            </div>
          ) : list.length === 0 ? (
            <div style={{ padding: "44px 0", textAlign: "center" }}>
              <p style={{ fontSize: "2.25rem", marginBottom: 10 }}>📭</p>
              <p style={{ color: "var(--text-muted)" }}>Belum ada data transaksi</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {list.map((t) => {
                const isIn = t.transaction_type === "Pemasukan";
                return (
                  <div key={t.id} className="history-row">
                    <span className="col-date">{fmtDate(t.transaction_date)}</span>
                    <span className={`badge badge-indigo col-company`}>{t.company_name}</span>
                    <span className={`badge ${isIn ? "badge-green" : "badge-red"} col-type`}>
                      {isIn ? "↑" : "↓"} {t.transaction_type}
                    </span>
                    <span className="col-amount" style={{ color: isIn ? "var(--green-text)" : "var(--red-text)" }}>
                      {fmtRp(t.amount)}
                    </span>
                    <span className="col-desc">{t.description || <span style={{ color: "var(--text-muted)" }}>—</span>}</span>
                    <div className="col-actions">
                      {/* Tombol Edit */}
                      <button onClick={() => setEditTx(t)} className="btn btn-ghost"
                        style={{ padding: "6px 10px" }} title="Edit">
                        <HiPencil style={{ width: 14, height: 14, color: "var(--brand)" }} />
                      </button>
                      {/* Tombol Hapus */}
                      <button onClick={() => handleDelete(t.id)} className="btn btn-danger"
                        style={{ padding: "6px 10px" }} title="Hapus">
                        <HiTrash style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <footer style={{ textAlign: "center", paddingBottom: 8 }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            © 2026 DompetKita — Santrikita Foundation
          </p>
        </footer>

      </div>
    </div>
  );
}
