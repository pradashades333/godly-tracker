const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

loadEnvFile();

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const HISTORY_FILE = path.join(DATA_DIR, "history.json");
const PUBLIC_DIR = path.join(__dirname, "public");
const IMAGE_DIR = process.env.MM2_IMAGE_DIR || "C:\\Files\\woblox\\random images";
const REFRESH_INTERVAL_MS = 30 * 60 * 1000;
const EBAY_CLIENT_ID = process.env.EBAY_CLIENT_ID || "";
const EBAY_CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET || "";
const EBAY_MARKETPLACE_ID = process.env.EBAY_MARKETPLACE_ID || "EBAY_DE";
const EBAY_ENV = (process.env.EBAY_ENV || "production").toLowerCase() === "sandbox"
  ? "sandbox"
  : "production";
const EBAY_API_ROOT = EBAY_ENV === "sandbox" ? "https://api.sandbox.ebay.com" : "https://api.ebay.com";
const EBAY_API_SCOPE = EBAY_ENV === "sandbox"
  ? "https://api.sandbox.ebay.com/oauth/api_scope"
  : "https://api.ebay.com/oauth/api_scope";
const FANDOM_GODLY_PAGE = "https://murder-mystery-2.fandom.com/wiki/Godly_Weapons";
const FANDOM_GODLY_IMAGE_NAMES = {
  "amerilaser": "Png (2)",
  "battleaxe ii": "BattleAxe2.2",
  "blue seer": "1aad7564-2836-43c5-befb-686aedf7bf9b",
  "candleflame": "Candleflame1",
  "elderwood blade": "ElderwoodBlade",
  "eternal iv": "Eternal IIII",
  "eternalcane": "Eternal Cane",
  "gingerblade": "Gingerblade improved",
  "gingermint": "Gingermint",
  "green luger": "Luger Green",
  "hallow s blade": "Hallow's Blade2",
  "hallow s edge": "HallowEdgeUpdated",
  "hallowgun": "5877089721",
  "ice dragon": "IceDragonUpdated",
  "icebeam": "IceBeam",
  "iceflake": "IceFlake",
  "makeshift": "Makeshift",
  "nebula": "NebulaUpdated2",
  "ocean": "Ocean gun",
  "old glory": "OldGloryUpdatedV2",
  "orange seer": "OrangeseerNEW",
  "purple seer": "Purpleseer",
  "rainbow gun": "RainbowGun",
  "swirly blade": "SwirlyBlade",
  "swirly gun": "SwirlGun",
  "vampire s edge": "Vampiresedge",
  "waves": "Waves knife",
  "winter s edge": "WinterEdge",
  "yellow seer": "Yellowseer"
};

const SUPREME_PAGES = {
  godlies: "https://supremevalues.com/mm2/godlies",
  sets: "https://supremevalues.com/mm2/sets",
  ancients: "https://supremevalues.com/mm2/ancients",
  chromas: "https://supremevalues.com/mm2/chromas"
};

const AUTO_INCLUDE_PAGES = new Set(["godlies"]);

const BASE_ITEMS = [
  {
    id: "alien-set",
    name: "Alien Set",
    ebayQuery: "Murder Mystery 2 Alien Set",
    supreme: { page: "sets", itemName: "Alien Set" },
    imageChoices: [],
    aliases: ["Alien Set"]
  },
  {
    id: "sun-set",
    name: "Sun Set/Sunrise Set",
    ebayQuery: "Murder Mystery 2 Sun Set Sunrise Set",
    ebayQueries: [
      "Murder Mystery 2 Sunrise Set",
      "Murder Mystery 2 Sun Set Sunrise Set"
    ],
    supreme: { page: "sets", itemName: "Sun Set" },
    imageChoices: ["Sun_Set_2.webp"],
    aliases: ["Sun Set", "Sunrise Set"]
  },
  {
    id: "raygun",
    name: "Raygun",
    ebayQuery: "Murder Mystery 2 Raygun",
    supreme: { page: "godlies", itemName: "Raygun" },
    imageChoices: ["Raygun.webp"],
    aliases: ["Raygun"]
  },
  {
    id: "sweet-set",
    name: "Sweet Treat Set",
    ebayQuery: "Murder Mystery 2 Sweet Treat Set",
    supreme: { page: "sets", itemName: "Sweet Set" },
    imageChoices: ["sweet treat set.png", "Sweet_Knife.webp", "Treat_Gun.webp"],
    aliases: ["Sweet Set", "Sweet Treat Set"]
  },
  {
    id: "hallow-set",
    name: "Hallow Set",
    ebayQuery: "Murder Mystery 2 Hallow Set",
    supreme: { page: "sets", itemName: "Hallow Set" },
    imageChoices: ["HallowSet.webp", "HallowEdgeUpdated.png"],
    aliases: ["Hallow Set"]
  },
  {
    id: "rainbow-set",
    name: "Rainbow Set",
    ebayQuery: "Murder Mystery 2 Rainbow Set",
    supreme: { page: "sets", itemName: "Rainbow Set" },
    imageChoices: ["Rainbow_Set.webp", "RainbowKnife.webp", "RainbowGun.webp", "rainbow set.png"],
    aliases: ["Rainbow Set"]
  },
  {
    id: "icepiercer",
    name: "Icepiercer",
    ebayQuery: "Murder Mystery 2 Icepiercer",
    supreme: { page: "ancients", itemName: "Icepiercer" },
    imageChoices: ["roblox-harvester-icepiercer-bundle.png"],
    aliases: ["Icepiercer"]
  },
  {
    id: "harvester",
    name: "Harvester",
    ebayQuery: "Murder Mystery 2 Harvester",
    supreme: { page: "ancients", itemName: "Harvester" },
    imageChoices: ["roblox-harvester-icepiercer-bundle.png"],
    aliases: ["Harvester"]
  },
  {
    id: "bat",
    name: "Bat",
    ebayQuery: "Murder Mystery 2 Bat",
    supreme: { page: "godlies", itemName: "Bat" },
    imageChoices: ["ZombieBat.webp", "ZombieBat.png"],
    aliases: ["Bat"]
  },
  {
    id: "sunrise",
    name: "Sunrise",
    ebayQuery: "Murder Mystery 2 Sunrise",
    supreme: { page: "godlies", itemName: "Sunrise" },
    imageChoices: [],
    aliases: ["Sunrise"]
  },
  {
    id: "sunset-knife",
    name: "Sunset Knife",
    ebayQuery: "Murder Mystery 2 Sunset Knife",
    supreme: { page: "godlies", itemName: "Sunset" },
    imageChoices: ["SunsetKnife.webp"],
    aliases: ["Sunset", "Sunset Knife"]
  },
  {
    id: "icebreaker",
    name: "Icebreaker",
    ebayQuery: "Murder Mystery 2 Icebreaker",
    supreme: { page: "ancients", itemName: "Icebreaker" },
    imageChoices: ["07d1bb42d8d5dda1bc14a65fa59bf06eIce Set.png", "roblox-harvester-icepiercer-bundle.png"],
    aliases: ["Icebreaker"]
  },
  {
    id: "icebreaker-set",
    name: "Icebreaker Set",
    ebayQuery: "Murder Mystery 2 Icebreaker Set",
    supreme: { page: "sets", itemName: "Ice Set" },
    imageChoices: ["07d1bb42d8d5dda1bc14a65fa59bf06eIce Set.png"],
    aliases: ["Ice Set", "Icebreaker Set"]
  },
  {
    id: "chroma-darkbringer",
    name: "Chroma Darkbringer",
    ebayQuery: "Murder Mystery 2 Chroma Darkbringer",
    supreme: { page: "chromas", itemName: "Chroma Darkbringer" },
    imageChoices: ["DarkbringerUpdated.webp", "DarkbringerUpdated (1).webp", "CBringerSet.webp"],
    aliases: ["Chroma Darkbringer"]
  },
  {
    id: "spectre-set",
    name: "Spectre Set",
    ebayQuery: "Murder Mystery 2 Spectre Set",
    supreme: { page: "sets", itemName: "Spectre Set" },
    imageChoices: ["Spectre_Set.webp", "Spectre.webp"],
    aliases: ["Spectre Set"]
  },
  {
    id: "treat",
    name: "Treat",
    ebayQuery: "Murder Mystery 2 Treat",
    supreme: { page: "godlies", itemName: "Treat" },
    imageChoices: ["Treat_Gun.webp"],
    aliases: ["Treat"]
  },
  {
    id: "plasma-set",
    name: "Plasma Set",
    ebayQuery: "Murder Mystery 2 Plasma Set",
    supreme: { page: "sets", itemName: "Plasma Set" },
    imageChoices: ["PlasmaSet.webp", "Plasmablade_improved.webp", "Plasmabeam_improved.webp"],
    aliases: ["Plasma Set"]
  }
];

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

const BASE_ITEM_MAP = new Map(BASE_ITEMS.map((item) => [item.id, item]));

let exchangeRates = {
  timestamp: 0,
  rates: { EUR: 1 }
};

let ebayTokenCache = {
  token: "",
  expiresAt: 0
};

let refreshPromise = null;
let fandomGodlyImagesCache = {
  timestamp: 0,
  images: {}
};

ensureStorage();

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);

    if (requestUrl.pathname === "/api/items") {
      await handleItemsRequest(res);
      return;
    }

    if (requestUrl.pathname === "/api/refresh" && req.method === "POST") {
      await handleRefreshRequest(res);
      return;
    }

    if (requestUrl.pathname.startsWith("/images/")) {
      await handleImageRequest(requestUrl.pathname, res);
      return;
    }

    await serveStaticFile(requestUrl.pathname, res);
  } catch (error) {
    respondJson(res, 500, {
      error: "Server error",
      detail: error instanceof Error ? error.message : String(error)
    });
  }
});

server.listen(PORT, () => {
  console.log(`Godly Tracker running at http://localhost:${PORT}`);
  primeHistory().catch((error) => {
    console.error("Initial refresh failed:", error.message);
  });
  setInterval(() => {
    refreshAllItems().catch((error) => {
      console.error("Scheduled refresh failed:", error.message);
    });
  }, REFRESH_INTERVAL_MS);
});

async function handleItemsRequest(res) {
  const history = readHistory();
  const trackedItems = buildTrackedItems(history, null);
  const items = await Promise.all(
    trackedItems.map((item) => enrichItemState(history[item.id] || emptyItemState(item), item))
  );
  respondJson(res, 200, {
    generatedAt: new Date().toISOString(),
    setup: {
      ebayEnabled: hasEbayCredentials(),
      ebayEnvironment: EBAY_ENV,
      imageDirectory: IMAGE_DIR
    },
    items
  });
}

async function handleRefreshRequest(res) {
  const items = await refreshAllItems();
  respondJson(res, 200, {
    refreshedAt: new Date().toISOString(),
    setup: {
      ebayEnabled: hasEbayCredentials(),
      ebayEnvironment: EBAY_ENV,
      imageDirectory: IMAGE_DIR
    },
    items
  });
}

async function handleImageRequest(requestPath, res) {
  const itemId = requestPath.slice("/images/".length);
  const history = readHistory();
  const item = buildTrackedItems(history, null).find((entry) => entry.id === itemId);
  if (!item) {
    respondText(res, 404, "Image not found");
    return;
  }

  const imagePath = resolveImagePath(item);
  if (!imagePath) {
    respondText(res, 404, "Image not found");
    return;
  }

  fs.readFile(imagePath, (error, data) => {
    if (error) {
      respondText(res, 404, "Image not found");
      return;
    }

    const ext = path.extname(imagePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(data);
  });
}

async function serveStaticFile(requestPath, res) {
  const safePath = requestPath === "/" ? "/index.html" : requestPath;
  const resolvedPath = path.normalize(path.join(PUBLIC_DIR, safePath));

  if (!resolvedPath.startsWith(PUBLIC_DIR)) {
    respondText(res, 403, "Forbidden");
    return;
  }

  fs.readFile(resolvedPath, (error, data) => {
    if (error) {
      respondText(res, 404, "Not found");
      return;
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "text/plain; charset=utf-8" });
    res.end(data);
  });
}

async function refreshAllItems() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const history = readHistory();
    const supremeData = await fetchAllSupremeValues();
    const trackedItems = buildTrackedItems(history, supremeData);
    const results = [];

    for (const item of trackedItems) {
      const previous = history[item.id] || emptyItemState(item);
      const supremeEntry = supremeData[item.supreme.page]?.items?.[item.supreme.itemName] || null;
      let ebayEntry = previous.current?.ebay || null;
      const lastError = { supreme: null, ebay: null };

      if (!supremeEntry) {
        lastError.supreme = `Supreme value not found for ${item.supreme.itemName}`;
      }

      if (hasEbayCredentials()) {
        try {
          const ebayListings = await fetchEbayListings(item);
          ebayEntry = selectLowestListing(ebayListings);
        } catch (error) {
          lastError.ebay = error instanceof Error ? error.message : String(error);
        }
      }

      const updated = updateItemHistory(item, previous, supremeEntry, ebayEntry, lastError, supremeData);
      history[item.id] = updated;
      results.push(await enrichItemState(updated, item));
    }

    writeHistory(history);
    return results;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function primeHistory() {
  const history = readHistory();
  const hasAnySnapshots = Object.values(history).some(
    (item) => Array.isArray(item.history) && item.history.length > 0
  );
  const hasAutoGodlies = Object.values(history).some(
    (item) => item.tracking?.supreme?.page === "godlies" && !BASE_ITEM_MAP.has(item.id)
  );

  if (!hasAnySnapshots || !hasAutoGodlies) {
    await refreshAllItems();
  }
}

async function fetchAllSupremeValues() {
  const pageKeys = [...new Set([
    ...BASE_ITEMS.map((item) => item.supreme.page),
    ...AUTO_INCLUDE_PAGES
  ])];
  const result = {};

  await Promise.all(
    pageKeys.map(async (pageKey) => {
      result[pageKey] = await fetchSupremePage(pageKey);
    })
  );

  return result;
}

async function fetchSupremePage(pageKey) {
  const pageUrl = SUPREME_PAGES[pageKey];
  const response = await fetch(pageUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "text/html"
    }
  });

  if (!response.ok) {
    throw new Error(`Supreme Values request failed with ${response.status}`);
  }

  const html = await response.text();
  const rawText = stripHtml(html);
  const text = normalizeWhitespace(rawText);
  const lastUpdated = extractSupremeLastUpdated(text);
  const itemsOnPage = BASE_ITEMS.filter((item) => item.supreme.page === pageKey);
  const items = extractSupremePageItems(rawText);

  for (const item of itemsOnPage) {
    const extracted = extractSupremeItem(rawText, item.supreme.itemName);
    if (extracted) {
      items[item.supreme.itemName] = extracted;
    }
  }

  return { lastUpdated, items };
}

function extractSupremeItem(text, itemName) {
  const escapedName = escapeRegex(itemName);
  const lines = text
    .split(/\r?\n/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);
  const startPattern = new RegExp(`^${escapedName}(?:\\s|$)`, "i");

  for (let index = 0; index < lines.length; index += 1) {
    if (!startPattern.test(lines[index])) {
      continue;
    }

    const blockLines = [];
    for (let offset = index; offset < lines.length && offset < index + 18; offset += 1) {
      const line = lines[offset];
      if (offset > index && isSupremeSectionBoundary(line)) {
        break;
      }

      blockLines.push(line);
      if (/Last Change in Value -/i.test(line)) {
        return parseSupremeItemBlock(blockLines.join(" "), itemName);
      }
    }
  }

  return extractSupremeItemFallback(lines, itemName);
}

function extractSupremeItemFallback(lines, itemName) {
  const escapedName = escapeRegex(itemName);
  const loosePattern = new RegExp(`\\b${escapedName}\\b`, "i");

  for (let index = 0; index < lines.length; index += 1) {
    if (!loosePattern.test(lines[index])) {
      continue;
    }

    const block = lines.slice(index, index + 18).join(" ");
    const parsed = parseSupremeItemBlock(block, itemName);
    if (parsed) {
      return parsed;
    }
  }

  return null;
}

function extractSupremePageItems(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);
  const items = {};
  let blockLines = [];

  const flushBlock = () => {
    if (!blockLines.length) {
      return;
    }

    const parsed = parseUnnamedSupremeItemBlock(blockLines.join(" "));
    if (parsed) {
      items[parsed.itemName] = parsed;
    }
    blockLines = [];
  };

  for (const line of lines) {
    if (isSupremeSectionBoundary(line) || isSupremeNoiseLine(line)) {
      flushBlock();
      continue;
    }

    blockLines.push(line);
    if (/Last Change in Value -/i.test(line)) {
      flushBlock();
    }
  }

  flushBlock();
  return items;
}

function parseSupremeItemBlock(block, itemName) {
  const valueMatch = block.match(/Value -\s*(Priceless|[0-9][0-9,]*)/i);
  const rangeMatch = block.match(/Ranged Value -\s*(\[[^\]]+\]|N\/A)/i);
  const stabilityMatch = block.match(/Stability -\s*([A-Za-z ]+?)(?:Demand -|Rarity -|Origin -|Last Change in Value -)/i);
  const demandMatch = block.match(/Demand -\s*([0-9]+)/i);
  const rarityMatch = block.match(/Rarity -\s*([0-9]+)/i);
  const changeMatch = block.match(/Last Change in Value -\s*([^(]*\([^)]+\)|[^\n\r]+)/i);

  if (!valueMatch) {
    return null;
  }

  return {
    itemName,
    valueText: valueMatch ? valueMatch[1].trim() : "N/A",
    value: parseSupremeNumericValue(valueMatch ? valueMatch[1] : ""),
    range: rangeMatch ? rangeMatch[1].trim() : "N/A",
    stability: stabilityMatch ? normalizeWhitespace(stabilityMatch[1]) : "N/A",
    demand: demandMatch ? Number.parseInt(demandMatch[1], 10) : null,
    rarity: rarityMatch ? Number.parseInt(rarityMatch[1], 10) : null,
    lastChange: changeMatch ? normalizeWhitespace(changeMatch[1]) : "N/A"
  };
}

function parseUnnamedSupremeItemBlock(block) {
  const valueIndex = block.search(/\bValue -/i);
  if (valueIndex === -1) {
    return null;
  }

  const rawName = normalizeWhitespace(block.slice(0, valueIndex));
  const itemName = normalizeSupremeItemName(rawName);
  if (!itemName) {
    return null;
  }

  return parseSupremeItemBlock(block, itemName);
}

function extractSupremeLastUpdated(text) {
  const match = text.match(/Values Last Updated -\s*([A-Za-z0-9 ,]+?)\s+\/\//i);
  return match ? match[1].trim() : null;
}

async function fetchEbayListings(item) {
  const trackedItem = normalizeTrackedItem(item);
  const queries = buildEbayQueries(item);
  const token = await getEbayApplicationToken();
  const eurRates = await getExchangeRatesToEUR();
  const listings = [];
  const seenKeys = new Set();

  for (const query of queries) {
    const rawItems = await fetchEbayListingsForQuery(token, query);
    for (const rawItem of rawItems) {
      const listing = normalizeEbayListing(rawItem, query, eurRates, trackedItem);
      if (!listing) {
        continue;
      }

      const dedupeKey = listing.itemId || `${normalizeForSearch(listing.title)}::${listing.priceEUR}`;
      if (seenKeys.has(dedupeKey)) {
        continue;
      }

      seenKeys.add(dedupeKey);
      listings.push(listing);
    }
  }

  if (listings.length === 0) {
    throw new Error("No parsable eBay prices found");
  }

  const relevantListings = listings.filter((listing) => listing.relevanceScore >= 50);
  return relevantListings.length > 0 ? relevantListings : listings;
}

function buildEbayQueries(item) {
  const trackedItem = normalizeTrackedItem(item);
  const aliases = (
    Array.isArray(trackedItem?.ebayQueries) && trackedItem.ebayQueries.length > 0
      ? trackedItem.ebayQueries
      : [trackedItem?.name, trackedItem?.ebayQuery, ...(trackedItem?.aliases || [])]
  )
    .filter(Boolean)
    .filter((value) => isUsefulEbayQueryFragment(value))
    .map((value) => normalizeWhitespace(String(value)))
    .filter(Boolean);
  const queries = [];
  const seen = new Set();

  for (const value of aliases) {
    const candidates = value.toLowerCase().includes("murder mystery 2")
      ? [value]
      : [`Murder Mystery 2 ${value}`];

    for (const candidate of candidates) {
      const normalized = normalizeWhitespace(candidate);
      if (normalized && !seen.has(normalized)) {
        seen.add(normalized);
        queries.push(normalized);
      }
    }
  }

  return queries;
}

function isUsefulEbayQueryFragment(value) {
  const normalized = normalizeForSearch(value);
  if (!normalized) {
    return false;
  }

  if (normalized.includes("murder mystery 2")) {
    return true;
  }

  const distinctiveTokens = normalized
    .split(" ")
    .filter((token) => token && !isGenericEbayToken(token) && token.length >= 4);

  return distinctiveTokens.length > 0 || compactForSearch(value).length >= 8;
}

async function fetchEbayListingsForQuery(token, query) {
  const searchUrl = new URL(`${EBAY_API_ROOT}/buy/browse/v1/item_summary/search`);
  searchUrl.searchParams.set("q", query);
  searchUrl.searchParams.set("limit", "10");
  searchUrl.searchParams.set("sort", "price");
  searchUrl.searchParams.set("filter", "buyingOptions:{FIXED_PRICE}");

  const response = await fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "X-EBAY-C-MARKETPLACE-ID": EBAY_MARKETPLACE_ID
    }
  });

  if (!response.ok) {
    throw new Error(`eBay request failed with ${response.status}`);
  }

  const payload = await response.json();
  return Array.isArray(payload.itemSummaries) ? payload.itemSummaries : [];
}

function normalizeEbayListing(rawItem, query, eurRates, trackedItem) {
  const priceValue = Number.parseFloat(rawItem?.price?.value);
  const currency = rawItem?.price?.currency;
  if (!Number.isFinite(priceValue) || !currency) {
    return null;
  }

  const eurPrice = convertToEUR(priceValue, currency, eurRates);
  if (!Number.isFinite(eurPrice)) {
    return null;
  }

  const shippingPriceEUR = extractLowestShippingPriceEUR(rawItem?.shippingOptions, eurRates);
  const totalPriceEUR = Number.isFinite(shippingPriceEUR)
    ? eurPrice + shippingPriceEUR
    : eurPrice;
  const title = rawItem.title || query;
  const relevanceScore = scoreListingTitleMatch(trackedItem, title);

  return {
    itemId: rawItem.itemId || "",
    legacyItemId: rawItem.legacyItemId || "",
    itemGroupType: rawItem.itemGroupType || "",
    title,
    url: rawItem.itemWebUrl || rawItem.itemAffiliateWebUrl || "",
    sourcePrice: priceValue,
    sourceCurrency: currency,
    itemPriceEUR: roundCurrency(eurPrice),
    shippingPriceEUR: Number.isFinite(shippingPriceEUR) ? roundCurrency(shippingPriceEUR) : null,
    priceEUR: roundCurrency(totalPriceEUR),
    matchedQuery: query,
    relevanceScore
  };
}

function scoreListingTitleMatch(item, title) {
  const normalizedTitle = normalizeForSearch(title);
  const compactTitle = compactForSearch(title);
  const targets = getEbayTitleTargets(item);
  let best = 0;

  for (const target of targets) {
    if (!target.normalized) {
      continue;
    }

    let score = 0;
    if (normalizedTitle.includes(target.normalized)) {
      score += 90;
    }
    if (target.compact && compactTitle.includes(target.compact)) {
      score += 60;
    }

    const matchedTokens = target.tokens.filter((token) => normalizedTitle.includes(token));
    score += matchedTokens.length * 16;

    if (target.tokens.length >= 2 && matchedTokens.length >= 2) {
      score += 24;
    }

    best = Math.max(best, score);
  }

  return best;
}

function getEbayTitleTargets(item) {
  const trackedItem = normalizeTrackedItem(item);
  const rawTargets = [
    trackedItem?.name,
    trackedItem?.supreme?.itemName,
    ...(trackedItem?.aliases || [])
  ].filter(Boolean);

  return rawTargets
    .flatMap((value) => splitSearchVariants(String(value)))
    .map((value) => ({
      normalized: normalizeForSearch(value),
      compact: compactForSearch(value),
      tokens: normalizeForSearch(value)
        .split(" ")
        .filter((token) => token && !isGenericEbayToken(token))
    }))
    .filter((target) => target.normalized);
}

function splitSearchVariants(value) {
  return String(value)
    .split(/[\/|]/)
    .map((part) => normalizeWhitespace(part))
    .filter(Boolean);
}

function compactForSearch(value) {
  return normalizeForSearch(value).replace(/\s+/g, "");
}

function isGenericEbayToken(token) {
  return new Set([
    "mm2",
    "murder",
    "mystery",
    "roblox",
    "set",
    "gun",
    "knife",
    "godly",
    "godlies"
  ]).has(token);
}

function extractLowestShippingPriceEUR(shippingOptions, eurBaseRates) {
  if (!Array.isArray(shippingOptions) || shippingOptions.length === 0) {
    return NaN;
  }

  let lowest = NaN;

  for (const option of shippingOptions) {
    const priceValue = Number.parseFloat(option?.shippingCost?.value);
    const currency = option?.shippingCost?.currency;
    if (!Number.isFinite(priceValue) || !currency) {
      if (option?.shippingCostType === "FREE") {
        return 0;
      }
      continue;
    }

    const eurPrice = convertToEUR(priceValue, currency, eurBaseRates);
    if (!Number.isFinite(eurPrice)) {
      continue;
    }

    if (!Number.isFinite(lowest) || eurPrice < lowest) {
      lowest = eurPrice;
    }
  }

  return lowest;
}

async function getEbayApplicationToken() {
  if (!hasEbayCredentials()) {
    throw new Error("Missing eBay API credentials");
  }

  const now = Date.now();
  if (ebayTokenCache.token && now < ebayTokenCache.expiresAt - 60 * 1000) {
    return ebayTokenCache.token;
  }

  const credentials = Buffer.from(`${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(`${EBAY_API_ROOT}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `grant_type=client_credentials&scope=${encodeURIComponent(EBAY_API_SCOPE)}`
  });

  if (!response.ok) {
    throw new Error(`eBay auth failed with ${response.status}`);
  }

  const payload = await response.json();
  const expiresInMs = Number(payload.expires_in || 7200) * 1000;
  ebayTokenCache = {
    token: payload.access_token || "",
    expiresAt: now + expiresInMs
  };

  if (!ebayTokenCache.token) {
    throw new Error("eBay auth returned no access token");
  }

  return ebayTokenCache.token;
}

async function getExchangeRatesToEUR() {
  const maxAgeMs = 12 * 60 * 60 * 1000;
  if (Date.now() - exchangeRates.timestamp < maxAgeMs) {
    return exchangeRates.rates;
  }

  const response = await fetch("https://api.frankfurter.app/latest?from=EUR");
  if (!response.ok) {
    throw new Error(`FX request failed with ${response.status}`);
  }

  const payload = await response.json();
  exchangeRates = {
    timestamp: Date.now(),
    rates: {
      EUR: 1,
      ...payload.rates
    }
  };

  return exchangeRates.rates;
}

function convertToEUR(amount, currency, eurBaseRates) {
  if (currency === "EUR") {
    return amount;
  }

  const targetRate = eurBaseRates[currency];
  if (!targetRate) {
    return NaN;
  }

  return amount / targetRate;
}

function selectLowestListing(listings) {
  if (!Array.isArray(listings) || listings.length === 0) {
    return null;
  }

  const representativeListings = collapseVariationListings(listings);
  const sorted = [...representativeListings].sort((left, right) => left.priceEUR - right.priceEUR);
  const sample = sorted.slice(0, 4);

  if (sample.length >= 4) {
    const cluster = sample.slice(1, 4);
    const clusterPrices = cluster.map((listing) => listing.priceEUR).sort((left, right) => left - right);
    const clusterMedian = clusterPrices[1];
    const clusterSpread = clusterPrices[2] - clusterPrices[0];
    const outlierFloor = clusterMedian * 0.75;

    if (sorted[0].priceEUR < outlierFloor && clusterSpread <= clusterMedian * 0.2) {
      return cluster[0];
    }
  }

  return sorted[0];
}

function collapseVariationListings(listings) {
  const groups = new Map();

  for (const listing of listings) {
    const groupKey = listing.itemGroupType === "SELLER_DEFINED_VARIATIONS" && listing.legacyItemId
      ? `variation::${listing.legacyItemId}`
      : `listing::${listing.itemId || listing.url || normalizeForSearch(listing.title)}`;

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }

    groups.get(groupKey).push(listing);
  }

  return [...groups.values()].map(selectRepresentativeListing);
}

function selectRepresentativeListing(group) {
  if (!Array.isArray(group) || group.length === 0) {
    return null;
  }

  if (group.length === 1) {
    return group[0];
  }

  const sorted = [...group].sort((left, right) => left.priceEUR - right.priceEUR);
  const targetIndex = Math.floor(sorted.length / 2);
  return sorted[targetIndex];
}

function updateItemHistory(item, previous, supremeEntry, ebayEntry, lastError, supremeData) {
  const timestamp = new Date().toISOString();
  const history = Array.isArray(previous.history) ? previous.history.slice(-179) : [];

  history.push({
    timestamp,
    ebayPriceEUR: ebayEntry ? ebayEntry.priceEUR : null,
    supremeValue: supremeEntry ? supremeEntry.value : null
  });

  return {
    id: item.id,
    name: item.name,
    tracking: serializeTrackedItem(item),
    current: {
      ebay: ebayEntry,
      supreme: supremeEntry
        ? {
            ...supremeEntry,
            page: item.supreme.page,
            pageUrl: SUPREME_PAGES[item.supreme.page],
            lastUpdated: supremeData[item.supreme.page]?.lastUpdated || null
          }
        : null
    },
    lastCheckedAt: timestamp,
    lastError,
    history
  };
}

async function enrichItemState(state, itemOverride) {
  const trackedItem = itemOverride || stateToTrackedItem(state) || BASE_ITEM_MAP.get(state.id) || {
    id: state.id,
    name: state.name
  };
  const imagePath = resolveImagePath(trackedItem);
  const fallbackImageUrl = imagePath ? null : await resolveFallbackImageUrl(trackedItem);

  return {
    ...state,
    tracking: serializeTrackedItem(trackedItem),
    imageFit: trackedItem.imageFit || "contain",
    category: trackedItem.supreme?.page || state.current?.supreme?.page || "unknown",
    imageUrl: imagePath ? `/images/${trackedItem.id}` : fallbackImageUrl
  };
}

function emptyItemState(item) {
  return {
    id: item.id,
    name: item.name,
    tracking: serializeTrackedItem(item),
    current: {
      ebay: null,
      supreme: null
    },
    lastCheckedAt: null,
    lastError: {
      supreme: null,
      ebay: null
    },
    history: []
  };
}

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(HISTORY_FILE)) {
    const initial = Object.fromEntries(BASE_ITEMS.map((item) => [item.id, emptyItemState(item)]));
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(initial, null, 2));
  }
}

function readHistory() {
  try {
    const parsed = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8"));
    const normalized = {};

    for (const [key, existing] of Object.entries(parsed)) {
      const fallbackItem = BASE_ITEM_MAP.get(key) || BASE_ITEMS.find((item) => item.name === existing?.name);
      const trackedItem = fallbackItem || stateToTrackedItem(existing);
      if (!trackedItem) {
        continue;
      }

      normalized[trackedItem.id] = normalizeItemState(existing, trackedItem);
    }

    for (const item of BASE_ITEMS) {
      if (!normalized[item.id]) {
        normalized[item.id] = emptyItemState(item);
      }
    }

    return normalized;
  } catch (_error) {
    return Object.fromEntries(BASE_ITEMS.map((item) => [item.id, emptyItemState(item)]));
  }
}

function writeHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

function resolveImagePath(itemLike) {
  if (!fs.existsSync(IMAGE_DIR)) {
    return null;
  }

  const entry = normalizeTrackedItem(itemLike);
  if (!entry) {
    return null;
  }

  const files = fs.readdirSync(IMAGE_DIR);
  const exactMatch = findExactImageMatch(files, entry);
  if (exactMatch) {
    return path.join(IMAGE_DIR, exactMatch);
  }

  const sortedChoices = [...(entry.imageChoices || [])].sort(
    (left, right) => getImageExtensionPreference(right) - getImageExtensionPreference(left)
  );

  for (const filename of sortedChoices) {
    const candidate = path.join(IMAGE_DIR, filename);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  const targets = getImageSearchTargets(entry);
  let bestMatch = null;
  let bestScore = -Infinity;

  for (const file of files) {
    const normalizedFile = normalizeForSearch(file);
    const score = scoreImageMatch(normalizedFile, targets) + getImageExtensionPreference(file);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = file;
    }
  }

  return bestScore >= 120 && bestMatch ? path.join(IMAGE_DIR, bestMatch) : null;
}

async function resolveFallbackImageUrl(itemLike) {
  const entry = normalizeTrackedItem(itemLike);
  if (!entry || entry.supreme?.page !== "godlies") {
    return null;
  }

  const staticUrl = resolveStaticGodlyImageUrl(entry);
  if (staticUrl) {
    return staticUrl;
  }

  const images = await getFandomGodlyImageMap();
  for (const target of getImageSearchTargets(entry)) {
    if (images[target]) {
      return images[target];
    }
  }

  return null;
}

function resolveStaticGodlyImageUrl(entry) {
  for (const target of getImageSearchTargets(entry)) {
    const explicitImageName = FANDOM_GODLY_IMAGE_NAMES[target];
    if (explicitImageName) {
      return buildFandomRedirectImageUrl(explicitImageName);
    }
  }

  const primaryName = entry.supreme?.itemName || entry.name;
  if (!primaryName) {
    return null;
  }

  return buildFandomRedirectImageUrl(primaryName);
}

async function getFandomGodlyImageMap() {
  const maxAgeMs = 12 * 60 * 60 * 1000;
  if (Date.now() - fandomGodlyImagesCache.timestamp < maxAgeMs) {
    return fandomGodlyImagesCache.images;
  }

  try {
    const response = await fetch(FANDOM_GODLY_PAGE, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html"
      }
    });

    if (!response.ok) {
      throw new Error(`Fandom request failed with ${response.status}`);
    }

    const html = await response.text();
    const images = extractFandomGodlyImages(html);
    fandomGodlyImagesCache = {
      timestamp: Date.now(),
      images
    };
  } catch (_error) {
    fandomGodlyImagesCache = {
      timestamp: Date.now(),
      images: fandomGodlyImagesCache.images || {}
    };
  }

  return fandomGodlyImagesCache.images;
}

function extractFandomGodlyImages(html) {
  const lines = stripHtml(html)
    .split(/\r?\n/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);
  const images = {};

  for (const line of lines) {
    const match = line.match(/^(.+?)\s+\d+\s+(Knife|Gun)\s+.+?\s+Image:\s*(.+)$/i);
    if (!match) {
      continue;
    }

    const itemName = normalizeWhitespace(match[1]);
    const imageName = normalizeWhitespace(match[3])
      .replace(/\s*\([^)]*\)\s*$/g, "")
      .replace(/\s+\d+x\d+$/i, "");
    if (!itemName || !imageName) {
      continue;
    }

    images[normalizeForSearch(itemName)] = buildFandomRedirectImageUrl(imageName);
  }

  return images;
}

function buildFandomRedirectImageUrl(imageName) {
  const normalizedName = imageName
    .replace(/^File:/i, "")
    .trim()
    .replace(/\s+/g, "_");
  return `https://murder-mystery-2.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(normalizedName)}`;
}

function buildTrackedItems(history, supremeData) {
  const tracked = new Map();
  const supremeKeys = new Set();

  for (const item of BASE_ITEMS) {
    const normalized = normalizeTrackedItem(item);
    tracked.set(normalized.id, normalized);
    supremeKeys.add(getTrackedSupremeKey(normalized));
  }

  for (const state of Object.values(history || {})) {
    const item = stateToTrackedItem(state);
    if (item && !tracked.has(item.id) && !supremeKeys.has(getTrackedSupremeKey(item))) {
      tracked.set(item.id, item);
      supremeKeys.add(getTrackedSupremeKey(item));
    }
  }

  if (supremeData) {
    for (const pageKey of AUTO_INCLUDE_PAGES) {
      const pageItems = supremeData[pageKey]?.items || {};
      for (const itemName of Object.keys(pageItems)) {
        const dynamicItem = createAutoTrackedItem(pageKey, itemName);
        if (!tracked.has(dynamicItem.id) && !supremeKeys.has(getTrackedSupremeKey(dynamicItem))) {
          tracked.set(dynamicItem.id, dynamicItem);
          supremeKeys.add(getTrackedSupremeKey(dynamicItem));
        }
      }
    }
  }

  return [...tracked.values()].sort((left, right) => {
    const pageOrder = left.supreme.page.localeCompare(right.supreme.page);
    if (pageOrder !== 0) {
      return pageOrder;
    }

    return left.name.localeCompare(right.name);
  });
}

function createAutoTrackedItem(page, itemName) {
  return normalizeTrackedItem({
    id: `${page}-${slugify(itemName)}`,
    name: itemName,
    ebayQuery: `Murder Mystery 2 ${itemName}`,
    supreme: { page, itemName },
    imageChoices: [],
    aliases: [itemName]
  });
}

function normalizeTrackedItem(item) {
  if (!item || !item.id || !item.name) {
    return null;
  }

  return {
    id: item.id,
    name: item.name,
    ebayQuery: item.ebayQuery || `Murder Mystery 2 ${item.name}`,
    ebayQueries: Array.isArray(item.ebayQueries) ? item.ebayQueries : [],
    supreme: item.supreme || {
      page: item.current?.supreme?.page || "unknown",
      itemName: item.current?.supreme?.itemName || item.name
    },
    imageChoices: Array.isArray(item.imageChoices) ? item.imageChoices : [],
    aliases: Array.isArray(item.aliases) ? item.aliases : [],
    imageFit: item.imageFit || "contain"
  };
}

function serializeTrackedItem(item) {
  const normalized = normalizeTrackedItem(item);
  if (!normalized) {
    return null;
  }

  return {
    id: normalized.id,
    name: normalized.name,
    ebayQuery: normalized.ebayQuery,
    ebayQueries: normalized.ebayQueries,
    supreme: normalized.supreme,
    imageChoices: normalized.imageChoices,
    aliases: normalized.aliases,
    imageFit: normalized.imageFit
  };
}

function stateToTrackedItem(state) {
  if (!state) {
    return null;
  }

  if (state.tracking) {
    return normalizeTrackedItem(state.tracking);
  }

  const baseItem = BASE_ITEM_MAP.get(state.id) || BASE_ITEMS.find((item) => item.name === state.name);
  if (baseItem) {
    return normalizeTrackedItem(baseItem);
  }

  const page = state.current?.supreme?.page;
  const itemName = state.current?.supreme?.itemName || state.name;
  if (!page || !itemName) {
    return null;
  }

  return createAutoTrackedItem(page, itemName);
}

function normalizeItemState(existing, trackedItem) {
  return {
    id: trackedItem.id,
    name: trackedItem.name,
    tracking: serializeTrackedItem(trackedItem),
    current: existing?.current || { ebay: null, supreme: null },
    lastCheckedAt: existing?.lastCheckedAt || null,
    lastError: existing?.lastError || { supreme: null, ebay: null },
    history: Array.isArray(existing?.history) ? existing.history : []
  };
}

function getImageSearchTargets(entry) {
  return [
    entry.name,
    entry.supreme?.itemName,
    ...(entry.aliases || [])
  ]
    .filter(Boolean)
    .map((value) => normalizeForSearch(value))
    .filter(Boolean);
}

function findExactImageMatch(files, entry) {
  const targets = new Set(getImageSearchTargets(entry));
  let bestFile = null;
  let bestScore = -Infinity;

  for (const file of files) {
    const normalizedFile = normalizeForSearch(path.parse(file).name);
    if (!targets.has(normalizedFile)) {
      continue;
    }

    const score = 500 + getImageExtensionPreference(file);
    if (score > bestScore) {
      bestScore = score;
      bestFile = file;
    }
  }

  return bestFile;
}

function scoreImageMatch(normalizedFile, targets) {
  let best = 0;

  for (const target of targets) {
    if (!target) {
      continue;
    }

    let score = 0;
    const tokens = target.split(" ").filter(Boolean);
    const matchedTokens = tokens.filter((token) => normalizedFile.includes(token));

    if (normalizedFile === target) {
      score += 220;
    } else if (normalizedFile.includes(target)) {
      score += 150;
    }

    score += matchedTokens.length * 18;
    if (tokens.length > 1 && matchedTokens.length === tokens.length) {
      score += 40;
    }

    best = Math.max(best, score);
  }

  return best;
}

function getImageExtensionPreference(filename) {
  const extension = path.extname(filename).toLowerCase();
  if (extension === ".png") {
    return 12;
  }
  if (extension === ".webp") {
    return 8;
  }
  if (extension === ".jpg" || extension === ".jpeg") {
    return 4;
  }
  return 0;
}

function getTrackedSupremeKey(item) {
  return `${item.supreme?.page || "unknown"}::${item.supreme?.itemName || item.name}`;
}

function hasEbayCredentials() {
  return Boolean(EBAY_CLIENT_ID && EBAY_CLIENT_SECRET);
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<(?:br|\/p|\/div|\/section|\/article|\/li|\/tr|\/h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugify(value) {
  return normalizeForSearch(value).replace(/\s+/g, "-");
}

function normalizeSupremeItemName(value) {
  const cleaned = normalizeWhitespace(
    value
      .replace(/Image:.*$/i, "")
      .replace(/Contains -.*$/i, "")
      .replace(/Origin -.*$/i, "")
      .replace(/Ranged Value -.*$/i, "")
      .replace(/Stability -.*$/i, "")
  );

  if (!cleaned || isSupremeNoiseLine(cleaned)) {
    return null;
  }

  if (cleaned.length > 60) {
    return null;
  }

  return cleaned;
}

function isSupremeSectionBoundary(line) {
  return /^(?:Tier\s+[0-9]|Special Tier|Small Tier|Chroma Tier|Collectible Tier|Bulk Tier|Dynamic Sets|Tier [0-9] -|Changelog|SETS:|GODLIES:|ANCIENTS:|CHROMAS:|NEW ITEMS:|Site Created and Managed by)\b/i.test(line);
}

function isSupremeNoiseLine(line) {
  return /^(?:Home|Value List|Values Last Updated|Supreme Values Update|Use Code|Discord Server|Image: Click on the item's image to view Extra Features!|Trading Servers|Top 100 Traders|VIP Servers)\b/i.test(line);
}

function parseSupremeNumericValue(valueText) {
  if (!valueText || /priceless/i.test(valueText)) {
    return null;
  }

  const numeric = Number.parseFloat(String(valueText).replace(/,/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}

function normalizeForSearch(value) {
  return String(value)
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function respondJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function respondText(res, statusCode, text) {
  res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}
