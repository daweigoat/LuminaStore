package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/models"
)

// GetMe retrieves the currently authenticated user's profile
func GetMe(c *fiber.Ctx) error {
	userID := c.Locals("userID")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var user models.User
	if err := db.DB.First(&user, "id = ?", userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	return c.JSON(fiber.Map{"data": user})
}

// UpdateMe updates the authenticated user's profile
func UpdateMe(c *fiber.Ctx) error {
	userID := c.Locals("userID")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var req struct {
		FullName string `json:"full_name"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	if err := db.DB.Model(&models.User{}).Where("id = ?", userID).Update("full_name", req.FullName).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update profile"})
	}

	return c.JSON(fiber.Map{"message": "Profile updated successfully"})
}
