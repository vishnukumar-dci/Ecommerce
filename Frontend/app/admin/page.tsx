"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", description: "", amount: "" });
  const [editing, setEditing] = useState<{ id: number; name: string; description: string; amount: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await api.productList().catch(() => ({ list: [] }));
    setProducts(res?.list || []);
  }

  useEffect(() => { load(); }, []);

  async function create() {
    setLoading(true); setError(null);
    try {
      await api.addProduct({ name: form.name, description: form.description, amount: Number(form.amount) });
      setForm({ name: "", description: "", amount: "" });
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function del(id: number) {
    await api.deleteProduct(id).catch(() => {});
    await load();
  }

  async function saveEdit() {
    if (!editing) return;
    setLoading(true); setError(null);
    try {
      await api.updateProduct(editing.id, { name: editing.name, description: editing.description, amount: Number(editing.amount) });
      setEditing(null);
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>

      <div className="rounded-2xl border p-4">
        <h2 className="font-semibold mb-3">Orders</h2>
        <div>
          <a href="/admin/orders" className="text-blue-600 hover:underline">View all orders</a>
          <div className="mt-2">
            <a href="/admin/logs" className="text-blue-600 hover:underline">View logs</a>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-4">
        <h2 className="font-semibold mb-3">Add Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))} />
          <Input placeholder="Description" value={form.description} onChange={(e) => setForm(prev => ({...prev, description: e.target.value}))} />
          <Input placeholder="Amount" value={form.amount} onChange={(e) => setForm(prev => ({...prev, amount: e.target.value}))} />
        </div>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        <Button className="mt-3" onClick={create} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
      </div>

      <div className="rounded-2xl border p-4">
        <h2 className="font-semibold mb-3">Products</h2>
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="space-y-2 border rounded-xl p-3">
              {editing?.id === p.id ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input value={editing ? editing.name : ""} onChange={(e) => setEditing(prev => prev ? ({...prev, name: e.target.value}) : prev)} />
                  <Input value={editing ? editing.description : ""} onChange={(e) => setEditing(prev => prev ? ({...prev, description: e.target.value}) : prev)} />
                  <Input value={editing ? editing.amount : ""} onChange={(e) => setEditing(prev => prev ? ({...prev, amount: e.target.value}) : prev)} />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit} disabled={loading}>Update</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="font-medium">{p.product_name} <span className="text-brand">₹{p.amount}</span></div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditing({ id: p.id, name: p.product_name, description: p.descriptions, amount: String(p.amount) })}>Edit</Button>
                    <Button variant="outline" onClick={() => del(p.id)}>Delete</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
