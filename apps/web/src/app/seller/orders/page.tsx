"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Search, MapPin, Truck, CheckCircle2 } from "lucide-react";
import dayjs from "dayjs";

export default function SellerOrders() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["seller-orders"],
    queryFn: async () => {
      const res = await api.get("/seller/orders");
      return res.data.data || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return api.put(`/seller/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
    }
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Order Management</h1>
        <p className="text-foreground/60">Fulfill orders and manage shipments.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["All", "Pending", "Paid", "Packed", "Shipped", "Delivered", "Cancelled"].map(tab => (
          <button key={tab} className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap ${tab === 'All' ? 'bg-foreground text-background' : 'bg-card text-foreground/70 hover:bg-white/5 border border-border'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-white/2">
                <th className="p-4 font-semibold text-foreground/70">Order ID & Date</th>
                <th className="p-4 font-semibold text-foreground/70">Buyer</th>
                <th className="p-4 font-semibold text-foreground/70">Status</th>
                <th className="p-4 font-semibold text-foreground/70">Total</th>
                <th className="p-4 font-semibold text-foreground/70 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-foreground/50">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center text-foreground/50">No orders found.</td></tr>
              ) : (
                orders.map((o: any) => (
                  <tr key={o.ID} className="border-b border-border hover:bg-white/2 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold">{o.OrderNumber}</div>
                      <div className="text-xs text-foreground/50">{dayjs(o.CreatedAt).format('DD MMM YYYY, HH:mm')}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium flex items-center gap-2"><MapPin className="w-3 h-3 text-foreground/40"/> Customer</div>
                      <div className="text-xs text-foreground/50 truncate max-w-[200px]">{o.ShippingAddress}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-md text-xs font-bold bg-white/10 uppercase tracking-wider">
                        {o.Status.replace('_', ' ')}
                      </span>
                      {o.TrackingNumber && (
                        <div className="mt-2 text-xs flex items-center gap-1 text-primary-400">
                          <Truck className="w-3 h-3" /> {o.TrackingNumber}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-lg">${o.FinalAmount.toFixed(2)}</td>
                    <td className="p-4 text-right space-x-2">
                      {o.Status === 'paid' && (
                        <button onClick={() => updateStatusMutation.mutate({ id: o.ID, status: 'packed' })} className="px-4 py-2 bg-primary-500 text-background rounded-lg font-bold text-sm hover:bg-primary-600 transition-colors">
                          Mark Packed
                        </button>
                      )}
                      {o.Status === 'packed' && (
                        <button onClick={() => updateStatusMutation.mutate({ id: o.ID, status: 'shipped' })} className="px-4 py-2 bg-success text-background rounded-lg font-bold text-sm hover:bg-success/90 transition-colors">
                          Ship Order
                        </button>
                      )}
                      {o.Status === 'shipped' && (
                        <button disabled className="px-4 py-2 bg-white/5 text-foreground/40 rounded-lg font-bold text-sm cursor-not-allowed flex items-center gap-1 ml-auto">
                          <CheckCircle2 className="w-4 h-4" /> Shipped
                        </button>
                      )}
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
