const test = require('node:test');
const assert = require('node:assert/strict');
const { buildGenericPassJson, normalizeWalletPassInput } = require('./wallet-pass-contract.js');

const config = { passTypeIdentifier: 'pass.com.example.cardstudio', teamIdentifier: 'TEAM123456', organizationName: 'CARD STUDIO' };

test('validates and normalizes a Wallet-pass request', () => {
  assert.deepEqual(normalizeWalletPassInput({ title: 'Neon Ronin', designId: 'anime-01' }), { title: 'Neon Ronin', designId: 'anime-01', backgroundColor: '#111419' });
});

test('builds a generic visual pass without payment fields', () => {
  const pass = buildGenericPassJson({ title: 'Neon Ronin', designId: 'anime-01', backgroundColor: '#20242c' }, config);
  assert.equal(pass.generic.primaryFields[0].value, 'Neon Ronin');
  assert.equal(pass.serialNumber, 'card-studio-anime-01');
  assert.equal('payment' in pass, false);
  assert.equal('primaryAccountIdentifier' in pass, false);
});

test('rejects malformed or incomplete pass requests', () => {
  assert.throws(() => normalizeWalletPassInput({ title: '', designId: 'anime-01' }));
  assert.throws(() => normalizeWalletPassInput({ title: 'Neon Ronin', designId: 'bad id' }));
  assert.throws(() => buildGenericPassJson({ title: 'Neon Ronin', designId: 'anime-01' }, {}));
});
