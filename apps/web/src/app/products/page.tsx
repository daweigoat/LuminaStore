"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Filter, Search, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  
  const { data, isLoading } = useQuery({
    queryKey: ["products", search],
    queryFn: async () => {
      const res = await api.get(`/products?q=${search}`);
      return res.data;
    },
  });

  return (
    <div className="container mx-auto px-4 md:px-12 py-32 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">All Products</h1>
          <p className="text-foreground/60 max-w-md">
            Explore our curated collection of premium items. Finding the perfect piece has never been easier.
          </p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-xl hover:bg-white/5 transition-colors font-medium">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-xl hover:bg-white/5 transition-colors font-medium">
            Sort <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-card/50 aspect-[4/5] rounded-2xl mb-4" />
              <div className="bg-card/50 h-4 w-2/3 rounded mb-2" />
              <div className="bg-card/50 h-4 w-1/3 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.data?.map((product: any, i: number) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-[4/5] rounded-2xl bg-card border border-border overflow-hidden mb-4">
                  {/* Image placeholder */}
                  <div className="absolute inset-0 bg-primary-900/10 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold border border-white/10">
                    New
                  </div>
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary-400 transition-colors">{product.name}</h3>
                <p className="text-foreground/60 text-sm mt-1 mb-2 line-clamp-1">{product.description}</p>
                <span className="font-bold text-lg">${product.price}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
