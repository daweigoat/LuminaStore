import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  ShoppingBag, 
  BadgeDollarSign, 
  Image as ImageIcon,
  Settings,
  ShieldCheck
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <div className="w-72 border-r border-white/10 bg-black flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="h-20 flex items-center px-8 border-b border-white/10 gap-3">
          <ShieldCheck className="w-8 h-8 text-primary-500" />
          <span className="font-black text-xl tracking-tight">SuperAdmin</span>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-1">
          <div className="px-4 text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Platform</div>
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors font-medium">
            <LayoutDashboard className="w-5 h-5 text-white/50" /> Dashboard
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors font-medium">
            <Users className="w-5 h-5 text-white/50" /> Users & Roles
          </Link>
          <Link href="/admin/sellers" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors font-medium">
            <Store className="w-5 h-5 text-white/50" /> Sellers & KYC
          </Link>
          
          <div className="px-4 text-xs font-bold text-white/40 uppercase tracking-widest mt-8 mb-4">Operations</div>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors font-medium justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-white/50" /> Product Moderation
            </div>
            <span className="bg-primary-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">12</span>
          </Link>
          <Link href="/admin/finance" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors font-medium">
            <BadgeDollarSign className="w-5 h-5 text-white/50" /> Finance & Payouts
          </Link>
          
          <div className="px-4 text-xs font-bold text-white/40 uppercase tracking-widest mt-8 mb-4">CMS</div>
          <Link href="/admin/cms" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors font-medium">
            <ImageIcon className="w-5 h-5 text-white/50" /> Homepage & Banners
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors font-medium">
            <Settings className="w-5 h-5 text-white/50" /> System Settings
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center justify-end px-8 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold">Admin User</p>
              <p className="text-xs text-primary-400 font-medium">Super Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(var(--primary-500),0.5)]">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
