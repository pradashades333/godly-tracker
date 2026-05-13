# Godly Tracker

Godly Tracker is a Node-based MM2 dashboard that compares Supreme values with live eBay listings and stores local history for charts.

## What it does

- tracks Supreme values for sets, godlies, ancients, and chromas
- queries live eBay listings and normalizes pricing to EUR
- stores local history snapshots in `data/history.json`
- supports pinned items, search, filters, and chart drill-downs

## Local setup

1. Install Node.js 18+.
2. Create a `.env` file based on `.env.example`.
3. Run `npm start`.
4. Open `http://localhost:3000`.

## Environment

```env
EBAY_CLIENT_ID=
EBAY_CLIENT_SECRET=
EBAY_ENV=production
EBAY_MARKETPLACE_ID=EBAY_DE
MM2_IMAGE_DIR=C:\Files\woblox\random images
```

## Notes

- eBay history in this app is snapshot-based, not true sold-price history.
- item images prefer the local image folder and fall back to curated mappings for missing godlies.
