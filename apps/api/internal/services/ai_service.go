package services

import (
	"log"
	"os"
	"strings"

	"github.com/luminastore/api/internal/models"
)

// AIProvider defines the contract for all AI integrations.
type AIProvider interface {
	GenerateSearchSynonyms(query string) ([]string, error)
	GetProductRecommendations(userID string, history []models.Product) ([]models.Product, error)
	GetTrendingProducts() ([]models.Product, error)
}

// MockAIProvider is the default mock implementation.
type MockAIProvider struct{}

func NewMockAIProvider() AIProvider {
	return &MockAIProvider{}
}

func (m *MockAIProvider) GenerateSearchSynonyms(query string) ([]string, error) {
	log.Printf("[AI Mock] Generating synonyms for: %s", query)
	return []string{query + " premium", query + " pro", query + " max"}, nil
}

func (m *MockAIProvider) GetProductRecommendations(userID string, history []models.Product) ([]models.Product, error) {
	log.Printf("[AI Mock] Generating recommendations for user: %s", userID)
	return []models.Product{}, nil
}

func (m *MockAIProvider) GetTrendingProducts() ([]models.Product, error) {
	log.Printf("[AI Mock] Generating trending products")
	return []models.Product{}, nil
}

// InitializeAIProvider reads the environment variable and injects the appropriate provider.
func InitializeAIProvider() AIProvider {
	provider := strings.ToLower(os.Getenv("AI_PROVIDER"))
	
	switch provider {
	case "openai":
		log.Println("Initializing OpenAI Provider (Stub)")
		// return NewOpenAIProvider()
		return NewMockAIProvider()
	case "gemini":
		log.Println("Initializing Gemini Provider (Stub)")
		// return NewGeminiProvider()
		return NewMockAIProvider()
	case "claude":
		log.Println("Initializing Claude Provider (Stub)")
		// return NewClaudeProvider()
		return NewMockAIProvider()
	case "ollama":
		log.Println("Initializing Local Ollama Provider (Stub)")
		// return NewOllamaProvider()
		return NewMockAIProvider()
	default:
		log.Println("Initializing Mock AI Provider (Default)")
		return NewMockAIProvider()
	}
}

var AI AIProvider = InitializeAIProvider()
