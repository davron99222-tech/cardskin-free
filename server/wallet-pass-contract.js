'use strict';

const MAX_TITLE_LENGTH = 40;
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

function normalizeWalletPassInput(input = {}) {
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  const designId = typeof input.designId === 'string' ? input.designId.trim() : '';
  const backgroundColor = typeof input.backgroundColor === 'string' ? input.backgroundColor : '#111419';
  if (!title || title.length > MAX_TITLE_LENGTH) throw new Error('title must be 1–40 characters');
  if (!designId || !/^[a-z0-9-]+$/.test(designId)) throw new Error('designId is invalid');
  if (!HEX_COLOR.test(backgroundColor)) throw new Error('backgroundColor must be a hex color');
  return { title, designId, backgroundColor };
}

function buildGenericPassJson(input, config) {
  const normalized = normalizeWalletPassInput(input);
  if (!config || !config.passTypeIdentifier || !config.teamIdentifier || !config.organizationName) {
    throw new Error('Apple Wallet pass signing configuration is incomplete');
  }
  return {
    formatVersion: 1,
    passTypeIdentifier: config.passTypeIdentifier,
    serialNumber: `card-studio-${normalized.designId}`,
    teamIdentifier: config.teamIdentifier,
    organizationName: config.organizationName,
    description: 'CARD STUDIO visual card',
    logoText: 'CARD STUDIO',
    backgroundColor: normalized.backgroundColor,
    foregroundColor: '#f2f0ec',
    labelColor: '#d9f36a',
    generic: {
      primaryFields: [{ key: 'design', label: 'DESIGN', value: normalized.title }],
      secondaryFields: [{ key: 'mode', label: 'MODE', value: 'VISUAL CARD' }],
      auxiliaryFields: [{ key: 'artwork', label: 'ARTWORK', value: normalized.designId }],
    },
  };
}

module.exports = { MAX_TITLE_LENGTH, normalizeWalletPassInput, buildGenericPassJson };
