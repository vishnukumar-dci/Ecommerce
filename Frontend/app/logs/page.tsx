"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminLogsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ui state
  const [page, setPage] = useState(1);
  const limit = 25; // ✅ fixed page size

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
        // ✅ call API only once, no pagination params
        const res = await api.stripeLogs();
        console.log("admin logs: raw response", res);
        setRows(res.logs || []);
      } catch (e: any) {
        setError(e.message || "Failed to load logs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  // ✅ pagination done locally
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Payment Logs (Admin)</h1>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : paginated.length === 0 ? (
        <div>No Logs found.</div>
      ) : (
        <div>
          <div className="overflow-x-auto bg-white rounded border">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="p-2">#</th>
                  <th className="p-2">Id</th>
                  <th className="p-2">Event Type</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Currency</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((o: any, idx: number) => (
                  <tr key={o.id} className="border-b">
                    <td className="p-3">{(page - 1) * limit + idx + 1}</td>
                    <td className="p-3">{o.id}</td>
                    <td className="p-3">{o.type}</td>
                    <td className="p-3">{o.amount}</td>
                    <td className="p-3">{o.currency}</td>
                    <td className="p-3">{o.status}</td>
                    <td className="p-3">{o.created_at}</td>
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
      )}
    </div>
  );
}
