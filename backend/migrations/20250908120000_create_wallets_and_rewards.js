/**
 * Creates wallets, cards, milepoints and related tables.
 * Also extends payments with method, recipient and reference.
 * @param { import('knex').Knex } knex
 */
exports.up = async function up(knex) {
  // wallets
  await knex.schema.createTable('wallets', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE').index();
    table.decimal('balance', 12, 2).notNullable().defaultTo(0);
    table.string('currency').notNullable().defaultTo('NGN');
    table.timestamps(true, true);
    table.unique(['user_id']);
  });

  await knex.schema.createTable('wallet_transactions', (table) => {
    table.increments('id').primary();
    table.integer('wallet_id').unsigned().notNullable().references('id').inTable('wallets').onDelete('CASCADE').index();
    table.enu('type', ['topup', 'debit', 'credit', 'refund', 'service_charge', 'commission']).notNullable();
    table.decimal('amount', 12, 2).notNullable();
    table.decimal('balance_after', 12, 2).notNullable();
    table.string('reference').index();
    table.jsonb('meta');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('cards', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE').index();
    table.string('brand').notNullable();
    table.string('last4').notNullable();
    table.integer('exp_month').notNullable();
    table.integer('exp_year').notNullable();
    table.boolean('is_default').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });

  // Mile points
  await knex.schema.createTable('milepoints', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE').unique();
    table.integer('points').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('milepoint_transactions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE').index();
    table.enu('type', ['earn', 'redeem']).notNullable();
    table.integer('points').notNullable();
    table.string('reference');
    table.jsonb('meta');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('tickets', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('image_url');
    table.integer('price_points').notNullable();
    table.string('tier'); // e.g. 'within_5000', 'within_10000'
    table.timestamps(true, true);
  });

  await knex.schema.createTable('ticket_claims', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE').index();
    table.integer('ticket_id').unsigned().notNullable().references('id').inTable('tickets').onDelete('CASCADE');
    table.integer('points_spent').notNullable();
    table.enu('status', ['pending', 'approved', 'rejected']).notNullable().defaultTo('pending');
    table.timestamps(true, true);
  });

  // extend payments
  const hasMethod = await knex.schema.hasColumn('payments', 'method');
  if (!hasMethod) {
    await knex.schema.alterTable('payments', (table) => {
      table.enu('method', ['wallet', 'card', 'cash']).notNullable().defaultTo('wallet');
      table.enu('recipient', ['rider', 'platform']).notNullable().defaultTo('rider');
      table.string('reference');
      table.string('type').notNullable().defaultTo('generic'); // e.g. 'service_charge', 'commission'
    });
  }
};

/**
 * @param { import('knex').Knex } knex
 */
exports.down = async function down(knex) {
  const drop = (name) => knex.schema.hasTable(name).then((exists) => exists && knex.schema.dropTable(name));
  await drop('ticket_claims');
  await drop('tickets');
  await drop('milepoint_transactions');
  await drop('milepoints');
  await drop('cards');
  await drop('wallet_transactions');
  await drop('wallets');

  const hasMethod = await knex.schema.hasColumn('payments', 'method');
  if (hasMethod) {
    await knex.schema.alterTable('payments', (table) => {
      table.dropColumn('method');
      table.dropColumn('recipient');
      table.dropColumn('reference');
      table.dropColumn('type');
    });
  }
};

