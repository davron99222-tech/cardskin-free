const test = require('node:test');
const assert = require('node:assert/strict');
const { createWalletPreviewState } = require('./wallet.js');

test('creates a visual-only Wallet preview without payment data', () => {
  assert.deepEqual(createWalletPreviewState({ title: 'Neon Ronin' }), {
    title: 'Neon Ronin',
    subtitle: 'Artwork preview only',
    mode: 'visual-only',
    hasPaymentData: false,
  });
});

test('uses a safe fallback title', () => {
  assert.equal(createWalletPreviewState().title, 'Card Studio');
  assert.equal(createWalletPreviewState().hasPaymentData, false);
});
