package unit

import (
	"testing"
	"github.com/luminastore/api/internal/services"
)

// Example test for the Mock AI Provider behavior
func TestMockAIProviderSynonyms(t *testing.T) {
	provider := services.NewMockAIProvider()
	query := "shoes"
	
	synonyms, err := provider.GenerateSearchSynonyms(query)
	
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if len(synonyms) == 0 {
		t.Errorf("Expected synonyms to be returned")
	}

	expectedFirst := "shoes premium"
	if synonyms[0] != expectedFirst {
		t.Errorf("Expected first synonym to be %s, got %s", expectedFirst, synonyms[0])
	}
}
