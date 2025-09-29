/**
 * Third-party services catalog, vendor activation, service centers,
 * wallet escrow fields, and enriched part orders.
 * @param { import('knex').Knex } knex
 */
exports.up = async function up(knex) {
  // services catalog
  if (!(await knex.schema.hasTable('services_catalog'))) {
    await knex.schema.createTable('services_catalog', (t) => {
      t.increments('id').primary();
      t.string('key').notNullable().unique(); // e.g., 'mechanical', 'auto_parts', 'tyres_rims', 'insurance', 'tracker', 'dashcam'
      t.string('name').notNullable();
      t.timestamps(true, true);
    });
    await knex('services_catalog').insert([
      { key: 'mechanical', name: 'Mechanical Services / Auto Repair' },
      { key: 'auto_parts', name: 'Auto Parts Dealers' },
      { key: 'tyres_rims', name: 'Tyres and Rims' },
      { key: 'insurance', name: 'Vehicle and Health Insurance' },
      { key: 'tracker', name: 'Tracker' },
      { key: 'dashcam', name: 'Dashboard Camera' },
    ]);
  }

  // vendor services (many-to-many)
  if (!(await knex.schema.hasTable('vendor_services'))) {
    await knex.schema.createTable('vendor_services', (t) => {
      t.increments('id').primary();
      t.integer('vendor_id').unsigned().notNullable().references('id').inTable('vendors').onDelete('CASCADE').index();
      t.integer('service_id').unsigned().notNullable().references('id').inTable('services_catalog').onDelete('CASCADE').index();
      t.unique(['vendor_id', 'service_id']);
      t.timestamps(true, true);
    });
  }

  // vendor activation
  const hasActive = await knex.schema.hasColumn('vendors', 'is_active');
  if (!hasActive) {
    await knex.schema.alterTable('vendors', (t) => {
      t.boolean('is_active').notNullable().defaultTo(false);
      t.timestamp('vetted_at');
      t.decimal('delivery_fee_flat', 12, 2); // optional default courier fee
    });
  }

  // service centers
  if (!(await knex.schema.hasTable('service_centers'))) {
    await knex.schema.createTable('service_centers', (t) => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.string('address');
      t.string('state');
      t.string('lga');
      t.string('phone');
      t.timestamps(true, true);
    });
  }

  // wallet escrow support
  const hasLocked = await knex.schema.hasColumn('wallet_transactions', 'locked_until');
  if (!hasLocked) {
    await knex.schema.alterTable('wallet_transactions', (t) => {
      t.timestamp('locked_until');
      t.boolean('released').notNullable().defaultTo(true); // new entries default released unless locked_until is set
    });
  }

  // enrich part_orders with pricing and flow fields
  const cols = await knex('information_schema.columns')
    .select('column_name')
    .where({ table_name: 'part_orders' });
  const names = new Set(cols.map((c) => c.column_name));
  await knex.schema.alterTable('part_orders', (t) => {
    if (!names.has('driver_id')) t.integer('driver_id').unsigned().references('id').inTable('users').onDelete('SET NULL').index();
    if (!names.has('service_center_id')) t.integer('service_center_id').unsigned().references('id').inTable('service_centers').onDelete('SET NULL').index();
    if (!names.has('courier_cost')) t.decimal('courier_cost', 12, 2).notNullable().defaultTo(0);
    if (!names.has('installation_fee')) t.decimal('installation_fee', 12, 2).notNullable().defaultTo(0);
    if (!names.has('admin_fee')) t.decimal('admin_fee', 12, 2).notNullable().defaultTo(0);
    if (!names.has('price_locked')) t.boolean('price_locked').notNullable().defaultTo(true);
    if (!names.has('locked_at')) t.timestamp('locked_at');
    if (!names.has('released_at')) t.timestamp('released_at');
  });
};

/**
 * @param { import('knex').Knex } knex
 */
exports.down = async function down(knex) {
  // rollbacks (best-effort)
  const drop = (name) => knex.schema.hasTable(name).then((e) => e && knex.schema.dropTable(name));
  await knex.schema.alterTable('part_orders', (t) => {
    ['driver_id','service_center_id','courier_cost','installation_fee','admin_fee','price_locked','locked_at','released_at'].forEach((c) => {
      try { t.dropColumn(c); } catch (e) {}
    });
  });
  if (await knex.schema.hasColumn('wallet_transactions', 'locked_until')) {
    await knex.schema.alterTable('wallet_transactions', (t) => {
      t.dropColumn('locked_until');
      t.dropColumn('released');
    });
  }
  await drop('service_centers');
  await drop('vendor_services');
  await drop('services_catalog');
  if (await knex.schema.hasColumn('vendors', 'is_active')) {
    await knex.schema.alterTable('vendors', (t) => {
      t.dropColumn('is_active');
      t.dropColumn('vetted_at');
      t.dropColumn('delivery_fee_flat');
    });
  }
};

