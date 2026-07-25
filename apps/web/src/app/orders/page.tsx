"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { Package, ChevronRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/orders");
      return res.data.data;
    },
  });

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'bg-warning/20 text-warning border-warning/30';
      case 'processing': return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
      case 'shipped': return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
      case 'delivered': return 'bg-success/20 text-success border-success/30';
      case 'cancelled': return 'bg-danger/20 text-danger border-danger/30';
      default: return 'bg-white/10 text-white border-white/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'delivered': return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-12 py-32 min-h-screen max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Order History</h1>
        <p className="text-foreground/60 max-w-md">
          Track, manage, and review all your LuminaStore purchases.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-32 bg-card/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="border border-dashed border-border rounded-3xl p-16 flex flex-col items-center text-center">
          <Package className="w-12 h-12 text-foreground/20 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No orders found</h3>
          <p className="text-foreground/60 mb-6">You haven't placed any orders yet. Start shopping!</p>
          <Link href="/products" className="bg-foreground text-background font-semibold px-8 py-3 rounded-xl hover:bg-foreground/90 transition-transform hover:scale-[1.02]">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any, i: number) => (
            <motion.div 
              key={order.ID}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/orders/${order.ID}`}>
                <div className="bg-card border border-border hover:border-primary-500/50 rounded-2xl p-6 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:shadow-[0_0_30px_rgba(var(--primary-500),0.05)]">
                  
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-border">
                      <Package className="w-8 h-8 text-foreground/40" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-lg">{order.OrderNumber}</h3>
                        <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${getStatusColor(order.Status)}`}>
                          {getStatusIcon(order.Status)} {order.Status}
                        </span>
                      </div>
                      <p className="text-foreground/50 text-sm">{dayjs(order.CreatedAt).format("MMM DD, YYYY • h:mm A")}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-border">
                    <div className="text-left md:text-right">
                      <p className="text-foreground/50 text-sm mb-1">Total Amount</p>
                      <p className="font-bold text-xl">${order.FinalAmount.toFixed(2)}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-500/10 group-hover:text-primary-400 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
