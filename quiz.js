'use strict';

const QUIZ_FONTS = ['bold', 'classic', 'script', 'mono'];
const QUIZ_COLORS = ['#ffffff', '#111111', '#e9c46a', '#ff8fb8'];
const QUIZ_FINISHES = ['gloss', 'matte', 'holo'];

function createQuizState(selectedId = 'anime-01') {
  return { step: 1, selectedId, name: '', font: 'bold', color: '#ffffff', stickers: [], finish: 'gloss' };
}

function updateQuizState(state, patch) {
  return { ...state, ...patch };
}

function selectQuizDesign(state, selectedId) {
  return updateQuizState(state, { selectedId });
}

function setQuizName(state, name) {
  return updateQuizState(state, { name: String(name || '').slice(0, 24) });
}

function setQuizOption(state, field, value) {
  const allowed = field === 'font' ? QUIZ_FONTS : field === 'color' ? QUIZ_COLORS : field === 'finish' ? QUIZ_FINISHES : [];
  return allowed.includes(value) ? updateQuizState(state, { [field]: value }) : state;
}

function toggleQuizSticker(state, sticker) {
  const stickers = state.stickers.includes(sticker)
    ? state.stickers.filter((item) => item !== sticker)
    : state.stickers.length < 3 ? [...state.stickers, sticker] : state.stickers;
  return updateQuizState(state, { stickers });
}

function setQuizStep(state, step) {
  return updateQuizState(state, { step: Math.min(3, Math.max(1, Number(step) || 1)) });
}

if (typeof module !== 'undefined') module.exports = { QUIZ_FONTS, QUIZ_COLORS, QUIZ_FINISHES, createQuizState, selectQuizDesign, setQuizName, setQuizOption, toggleQuizSticker, setQuizStep };
if (typeof window !== 'undefined') window.CardQuiz = { QUIZ_FONTS, QUIZ_COLORS, QUIZ_FINISHES, createQuizState, selectQuizDesign, setQuizName, setQuizOption, toggleQuizSticker, setQuizStep };
