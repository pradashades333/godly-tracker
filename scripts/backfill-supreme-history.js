const fs = require("fs");
const path = require("path");

const HISTORY_FILE = path.join(__dirname, "..", "data", "history.json");

const currentSupremeById = {
  "alien-set": {
    itemName: "Alien Set",
    valueText: "3,750",
    value: 3750,
    range: "[N/A]",
    stability: "Stable",
    demand: 6,
    rarity: 3,
    lastChange: "(-75)",
    page: "sets",
    pageUrl: "https://supremevalues.com/mm2/sets",
    lastUpdated: "May 3rd, 2026"
  },
  "sun-set": {
    itemName: "Sun Set",
    valueText: "1,225",
    value: 1225,
    range: "[1,225 - 1,300]",
    stability: "Doing Well",
    demand: 6,
    rarity: 3,
    lastChange: "(+50)",
    page: "sets",
    pageUrl: "https://supremevalues.com/mm2/sets",
    lastUpdated: "May 3rd, 2026"
  },
  "sweet-set": {
    itemName: "Sweet Set",
    valueText: "415",
    value: 415,
    range: "[N/A]",
    stability: "Stable",
    demand: 3,
    rarity: 3,
    lastChange: "(-10)",
    page: "sets",
    pageUrl: "https://supremevalues.com/mm2/sets",
    lastUpdated: "May 3rd, 2026"
  },
  "icebreaker-set": {
    itemName: "Ice Set",
    valueText: "127",
    value: 127,
    range: "[N/A]",
    stability: "Stable",
    demand: 2,
    rarity: 2,
    lastChange: "(-5)",
    page: "sets",
    pageUrl: "https://supremevalues.com/mm2/sets",
    lastUpdated: "May 3rd, 2026"
  },
  "chroma-darkbringer": {
    itemName: "Chroma Darkbringer",
    valueText: "90",
    value: 90,
    range: "[N/A]",
    stability: "Stable",
    demand: 2,
    rarity: 2,
    lastChange: "(-5)",
    page: "chromas",
    pageUrl: "https://supremevalues.com/mm2/chromas",
    lastUpdated: "May 3rd, 2026"
  }
};

const backfillPointsById = {
  "alien-set": [
    { timestamp: "2026-03-06T12:00:00.000Z", supremeValue: 1750 },
    { timestamp: "2026-04-13T12:00:00.000Z", supremeValue: 2725 },
    { timestamp: "2026-04-18T12:00:00.000Z", supremeValue: 3050 }
  ],
  "sun-set": [
    { timestamp: "2026-03-06T12:00:00.000Z", supremeValue: 850 }
  ],
  raygun: [
    { timestamp: "2026-03-11T12:00:00.000Z", supremeValue: 700 },
    { timestamp: "2026-04-13T12:00:00.000Z", supremeValue: 1075 },
    { timestamp: "2026-04-18T12:00:00.000Z", supremeValue: 1200 }
  ],
  "sweet-set": [
    { timestamp: "2026-03-06T12:00:00.000Z", supremeValue: 450 },
    { timestamp: "2026-04-13T12:00:00.000Z", supremeValue: 435 },
    { timestamp: "2026-04-18T12:00:00.000Z", supremeValue: 415 }
  ],
  "hallow-set": [
    { timestamp: "2026-03-06T12:00:00.000Z", supremeValue: 67 }
  ],
  "rainbow-set": [
    { timestamp: "2026-03-06T12:00:00.000Z", supremeValue: 600 }
  ],
  bat: [
    { timestamp: "2026-03-11T12:00:00.000Z", supremeValue: 205 },
    { timestamp: "2026-04-13T12:00:00.000Z", supremeValue: 160 },
    { timestamp: "2026-04-18T12:00:00.000Z", supremeValue: 150 }
  ],
  sunrise: [
    { timestamp: "2026-03-11T12:00:00.000Z", supremeValue: 625 }
  ],
  "icebreaker-set": [
    { timestamp: "2026-03-06T12:00:00.000Z", supremeValue: 160 }
  ],
  "chroma-darkbringer": [
    { timestamp: "2026-04-13T12:00:00.000Z", supremeValue: 90 }
  ],
  "spectre-set": [
    { timestamp: "2026-03-06T12:00:00.000Z", supremeValue: 100 }
  ],
  treat: [
    { timestamp: "2026-03-11T12:00:00.000Z", supremeValue: 235 },
    { timestamp: "2026-04-13T12:00:00.000Z", supremeValue: 220 },
    { timestamp: "2026-04-18T12:00:00.000Z", supremeValue: 210 }
  ],
  "plasma-set": [
    { timestamp: "2026-03-06T12:00:00.000Z", supremeValue: 50 }
  ]
};

const data = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8"));

for (const [id, currentSupreme] of Object.entries(currentSupremeById)) {
  const item = data[id];
  if (!item) {
    continue;
  }

  item.current = item.current || {};
  item.current.supreme = currentSupreme;
  item.lastError = item.lastError || {};
  item.lastError.supreme = null;

  for (const point of item.history || []) {
    if (point.timestamp.startsWith("2026-05-04")) {
      point.supremeValue = currentSupreme.value;
    }
  }
}

for (const [id, points] of Object.entries(backfillPointsById)) {
  const item = data[id];
  if (!item) {
    continue;
  }

  const history = Array.isArray(item.history) ? item.history.slice() : [];
  const byTimestamp = new Map(history.map((point) => [point.timestamp, point]));

  for (const point of points) {
    const existing = byTimestamp.get(point.timestamp);
    if (existing) {
      existing.supremeValue = point.supremeValue;
      continue;
    }

    history.push({
      timestamp: point.timestamp,
      ebayPriceEUR: null,
      supremeValue: point.supremeValue
    });
  }

  history.sort((left, right) => left.timestamp.localeCompare(right.timestamp));
  item.history = history;
}

fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2) + "\n");
