"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Settings, MessageSquare, Menu, Store } from "lucide-react";
import { useState } from "react";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/seller/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/seller/products", icon: Package },
    { name: "Orders", href: "/seller/orders", icon: ShoppingBag },
    { name: "Analytics", href: "/seller/analytics", icon: BarChart3 },
    { name: "Reviews", href: "/seller/reviews", icon: MessageSquare },
    { name: "Settings", href: "/seller/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card z-20 sticky top-0">
        <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
          <Store className="w-6 h-6 text-primary-500" /> LuminaSeller
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-10 w-64 h-screen bg-card border-r border-border transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-2 font-black text-2xl tracking-tighter mb-8">
          <Store className="w-8 h-8 text-primary-500" /> LuminaSeller
        </div>

        <nav className="px-4 space-y-2 mt-8 md:mt-0">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                  ${isActive 
                    ? 'bg-primary-500 text-background shadow-lg shadow-primary-500/20' 
                    : 'text-foreground/70 hover:bg-white/5 hover:text-foreground'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden pt-8 px-4 md:px-8 pb-24">
        {children}
      </main>

    </div>
  );
}
