import { api } from "@/lib/api";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import Link from "next/link";

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const response = await api.productList().catch(() => ({ list: [] }));
  const products = (response?.list || []) as any[];
  const product = products.find((p: any) => String(p.id) === params.id);

  if (!product) {
    return (
      <div className="text-center py-24 bg-white border border-slate-100 rounded-3xl max-w-md mx-auto space-y-4">
        <span className="text-5xl block">🕵️‍♂️</span>
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-400 text-sm">We couldn't find the product you are looking for. It might have been removed.</p>
        <Link href="/products" className="bg-blue-600 text-white rounded-xl font-bold px-6 py-2.5 inline-block text-sm">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <ProductDetailClient product={product} allProducts={products} />
  );
}

