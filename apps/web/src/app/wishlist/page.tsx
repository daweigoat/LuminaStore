"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { HeartCrack, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await api.get("/wishlist");
      return res.data.data;
    },
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 md:px-12 py-32 min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Your Wishlist</h1>
        <p className="text-foreground/60 max-w-md">
          Items you've saved for later. Keep track of what you love.
        </p>
      </div>

      {!wishlist || wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-border border-dashed rounded-3xl">
          <HeartCrack className="w-16 h-16 text-foreground/20 mb-6" />
          <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-foreground/60 mb-8 max-w-sm">
            Save items you love to your wishlist. Review them anytime and easily move them to your cart.
          </p>
          <Link href="/products" className="bg-foreground text-background font-semibold px-8 py-4 rounded-xl hover:bg-foreground/90 transition-all hover:scale-[1.02]">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item: any, i: number) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-3xl p-6 flex flex-col gap-6"
            >
              <div className="aspect-[4/3] bg-primary-900/10 rounded-2xl relative overflow-hidden group">
                <button className="absolute top-4 right-4 p-3 rounded-full bg-background/50 backdrop-blur border border-border text-danger hover:bg-danger/20 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <Link href={`/products/${item.Product.slug}`}>
                  <h3 className="font-semibold text-xl hover:text-primary-400 transition-colors mb-2">{item.Product.name}</h3>
                </Link>
                <div className="flex items-end justify-between mt-4">
                  <span className="text-xl font-bold">${item.Product.price}</span>
                  <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-border">
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
