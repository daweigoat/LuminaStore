package services

import (
	"context"
	"encoding/json"
	"log"
	"sync"

	"github.com/gofiber/contrib/websocket"
	"github.com/luminastore/api/internal/db"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Send chan []byte
}

type Hub struct {
	Clients    map[string]map[*Client]bool
	Broadcast  chan []byte
	Register   chan *Client
	Unregister chan *Client
	mu         sync.Mutex
}

var WSHub = Hub{
	Broadcast:  make(chan []byte),
	Register:   make(chan *Client),
	Unregister: make(chan *Client),
	Clients:    make(map[string]map[*Client]bool),
}

type WsMessage struct {
	Topic   string      `json:"topic"`
	Payload interface{} `json:"payload"`
	Target  string      `json:"target,omitempty"` // UserID or StoreID or "global"
}

func (h *Hub) Run() {
	go h.listenRedis()

	for {
		select {
		case client := <-h.Register:
			h.mu.Lock()
			if _, ok := h.Clients[client.ID]; !ok {
				h.Clients[client.ID] = make(map[*Client]bool)
			}
			h.Clients[client.ID][client] = true
			h.mu.Unlock()
			log.Printf("[WS] Client %s registered", client.ID)

		case client := <-h.Unregister:
			h.mu.Lock()
			if connections, ok := h.Clients[client.ID]; ok {
				if _, ok := connections[client]; ok {
					delete(connections, client)
					close(client.Send)
					if len(connections) == 0 {
						delete(h.Clients, client.ID)
					}
				}
			}
			h.mu.Unlock()
			log.Printf("[WS] Client %s unregistered", client.ID)

		case message := <-h.Broadcast:
			var msg WsMessage
			if err := json.Unmarshal(message, &msg); err == nil {
				h.mu.Lock()
				if msg.Target == "global" {
					// Broadcast to all
					for _, conns := range h.Clients {
						for client := range conns {
							client.Send <- message
						}
					}
				} else if conns, ok := h.Clients[msg.Target]; ok {
					// Send to specific target (UserID / StoreID)
					for client := range conns {
						client.Send <- message
					}
				}
				h.mu.Unlock()
			}
		}
	}
}

// listenRedis connects to Redis Pub/Sub to scale WebSockets horizontally across API instances
func (h *Hub) listenRedis() {
	pubsub := db.RedisClient.Subscribe(context.Background(), "luminastore_ws_channel")
	defer pubsub.Close()

	ch := pubsub.Channel()
	for msg := range ch {
		h.Broadcast <- []byte(msg.Payload)
	}
}

// PublishEvent pushes an event to Redis which distributes it to all connected WS Hubs
func PublishWSEvent(topic string, payload interface{}, target string) {
	msg := WsMessage{Topic: topic, Payload: payload, Target: target}
	b, err := json.Marshal(msg)
	if err == nil {
		db.RedisClient.Publish(context.Background(), "luminastore_ws_channel", string(b))
	}
}
