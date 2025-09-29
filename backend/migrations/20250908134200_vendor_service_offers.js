/**
 * Vendor service offers with last prices per service.
 * @param { import('knex').Knex } knex
 */
exports.up = async function up(knex) {
  if (!(await knex.schema.hasTable('vendor_service_offers'))) {
    await knex.schema.createTable('vendor_service_offers', (t) => {
      t.increments('id').primary();
      t.integer('vendor_id').unsigned().notNullable().references('id').inTable('vendors').onDelete('CASCADE').index();
      t.integer('service_id').unsigned().notNullable().references('id').inTable('services_catalog').onDelete('CASCADE').index();
      t.string('name').notNullable();
      t.decimal('price', 12, 2).notNullable().defaultTo(0);
      t.text('description');
      t.timestamps(true, true);
    });
  }
};

/**
 * @param { import('knex').Knex } knex
 */
exports.down = async function down(knex) {
  const drop = (name) => knex.schema.hasTable(name).then((exists) => exists && knex.schema.dropTable(name));
  await drop('vendor_service_offers');
};

