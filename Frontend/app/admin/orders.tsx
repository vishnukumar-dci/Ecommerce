"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminOrdersPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [grouped, setGrouped] = useState<any[]>([]);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ui state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("desc");

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
      try {
  const res = await api.orderHistory();
  console.log('admin orders: raw response', res)
  setRawResponse(res)
  // backend might return either an array or an object wrapper { history: [...] }
  const r: any = res
  const data = Array.isArray(r) ? r : (r?.history || r?.orders || [])
  setRows(data || []);
      } catch (e: any) {
        setError(e.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // derive grouped orders whenever raw rows change
  useEffect(() => {
    const raw = rows || [];
    // if rows already grouped (items present), normalize shape
    if (raw.length === 0) {
      setGrouped([]);
      return;
    }

    const first = raw[0];
    // detect grouped shape
    if (first.items || first.order_items) {
      const normalized = raw.map((o: any) => ({
        orderId: o.orderId || o.id,
        customer: o.customer || o.name || o.username || o.user || o.customer_name,
        items: o.items || o.order_items || [],
        total: o.total || o.amount || 0,
        status: o.status || o.payment_status,
        date: o.date || o.order_date || o.created_at || o.createdAt,
      }));
      setGrouped(normalized);
      return;
    }

    // group flat rows (each row is an order-item) by order id
    const map = new Map();
    for (const r of raw) {
      const id = r.order_id || r.id || r.orderId;
      const key = String(id || "unknown");
      if (!map.has(key)) {
        map.set(key, {
          orderId: id,
          customer: r.name || r.username || r.customer_name || r.customer || r.user,
          items: [],
          total: r.amount || 0,
          status: r.payment_status || r.status,
          date: r.order_date || r.created_at || r.date,
        });
      }
      const entry = map.get(key);
      // collect item info if present
      if (r.product_name || r.qty || r.price) {
        entry.items.push({ product_name: r.product_name, qty: r.qty || r.quantity || 1, price: r.price || r.item_price || r.price_per_unit });
      }
      // prefer explicit total if present
      if (r.amount) entry.total = r.amount;
    }

    // compute totals if missing
    const groupedArr = Array.from(map.values()).map((g: any) => {
      if (!g.total || g.total === 0) {
        g.total = (g.items || []).reduce((s: number, it: any) => s + (Number(it.price || 0) * Number(it.qty || 1)), 0);
      }
      return g;
    });

    setGrouped(groupedArr);
  }, [rows]);

  // sorting and paging helpers
  const sorted = grouped.slice().sort((a: any, b: any) => {
    let va: any = a[sortBy as keyof typeof a];
    let vb: any = b[sortBy as keyof typeof b];
    if (sortBy === 'date') {
      va = va ? new Date(va).getTime() : 0;
      vb = vb ? new Date(vb).getTime() : 0;
    }
    if (sortBy === 'total' || sortBy === 'amount') {
      va = Number(va || 0);
      vb = Number(vb || 0);
    }
    if (typeof va === 'string' && typeof vb === 'string') {
      const cmp = va.localeCompare(vb);
      return sortDir === 'asc' ? cmp : -cmp;
    }
    const cmp = (va > vb) ? 1 : (va < vb ? -1 : 0);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = sorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">All Orders (Admin)</h1>

      <div className="flex flex-wrap items-center gap-3">
        <div>
          <label className="text-sm text-slate-600 mr-2">Sort</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-2 py-1">
            <option value="date">Date</option>
            <option value="total">Total</option>
            <option value="orderId">Order ID</option>
            <option value="customer">Customer</option>
          </select>
          <button onClick={() => setSortDir(s => s === 'asc' ? 'desc' : 'asc')} className="ml-2 px-2 py-1 border rounded">{sortDir === 'asc' ? '↑' : '↓'}</button>
        </div>

        <div>
          <label className="text-sm text-slate-600 mr-2">Page size</label>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : grouped.length === 0 ? (
        <div>
          <div className="mb-4">No orders yet.</div>
          {rawResponse && (
            <details className="bg-white p-4 rounded border">
              <summary className="cursor-pointer font-medium">Debug: raw API response</summary>
              <pre className="mt-2 text-xs whitespace-pre-wrap">{JSON.stringify(rawResponse, null, 2)}</pre>
            </details>
          )}
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto bg-white rounded border">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Products</th>
                  <th className="p-2">Items</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {current.map((o: any, idx: number) => (
                  <tr key={idx} className="border-t align-top">
                    <td className="p-2 align-top">{o.orderId}</td>
                    <td className="p-2 align-top">{o.customer || '-'}</td>
                    <td className="p-2 align-top">
                      <div className="space-y-1">
                        {(o.items || []).map((it: any, i: number) => (
                          <div key={i} className="text-sm">
                            <div className="font-medium">{it.product_name}</div>
                            <div className="text-xs text-slate-600">Qty: {it.qty} • ₹{Number(it.price).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-2 align-top">{(o.items || []).length}</td>
                    <td className="p-2 align-top">₹{Number(o.total || 0).toLocaleString()}</td>
                    <td className="p-2 align-top">{o.status}</td>
                    <td className="p-2 align-top">{o.date ? new Date(o.date).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm">Page {page} / {totalPages}</div>
            <div className="space-x-2">
              <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 border rounded">First</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 border rounded">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 border rounded">Next</button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 border rounded">Last</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
