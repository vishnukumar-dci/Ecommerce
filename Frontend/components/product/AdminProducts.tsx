"use client";
import * as React from "react";
import { useAuth } from "@/lib/store/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { assetUrl } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

export default function AdminProducts({ products }: { products: any[] }) {
  const role = useAuth((s) => s.role);
  const isAdmin = role === "admin";
  const [showCreate, setShowCreate] = React.useState(false);
  const [edit, setEdit] = React.useState<any | null>(null);

  if (!isAdmin) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p: any) => (
          <ProductCard key={p.id} product={{ id: p.id, product_name: p.product_name, amount: p.amount, descriptions: p.descriptions, image_path: p.image_path }} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setShowCreate(true)}>Add New Product</Button>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {products.map((p: any) => (
          <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl border">
            <Image src={assetUrl(p.image_path) || "https://via.placeholder.com/100"} width={100} height={100} alt="" className="rounded-xl" />
            <div className="flex-1">
              <div className="font-medium">{p.product_name}</div>
              <div className="text-brand font-semibold">₹{Number(p.amount).toLocaleString()}</div>
              <div className="text-sm text-gray-600 line-clamp-2">{p.descriptions}</div>
            </div>
            <Button onClick={() => setEdit(p)}>Edit Product</Button>
          </div>
        ))}
      </div>
      {showCreate && <ProductModal mode="create" onClose={() => setShowCreate(false)} />}
      {edit && <ProductModal mode="edit" product={edit} onClose={() => setEdit(null)} />}
    </>
  );
}

function ProductModal({ mode, product, onClose }: { mode: "create" | "edit"; product?: any; onClose: () => void }) {
  const [name, setName] = React.useState(product?.product_name || "");
  const [description, setDescription] = React.useState(product?.descriptions || "");
  const [amount, setAmount] = React.useState(String(product?.amount || ""));
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit() {
    setLoading(true); setError(null);
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("description", description);
      form.append("amount", amount);
      if (file) form.append("image", file);

      const url = mode === "create" ? "/product/create" : "/product/update?productId=" + product.id;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(`http://localhost:8088${url}`, {
        method,
        body: form,
        credentials: "include",
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.message || `Failed ${res.status}`);
      onClose();
      location.reload();
    } catch (e: any) {
      setError(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-4">
        <h3 className="text-lg font-semibold mb-3">{mode === "create" ? "Add New Product" : "Edit Product"}</h3>
        <div className="space-y-3">
          <input className="w-full border rounded-xl h-10 px-3" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea className="w-full border rounded-xl p-3" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input className="w-full border rounded-xl h-10 px-3" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <input className="w-full" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        </div>
      </div>
    </div>
  );
}
