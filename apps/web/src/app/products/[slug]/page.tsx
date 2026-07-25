"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import { Heart, ShoppingBag, Star, Shield, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await api.get(`/products/${slug}`);
      return res.data.data;
    },
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 md:px-12 py-32 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Gallery */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[4/5] md:aspect-square bg-card border border-border rounded-3xl overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-primary-900/10" />
            <button className="absolute top-6 right-6 p-4 rounded-full bg-background/50 backdrop-blur border border-border hover:bg-background/80 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-card border border-border rounded-xl cursor-pointer hover:border-primary-500 transition-colors" />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-warning">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 text-foreground/20" />
            </div>
            <span className="text-sm font-medium">4.2 (128 reviews)</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
          <p className="text-2xl text-primary-400 font-semibold mb-6">${product.price}</p>
          <p className="text-foreground/70 leading-relaxed mb-8">{product.description}</p>
          
          <div className="h-px w-full bg-border mb-8" />
          
          {/* Variants */}
          <div className="mb-8">
            <h3 className="text-sm font-medium uppercase tracking-wider text-foreground/60 mb-4">Select Option</h3>
            <div className="flex gap-4">
              {['Default'].map((opt, i) => (
                <button 
                  key={opt}
                  onClick={() => setSelectedVariant(i)}
                  className={`px-6 py-3 rounded-xl border font-medium transition-all ${
                    selectedVariant === i 
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400' 
                      : 'border-border hover:border-foreground/30'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-auto pt-8">
            <div className="flex items-center border border-border rounded-xl overflow-hidden h-14 bg-card">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 h-full hover:bg-white/5 transition-colors font-medium text-lg"
              >-</button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 h-full hover:bg-white/5 transition-colors font-medium text-lg"
              >+</button>
            </div>
            <button className="flex-1 bg-foreground text-background font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <ShoppingBag className="w-5 h-5" /> Add to Cart
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-card/50 border border-border rounded-xl">
              <Shield className="w-5 h-5 text-primary-400" />
              <span className="text-sm font-medium">1 Year Warranty</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card/50 border border-border rounded-xl">
              <ArrowRight className="w-5 h-5 text-primary-400" />
              <span className="text-sm font-medium">Free Returns</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
