"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/store/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { assetUrl, api } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import { X, Plus, Filter, SlidersHorizontal, Trash2, Edit3, Eye, Star } from "lucide-react";
import { toast } from "@/lib/store/toast";

export default function AdminProducts({ products }: { products: any[] }) {
  const role = useAuth((s) => s.role);
  const isAdmin = role === "admin";

  const [list, setList] = useState<any[]>(products || []);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [edit, setEdit] = useState<any | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("");

  useEffect(() => {
    setList(products || []);
  }, [products]);

  // Refresh products list
  const refreshProducts = async () => {
    setLoading(true);
    try {
      const res = await api.productList().catch(() => ({ list: [] }));
      setList(res.list || []);
    } catch (err) {
      toast.error("Failed to load products list");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.deleteProduct(productId);
      toast.success("Product deleted successfully");
      refreshProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  // Derive stable dummy categories and rating for filters
  const getProductCategory = (p: any) => {
    const desc = String(p.descriptions || p.description || "").toLowerCase();
    if (desc.includes("phone") || desc.includes("electronics") || desc.includes("gadget") || desc.includes("audio") || desc.includes("headphone") || desc.includes("watch")) return "electronics";
    if (desc.includes("shirt") || desc.includes("shoe") || desc.includes("fashion") || desc.includes("jean") || desc.includes("wear") || desc.includes("dress")) return "fashion";
    if (desc.includes("book") || desc.includes("stationery") || desc.includes("read")) return "books";
    return "home"; // default
  };

  const getProductRating = (id: number) => {
    return 4.0 + (id % 11) * 0.1;
  };

  // Filtered List
  const filteredProducts = list.filter((p) => {
    // 1. Category Filter
    if (selectedCategory && getProductCategory(p) !== selectedCategory) return false;

    // 2. Price Range Filter
    const price = Number(p.amount);
    if (priceRange === "under-1000" && price >= 1000) return false;
    if (priceRange === "1000-5000" && (price < 1000 || price > 5000)) return false;
    if (priceRange === "above-5000" && price <= 5000) return false;

    // 3. Rating Filter
    if (selectedRating !== null && getProductRating(p.id) < selectedRating) return false;

    return true;
  }).sort((a, b) => {
    // Sorting
    if (sortBy === "price-asc") return Number(a.amount) - Number(b.amount);
    if (sortBy === "price-desc") return Number(b.amount) - Number(a.amount);
    if (sortBy === "name-asc") return String(a.product_name || a.name).localeCompare(String(b.product_name || b.name));
    if (sortBy === "name-desc") return String(b.product_name || b.name).localeCompare(String(a.product_name || a.name));
    return 0;
  });

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceRange("");
    setSelectedRating(null);
    setSortBy("");
  };

  // Regular Customer Catalog Layout
  if (!isAdmin) {
    return (
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                Filters
              </span>
              {(selectedCategory || priceRange || selectedRating !== null) && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-bold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: "All Categories", value: "" },
                  { label: "💻 Electronics", value: "electronics" },
                  { label: "👗 Fashion", value: "fashion" },
                  { label: "🏠 Home Essentials", value: "home" },
                  { label: "📚 Books", value: "books" },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`text-left text-sm px-3 py-2 rounded-xl transition-all font-medium ${
                      selectedCategory === cat.value
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2 pt-4 border-t border-slate-50">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price Range</label>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: "All Prices", value: "" },
                  { label: "Under ₹1,000", value: "under-1000" },
                  { label: "₹1,000 to ₹5,000", value: "1000-5000" },
                  { label: "Above ₹5,000", value: "above-5000" },
                ].map((pr) => (
                  <button
                    key={pr.value}
                    onClick={() => setPriceRange(pr.value)}
                    className={`text-left text-sm px-3 py-2 rounded-xl transition-all font-medium ${
                      priceRange === pr.value
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-2 pt-4 border-t border-slate-50">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Minimum Rating</label>
              <div className="flex flex-col gap-1">
                {[
                  { label: "4.5 ★ & above", value: 4.5 },
                  { label: "4.0 ★ & above", value: 4.0 },
                  { label: "3.5 ★ & above", value: 3.5 },
                ].map((rat) => (
                  <button
                    key={rat.value}
                    onClick={() => setSelectedRating(selectedRating === rat.value ? null : rat.value)}
                    className={`flex items-center gap-2 text-left text-sm px-3 py-2 rounded-xl transition-all font-medium ${
                      selectedRating === rat.value
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    <span>{rat.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Right Side: Sorting & Product Grid */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
            <p className="text-sm font-semibold text-slate-600">
              Showing <span className="text-slate-950 font-extrabold">{filteredProducts.length}</span> products
            </p>

            {/* Sorting Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-800 px-3 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Default Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
            </div>
          </div>

          {/* Skeletons loader or Grid */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 6].map((i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 animate-pulse">
                  <div className="bg-slate-200 rounded-xl aspect-[4/3] w-full" />
                  <div className="h-4.5 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-slate-200 rounded w-1/3" />
                    <div className="h-8 bg-slate-200 rounded-full w-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl py-20 px-6 text-center space-y-3">
              <span className="text-4xl block">🔍</span>
              <h3 className="text-lg font-bold text-slate-800">No products match your filters</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">Try clearing filters or search options to find what you are looking for.</p>
              <Button onClick={clearFilters} className="mt-2 bg-blue-600 text-white rounded-xl">Clear All Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p: any) => (
                <ProductCard
                  key={p.id}
                  product={{
                    id: p.id,
                    product_name: p.product_name,
                    amount: p.amount,
                    descriptions: p.descriptions,
                    image_path: p.image_path,
                    in_cart: p.in_cart,
                  }}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    );
  }

  // Admin Management Layout
  return (
    <div className="space-y-6">
      
      {/* Admin Title & Add Button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Product Dashboard</h1>
          <p className="text-slate-500 text-xs mt-0.5">Manage details and listings on the catalog</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/10">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Admin table list view */}
      {loading ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3.5 bg-slate-200 rounded w-1/4" />
              </div>
              <div className="w-20 h-9 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400">
          No catalog products created yet. Click "Add Product" to create your first item.
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">Item Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {list.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={assetUrl(p.image_path) || "https://via.placeholder.com/100"}
                        width={60}
                        height={60}
                        alt={p.product_name}
                        className="rounded-xl cursor-pointer border border-slate-100 object-cover w-[60px] h-[60px] shrink-0"
                        onClick={() => setPreview(assetUrl(p.image_path))}
                      />
                      <div>
                        <div className="font-semibold text-slate-800">{p.product_name}</div>
                        <div className="text-xs text-slate-400 line-clamp-1 max-w-sm mt-0.5">{p.descriptions}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize font-medium text-slate-500">
                    {getProductCategory(p)}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    ₹{Number(p.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPreview(assetUrl(p.image_path))}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => setEdit(p)}
                        className="p-2 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Creation Modals */}
      {showCreate && (
        <ProductModal
          mode="create"
          onClose={() => setShowCreate(false)}
          onSaved={refreshProducts}
        />
      )}
      {edit && (
        <ProductModal
          mode="edit"
          product={edit}
          onClose={() => setEdit(null)}
          onSaved={refreshProducts}
        />
      )}

      {/* Image Preview Overlay */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-sm w-full bg-white rounded-3xl p-3 shadow-2xl animate-in scale-in duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-3 -right-3 bg-white text-slate-500 hover:text-slate-700 border border-slate-100 rounded-full p-2 shadow-lg z-10 hover:scale-110 active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50">
              <Image
                src={preview}
                alt="Preview"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Admin Add/Edit Modal
function ProductModal({ mode, product, onClose, onSaved }: { mode: "create" | "edit"; product?: any; onClose: () => void; onSaved?: () => void }) {
  const [name, setName] = useState(product?.product_name || "");
  const [description, setDescription] = useState(product?.descriptions || "");
  const [amount, setAmount] = useState(String(product?.amount || ""));
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(product ? assetUrl(product.image_path) : null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  async function submit() {
    if (!name || !description || !amount) {
      setError("Please fill out all fields");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (mode === "create") {
        await api.addProduct({ name, description, amount: Number(amount), image: file || undefined });
        toast.success("New product created successfully!");
      } else {
        await api.updateProduct(product.id, { name, description, amount: Number(amount), image: file || undefined });
        toast.success("Product updated successfully!");
      }
      onClose();
      onSaved?.();
    } catch (e: any) {
      setError(e.message || "Failed saving product changes");
      toast.error(e.message || "Failed saving product changes");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl relative animate-in slide-in-from-bottom-6 duration-250">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-black text-slate-800 mb-4">
          {mode === "create" ? "✨ Add New Product" : "📝 Edit Product details"}
        </h3>
        
        <div className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Name</label>
            <input
              className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder="e.g. Premium Cotton Shirt"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
            <textarea
              className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition min-h-[80px]"
              placeholder="Provide clean product descriptions and features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price (₹ INR)</label>
            <input
              type="number"
              className="w-full border border-slate-200 rounded-xl h-11 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder="e.g. 1499"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Image Upload Box */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Image</label>
            <div className="flex gap-4 items-center border border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/50">
              {previewUrl && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-100 bg-white shrink-0">
                  <Image src={previewUrl} alt="Thumbnail preview" fill style={{ objectFit: "cover" }} />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-1">JPEG, PNG or WEBP formats. Recommended resolution: 800x600.</p>
              </div>
            </div>
          </div>

          {error && <div className="text-xs text-red-500 font-semibold">{error}</div>}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} className="rounded-xl border-slate-200 text-slate-500 hover:bg-slate-50 font-bold px-5">
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-6 flex items-center gap-1.5"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              "Save Details"
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
