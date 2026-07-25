package db

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectPostgres(dsn string) {
	if dsn == "" {
		log.Println("DATABASE_URL is not set. Skipping Postgres connection.")
		return
	}

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Connected to PostgreSQL successfully.")
	DB = database
}
