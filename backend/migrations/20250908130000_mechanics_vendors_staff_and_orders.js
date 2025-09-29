/**
 * Mechanics, Vendors, Parts, Orders, and Staff schema aligned with sketches.
 * @param { import('knex').Knex } knex
 */
exports.up = async function up(knex) {
  // mechanics
  if (!(await knex.schema.hasTable('mechanics'))) {
    await knex.schema.createTable('mechanics', (t) => {
      t.increments('id').primary();
      t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').unique().index();
      t.string('name');
      t.string('company_name');
      t.string('email');
      t.string('phone');
      t.string('state');
      t.string('lga');
      t.string('business_address');
      t.date('date_of_birth');
      t.string('valid_id');
      t.string('profile_picture');
      t.timestamps(true, true);
    });
  }

  // vendors
  if (!(await knex.schema.hasTable('vendors'))) {
    await knex.schema.createTable('vendors', (t) => {
      t.increments('id').primary();
      t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').unique().index();
      t.string('name');
      t.string('company_name');
      t.string('email');
      t.string('phone');
      t.string('state');
      t.string('lga');
      t.string('business_address');
      t.date('date_of_birth');
      t.string('valid_id');
      t.string('profile_picture');
      t.timestamps(true, true);
    });
  }

  // parts inventory
  if (!(await knex.schema.hasTable('parts'))) {
    await knex.schema.createTable('parts', (t) => {
      t.increments('id').primary();
      t.integer('vendor_id').unsigned().notNullable().references('id').inTable('vendors').onDelete('CASCADE').index();
      t.string('name').notNullable();
      t.string('brand');
      t.string('vehicle_make');
      t.string('vehicle_model');
      t.string('vehicle_type');
      t.decimal('price', 12, 2).notNullable().defaultTo(0);
      t.integer('stock').notNullable().defaultTo(0);
      t.string('image_url');
      t.text('description');
      t.timestamps(true, true);
    });
  }

  // orders for parts
  if (!(await knex.schema.hasTable('part_orders'))) {
    await knex.schema.createTable('part_orders', (t) => {
      t.increments('id').primary();
      t.integer('vendor_id').unsigned().notNullable().references('id').inTable('vendors').onDelete('CASCADE').index();
      t.integer('mechanic_id').unsigned().references('id').inTable('mechanics').onDelete('SET NULL').index();
      t.enu('status', ['pending', 'accepted', 'declined', 'shipped', 'delivered', 'cancelled']).notNullable().defaultTo('pending');
      t.decimal('total_amount', 12, 2).notNullable().defaultTo(0);
      t.string('delivery_address');
      t.timestamps(true, true);
    });
  }

  if (!(await knex.schema.hasTable('part_order_items'))) {
    await knex.schema.createTable('part_order_items', (t) => {
      t.increments('id').primary();
      t.integer('order_id').unsigned().notNullable().references('id').inTable('part_orders').onDelete('CASCADE').index();
      t.integer('part_id').unsigned().notNullable().references('id').inTable('parts').onDelete('RESTRICT').index();
      t.integer('quantity').notNullable().defaultTo(1);
      t.decimal('unit_price', 12, 2).notNullable().defaultTo(0);
      t.timestamps(true, true);
    });
  }

  // roles and staff
  if (!(await knex.schema.hasTable('roles'))) {
    await knex.schema.createTable('roles', (t) => {
      t.increments('id').primary();
      t.string('name').notNullable().unique(); // e.g., 'admin', 'customer_care', 'ops'
      t.timestamps(true, true);
    });
    await knex('roles').insert([{ name: 'admin' }, { name: 'customer_care' }, { name: 'ops' }]);
  }

  if (!(await knex.schema.hasTable('staff'))) {
    await knex.schema.createTable('staff', (t) => {
      t.increments('id').primary();
      t.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE').unique().index();
      t.integer('role_id').unsigned().references('id').inTable('roles').onDelete('SET NULL').index();
      t.enu('status', ['active', 'suspended', 'pending']).notNullable().defaultTo('active');
      t.string('staff_type'); // e.g., permanent, contract
      t.date('date_of_employment');
      t.text('about');
      t.timestamps(true, true);
    });
  }

  // extend support_messages with assignment fields
  const hasAssigned = await knex.schema.hasColumn('support_messages', 'assigned_staff_id');
  if (!hasAssigned) {
    await knex.schema.alterTable('support_messages', (t) => {
      t.integer('assigned_staff_id').unsigned().references('id').inTable('staff').onDelete('SET NULL').index();
      t.string('category');
      t.text('notes');
      t.timestamp('resolved_at');
    });
  }
};

/**
 * @param { import('knex').Knex } knex
 */
exports.down = async function down(knex) {
  // remove extended columns if exist
  if (await knex.schema.hasTable('support_messages')) {
    const cols = [
      'assigned_staff_id',
      'category',
      'notes',
      'resolved_at',
    ];
    for (const c of cols) {
      // best-effort: ignore errors if column not present
      // eslint-disable-next-line no-await-in-loop
      if (await knex.schema.hasColumn('support_messages', c)) {
        // eslint-disable-next-line no-await-in-loop
        await knex.schema.alterTable('support_messages', (t) => t.dropColumn(c));
      }
    }
  }

  const drop = (name) => knex.schema.hasTable(name).then((exists) => exists && knex.schema.dropTable(name));
  await drop('part_order_items');
  await drop('part_orders');
  await drop('parts');
  await drop('staff');
  await drop('roles');
  await drop('vendors');
  await drop('mechanics');
};

