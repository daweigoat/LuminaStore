"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CreditCard, Wallet, QrCode, Building, ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [selectedMethod, setSelectedMethod] = useState("");

  const { data: order, isLoading: isOrderLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const res = await api.get(`/orders/${orderId}`);
      return res.data.data;
    },
    enabled: !!orderId,
  });

  const { data: methods } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: async () => {
      const res = await api.get("/payment/methods");
      return res.data.data;
    },
  });

  const processPaymentMutation = useMutation({
    mutationFn: () => api.post("/payment/process", {
      order_id: orderId,
      method: selectedMethod,
    }),
    onSuccess: () => {
      // Go to order details after success
      router.push(`/orders/${orderId}`);
    },
  });

  if (!orderId) {
    return <div className="min-h-screen flex items-center justify-center">Invalid Order.</div>;
  }

  if (isOrderLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "QRIS": return <QrCode className="w-6 h-6" />;
      case "Virtual Account": return <Building className="w-6 h-6" />;
      case "Bank Transfer": return <Building className="w-6 h-6" />;
      case "E-Wallet": return <Wallet className="w-6 h-6" />;
      case "Credit Card": return <CreditCard className="w-6 h-6" />;
      default: return <CreditCard className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-24 pb-12">
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl bg-card border border-border rounded-[2rem] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary-900/10 p-8 border-b border-border text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-primary-400" />
            <ShieldCheck className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Secure Payment Gateway</h1>
            <p className="text-foreground/60">Order {order.OrderNumber}</p>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center bg-white/5 rounded-2xl p-6 mb-8 border border-border">
              <span className="font-medium text-foreground/80">Total to Pay</span>
              <span className="text-3xl font-bold text-primary-400">${order.FinalAmount.toFixed(2)}</span>
            </div>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/50 mb-4">Select Payment Method</h3>
            
            <div className="space-y-3 mb-8">
              {methods?.map((method: string) => (
                <div 
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
                    selectedMethod === method 
                      ? 'border-primary-500 bg-primary-500/10 shadow-[0_0_20px_rgba(var(--primary-500),0.1)]' 
                      : 'border-border hover:border-foreground/30 hover:bg-white/5'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selectedMethod === method ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-foreground/60'}`}>
                    {getMethodIcon(method)}
                  </div>
                  <span className="font-semibold text-lg flex-1">{method}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === method ? 'border-primary-500' : 'border-border'}`}>
                    {selectedMethod === method && <div className="w-3 h-3 rounded-full bg-primary-500" />}
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => processPaymentMutation.mutate()}
              disabled={!selectedMethod || processPaymentMutation.isPending}
              className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed bg-primary-600 hover:bg-primary-500 hover:scale-[1.02] shadow-xl shadow-primary-500/20"
            >
              {processPaymentMutation.isPending ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Processing Payment...
                </>
              ) : (
                `Pay $${order.FinalAmount.toFixed(2)}`
              )}
            </button>
            <p className="text-center text-xs text-foreground/40 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Your payment is encrypted and secure
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
