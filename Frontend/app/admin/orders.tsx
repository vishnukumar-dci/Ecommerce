"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminOrdersPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ui state
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);

  // sorting
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // date filter state
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.orderHistory(page, limit);
        console.log("admin orders: raw response", res);
        setRawResponse(res);

        setRows(res.history || []);
        setTotal(res.totalRecords || 0);
      } catch (e: any) {
        setError(e.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  // apply sort
  const sorted = rows.slice().sort((a: any, b: any) => {
    let va: any = a[sortBy as keyof typeof a];
    let vb: any = b[sortBy as keyof typeof b];
    if (sortBy === "date" || sortBy === "created_at") {
      va = va ? new Date(va).getTime() : 0;
      vb = vb ? new Date(vb).getTime() : 0;
    }
    if (typeof va === "string" && typeof vb === "string") {
      const cmp = va.localeCompare(vb);
      return sortDir === "asc" ? cmp : -cmp;
    }
    const cmp = va > vb ? 1 : va < vb ? -1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  // apply date filter
  const filtered = sorted.filter((o: any) => {
    if (!o.created_at) return true;
    const orderDate = new Date(o.created_at).getTime();

    const afterStart = startDate
      ? orderDate >= new Date(startDate).getTime()
      : true;
    const beforeEnd = endDate
      ? orderDate <= new Date(endDate).getTime()
      : true;

    return afterStart && beforeEnd;
  });

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // ✅ Early return style prevents hook mismatch
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (filtered.length === 0) {
    return <div className="p-4">No orders found.</div>;
  }

  // ✅ Normal render
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">All Orders (Admin)</h1>

      {/* Date filters */}
      <div className="flex items-center gap-3">
        <div>
          <label className="text-sm mr-2">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm mr-2">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
          className="px-3 py-1 border rounded"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded border">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left">
              <th className="p-2">#</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Product</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o: any, idx: number) => (
              <tr key={o.id} className="border-b">
                <td className="p-3">{(page - 1) * limit + idx + 1}</td>
                <td className="p-3">{o.name}</td>
                <td className="p-3">{o.product_name}</td>
                <td className="p-3">{o.qty}</td>
                <td className="p-3">{o.amount}</td>
                <td className="p-3">{o.payment_status}</td>
                <td className="p-3">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
          disabled={page >= totalPages}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}


