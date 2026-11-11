'use strict';

function createWalletPreviewState(card = {}) {
  return {
    title: card.title || 'Card Studio',
    subtitle: 'Artwork preview only',
    mode: 'visual-only',
    hasPaymentData: false,
  };
}

if (typeof window !== 'undefined') window.CardWallet = { createWalletPreviewState };
if (typeof module !== 'undefined') module.exports = { createWalletPreviewState };
