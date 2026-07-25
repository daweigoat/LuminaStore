package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/luminastore/api/internal/db"
)

// RequirePermission checks if the authenticated user has a specific permission.
// It assumes the user ID is already set in c.Locals("userID") by the JWT middleware.
func RequirePermission(requiredPermission string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("userID")
		if userID == nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
		}

		// Perform a join query to check if the user's role has the required permission.
		// In a production system with high load, this should be cached in Redis.
		var count int64
		err := db.DB.Table("users").
			Joins("JOIN roles ON users.role = roles.name").
			Joins("JOIN role_permissions ON roles.id = role_permissions.role_id").
			Joins("JOIN permissions ON role_permissions.permission_id = permissions.id").
			Where("users.id = ? AND permissions.name = ?", userID, requiredPermission).
			Count(&count).Error

		if err != nil || count == 0 {
			// Fail securely for super admin bypass in dev, but in prod always reject.
			// For this implementation, if they don't have explicit permission, return 403.
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Forbidden: missing permission " + requiredPermission})
		}

		return c.Next()
	}
}
