package models

import (
	"log"

	"github.com/luminastore/api/internal/db"
	"gorm.io/gorm"
)

// AfterCreate hook to sync Product to Meilisearch
func (p *Product) AfterCreate(tx *gorm.DB) (err error) {
	if db.MeiliClient != nil {
		_, err := db.MeiliClient.Index("products").AddDocuments([]map[string]interface{}{
			{
				"id":          p.ID.String(),
				"name":        p.Name,
				"slug":        p.Slug,
				"description": p.Description,
				"price":       p.Price,
				"stock":       p.Stock,
			},
		})
		if err != nil {
			log.Printf("Failed to sync product %s to Meilisearch: %v", p.ID, err)
		}
	}
	return
}

// AfterUpdate hook to sync Product to Meilisearch
func (p *Product) AfterUpdate(tx *gorm.DB) (err error) {
	if db.MeiliClient != nil {
		_, err := db.MeiliClient.Index("products").UpdateDocuments([]map[string]interface{}{
			{
				"id":          p.ID.String(),
				"name":        p.Name,
				"slug":        p.Slug,
				"description": p.Description,
				"price":       p.Price,
				"stock":       p.Stock,
			},
		})
		if err != nil {
			log.Printf("Failed to update product %s in Meilisearch: %v", p.ID, err)
		}
	}
	return
}

// AfterDelete hook to remove Product from Meilisearch
func (p *Product) AfterDelete(tx *gorm.DB) (err error) {
	if db.MeiliClient != nil {
		_, err := db.MeiliClient.Index("products").DeleteDocument(p.ID.String())
		if err != nil {
			log.Printf("Failed to delete product %s from Meilisearch: %v", p.ID, err)
		}
	}
	return
}
