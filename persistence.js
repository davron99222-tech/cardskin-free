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

function clamp(value, minimum, maximum, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(maximum, Math.max(minimum, number)) : fallback;
}

function createArtworkRecord(artwork) {
  if (!artwork || !artwork.blob) throw new Error('Artwork data is missing');
  const source = artwork.blob;
  const type = String(source.type || artwork.mimeType || 'application/octet-stream').toLowerCase();
  // Store a plain Blob snapshot instead of a File object. This keeps the record
  // structured-cloneable across iOS Safari reloads and IndexedDB transactions.
  const blob = typeof Blob === 'undefined' || source.constructor.name === 'Blob'
    ? source
    : new Blob([source], { type });
  return {
    version: 1,
    blob,
    name: artworkName(artwork.name),
    mimeType: type,
    zoom: clamp(artwork.zoom, 80, 160, 100),
    brightness: clamp(artwork.brightness, 60, 140, 100),
    position: clamp(artwork.position, 0, 100, 50),
  };
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
    const record = createArtworkRecord(artwork);
    await new Promise((resolve, reject) => {
      const transaction = db.transaction('artwork', 'readwrite');
      transaction.objectStore('artwork').put(record, 'active');
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

if (typeof module !== 'undefined') module.exports = { validateArtworkFile, artworkName, artworkMimeType, createArtworkRecord };
if (typeof window !== 'undefined') window.CardPersistence = { validateArtworkFile, artworkName, artworkMimeType, saveArtwork, loadArtwork };
