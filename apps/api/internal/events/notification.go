package events

import (
	"fmt"
	"log"

	"github.com/google/uuid"
)

type NotificationEvent struct {
	Type    string
	UserID  uuid.UUID
	OrderID uuid.UUID
	Message string
}

var eventChannel = make(chan NotificationEvent, 100)

func init() {
	// Background worker to process notification events
	go func() {
		for event := range eventChannel {
			processNotification(event)
		}
	}()
}

func EmitOrderCreated(userID, orderID uuid.UUID, orderNumber string) {
	eventChannel <- NotificationEvent{
		Type:    "ORDER_CREATED",
		UserID:  userID,
		OrderID: orderID,
		Message: fmt.Sprintf("Your order %s has been created.", orderNumber),
	}
}

func EmitPaymentSuccess(userID, orderID uuid.UUID, amount float64) {
	eventChannel <- NotificationEvent{
		Type:    "PAYMENT_SUCCESS",
		UserID:  userID,
		OrderID: orderID,
		Message: fmt.Sprintf("Payment of $%.2f received successfully.", amount),
	}
}

func processNotification(event NotificationEvent) {
	// In a real system, this would send an email, push notification, or save to a notifications table.
	log.Printf("[NOTIFICATION] Type: %s | User: %s | Order: %s | Msg: %s", event.Type, event.UserID, event.OrderID, event.Message)
}
