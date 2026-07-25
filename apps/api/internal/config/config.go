package config

import (
	"log"
	"os"
	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL        string
	RedisURL           string
	JWTSecret          string
	GoogleClientID     string
	GoogleClientSecret string
	GoogleCallbackURL  string
	MeiliSearchURL     string
	MeiliSearchKey     string
}

func Load() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, relying on system environment variables")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	return &Config{
		Port:        port,
		DatabaseURL:        os.Getenv("DATABASE_URL"),
		RedisURL:           os.Getenv("REDIS_URL"),
		JWTSecret:          os.Getenv("JWT_SECRET"),
		GoogleClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		GoogleClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		GoogleCallbackURL:  os.Getenv("GOOGLE_CALLBACK_URL"),
		MeiliSearchURL:     os.Getenv("MEILISEARCH_URL"),
		MeiliSearchKey:     os.Getenv("MEILISEARCH_KEY"),
	}
}
