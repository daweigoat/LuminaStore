"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products?limit=3");
      return res.data;
    },
  });

  const products = productsData?.data || [];

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out" }
      );
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 to-background pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/30 blur-[120px] rounded-full pointer-events-none" />
        
        <div ref={heroRef} className="z-10 text-center flex flex-col items-center gap-6 px-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-foreground/80">Discover Premium Collections</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/60">
            Elevate Your <br /> Shopping Experience.
          </h1>
          <p className="text-lg md:text-xl text-foreground/60 max-w-[600px]">
            LuminaStore is a curated luxury marketplace designed for those who appreciate the finer things. Explore our exclusive catalog.
          </p>
          <div className="flex gap-4 mt-4">
            <button className="px-8 py-4 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-foreground/20">
              Shop Now
            </button>
            <button className="px-8 py-4 rounded-xl bg-transparent border border-border text-foreground font-semibold hover:bg-foreground/5 transition-all">
              Explore Brands
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4 md:px-12 lg:px-24">
        <h2 className="text-3xl font-bold mb-12 tracking-tight">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product: any, i: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group"
              >
                <Link href={`/products/${product.slug}`}>
                  <div className="relative aspect-[4/5] bg-card border border-border rounded-3xl overflow-hidden mb-6">
                    <div className="absolute inset-0 bg-primary-900/10 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    <div className="absolute top-4 right-4 bg-background/50 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold border border-white/10">
                      New
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-1 group-hover:text-primary-400 transition-colors">{product.name}</h3>
                      <p className="text-foreground/60 text-sm line-clamp-1">{product.description}</p>
                    </div>
                    <span className="text-lg font-bold">${product.price}</span>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card/50 aspect-[4/5] rounded-3xl mb-6" />
                <div className="bg-card/50 h-6 w-3/4 rounded mb-2" />
                <div className="bg-card/50 h-4 w-1/2 rounded" />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
