"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Check, X } from "lucide-react";

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products-pending"],
    queryFn: async () => {
      const res = await api.get("/admin/products/pending");
      return res.data.data || [];
    },
  });

  const moderateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return api.put(`/admin/products/${id}/moderate`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products-pending"] });
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Product Moderation</h1>
        <p className="text-white/50">Review newly submitted products before they appear on the marketplace.</p>
      </div>

      {isLoading ? (
        <div className="text-white/50">Loading moderation queue...</div>
      ) : products.length === 0 ? (
        <div className="bg-[#111] border border-white/10 rounded-3xl p-12 text-center text-white/50">
          Queue is empty. Great job!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {products.map((p: any) => (
            <div key={p.ID} className="bg-[#111] border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-32 h-32 bg-black rounded-xl border border-white/10 flex-shrink-0">
                {/* Image Placeholder */}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl">{p.Name}</h3>
                <p className="text-white/50 text-sm mt-1">{p.Description}</p>
                <div className="flex gap-4 mt-4 text-sm font-semibold text-primary-400">
                  <span>Price: ${p.Price.toFixed(2)}</span>
                  <span>Stock: {p.Stock}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => moderateMutation.mutate({ id: p.ID, status: 'approved' })}
                  className="px-6 py-3 bg-success text-black font-bold rounded-xl hover:bg-success/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" /> Approve
                </button>
                <button 
                  onClick={() => moderateMutation.mutate({ id: p.ID, status: 'rejected' })}
                  className="px-6 py-3 bg-error/20 text-error font-bold rounded-xl hover:bg-error hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
