# API Documentation

## Current API Documentation Methods

### 1. **README.md** (Currently Available)
The primary API documentation is in `README.md`:
- **API Overview** section with endpoint table
- **Core Endpoints** showing all 35+ endpoints
- **Example Request** for creating orders
- **Test Credentials** for authentication
- **Authentication** section with JWT details

**Access**: Open [README.md](README.md)

### 2. **Swagger UI** (Recommended - Setup Instructions)

#### Option A: Manual Installation (Recommended)
If you want interactive Swagger UI documentation:

```bash
npm install @nestjs/swagger swagger-ui-express
```

Then update `src/main.ts`:
```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Swagger Configuration
    const config = new DocumentBuilder()
      .setTitle('QSR Waiter Order Management API')
      .setDescription('REST API for restaurant waiter order management')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 3000, '127.0.0.1');
    console.log(`✓ Application listening on 127.0.0.1:${process.env.PORT ?? 3000}`);
    console.log(`✓ Swagger UI available at http://127.0.0.1:3000/api`);
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap();
```

Then run:
```bash
npm run start:dev
```

Access Swagger UI at: `http://127.0.0.1:3000/api`

#### Option B: Pre-built Postman Collection (Alternative)
Import this Postman collection URL:
```
https://raw.githubusercontent.com/mishranikhil15/Harij-Softech/main/postman-collection.json
```
(After you create and push the collection)

---

## Current API Endpoints Overview

### Authentication
**POST** `/auth/login`
```json
{
  "username": "waiter1",
  "password": "password123"
}
```
Response: JWT token (valid for 1 hour)

---

## Endpoint Summary Table

| Module | Endpoints | Count |
|--------|-----------|-------|
| **Waiters** | GET /waiters, POST /waiters, GET /waiters/active, PATCH /waiters/:id/status | 4 |
| **Floors** | GET /floors, POST /floors, GET /floors/:id | 3 |
| **Tables** | GET /tables, POST /tables, GET /tables/floor/:id, GET /tables/waiter/:id, GET /tables/:id, PATCH /tables/:id/assign, PATCH /tables/:id/unassign | 7 |
| **Menu Categories** | GET /menu/categories, POST /menu/categories | 2 |
| **Menu Items** | GET /menu/items, POST /menu/items, GET /menu/items/category/:id, PATCH /menu/items/:id/availability | 4 |
| **Orders** | POST /orders, GET /orders, GET /orders/:id, GET /orders/table/:id, GET /orders/waiter/:id, PATCH /orders/:id/status, DELETE /orders/:id | 7 |
| **QR Tokens** | POST /qr/generate, GET /qr/verify/:token | 2 |
| **App** | GET / (Health check) | 1 |
| **TOTAL** | | **35+** |

---

## Testing the API

### Option 1: Using cURL (Command Line)

#### Login and Get Token
```bash
curl -X POST http://127.0.0.1:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"waiter1","password":"password123"}'
```

#### Get All Waiters (with token)
```bash
curl -X GET http://127.0.0.1:3000/waiters \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create an Order
```bash
curl -X POST http://127.0.0.1:3000/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tableId": 1,
    "items": [
      {"menuItemId": 5, "quantity": 2, "instructions": "No spices"}
    ],
    "notes": "Birthday celebration"
  }'
```

### Option 2: Using Python

See [test_api.py](test_api.py) for comprehensive Python test suite.

```bash
python3 test_api.py
```

### Option 3: Using Bash

See [comprehensive-test.sh](comprehensive-test.sh) for bash test suite.

```bash
bash comprehensive-test.sh
```

### Option 4: Using Postman (GUI)

1. Download [Postman](https://www.postman.com/downloads/)
2. Import the collection (once created)
3. Set base URL: `http://127.0.0.1:3000`
4. Use environment variables for token management

---

## Error Response Format

All errors follow this format:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Security Notes

- All endpoints (except `/auth/login`) require JWT authentication
- JWT tokens expire after 1 hour
- Passwords are hashed with bcrypt (10 rounds)
- QR tokens expire after 10 minutes
- All inputs are validated with DTOs

---

## Next Steps

To enable Swagger UI (recommended for better documentation):

1. Install dependencies:
   ```bash
   npm install @nestjs/swagger swagger-ui-express
   ```

2. Update `src/main.ts` with the code above

3. Run the server:
   ```bash
   npm run start:dev
   ```

4. Open browser to:
   ```
   http://127.0.0.1:3000/api
   ```

---

**For detailed endpoint specifications, see [README.md](README.md)**
