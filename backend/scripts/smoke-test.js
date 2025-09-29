/*
  IZee Ride Smoke Test
  - Starts the Express app on port 5001
  - Tests: services list, auth register/login, vendor setup (services + part),
           mechanic setup, create order with wallet top-up, vendor orders list.
  - Prints a simple summary at the end.
*/

require('ts-node/register');
const http = require('http');
const app = require('../src/app').default;
const knex = require('knex');
const knexConfig = require('../knexfile');

const PORT = 5001;

function req(method, path, body, token) {
  const payload = body ? JSON.stringify(body) : null;
  const opts = {
    hostname: 'localhost',
    port: PORT,
    path,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
  return new Promise((resolve, reject) => {
    const r = http.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({ status: res.statusCode, data: json ?? data });
      });
    });
    r.on('error', reject);
    if (payload) r.write(payload);
    r.end();
  });
}

async function main() {
  const server = app.listen(PORT, () => console.log(`[smoke] Server on ${PORT}`));
  const db = knex(knexConfig.development);
  const out = [];
  try {
    // 1) Services list
    const services = await req('GET', '/api/services');
    out.push(['Services list', services.status, Array.isArray(services.data?.data) ? services.data.data.length + ' services' : services.data]);

    // 2) Register + login vendor user
    const emailVendor = `vendor_${Date.now()}@ex.com`;
    await req('POST', '/api/auth/register', { name: 'Vendor V', email: emailVendor, password: 'Pass1234' });
    const loginVendor = await req('POST', '/api/auth/login', { email: emailVendor, password: 'Pass1234' });
    const tokenVendor = loginVendor.data?.token;
    out.push(['Vendor login', loginVendor.status, tokenVendor ? 'token ok' : 'no token']);

    // 3) Create vendor profile + set services
    const vendorProfile = await req('POST', '/api/vendors', { name: 'Vendor Co', company_name: 'Vendor Co', state: 'Lagos', lga: 'Ikeja', phone: '0800000000' }, tokenVendor);
    out.push(['Vendor profile', vendorProfile.status, vendorProfile.data?.success]);
    const svcSet = await req('POST', '/api/services/vendors/me/services', { keys: ['auto_parts'] }, tokenVendor);
    out.push(['Vendor set services', svcSet.status, svcSet.data?.success]);

    // 4) Add a part
    const partRes = await req('POST', '/api/parts', { name: 'Brake Pad', brand: 'Generic', vehicle_make: 'Toyota', vehicle_model: 'Camry', price: 20000, stock: 10 }, tokenVendor);
    out.push(['Vendor add part', partRes.status, partRes.data?.success]);
    const partsList = await req('GET', '/api/parts');
    const partId = partsList.data?.data?.[0]?.id;

    // 5) Register + login mechanic user
    const emailMech = `mech_${Date.now()}@ex.com`;
    await req('POST', '/api/auth/register', { name: 'Mech M', email: emailMech, password: 'Pass1234' });
    const loginMech = await req('POST', '/api/auth/login', { email: emailMech, password: 'Pass1234' });
    const tokenMech = loginMech.data?.token;
    out.push(['Mechanic login', loginMech.status, tokenMech ? 'token ok' : 'no token']);
    await req('POST', '/api/mechanics', { name: 'Mech M', phone: '0801111111', state: 'Lagos', lga: 'Ikeja' }, tokenMech);

    // 6) Top-up mechanic wallet directly (test-only)
    const mechUserId = loginMech.data?.user?.id;
    if (mechUserId) {
      let wallet = await db('wallets').where({ user_id: mechUserId }).first();
      if (!wallet) {
        const [w] = await db('wallets').insert({ user_id: mechUserId, balance: 0, currency: 'NGN' }).returning('*');
        wallet = w;
      }
      const newBal = Number(wallet.balance) + 500000; // NGN 500k
      await db('wallets').where({ id: wallet.id }).update({ balance: newBal });
      await db('wallet_transactions').insert({ wallet_id: wallet.id, type: 'topup', amount: 500000, balance_after: newBal, reference: 'SMOKE-TOPUP' });
    }

    // 7) Create order (mechanic)
    let orderResult = { status: 0, data: {} };
    if (partId) {
      orderResult = await req('POST', '/api/part-orders', {
        items: [{ part_id: partId, quantity: 2 }],
        delivery_address: 'Service Center',
        courier_cost: 2000,
        installation_fee: 5000,
      }, tokenMech);
    }
    out.push(['Create order', orderResult.status, orderResult.data?.success]);

    // 8) Vendor sees orders
    const vendorOrders = await req('GET', '/api/part-orders/vendor', null, tokenVendor);
    out.push(['Vendor orders', vendorOrders.status, Array.isArray(vendorOrders.data?.data) ? vendorOrders.data.data.length + ' orders' : vendorOrders.data]);

    console.log('\nSMOKE TEST SUMMARY');
    out.forEach((r) => console.log(' -', r[0] + ':', r[1], '-', r[2]));
  } catch (e) {
    console.error('[smoke] Error:', e);
  } finally {
    await new Promise((r) => server.close(r));
    await db.destroy();
  }
}

main();

