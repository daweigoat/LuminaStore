# LuminaStore Architecture Overview

## Core Stack
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind v4, shadcn/ui, Framer Motion, GSAP.
- **Backend**: Go 1.24 (Fiber v2).
- **Database**: PostgreSQL 15, GORM.
- **Cache / Realtime**: Redis 7.
- **Search Engine**: Meilisearch v1.10.

## Clean Architecture Layers
LuminaStore strictly adheres to Clean Architecture:
1. **Controllers (`/api/controllers`)**: Handle HTTP requests/responses, payload validation, and JWT extraction. They contain *no* business logic.
2. **Services (`/services`)**: Hold core business rules (e.g., `OrderService`, `PaymentService`, `AIService`). They orchestrate repositories.
3. **Repositories (`/repositories`)**: Manage data persistence and abstract GORM interactions.
4. **Models (`/models`)**: Define the core domain entities and GORM schema annotations.

## Realtime Architecture
WebSockets are facilitated via `gofiber/contrib/websocket` in `ws_hub.go`.
To achieve horizontal scalability, we implemented the **Redis Pub/Sub pattern**. When a message is sent to a specific user (e.g., an order update), the API publishes the event to Redis (`luminastore_ws_channel`). Every API container instance subscribes to this channel. The instance holding the target user's active WebSocket connection will intercept the message and push it to the client, allowing LuminaStore to scale to thousands of concurrent connections seamlessly.

## Moderation & Governance
- **Data Filtering:** Public APIs strictly filter for `products.moderation_status = 'approved'` and `stores.status = 'active'`.
- **Role-Based Access Control (RBAC):** The `RequirePermission(perm)` middleware dynamically checks `role_permissions` rather than hardcoding static role names.
- **Audit Logs:** The `AuditLogService` wraps every administrative mutating action (e.g., `PUT /admin/users/:id/status`) to ensure absolute traceability.

## Financial Architecture
Payouts use the `SettlementProvider` abstraction. When a withdrawal is approved by an Admin, the system pushes the request to the active provider (e.g., `ManualSettlementProvider`), allowing seamless future migration to Stripe Connect or Xendit.
