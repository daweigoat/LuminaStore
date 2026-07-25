package controllers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/luminastore/api/internal/config"
	"github.com/luminastore/api/internal/db"
	"github.com/luminastore/api/internal/models"
	"github.com/luminastore/api/internal/utils"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	FullName string `json:"full_name"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func getGoogleOAuthConfig() *oauth2.Config {
	cfg := config.Load()
	return &oauth2.Config{
		ClientID:     cfg.GoogleClientID,
		ClientSecret: cfg.GoogleClientSecret,
		RedirectURL:  cfg.GoogleCallbackURL,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
}

func Register(c *fiber.Ctx) error {
	var req RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
	}

	user := models.User{
		Email:        req.Email,
		PasswordHash: hashedPassword,
		FullName:     req.FullName,
		Role:         "customer",
	}

	if err := db.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Email already exists"})
	}

	accessToken, refreshToken, err := utils.GenerateTokens(user.ID, user.Role)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate tokens"})
	}

	setCookies(c, accessToken, refreshToken)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "User registered successfully",
		"user":    fiber.Map{"id": user.ID, "email": user.Email, "full_name": user.FullName},
	})
}

func Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	var user models.User
	if err := db.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	if !utils.CheckPasswordHash(req.Password, user.PasswordHash) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	accessToken, refreshToken, err := utils.GenerateTokens(user.ID, user.Role)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate tokens"})
	}

	setCookies(c, accessToken, refreshToken)
	return c.JSON(fiber.Map{
		"message": "Login successful",
		"user":    fiber.Map{"id": user.ID, "email": user.Email, "full_name": user.FullName},
	})
}

func Refresh(c *fiber.Ctx) error {
	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Refresh token missing"})
	}

	claims, err := utils.ValidateToken(refreshToken)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid refresh token"})
	}

	newAccess, newRefresh, err := utils.GenerateTokens(claims.UserID, claims.Role)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate tokens"})
	}

	setCookies(c, newAccess, newRefresh)
	return c.JSON(fiber.Map{"message": "Tokens refreshed successfully"})
}

func GoogleLogin(c *fiber.Ctx) error {
	url := getGoogleOAuthConfig().AuthCodeURL("randomstate")
	return c.Redirect(url)
}

func GoogleCallback(c *fiber.Ctx) error {
	code := c.Query("code")
	if code == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing code"})
	}

	token, err := getGoogleOAuthConfig().Exchange(context.Background(), code)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to exchange token"})
	}

	response, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get user info"})
	}
	defer response.Body.Close()

	var googleUser map[string]interface{}
	body, _ := io.ReadAll(response.Body)
	json.Unmarshal(body, &googleUser)

	email := googleUser["email"].(string)
	name := googleUser["name"].(string)

	var user models.User
	if err := db.DB.Where("email = ?", email).First(&user).Error; err != nil {
		// Register new user
		user = models.User{
			Email:        email,
			PasswordHash: "", // OAuth users don't have passwords
			FullName:     name,
			Role:         "customer",
		}
		db.DB.Create(&user)
	}

	accessToken, refreshToken, err := utils.GenerateTokens(user.ID, user.Role)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate tokens"})
	}

	setCookies(c, accessToken, refreshToken)
	return c.Redirect("http://localhost:3000/") // Redirect to frontend
}

func setCookies(c *fiber.Ctx, accessToken, refreshToken string) {
	c.Cookie(&fiber.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		HTTPOnly: true,
		Secure:   true,
		SameSite: "Strict",
	})
	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		HTTPOnly: true,
		Secure:   true,
		SameSite: "Strict",
	})
}
