"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  
  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data.data;
    },
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" 
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Your Cart
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!cart || cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-foreground/50 gap-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-background border border-border">
                    <div className="w-20 h-20 bg-primary-900/20 rounded-xl" />
                    <div className="flex-1 flex flex-col">
                      <h4 className="font-semibold">{item.product_id}</h4>
                      <p className="text-primary-500 font-medium mt-auto">${item.price}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button className="text-danger/80 hover:text-danger transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-3 bg-white/5 rounded-lg px-2 py-1">
                        <button><Minus className="w-3 h-3" /></button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-border bg-background">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-foreground/80">Subtotal</span>
                <span className="text-xl font-bold">$0.00</span>
              </div>
              <button className="w-full bg-foreground text-background font-semibold py-4 rounded-xl hover:bg-foreground/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
