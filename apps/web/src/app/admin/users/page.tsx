"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Shield, Ban, CheckCircle2 } from "lucide-react";

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get("/admin/users");
      return res.data.data || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return api.put(`/admin/users/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">User Management</h1>
        <p className="text-white/50">Manage roles, permissions, and account statuses.</p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/20">
                <th className="p-4 font-semibold text-white/50">User</th>
                <th className="p-4 font-semibold text-white/50">Role</th>
                <th className="p-4 font-semibold text-white/50">Status</th>
                <th className="p-4 font-semibold text-white/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="p-8 text-center text-white/50">Loading users...</td></tr>
              ) : (
                users.map((u: any) => (
                  <tr key={u.ID} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold">{u.FullName}</div>
                      <div className="text-xs text-white/50">{u.Email}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 flex items-center gap-1 w-max">
                        {u.Role === 'admin' && <Shield className="w-3 h-3 text-primary-500"/>}
                        {u.Role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${u.Status === 'active' ? 'text-success' : 'text-error'}`}>
                        {u.Status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {u.Status === 'active' ? (
                        <button 
                          onClick={() => updateStatusMutation.mutate({ id: u.ID, status: 'suspended' })}
                          className="p-2 bg-error/10 text-error rounded-lg hover:bg-error hover:text-white transition-colors"
                          title="Suspend User"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => updateStatusMutation.mutate({ id: u.ID, status: 'active' })}
                          className="p-2 bg-success/10 text-success rounded-lg hover:bg-success hover:text-white transition-colors"
                          title="Reactivate User"
                        >
                          <CheckCircle2 className="w-4 h-4" />
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
