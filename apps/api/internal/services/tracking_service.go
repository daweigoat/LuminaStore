package services

import (
	"fmt"
	"time"
)

type TrackingProvider interface {
	GenerateTrackingNumber(providerCode string, orderNumber string) (string, error)
}

type MockTrackingProvider struct{}

func NewMockTrackingProvider() TrackingProvider {
	return &MockTrackingProvider{}
}

func (m *MockTrackingProvider) GenerateTrackingNumber(providerCode string, orderNumber string) (string, error) {
	// Mock implementation. E.g. JNE-LMS-20260725-000001
	if providerCode == "" {
		providerCode = "LMS"
	}
	return fmt.Sprintf("%s-%s-%d", providerCode, orderNumber, time.Now().UnixMilli()%10000), nil
}
