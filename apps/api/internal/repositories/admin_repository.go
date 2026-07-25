package repositories

import (
	"github.com/google/uuid"
	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/models"
)

type AdminRepository interface {
	// Dashboard
	GetTotalGMV() (float64, error)
	GetTotalUsers() (int64, error)
	GetTotalSellers() (int64, error)
	GetPendingModerationCount() (int64, error)

	// Users
	GetUsers(limit, offset int) ([]models.User, error)
	UpdateUserStatus(userID uuid.UUID, status string) error

	// Stores
	GetStores(limit, offset int) ([]models.Store, error)
	UpdateStoreStatus(storeID uuid.UUID, status string) error

	// Products
	GetPendingProducts() ([]models.Product, error)
	UpdateProductModerationStatus(productID uuid.UUID, status string) error

	// Withdrawals
	GetPendingWithdrawals() ([]models.Withdrawal, error)
	ApproveWithdrawal(withdrawalID uuid.UUID) (*models.Withdrawal, error)
}

type adminRepository struct{}

func NewAdminRepository() AdminRepository {
	return &adminRepository{}
}

func (r *adminRepository) GetTotalGMV() (float64, error) {
	var gmv float64
	err := db.DB.Model(&models.Order{}).Where("status NOT IN ('cancelled', 'refund_approved', 'returned')").Select("COALESCE(SUM(final_amount), 0)").Scan(&gmv).Error
	return gmv, err
}

func (r *adminRepository) GetTotalUsers() (int64, error) {
	var count int64
	err := db.DB.Model(&models.User{}).Count(&count).Error
	return count, err
}

func (r *adminRepository) GetTotalSellers() (int64, error) {
	var count int64
	err := db.DB.Model(&models.Store{}).Where("status = ?", "active").Count(&count).Error
	return count, err
}

func (r *adminRepository) GetPendingModerationCount() (int64, error) {
	var count int64
	err := db.DB.Model(&models.Product{}).Where("moderation_status = ?", "pending").Count(&count).Error
	return count, err
}

func (r *adminRepository) GetUsers(limit, offset int) ([]models.User, error) {
	var users []models.User
	err := db.DB.Offset(offset).Limit(limit).Find(&users).Error
	return users, err
}

func (r *adminRepository) UpdateUserStatus(userID uuid.UUID, status string) error {
	return db.DB.Model(&models.User{}).Where("id = ?", userID).Update("status", status).Error
}

func (r *adminRepository) GetStores(limit, offset int) ([]models.Store, error) {
	var stores []models.Store
	err := db.DB.Preload("Products").Offset(offset).Limit(limit).Find(&stores).Error
	return stores, err
}

func (r *adminRepository) UpdateStoreStatus(storeID uuid.UUID, status string) error {
	return db.DB.Model(&models.Store{}).Where("id = ?", storeID).Update("status", status).Error
}

func (r *adminRepository) GetPendingProducts() ([]models.Product, error) {
	var products []models.Product
	err := db.DB.Where("moderation_status = ?", "pending").Find(&products).Error
	return products, err
}

func (r *adminRepository) UpdateProductModerationStatus(productID uuid.UUID, status string) error {
	return db.DB.Model(&models.Product{}).Where("id = ?", productID).Update("moderation_status", status).Error
}

func (r *adminRepository) GetPendingWithdrawals() ([]models.Withdrawal, error) {
	var w []models.Withdrawal
	err := db.DB.Where("status = ?", "pending").Find(&w).Error
	return w, err
}

func (r *adminRepository) ApproveWithdrawal(withdrawalID uuid.UUID) (*models.Withdrawal, error) {
	var w models.Withdrawal
	if err := db.DB.Where("id = ?", withdrawalID).First(&w).Error; err != nil {
		return nil, err
	}
	w.Status = "approved"
	if err := db.DB.Save(&w).Error; err != nil {
		return nil, err
	}
	return &w, nil
}
