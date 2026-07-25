package repositories

import (
	"github.com/google/uuid"
	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/models"
	"gorm.io/gorm"
)

type SellerOrderRepository interface {
	GetSellerOrders(sellerID string) ([]models.Order, error)
	UpdateOrderStatusAndTracking(orderID uuid.UUID, sellerID string, status string, trackingNumber string, notes string) error
}

type sellerOrderRepository struct {
	db *gorm.DB
}

func NewSellerOrderRepository() SellerOrderRepository {
	return &sellerOrderRepository{db: db.DB}
}

func (r *sellerOrderRepository) GetSellerOrders(sellerID string) ([]models.Order, error) {
	// A real implementation would join through the products table or check store_id
	// For now, assume StoreID is properly set on Order when checking out.
	var store models.Store
	if err := r.db.Where("seller_id = ?", sellerID).First(&store).Error; err != nil {
		return nil, err
	}

	var orders []models.Order
	if err := r.db.Preload("OrderItems").Where("store_id = ?", store.ID).Order("created_at desc").Find(&orders).Error; err != nil {
		return nil, err
	}
	return orders, nil
}

func (r *sellerOrderRepository) UpdateOrderStatusAndTracking(orderID uuid.UUID, sellerID string, status string, trackingNumber string, notes string) error {
	var store models.Store
	if err := r.db.Where("seller_id = ?", sellerID).First(&store).Error; err != nil {
		return err
	}

	return r.db.Transaction(func(tx *gorm.DB) error {
		updates := map[string]interface{}{"status": status}
		if trackingNumber != "" {
			updates["tracking_number"] = trackingNumber
		}

		if err := tx.Model(&models.Order{}).Where("id = ? AND store_id = ?", orderID, store.ID).Updates(updates).Error; err != nil {
			return err
		}

		log := models.OrderStatusLog{
			OrderID: orderID,
			Status:  status,
			Notes:   notes,
		}
		if err := tx.Create(&log).Error; err != nil {
			return err
		}
		return nil
	})
}
