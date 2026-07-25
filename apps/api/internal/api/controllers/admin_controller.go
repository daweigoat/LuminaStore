package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/luminastore/api/internal/repositories"
	"github.com/luminastore/api/internal/services"
)

// --- Dashboard ---
func GetAdminDashboard(c *fiber.Ctx) error {
	repo := repositories.NewAdminRepository()
	
	gmv, _ := repo.GetTotalGMV()
	users, _ := repo.GetTotalUsers()
	sellers, _ := repo.GetTotalSellers()
	pending, _ := repo.GetPendingModerationCount()

	return c.JSON(fiber.Map{
		"data": fiber.Map{
			"gmv": gmv,
			"total_users": users,
			"total_sellers": sellers,
			"pending_moderation": pending,
		},
	})
}

// --- Users ---
func GetAdminUsers(c *fiber.Ctx) error {
	repo := repositories.NewAdminRepository()
	users, _ := repo.GetUsers(50, 0)
	return c.JSON(fiber.Map{"data": users})
}

func UpdateUserStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	uid, _ := uuid.Parse(id)
	
	var req map[string]string
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	repo := repositories.NewAdminRepository()
	repo.UpdateUserStatus(uid, req["status"])
	services.LogAdminAction(c, "UPDATE_USER_STATUS", "User", uid, "", req["status"])

	return c.JSON(fiber.Map{"message": "User updated"})
}

// --- Sellers ---
func GetAdminSellers(c *fiber.Ctx) error {
	repo := repositories.NewAdminRepository()
	stores, _ := repo.GetStores(50, 0)
	return c.JSON(fiber.Map{"data": stores})
}

func UpdateStoreStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	sid, _ := uuid.Parse(id)
	
	var req map[string]string
	c.BodyParser(&req)

	repo := repositories.NewAdminRepository()
	repo.UpdateStoreStatus(sid, req["status"])
	services.LogAdminAction(c, "UPDATE_STORE_STATUS", "Store", sid, "", req["status"])

	return c.JSON(fiber.Map{"message": "Store updated"})
}

// --- Products / Moderation ---
func GetPendingProducts(c *fiber.Ctx) error {
	repo := repositories.NewAdminRepository()
	products, _ := repo.GetPendingProducts()
	return c.JSON(fiber.Map{"data": products})
}

func ModerateProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	pid, _ := uuid.Parse(id)
	
	var req map[string]string
	c.BodyParser(&req)

	repo := repositories.NewAdminRepository()
	repo.UpdateProductModerationStatus(pid, req["status"])
	services.LogAdminAction(c, "MODERATE_PRODUCT", "Product", pid, "", req["status"])

	return c.JSON(fiber.Map{"message": "Product moderation updated"})
}

// --- Finance ---
func GetPendingWithdrawals(c *fiber.Ctx) error {
	repo := repositories.NewAdminRepository()
	w, _ := repo.GetPendingWithdrawals()
	return c.JSON(fiber.Map{"data": w})
}

func ApproveWithdrawal(c *fiber.Ctx) error {
	id := c.Params("id")
	wid, _ := uuid.Parse(id)

	repo := repositories.NewAdminRepository()
	w, err := repo.ApproveWithdrawal(wid)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to approve withdrawal"})
	}

	services.LogAdminAction(c, "APPROVE_WITHDRAWAL", "Withdrawal", wid, "pending", "approved")

	// Trigger async settlement
	provider := services.NewManualSettlementProvider()
	provider.ProcessPayout(w.ID, w.StoreID, w.Amount)

	return c.JSON(fiber.Map{"message": "Withdrawal approved and settlement initiated"})
}
