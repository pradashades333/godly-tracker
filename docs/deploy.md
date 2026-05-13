# Deploy Notes

## Recommended small launch

- a small VPS or simple Node host is enough
- keep persistent storage for `data/history.json`
- store `.env` values on the host, not in Git

## Before launch

- set production eBay credentials
- confirm `MM2_IMAGE_DIR` points to a real image folder on the server
- make sure `data/history.json` is writable
- run behind HTTPS with a reverse proxy or managed platform

## Operational caveats

- this app refreshes market data on an interval
- Supreme and eBay sources can fail independently
- local JSON storage is fine for a small launch, but a database is better once traffic grows
