const test = require('node:test');
const assert = require('node:assert/strict');
const { createQuizState, selectQuizDesign, setQuizName, setQuizOption, toggleQuizSticker, setQuizStep } = require('./quiz.js');

test('creates a predictable three-step quiz state', () => {
  assert.deepEqual(createQuizState('lux-01'), { step: 1, selectedId: 'lux-01', name: '', font: 'bold', color: '#ffffff', stickers: [], finish: 'gloss' });
});

test('updates design, name and supported options immutably', () => {
  const original = createQuizState();
  const updated = setQuizOption(setQuizName(selectQuizDesign(original, 'cyber-01'), 'Night Mode'), 'finish', 'holo');
  assert.equal(original.selectedId, 'anime-01');
  assert.deepEqual({ selectedId: updated.selectedId, name: updated.name, finish: updated.finish }, { selectedId: 'cyber-01', name: 'Night Mode', finish: 'holo' });
  assert.equal(setQuizOption(updated, 'finish', 'invalid'), updated);
});

test('limits stickers to three and toggles existing stickers', () => {
  let state = createQuizState();
  for (const sticker of ['✨', '🌸', '🔥', '💎']) state = toggleQuizSticker(state, sticker);
  assert.deepEqual(state.stickers, ['✨', '🌸', '🔥']);
  assert.deepEqual(toggleQuizSticker(state, '🌸').stickers, ['✨', '🔥']);
});

test('keeps quiz step within bounds', () => {
  assert.equal(setQuizStep(createQuizState(), 0).step, 1);
  assert.equal(setQuizStep(createQuizState(), 2).step, 2);
  assert.equal(setQuizStep(createQuizState(), 9).step, 3);
});
