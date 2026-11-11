# CARD STUDIO — MVP 0.1

An iPhone-first, installable web prototype for the CARD STUDIO concept.

## Included in this milestone
- Responsive gallery with Anime, Luxury, Cyberpunk, Art, Cinema and Automotive categories.
- Three-step card builder: design selection, name/photo styling, stickers and Gloss/Matte/Holo finish.
- Beta gallery previews with remote Unsplash photography for Japanese, portrait, floral, neon-city, cinema and automotive moods.
- Search across titles and tags.
- Favorites / saved collection (stored locally).
- Custom artwork upload (JPG, PNG, WEBP, HEIC/HEIF from iPhone; max 12 MB).
- Local image preview controls: scale, brightness and vertical position.
- Saved custom artwork persists on the device with IndexedDB.
- Consistent decorative chip element across designs.
- Wallet-style visual preview opened from the editor button or a double tap on the card.
- PWA manifest and service worker for Add to Home Screen / offline shell.
- Unit tests for catalog filtering and favorites.

## Run locally
Requires Node.js 20+ and Python 3.

```bash
npm test
npm run serve
```

The test suite covers catalog behavior, iPhone image type detection and the
IndexedDB record shape used for saved artwork.

## Beta gallery image credits

Gallery preview images are loaded from Unsplash under the Unsplash License.
These remote previews require an internet connection; user-uploaded artwork
remains local.

The current beta is a local-first static PWA: there is no account or server
backend yet. The Wallet mode is a visual preview only; it never requests card
numbers, CVV, bank credentials or payment tokens.

Open `http://localhost:4173` in a browser.

## Install on iPhone for a preview
Host the folder on an HTTPS static host, open the URL in Safari, tap Share → Add to Home Screen. The saved artwork and favorites remain on that same device/browser; they are not synced to an account.

## Important limitation
This is the gallery/editor prototype only. Custom artwork is stored locally in Safari storage (IndexedDB); clearing website data can remove it. The Wallet preview changes only the in-app visual presentation: it does **not** change Apple Wallet, alter a payment card, or initiate a payment. Never enter card numbers, CVV, PINs, passwords, or banking credentials into this prototype.

## AirCard research notes
The public AirCard-iOS README describes an on-device pairing flow for iOS 27.0–27.0.1, and says the underlying mechanism is patched in iOS 27.2 beta 3+. Its code uses internal iOS services and a local tunnel; it is not an Apple-supported Wallet customization API. Compatibility must be tested on the exact device/iOS build before any integration decision.

Reference: https://github.com/Mak5er/AirCard-iOS
