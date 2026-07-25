package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/luminastore/api/internal/models"
	"github.com/luminastore/api/internal/repositories"
)

type CreateSellerProductRequest struct {
	CategoryID  string                  `json:"category_id"`
	Name        string                  `json:"name"`
	Slug        string                  `json:"slug"`
	Description string                  `json:"description"`
	Price       float64                 `json:"price"`
	Stock       int                     `json:"stock"`
	Status      string                  `json:"status"`
	Weight      float64                 `json:"weight"`
	Length      float64                 `json:"length"`
	Width       float64                 `json:"width"`
	Height      float64                 `json:"height"`
	Brand       string                  `json:"brand"`
	Variants    []models.ProductVariant `json:"variants"`
}

func GetSellerProducts(c *fiber.Ctx) error {
	sellerID := c.Locals("userID").(string)
	repo := repositories.NewSellerProductRepository()
	
	products, err := repo.GetSellerProducts(sellerID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch products"})
	}

	return c.JSON(fiber.Map{"data": products})
}

func CreateSellerProduct(c *fiber.Ctx) error {
	sellerID := c.Locals("userID").(string)
	
	var req CreateSellerProductRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	catID, _ := uuid.Parse(req.CategoryID)
	sID, _ := uuid.Parse(sellerID)

	product := models.Product{
		SellerID:    sID,
		CategoryID:  catID,
		Name:        req.Name,
		Slug:        req.Slug,
		Description: req.Description,
		Price:       req.Price,
		Stock:       req.Stock,
		Status:      req.Status,
		Weight:      req.Weight,
		Length:      req.Length,
		Width:       req.Width,
		Height:      req.Height,
		Brand:       req.Brand,
	}

	repo := repositories.NewSellerProductRepository()
	if err := repo.CreateProduct(&product, req.Variants); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create product"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"data": product})
}

func UpdateProductStatus(c *fiber.Ctx) error {
	sellerID := c.Locals("userID").(string)
	productID := c.Params("id")
	
	var req map[string]string
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	repo := repositories.NewSellerProductRepository()
	if err := repo.UpdateProductStatus(productID, sellerID, req["status"]); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update product status"})
	}

	return c.JSON(fiber.Map{"message": "Product status updated"})
}
