"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DollarSign, ShoppingBag, AlertTriangle, PackageOpen, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SellerDashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["seller-analytics"],
    queryFn: async () => {
      const res = await api.get("/seller/analytics");
      return res.data.data;
    },
  });

  const cards = [
    { title: "Total Revenue", value: `$${metrics?.TotalRevenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: "text-primary-400", bg: "bg-primary-500/10" },
    { title: "Total Orders", value: metrics?.TotalOrders || 0, icon: ShoppingBag, color: "text-success", bg: "bg-success/10" },
    { title: "Pending Fulfillment", value: metrics?.PendingOrders || 0, icon: PackageOpen, color: "text-warning", bg: "bg-warning/10" },
    { title: "Low Stock Alerts", value: metrics?.LowStockCount || 0, icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10" },
  ];

  if (isLoading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Store Overview</h1>
          <p className="text-foreground/60">Here is what is happening with your store today.</p>
        </div>
        <Link href="/seller/products/new" className="bg-foreground text-background font-semibold px-6 py-2.5 rounded-xl hover:bg-foreground/90 transition-all">
          + Add Product
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((card, i) => (
          <motion.div 
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <span className="flex items-center text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-md">
                +12% <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <h3 className="text-foreground/60 font-medium mb-1">{card.title}</h3>
            <p className="text-3xl font-black">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Recent Orders</h3>
            <Link href="/seller/orders" className="text-sm text-primary-400 font-medium hover:underline">View All</Link>
          </div>
          <div className="text-center py-12 border border-dashed border-border rounded-2xl">
            <ShoppingBag className="w-8 h-8 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/60">No recent orders in the last 24 hours.</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6">To-Do List</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-border">
              <div>
                <p className="font-semibold text-warning">{metrics?.PendingOrders || 0} Orders</p>
                <p className="text-xs text-foreground/60">Waiting to be shipped</p>
              </div>
              <Link href="/seller/orders" className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"><ArrowUpRight className="w-4 h-4" /></Link>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-border">
              <div>
                <p className="font-semibold text-danger">{metrics?.LowStockCount || 0} Products</p>
                <p className="text-xs text-foreground/60">Low on stock</p>
              </div>
              <Link href="/seller/inventory" className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"><ArrowUpRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
