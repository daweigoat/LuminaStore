# LuminaStore API Documentation

## Base URL
Production: `https://api.luminastore.com/api/v1`
Local: `http://localhost:8080/api/v1`

## Authentication
All protected routes require a JWT token passed in the Authorization header:
`Authorization: Bearer <token>`

## 1. Authentication Endpoints
- `POST /auth/login`: Authenticate a user and return a JWT.
- `POST /auth/register`: Register a new user.
- `GET /auth/google/login`: Initiate Google OAuth2 flow.

## 2. Public Marketplace Endpoints
- `GET /products`: Retrieve a paginated list of active, approved products. Supports Meilisearch filtering.
- `GET /products/:slug`: Retrieve product details by slug.

## 3. Customer Endpoints (Protected)
- `GET /cart`: Retrieve current user's shopping cart from Redis.
- `POST /cart`: Update cart items (Add/Remove/Change Quantity).
- `GET /wishlist`: Retrieve user's wishlist.
- `POST /wishlist`: Add a product to wishlist.
- `GET /orders`: View order history.
- `POST /checkout/calculate`: Calculate shipping and taxes prior to order creation.
- `POST /orders`: Place a new order.

## 4. Seller Endpoints (Protected - Seller Role)
- `GET /seller/analytics`: Retrieve store performance metrics.
- `GET /seller/products`: Retrieve store's products.
- `POST /seller/products`: Create a new product (Draft/Pending Approval).
- `PUT /seller/orders/:id/status`: Update order fulfillment status (e.g., Packed, Shipped).

## 5. Admin Endpoints (Protected - Admin Role + RBAC)
*Requires specific permissions.*
- `GET /admin/dashboard`: Platform-wide KPI metrics.
- `PUT /admin/users/:id/status`: Suspend or ban a user.
- `GET /admin/products/pending`: View products awaiting moderation.
- `PUT /admin/products/:id/moderate`: Approve or reject a product listing.
- `PUT /admin/finance/withdrawals/:id/approve`: Release funds to a seller.

## 6. Realtime WebSockets
- `GET /ws`: Upgrade HTTP connection to WebSocket. Used for chat, push notifications, and live order status. Requires `?token=<jwt>`.
