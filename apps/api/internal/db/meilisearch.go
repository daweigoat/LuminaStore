package db

import (
	"log"

	"github.com/luminastore/api/internal/config"
	"github.com/meilisearch/meilisearch-go"
)

var MeiliClient *meilisearch.Client

func ConnectMeilisearch() {
	cfg := config.Load()
	if cfg.MeiliSearchURL == "" {
		log.Println("MEILISEARCH_URL is not set. Skipping Meilisearch connection.")
		return
	}

	client := meilisearch.NewClient(meilisearch.ClientConfig{
		Host:   cfg.MeiliSearchURL,
		APIKey: cfg.MeiliSearchKey,
	})

	_, err := client.Health()
	if err != nil {
		log.Fatalf("Failed to connect to Meilisearch: %v", err)
	}

	log.Println("Connected to Meilisearch successfully.")

	// Create index if not exists
	_, err = client.CreateIndex(&meilisearch.IndexConfig{
		Uid:        "products",
		PrimaryKey: "id",
	})
	if err != nil {
		log.Printf("Meilisearch products index may already exist: %v", err)
	}

	MeiliClient = client
}
