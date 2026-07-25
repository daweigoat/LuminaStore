"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Banknote, CheckCircle } from "lucide-react";
import dayjs from "dayjs";

export default function AdminFinance() {
  const queryClient = useQueryClient();
  const { data: withdrawals, isLoading } = useQuery({
    queryKey: ["admin-withdrawals"],
    queryFn: async () => {
      const res = await api.get("/admin/finance/withdrawals");
      return res.data.data || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.put(`/admin/finance/withdrawals/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Financial Settlements</h1>
        <p className="text-white/50">Approve and process seller withdrawal requests.</p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/20">
                <th className="p-4 font-semibold text-white/50">Date</th>
                <th className="p-4 font-semibold text-white/50">Store ID</th>
                <th className="p-4 font-semibold text-white/50">Amount</th>
                <th className="p-4 font-semibold text-white/50">Status</th>
                <th className="p-4 font-semibold text-white/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-white/50">Loading requests...</td></tr>
              ) : withdrawals.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center text-white/50">No pending withdrawals.</td></tr>
              ) : (
                withdrawals.map((w: any) => (
                  <tr key={w.ID} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm text-white/70">
                      {dayjs(w.CreatedAt).format('DD MMM YYYY, HH:mm')}
                    </td>
                    <td className="p-4 text-sm font-mono text-white/50">
                      {w.StoreID}
                    </td>
                    <td className="p-4 font-bold text-lg text-primary-400">
                      ${w.Amount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-warning/10 text-warning">
                        {w.Status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => approveMutation.mutate(w.ID)}
                        className="px-4 py-2 bg-primary-500 text-black font-bold rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 ml-auto"
                      >
                        <Banknote className="w-4 h-4" /> Approve Payout
                      </button>
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
