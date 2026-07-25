package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/models"
)

func GetAddresses(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	var addresses []models.Address
	
	if err := db.DB.Where("user_id = ?", userID).Find(&addresses).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch addresses"})
	}

	return c.JSON(fiber.Map{"data": addresses})
}

func AddAddress(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	
	var addr models.Address
	if err := c.BodyParser(&addr); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	uID, _ := uuid.Parse(userID)
	addr.UserID = uID

	// If it's the first address or set as default, update others
	if addr.IsDefault {
		db.DB.Model(&models.Address{}).Where("user_id = ?", uID).Update("is_default", false)
	}

	if err := db.DB.Create(&addr).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create address"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"data": addr})
}

func DeleteAddress(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	id := c.Params("id")

	if err := db.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Address{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete address"})
	}

	return c.JSON(fiber.Map{"message": "Address deleted"})
}
