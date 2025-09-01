import { api, assetUrl } from "@/lib/api";
import Image from "next/image";
import ProductActions from "@/components/product/ProductActions";

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const response = await api.productList().catch(() => ({ list: [] }));
  const products = (response?.list || []) as any[];
  const product = products.find((p: any) => String(p.id) === params.id);

  if (!product) {
    return <div className="text-center py-20">Product not found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50">
      <div className="rounded-2xl overflow-hidden bg-gray-100">
        <Image src={assetUrl(product.image_path) || "https://via.placeholder.com/800x600?text=Product"} alt={product.product_name} width={800} height={600} className="object-cover w-full h-auto" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{product.product_name}</h1>
        <div className="text-2xl text-brand font-bold mt-2">₹{Number(product.amount).toLocaleString()}</div>
        <p className="mt-4 text-gray-700">{product.descriptions || "No description"}</p>
        <div className="flex gap-3 mt-6">
          <ProductActions product={product} />
        </div>
      </div>
    </div>
  );
}

