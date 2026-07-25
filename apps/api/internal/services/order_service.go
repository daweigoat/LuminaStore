package services

import (
	"fmt"
	"time"

	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/models"
)

type OrderService struct{}

func NewOrderService() *OrderService {
	return &OrderService{}
}

func (s *OrderService) GenerateOrderNumber() string {
	dateStr := time.Now().Format("20060102")
	var count int64
	db.DB.Model(&models.Order{}).Where("DATE(created_at) = CURRENT_DATE").Count(&count)
	return fmt.Sprintf("LMS-%s-%06d", dateStr, count+1)
}
