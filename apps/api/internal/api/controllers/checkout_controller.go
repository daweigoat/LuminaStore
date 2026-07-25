package controllers

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/services"
)

type CheckoutCalculateRequest struct {
	ShippingMethod string `json:"shipping_method"`
	VoucherCode    string `json:"voucher_code"`
	Destination    string `json:"destination"`
}

func CalculateCheckout(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req CheckoutCalculateRequest
	if err := c.BodyParser(&req); err != nil && len(c.Body()) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	// Fetch Cart
	cartData, _ := db.RedisClient.Get(db.Ctx, "cart:"+userID).Result()
	var cart []CartItem
	json.Unmarshal([]byte(cartData), &cart)

	var subtotal float64
	totalWeight := len(cart) * 1 // mock 1kg per item
	for _, item := range cart {
		subtotal += item.Price * float64(item.Quantity)
	}

	shippingService := services.NewMockShippingService()
	shippingCost, _ := shippingService.CalculateCost(req.ShippingMethod, req.Destination, totalWeight)

	voucherService := services.NewVoucherService()
	discountAmount, _ := voucherService.ValidateAndCalculate(req.VoucherCode, subtotal)

	// Fixed tax 11%
	taxAmount := (subtotal - discountAmount) * 0.11
	if taxAmount < 0 {
		taxAmount = 0
	}

	finalAmount := subtotal + shippingCost + taxAmount - discountAmount

	availableMethods, _ := shippingService.GetAvailableMethods(req.Destination, totalWeight)

	return c.JSON(fiber.Map{
		"data": fiber.Map{
			"subtotal":                 subtotal,
			"shipping_cost":            shippingCost,
			"tax_amount":               taxAmount,
			"discount_amount":          discountAmount,
			"final_amount":             finalAmount,
			"available_shipping_methods": availableMethods,
		},
	})
}
