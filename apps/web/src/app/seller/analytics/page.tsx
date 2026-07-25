"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function SellerAnalytics() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["seller-analytics"],
    queryFn: async () => {
      const res = await api.get("/seller/analytics");
      return res.data.data;
    },
  });

  // Mock data for the chart since the backend doesn't provide time-series data yet
  const data = [
    { name: "Mon", revenue: 4000, orders: 24 },
    { name: "Tue", revenue: 3000, orders: 18 },
    { name: "Wed", revenue: 2000, orders: 12 },
    { name: "Thu", revenue: 2780, orders: 19 },
    { name: "Fri", revenue: 1890, orders: 9 },
    { name: "Sat", revenue: 2390, orders: 14 },
    { name: "Sun", revenue: 3490, orders: 21 },
  ];

  if (isLoading) return <div className="p-8">Loading analytics...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics</h1>
        <p className="text-foreground/60">Detailed insights into your store's performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-3xl p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold">Revenue Overview</h3>
              <p className="text-3xl font-black mt-2">${metrics?.TotalRevenue?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#666" axisLine={false} tickLine={false} dx={-10} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#111' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Orders Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-3xl p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold">Orders Volume</h3>
              <p className="text-3xl font-black mt-2">{metrics?.TotalOrders || 0}</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#666" axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#111' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
