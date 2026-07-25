package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/luminastore/api/internal/api/routes"
	"github.com/luminastore/api/internal/config"
	"github.com/luminastore/api/internal/db"
)

func main() {
	cfg := config.Load()

	// Connect to Database
	db.ConnectPostgres(cfg.DatabaseURL)
	db.ConnectRedis(cfg.RedisURL)
	db.ConnectMeilisearch()

	// Initialize Fiber app
	app := fiber.New(fiber.Config{
		AppName: "LuminaStore API",
	})

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(helmet.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // Configure based on environment
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	// Setup Routes
	routes.SetupRoutes(app)

	// Start server
	log.Printf("Starting LuminaStore API on port %s", cfg.Port)
	err := app.Listen(":" + cfg.Port)
	if err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
