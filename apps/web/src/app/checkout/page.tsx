"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ShieldCheck, Truck, ChevronRight, CheckCircle2, Ticket } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [voucherCode, setVoucherCode] = useState("");

  const { data: addresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await api.get("/addresses");
      return res.data.data;
    },
  });

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data.data;
    },
  });

  const { data: checkoutDetails, refetch: calculateCheckout } = useQuery({
    queryKey: ["checkout-calculate", selectedShipping, voucherCode],
    queryFn: async () => {
      const res = await api.post("/checkout/calculate", {
        shipping_method: selectedShipping,
        voucher_code: voucherCode,
        destination: "Jakarta", // Mock destination
      });
      return res.data.data;
    },
    enabled: cart?.length > 0,
  });

  const placeOrderMutation = useMutation({
    mutationFn: () => api.post("/orders", {
      shipping_address: selectedAddress,
      shipping_method: selectedShipping,
      voucher_code: voucherCode,
      notes: "Please pack securely",
    }),
    onSuccess: (res) => {
      // Redirect to payment page with order ID
      router.push(`/payment?order_id=${res.data.data.ID}`);
    },
  });

  // Auto select default address
  useEffect(() => {
    if (addresses && !selectedAddress) {
      const def = addresses.find((a: any) => a.IsDefault);
      if (def) setSelectedAddress(def.ID);
      else if (addresses.length > 0) setSelectedAddress(addresses[0].ID);
    }
  }, [addresses]);

  if (!cart || cart.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto px-4 md:px-12 py-32 min-h-screen max-w-6xl">
      <h1 className="text-4xl font-bold tracking-tight mb-12">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column - Steps */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Step 1: Address */}
          <div className={`p-8 rounded-3xl border transition-all ${step === 1 ? 'border-primary-500 bg-primary-500/5' : 'border-border bg-card'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-sm font-bold">1</span>
                Shipping Address
              </h2>
              {step > 1 && <CheckCircle2 className="w-6 h-6 text-success" />}
            </div>
            
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {addresses?.map((addr: any) => (
                  <div 
                    key={addr.ID} 
                    onClick={() => setSelectedAddress(addr.ID)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${selectedAddress === addr.ID ? 'border-primary-500 bg-primary-500/10' : 'border-border hover:border-foreground/30'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{addr.RecipientName}</h3>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddress === addr.ID ? 'border-primary-500' : 'border-border'}`}>
                        {selectedAddress === addr.ID && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                      </div>
                    </div>
                    <p className="text-foreground/80 text-sm mb-1">{addr.Phone}</p>
                    <p className="text-foreground/60 text-sm">{addr.Street}, {addr.City}, {addr.State} {addr.PostalCode}</p>
                  </div>
                ))}
                
                <button 
                  onClick={() => router.push('/addresses')}
                  className="w-full py-4 border border-dashed border-border rounded-2xl text-foreground/60 hover:text-foreground hover:bg-white/5 transition-colors font-medium"
                >
                  + Add New Address
                </button>
                
                <div className="flex justify-end mt-6">
                  <button 
                    disabled={!selectedAddress}
                    onClick={() => setStep(2)}
                    className="bg-foreground text-background px-8 py-3 rounded-xl font-semibold hover:bg-foreground/90 transition-transform hover:scale-[1.02] disabled:opacity-50"
                  >
                    Continue to Shipping
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Step 2: Shipping Method */}
          <div className={`p-8 rounded-3xl border transition-all ${step === 2 ? 'border-primary-500 bg-primary-500/5' : 'border-border bg-card'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-foreground/40'}`}>2</span>
                Shipping Method
              </h2>
              {step > 2 && <CheckCircle2 className="w-6 h-6 text-success" />}
            </div>

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {checkoutDetails?.available_shipping_methods?.map((method: any) => (
                  <div 
                    key={method.service_name} 
                    onClick={() => setSelectedShipping(method.service_name)}
                    className={`p-6 rounded-2xl border cursor-pointer flex justify-between items-center transition-all ${selectedShipping === method.service_name ? 'border-primary-500 bg-primary-500/10' : 'border-border hover:border-foreground/30'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-xl">
                        <Truck className="w-6 h-6 text-primary-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{method.service_name}</h4>
                        <p className="text-sm text-foreground/60">Estimated: {method.estimated_delivery_days} days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-bold">${method.shipping_cost.toFixed(2)}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedShipping === method.service_name ? 'border-primary-500' : 'border-border'}`}>
                        {selectedShipping === method.service_name && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(1)} className="px-6 py-3 font-medium text-foreground/60 hover:text-foreground">Back</button>
                  <button 
                    disabled={!selectedShipping}
                    onClick={() => setStep(3)}
                    className="bg-foreground text-background px-8 py-3 rounded-xl font-semibold hover:bg-foreground/90 transition-transform hover:scale-[1.02] disabled:opacity-50"
                  >
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Step 3: Review & Payment */}
          <div className={`p-8 rounded-3xl border transition-all ${step === 3 ? 'border-primary-500 bg-primary-500/5' : 'border-border bg-card'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 3 ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-foreground/40'}`}>3</span>
                Review Order
              </h2>
            </div>
            
            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="p-6 bg-white/5 border border-border rounded-2xl mb-6">
                  <h4 className="font-medium mb-4 flex items-center gap-2"><Ticket className="w-4 h-4 text-primary-400" /> Apply Voucher</h4>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Enter promo code" 
                      className="flex-1 bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-primary-500 uppercase"
                    />
                    <button 
                      onClick={() => calculateCheckout()}
                      className="bg-white/10 px-6 rounded-xl font-medium hover:bg-white/20 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-primary-500/10 border border-primary-500/20 rounded-2xl p-6 mb-6">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-primary-400"><ShieldCheck className="w-5 h-5" /> Secure Checkout</h4>
                    <p className="text-sm text-foreground/60 mt-1">Your payment will be processed securely on the next step.</p>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(2)} className="px-6 py-3 font-medium text-foreground/60 hover:text-foreground">Back</button>
                  <button 
                    onClick={() => placeOrderMutation.mutate()}
                    disabled={placeOrderMutation.isPending}
                    className="bg-primary-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-500 transition-transform hover:scale-[1.02] shadow-lg shadow-primary-500/20 flex items-center gap-2 disabled:opacity-50"
                  >
                    {placeOrderMutation.isPending ? "Processing..." : "Place Order & Pay"} <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <div className="sticky top-32 p-8 rounded-3xl bg-card border border-border">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cart.map((item: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="w-16 h-16 bg-white/5 rounded-xl border border-border flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-2">{item.product_id}</h4>
                    <p className="text-foreground/50 text-xs mt-1">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="h-px w-full bg-border my-6" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/60">Subtotal</span>
                <span className="font-medium">${checkoutDetails?.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Shipping</span>
                <span className="font-medium">${checkoutDetails?.shipping_cost?.toFixed(2) || '0.00'}</span>
              </div>
              {checkoutDetails?.discount_amount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span className="font-medium">-${checkoutDetails?.discount_amount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-foreground/60">Tax (11%)</span>
                <span className="font-medium">${checkoutDetails?.tax_amount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            <div className="h-px w-full bg-border my-6" />
            
            <div className="flex justify-between items-end">
              <span className="font-medium">Total</span>
              <span className="text-3xl font-bold text-primary-400">
                ${checkoutDetails?.final_amount?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
