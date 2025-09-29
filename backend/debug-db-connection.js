const knex = require('knex');
const knexConfig = require('./knexfile');

console.log('🔍 Debugging Database Connection...\n');

// Create database connection using the same config as the API
const db = knex(knexConfig.development);

async function debugConnection() {
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

    // Check if vehicles table exists
    console.log('\n🚗 Checking vehicles table...');
    const tableExists = await db.schema.hasTable('vehicles');
    if (tableExists) {
      console.log('✅ Vehicles table exists');

      // Get total count
      const count = await db('vehicles').count('* as count');
      console.log('📈 Total vehicles in database:', count[0].count);

      // Get latest vehicles
      const latestVehicles = await db('vehicles')
        .select('*')
        .orderBy('id', 'desc')
        .limit(3);

      console.log('\n🔥 Latest 3 vehicles:');
      latestVehicles.forEach(vehicle => {
        console.log(`ID: ${vehicle.id}, Model: ${vehicle.model}, Plate: ${vehicle.plate_number}, Created: ${vehicle.created_at}`);
      });

    } else {
      console.log('❌ Vehicles table does not exist');
    }

    // Now let's check if there's a SQLite file being used
    console.log('\n💾 Checking for SQLite database...');
    const fs = require('fs');
    const path = require('path');

    const sqlitePath = path.join(process.cwd(), 'dev.sqlite3');
    if (fs.existsSync(sqlitePath)) {
      console.log('⚠️  SQLite database file found:', sqlitePath);
      const stats = fs.statSync(sqlitePath);
      console.log('   File size:', (stats.size / 1024).toFixed(2) + ' KB');
      console.log('   Last modified:', stats.mtime.toISOString());

      // Check if SQLite is being used by trying to connect
      console.log('\n🔄 Testing SQLite connection...');
      const sqlite3 = require('sqlite3').verbose();
      const sqliteDb = new sqlite3.Database(sqlitePath);

      sqliteDb.get("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='vehicles'", (err, row) => {
        if (err) {
          console.log('❌ SQLite query error:', err.message);
        } else {
          console.log('✅ SQLite vehicles table exists, count:', row.count);
        }

        sqliteDb.get("SELECT COUNT(*) as count FROM vehicles", (err, row) => {
          if (err) {
            console.log('❌ SQLite vehicles data query error:', err.message);
          } else {
            console.log('📊 SQLite vehicles records:', row.count);
          }

          sqliteDb.close();
        });
      });

    } else {
      console.log('✅ No SQLite database file found');
    }

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔍 Error details:', error);
  } finally {
    // Close connection
    await db.destroy();
    console.log('\n🔌 Database connection closed');
  }
}

debugConnection();
