"use client";

import { Store, UploadCloud, Save } from "lucide-react";

export default function SellerSettings() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Store Profile</h1>
        <p className="text-foreground/60">Manage your store's public appearance and policies.</p>
      </div>

      <div className="space-y-8">
        
        {/* Profile Image & Banner */}
        <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-500/20 to-purple-500/20 border-b border-border flex items-center justify-center">
            <button className="flex items-center gap-2 bg-background/50 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold hover:bg-background/80 transition-colors">
              <UploadCloud className="w-4 h-4" /> Change Banner
            </button>
          </div>
          
          <div className="pt-20 flex items-end gap-6 relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-background border-4 border-card flex items-center justify-center shadow-xl overflow-hidden relative group">
              <Store className="w-10 h-10 text-foreground/20" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <UploadCloud className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="pb-2">
              <h2 className="text-2xl font-black">My Premium Store</h2>
              <p className="text-foreground/60">Verified Seller Badge ✅</p>
            </div>
          </div>
        </div>

        {/* Details Form */}
        <div className="bg-card border border-border rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6">Store Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Store Name</label>
              <input type="text" defaultValue="My Premium Store" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea rows={4} defaultValue="The best place to buy premium goods." className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Return Policy</label>
              <textarea rows={4} defaultValue="Returns accepted within 7 days of delivery for unboxed items." className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none"></textarea>
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-card border border-border rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6">Supported Couriers</h3>
          <div className="space-y-3">
            {["JNE", "J&T Express", "SiCepat", "AnterAja"].map(courier => (
              <label key={courier} className="flex items-center gap-3 p-4 bg-background border border-border rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border text-primary-500 focus:ring-primary-500 focus:ring-offset-background bg-transparent" />
                <span className="font-semibold">{courier}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center gap-2 bg-foreground text-background font-semibold px-8 py-3 rounded-xl hover:bg-foreground/90 transition-colors">
            <Save className="w-5 h-5" /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
