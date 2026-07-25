package controllers

import (
	"log"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/luminastore/api/internal/services"
)

// UpgradeWS checks if the connection is a WebSocket upgrade
func UpgradeWS(c *fiber.Ctx) error {
	if websocket.IsWebSocketUpgrade(c) {
		c.Locals("allowed", true)
		return c.Next()
	}
	return fiber.ErrUpgradeRequired
}

// HandleWS handles the established WebSocket connection
func HandleWS(c *websocket.Conn) {
	userID := c.Query("token") // Simplified auth for demo, in prod decode JWT and extract ID
	if userID == "" {
		userID = "anonymous"
	}

	client := &services.Client{
		ID:   userID,
		Conn: c,
		Send: make(chan []byte, 256),
	}

	services.WSHub.Register <- client

	// Start pump routines
	go writePump(client)
	readPump(client)
}

func readPump(c *services.Client) {
	defer func() {
		services.WSHub.Unregister <- c
		c.Conn.Close()
	}()

	for {
		_, _, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("[WS] Read error: %v", err)
			}
			break
		}
		// In a full implementation, you can parse client messages here.
		// For LuminaStore, most messages are one-way (Server to Client).
	}
}

func writePump(c *services.Client) {
	defer c.Conn.Close()
	for {
		message, ok := <-c.Send
		if !ok {
			c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
			return
		}

		if err := c.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
			return
		}
	}
}
