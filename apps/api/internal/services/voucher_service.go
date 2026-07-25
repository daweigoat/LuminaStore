package services

import (
	"errors"
	"time"

	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/models"
)

type VoucherService struct{}

func NewVoucherService() *VoucherService {
	return &VoucherService{}
}

func (s *VoucherService) ValidateAndCalculate(code string, subtotal float64) (float64, error) {
	var voucher models.Voucher
	if err := db.DB.Where("code = ?", code).First(&voucher).Error; err != nil {
		return 0, errors.New("invalid voucher code")
	}

	now := time.Now()
	if now.Before(voucher.StartDate) || now.After(voucher.EndDate) {
		return 0, errors.New("voucher expired or not yet active")
	}

	if subtotal < voucher.MinOrderValue {
		return 0, errors.New("minimum order value not met")
	}

	if voucher.UsageLimit > 0 && voucher.UsageCount >= voucher.UsageLimit {
		return 0, errors.New("voucher usage limit reached")
	}

	var discount float64 = 0
	if voucher.DiscountAmount > 0 {
		discount = voucher.DiscountAmount
	} else if voucher.DiscountPercent > 0 {
		discount = subtotal * (voucher.DiscountPercent / 100)
		if voucher.MaxDiscount > 0 && discount > voucher.MaxDiscount {
			discount = voucher.MaxDiscount
		}
	}

	return discount, nil
}
