package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/luminastore/api/internal/api/controllers"
	"github.com/luminastore/api/internal/middleware"
)

func SetupRoutes(app *fiber.App) {
	// Apply Global Security Hardening
	app.Use(middleware.SecurityHeaders())
	app.Use(middleware.RateLimiter())
	// Uncomment the following in production after configuring frontend headers
	// app.Use(middleware.CSRFProtection())

	// WebSocket Route
	app.Use("/ws", controllers.UpgradeWS)
	app.Get("/ws", controllers.HandleWS)

	api := app.Group("/api/v1")

	// Health Check
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "message": "LuminaStore API is running"})
	})

	// Auth Routes
	auth := api.Group("/auth")
	auth.Post("/login", controllers.Login)
	auth.Post("/register", controllers.Register)
	auth.Post("/refresh", controllers.Refresh)
	auth.Get("/google/login", controllers.GoogleLogin)
	auth.Get("/google/callback", controllers.GoogleCallback)

	// Users Routes
	users := api.Group("/users", middleware.Protected())
	users.Get("/me", controllers.GetMe)
	users.Put("/me", controllers.UpdateMe)

	// Products Routes
	products := api.Group("/products")
	products.Get("/", controllers.GetProducts)
	products.Get("/:slug", controllers.GetProductDetails)

	// Cart Routes (Protected)
	cart := api.Group("/cart", middleware.Protected())
	cart.Get("/", controllers.GetCart)
	cart.Post("/", controllers.UpdateCart)

	// Wishlist Routes (Protected)
	wishlist := api.Group("/wishlist", middleware.Protected())
	wishlist.Get("/", controllers.GetWishlist)
	wishlist.Post("/", controllers.AddToWishlist)
	wishlist.Delete("/:id", controllers.RemoveFromWishlist)

	// Orders Routes (Protected)
	orders := api.Group("/orders", middleware.Protected())
	orders.Post("/", controllers.CreateOrder)
	orders.Get("/", controllers.GetOrders)
	orders.Get("/:id", controllers.GetOrderDetails)

	// Addresses Routes (Protected)
	addresses := api.Group("/addresses", middleware.Protected())
	addresses.Get("/", controllers.GetAddresses)
	addresses.Post("/", controllers.AddAddress)
	addresses.Delete("/:id", controllers.DeleteAddress)

	// Checkout Routes (Protected)
	checkout := api.Group("/checkout", middleware.Protected())
	checkout.Post("/calculate", controllers.CalculateCheckout)

	// Payment Routes (Protected)
	payment := api.Group("/payment", middleware.Protected())
	payment.Get("/methods", controllers.GetPaymentMethods)
	payment.Post("/process", controllers.ProcessPayment)

	// Seller Routes (Protected)
	seller := api.Group("/seller", middleware.Protected())
	
	// Seller Products
	seller.Get("/products", controllers.GetSellerProducts)
	seller.Post("/products", controllers.CreateSellerProduct)
	seller.Put("/products/:id/status", controllers.UpdateProductStatus)
	
	// Seller Orders
	seller.Get("/orders", controllers.GetSellerOrders)
	seller.Put("/orders/:id/status", controllers.UpdateSellerOrderStatus)
	
	// Seller Dashboard & Analytics
	seller.Get("/analytics", controllers.GetSellerDashboardMetrics)
	seller.Get("/dashboard", controllers.GetSellerDashboardMetrics)

	// Admin Routes (Protected with RBAC)
	admin := api.Group("/admin", middleware.Protected())
	
	// Example of checking specific permissions based on the matrix
	admin.Get("/dashboard", middleware.RequirePermission("analytics.view"), controllers.GetAdminDashboard)
	
	admin.Get("/users", middleware.RequirePermission("users.view"), controllers.GetAdminUsers)
	admin.Put("/users/:id/status", middleware.RequirePermission("users.suspend"), controllers.UpdateUserStatus)
	
	admin.Get("/sellers", middleware.RequirePermission("sellers.view"), controllers.GetAdminSellers)
	admin.Put("/sellers/:id/status", middleware.RequirePermission("sellers.approve"), controllers.UpdateStoreStatus)
	
	admin.Get("/products/pending", middleware.RequirePermission("products.view"), controllers.GetPendingProducts)
	admin.Put("/products/:id/moderate", middleware.RequirePermission("products.approve"), controllers.ModerateProduct)
	
	admin.Get("/finance/withdrawals", middleware.RequirePermission("finance.view"), controllers.GetPendingWithdrawals)
	admin.Put("/finance/withdrawals/:id/approve", middleware.RequirePermission("finance.withdraw"), controllers.ApproveWithdrawal)
}
