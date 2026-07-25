package services

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/events"
	"github.com/luminastore/api/internal/models"
	"github.com/luminastore/api/internal/repositories"
)

type PaymentProvider interface {
	ProcessPayment(orderID uuid.UUID, amount float64, method string) (string, string, error)
}

type MockPaymentProvider struct{}

func NewMockPaymentProvider() PaymentProvider {
	return &MockPaymentProvider{}
}

func (m *MockPaymentProvider) ProcessPayment(orderID uuid.UUID, amount float64, method string) (string, string, error) {
	// Simulate API latency
	time.Sleep(2 * time.Second)

	validMethods := map[string]bool{
		"QRIS": true, "Virtual Account": true, "Bank Transfer": true, "E-Wallet": true, "Credit Card": true,
	}

	if !validMethods[method] {
		return "", "", errors.New("unsupported payment method")
	}

	transactionID := "MOCK-" + uuid.New().String()[:8]
	paymentURL := "https://mock-payment-gateway.luminastore.com/pay/" + transactionID

	// Create payment record
	payment := models.Payment{
		OrderID:       orderID,
		Method:        method,
		Amount:        amount,
		Status:        "success", // Instantly success for mock purposes
		TransactionID: transactionID,
		PaymentURL:    paymentURL,
	}
	db.DB.Create(&payment)

	// Update order status via repo
	orderRepo := repositories.NewOrderRepository()
	orderRepo.UpdateOrderStatus(orderID, "processing", "Payment successful via "+method)

	// Emit event
	events.EmitPaymentSuccess(payment.ID, orderID, amount) // Using payment.ID temporarily as user mock context or pass user

	return transactionID, paymentURL, nil
}
