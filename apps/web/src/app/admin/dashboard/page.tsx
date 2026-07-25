"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DollarSign, Users, Store, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockRevenueData = [
  { name: 'Mon', gmv: 4000, revenue: 200 },
  { name: 'Tue', gmv: 3000, revenue: 150 },
  { name: 'Wed', gmv: 5000, revenue: 250 },
  { name: 'Thu', gmv: 2780, revenue: 139 },
  { name: 'Fri', gmv: 8900, revenue: 445 },
  { name: 'Sat', gmv: 12390, revenue: 619 },
  { name: 'Sun', gmv: 14000, revenue: 700 },
];

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await api.get("/admin/dashboard");
      return res.data.data;
    },
  });

  if (isLoading) return <div className="text-white/50">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Platform Overview</h1>
        <p className="text-white/50">Monitor LuminaStore's health and performance.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#111] border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-500/10 rounded-2xl">
              <DollarSign className="w-6 h-6 text-primary-500" />
            </div>
          </div>
          <p className="text-white/50 font-semibold text-sm mb-1">Total GMV (All Time)</p>
          <h2 className="text-3xl font-black">${data?.gmv?.toLocaleString() || 0}</h2>
        </div>
        
        <div className="bg-[#111] border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <p className="text-white/50 font-semibold text-sm mb-1">Registered Users</p>
          <h2 className="text-3xl font-black">{data?.total_users || 0}</h2>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <Store className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <p className="text-white/50 font-semibold text-sm mb-1">Active Sellers</p>
          <h2 className="text-3xl font-black">{data?.total_sellers || 0}</h2>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-warning/10 rounded-2xl">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
          </div>
          <p className="text-white/50 font-semibold text-sm mb-1">Pending Moderation</p>
          <h2 className="text-3xl font-black">{data?.pending_moderation || 0}</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-6">Revenue & GMV (7 Days)</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Line type="monotone" dataKey="gmv" stroke="#facc15" strokeWidth={3} dot={{ r: 4, fill: '#0a0a0a', strokeWidth: 2 }} activeDot={{ r: 6 }} name="Total GMV ($)" />
              <Line type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#0a0a0a', strokeWidth: 2 }} activeDot={{ r: 6 }} name="Platform Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
