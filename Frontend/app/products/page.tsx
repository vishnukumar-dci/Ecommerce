import { api } from "@/lib/api";
import AdminProducts from "@/components/product/AdminProducts";
import Filters from "@/components/product/Filters";

export default async function ProductsPage({ searchParams }: { searchParams: { q?: string; sort?: string } }) {
  const response = await api.productList().catch(() => ({ list: [] }));
  let products = (response?.list || []) as any[];

  const q = (searchParams.q || "").toLowerCase();
  if (q) products = products.filter(p => String(p.product_name).toLowerCase().includes(q));

  switch (searchParams.sort) {
    case "price-asc": products = products.sort((a,b) => Number(a.amount)-Number(b.amount)); break;
    case "price-desc": products = products.sort((a,b) => Number(b.amount)-Number(a.amount)); break;
    case "name-asc": products = products.sort((a,b) => String(a.product_name).localeCompare(String(b.product_name))); break;
    case "name-desc": products = products.sort((a,b) => String(b.product_name).localeCompare(String(a.product_name))); break;
  }

  return (
    <div className="space-y-4">
      <AdminProducts products={products.map((p: any) => ({ id: p.id, product_name: p.product_name || p.name, amount: p.amount, descriptions: p.descriptions || p.description || "", image_path: p.image_path || p.image }))} />
    </div>
  );
}
