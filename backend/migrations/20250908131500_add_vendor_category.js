/**
 * Add category to vendors for third-party classification (e.g., insurance, mechanics, parts).
 * @param { import('knex').Knex } knex
 */
exports.up = async function up(knex) {
  const has = await knex.schema.hasColumn('vendors', 'category');
  if (!has) {
    await knex.schema.alterTable('vendors', (t) => {
      t.string('category').index();
    });
  }
};

/**
 * @param { import('knex').Knex } knex
 */
exports.down = async function down(knex) {
  const has = await knex.schema.hasColumn('vendors', 'category');
  if (has) {
    await knex.schema.alterTable('vendors', (t) => t.dropColumn('category'));
  }
};

