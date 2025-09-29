/**
 * Seed demo data for wallets, cards, rewards, support, documents, and community.
 * Safe to run multiple times.
 * @param { import('knex').Knex } knex
 */
exports.seed = async function seed(knex) {
  // Ensure base users exist (seeded by initial_data.js). If not, create simple users
  const users = await knex('users').select('id').orderBy('id');
  if (users.length === 0) {
    await knex('users').insert({ name: 'Demo User', email: 'demo@example.com', password: '$2b$10$example.hash.here' });
  }

  const [{ id: userId }] = await knex('users').select('id').orderBy('id').limit(1);

  // Wallet for first user
  let wallet = await knex('wallets').where({ user_id: userId }).first();
  if (!wallet) {
    [wallet] = await knex('wallets').insert({ user_id: userId, balance: 100000 }).returning('*');
  } else if (Number(wallet.balance) < 100000) {
    await knex('wallets').where({ id: wallet.id }).update({ balance: 100000 });
  }
  const hasTopup = await knex('wallet_transactions').where({ wallet_id: wallet.id, type: 'topup' }).first();
  if (!hasTopup) {
    await knex('wallet_transactions').insert({ wallet_id: wallet.id, type: 'topup', amount: 100000, balance_after: 100000, reference: 'seed:topup' });
  }

  // Card
  const hasCard = await knex('cards').where({ user_id: userId }).first();
  if (!hasCard) {
    await knex('cards').insert({ user_id: userId, brand: 'VISA', last4: '4242', exp_month: 8, exp_year: 2027 });
  }

  // Milepoints
  let points = await knex('milepoints').where({ user_id: userId }).first();
  if (!points) {
    [points] = await knex('milepoints').insert({ user_id: userId, points: 5000 }).returning('*');
  } else if (Number(points.points) < 5000) {
    await knex('milepoints').where({ id: points.id }).update({ points: 5000 });
  }
  const hasEarn = await knex('milepoint_transactions').where({ user_id: userId, type: 'earn' }).first();
  if (!hasEarn) {
    await knex('milepoint_transactions').insert({ user_id: userId, type: 'earn', points: 5000, reference: 'seed:bonus' });
  }

  // Documents
  const docs = [
    { category: 'company_logo', file_name: 'logo.png', file_url: 'https://picsum.photos/seed/logo/300/200' },
    { category: 'driver_photo', file_name: 'driver.jpg', file_url: 'https://picsum.photos/seed/driver/300/300' },
    { category: 'riders_card', file_name: 'riders_card.pdf', file_url: 'https://example.com/docs/riders_card.pdf' },
    { category: 'mot_license', file_name: 'mot_license.pdf', file_url: 'https://example.com/docs/mot_license.pdf' },
  ];
  for (const d of docs) {
    const exists = await knex('documents').where({ user_id: userId, category: d.category }).first();
    if (!exists) await knex('documents').insert({ user_id: userId, ...d });
  }

  // Support messages
  const supportExists = await knex('support_messages').where({ user_id: userId }).first();
  if (!supportExists) {
    await knex('support_messages').insert({ user_id: userId, subject: 'App Feedback', message: 'Great app! Having trouble with document upload though.', email: 'supporter@example.com' });
  }

  // Community messages
  const chatExists = await knex('community_messages').first();
  if (!chatExists) {
    await knex('community_messages').insert([
      { user_id: userId, content: 'Good Evening Guys, need help with a delivery at third mainland Bridge.' },
      { user_id: userId, content: "Vehicle issue, won\'t start. Don\'t want to delay delivery." },
    ]);
  }
};

