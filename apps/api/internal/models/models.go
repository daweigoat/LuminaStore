package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Base struct {
	ID        uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	CreatedAt time.Time      `gorm:"autoCreateTime"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

type User struct {
	Base
	Email        string    `gorm:"uniqueIndex;not null"`
	PasswordHash string    `gorm:"not null"`
	FullName     string    `gorm:"not null"`
	Role         string    `gorm:"default:'customer'"`
	Status       string    `gorm:"default:'active'"`
	Products     []Product `gorm:"foreignKey:SellerID"`
	Orders       []Order   `gorm:"foreignKey:UserID"`
	Store        Store     `gorm:"foreignKey:SellerID"`
}

type Role struct {
	Base
	Name        string `gorm:"uniqueIndex;not null"`
	Description string `gorm:"type:text"`
}

type Permission struct {
	Base
	Name        string `gorm:"uniqueIndex;not null"`
	Description string `gorm:"type:text"`
}

type Store struct {
	Base
	SellerID     uuid.UUID `gorm:"uniqueIndex"`
	Name         string    `gorm:"not null"`
	Description  string    `gorm:"type:text"`
	LogoURL         string
	BannerURL       string
	ReturnPolicy    string    `gorm:"type:text"`
	Status          string    `gorm:"default:'pending_approval'"`
	CommissionRate  float64   `gorm:"default:5.00"`
	Products        []Product
}

type Category struct {
	Base
	Name     string `gorm:"not null"`
	Slug     string `gorm:"uniqueIndex;not null"`
	ParentID *uuid.UUID
}

type Product struct {
	Base
	SellerID    uuid.UUID
	StoreID     uuid.UUID
	CategoryID  uuid.UUID
	Name        string  `gorm:"not null"`
	Slug        string  `gorm:"uniqueIndex;not null"`
	Description string  `gorm:"type:text"`
	Price       float64 `gorm:"not null"` // Base price
	Stock             int     `gorm:"default:0"` // Base stock
	Status            string  `gorm:"default:'published'"`
	ModerationStatus  string  `gorm:"default:'pending'"`
	Weight            float64 `gorm:"default:0"`
	Length      float64 `gorm:"default:0"`
	Width       float64 `gorm:"default:0"`
	Height      float64 `gorm:"default:0"`
	Brand       string  `gorm:"type:varchar(100)"`
	Tags        string  `gorm:"type:text[]"`
	Images      []ProductImage
	Variants    []ProductVariant
}

type ProductVariant struct {
	Base
	ProductID uuid.UUID
	Name      string `gorm:"not null"`
	SKU       string `gorm:"uniqueIndex"`
	Barcode   string
	Price     *float64
	Stock     int    `gorm:"default:0"`
	IsDefault bool   `gorm:"default:false"`
}

type InventoryHistory struct {
	Base
	ProductID    uuid.UUID
	VariantID    uuid.UUID
	ChangeAmount int
	Reason       string `gorm:"type:varchar(50)"`
}

type ProductImage struct {
	Base
	ProductID uuid.UUID
	URL       string `gorm:"not null"`
	IsPrimary bool   `gorm:"default:false"`
}

type Order struct {
	Base
	OrderNumber     string  `gorm:"uniqueIndex;not null"`
	UserID          uuid.UUID
	StoreID         uuid.UUID
	TotalAmount     float64 `gorm:"not null"`
	ShippingCost    float64 `gorm:"default:0"`
	TaxAmount       float64 `gorm:"default:0"`
	DiscountAmount  float64 `gorm:"default:0"`
	FinalAmount     float64 `gorm:"not null"`
	Status          string  `gorm:"default:'pending_payment'"`
	ShippingAddress string  `gorm:"type:text;not null"`
	ShippingMethod  string  `gorm:"type:varchar(50)"`
	TrackingNumber  string  `gorm:"type:varchar(100)"`
	Notes           string  `gorm:"type:text"`
	OrderItems      []OrderItem
	Payments        []Payment
	StatusLogs      []OrderStatusLog
}

type OrderItem struct {
	Base
	OrderID   uuid.UUID
	ProductID uuid.UUID
	Quantity  int     `gorm:"not null"`
	UnitPrice float64 `gorm:"not null"`
}

type Address struct {
	Base
	UserID        uuid.UUID
	RecipientName string `gorm:"not null"`
	Phone         string `gorm:"not null"`
	Street        string `gorm:"not null"`
	City          string `gorm:"not null"`
	State         string `gorm:"not null"`
	PostalCode    string `gorm:"not null"`
	IsDefault     bool   `gorm:"default:false"`
}

type Voucher struct {
	Base
	Code              string    `gorm:"uniqueIndex;not null"`
	Type              string    `gorm:"not null"`
	DiscountPercent   float64   `gorm:"column:discount_percentage"`
	DiscountAmount    float64   `gorm:"column:discount_amount"`
	MaxDiscount       float64   `gorm:"column:max_discount"`
	MinOrderValue     float64   `gorm:"column:minimum_order_value;default:0"`
	StartDate         time.Time 
	EndDate           time.Time
	UsageLimit        int
	UsageCount        int       `gorm:"default:0"`
	UsagePerUser      int       `gorm:"default:1"`
	Stackable         bool      `gorm:"default:false"`
}

type UserVoucher struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID    uuid.UUID
	VoucherID uuid.UUID
	UsedAt    time.Time `gorm:"autoCreateTime"`
}

type Payment struct {
	Base
	OrderID       uuid.UUID
	Method        string  `gorm:"not null"`
	Amount        float64 `gorm:"not null"`
	Status        string  `gorm:"default:'pending'"`
	TransactionID string
	PaymentURL    string
}

type OrderStatusLog struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	OrderID   uuid.UUID
	Status    string `gorm:"not null"`
	Notes     string
	CreatedAt time.Time `gorm:"autoCreateTime"`
}

type Review struct {
	Base
	ProductID   uuid.UUID `gorm:"uniqueIndex:idx_user_order_product"`
	UserID      uuid.UUID `gorm:"uniqueIndex:idx_user_order_product"`
	OrderID     uuid.UUID `gorm:"uniqueIndex:idx_user_order_product"`
	Rating      int       `gorm:"not null"`
	Comment     string    `gorm:"type:text"`
	SellerReply string    `gorm:"type:text"`
}

type AuditLog struct {
	ID         uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	AdminID    uuid.UUID
	Action     string `gorm:"not null"`
	Entity     string `gorm:"not null"`
	EntityID   uuid.UUID `gorm:"not null"`
	Before     string `gorm:"column:before_value;type:text"`
	After      string `gorm:"column:after_value;type:text"`
	IPAddress  string `gorm:"type:varchar(45)"`
	UserAgent  string `gorm:"type:text"`
	CreatedAt  time.Time `gorm:"autoCreateTime"`
}

type Withdrawal struct {
	Base
	StoreID       uuid.UUID
	Amount        float64 `gorm:"not null"`
	Status        string  `gorm:"default:'pending'"`
	Provider      string  `gorm:"type:varchar(50)"`
	TransactionID string  `gorm:"type:varchar(100)"`
}

type CMSBanner struct {
	Base
	Title     string `gorm:"not null"`
	ImageURL  string `gorm:"not null"`
	LinkURL   string
	IsActive  bool `gorm:"default:true"`
	SortOrder int  `gorm:"default:0"`
}

type FlashSale struct {
	Base
	Name      string    `gorm:"not null"`
	StartTime time.Time `gorm:"not null"`
	EndTime   time.Time `gorm:"not null"`
	Status    string    `gorm:"default:'draft'"`
}

type FlashSaleItem struct {
	ID           uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	FlashSaleID  uuid.UUID
	ProductID    uuid.UUID
	PromoPrice   float64 `gorm:"not null"`
	StockLimit   int
	CreatedAt    time.Time `gorm:"autoCreateTime"`
}
