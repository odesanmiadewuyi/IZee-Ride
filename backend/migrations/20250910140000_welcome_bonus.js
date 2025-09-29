/**
 * Welcome bonus for new riders: balance tracking and usage per ride.
 * @param { import('knex').Knex } knex
 */
exports.up = async function up(knex) {
  const hasBonusApplied = await knex.schema.hasColumn('rides', 'welcome_bonus_applied');
  if (!hasBonusApplied) {
    await knex.schema.alterTable('rides', (table) => {
      table.decimal('welcome_bonus_applied', 10, 2).notNullable().defaultTo(0);
      table.decimal('fare_after_bonus', 10, 2).notNullable().defaultTo(0);
    });
    await knex('rides').update({
      welcome_bonus_applied: 0,
      fare_after_bonus: knex.ref('fare'),
    });
  }

  const hasWelcomeBonuses = await knex.schema.hasTable('welcome_bonuses');
  if (!hasWelcomeBonuses) {
    await knex.schema.createTable('welcome_bonuses', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE').unique();
      table.decimal('initial_amount', 12, 2).notNullable();
      table.decimal('balance', 12, 2).notNullable();
      table.date('last_applied_on');
      table.timestamps(true, true);
      table.timestamp('awarded_at').notNullable().defaultTo(knex.fn.now());
    });
  }

  const hasWelcomeBonusApplications = await knex.schema.hasTable('welcome_bonus_applications');
  if (!hasWelcomeBonusApplications) {
    await knex.schema.createTable('welcome_bonus_applications', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE').index();
      table.integer('ride_id').unsigned().notNullable().references('id').inTable('rides').onDelete('CASCADE').index();
      table.decimal('amount', 12, 2).notNullable();
      table.timestamp('applied_at').notNullable().defaultTo(knex.fn.now());
      table.timestamps(true, true);
      table.unique(['user_id', 'ride_id']);
    });
  }
};

exports.down = async function down(knex) {
  const drop = (name) => knex.schema.hasTable(name).then((exists) => exists && knex.schema.dropTable(name));
  await drop('welcome_bonus_applications');
  await drop('welcome_bonuses');

  const hasBonusApplied = await knex.schema.hasColumn('rides', 'welcome_bonus_applied');
  if (hasBonusApplied) {
    await knex.schema.alterTable('rides', (table) => {
      table.dropColumn('welcome_bonus_applied');
      table.dropColumn('fare_after_bonus');
    });
  }
};
