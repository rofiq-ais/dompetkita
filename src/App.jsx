import { useState, useEffect, useCallback } from 'react';

const COMPANIES = ['Santrikita Foundation', 'PT Rakkita', 'PT Penakita', 'PT Madraskita'];
const MASTER_PW = import.meta.env.VITE_MASTER_PASSWORD || 'dompetkita2026';
const EMPTY     = {
  transaction_date: new Date().toISOString().split('T')[0],
  company_name: COMPANIES[0],
  transaction_type: 'Pemasukan',
  amount: '',
  description: '',
};

const fmtRp   = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0);
const fmtDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

/* ── Reusable toggle button ── */
function TypeToggle({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {['Pemasukan', 'Pengeluaran'].map((t) => {
        const active = value === t;
        const color  = t === 'Pemasukan' ? 'var(--green-text)' : 'var(--red-text)';
        const bg     = t === 'Pemasukan' ? 'var(--green-bg)'   : 'var(--red-bg)';
        return (
          <button key={t} type="button"
            onClick={() => onChange(t)}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 10, fontWeight: 600,
              fontSize: '0.875rem', cursor: 'pointer',
              border: `1.5px solid ${active ? color : 'var(--border)'}`,
              background: active ? bg : 'var(--bg-input)',
              color: active ? color : 'var(--text-muted)',
              transition: 'all 0.18s',
            }}>
            {t === 'Pemasukan' ? '↑ ' : '↓ '}{t}
          </button>
        );
      })}
    </div>
  );
}

/* ── Edit Modal ── */
function EditModal({ tx, onClose, onSave }) {
  const [form, setForm] = useState({ ...tx, amount: String(tx.amount) });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.amount || Number(form.amount) <= 0) return;
    setSaving(true);
    await onSave(tx.id, form);
    setSaving(false);
  };

  const LBL = { display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>✏️ Edit Transaksi</h2>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '6px 10px' }}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div>
              <label style={LBL}>Tanggal</label>
              <input type="date" value={form.transaction_date}
                onChange={(e) => setForm({ ...form, transaction_date: e.target.value })} />
            </div>
            <div>
              <label style={LBL}>Perusahaan</label>
              <select value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}>
                {COMPANIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={LBL}>Jenis</label>
              <TypeToggle value={form.transaction_type} onChange={(v) => setForm({ ...form, transaction_type: v })} />
            </div>
            <div>
              <label style={LBL}>Nominal (Rp)</label>
              <input type="number" value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })} min="1" />
            </div>
          </div>
          <div style={{ marginBottom: 4 }}>
            <label style={LBL}>Keterangan</label>
            <textarea value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
              placeholder="Detail (opsional)..." />
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-ghost">Batal</button>
          <button onClick={save} className="btn btn-primary" disabled={saving} style={{ minWidth: 120 }}>
            {saving ? 'Menyimpan...' : '💾 Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════ */
export default function App() {
  const [isAuth,  setIsAuth]  = useState(false);
  const [pw,      setPw]      = useState('');
  const [authErr, setAuthErr] = useState('');
  const [txs,     setTxs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState(EMPTY);
  const [busy,    setBusy]    = useState(false);
  const [toast,   setToast]   = useState(null);
  const [filter,  setFilter]  = useState('Semua');
  const [editTx,  setEditTx]  = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTxs = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/transactions');
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setTxs(data);
    } catch (e) { showToast('Gagal mengambil data: ' + e.message, 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (isAuth) fetchTxs(); }, [isAuth, fetchTxs]);

  const list     = filter === 'Semua' ? txs : txs.filter((t) => t.company_name === filter);
  const totalIn  = txs.filter((t) => t.transaction_type === 'Pemasukan').reduce((s,t) => s + Number(t.amount), 0);
  const totalOut = txs.filter((t) => t.transaction_type === 'Pengeluaran').reduce((s,t) => s + Number(t.amount), 0);
  const saldo    = totalIn - totalOut;

  const handleLogin = (e) => {
    e.preventDefault();
    if (pw === MASTER_PW) { setIsAuth(true); setAuthErr(''); }
    else setAuthErr('Password salah!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) { showToast('Nominal harus > 0', 'error'); return; }
    setBusy(true);
    try {
      const r = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      showToast('Transaksi disimpan ✅');
      setForm(EMPTY);
      fetchTxs();
    } catch (e) { showToast('Gagal: ' + e.message, 'error'); }
    finally { setBusy(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus transaksi ini?')) return;
    try {
      const r = await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error((await r.json()).error);
      showToast('Terhapus');
      fetchTxs();
    } catch (e) { showToast('Gagal hapus: ' + e.message, 'error'); }
  };

  const handleEditSave = async (id, f) => {
    try {
      const r = await fetch(`/api/transactions?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, amount: Number(f.amount) }),
      });
      if (!r.ok) throw new Error((await r.json()).error);
      showToast('Diperbarui ✅');
      setEditTx(null);
      fetchTxs();
    } catch (e) { showToast('Gagal update: ' + e.message, 'error'); }
  };

  const LBL = { display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 };

  /* ── LOGIN ── */
  if (!isAuth) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'linear-gradient(135deg,#EEF2FF,#E0E7FF,#F0F4FF)' }}>
      <div className="glass-login" style={{ width: '100%', maxWidth: 380, borderRadius: 24, padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#4F46E5,#818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 28 }}>💰</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }} className="gradient-text">DompetKita</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>Pencatatan Keuangan Internal</p>
        </div>
        <form onSubmit={handleLogin}>
          <label style={LBL}>Master Password</label>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Masukkan password..." style={{ marginBottom: 12 }} />
          {authErr && <p style={{ color: 'var(--red)', fontSize: '0.8125rem', marginBottom: 10 }}>{authErr}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px 0', marginTop: 4 }}>Masuk</button>
        </form>
      </div>
    </div>
  );

  /* ── MAIN APP ── */
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>

      {editTx && <EditModal tx={editTx} onClose={() => setEditTx(null)} onSave={handleEditSave} />}

      {toast && (
        <div className="toast">
          <div style={{ padding: '12px 18px', borderRadius: 12, fontWeight: 600, color: '#fff', background: toast.type === 'error' ? 'var(--red)' : 'var(--green)', boxShadow: 'var(--shadow-lg)' }}>
            {toast.msg}
          </div>
        </div>
      )}

      <div className="page-wrap">

        {/* HEADER */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#4F46E5,#818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💰</div>
            <div>
              <h1 style={{ fontSize: '1.125rem', fontWeight: 700 }} className="gradient-text">DompetKita</h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1 }}>Santrikita Foundation</p>
            </div>
          </div>
          <button onClick={() => setIsAuth(false)} className="btn btn-ghost" style={{ fontSize: '0.8125rem', padding: '8px 16px' }}>Keluar</button>
        </header>

        {/* SUMMARY CARDS */}
        <div className="summary-grid">
          {[
            { label: 'Total Pemasukan',  val: totalIn,  color: 'var(--green)',    icon: '↑', textColor: 'var(--green-text)' },
            { label: 'Total Pengeluaran',val: totalOut, color: 'var(--red)',      icon: '↓', textColor: 'var(--red-text)'   },
            { label: 'Sisa Saldo Kas',   val: saldo,    color: saldo>=0?'var(--brand)':'var(--red)', icon: '💰', textColor: saldo>=0?'var(--brand)':'var(--red-text)' },
          ].map((c) => (
            <div key={c.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 22px', boxShadow: 'var(--shadow-sm)', borderTop: `3px solid ${c.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{c.label}</p>
                <span style={{ fontSize: '1.25rem' }}>{c.icon}</span>
              </div>
              <p style={{ fontSize: '1.375rem', fontWeight: 700, color: c.textColor }}>{fmtRp(c.val)}</p>
            </div>
          ))}
        </div>

        {/* FORM INPUT */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 20, boxShadow: 'var(--shadow-sm)', padding: '22px 24px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            ➕ Input Transaksi Baru
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label style={LBL}>Tanggal</label>
                <input type="date" value={form.transaction_date}
                  onChange={(e) => setForm({ ...form, transaction_date: e.target.value })} required />
              </div>
              <div>
                <label style={LBL}>Entitas Perusahaan</label>
                <select value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}>
                  {COMPANIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={LBL}>Jenis Transaksi</label>
                <TypeToggle value={form.transaction_type} onChange={(v) => setForm({ ...form, transaction_type: v })} />
              </div>
              <div>
                <label style={LBL}>Nominal (Rp)</label>
                <input type="number" value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Contoh: 500000" min="1" required />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={LBL}>Keterangan</label>
              <textarea value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Detail (opsional)..." rows={2} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={busy} style={{ minWidth: 160 }}>
                {busy ? 'Menyimpan...' : '💾 Simpan Transaksi'}
              </button>
            </div>
          </form>
        </div>

        {/* RIWAYAT */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 20, boxShadow: 'var(--shadow-sm)', padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              🔄 Riwayat Mutasi
              <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 10px', borderRadius: 999, background: 'var(--brand-bg)', color: 'var(--brand)' }}>{list.length}</span>
            </h2>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 210, fontSize: '0.875rem' }}>
              <option value="Semua">Semua Perusahaan</option>
              {COMPANIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {loading ? (
            <div style={{ padding: '44px 0', textAlign: 'center' }}>
              <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid #E0E7FF', borderTop: '3px solid var(--brand)', borderRadius: '50%', margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Memuat data...</p>
            </div>
          ) : list.length === 0 ? (
            <div style={{ padding: '44px 0', textAlign: 'center' }}>
              <p style={{ fontSize: '2.25rem', marginBottom: 10 }}>📭</p>
              <p style={{ color: 'var(--text-muted)' }}>Belum ada data transaksi</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {list.map((t) => {
                const isIn = t.transaction_type === 'Pemasukan';
                return (
                  <div key={t.id} className="history-row">
                    <span className="col-date">{fmtDate(t.transaction_date)}</span>
                    <span className="badge badge-indigo col-company">{t.company_name}</span>
                    <span className={`badge ${isIn ? 'badge-green' : 'badge-red'} col-type`}>{isIn ? '↑' : '↓'} {t.transaction_type}</span>
                    <span className="col-amount" style={{ color: isIn ? 'var(--green-text)' : 'var(--red-text)' }}>{fmtRp(t.amount)}</span>
                    <span className="col-desc">{t.description || <span style={{ color: 'var(--text-muted)' }}>—</span>}</span>
                    <div className="col-actions">
                      <button onClick={() => setEditTx(t)} className="btn btn-ghost" style={{ padding: '6px 10px' }} title="Edit">✏️</button>
                      <button onClick={() => handleDelete(t.id)} className="btn btn-danger" style={{ padding: '6px 10px' }} title="Hapus">🗑️</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <footer style={{ textAlign: 'center', paddingBottom: 8 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>© 2026 DompetKita — Santrikita Foundation</p>
        </footer>

      </div>
    </div>
  );
}
