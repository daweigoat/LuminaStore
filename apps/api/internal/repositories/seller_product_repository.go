package repositories

import (
	"github.com/google/uuid"
	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/models"
	"gorm.io/gorm"
)

type SellerProductRepository interface {
	CreateProduct(product *models.Product, variants []models.ProductVariant) error
	GetSellerProducts(sellerID string) ([]models.Product, error)
	UpdateProductStatus(productID string, sellerID string, status string) error
}

type sellerProductRepository struct {
	db *gorm.DB
}

func NewSellerProductRepository() SellerProductRepository {
	return &sellerProductRepository{db: db.DB}
}

func (r *sellerProductRepository) CreateProduct(product *models.Product, variants []models.ProductVariant) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(product).Error; err != nil {
			return err
		}

		for i := range variants {
			variants[i].ProductID = product.ID
			if err := tx.Create(&variants[i]).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (r *sellerProductRepository) GetSellerProducts(sellerID string) ([]models.Product, error) {
	var products []models.Product
	if err := r.db.Preload("Variants").Where("seller_id = ?", sellerID).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (r *sellerProductRepository) UpdateProductStatus(productID string, sellerID string, status string) error {
	return r.db.Model(&models.Product{}).Where("id = ? AND seller_id = ?", productID, sellerID).Update("status", status).Error
}
