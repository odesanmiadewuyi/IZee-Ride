# IZee-Ride API Testing Guide for Beginners

## 🚀 Getting Started

Before testing any endpoints, make sure:
1. The server is running on `http://localhost:5000`
2. You have test data in the database (run `node generate-test-data.js`)
3. You have a tool to make HTTP requests (like Postman, curl, or a web browser)

## 🔐 Authentication Endpoints

### 1. Register a New User
**What it does:** Creates a new user account and gives you a token for authentication.

**Method:** POST
**URL:** `http://localhost:5000/api/auth/register`
**Headers:**
```
Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Expected Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Save the token!** You'll need it for protected endpoints.

### 2. Login
**What it does:** Logs in an existing user and gives you a token.

**Method:** POST
**URL:** `http://localhost:5000/api/auth/login`
**Headers:**
```
Content-Type: application/json
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Expected Response:** Same as register - you'll get a user object and token.

### 3. Get User Profile
**What it does:** Shows information about the currently logged-in user.

**Method:** GET
**URL:** `http://localhost:5000/api/auth/profile`
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```
**Expected Response:**
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "role": "user"
  }
}
```

## 👤 User Endpoints

### 4. Get Current User Info
**What it does:** Shows detailed information about the logged-in user.

**Method:** GET
**URL:** `http://localhost:5000/api/users/me`
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```
**Expected Response:**
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "role": "user"
  }
}
```

## 🚗 Vehicle Endpoints

### 5. Get All Vehicles
**What it does:** Lists all vehicles in the system.

**Method:** GET
**URL:** `http://localhost:5000/api/vehicles`
**Headers:** None needed
**Expected Response:**
```json
[
  {
    "id": 1,
    "model": "Toyota Camry",
    "plate_number": "ABC123",
    "driver_id": 1
  }
]
```

### 6. Create a New Vehicle
**What it does:** Adds a new vehicle to the system.

**Method:** POST
**URL:** `http://localhost:5000/api/vehicles`
**Headers:**
```
Content-Type: application/json
```
**Request Body:**
```json
{
  "model": "Honda Civic",
  "plate_number": "XYZ789",
  "driver_id": 1
}
```
**Expected Response:**
```json
{
  "id": 2,
  "model": "Honda Civic",
  "plate_number": "XYZ789",
  "driver_id": 1
}
```

### 7. Get Vehicle by ID
**⚠️ Note:** This endpoint is not fully implemented - it returns a placeholder message.

**Method:** GET
**URL:** `http://localhost:5000/api/vehicles/1` (replace 1 with actual vehicle ID)
**Headers:** None needed
**Expected Response:**
```json
{
  "message": "Fetching vehicle with id: 1"
}
```

### 8. Delete a Vehicle
**⚠️ Note:** This endpoint is not fully implemented - it returns a placeholder message and doesn't actually delete from database.

**Method:** DELETE
**URL:** `http://localhost:5000/api/vehicles/1` (replace 1 with actual vehicle ID)
**Headers:** None needed
**Expected Response:**
```json
{
  "message": "Vehicle with id 1 deleted"
}
```

## 🚕 Ride Endpoints

### 9. Get User's Rides
**What it does:** Lists all rides for the logged-in user.

**Method:** GET
**URL:** `http://localhost:5000/api/rides`
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```
**Expected Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "driver_id": 1,
    "pickup_location": "123 Main St",
    "dropoff_location": "456 Oak Ave",
    "fare": 25.50,
    "status": "pending"
  }
]
```

### 10. Get Ride by ID
**What it does:** Shows details of a specific ride.

**Method:** GET
**URL:** `http://localhost:5000/api/rides/1` (replace 1 with actual ride ID)
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```
**Expected Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "driver_id": 1,
  "pickup_location": "123 Main St",
  "dropoff_location": "456 Oak Ave",
  "fare": 25.50,
  "status": "pending"
}
```

### 11. Request a New Ride
**What it does:** Creates a new ride request.

**Method:** POST
**URL:** `http://localhost:5000/api/rides`
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```
**Request Body:**
```json
{
  "pickup_location": "123 Main St, City A",
  "dropoff_location": "456 Oak Ave, City B",
  "vehicle_id": 1
}
```
**Expected Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "pickup_location": "123 Main St, City A",
  "dropoff_location": "456 Oak Ave, City B",
  "status": "pending"
}
```

### 12. Update Ride Status
**What it does:** Changes the status of a ride (like from pending to completed).

**Method:** PUT
**URL:** `http://localhost:5000/api/rides/1/status` (replace 1 with actual ride ID)
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```
**Request Body:**
```json
{
  "status": "completed"
}
```
**Expected Response:**
```json
{
  "id": 1,
  "status": "completed"
}
```

## 💳 Payment Endpoints

### 13. Get All Payments
**What it does:** Lists all payments in the system.

**Method:** GET
**URL:** `http://localhost:5000/api/payments`
**Headers:** None needed
**Expected Response:**
```json
[
  {
    "id": 1,
    "ride_id": 1,
    "user_id": 1,
    "amount": 25.50,
    "status": "completed"
  }
]
```

### 14. Get Payment by ID
**What it does:** Shows details of a specific payment.

**Method:** GET
**URL:** `http://localhost:5000/api/payments/1` (replace 1 with actual payment ID)
**Headers:** None needed
**Expected Response:**
```json
{
  "id": 1,
  "ride_id": 1,
  "user_id": 1,
  "amount": 25.50,
  "status": "completed"
}
```

### 15. Create a New Payment
**What it does:** Creates a payment record for a ride.

**Method:** POST
**URL:** `http://localhost:5000/api/payments`
**Headers:**
```
Content-Type: application/json
```
**Request Body:**
```json
{
  "ride_id": 1,
  "user_id": 1,
  "amount": 25.50,
  "status": "completed"
}
```
**Expected Response:**
```json
{
  "id": 1,
  "ride_id": 1,
  "user_id": 1,
  "amount": 25.50,
  "status": "completed"
}
```

### 16. Update a Payment
**What it does:** Modifies an existing payment.

**Method:** PUT
**URL:** `http://localhost:5000/api/payments/1` (replace 1 with actual payment ID)
**Headers:**
```
Content-Type: application/json
```
**Request Body:**
```json
{
  "status": "failed"
}
```
**Expected Response:**
```json
{
  "id": 1,
  "status": "failed"
}
```

### 17. Delete a Payment
**What it does:** Removes a payment from the system.

**Method:** DELETE
**URL:** `http://localhost:5000/api/payments/1` (replace 1 with actual payment ID)
**Headers:** None needed
**Expected Response:** 204 No Content (empty response body)

## 🧪 Testing Tips for Beginners

1. **Always test in order:** Start with authentication (register/login), then test other endpoints
2. **Save your token:** After login/register, copy the token and use it in the Authorization header
3. **Use correct IDs:** When testing endpoints that need IDs (like /rides/1), use real IDs from your test data
4. **Check response codes:** 200 means success, 400 means bad request, 401 means not authenticated
5. **Test error cases:** Try sending wrong data to see how the API handles errors

## 🛠️ Using cURL for Testing

Here's how to test the login endpoint with cURL:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

And here's how to use the token for a protected endpoint:

```bash
curl -X GET http://localhost:5000/api/rides \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Common Issues

- **401 Unauthorized:** You're missing the Authorization header or your token is expired
- **400 Bad Request:** Your request body is missing required fields or has wrong data
- **404 Not Found:** The endpoint URL is wrong or the resource doesn't exist
- **500 Internal Server Error:** There's a bug in the server code

Remember: Start simple, test one endpoint at a time, and build up your understanding gradually!
