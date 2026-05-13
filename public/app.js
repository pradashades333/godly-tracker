const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR"
});

const plainNumber = new Intl.NumberFormat("en-US");
const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1
});

const state = {
  items: [],
  generatedAt: null,
  setup: null,
  selectedItemId: null,
  favorites: loadFavorites(),
  hasAutoRefreshedForEbay: false,
  filters: {
    search: "",
    category: "all",
    sort: "name"
  }
};

const itemsGrid = document.getElementById("itemsGrid");
const favoritesSection = document.getElementById("favoritesSection");
const favoritesGrid = document.getElementById("favoritesGrid");
const favoritesCount = document.getElementById("favoritesCount");
const cardTemplate = document.getElementById("cardTemplate");
const refreshButton = document.getElementById("refreshButton");
const statusLine = document.getElementById("statusLine");
const setupLine = document.getElementById("setupLine");
const trackedCount = document.getElementById("trackedCount");
const bestSupreme = document.getElementById("bestSupreme");
const cheapestEbay = document.getElementById("cheapestEbay");
const lastRefresh = document.getElementById("lastRefresh");
const resultsCount = document.getElementById("resultsCount");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");
const chartModal = document.getElementById("chartModal");
const chartModalBackdrop = document.getElementById("chartModalBackdrop");
const chartModalClose = document.getElementById("chartModalClose");
const chartModalTitle = document.getElementById("chartModalTitle");
const chartModalCategory = document.getElementById("chartModalCategory");
const chartModalMeta = document.getElementById("chartModalMeta");
const chartModalSupreme = document.getElementById("chartModalSupreme");
const chartModalEbay = document.getElementById("chartModalEbay");
const chartModalSamples = document.getElementById("chartModalSamples");
const chartModalHistoryNote = document.getElementById("chartModalHistoryNote");
const chartModalCanvas = document.getElementById("chartModalCanvas");
const chartModalTooltip = document.getElementById("chartModalTooltip");
const chartModalEmpty = document.getElementById("chartModalEmpty");
const chartModalPanel = chartModal.querySelector(".chart-modal-panel");

refreshButton.addEventListener("click", async () => {
  await refreshData(true);
});

searchInput.addEventListener("input", (event) => {
  state.filters.search = event.target.value.trim().toLowerCase();
  renderItems();
});

categorySelect.addEventListener("change", (event) => {
  state.filters.category = event.target.value;
  renderItems();
});

sortSelect.addEventListener("change", (event) => {
  state.filters.sort = event.target.value;
  renderItems();
});

chartModalBackdrop.addEventListener("click", closeChartModal);
chartModalClose.addEventListener("click", closeChartModal);
chartModal.addEventListener("click", (event) => {
  if (!chartModalPanel.contains(event.target)) {
    closeChartModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !chartModal.classList.contains("hidden")) {
    closeChartModal();
  }
});

loadInitialData();

async function loadInitialData() {
  try {
    const response = await fetch("/api/items");
    if (!response.ok) {
      throw new Error(`Load failed with ${response.status}`);
    }

    const data = await response.json();
    receiveDashboardData(data.items, data.generatedAt, data.setup);
    setStatus("Showing latest tracked data.");
  } catch (error) {
    setStatus(error.message);
  }
}

async function refreshData(manual) {
  refreshButton.disabled = true;
  setStatus(manual ? "Refreshing Supreme Values and eBay data..." : "Refreshing once to load eBay prices...");

  try {
    const response = await fetch("/api/refresh", { method: "POST" });
    if (!response.ok) {
      throw new Error(`Refresh failed with ${response.status}`);
    }

    const data = await response.json();
    receiveDashboardData(data.items, data.refreshedAt, data.setup);
    setStatus("Market data refreshed.");
  } catch (error) {
    setStatus(error.message);
  } finally {
    refreshButton.disabled = false;
  }
}

function receiveDashboardData(items, generatedAt, setup) {
  state.items = (items || []).map(enrichClientItem);
  state.generatedAt = generatedAt;
  state.setup = setup || null;

  renderSummary();
  renderFilters();
  renderItems();
  maybeAutoRefreshForEbay();
}

function enrichClientItem(item) {
  return {
    ...item,
    isFavorite: state.favorites.has(item.id),
    category: item.category || item.tracking?.supreme?.page || item.current?.supreme?.page || "unknown",
    searchText: [
      item.name,
      item.current?.supreme?.itemName,
      item.category,
      item.tracking?.supreme?.itemName
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
  };
}

function renderSummary() {
  trackedCount.textContent = String(state.items.length);
  lastRefresh.textContent = formatDate(state.generatedAt);
  setupLine.textContent = state.setup?.ebayEnabled
    ? `eBay is enabled in ${state.setup.ebayEnvironment || "production"} mode. Local images are loaded from ${state.setup.imageDirectory}.`
    : "eBay is not enabled yet. Add EBAY_CLIENT_ID and EBAY_CLIENT_SECRET to .env if you want live listing prices.";

  const supremeItems = state.items.filter((item) => item.current?.supreme?.value != null);
  if (supremeItems.length > 0) {
    const topSupreme = supremeItems.reduce((highest, item) =>
      item.current.supreme.value > highest.current.supreme.value ? item : highest
    );
    bestSupreme.textContent = `${topSupreme.name} / ${plainNumber.format(topSupreme.current.supreme.value)}`;
  } else {
    bestSupreme.textContent = "No data";
  }

  const ebayItems = state.items.filter((item) => item.current?.ebay?.priceEUR != null);
  if (ebayItems.length > 0) {
    const cheapest = ebayItems.reduce((lowest, item) =>
      item.current.ebay.priceEUR < lowest.current.ebay.priceEUR ? item : lowest
    );
    cheapestEbay.textContent = `${cheapest.name} / ${euro.format(cheapest.current.ebay.priceEUR)}`;
  } else {
    cheapestEbay.textContent = state.setup?.ebayEnabled ? "No listings yet" : "eBay off";
  }
}

function renderFilters() {
  const categories = [...new Set(state.items.map((item) => item.category).filter(Boolean))].sort();
  const previous = state.filters.category;

  categorySelect.innerHTML = '<option value="all">All categories</option>';
  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = titleCase(category);
    categorySelect.appendChild(option);
  }

  categorySelect.value = categories.includes(previous) ? previous : "all";
  state.filters.category = categorySelect.value;
}

function renderItems() {
  const filtered = getFilteredItems();
  const favorites = filtered.filter((item) => item.isFavorite);

  itemsGrid.innerHTML = "";
  favoritesGrid.innerHTML = "";
  resultsCount.textContent = `${filtered.length} item${filtered.length === 1 ? "" : "s"}`;
  favoritesCount.textContent = String(favorites.length);
  favoritesSection.classList.toggle("hidden", favorites.length === 0);

  for (const item of favorites) {
    favoritesGrid.appendChild(buildItemCard(item));
  }

  for (const item of filtered) {
    itemsGrid.appendChild(buildItemCard(item));
  }
}

function buildItemCard(item) {
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  const favoriteButton = card.querySelector(".favorite-button");
  card.querySelector(".item-name").textContent = item.name;
  card.querySelector(".item-category").textContent = titleCase(item.category);
  card.querySelector(".item-meta").textContent = item.lastCheckedAt
    ? `Checked ${formatDate(item.lastCheckedAt)}`
    : "Not checked yet";
  card.querySelector(".item-kicker").textContent = buildItemKicker(item);
  favoriteButton.textContent = item.isFavorite ? "Pinned" : "Pin";
  favoriteButton.classList.toggle("is-favorite", item.isFavorite);
  favoriteButton.setAttribute("aria-pressed", item.isFavorite ? "true" : "false");
  favoriteButton.addEventListener("click", () => toggleFavorite(item.id));

  const image = card.querySelector(".item-image");
  const imageFallback = card.querySelector(".image-fallback");
  if (item.imageUrl) {
    image.src = item.imageUrl;
    image.alt = `${item.name} image`;
    image.dataset.fit = item.imageFit || "contain";
    image.classList.remove("hidden");
    imageFallback.classList.add("hidden");
  }

  const supremeLink = card.querySelector(".supreme-link");
  const listingLink = card.querySelector(".listing-link");
  const supremeValue = card.querySelector(".supreme-value");
  const supremeNote = card.querySelector(".supreme-note");
  const ebayValue = card.querySelector(".ebay-value");
  const ebayNote = card.querySelector(".ebay-note");
  const demandRarity = card.querySelector(".demand-rarity");
  const stabilityNote = card.querySelector(".stability-note");

  if (item.current?.supreme) {
    supremeLink.href = item.current.supreme.pageUrl;
    supremeValue.textContent = plainNumber.format(item.current.supreme.value ?? 0);
    supremeNote.textContent = `${item.current.supreme.range} / updated ${item.current.supreme.lastUpdated || "unknown"}`;
    demandRarity.textContent = `D ${item.current.supreme.demand ?? "-"} / R ${item.current.supreme.rarity ?? "-"}`;
    stabilityNote.textContent = `${item.current.supreme.stability} / change ${item.current.supreme.lastChange}`;
  } else {
    supremeValue.textContent = "-";
    supremeNote.textContent = "No Supreme value found";
    demandRarity.textContent = "-";
    stabilityNote.textContent = "-";
    supremeLink.classList.add("hidden");
  }

  if (item.current?.ebay) {
    ebayValue.textContent = euro.format(item.current.ebay.priceEUR);
    ebayNote.textContent = buildEbayNote(item.current.ebay);
    listingLink.href = item.current.ebay.url;
  } else {
    ebayValue.textContent = state.setup?.ebayEnabled ? "-" : "Disabled";
    ebayNote.textContent = state.setup?.ebayEnabled ? "No listing found" : "Add eBay keys in .env";
    listingLink.classList.add("hidden");
  }

  const chart = card.querySelector(".chart");
  const chartWrap = card.querySelector(".chart-wrap");
  const chartTooltip = card.querySelector(".chart-tooltip");
  const chartEmpty = card.querySelector(".chart-empty");
  const chartState = card.querySelector(".chart-state");
  const expandButton = card.querySelector(".chart-expand");
  const historySummary = summarizeHistory(item.history);

  expandButton.addEventListener("click", () => openChartModal(item));
  chartState.textContent = historySummary.label;
  chartState.className = `chart-state ${historySummary.tone}`;

  if (hasChartableData(item.history)) {
    setupChart(chart, chartWrap, chartTooltip, item.history);
    chartEmpty.classList.add("hidden");
  } else {
    chartEmpty.classList.remove("hidden");
  }

  const supremeError = card.querySelector(".supreme-error");
  const ebayError = card.querySelector(".ebay-error");
  if (item.lastError?.supreme) {
    supremeError.textContent = item.lastError.supreme;
    supremeError.classList.remove("hidden");
  }
  if (item.lastError?.ebay) {
    ebayError.textContent = item.lastError.ebay;
    ebayError.classList.remove("hidden");
  }

  return card;
}

function getFilteredItems() {
  return state.items
    .filter((item) => {
      if (state.filters.category !== "all" && item.category !== state.filters.category) {
        return false;
      }

      if (!state.filters.search) {
        return true;
      }

      return item.searchText.includes(state.filters.search);
    })
    .sort(compareItems);
}

function compareItems(left, right) {
  if (left.isFavorite !== right.isFavorite) {
    return left.isFavorite ? -1 : 1;
  }

  switch (state.filters.sort) {
    case "supreme-desc":
      return compareNumbers(right.current?.supreme?.value, left.current?.supreme?.value) || left.name.localeCompare(right.name);
    case "ebay-asc":
      return compareNumbers(left.current?.ebay?.priceEUR, right.current?.ebay?.priceEUR) || left.name.localeCompare(right.name);
    case "recent":
      return compareDates(right.lastCheckedAt, left.lastCheckedAt) || left.name.localeCompare(right.name);
    case "name":
    default:
      return left.name.localeCompare(right.name);
  }
}

function hasChartableData(history) {
  if (!Array.isArray(history) || history.length < 2) {
    return false;
  }

  return history.some((point) => point.ebayPriceEUR != null) || history.some((point) => point.supremeValue != null);
}

function summarizeHistory(history) {
  const samples = Array.isArray(history) ? history : [];
  if (samples.length < 2) {
    return { label: "Still building history. You need at least two refreshes before this chart starts to say anything useful.", tone: "is-muted" };
  }

  const ebayValues = samples.map((point) => point.ebayPriceEUR).filter((value) => value != null);
  const supremeValues = samples.map((point) => point.supremeValue).filter((value) => value != null);
  const ebayFlat = ebayValues.length >= 2 && Math.max(...ebayValues) === Math.min(...ebayValues);
  const supremeFlat = supremeValues.length >= 2 && Math.max(...supremeValues) === Math.min(...supremeValues);

  if (ebayFlat && supremeFlat) {
    return { label: "No movement in the stored samples yet. The flat line is expected because both values have repeated.", tone: "is-calm" };
  }

  if (ebayFlat || supremeFlat) {
    return { label: "One side is flat right now. That usually means the tracker has repeated values, not that the chart failed.", tone: "is-calm" };
  }

  return { label: `Movement captured across ${samples.length} stored samples. Hover any point for exact values.`, tone: "is-live" };
}

function setupChart(canvas, chartWrap, tooltip, history) {
  const renderActive = (activeIndex = null) => drawDualChart(canvas, history, activeIndex);
  renderActive();

  chartWrap.onmousemove = (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const x = (event.clientX - rect.left) * scaleX;
    const activeIndex = pickNearestHistoryIndex(history, x, canvas.width);
    renderActive(activeIndex);
    showTooltip(tooltip, history[activeIndex], activeIndex, history.length, event.clientX - rect.left, rect);
  };

  chartWrap.onmouseleave = () => {
    tooltip.classList.add("hidden");
    renderActive(null);
  };
}

function drawDualChart(canvas, history, activeIndex) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const padding = { top: 28, right: 64, bottom: 42, left: 64 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const ebayPointsRaw = history.filter((point) => point.ebayPriceEUR != null);
  const supremePointsRaw = history.filter((point) => point.supremeValue != null);
  const ebayScale = buildScale(ebayPointsRaw.map((point) => point.ebayPriceEUR));
  const supremeScale = buildScale(supremePointsRaw.map((point) => point.supremeValue));

  ctx.clearRect(0, 0, width, height);
  drawGrid(ctx, width, height, padding, plotWidth, plotHeight);

  const indexedPoints = history.map((point, index) => ({
    index,
    timestamp: point.timestamp,
    x: padding.left + (plotWidth / Math.max(history.length - 1, 1)) * index,
    ebayValue: point.ebayPriceEUR,
    supremeValue: point.supremeValue
  }));

  const ebayPoints = indexedPoints
    .filter((point) => point.ebayValue != null)
    .map((point) => ({
      ...point,
      y: scaleY(point.ebayValue, ebayScale, padding.top, plotHeight)
    }));

  const supremePoints = indexedPoints
    .filter((point) => point.supremeValue != null)
    .map((point) => ({
      ...point,
      y: scaleY(point.supremeValue, supremeScale, padding.top, plotHeight)
    }));

  drawAreaLine(ctx, ebayPoints, "#7cf2c9", "rgba(124, 242, 201, 0.15)", height - padding.bottom);
  drawAreaLine(ctx, supremePoints, "#ffb86c", "rgba(255, 184, 108, 0.13)", height - padding.bottom);
  drawAxisText(ctx, history, width, height, padding, ebayScale, supremeScale);

  if (activeIndex != null) {
    drawHoverState(ctx, indexedPoints, ebayPoints, supremePoints, activeIndex, height, padding);
  }
}

function drawGrid(ctx, width, height, padding, plotWidth, plotHeight) {
  ctx.strokeStyle = "rgba(167, 188, 212, 0.14)";
  ctx.lineWidth = 1;

  for (let index = 0; index < 4; index += 1) {
    const y = padding.top + (plotHeight / 3) * index;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  for (let index = 0; index < 4; index += 1) {
    const x = padding.left + (plotWidth / 3) * index;
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, height - padding.bottom);
    ctx.stroke();
  }
}

function drawAxisText(ctx, history, width, height, padding, ebayScale, supremeScale) {
  ctx.fillStyle = "#9fb1cb";
  ctx.font = '12px "Space Grotesk", sans-serif';

  if (ebayScale.max != null) {
    const maxText = formatAxisCurrency(ebayScale.max);
    const minText = formatAxisCurrency(ebayScale.min);
    ctx.fillText(maxText, 8, 22);
    ctx.fillText(minText, 8, height - 18);
  }

  if (supremeScale.max != null) {
    const maxText = formatAxisValue(supremeScale.max);
    const minText = formatAxisValue(supremeScale.min);
    ctx.fillText(maxText, width - ctx.measureText(maxText).width - 8, 22);
    ctx.fillText(minText, width - ctx.measureText(minText).width - 8, height - 18);
  }

  const first = shortDate(history[0]?.timestamp);
  const last = shortDate(history[history.length - 1]?.timestamp);
  ctx.fillText(first, padding.left, height - 10);
  ctx.fillText(last, width - padding.right - ctx.measureText(last).width, height - 10);
}

function drawHoverState(ctx, indexedPoints, ebayPoints, supremePoints, activeIndex, height, padding) {
  const anchor = indexedPoints[activeIndex];
  if (!anchor) {
    return;
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.24)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(anchor.x, padding.top);
  ctx.lineTo(anchor.x, height - padding.bottom);
  ctx.stroke();

  const ebayPoint = ebayPoints.find((point) => point.index === activeIndex);
  const supremePoint = supremePoints.find((point) => point.index === activeIndex);

  if (ebayPoint) {
    drawPoint(ctx, ebayPoint.x, ebayPoint.y, "#7cf2c9");
  }

  if (supremePoint) {
    drawPoint(ctx, supremePoint.x, supremePoint.y, "#ffb86c");
  }
}

function drawPoint(ctx, x, y, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = "#08111d";
  ctx.lineWidth = 2;
  ctx.arc(x, y, 6.5, 0, Math.PI * 2);
  ctx.stroke();
}

function buildScale(values) {
  if (!values.length) {
    return { min: null, max: null, range: 1 };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = Math.max((max - min) * 0.12, max === min ? Math.max(Math.abs(max) * 0.08, 1) : 1);
  return {
    min: min - padding,
    max: max + padding,
    range: Math.max((max + padding) - (min - padding), 1)
  };
}

function scaleY(value, scale, top, height) {
  return top + height - ((value - scale.min) / scale.range) * height;
}

function drawAreaLine(ctx, points, strokeStyle, fillStyle, baselineY) {
  if (points.length < 2) {
    return;
  }

  ctx.beginPath();
  ctx.moveTo(points[0].x, baselineY);
  for (const point of points) {
    ctx.lineTo(point.x, point.y);
  }
  ctx.lineTo(points[points.length - 1].x, baselineY);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (const point of points.slice(1)) {
    ctx.lineTo(point.x, point.y);
  }
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = 3;
  ctx.stroke();
}

function pickNearestHistoryIndex(history, canvasX, canvasWidth) {
  const padding = { left: 64, right: 64 };
  const plotWidth = canvasWidth - padding.left - padding.right;
  const ratio = Math.max(0, Math.min(1, (canvasX - padding.left) / Math.max(plotWidth, 1)));
  return Math.round(ratio * Math.max(history.length - 1, 0));
}

function showTooltip(tooltip, point, index, total, pointerX, rect) {
  if (!point) {
    tooltip.classList.add("hidden");
    return;
  }

  const lines = [
    shortDateTime(point.timestamp),
    point.supremeValue != null ? `Supreme: ${plainNumber.format(point.supremeValue)}` : "Supreme: -",
    point.ebayPriceEUR != null ? `eBay: ${euro.format(point.ebayPriceEUR)}` : "eBay: -",
    `Sample ${index + 1} of ${total}`
  ];

  tooltip.textContent = lines.join("\n");
  tooltip.classList.remove("hidden");
  tooltip.style.left = `${Math.min(Math.max(pointerX + 16, 12), rect.width - 180)}px`;
  tooltip.style.top = "14px";
}

function compareNumbers(left, right) {
  if (left == null && right == null) {
    return 0;
  }
  if (left == null) {
    return 1;
  }
  if (right == null) {
    return -1;
  }
  return left - right;
}

function compareDates(left, right) {
  const leftTime = left ? new Date(left).getTime() : 0;
  const rightTime = right ? new Date(right).getTime() : 0;
  return leftTime - rightTime;
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function shortDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IE", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

function shortDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function titleCase(value) {
  return String(value || "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function setStatus(message) {
  statusLine.textContent = message;
}

function openChartModal(item) {
  if (!item) {
    return;
  }

  state.selectedItemId = item.id;
  chartModalTitle.textContent = item.name;
  chartModalCategory.textContent = titleCase(item.category);
  chartModalMeta.textContent = item.lastCheckedAt
    ? `Checked ${formatDate(item.lastCheckedAt)}`
    : "Not checked yet";
  chartModalSupreme.textContent = item.current?.supreme?.value != null
    ? plainNumber.format(item.current.supreme.value)
    : "-";
  chartModalEbay.textContent = item.current?.ebay?.priceEUR != null
    ? euro.format(item.current.ebay.priceEUR)
    : "No live price";
  chartModalSamples.textContent = String(item.history?.length || 0);
  chartModalHistoryNote.textContent = buildHistoryNote(item);

  if (hasChartableData(item.history)) {
    chartModalEmpty.classList.add("hidden");
    setupChart(chartModalCanvas, chartModalCanvas.parentElement, chartModalTooltip, item.history);
  } else {
    chartModalEmpty.classList.remove("hidden");
    drawDualChart(chartModalCanvas, item.history || [], null);
  }

  chartModal.classList.remove("hidden");
  chartModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeChartModal() {
  state.selectedItemId = null;
  chartModal.classList.add("hidden");
  chartModal.setAttribute("aria-hidden", "true");
  chartModalTooltip.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

function buildHistoryNote(item) {
  const ebayPoints = (item.history || []).filter((point) => point.ebayPriceEUR != null).length;
  const supremePoints = (item.history || []).filter((point) => point.supremeValue != null).length;

  if (ebayPoints === 0) {
    return "eBay history is only stored when the tracker refreshes successfully. There is no 2-month backfill source in this app yet, so older eBay points cannot be reconstructed automatically.";
  }

  return `This view has ${ebayPoints} stored eBay sample${ebayPoints === 1 ? "" : "s"} and ${supremePoints} Supreme sample${supremePoints === 1 ? "" : "s"}. Older eBay history only exists if the tracker captured it when it refreshed.`;
}

function buildItemKicker(item) {
  const parts = [];
  if (item.current?.ebay?.matchedQuery) {
    parts.push(`Matched via ${item.current.ebay.matchedQuery.replace(/^Murder Mystery 2\s+/i, "")}`);
  }
  if (item.current?.ebay?.itemGroupType === "SELLER_DEFINED_VARIATIONS") {
    parts.push("Variation listing");
  }
  if (item.current?.supreme?.lastUpdated) {
    parts.push(`Supreme updated ${item.current.supreme.lastUpdated}`);
  }
  return parts.join(" / ");
}

function buildEbayNote(ebay) {
  if (!ebay) {
    return "-";
  }

  const itemText = `${ebay.sourceCurrency} ${Number(ebay.sourcePrice || 0).toFixed(2)}`;
  if (ebay.shippingPriceEUR == null) {
    return itemText;
  }

  return `${itemText} item / ${euro.format(ebay.shippingPriceEUR)} shipping`;
}

function formatAxisCurrency(value) {
  if (value == null) {
    return "-";
  }

  return `€${Number(value).toFixed(value >= 100 ? 0 : 2)}`;
}

function formatAxisValue(value) {
  if (value == null) {
    return "-";
  }

  return compactNumber.format(value);
}

function loadFavorites() {
  try {
    const raw = window.localStorage.getItem("mm2-favorites");
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch (_error) {
    return new Set();
  }
}

function saveFavorites() {
  window.localStorage.setItem("mm2-favorites", JSON.stringify([...state.favorites]));
}

function toggleFavorite(itemId) {
  if (state.favorites.has(itemId)) {
    state.favorites.delete(itemId);
  } else {
    state.favorites.add(itemId);
  }

  saveFavorites();
  state.items = state.items.map((item) => ({
    ...item,
    isFavorite: state.favorites.has(item.id)
  }));
  renderSummary();
  renderItems();
}

async function maybeAutoRefreshForEbay() {
  if (!state.setup?.ebayEnabled || state.hasAutoRefreshedForEbay) {
    return;
  }

  const hasAnyEbayPrices = state.items.some((item) => item.current?.ebay?.priceEUR != null);
  if (hasAnyEbayPrices) {
    return;
  }

  state.hasAutoRefreshedForEbay = true;
  await refreshData(false);
}
