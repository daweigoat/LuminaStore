export function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 bg-card">
      <div className="container mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold tracking-tighter">Lumina</h3>
          <p className="text-foreground/50 text-sm max-w-xs">
            Elevating the standard of online shopping. A premium marketplace for the modern world.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-foreground/50">
            <li><a href="#" className="hover:text-foreground transition-colors">New Arrivals</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Best Sellers</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">On Sale</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">All Products</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-foreground/50">
            <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Track Order</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Stay in the loop</h4>
          <p className="text-sm text-foreground/50 mb-4">Join our newsletter for exclusive offers and updates.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors"
            />
            <button className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-semibold hover:bg-foreground/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-12 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-foreground/40">
        <p>&copy; {new Date().getFullYear()} LuminaStore. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}
