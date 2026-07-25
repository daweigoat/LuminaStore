"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-900/10 to-background pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 px-4"
      >
        <div className="bg-card/50 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl shadow-black/50">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
            <p className="text-foreground/50 text-sm">Sign in to your Lumina account</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input 
                  type="email" 
                  placeholder="you@example.com"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground/80">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary-500 hover:text-primary-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            <button type="button" className="w-full bg-foreground text-background font-semibold py-3 rounded-xl mt-6 hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 group">
              Sign In
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-foreground/40 uppercase tracking-wider">or continue with</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <button type="button" className="w-full bg-background border border-border text-foreground font-semibold py-3 rounded-xl mt-6 hover:bg-white/5 transition-all flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

          <p className="text-center text-sm text-foreground/50 mt-8">
            Don't have an account?{" "}
            <Link href="/register" className="text-foreground font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
