exports.up = function(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.timestamps(true, true);
    })
    .createTable('drivers', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('license_number').notNullable().unique();
      table.string('vehicle_type').notNullable();
      table.timestamps(true, true);
    })
    .createTable('vehicles', (table) => {
      table.increments('id').primary();
      table.string('model').notNullable();
      table.string('plate_number').notNullable().unique();
      table.integer('driver_id').unsigned().references('id').inTable('drivers').onDelete('CASCADE');
      table.timestamps(true, true);
    })
    .createTable('rides', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('driver_id').unsigned().references('id').inTable('drivers').onDelete('CASCADE');
      table.string('pickup_location').notNullable();
      table.string('dropoff_location').notNullable();
      table.decimal('fare', 10, 2).notNullable();
      table.timestamps(true, true);
    })
    .createTable('payments', (table) => {
      table.increments('id').primary();
      table.integer('ride_id').unsigned().references('id').inTable('rides').onDelete('CASCADE');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.decimal('amount', 10, 2).notNullable();
      table.string('status').notNullable().defaultTo('pending');
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('payments')
    .dropTableIfExists('rides')
    .dropTableIfExists('vehicles')
    .dropTableIfExists('drivers')
    .dropTableIfExists('users');
};
