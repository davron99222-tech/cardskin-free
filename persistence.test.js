const test = require('node:test');
const assert = require('node:assert/strict');
const { validateArtworkFile, artworkName, artworkMimeType, createArtworkRecord } = require('./persistence.js');

test('accepts supported artwork formats within the size limit', () => {
  assert.equal(validateArtworkFile({ type: 'image/png', size: 1024 }), null);
  assert.equal(validateArtworkFile({ type: 'image/jpeg', size: 12 * 1024 * 1024 }), null);
  assert.equal(validateArtworkFile({ type: 'image/heic', size: 1024 }), null);
  assert.equal(validateArtworkFile({ name: 'photo.HEIF', type: '', size: 1024 }), null);
});

test('rejects unsupported formats and oversized files', () => {
  assert.match(validateArtworkFile({ type: 'image/gif', size: 100 }), /JPG, PNG, WEBP or iPhone HEIC/);
  assert.match(validateArtworkFile({ type: 'image/png', size: 12 * 1024 * 1024 + 1 }), /12 MB/);
});

test('detects iPhone image types from MIME type or filename', () => {
  assert.equal(artworkMimeType({ type: 'image/heic', name: 'photo.jpg' }), 'image/heic');
  assert.equal(artworkMimeType({ type: '', name: 'photo.HEIF' }), 'image/heif');
});

test('creates a cloneable Blob record for IndexedDB', () => {
  const source = new File(['image-bytes'], 'Neon-Ronin.HEIC', { type: 'image/heic' });
  const record = createArtworkRecord({ blob: source, name: source.name, zoom: 120, brightness: 90, position: 35 });
  assert.equal(record.blob.constructor.name, 'Blob');
  assert.equal(record.blob.type, 'image/heic');
  assert.equal(record.name, 'Neon-Ronin');
  assert.deepEqual({ zoom: record.zoom, brightness: record.brightness, position: record.position }, { zoom: 120, brightness: 90, position: 35 });
});

test('creates a safe readable artwork name from a filename', () => {
  assert.equal(artworkName('  Neon-Ronin.PNG '), 'Neon-Ronin');
  assert.equal(artworkName('.png'), 'Your artwork');
  assert.equal(artworkName('a'.repeat(30) + '.jpg').length, 24);
});
