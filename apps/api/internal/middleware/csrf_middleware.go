package middleware

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/csrf"
	"github.com/gofiber/fiber/v2/utils"
)

// CSRFProtection configures CSRF tokens for form submissions and state mutations
func CSRFProtection() fiber.Handler {
	return csrf.New(csrf.Config{
		KeyLookup:      "header:X-CSRF-Token",
		CookieName:     "csrf_",
		CookieSameSite: "Strict",
		CookieSecure:   true,
		CookieHTTPOnly: true,
		Expiration:     1 * time.Hour,
		KeyGenerator:   utils.UUID,
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "CSRF token validation failed or missing.",
			})
		},
	})
}
