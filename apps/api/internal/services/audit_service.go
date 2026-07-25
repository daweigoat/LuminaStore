package services

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/models"
)

func LogAdminAction(c *fiber.Ctx, action, entity string, entityID uuid.UUID, before, after string) error {
	adminIDStr := c.Locals("userID")
	if adminIDStr == nil {
		return nil // Not logged in
	}
	
	adminID, err := uuid.Parse(adminIDStr.(string))
	if err != nil {
		return err
	}

	ip := c.IP()
	userAgent := string(c.Request().Header.UserAgent())

	logEntry := models.AuditLog{
		AdminID:   adminID,
		Action:    action,
		Entity:    entity,
		EntityID:  entityID,
		Before:    before,
		After:     after,
		IPAddress: ip,
		UserAgent: userAgent,
	}

	return db.DB.Create(&logEntry).Error
}
