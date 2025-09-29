/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('payments').del();
  await knex('rides').del();
  await knex('vehicles').del();
  await knex('drivers').del();
  await knex('users').del();

  // Insert users
  await knex('users').insert([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: '$2b$10$example.hash.here',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: '$2b$10$example.hash.here',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);

  // Insert drivers
  await knex('drivers').insert([
    {
      id: 1,
      name: 'Driver One',
      license_number: 'DL123456',
      vehicle_type: 'sedan',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: 2,
      name: 'Driver Two',
      license_number: 'DL123457',
      vehicle_type: 'SUV',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);

  // Insert vehicles
  await knex('vehicles').insert([
    {
      id: 1,
      model: 'Toyota Camry',
      plate_number: 'ABC123',
      driver_id: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: 2,
      model: 'Honda Civic',
      plate_number: 'XYZ789',
      driver_id: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);

  // Insert rides
  await knex('rides').insert([
    {
      id: 1,
      user_id: 1,
      driver_id: 1,
      pickup_location: '123 Main St',
      dropoff_location: '456 Oak Ave',
      fare: 25.50,
      status: 'completed',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: 2,
      user_id: 2,
      driver_id: 2,
      pickup_location: '789 Pine St',
      dropoff_location: '101 Maple Ave',
      fare: 30.00,
      status: 'completed',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);

  // Insert payments
  await knex('payments').insert([
    {
      id: 1,
      ride_id: 1,
      user_id: 1,
      amount: 25.50,
      status: 'completed',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: 2,
      ride_id: 2,
      user_id: 2,
      amount: 30.00,
      status: 'completed',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);
};
