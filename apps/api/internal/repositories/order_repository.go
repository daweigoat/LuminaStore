package repositories

import (
	"github.com/google/uuid"
	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/models"
	"gorm.io/gorm"
)

type OrderRepository interface {
	CreateOrderWithItems(order *models.Order, items []models.OrderItem) error
	UpdateOrderStatus(orderID uuid.UUID, status string, notes string) error
	GetOrderDetails(orderID string, userID string) (*models.Order, error)
	GetUserOrders(userID string) ([]models.Order, error)
}

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository() OrderRepository {
	return &orderRepository{db: db.DB}
}

func (r *orderRepository) CreateOrderWithItems(order *models.Order, items []models.OrderItem) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(order).Error; err != nil {
			return err
		}

		for i := range items {
			items[i].OrderID = order.ID
			if err := tx.Create(&items[i]).Error; err != nil {
				return err
			}
		}

		log := models.OrderStatusLog{
			OrderID: order.ID,
			Status:  "pending",
			Notes:   "Order created, waiting for payment.",
		}
		if err := tx.Create(&log).Error; err != nil {
			return err
		}

		return nil
	})
}

func (r *orderRepository) UpdateOrderStatus(orderID uuid.UUID, status string, notes string) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.Order{}).Where("id = ?", orderID).Update("status", status).Error; err != nil {
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

func (r *orderRepository) GetOrderDetails(orderID string, userID string) (*models.Order, error) {
	var order models.Order
	if err := r.db.Preload("OrderItems").Preload("Payments").Preload("StatusLogs").
		Where("id = ? AND user_id = ?", orderID, userID).First(&order).Error; err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *orderRepository) GetUserOrders(userID string) ([]models.Order, error) {
	var orders []models.Order
	if err := r.db.Where("user_id = ?", userID).Order("created_at desc").Find(&orders).Error; err != nil {
		return nil, err
	}
	return orders, nil
}
