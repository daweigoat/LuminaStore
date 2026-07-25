package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/luminastore/api/internal/repositories"
	"github.com/luminastore/api/internal/services"
)

type UpdateSellerOrderStatusRequest struct {
	Status string `json:"status"`
}

func GetSellerOrders(c *fiber.Ctx) error {
	sellerID := c.Locals("userID").(string)
	repo := repositories.NewSellerOrderRepository()
	
	orders, err := repo.GetSellerOrders(sellerID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch orders"})
	}

	return c.JSON(fiber.Map{"data": orders})
}

func UpdateSellerOrderStatus(c *fiber.Ctx) error {
	sellerID := c.Locals("userID").(string)
	orderID := c.Params("id")
	
	var req UpdateSellerOrderStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	repo := repositories.NewSellerOrderRepository()
	oID, _ := uuid.Parse(orderID)

	var trackingNumber string
	notes := "Status updated to " + req.Status

	// Auto generate mock tracking number if transitioned to shipped
	if req.Status == "shipped" {
		trackingService := services.NewMockTrackingProvider()
		// Get order details to get correct order number, simplified here
		trackingNumber, _ = trackingService.GenerateTrackingNumber("LMS", oID.String()[:8])
		notes = "Order shipped. Tracking: " + trackingNumber
	}

	if err := repo.UpdateOrderStatusAndTracking(oID, sellerID, req.Status, trackingNumber, notes); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update order status"})
	}

	return c.JSON(fiber.Map{"message": "Order status updated", "tracking_number": trackingNumber})
}
