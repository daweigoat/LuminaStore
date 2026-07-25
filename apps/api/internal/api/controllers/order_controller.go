package controllers

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/events"
	"github.com/luminastore/api/internal/models"
	"github.com/luminastore/api/internal/repositories"
	"github.com/luminastore/api/internal/services"
)

type CreateOrderRequest struct {
	ShippingAddress string `json:"shipping_address"`
	ShippingMethod  string `json:"shipping_method"`
	VoucherCode     string `json:"voucher_code"`
	Notes           string `json:"notes"`
}

func CreateOrder(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req CreateOrderRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	cartData, _ := db.RedisClient.Get(db.Ctx, "cart:"+userID).Result()
	var cart []CartItem
	json.Unmarshal([]byte(cartData), &cart)

	if len(cart) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cart is empty"})
	}

	var subtotal float64
	for _, item := range cart {
		subtotal += item.Price * float64(item.Quantity)
	}

	totalWeight := len(cart) * 1
	shippingService := services.NewMockShippingService()
	shippingCost, _ := shippingService.CalculateCost(req.ShippingMethod, req.ShippingAddress, totalWeight)

	voucherService := services.NewVoucherService()
	discountAmount, _ := voucherService.ValidateAndCalculate(req.VoucherCode, subtotal)

	taxAmount := (subtotal - discountAmount) * 0.11
	if taxAmount < 0 {
		taxAmount = 0
	}
	finalAmount := subtotal + shippingCost + taxAmount - discountAmount

	orderService := services.NewOrderService()
	orderNumber := orderService.GenerateOrderNumber()

	uID, _ := uuid.Parse(userID)
	order := models.Order{
		OrderNumber:     orderNumber,
		UserID:          uID,
		TotalAmount:     subtotal,
		ShippingCost:    shippingCost,
		TaxAmount:       taxAmount,
		DiscountAmount:  discountAmount,
		FinalAmount:     finalAmount,
		Status:          "pending",
		ShippingAddress: req.ShippingAddress,
		ShippingMethod:  req.ShippingMethod,
		Notes:           req.Notes,
	}

	orderRepo := repositories.NewOrderRepository()

	var items []models.OrderItem
	for _, item := range cart {
		pID, _ := uuid.Parse(item.ProductID)
		items = append(items, models.OrderItem{
			ProductID: pID,
			Quantity:  item.Quantity,
			UnitPrice: item.Price,
		})
	}

	if err := orderRepo.CreateOrderWithItems(&order, items); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create order"})
	}

	// Clear cart
	db.RedisClient.Del(db.Ctx, "cart:"+userID)

	// Emit Notification Event
	events.EmitOrderCreated(uID, order.ID, order.OrderNumber)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"data": order})
}

func GetOrders(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	
	orderRepo := repositories.NewOrderRepository()
	orders, err := orderRepo.GetUserOrders(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch orders"})
	}

	return c.JSON(fiber.Map{"data": orders})
}

func GetOrderDetails(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	id := c.Params("id")
	
	orderRepo := repositories.NewOrderRepository()
	order, err := orderRepo.GetOrderDetails(id, userID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Order not found"})
	}

	return c.JSON(fiber.Map{"data": order})
}
