"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { api, assetUrl } from "@/lib/api";
import { useAuth } from "@/lib/store/auth";
import AdminOrders from "@/app/admin/orders";

export default function OrdersPage() {
  const role = useAuth((s) => s.role);

  // IMPORTANT: keep hooks in the same order on every render.
  // Declare hooks unconditionally (before any early return) so React's
  // rules of hooks are not violated when we render <AdminOrders /> early.
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  if (role === "admin") return <AdminOrders />;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.customerOrders(page, limit);
        console.log(res)
        const grouped = res.history.reduce((acc: any[], row: any) => {
          let order = acc.find((o) => o.id === row.id);
          if (!order) {
            order = {
              id: row.id,
              payment_status: row.payment_status,
              created_at: row.created_at,
              items: []
            };
            acc.push(order);
          }
          order.items.push({
            product_name: row.product_name,
            qty: row.qty,
            price: row.price,
            image_path: row.image_path,
          });
          return acc;
        }, []);

        setRows(grouped);
        setTotal(res.totalRecords || 0);
      } catch (e: any) {
        setError(e.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

  // don't run customer fetch when user is admin (we render AdminOrders)
  if (role === "admin") return;

  fetchOrders();
  }, [page, limit]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && rows.length === 0 && <p>No orders found.</p>}

      {rows.map((o) => {
        const totalQty = o.items.reduce((sum: number, i: any) => sum + i.qty, 0);
        const totalAmount = o.items.reduce(
          (sum: number, i: any) => sum + i.qty * i.price,
          0
        );

        return (
          <div
            key={o.id}
            className="border rounded-lg p-4 mb-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold">Order #{o.id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(o.created_at).toLocaleString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  o.payment_status === "paid"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {o.payment_status}
              </span>
            </div>

            <div className="space-y-2">
              {o.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <img
                    src={item.image_path}
                    alt={item.product_name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.qty} × ₹{item.price}
                    </p>
                  </div>
                  <p className="font-semibold">₹{item.qty * item.price}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between border-t pt-2 text-sm font-semibold">
              <span>Total Items: {totalQty}</span>
              <span>Total: ₹{totalAmount}</span>
            </div>
          </div>
        );
      })}

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {page} of {Math.ceil(total / limit) || 1}
        </span>
        <button
          onClick={() => setPage((p) => (p * limit < total ? p + 1 : p))}
          disabled={page * limit >= total}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
