package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/models"
	"github.com/luminastore/api/internal/services"
)

type ProcessPaymentRequest struct {
	OrderID string `json:"order_id"`
	Method  string `json:"method"`
}

func GetPaymentMethods(c *fiber.Ctx) error {
	methods := []string{"QRIS", "Virtual Account", "Bank Transfer", "E-Wallet", "Credit Card"}
	return c.JSON(fiber.Map{"data": methods})
}

func ProcessPayment(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req ProcessPaymentRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	var order models.Order
	if err := db.DB.Where("id = ? AND user_id = ?", req.OrderID, userID).First(&order).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Order not found"})
	}

	if order.Status != "pending" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Order is not pending payment"})
	}

	paymentService := services.NewMockPaymentProvider()
	orderID, _ := uuid.Parse(req.OrderID)
	
	transactionID, paymentURL, err := paymentService.ProcessPayment(orderID, order.FinalAmount, req.Method)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"message": "Payment processed successfully",
		"data": fiber.Map{
			"transaction_id": transactionID,
			"payment_url":    paymentURL,
		},
	})
}
