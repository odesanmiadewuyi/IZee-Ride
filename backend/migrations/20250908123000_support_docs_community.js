/**
 * Support messages, user documents, and community chat tables.
 * @param { import('knex').Knex } knex
 */
exports.up = async function up(knex) {
  // Support messages
  await knex.schema.createTable('support_messages', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').index();
    t.string('email');
    t.string('subject');
    t.text('message');
    t.enu('status', ['open', 'closed']).notNullable().defaultTo('open');
    t.timestamps(true, true);
  });

  // User documents (metadata + URL placeholder)
  await knex.schema.createTable('documents', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').index();
    t.string('category').notNullable(); // e.g., riders_card, mot_license, company_logo, driver_photo
    t.string('file_name');
    t.string('file_url'); // store path or cloud URL
    t.enu('status', ['pending', 'approved', 'rejected']).notNullable().defaultTo('pending');
    t.timestamps(true, true);
  });

  // Community chat messages
  await knex.schema.createTable('community_messages', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').index();
    t.text('content').notNullable();
    t.timestamps(true, true);
  });
};

/**
 * @param { import('knex').Knex } knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('community_messages');
  await knex.schema.dropTableIfExists('documents');
  await knex.schema.dropTableIfExists('support_messages');
};

