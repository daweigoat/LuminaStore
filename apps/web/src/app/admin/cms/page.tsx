"use client";

import { useState } from "react";
import { Plus, Image as ImageIcon, Trash2, Edit } from "lucide-react";

export default function AdminCMS() {
  const [banners, setBanners] = useState([
    { id: 1, title: "Summer Sale", image_url: "https://pub-xxxxxx.r2.dev/banners/summer-sale.jpg", is_active: true },
    { id: 2, title: "Tech Week", image_url: "https://pub-xxxxxx.r2.dev/banners/tech-week.jpg", is_active: false },
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Content Management</h1>
          <p className="text-white/50">Manage homepage banners, carousels, and announcements.</p>
        </div>
        <button className="bg-primary-500 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-600 transition-colors">
          <Plus className="w-5 h-5" /> Add Banner
        </button>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-bold text-lg">Homepage Banners</h2>
        </div>
        
        <div className="divide-y divide-white/10">
          {banners.map((b) => (
            <div key={b.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-48 h-24 bg-[#0a0a0a] border border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
                  <ImageIcon className="w-8 h-8 text-white/20" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{b.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`w-2 h-2 rounded-full ${b.is_active ? 'bg-success' : 'bg-white/20'}`}></span>
                    <span className="text-sm font-semibold text-white/50">{b.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="p-3 bg-white/5 text-white/70 rounded-xl hover:bg-white/10 hover:text-white transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-3 bg-error/10 text-error rounded-xl hover:bg-error hover:text-white transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
