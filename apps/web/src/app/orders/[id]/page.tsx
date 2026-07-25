"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Package, MapPin, CreditCard, Truck, FileText, CheckCircle2 } from "lucide-react";
import dayjs from "dayjs";

export default function OrderDetailsPage() {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await api.get(`/orders/${id}`);
      return res.data.data;
    },
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center">Order not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 md:px-12 py-32 min-h-screen max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <Link href="/orders" className="text-sm font-medium text-primary-400 hover:underline mb-4 inline-block">&larr; Back to Orders</Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Order {order.OrderNumber}</h1>
          <p className="text-foreground/60">Placed on {dayjs(order.CreatedAt).format("MMMM D, YYYY at h:mm A")}</p>
        </div>
        <Link 
          href={`/invoice/${order.ID}`}
          target="_blank"
          className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-border rounded-xl hover:bg-white/10 transition-colors font-medium"
        >
          <FileText className="w-4 h-4" /> View Invoice
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Order Items */}
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Package className="w-5 h-5 text-primary-400" /> Items Ordered</h3>
            <div className="space-y-6">
              {order.OrderItems?.map((item: any) => (
                <div key={item.ID} className="flex gap-6">
                  <div className="w-24 h-24 bg-white/5 rounded-2xl border border-border flex-shrink-0" />
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-semibold text-lg">{item.ProductID}</h4>
                    <p className="text-foreground/60 mb-2">Qty: {item.Quantity}</p>
                    <p className="font-bold">${item.UnitPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-8">Order Timeline</h3>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border">
              {order.StatusLogs?.map((log: any, index: number) => (
                <div key={log.ID} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-card bg-primary-500 text-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-primary-500/20 z-10">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white/5 p-6 rounded-2xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-lg capitalize">{log.Status}</h4>
                      <time className="text-xs font-medium text-foreground/50">{dayjs(log.CreatedAt).format("MMM D, h:mm A")}</time>
                    </div>
                    <p className="text-sm text-foreground/70">{log.Notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          {/* Summary */}
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-lg font-bold mb-6">Payment Summary</h3>
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-foreground/60">Subtotal</span>
                <span className="font-medium">${order.TotalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Shipping</span>
                <span className="font-medium">${order.ShippingCost.toFixed(2)}</span>
              </div>
              {order.DiscountAmount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span className="font-medium">-${order.DiscountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-foreground/60">Tax</span>
                <span className="font-medium">${order.TaxAmount.toFixed(2)}</span>
              </div>
            </div>
            <div className="h-px w-full bg-border mb-6" />
            <div className="flex justify-between items-end mb-6">
              <span className="font-medium">Total</span>
              <span className="text-3xl font-bold text-primary-400">${order.FinalAmount.toFixed(2)}</span>
            </div>

            {order.Status === "pending" && (
              <Link href={`/payment?order_id=${order.ID}`} className="w-full block text-center py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-colors">
                Pay Now
              </Link>
            )}
          </div>

          {/* Details */}
          <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-3 text-sm text-foreground/60 uppercase tracking-wider">
                <MapPin className="w-4 h-4" /> Shipping Address
              </h4>
              <p className="text-sm leading-relaxed">{order.ShippingAddress}</p>
            </div>
            <div className="h-px w-full bg-border" />
            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-3 text-sm text-foreground/60 uppercase tracking-wider">
                <Truck className="w-4 h-4" /> Shipping Method
              </h4>
              <p className="text-sm font-medium">{order.ShippingMethod || "Standard Shipping"}</p>
            </div>
            <div className="h-px w-full bg-border" />
            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-3 text-sm text-foreground/60 uppercase tracking-wider">
                <CreditCard className="w-4 h-4" /> Payment Status
              </h4>
              <p className="text-sm font-medium capitalize flex items-center gap-2">
                {order.Payments?.[0] ? (
                  <>
                    <span className={`w-2 h-2 rounded-full ${order.Payments[0].Status === 'success' ? 'bg-success' : 'bg-warning'}`} />
                    {order.Payments[0].Method} ({order.Payments[0].Status})
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    Pending Payment
                  </>
                )}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
