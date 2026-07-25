package db

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client
var Ctx = context.Background()

func ConnectRedis(url string) {
	if url == "" {
		log.Println("REDIS_URL is not set. Skipping Redis connection.")
		return
	}

	opt, err := redis.ParseURL(url)
	if err != nil {
		log.Fatalf("Invalid REDIS_URL: %v", err)
	}

	client := redis.NewClient(opt)

	_, err = client.Ping(Ctx).Result()
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}

	log.Println("Connected to Redis successfully.")
	RedisClient = client
}
