package services

import (
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/models"
)

type SettlementProvider interface {
	ProcessPayout(withdrawalID uuid.UUID, storeID uuid.UUID, amount float64) error
}

type ManualSettlementProvider struct{}

func NewManualSettlementProvider() SettlementProvider {
	return &ManualSettlementProvider{}
}

func (m *ManualSettlementProvider) ProcessPayout(withdrawalID uuid.UUID, storeID uuid.UUID, amount float64) error {
	// Simulate manual processing by a finance admin
	go func() {
		// Simulate bank transfer delay
		time.Sleep(5 * time.Second)
		log.Printf("[SETTLEMENT] Processing payout of %.2f for store %s", amount, storeID)
		
		// In reality, this would call Xendit/Midtrans API
		// After success, mark withdrawal as completed
		if err := db.DB.Model(&models.Withdrawal{}).Where("id = ?", withdrawalID).Updates(map[string]interface{}{
			"status": "completed",
			"transaction_id": "MANUAL-" + time.Now().Format("20060102150405"),
		}).Error; err != nil {
			log.Printf("[SETTLEMENT] Failed to update withdrawal status: %v", err)
		}
	}()
	return nil
}
