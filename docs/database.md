# LuminaStore Database Documentation

## Core Entities
LuminaStore uses PostgreSQL 15, managed via GORM.

### `users`
- Stores authentication credentials, OAuth mapping, and global statuses (active/suspended).
- **Security Additions:** Linked to `login_history`, `user_devices`, and `user_2fa_settings`.

### `stores`
- Every seller operates a `Store`. Stores hold an independent wallet balance.

### `products` & `product_variants`
- Base product metadata (title, category, brand).
- Variants define specific SKUs, pricing, and stock levels.
- **Moderation:** Products have a `moderation_status` (pending, approved, rejected).

### `orders` & `order_items`
- Tracks customer purchases, shipping details, and tax breakdowns.
- Follows strict state machine: `pending_payment` -> `paid` -> `packed` -> `shipped` -> `delivered`.

### `withdrawals`
- Ledger for tracking seller payout requests to external bank accounts. 

### `roles`, `permissions`, `role_permissions`
- Defines the dynamic RBAC architecture. Roles (e.g., Moderator, Admin) are granted granular permissions (e.g., `products.approve`).

### `audit_logs`
- Immutable append-only ledger tracking *who* did *what* to *which entity*, capturing the IP address, User Agent, and Before/After states in JSON format.
