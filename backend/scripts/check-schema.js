const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig.development);

async function run() {
  try {
    const hasWallets = await knex.schema.hasTable('wallets');
    const hasCards = await knex.schema.hasTable('cards');
    const hasPoints = await knex.schema.hasTable('milepoints');
    const paymentCols = await knex('information_schema.columns')
      .where({ table_name: 'payments' })
      .orderBy('ordinal_position')
      .select('column_name');
    console.log('wallets:', hasWallets, 'cards:', hasCards, 'milepoints:', hasPoints);
    console.log('payments columns:', paymentCols.map((c) => c.column_name));
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await knex.destroy();
  }
}

run();

