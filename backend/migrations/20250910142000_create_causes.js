/**
 * Create causes table for saved causes feature.
 * @param { import('knex').Knex } knex
 */
exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('causes');
  if (!exists) {
    await knex.schema.createTable('causes', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description');
      table.decimal('amount_required', 12, 2).notNullable().defaultTo(0);
      table.string('currency').notNullable().defaultTo('NGN');
      table.timestamps(true, true);
    });
  }
};

exports.down = async function down(knex) {
  const exists = await knex.schema.hasTable('causes');
  if (exists) {
    await knex.schema.dropTable('causes');
  }
};
