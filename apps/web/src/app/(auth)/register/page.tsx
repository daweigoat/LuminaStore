"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-accent-900/10 to-background pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-accent-600/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 px-4"
      >
        <div className="bg-card/50 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl shadow-black/50">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
            <p className="text-foreground/50 text-sm">Join LuminaStore today</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input 
                  type="email" 
                  placeholder="you@example.com"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 transition-all"
                />
              </div>
            </div>

            <button type="button" className="w-full bg-foreground text-background font-semibold py-3 rounded-xl mt-6 hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 group">
              Create Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-sm text-foreground/50 mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-foreground font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
