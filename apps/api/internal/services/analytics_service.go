package services

import (
	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/models"
)

type SellerAnalytics struct {
	TotalRevenue   float64
	TotalOrders    int64
	PendingOrders  int64
	LowStockCount  int64
}

type AnalyticsService interface {
	GetDashboardMetrics(sellerID string) (*SellerAnalytics, error)
}

type analyticsService struct{}

func NewAnalyticsService() AnalyticsService {
	return &analyticsService{}
}

func (s *analyticsService) GetDashboardMetrics(sellerID string) (*SellerAnalytics, error) {
	var store models.Store
	if err := db.DB.Where("seller_id = ?", sellerID).First(&store).Error; err != nil {
		return nil, err
	}

	var stats SellerAnalytics

	// Revenue & Total Orders
	db.DB.Model(&models.Order{}).Where("store_id = ? AND status NOT IN ('cancelled', 'refund_approved', 'returned')", store.ID).Select("COALESCE(SUM(total_amount), 0)").Scan(&stats.TotalRevenue)
	db.DB.Model(&models.Order{}).Where("store_id = ?", store.ID).Count(&stats.TotalOrders)
	
	// Pending Orders
	db.DB.Model(&models.Order{}).Where("store_id = ? AND status = 'paid'", store.ID).Count(&stats.PendingOrders)

	// Low Stock (using variants if applicable, or base product)
	// For simplicity, count products with stock < 10
	db.DB.Model(&models.Product{}).Where("store_id = ? AND stock < 10 AND status = 'published'", store.ID).Count(&stats.LowStockCount)

	return &stats, nil
}
