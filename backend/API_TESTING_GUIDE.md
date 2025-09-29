# IZee-Ride API Testing Guide

## Prerequisites
- Server running on `http://localhost:5000`
- Database populated with test data (run `node insert-test-data.js`)

## Testing Endpoints Step by Step

### 1. Test Public Endpoints (No Authentication Required)

#### GET /api/vehicles - List Vehicles
```bash
# PowerShell
Invoke-WebRequest -Uri http://localhost:5000/api/vehicles -Method Get

# Or using curl (if available)
curl http://localhost:5000/api/vehicles
```

**Expected Response:**
```json
{
  "message": "Fetching all vehicles"
}
```

#### GET /api/payments - List Payments
```bash
# PowerShell
Invoke-WebRequest -Uri http://localhost:5000/api/payments -Method Get

# Or using curl
curl http://localhost:5000/api/payments
```

**Expected Response:** Should return payment data from database

### 2. Test Protected Endpoints (Authentication Required)

First, we need to understand the authentication mechanism. Let's check the auth middleware:

#### Understanding Authentication
The protected endpoints (`/api/auth/profile` and `/api/users/me`) require authentication via JWT tokens. You'll need to:

1. **Get a JWT Token**: Typically by logging in through an authentication endpoint
2. **Include Token in Headers**: Add `Authorization: Bearer <token>` to requests

#### GET /api/auth/profile - User Profile
```bash
# Without authentication (should fail)
Invoke-WebRequest -Uri http://localhost:5000/api/auth/profile -Method Get

# With authentication (example - you'll need a valid token)
$headers = @{
    "Authorization" = "Bearer your_jwt_token_here"
}
Invoke-WebRequest -Uri http://localhost:5000/api/auth/profile -Method Get -Headers $headers
```

**Expected Response (Unauthenticated):** 401 Unauthorized
**Expected Response (Authenticated):** User profile data

#### GET /api/users/me - Current User
```bash
# Without authentication (should fail)
Invoke-WebRequest -Uri http://localhost:5000/api/users/me -Method Get

# With authentication
$headers = @{
    "Authorization" = "Bearer your_jwt_token_here"
}
Invoke-WebRequest -Uri http://localhost:5000/api/users/me -Method Get -Headers $headers
```

**Expected Response (Unauthenticated):** 401 Unauthorized
**Expected Response (Authenticated):** Current user data

### 3. Wallets, Cards, Payments, and Rewards (New)

Use a valid JWT in `$headers` as above.

#### GET /api/wallets/me
```
Invoke-WebRequest -Uri http://localhost:5000/api/wallets/me -Headers $headers -Method Get
```

#### POST /api/wallets/topup
```
Invoke-WebRequest -Uri http://localhost:5000/api/wallets/topup -Headers $headers -Method Post -Body '{"amount":100000}' -ContentType 'application/json'
```

#### POST /api/payments/service-charge
```
Invoke-WebRequest -Uri http://localhost:5000/api/payments/service-charge -Headers $headers -Method Post -Body '{"rideId":1,"amount":3700,"method":"wallet"}' -ContentType 'application/json'
```

#### POST /api/payments/commission
```
Invoke-WebRequest -Uri http://localhost:5000/api/payments/commission -Headers $headers -Method Post -Body '{"rideId":1,"amount":0,"method":"wallet"}' -ContentType 'application/json'
```

#### Cards
```
Invoke-WebRequest -Uri http://localhost:5000/api/cards -Headers $headers -Method Get
Invoke-WebRequest -Uri http://localhost:5000/api/cards -Headers $headers -Method Post -Body '{"cardNumber":"4242424242424242","expMonth":8,"expYear":2027,"brand":"VISA"}' -ContentType 'application/json'
```

#### Milepoints
```
Invoke-WebRequest -Uri http://localhost:5000/api/rewards/points/me -Headers $headers -Method Get
Invoke-WebRequest -Uri http://localhost:5000/api/rewards/tickets -Method Get
Invoke-WebRequest -Uri http://localhost:5000/api/rewards/tickets/claim -Headers $headers -Method Post -Body '{"ticketId":1}' -ContentType 'application/json'
```

## Testing Workflow

1. **Start Server**: `node_modules\.bin\ts-node.cmd src/server.ts`
2. **Test Public Endpoints**: Verify `/api/vehicles` and `/api/payments` work
3. **Check Authentication Setup**: Look for login/register endpoints
4. **Get Authentication Token**: Find/create authentication mechanism
5. **Test Protected Endpoints**: Use token to access `/api/auth/profile` and `/api/users/me`

## Troubleshooting

- **404 Errors**: Check if routes are properly mounted in `src/app.ts`
- **Database Errors**: Ensure PostgreSQL is running and database is created
- **Authentication Issues**: Check JWT configuration and middleware

## Additional Testing

For comprehensive testing, also test:
- POST endpoints (create vehicles, payments)
- Error scenarios (invalid data, missing fields)
- Edge cases (empty responses, pagination)
