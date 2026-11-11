const test = require('node:test');
const assert = require('node:assert/strict');
const { validateArtworkFile, artworkName } = require('../src/persistence.js');

test('accepts supported artwork formats within the size limit', () => {
  assert.equal(validateArtworkFile({ type: 'image/png', size: 1024 }), null);
  assert.equal(validateArtworkFile({ type: 'image/jpeg', size: 12 * 1024 * 1024 }), null);
});

test('rejects unsupported formats and oversized files', () => {
  assert.match(validateArtworkFile({ type: 'image/gif', size: 100 }), /JPG, PNG or WEBP/);
  assert.match(validateArtworkFile({ type: 'image/png', size: 12 * 1024 * 1024 + 1 }), /12 MB/);
});

test('creates a safe readable artwork name from a filename', () => {
  assert.equal(artworkName('  Neon-Ronin.PNG '), 'Neon-Ronin');
  assert.equal(artworkName('.png'), 'Your artwork');
  assert.equal(artworkName('a'.repeat(30) + '.jpg').length, 24);
});
