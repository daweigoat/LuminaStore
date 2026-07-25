"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { Plus, Search, MoreHorizontal, Edit, Trash, EyeOff } from "lucide-react";

export default function SellerProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["seller-products"],
    queryFn: async () => {
      const res = await api.get("/seller/products");
      return res.data.data || [];
    },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Products</h1>
          <p className="text-foreground/60">Manage your product catalog and variants.</p>
        </div>
        <Link href="/seller/products/new" className="bg-foreground text-background font-semibold px-6 py-2.5 rounded-xl hover:bg-foreground/90 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Product
        </Link>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary-500"
            />
          </div>
          <select className="bg-background border border-border rounded-xl px-4 py-2 focus:outline-none">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-white/2">
                <th className="p-4 font-semibold text-foreground/70">Product Name</th>
                <th className="p-4 font-semibold text-foreground/70">Status</th>
                <th className="p-4 font-semibold text-foreground/70">Variants</th>
                <th className="p-4 font-semibold text-foreground/70">Price</th>
                <th className="p-4 font-semibold text-foreground/70 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-foreground/50">Loading products...</td></tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-foreground/50">
                    <p className="mb-4">No products found.</p>
                    <Link href="/seller/products/new" className="text-primary-400 hover:underline">Create your first product</Link>
                  </td>
                </tr>
              ) : (
                products.map((p: any) => (
                  <tr key={p.ID} className="border-b border-border hover:bg-white/2 transition-colors">
                    <td className="p-4 font-medium flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <span className="text-xs">Img</span>
                      </div>
                      {p.Name}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        p.Status === 'published' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                      }`}>
                        {p.Status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-foreground/70">{p.Variants?.length || 0}</td>
                    <td className="p-4 font-semibold">${p.Price.toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-warning"><EyeOff className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-danger"><Trash className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
