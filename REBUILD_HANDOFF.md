# Godly Tracker Rebuild Handoff

This file is a handoff summary for rebuilding the app from scratch in a cleaner way.

## Goal

Rebuild the MM2 tracker cleanly so the codebase is easier to understand and maintain.

Main features wanted:

- scrape Supreme Values item data
- fetch eBay listing data
- keep item history over time
- merge everything into one final market item shape
- support frontend tabs like board, values, trade checker, inventory tracker, and seller dashboard

## Core Item Shape

Use this as the main final item structure:

```json
{
  "id": "alien-set",
  "name": "Alien Set",
  "category": "sets",
  "imageUrl": null,
  "current": {
    "supreme": {
      "value": 3250,
      "range": null,
      "demand": 5,
      "rarity": 3,
      "stability": "Stable",
      "lastChange": -100,
      "lastUpdated": "14 May 2026",
      "origin": "Hallows 2025 (Unboxed)",
      "pageUrl": "https://supremevalues.com/mm2/sets"
    },
    "ebay": {
      "itemId": "v1|123|0",
      "legacyItemId": "123",
      "title": "MM2 Alien Set",
      "priceEUR": 47.99,
      "sourcePrice": 47.99,
      "sourceCurrency": "EUR",
      "shippingPriceEUR": 0,
      "totalPriceEUR": 47.99,
      "matchedQuery": "Murder Mystery 2 Alien Set",
      "url": "https://www.ebay.com/...",
      "seller": "someSeller",
      "itemGroupType": null,
      "listingMarketplaceId": "EBAY_DE"
    }
  },
  "lastCheckedAt": "2026-05-16T12:00:00.000Z",
  "history": [
    {
      "timestamp": "2026-05-15T12:00:00.000Z",
      "supremeValue": 3250,
      "ebayPriceEUR": 47.99
    }
  ]
}
```

Notes:

- keep `category` lowercase internally
- keep `value`, `demand`, `rarity`, and `lastChange` as real numbers
- use `null` for missing values
- `history` is stored per item

## Service Layout

### `supremeService.js`

Purpose:

- fetch Supreme Values category pages
- scrape item data from the HTML
- return clean Supreme item objects

Fields pulled from Supreme:

- `name`
- `value`
- `range`
- `demand`
- `rarity`
- `stability`
- `lastChange`
- `lastUpdated`
- `origin`
- `pageUrl`

Current scraping approach:

- use `fetch`
- use `cheerio`
- loop item blocks from the page
- parse direct selectors where possible
- parse local block text for fields like `Demand`, `Rarity`, and `Last Change in Value`

Current godlies output shape:

```json
{
  "id": "constellation",
  "name": "Constellation",
  "category": "godlies",
  "current": {
    "supreme": {
      "value": 2600,
      "range": null,
      "demand": 5,
      "rarity": 3,
      "stability": "Stable",
      "lastChange": -50,
      "lastUpdated": "May 13th, 2026",
      "origin": "Xmas 2024 (Unboxed)",
      "pageUrl": "https://supremevalues.com/mm2/godlies"
    }
  },
  "lastCheckedAt": "2026-05-16T12:00:00.000Z",
  "history": []
}
```

### `ebayService.js`

Purpose:

- get eBay auth token
- search listings for a given item
- normalize listing data
- pick the most believable low listing

Current environment variables:

```env
EBAY_CLIENT_ID=...
EBAY_CLIENT_SECRET=...
EBAY_ENV=production
EBAY_MARKETPLACE_ID=EBAY_DE
```

Current eBay flow:

1. `getEbayAccessToken()`
2. `searchEbay(query, accessToken)`
3. normalize raw listing data
4. score and filter listings
5. pick best listing

Important:

- use `EBAY_DE` marketplace so EUR pricing is more likely
- still search with English item queries like `Murder Mystery 2 Bat`
- later, add EUR fallback conversion for non-EUR listings

### `matchingService.js`

Purpose:

- normalize names
- compare item names against eBay titles
- reject junk matches
- score listings

Current exported functions:

- `normalizeName(name)`
- `isLikelyMatch(itemName, listingTitle)`
- `scoreListing(itemName, listing)`

Current behavior:

- lowercases names
- strips apostrophes
- rejects broad junk titles
- rejects chroma mismatch
- rejects set mismatch
- returns `-999` for bad listings

### `historyService.js`

Purpose:

- read `history.json`
- write `history.json`
- merge new snapshots into previous items
- attach history to each item
- calculate recent moves

Important rule:

- only `historyService` should read or write `history.json`

Suggested functions:

- `readHistory()`
- `writeHistory(items)`
- `mergeSnapshots(previousItems, freshItems)`
- `attachHistory(items, savedItems)`
- `getRecentMoves(items)`

### `marketService.js`

Purpose:

- call `supremeService`
- call `ebayService`
- optionally call `imageService`
- merge everything into final item objects
- pass merged items through `historyService`
- return final market data to frontend

This is the main coordinator.

### `imageService.js`

Decision for now:

- skip Supreme image scraping for now
- Supreme images have backgrounds and are not wanted right now
- use `imageUrl: null` or add manual/local images later

## Frontend Notes

Existing feature ideas already explored:

- board
- values list
- trade checker
- inventory tracker
- seller dashboard
- recent changes ticker

Keep frontend data simple:

- the backend should return already-clean values
- frontend should not parse raw text labels
- charts should use `history`

## Rebuild Priorities

Recommended order:

1. finish `supremeService`
2. finish `ebayService`
3. finish `matchingService`
4. finish `historyService`
5. finish `marketService`
6. expose one clean API route
7. build frontend against final merged shape
8. add images later

## Things To Watch Out For

### Supreme scraping

- do not do loose global matching on the entire page
- scrape per item block
- parse local block text for fields that do not have good selectors

### eBay pricing

- never trust the absolute cheapest listing blindly
- reject broad junk titles
- handle variation listings carefully
- rank by believable match + total landed price

### History

- do not manually mutate history in random files
- snapshots should be appended through one service

## Example Claude / ChatGPT Prompt

Use something like this in a new AI session:

```text
I am rebuilding an MM2 item tracker from scratch. The architecture should use separate services:

- supremeService.js: scrape Supreme Values item data
- ebayService.js: authenticate with eBay, search listings, normalize and pick best listing
- matchingService.js: normalize names, reject junk listings, score matches
- historyService.js: read/write history.json, merge snapshots, calculate recent moves
- marketService.js: call all services, merge final item objects, save history, return market data

Use this final item shape:

{
  id,
  name,
  category,
  imageUrl,
  current: {
    supreme: {...},
    ebay: {...}
  },
  lastCheckedAt,
  history: [...]
}

Keep category lowercase internally. Keep values numeric where possible. Use null for missing values.
```

## Current Status

What already worked in the rebuild process:

- Supreme godlies scraping returns good structured data
- eBay auth works
- eBay search works
- eBay marketplace header is being used
- matching logic has been separated conceptually

Main remaining work:

- improve eBay EUR fallback / conversion
- better variation listing handling
- build `historyService`
- build `marketService`
- wire everything into routes/controllers
