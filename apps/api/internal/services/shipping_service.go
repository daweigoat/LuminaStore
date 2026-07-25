package services

type ShippingMethod struct {
	ServiceName           string  `json:"service_name"`
	EstimatedDeliveryDays string  `json:"estimated_delivery_days"`
	ShippingCost          float64 `json:"shipping_cost"`
	InsuranceAvailable    bool    `json:"insurance_available"`
	CodAvailable          bool    `json:"cod_available"`
}

type ShippingService interface {
	GetAvailableMethods(destination string, weight int) ([]ShippingMethod, error)
	CalculateCost(method string, destination string, weight int) (float64, error)
}

type MockShippingService struct{}

func NewMockShippingService() ShippingService {
	return &MockShippingService{}
}

func (s *MockShippingService) GetAvailableMethods(destination string, weight int) ([]ShippingMethod, error) {
	// Base mock calculation: Assume 1kg = $2.00, flat distance fee = $5.00
	baseWeightFee := float64(weight) * 2.00
	distanceFee := 5.00

	return []ShippingMethod{
		{
			ServiceName:           "JNE REG",
			EstimatedDeliveryDays: "2-3",
			ShippingCost:          baseWeightFee + distanceFee + 1.00,
			InsuranceAvailable:    true,
			CodAvailable:          true,
		},
		{
			ServiceName:           "SiCepat BEST",
			EstimatedDeliveryDays: "1-2",
			ShippingCost:          baseWeightFee + distanceFee + 3.50,
			InsuranceAvailable:    true,
			CodAvailable:          false,
		},
		{
			ServiceName:           "J&T Express",
			EstimatedDeliveryDays: "2-4",
			ShippingCost:          baseWeightFee + distanceFee,
			InsuranceAvailable:    false,
			CodAvailable:          true,
		},
	}, nil
}

func (s *MockShippingService) CalculateCost(method string, destination string, weight int) (float64, error) {
	methods, _ := s.GetAvailableMethods(destination, weight)
	for _, m := range methods {
		if m.ServiceName == method {
			return m.ShippingCost, nil
		}
	}
	return 0, nil
}
