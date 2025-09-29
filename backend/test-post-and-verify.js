const http = require('http');

console.log('🧪 Testing API POST and Database Verification...\n');

let authToken = '';

// Test data
const testVehicle = {
  model: 'Test Vehicle ' + Date.now(),
  plate_number: 'TEST' + Date.now().toString().slice(-4)
};

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = body ? JSON.parse(body) : {};
          resolve({ statusCode: res.statusCode, response });
        } catch (e) {
          resolve({ statusCode: res.statusCode, response: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testPostAndVerify() {
  try {
    console.log('1️⃣ Testing POST /api/vehicles...');

    const postOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/vehicles',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(testVehicle))
      }
    };

    const postResult = await makeRequest(postOptions, testVehicle);
    console.log('   Status:', postResult.statusCode);
    console.log('   Response:', JSON.stringify(postResult.response, null, 2));

    if (postResult.statusCode === 200 && postResult.response.vehicle) {
      console.log('✅ Vehicle created successfully!');
      console.log('   Vehicle ID:', postResult.response.vehicle.id);
      console.log('   Model:', postResult.response.vehicle.model);
      console.log('   Plate:', postResult.response.vehicle.plate_number);

      // Now verify it's in the database
      console.log('\n2️⃣ Verifying data in database...');

      const knex = require('knex');
      const knexConfig = require('./knexfile');

      const db = knex(knexConfig.development);

      try {
        // Check if the vehicle exists in database
        const vehicleInDb = await db('vehicles')
          .where('plate_number', testVehicle.plate_number)
          .first();

        if (vehicleInDb) {
          console.log('✅ Vehicle found in database!');
          console.log('   DB ID:', vehicleInDb.id);
          console.log('   DB Model:', vehicleInDb.model);
          console.log('   DB Plate:', vehicleInDb.plate_number);
          console.log('   Created At:', vehicleInDb.created_at);

          // Get total count
          const count = await db('vehicles').count('* as count');
          console.log('   Total vehicles in DB:', count[0].count);

        } else {
          console.log('❌ Vehicle NOT found in database!');
          console.log('   This means the API is not saving to the correct database.');
        }

      } catch (dbError) {
        console.log('❌ Database query error:', dbError.message);
      } finally {
        await db.destroy();
      }

    } else {
      console.log('❌ Vehicle creation failed!');
      console.log('   This could be due to validation errors or server issues.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPostAndVerify();
