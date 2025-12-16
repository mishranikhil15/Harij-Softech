# QSR Waiter Order Management System

REST API for restaurant waiter order management with multi-floor tables, menu management, and real-time order tracking.

## Tech Stack
- **NestJS** (Node.js), **TypeScript**, **MySQL**, **TypeORM**, **JWT Auth**

## Quick Start

### Prerequisites
- Node.js >= 14, MySQL >= 5.7

### Setup
```bash
npm install
cp .env.example .env
# Edit .env with your database credentials

npm run seed          # Seed database
npm run start:dev     # Run server (port 3000)
```

## API Overview

**Base URL**: `http://localhost:3000`

### Authentication
```
POST /auth/login
{ "username": "waiter1", "password": "password123" }
```
Returns JWT token - include in all requests: `Authorization: Bearer <token>`

### Core Endpoints (35+ total)

| Module | Endpoints |
|--------|-----------|
| **Waiters** | GET/POST /waiters, GET /waiters/active, PATCH /waiters/:id/status |
| **Floors** | GET/POST /floors, GET /floors/:id |
| **Tables** | GET/POST /tables, GET /tables/floor/:id, PATCH /tables/:id/assign |
| **Menu** | GET/POST /menu/categories, GET/POST /menu/items, PATCH /menu/items/:id/availability |
| **Orders** | POST /orders, GET /orders, GET /orders/:id, PATCH /orders/:id/status |
| **QR Tokens** | POST /qr/generate, GET /qr/verify/:token |

### Example: Create Order
```
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "tableId": 1,
  "items": [
    { "menuItemId": 5, "quantity": 2, "instructions": "No spices" }
  ],
  "notes": "Birthday celebration"
}
```

## Database Relationships

```
Floor (1) ──→ (Many) Tables
Waiter (1) ──→ (Many) Tables (assigned)
Waiter (1) ──→ (Many) Orders
Table (1) ──→ (Many) Orders
MenuCategory (1) ──→ (Many) MenuItems
Order (Many) ──→ OrderItems ←─ (Many) MenuItems [Junction Table]
Waiter (1) ──→ (Many) QrTokens
```

**Key Relations:**
- `tables.floorId` → floors.id (required)
- `tables.waiterId` → waiters.id (nullable - table can be unassigned)
- `orders.tableId` → tables.id, `orders.waiterId` → waiters.id
- `menu_items.categoryId` → menu_categories.id
- `order_items` connects orders ↔ menu_items (with quantity, instructions)

### ER Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA                          │
└──────────────────────────────────────────────────────────────────┘

         ┌─────────────┐
         │   FLOOR     │
         ├─────────────┤
         │ id (PK)     │
         │ name        │
         │ capacity    │
         └──────┬──────┘
                │
                │ 1:N (floorId)
                ↓
         ┌─────────────────┐
         │     TABLE       │
         ├─────────────────┤
         │ id (PK)         │
         │ floorId (FK)    │
         │ tableNumber     │
         │ capacity        │
         │ status          │
         │ waiterId (FK,?) │
         └────────┬────────┘
              /   │   \
         1:N /    │    \ 1:N
            /     │     \
           /      │      ↓
          │       │   ┌─────────────┐
          │       │   │    ORDER    │
          │       │   ├─────────────┤
          │       │   │ id (PK)     │
          │       │   │ tableId(FK) │
          │       │   │ waiterId(FK)│
          │       │   │ status      │
          │       │   │ totalPrice  │
          │       │   │ createdAt   │
          │       │   └─────┬───────┘
          │       │         │ 1:N
          │       │         ↓
          │       │   ┌──────────────────┐
          │       │   │   ORDER_ITEMS    │
          │       │   ├──────────────────┤
          │       │   │ id (PK)          │
          │       │   │ orderId (FK)     │
          │       │   │ menuItemId (FK)  │
          │       │   │ quantity         │
          │       │   │ instructions     │
          │       │   │ price            │
          │       │   └────────┬─────────┘
          │       │            │ N:1
          │       │            ↓
          │       │   ┌─────────────────────┐
          │       │   │   MENU_ITEMS       │
          │       │   ├─────────────────────┤
          │       │   │ id (PK)             │
          │       │   │ categoryId (FK)     │
          │       │   │ name                │
          │       │   │ price               │
          │       │   │ isAvailable         │
          │       │   └────────┬────────────┘
          │       │            │ N:1
          │       │            ↓
          │       │   ┌─────────────────┐
          │       │   │ MENU_CATEGORIES │
          │       │   ├─────────────────┤
          │       │   │ id (PK)         │
          │       │   │ name            │
          │       │   └─────────────────┘
          │       │
          │       └─→ (N:1 to WAITER)
          │
          ↓
    ┌──────────────┐
    │    WAITER    │
    ├──────────────┤
    │ id (PK)      │
    │ username     │
    │ password     │
    │ phoneNumber  │
    │ isActive     │
    │ createdAt    │
    └──────┬───────┘
           │
           │ 1:N (waiterId)
           ↓
    ┌───────────────┐
    │  QR_TOKENS    │
    ├───────────────┤
    │ id (PK)       │
    │ token (UQ)    │
    │ waiterId (FK) │
    │ expiresAt     │
    │ createdAt     │
    └───────────────┘

Legend: PK = Primary Key, FK = Foreign Key, ? = Nullable, N:1 = Many-to-One, 1:N = One-to-Many
```

## Project Structure

```
src/
├── auth/          # Login, JWT strategy, auth guard
├── waiters/       # Waiter management & profiles
├── floors/        # Floor management
├── tables/        # Table & waiter assignment
├── menu/          # Categories & menu items
├── orders/        # Order lifecycle & items
├── qr/            # QR token generation & verification
├── app.module.ts  # Main module
└── main.ts        # Server entry point
```

## Business Rules

1. **Authentication**: All endpoints (except `/auth/login`) require JWT token
2. **Table Assignment**: Only assigned waiters can create orders for their tables
3. **Menu Items**: Must be available to add to orders
4. **Order Status**: Strict workflow: CREATED → CONFIRMED → PREPARING → SERVED → PAID
5. **QR Tokens**: Expire after 10 minutes
6. **Passwords**: Hashed with bcrypt (10 rounds)

## Security Features

- ✅ JWT-based authentication (1 hour expiry)
- ✅ Password hashing with bcrypt
- ✅ Input validation with DTOs
- ✅ Authorization checks (table ownership, item availability)
- ✅ Expiring QR tokens (10 minutes)

## Testing

Test credentials (after `npm run seed`):
```
username: waiter1, waiter2, waiter3, waiter4
password: password123
```

Run comprehensive tests:
```bash
bash comprehensive-test.sh
# or
python3 test_api.py
```

## Scripts

```bash
npm run start:dev   # Development with hot reload
npm run build       # Build for production
npm run seed        # Seed database with sample data
npm run lint        # Run ESLint
```

## Error Handling

All errors return:
```json
{
  "statusCode": 400,
  "message": "Specific error message",
  "error": "Bad Request"
}
```

## Key Features Implemented

- ✅ Multi-floor restaurant management
- ✅ Real-time table assignment
- ✅ Complete order lifecycle tracking
- ✅ Menu category & item management
- ✅ QR-based access tokens
- ✅ Waiter profile management
- ✅ Auto-generated order numbers

## Environment Variables

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=harij
JWT_SECRET=your_secret_key
PORT=3000
```
- ON DELETE: RESTRICT (prevents deletion if children exist)
- ON UPDATE: CASCADE (updates propagate to children)

// Example:
- ✅ Can delete a floor ONLY if it has no tables
- ✅ Can update a waiter's ID, orders update automatically
- ❌ Cannot delete a table if it has pending orders
```

## Business Rules

1. **Authentication**: All endpoints except `/auth/login` and `POST /waiters` require JWT
2. **Table Assignment**: Only assigned waiters can create orders for their tables
3. **Order Items**: Menu items must be available to add to orders
4. **Order Status**: Status transitions follow a strict workflow
5. **QR Tokens**: Tokens expire after 10 minutes
6. **Password Security**: All passwords are hashed with bcrypt
7. **Order Numbers**: Auto-generated unique order numbers with timestamp

## Error Handling

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Table is not assigned to you",
  "error": "Bad Request"
}
```

## Scripts

```bash
npm run build         # Build the project
npm run start         # Start production server
npm run start:dev     # Start with hot reload
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
npm run seed          # Seed database with sample data
npm run test          # Run tests
npm run test:e2e      # Run e2e tests
```

## Project Structure

```
src/
├── auth/               # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt-auth.guard.ts
│   └── dto/
├── waiters/            # Waiter management
│   ├── waiters.controller.ts
│   ├── waiters.service.ts
│   ├── waiter.entity.ts
│   └── dto/
├── floors/             # Floor management
├── tables/             # Table management
├── menu/               # Menu management
├── orders/             # Order management
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   ├── order.repository.ts
│   ├── domain/
│   ├── infrastructure/
│   └── dto/
├── qr/                 # QR token management
├── app.module.ts
├── main.ts
└── seed.ts             # Database seeding script
```

## Performance Considerations

- Order queries are eager-loaded with items
- Menu items are cached at the service level
- Table queries filtered by floor for efficiency
- JWT tokens expire after 1 hour (configurable)

## Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT-based authentication
- ✅ Expiring QR tokens (10 minutes)
- ✅ Request validation with class-validator
- ✅ Role-based access control (via JWT claims)

## Future Enhancements

- [ ] Pagination for list endpoints
- [ ] Order filtering and search
- [ ] Menu item images
- [ ] WebSocket real-time updates
- [ ] Order editing
- [ ] Billing and payments
- [ ] Customer ratings
- [ ] Reservation system
- [ ] Email notifications
- [ ] Analytics and reports


