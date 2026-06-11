/**
 * /functions/api/transactions.js
 * Cloudflare Pages Function — CRUD untuk tabel transactions (D1)
 */

// ── GET /api/transactions ──────────────────────────────────────────────────
export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB
      .prepare('SELECT * FROM transactions ORDER BY created_at DESC')
      .all();
    return Response.json(results);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

// ── POST /api/transactions ─────────────────────────────────────────────────
export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { transaction_date, company_name, transaction_type, amount, description } = body;

    if (!transaction_date || !company_name || !transaction_type || !amount) {
      return new Response(JSON.stringify({ error: 'Field wajib belum lengkap' }), { status: 400 });
    }

    await context.env.DB.prepare(`
      INSERT INTO transactions (transaction_date, company_name, transaction_type, amount, description)
      VALUES (?, ?, ?, ?, ?)
    `).bind(transaction_date, company_name, transaction_type, Number(amount), description || null).run();

    return Response.json({ success: true });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

// ── PUT /api/transactions?id=xxx ───────────────────────────────────────────
export async function onRequestPut(context) {
  try {
    const url    = new URL(context.request.url);
    const id     = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'id diperlukan' }), { status: 400 });

    const body = await context.request.json();
    const { transaction_date, company_name, transaction_type, amount, description } = body;

    await context.env.DB.prepare(`
      UPDATE transactions
      SET transaction_date=?, company_name=?, transaction_type=?, amount=?, description=?
      WHERE id=?
    `).bind(transaction_date, company_name, transaction_type, Number(amount), description || null, id).run();

    return Response.json({ success: true });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

// ── DELETE /api/transactions?id=xxx ───────────────────────────────────────
export async function onRequestDelete(context) {
  try {
    const url = new URL(context.request.url);
    const id  = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'id diperlukan' }), { status: 400 });

    await context.env.DB.prepare('DELETE FROM transactions WHERE id=?').bind(id).run();
    return Response.json({ success: true });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
