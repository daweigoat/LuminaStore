package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/models"
)

type Wishlist struct {
	models.Base
	UserID    uuid.UUID
	ProductID uuid.UUID
	Product   models.Product
}

func GetWishlist(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	var wishlist []Wishlist

	if err := db.DB.Preload("Product").Where("user_id = ?", userID).Find(&wishlist).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch wishlist"})
	}

	return c.JSON(fiber.Map{"data": wishlist})
}

func AddToWishlist(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	
	var req struct {
		ProductID string `json:"product_id"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	uID, _ := uuid.Parse(userID)
	pID, _ := uuid.Parse(req.ProductID)

	wishlist := Wishlist{
		UserID:    uID,
		ProductID: pID,
	}

	if err := db.DB.Create(&wishlist).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to add to wishlist"})
	}

	return c.JSON(fiber.Map{"message": "Added to wishlist"})
}

func RemoveFromWishlist(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	productID := c.Params("id")

	if err := db.DB.Where("user_id = ? AND product_id = ?", userID, productID).Delete(&Wishlist{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to remove from wishlist"})
	}

	return c.JSON(fiber.Map{"message": "Removed from wishlist"})
}
