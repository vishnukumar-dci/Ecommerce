"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { api, assetUrl } from "@/lib/api";
import { useAuth } from "@/lib/store/auth";
import AdminOrders from "@/app/admin/orders";

export default function OrdersPage() {
  const role = useAuth((s) => s.role);
  
  if (role === 'admin') return <AdminOrders />;
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // pagination for customer view
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // date range filters
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
  try {
  const res = await api.customerOrders();
  const payload = res as any;
  console.log('orders page: customerOrders raw response', payload)
    // backend may return grouped orders: { history: [...] } or legacy flat rows
    let rowsFromApi: any[] = payload.history || payload.orders || [];

    // if the API returned flat order-item rows (each row contains product_name/qty)
    // but no 'items' array on the entries, group them into orders so Products render
    if (Array.isArray(rowsFromApi) && rowsFromApi.length > 0) {
      const first = rowsFromApi[0];
      const looksFlat = !(first.items || first.order_items) && (first.product_name || first.name || first.qty || first.price);
      if (looksFlat) {
        const map = new Map<string, any>();
        rowsFromApi.forEach((r: any, i: number) => {
          const oid = r.orderId ?? r.id ?? r.order_id ?? `order_${i}`;
          if (!map.has(oid)) {
            map.set(oid, {
              orderId: oid,
              total: r.total ?? r.amount ?? r.order_total ?? 0,
              status: r.status ?? r.payment_status ?? r.order_status,
              date: r.date ?? r.order_date ?? r.created_at,
              items: [] as any[],
            });
          }
          const entry = map.get(oid);
          entry.items.push({
            product_name: r.product_name ?? r.name,
            qty: r.qty ?? r.quantity ?? 1,
            price: r.price ?? r.item_price ?? 0,
            image_path: r.image_path ?? r.image,
          });
        });
        rowsFromApi = Array.from(map.values());
      }
    }

    setRows(rowsFromApi || []);
      } catch (e: any) {
        setError(e.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // apply date-range filter to the grouped rows returned by the backend
  const filteredOrders = useMemo(() => {
    return rows.filter((order: any) => {
      if ((fromDate || toDate) && order.date) {
        const d = new Date(order.date);
        if (fromDate) {
          const f = new Date(fromDate);
          if (d < f) return false;
        }
        if (toDate) {
          const t = new Date(toDate);
          t.setHours(23,59,59,999);
          if (d > t) return false;
        }
      }
      // if no date filters, include all
      return true;
    })
  }, [rows, fromDate, toDate]);

  // pagination helpers
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paged = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-full space-y-6">
      <h1 className="text-2xl font-semibold">Your Orders</h1>
      {/* Date range filter (right-aligned) */}
      <div className="flex justify-end items-center gap-2">
        <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} className="border rounded px-2 py-1 bg-white text-black" />
        <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} className="border rounded px-2 py-1 bg-white text-black" />
        <button onClick={() => { setFromDate(""); setToDate(""); setPage(1); }} className="ml-2 px-3 py-1 bg-gray-200 rounded">Reset</button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
        ) : filteredOrders.length === 0 ? (
        <div>You haven’t placed any orders yet. Start shopping today!</div>
      ) : (
        <div className="space-y-4">
          {/* table view with pagination */}
          <div className="overflow-x-auto bg-white rounded border">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Products</th>
                  <th className="p-2">Items</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((o: any, idx: number) => {
                  const items = o.items || o.order_items || [];
                  // compute total robustly
                  let total = Number(o.total ?? o.amount ?? 0);
                  if (!isFinite(total) || total === 0) {
                    const computed = (items || []).reduce((s: number, it: any) => {
                      const price = Number(it.price ?? it.item_price ?? 0) || 0;
                      const qty = Number(it.qty ?? it.quantity ?? 1) || 0;
                      return s + price * qty;
                    }, 0);
                    total = computed;
                  }
                  if (!isFinite(total)) total = 0;

                  return (
                    <tr key={o.orderId || idx} className="border-t align-top">
                      <td className="p-2 align-top">{o.orderId || o.id}</td>
                      <td className="p-2 align-top">
                        <div className="flex flex-col gap-2">
                          {(items || []).map((it: any, i: number) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-12 h-12 flex-shrink-0">
                                <Image src={assetUrl(it.image_path) || "https://via.placeholder.com/100"} alt={it.product_name || it.name || "product"} width={48} height={48} className="rounded-md object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm line-clamp-1">{it.product_name || it.name || '-'}</div>
                                <div className="text-xs text-slate-500">₹{Number(it.price ?? it.item_price ?? 0).toLocaleString()}</div>
                              </div>
                              <div>
                                <span className="inline-flex items-center justify-center bg-gray-100 text-sm text-slate-700 rounded-full w-8 h-8">{it.qty ?? it.quantity ?? 1}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-2 align-top">{(items || []).reduce((s: number, it: any) => s + (Number(it.qty ?? it.quantity ?? 1) || 0), 0)}</td>
                      <td className="p-2 align-top">₹{Number(total || 0).toLocaleString()}</td>
                      <td className="p-2 align-top">{o.status || o.payment_status}</td>
                      <td className="p-2 align-top">{o.date ? new Date(o.date).toLocaleString() : (o.order_date ? new Date(o.order_date).toLocaleString() : '-')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Page size</label>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 border rounded">First</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 border rounded">Prev</button>
              <div className="text-sm">Page {page} / {totalPages}</div>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 border rounded">Next</button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 border rounded">Last</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
