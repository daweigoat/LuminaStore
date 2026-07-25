"use client";

import { motion } from "framer-motion";
import { Search, ShoppingBag, Heart, User, Menu } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/70 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            Lumina
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
            <Link href="/new" className="hover:text-foreground transition-colors">New Arrivals</Link>
            <Link href="/brands" className="hover:text-foreground transition-colors">Brands</Link>
            <Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link>
            <Link href="/sale" className="text-danger hover:text-danger/80 transition-colors">Sale</Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 hover:bg-white/10 transition-colors cursor-pointer group">
            <Search className="w-4 h-4 text-foreground/50 group-hover:text-foreground/80 transition-colors" />
            <span className="ml-2 text-sm text-foreground/50 group-hover:text-foreground/80">Search...</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="hover:scale-110 transition-transform"><Heart className="w-5 h-5" /></button>
            <button className="hover:scale-110 transition-transform relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] font-bold rounded-full flex items-center justify-center text-white">0</span>
            </button>
            <button className="hover:scale-110 transition-transform"><User className="w-5 h-5" /></button>
            <button className="md:hidden hover:scale-110 transition-transform"><Menu className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
