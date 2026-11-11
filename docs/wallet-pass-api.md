# CARD STUDIO Wallet-pass contract

This contract is for a future HTTPS backend that creates a signed generic Apple Wallet pass. It is deliberately separate from Apple Pay payment-card provisioning.

## Request

`POST /api/wallet-passes`

```json
{
  "title": "Neon Ronin",
  "designId": "anime-01",
  "backgroundColor": "#20242c"
}
```

The backend validates the title, design ID, and color at the boundary. The request never accepts card numbers, CVV, bank credentials, payment tokens, or arbitrary remote image URLs.

## Response

When Apple signing configuration is present, the endpoint returns:

```text
200 OK
Content-Type: application/vnd.apple.pkpass
```

Without an Apple Pass Type ID, Team ID, and signing certificate, the backend must return a configuration error rather than an unsigned file that Wallet cannot install.

## Required production pieces

- Apple Developer Pass Type ID and certificate.
- HTTPS backend that signs the pass bundle.
- Private key stored outside the repository, preferably in the server secret store.
- Optional database and Wallet web service for pass updates.

The PWA can keep working on GitHub Pages while this backend is developed separately.
