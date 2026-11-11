const test = require('node:test');
const assert = require('node:assert/strict');
const { filterDesigns, toggleFavorite, normalizeSearch } = require('./catalog.js');

const designs = [
  { id: 'anime-01', title: 'Neon Ronin', category: 'Anime', tags: ['neon', 'samurai'] },
  { id: 'lux-01', title: 'Obsidian', category: 'Luxury', tags: ['black', 'minimal'] },
  { id: 'film-01', title: 'Noir Frame', category: 'Cinema', tags: ['film', 'dark'] },
];

test('filters by category without mutating the source list', () => {
  const result = filterDesigns(designs, { category: 'Anime', query: '' });
  assert.deepEqual(result.map((item) => item.id), ['anime-01']);
  assert.equal(designs.length, 3);
});

test('search is case-insensitive and matches title and tags', () => {
  assert.deepEqual(filterDesigns(designs, { category: 'All', query: 'RONIN' }).map(x => x.id), ['anime-01']);
  assert.deepEqual(filterDesigns(designs, { category: 'All', query: 'minimal' }).map(x => x.id), ['lux-01']);
});

test('category and search filters compose', () => {
  assert.deepEqual(filterDesigns(designs, { category: 'Anime', query: 'film' }), []);
});

test('normalizes whitespace in search input', () => {
  assert.equal(normalizeSearch('  neon   ronin  '), 'neon ronin');
});

test('toggleFavorite adds and removes an id immutably', () => {
  const original = ['lux-01'];
  assert.deepEqual(toggleFavorite(original, 'anime-01'), ['lux-01', 'anime-01']);
  assert.deepEqual(toggleFavorite(original, 'lux-01'), []);
  assert.deepEqual(original, ['lux-01']);
});
