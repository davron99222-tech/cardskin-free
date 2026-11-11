'use strict';

const MAX_ARTWORK_BYTES = 12 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

function artworkMimeType(file) {
  const mime = String(file && file.type || '').toLowerCase();
  if (SUPPORTED_IMAGE_TYPES.includes(mime)) return mime;
  const extension = String(file && file.name || '').toLowerCase().split('.').pop();
  return ({ jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic', heif: 'image/heif' })[extension] || mime;
}

function validateArtworkFile(file) {
  if (!file || !SUPPORTED_IMAGE_TYPES.includes(artworkMimeType(file))) return 'Choose a JPG, PNG, WEBP or iPhone HEIC photo';
  if (file.size > MAX_ARTWORK_BYTES) return 'Image must be smaller than 12 MB';
  return null;
}

function artworkName(filename) {
  return String(filename || '').trim().replace(/\.[^.]+$/, '').slice(0, 24) || 'Your artwork';
}

function openArtworkDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('Local artwork storage is unavailable in this browser'));
    const request = indexedDB.open('card-studio', 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('artwork')) request.result.createObjectStore('artwork');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open local artwork storage'));
  });
}

async function saveArtwork(artwork) {
  const db = await openArtworkDatabase();
  try {
    await new Promise((resolve, reject) => {
      const transaction = db.transaction('artwork', 'readwrite');
      transaction.objectStore('artwork').put(artwork, 'active');
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error('Could not save artwork'));
      transaction.onabort = () => reject(transaction.error || new Error('Artwork save was cancelled'));
    });
  } finally { db.close(); }
}

async function loadArtwork() {
  const db = await openArtworkDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction('artwork', 'readonly').objectStore('artwork').get('active');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error('Could not load saved artwork'));
    });
  } finally { db.close(); }
}

if (typeof module !== 'undefined') module.exports = { validateArtworkFile, artworkName, artworkMimeType };
if (typeof window !== 'undefined') window.CardPersistence = { validateArtworkFile, artworkName, artworkMimeType, saveArtwork, loadArtwork };
