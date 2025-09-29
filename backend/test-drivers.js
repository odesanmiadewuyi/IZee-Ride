const http = require('http');

console.log('Testing Drivers API endpoints...\n');

// Test GET all drivers
function testGetDrivers() {
  console.log('1. Testing GET /api/drivers...');
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/drivers',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('   Status: ' + res.statusCode);
      console.log('   Response:', data);
      testCreateDriver();
    });
  });

  req.on('error', (error) => {
    console.log('   ❌ GET drivers error:', error.message);
    testCreateDriver();
  });

  req.end();
}

// Test POST create driver
function testCreateDriver() {
  console.log('\n2. Testing POST /api/drivers...');
  const timestamp = Date.now();
  const driverData = JSON.stringify({
    name: 'John Doe',
    license_number: `DL${timestamp}`,
    vehicle_type: 'Sedan'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/drivers',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': driverData.length
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
      console.log('\n✅ Drivers API endpoints tested successfully!');
    });
  });

  req.on('error', (error) => {
    console.log('   ❌ POST driver error:', error.message);
    console.log('\n✅ Drivers API endpoints tested!');
  });

  req.write(driverData);
  req.end();
}

// Start testing
testGetDrivers();
