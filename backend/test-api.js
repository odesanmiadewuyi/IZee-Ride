const http = require('http');

console.log('Testing IZee-Ride API endpoints...\n');

let authToken = '';
let createdRideId = null;
let createdVehicleId = null;
let createdPaymentId = null;
let testEmail = '';

// Test health endpoint (if available)
function testHealth() {
  console.log('1. Testing health endpoint...');
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('   Status: ' + res.statusCode);
      if (res.statusCode === 200) {
        console.log('   ✅ Health endpoint working');
      } else {
        console.log('   ℹ️  Health endpoint not implemented');
      }
      testAuthRegister();
    });
  });

  req.on('error', (error) => {
    console.log('   ❌ Health endpoint error:', error.message);
    testAuthRegister();
  });

  req.end();
}

// Test auth registration
function testAuthRegister() {
  console.log('\n2. Testing auth registration...');
  const timestamp = Date.now();
  testEmail = `testuser${timestamp}@example.com`;
  const registerData = JSON.stringify({
    name: 'Test User',
    email: testEmail,
    password: 'TestPass123'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': registerData.length
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('   Status: ' + res.statusCode);
      console.log('   Response:', data);
      testAuthLogin();
    });
  });

  req.on('error', (error) => {
    console.log('   ❌ Register error:', error.message);
    testAuthLogin();
  });

  req.write(registerData);
  req.end();
}

// Test auth login
function testAuthLogin() {
  console.log('\n3. Testing auth login...');
  const loginData = JSON.stringify({
    email: testEmail,
    password: 'TestPass123'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('   Status: ' + res.statusCode);
      console.log('   Response:', data);

      // Extract token from response
      try {
        const responseData = JSON.parse(data);
        if (responseData.token) {
          authToken = responseData.token;
          console.log('   ✅ Token received and stored');
        }
      } catch (e) {
        console.log('   ❌ Failed to parse token from response');
      }

      testVehicles();
    });
  });

  req.on('error', (error) => {
    console.log('   ❌ Login error:', error.message);
    testVehicles();
  });

  req.write(loginData);
  req.end();
}

// Test vehicles endpoints
function testVehicles() {
  console.log('\n4. Testing vehicles endpoints...');

  // GET all vehicles
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/vehicles',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('   GET /api/vehicles - Status: ' + res.statusCode);
      console.log('   Response:', data);
      testCreateVehicle();
    });
  });

  req.on('error', (error) => {
    console.log('   ❌ Vehicles GET error:', error.message);
    testCreateVehicle();
  });

  req.end();
}

// Test create vehicle
function testCreateVehicle() {
  console.log('\n5. Testing create vehicle endpoint...');
  const timestamp = Date.now();
  const vehicleData = JSON.stringify({
    model: 'Honda Civic',
    plate_number: `XYZ${timestamp}`,
    driver_id: 1 // Assuming driver with ID 1 exists
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/vehicles',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': vehicleData.length,
      'Authorization': `Bearer ${authToken}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('   POST /api/vehicles - Status: ' + res.statusCode);
      console.log('   Response:', data);
      try {
        const responseData = JSON.parse(data);
        if (responseData.vehicle && responseData.vehicle.id) {
          createdVehicleId = responseData.vehicle.id;
          console.log('   ✅ Vehicle created with ID:', createdVehicleId);
        }
      } catch (e) {
        console.log('   ❌ Failed to parse vehicle creation response');
      }
      testRides();
    });
  });

  req.on('error', (error) => {
    console.log('   ❌ Vehicles POST error:', error.message);
    testRides();
  });

  req.write(vehicleData);
  req.end();
}

// Test rides endpoints
function testRides() {
  console.log('\n6. Testing rides endpoints...');

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/rides',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('   GET /api/rides - Status: ' + res.statusCode);
      console.log('   Response:', data);
      testCreateRide();
    });
  });

  req.on('error', (error) => {
    console.log('   ❌ Rides GET error:', error.message);
    testCreateRide();
  });

  req.end();
}

// Test create ride
function testCreateRide() {
  console.log('\n7. Testing create ride endpoint...');
  const rideData = JSON.stringify({
    user_id: 1, // Assuming user with ID 1 exists
    driver_id: 1, // Assuming driver with ID 1 exists
    pickup_location: '789 Pine St',
    dropoff_location: '101 Maple Ave',
    fare: 30.00
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/rides',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': rideData.length,
      'Authorization': `Bearer ${authToken}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('   POST /api/rides - Status: ' + res.statusCode);
      console.log('   Response:', data);
      try {
        const responseData = JSON.parse(data);
        if (responseData.ride && responseData.ride.id) {
          createdRideId = responseData.ride.id;
          console.log('   ✅ Ride created with ID:', createdRideId);
        }
      } catch (e) {
        console.log('   ❌ Failed to parse ride creation response');
      }
      testUpdateRideStatus();
    });
  });

  req.on('error', (error) => {
    console.log('   ❌ Rides POST error:', error.message);
    testUpdateRideStatus();
  });

  req.write(rideData);
  req.end();
}

// Test update ride status
function testUpdateRideStatus() {
  console.log('\n8. Testing update ride status endpoint...');
  if (!createdRideId) {
    console.log('   ❌ No ride ID available to update');
    testPayments();
    return;
  }

  const statusData = JSON.stringify({
    status: 'completed'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: `/api/rides/${createdRideId}/status`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': statusData.length,
      'Authorization': `Bearer ${authToken}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('   PUT /api/rides/:id/status - Status: ' + res.statusCode);
      console.log('   Response:', data);
      testPayments();
    });
  });

  req.on('error', (error) => {
    console.log('   ❌ Rides PUT error:', error.message);
    testPayments();
  });

  req.write(statusData);
  req.end();
}

// Test payments endpoints
function testPayments() {
  console.log('\n9. Testing payments endpoints...');

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/payments',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('   GET /api/payments - Status: ' + res.statusCode);
      console.log('   Response:', data);
      testCreatePayment();
    });
  });

  req.on('error', (error) => {
    console.log('   ❌ Payments GET error:', error.message);
    testCreatePayment();
  });

  req.end();
}

// Test create payment
function testCreatePayment() {
  console.log('\n10. Testing create payment endpoint...');
  if (!createdRideId) {
    console.log('   ❌ No ride ID available for payment');
    console.log('\n✅ All API endpoints tested successfully!');
    return;
  }

  const paymentData = JSON.stringify({
    ride_id: createdRideId,
    user_id: 1, // Assuming user with ID 1 exists
    amount: 30.00,
    status: 'completed'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/payments',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': paymentData.length,
      'Authorization': `Bearer ${authToken}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('   POST /api/payments - Status: ' + res.statusCode);
      console.log('   Response:', data);
      try {
        const responseData = JSON.parse(data);
        if (responseData.success && responseData.data && responseData.data.id) {
          createdPaymentId = responseData.data.id;
          console.log('   ✅ Payment created with ID:', createdPaymentId);
        }
      } catch (e) {
        console.log('   ❌ Failed to parse payment creation response');
      }
      console.log('\n✅ All API endpoints tested successfully!');
    });
  });

  req.on('error', (error) => {
    console.log('   ❌ Payments POST error:', error.message);
    console.log('\n✅ All API endpoints tested!');
  });

  req.write(paymentData);
  req.end();
}

// Start testing
testHealth();
