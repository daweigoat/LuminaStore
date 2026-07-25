package middleware

import (
	"time"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
)

// SecurityHeaders applies CSP, XSS protection, and secure headers to every request
func SecurityHeaders() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Content Security Policy
		c.Set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ws: wss: https:")
		// XSS Protection
		c.Set("X-XSS-Protection", "1; mode=block")
		// Prevent MIME-sniffing
		c.Set("X-Content-Type-Options", "nosniff")
		// Prevent Clickjacking
		c.Set("X-Frame-Options", "SAMEORIGIN")
		// Strict Transport Security (HSTS)
		c.Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

		return c.Next()
	}
}

// RateLimiter configures a global Redis-backed or Memory-backed rate limit
func RateLimiter() fiber.Handler {
	return limiter.New(limiter.Config{
		Max:        100, // max count of connections
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Too many requests. Please try again later.",
			})
		},
	})
}
