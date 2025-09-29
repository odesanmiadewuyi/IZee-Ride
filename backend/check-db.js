const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3'
  },
  useNullAsDefault: true
});

async function checkDatabase() {
  try {
    console.log('Checking vehicles table...');
    const vehicles = await knex('vehicles').select('*');
    console.log('Vehicles found:', vehicles.length);
    console.log('Vehicles data:', JSON.stringify(vehicles, null, 2));

    console.log('\nChecking users table...');
    const users = await knex('users').select('*');
    console.log('Users found:', users.length);
    console.log('Users data:', JSON.stringify(users, null, 2));

  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await knex.destroy();
  }
}

checkDatabase();
