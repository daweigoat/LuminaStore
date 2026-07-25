package utils

import (
	"time"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/luminastore/api/internal/config"
)

func GenerateTokens(userID uuid.UUID, role string) (string, string, error) {
	cfg := config.Load()
	secret := []byte(cfg.JWTSecret)

	// Access Token (15 minutes)
	accessClaims := jwt.MapClaims{
		"sub":  userID.String(),
		"role": role,
		"exp":  time.Now().Add(time.Minute * 15).Unix(),
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, err := accessToken.SignedString(secret)
	if err != nil {
		return "", "", err
	}

	// Refresh Token (7 days)
	refreshClaims := jwt.MapClaims{
		"sub": userID.String(),
		"exp": time.Now().Add(time.Hour * 24 * 7).Unix(),
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshTokenString, err := refreshToken.SignedString(secret)
	if err != nil {
		return "", "", err
	}

	return accessTokenString, refreshTokenString, nil
}
