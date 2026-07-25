package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/luminastore/api/internal/services"
)

func GetSellerDashboardMetrics(c *fiber.Ctx) error {
	sellerID := c.Locals("userID").(string)
	
	analyticsSvc := services.NewAnalyticsService()
	metrics, err := analyticsSvc.GetDashboardMetrics(sellerID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch dashboard metrics"})
	}

	return c.JSON(fiber.Map{"data": metrics})
}
