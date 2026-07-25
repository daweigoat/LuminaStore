package controllers

import (
	"encoding/json"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/luminastore/api/internal/db"
)

type CartItem struct {
	ProductID string  `json:"product_id"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}

func GetCart(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	
	cartData, err := db.RedisClient.Get(db.Ctx, "cart:"+userID).Result()
	if err != nil {
		return c.JSON(fiber.Map{"data": []CartItem{}})
	}

	var cart []CartItem
	json.Unmarshal([]byte(cartData), &cart)
	return c.JSON(fiber.Map{"data": cart})
}

func UpdateCart(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	
	var cart []CartItem
	if err := c.BodyParser(&cart); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid cart data"})
	}

	cartBytes, _ := json.Marshal(cart)
	
	// Keep cart for 7 days
	err := db.RedisClient.Set(db.Ctx, "cart:"+userID, cartBytes, 7*24*time.Hour).Err()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update cart"})
	}

	return c.JSON(fiber.Map{"message": "Cart updated", "data": cart})
}
