package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/models"
	"github.com/meilisearch/meilisearch-go"
)

func GetProducts(c *fiber.Ctx) error {
	query := c.Query("q", "")
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)

	// If Meilisearch is connected and there's a search query, use it
	if db.MeiliClient != nil && query != "" {
		searchRes, err := db.MeiliClient.Index("products").Search(query, &meilisearch.SearchRequest{
			Limit:  int64(limit),
			Offset: int64((page - 1) * limit),
		})
		if err == nil {
			return c.JSON(fiber.Map{
				"data": searchRes.Hits,
				"meta": fiber.Map{
					"total": searchRes.EstimatedTotalHits,
					"page":  page,
					"limit": limit,
				},
			})
		}
	}

	// Fallback to Postgres if no Meilisearch or empty query
	var products []models.Product
	var total int64

	db.DB.Model(&models.Product{}).Count(&total)
	
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)
	offset := (page - 1) * limit

	// Enforce moderation and active store status
	query := db.DB.Model(&models.Product{}).
		Joins("JOIN stores ON stores.id = products.store_id").
		Where("products.status = ? AND products.moderation_status = ? AND stores.status = ?", "published", "approved", "active")

	query.Count(&total)

	if err := query.Preload("Images").Preload("Variants").Offset(offset).Limit(limit).Find(&products).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch products"})
	}

	return c.JSON(fiber.Map{
		"data": products,
		"meta": fiber.Map{
			"total": total,
			"page":  page,
			"limit": limit,
		},
	})
}

func GetProductDetails(c *fiber.Ctx) error {
	slug := c.Params("slug")
	var product models.Product

	if err := db.DB.Joins("JOIN stores ON stores.id = products.store_id").
		Where("products.slug = ? AND products.status = ? AND products.moderation_status = ? AND stores.status = ?", slug, "published", "approved", "active").
		Preload("Images").Preload("Variants").First(&product).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found or not approved"})
	}

	return c.JSON(fiber.Map{"data": product})
}
