const knex = require('knex');
const knexConfig = require('./knexfile');

console.log('🔍 Verifying Database Connection...\n');

// Create database connection
const db = knex(knexConfig.development);

async function verifyConnection() {
  try {
    console.log('📡 Testing database connection...');

    // Test basic connection
    await db.raw('SELECT 1');
    console.log('✅ Database connection successful!');

    // Get database info
    const result = await db.raw('SELECT current_database(), current_user, version()');
    console.log('\n📊 Database Information:');
    console.log('Database:', result.rows[0].current_database);
    console.log('User:', result.rows[0].current_user);
    console.log('Version:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);

    // Check if vehicles table exists and get count
    console.log('\n🚗 Checking vehicles table...');
    const tableExists = await db.schema.hasTable('vehicles');
    if (tableExists) {
      console.log('✅ Vehicles table exists');

      const count = await db('vehicles').count('* as count');
      console.log('📈 Total vehicles in database:', count[0].count);

      // Get latest vehicles
      const latestVehicles = await db('vehicles')
        .select('*')
        .orderBy('id', 'desc')
        .limit(5);

      console.log('\n🔥 Latest 5 vehicles:');
      latestVehicles.forEach(vehicle => {
        console.log(`ID: ${vehicle.id}, Model: ${vehicle.model}, Plate: ${vehicle.plate_number}, Created: ${vehicle.created_at}`);
      });

    } else {
      console.log('❌ Vehicles table does not exist');
    }

    // Check connection details from environment
    console.log('\n🔧 Connection Configuration:');
    console.log('Host:', knexConfig.development.connection.host || 'localhost');
    console.log('Port:', knexConfig.development.connection.port || 5432);
    console.log('Database:', knexConfig.development.connection.database || 'izee_ride');
    console.log('User:', knexConfig.development.connection.user || 'postgres');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔍 Error details:', error);
  } finally {
    // Close connection
    await db.destroy();
    console.log('\n🔌 Database connection closed');
  }
}

verifyConnection();
