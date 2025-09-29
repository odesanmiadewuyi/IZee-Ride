/**
 * @param { import('knex').Knex } knex
 */
exports.seed = async function seed(knex) {
  // Seed some demo tickets for the Milepoint UI
  const existing = await knex('tickets');
  if (existing.length > 0) return; // idempotent
  await knex('tickets').insert([
    { name: 'Cocktail / Disco Party', image_url: 'https://picsum.photos/seed/party1/300/200', price_points: 5000, tier: 'within_5000' },
    { name: 'Disco Party', image_url: 'https://picsum.photos/seed/party2/300/200', price_points: 5000, tier: 'within_5000' },
    { name: 'Wine Party', image_url: 'https://picsum.photos/seed/party3/300/200', price_points: 5000, tier: 'within_5000' },
    { name: 'Dinner Party', image_url: 'https://picsum.photos/seed/party4/300/200', price_points: 5000, tier: 'within_5000' },
    { name: 'Adventure', image_url: 'https://picsum.photos/seed/adventure/300/200', price_points: 10000, tier: 'within_10000' },
    { name: 'Paintball', image_url: 'https://picsum.photos/seed/paintball/300/200', price_points: 10000, tier: 'within_10000' },
    { name: 'Polo Game', image_url: 'https://picsum.photos/seed/polo/300/200', price_points: 10000, tier: 'within_10000' },
    { name: 'Movies', image_url: 'https://picsum.photos/seed/movies/300/200', price_points: 10000, tier: 'within_10000' },
  ]);
};

