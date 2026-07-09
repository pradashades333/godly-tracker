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
  activeView: "board",
  valuesCategory: "all",
  favorites: loadFavorites(),
  inventory: loadInventory(),
  sellerRecords: loadSellerRecords(),
  hasAutoRefreshedForEbay: false,
  trade: {
    have: createTradeSlots(),
    want: createTradeSlots()
  },
  filters: {
    search: "",
    category: "all",
    sort: "name"
  }
};

const itemsGrid = document.getElementById("itemsGrid");
const boardView = document.getElementById("boardView");
const valuesView = document.getElementById("valuesView");
const tradeView = document.getElementById("tradeView");
const inventoryView = document.getElementById("inventoryView");
const sellerView = document.getElementById("sellerView");
const changesView = document.getElementById("changesView");
const toolsView = document.getElementById("toolsView");
const tickerTrack = document.getElementById("tickerTrack");
const boardTabButton = document.getElementById("boardTabButton");
const valuesTabButton = document.getElementById("valuesTabButton");
const tradeTabButton = document.getElementById("tradeTabButton");
const inventoryTabButton = document.getElementById("inventoryTabButton");
const sellerTabButton = document.getElementById("sellerTabButton");
const changesTabButton = document.getElementById("changesTabButton");
const toolsTabButton = document.getElementById("toolsTabButton");
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
const valuesCategoryChips = document.getElementById("valuesCategoryChips");
const valuesTableBody = document.getElementById("valuesTableBody");
const changesList = document.getElementById("changesList");
const openTradeToolButton = document.getElementById("openTradeToolButton");
const openBoardToolButton = document.getElementById("openBoardToolButton");
const openInventoryToolButton = document.getElementById("openInventoryToolButton");
const openSellerToolButton = document.getElementById("openSellerToolButton");
const refreshToolButton = document.getElementById("refreshToolButton");
const tradeItemOptions = document.getElementById("tradeItemOptions");
const tradeHaveSlots = document.getElementById("tradeHaveSlots");
const tradeWantSlots = document.getElementById("tradeWantSlots");
const tradeHaveTotal = document.getElementById("tradeHaveTotal");
const tradeWantTotal = document.getElementById("tradeWantTotal");
const tradeSummaryHave = document.getElementById("tradeSummaryHave");
const tradeSummaryWant = document.getElementById("tradeSummaryWant");
const tradeSummaryDiff = document.getElementById("tradeSummaryDiff");
const tradeVerdict = document.getElementById("tradeVerdict");
const tradeClearButton = document.getElementById("tradeClearButton");
const inventoryItemOptions = document.getElementById("inventoryItemOptions");
const inventorySearchInput = document.getElementById("inventorySearchInput");
const inventoryQuantityInput = document.getElementById("inventoryQuantityInput");
const inventoryAddButton = document.getElementById("inventoryAddButton");
const inventoryClearButton = document.getElementById("inventoryClearButton");
const inventoryTotalValue = document.getElementById("inventoryTotalValue");
const inventoryTotalStacks = document.getElementById("inventoryTotalStacks");
const inventoryUniqueItems = document.getElementById("inventoryUniqueItems");
const inventoryTopCategory = document.getElementById("inventoryTopCategory");
const inventoryHoldingsList = document.getElementById("inventoryHoldingsList");
const inventoryCategoryList = document.getElementById("inventoryCategoryList");
const inventoryBiggestList = document.getElementById("inventoryBiggestList");
const inventoryDuplicatesList = document.getElementById("inventoryDuplicatesList");
const inventoryChart = document.getElementById("inventoryChart");
const inventoryChartEmpty = document.getElementById("inventoryChartEmpty");
const inventoryChartRange = document.getElementById("inventoryChartRange");
const sellerItemOptions = document.getElementById("sellerItemOptions");
const sellerItemInput = document.getElementById("sellerItemInput");
const sellerQuantityInput = document.getElementById("sellerQuantityInput");
const sellerBuyPriceInput = document.getElementById("sellerBuyPriceInput");
const sellerSellPriceInput = document.getElementById("sellerSellPriceInput");
const sellerPlatformInput = document.getElementById("sellerPlatformInput");
const sellerSupplierInput = document.getElementById("sellerSupplierInput");
const sellerStatusInput = document.getElementById("sellerStatusInput");
const sellerAddButton = document.getElementById("sellerAddButton");
const sellerClearButton = document.getElementById("sellerClearButton");
const sellerInventoryCost = document.getElementById("sellerInventoryCost");
const sellerEstimatedValue = document.getElementById("sellerEstimatedValue");
const sellerProfit = document.getElementById("sellerProfit");
const sellerRoi = document.getElementById("sellerRoi");
const sellerDeadStock = document.getElementById("sellerDeadStock");
const sellerMonthlyRevenue = document.getElementById("sellerMonthlyRevenue");
const sellerRecordsList = document.getElementById("sellerRecordsList");
const sellerBestItemsList = document.getElementById("sellerBestItemsList");
const sellerRevenueList = document.getElementById("sellerRevenueList");
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

boardTabButton.addEventListener("click", () => setActiveView("board"));
valuesTabButton.addEventListener("click", () => setActiveView("values"));
tradeTabButton.addEventListener("click", () => setActiveView("trade"));
inventoryTabButton.addEventListener("click", () => setActiveView("inventory"));
sellerTabButton.addEventListener("click", () => setActiveView("seller"));
changesTabButton.addEventListener("click", () => setActiveView("changes"));
toolsTabButton.addEventListener("click", () => setActiveView("tools"));
tradeClearButton.addEventListener("click", clearTradeState);
openTradeToolButton.addEventListener("click", () => setActiveView("trade"));
openBoardToolButton.addEventListener("click", () => setActiveView("board"));
openInventoryToolButton.addEventListener("click", () => setActiveView("inventory"));
openSellerToolButton.addEventListener("click", () => setActiveView("seller"));
refreshToolButton.addEventListener("click", async () => {
  setActiveView("board");
  await refreshData(true);
});
inventoryAddButton.addEventListener("click", addInventoryFromInputs);
inventoryClearButton.addEventListener("click", clearInventoryState);
inventorySearchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addInventoryFromInputs();
  }
});
sellerAddButton.addEventListener("click", addSellerRecordFromInputs);
sellerClearButton.addEventListener("click", clearSellerRecords);
sellerItemInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addSellerRecordFromInputs();
  }
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
  renderValuesView();
  renderTradeChecker();
  renderInventoryView();
  renderSellerView();
  renderChangesView();
  renderTicker();
  syncActiveView();
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

function setActiveView(view) {
  state.activeView = ["board", "values", "trade", "inventory", "seller", "changes", "tools"].includes(view) ? view : "board";
  syncActiveView();
}

function syncActiveView() {
  boardView.classList.toggle("hidden", state.activeView !== "board");
  valuesView.classList.toggle("hidden", state.activeView !== "values");
  tradeView.classList.toggle("hidden", state.activeView !== "trade");
  inventoryView.classList.toggle("hidden", state.activeView !== "inventory");
  sellerView.classList.toggle("hidden", state.activeView !== "seller");
  changesView.classList.toggle("hidden", state.activeView !== "changes");
  toolsView.classList.toggle("hidden", state.activeView !== "tools");
  boardTabButton.classList.toggle("is-active", state.activeView === "board");
  valuesTabButton.classList.toggle("is-active", state.activeView === "values");
  tradeTabButton.classList.toggle("is-active", state.activeView === "trade");
  inventoryTabButton.classList.toggle("is-active", state.activeView === "inventory");
  sellerTabButton.classList.toggle("is-active", state.activeView === "seller");
  changesTabButton.classList.toggle("is-active", state.activeView === "changes");
  toolsTabButton.classList.toggle("is-active", state.activeView === "tools");
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

function renderTradeChecker() {
  const eligibleItems = getTradeEligibleItems();
  tradeItemOptions.innerHTML = "";

  for (const item of eligibleItems) {
    const option = document.createElement("option");
    option.value = item.name;
    option.label = `${item.name} (${plainNumber.format(item.current?.supreme?.value ?? 0)})`;
    tradeItemOptions.appendChild(option);
  }

  renderTradeSlots("have", tradeHaveSlots);
  renderTradeSlots("want", tradeWantSlots);
  renderTradeSummary();
}

function renderInventoryView() {
  const eligibleItems = getInventoryEligibleItems();
  inventoryItemOptions.innerHTML = "";

  for (const item of eligibleItems) {
    const option = document.createElement("option");
    option.value = item.name;
    option.label = `${item.name} (${plainNumber.format(item.current?.supreme?.value ?? 0)})`;
    inventoryItemOptions.appendChild(option);
  }

  const holdings = getInventoryHoldings();
  const totalValue = holdings.reduce((sum, entry) => sum + entry.stackValue, 0);
  const totalStacks = holdings.reduce((sum, entry) => sum + entry.quantity, 0);
  const categoryTotals = getInventoryCategoryTotals(holdings);
  const topCategory = categoryTotals[0] ? `${titleCase(categoryTotals[0].category)} / ${plainNumber.format(categoryTotals[0].value)}` : "-";

  inventoryTotalValue.textContent = plainNumber.format(totalValue);
  inventoryTotalStacks.textContent = plainNumber.format(totalStacks);
  inventoryUniqueItems.textContent = plainNumber.format(holdings.length);
  inventoryTopCategory.textContent = topCategory;

  renderInventoryHoldings(holdings);
  renderInventoryStatList(inventoryCategoryList, categoryTotals.map((entry) => ({
    title: titleCase(entry.category),
    meta: `${plainNumber.format(entry.value)} total / ${entry.share}% of inventory`
  })), "No inventory category data yet.");
  renderInventoryStatList(inventoryBiggestList, holdings
    .slice()
    .sort((left, right) => right.stackValue - left.stackValue)
    .slice(0, 6)
    .map((entry) => ({
      title: entry.item.name,
      meta: `${plainNumber.format(entry.stackValue)} total / ${plainNumber.format(entry.unitValue)} each / qty ${entry.quantity}`
    })), "No high-value stacks yet.");
  renderInventoryStatList(inventoryDuplicatesList, holdings
    .filter((entry) => entry.quantity > 1)
    .sort((left, right) => right.quantity - left.quantity || right.stackValue - left.stackValue)
    .slice(0, 6)
    .map((entry) => ({
      title: entry.item.name,
      meta: `${plainNumber.format(entry.quantity)} copies / ${plainNumber.format(entry.stackValue)} stack value`
    })), "No duplicated items yet.");
  renderInventoryChart(holdings);
}

function renderSellerView() {
  sellerItemOptions.innerHTML = "";
  for (const item of state.items.slice().sort((left, right) => left.name.localeCompare(right.name))) {
    const option = document.createElement("option");
    option.value = item.name;
    sellerItemOptions.appendChild(option);
  }

  const records = getSellerRecords();
  const inventoryCostValue = records
    .filter((record) => record.status === "in-stock")
    .reduce((sum, record) => sum + record.quantity * record.buyPrice, 0);
  const estimatedValue = records
    .filter((record) => record.status === "in-stock")
    .reduce((sum, record) => sum + record.quantity * record.sellPrice, 0);
  const projectedProfit = records.reduce((sum, record) => sum + record.quantity * (record.sellPrice - record.buyPrice), 0);
  const roi = records.length ? (projectedProfit / Math.max(1, records.reduce((sum, record) => sum + record.quantity * record.buyPrice, 0))) * 100 : 0;
  const deadStockEntries = records.filter((record) => record.status === "in-stock");
  const monthlyRevenueRows = buildSellerMonthlyRevenue(records);

  sellerInventoryCost.textContent = euro.format(inventoryCostValue);
  sellerEstimatedValue.textContent = euro.format(estimatedValue);
  sellerProfit.textContent = euro.format(projectedProfit);
  sellerRoi.textContent = `${roi.toFixed(1)}%`;
  sellerDeadStock.textContent = `${plainNumber.format(deadStockEntries.length)} entries / ${euro.format(deadStockEntries.reduce((sum, record) => sum + record.quantity * record.buyPrice, 0))}`;
  sellerMonthlyRevenue.textContent = monthlyRevenueRows[0] ? euro.format(monthlyRevenueRows[0].value) : euro.format(0);

  renderSellerRecords(records);
  renderInventoryStatList(sellerBestItemsList, buildSellerBestItems(records), "No sold items yet.");
  renderInventoryStatList(sellerRevenueList, monthlyRevenueRows.map((row) => ({
    title: row.label,
    meta: `${euro.format(row.value)} revenue / ${plainNumber.format(row.quantity)} item${row.quantity === 1 ? "" : "s"} sold`
  })), "No monthly revenue yet.");
}

function renderValuesView() {
  const categoryCounts = new Map();
  for (const item of state.items) {
    categoryCounts.set(item.category, (categoryCounts.get(item.category) || 0) + 1);
  }

  const categories = [...categoryCounts.keys()].sort();
  if (state.valuesCategory !== "all" && !categoryCounts.has(state.valuesCategory)) {
    state.valuesCategory = "all";
  }

  valuesCategoryChips.innerHTML = "";
  const allChip = buildValuesChip("all", `All (${state.items.length})`);
  valuesCategoryChips.appendChild(allChip);

  for (const category of categories) {
    valuesCategoryChips.appendChild(buildValuesChip(category, `${titleCase(category)} (${categoryCounts.get(category)})`));
  }

  const rows = state.items
    .filter((item) => state.valuesCategory === "all" || item.category === state.valuesCategory)
    .sort((left, right) => compareNumbers(right.current?.supreme?.value, left.current?.supreme?.value) || left.name.localeCompare(right.name));

  valuesTableBody.innerHTML = "";
  for (const item of rows) {
    valuesTableBody.appendChild(buildValuesRow(item));
  }
}

function buildValuesChip(category, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `filter-chip${state.valuesCategory === category ? " is-active" : ""}`;
  button.textContent = label;
  button.addEventListener("click", () => {
    state.valuesCategory = category;
    renderValuesView();
  });
  return button;
}

function buildValuesRow(item) {
  const row = document.createElement("article");
  row.className = "values-table-row values-table-item";

  row.appendChild(buildValuesCell(item.name, "is-item"));
  row.appendChild(buildValuesCell(titleCase(item.category)));
  row.appendChild(buildValuesCell(item.current?.supreme?.value != null ? plainNumber.format(item.current.supreme.value) : "-"));
  row.appendChild(buildValuesCell(item.current?.supreme?.range || "-"));
  row.appendChild(buildValuesCell(item.current?.ebay?.priceEUR != null ? euro.format(item.current.ebay.priceEUR) : "-"));
  row.appendChild(buildValuesCell(item.lastCheckedAt ? shortDateTime(item.lastCheckedAt) : "-"));

  return row;
}

function buildValuesCell(text, extraClass = "") {
  const cell = document.createElement("span");
  cell.className = `values-cell ${extraClass}`.trim();
  cell.textContent = text;
  return cell;
}

function renderChangesView() {
  const changes = buildRecentChanges();
  changesList.innerHTML = "";

  if (changes.length === 0) {
    const empty = document.createElement("div");
    empty.className = "change-card";
    empty.textContent = "No recent value changes recorded yet. Keep refreshing the tracker to build a change feed.";
    changesList.appendChild(empty);
    return;
  }

  for (const change of changes) {
    const card = document.createElement("article");
    card.className = "change-card";

    const head = document.createElement("div");
    head.className = "change-head";

    const title = document.createElement("strong");
    title.textContent = change.name;
    head.appendChild(title);

    const badge = document.createElement("span");
    badge.className = `change-badge ${change.diff > 0 ? "is-up" : "is-down"}`;
    badge.textContent = `${change.diff > 0 ? "+" : ""}${plainNumber.format(change.diff)}`;
    head.appendChild(badge);

    const meta = document.createElement("p");
    meta.className = "change-meta";
    meta.textContent = `${plainNumber.format(change.previous)} -> ${plainNumber.format(change.current)} / ${shortDateTime(change.timestamp)}`;

    card.appendChild(head);
    card.appendChild(meta);
    changesList.appendChild(card);
  }
}

function renderInventoryHoldings(holdings) {
  inventoryHoldingsList.innerHTML = "";

  if (holdings.length === 0) {
    const empty = document.createElement("div");
    empty.className = "inventory-empty";
    empty.textContent = "Add some items to start tracking your inventory value.";
    inventoryHoldingsList.appendChild(empty);
    return;
  }

  for (const entry of holdings.slice().sort((left, right) => right.stackValue - left.stackValue || left.item.name.localeCompare(right.item.name))) {
    const row = document.createElement("article");
    row.className = "inventory-holding";

    const info = document.createElement("div");
    info.className = "inventory-holding-info";

    const title = document.createElement("strong");
    title.textContent = entry.item.name;
    info.appendChild(title);

    const meta = document.createElement("span");
    meta.textContent = `${titleCase(entry.item.category)} / ${plainNumber.format(entry.unitValue)} each / ${plainNumber.format(entry.stackValue)} stack`;
    info.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "inventory-holding-actions";

    const quantity = document.createElement("input");
    quantity.type = "number";
    quantity.className = "inventory-quantity-input";
    quantity.min = "1";
    quantity.step = "1";
    quantity.value = String(entry.quantity);
    quantity.addEventListener("change", (event) => updateInventoryQuantity(entry.item.id, event.target.value));
    quantity.addEventListener("blur", (event) => updateInventoryQuantity(entry.item.id, event.target.value));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "trade-slot-remove";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => removeInventoryItem(entry.item.id));

    actions.appendChild(quantity);
    actions.appendChild(remove);
    row.appendChild(info);
    row.appendChild(actions);
    inventoryHoldingsList.appendChild(row);
  }
}

function renderInventoryStatList(container, rows, emptyMessage) {
  container.innerHTML = "";

  if (!rows.length) {
    const empty = document.createElement("div");
    empty.className = "inventory-empty";
    empty.textContent = emptyMessage;
    container.appendChild(empty);
    return;
  }

  for (const row of rows) {
    const item = document.createElement("article");
    item.className = "inventory-stat-item";

    const title = document.createElement("strong");
    title.textContent = row.title;
    item.appendChild(title);

    const meta = document.createElement("span");
    meta.textContent = row.meta;
    item.appendChild(meta);

    container.appendChild(item);
  }
}

function renderInventoryChart(holdings) {
  const timeline = buildInventoryTimeline(holdings);
  inventoryChart.innerHTML = "";

  if (timeline.length < 2) {
    inventoryChart.classList.add("hidden");
    inventoryChartEmpty.classList.remove("hidden");
    inventoryChartRange.textContent = "Using tracked Supreme history";
    return;
  }

  inventoryChart.classList.remove("hidden");
  inventoryChartEmpty.classList.add("hidden");
  inventoryChartRange.textContent = `${formatShortDate(timeline[0].timestamp)} to ${formatShortDate(timeline[timeline.length - 1].timestamp)}`;

  const width = 760;
  const height = 280;
  const padding = 24;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const minValue = Math.min(...timeline.map((point) => point.value));
  const maxValue = Math.max(...timeline.map((point) => point.value));
  const range = Math.max(1, maxValue - minValue);

  const points = timeline.map((point, index) => {
    const x = padding + (innerWidth * index) / Math.max(1, timeline.length - 1);
    const y = height - padding - ((point.value - minValue) / range) * innerHeight;
    return { x, y, ...point };
  });

  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPoints = [`${padding},${height - padding}`, ...points.map((point) => `${point.x},${point.y}`), `${padding + innerWidth},${height - padding}`].join(" ");

  const gridValues = [0, 0.5, 1].map((ratio) => maxValue - ratio * range);
  for (const [index, gridValue] of gridValues.entries()) {
    const y = padding + (innerHeight * index) / Math.max(1, gridValues.length - 1);
    inventoryChart.appendChild(createSvgElement("line", {
      x1: padding,
      y1: y,
      x2: width - padding,
      y2: y,
      class: "inventory-grid-line"
    }));
    inventoryChart.appendChild(createSvgElement("text", {
      x: width - padding,
      y: y - 6,
      class: "inventory-grid-label"
    }, plainNumber.format(Math.round(gridValue))));
  }

  inventoryChart.appendChild(createSvgElement("polygon", {
    points: areaPoints,
    class: "inventory-area"
  }));
  inventoryChart.appendChild(createSvgElement("polyline", {
    points: linePoints,
    class: "inventory-line"
  }));

  for (const point of points) {
    inventoryChart.appendChild(createSvgElement("circle", {
      cx: point.x,
      cy: point.y,
      r: 4,
      class: "inventory-dot"
    }));
  }

  inventoryChart.appendChild(createSvgElement("text", {
    x: padding,
    y: height - 4,
    class: "inventory-grid-label"
  }, formatShortDate(timeline[0].timestamp)));
  inventoryChart.appendChild(createSvgElement("text", {
    x: width - padding,
    y: height - 4,
    "text-anchor": "end",
    class: "inventory-grid-label"
  }, formatShortDate(timeline[timeline.length - 1].timestamp)));
}

function renderSellerRecords(records) {
  sellerRecordsList.innerHTML = "";

  if (!records.length) {
    const empty = document.createElement("div");
    empty.className = "inventory-empty";
    empty.textContent = "Add seller entries to start tracking stock and revenue.";
    sellerRecordsList.appendChild(empty);
    return;
  }

  for (const record of records.slice().sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())) {
    const row = document.createElement("article");
    row.className = "seller-record";

    const info = document.createElement("div");
    info.className = "seller-record-info";

    const title = document.createElement("strong");
    title.textContent = record.item;
    info.appendChild(title);

    const meta = document.createElement("span");
    meta.textContent = `Qty ${record.quantity} / Buy ${euro.format(record.buyPrice)} / Sell ${euro.format(record.sellPrice)} / ${record.platform || "No platform"} / ${record.supplier || "No supplier"}`;
    info.appendChild(meta);

    const submeta = document.createElement("span");
    submeta.textContent = `${record.status === "sold" ? "Sold" : "In stock"} / Added ${formatDate(record.createdAt)}${record.soldAt ? ` / Sold ${formatDate(record.soldAt)}` : ""}`;
    info.appendChild(submeta);

    const actions = document.createElement("div");
    actions.className = "seller-record-actions";

    const status = document.createElement("select");
    status.className = "select-input seller-status-select";
    status.innerHTML = '<option value="in-stock">In stock</option><option value="sold">Sold</option>';
    status.value = record.status;
    status.addEventListener("change", (event) => updateSellerRecordStatus(record.id, event.target.value));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "trade-slot-remove";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => removeSellerRecord(record.id));

    actions.appendChild(status);
    actions.appendChild(remove);
    row.appendChild(info);
    row.appendChild(actions);
    sellerRecordsList.appendChild(row);
  }
}

function renderTicker() {
  const changes = buildRecentChanges().slice(0, 12);
  tickerTrack.innerHTML = "";

  if (changes.length === 0) {
    const empty = document.createElement("div");
    empty.className = "ticker-item is-empty";
    empty.textContent = "No recent Supreme value changes recorded yet.";
    tickerTrack.appendChild(empty);
    return;
  }

  for (let index = 0; index < 2; index += 1) {
    const group = document.createElement("div");
    group.className = "ticker-group";
    for (const change of changes) {
      group.appendChild(buildTickerItem(change));
    }
    tickerTrack.appendChild(group);
  }
}

function buildTickerItem(change) {
  const item = document.createElement("article");
  item.className = `ticker-item ${change.diff > 0 ? "is-up" : "is-down"}`;

  const name = document.createElement("strong");
  name.textContent = change.name;
  item.appendChild(name);

  const price = document.createElement("span");
  price.className = "ticker-price";
  price.textContent = plainNumber.format(change.current);
  item.appendChild(price);

  const diff = document.createElement("span");
  diff.className = "ticker-diff";
  diff.textContent = `${change.diff > 0 ? "+" : ""}${plainNumber.format(change.diff)}`;
  item.appendChild(diff);

  return item;
}

function buildRecentChanges() {
  const changes = [];

  for (const item of state.items) {
    const history = Array.isArray(item.history) ? item.history.filter((point) => point.supremeValue != null) : [];
    if (history.length < 2) {
      continue;
    }

    const current = history[history.length - 1];
    let previous = null;
    for (let index = history.length - 2; index >= 0; index -= 1) {
      if (history[index].supremeValue !== current.supremeValue) {
        previous = history[index];
        break;
      }
    }

    if (!previous) {
      continue;
    }

    const diff = current.supremeValue - previous.supremeValue;
    if (!diff) {
      continue;
    }

    changes.push({
      id: item.id,
      name: item.name,
      previous: previous.supremeValue,
      current: current.supremeValue,
      diff,
      timestamp: current.timestamp
    });
  }

  return changes.sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime()).slice(0, 30);
}

function addInventoryFromInputs() {
  const value = inventorySearchInput.value.trim().toLowerCase();
  if (!value) {
    return;
  }

  const quantity = clampInventoryQuantity(inventoryQuantityInput.value);
  const match = getInventoryEligibleItems().find((item) => item.name.toLowerCase() === value);
  if (!match) {
    return;
  }

  const previous = Number(state.inventory[match.id] || 0);
  state.inventory[match.id] = previous + quantity;
  saveInventory(state.inventory);
  inventorySearchInput.value = "";
  inventoryQuantityInput.value = "1";
  renderInventoryView();
}

function addSellerRecordFromInputs() {
  const item = sellerItemInput.value.trim();
  if (!item) {
    return;
  }

  const quantity = clampInventoryQuantity(sellerQuantityInput.value);
  const buyPrice = clampMoneyValue(sellerBuyPriceInput.value);
  const sellPrice = clampMoneyValue(sellerSellPriceInput.value);
  const status = sellerStatusInput.value === "sold" ? "sold" : "in-stock";
  const now = new Date().toISOString();

  state.sellerRecords.push({
    id: createClientId("seller"),
    item,
    quantity,
    buyPrice,
    sellPrice,
    platform: sellerPlatformInput.value.trim(),
    supplier: sellerSupplierInput.value.trim(),
    status,
    createdAt: now,
    soldAt: status === "sold" ? now : null
  });

  saveSellerRecords(state.sellerRecords);
  sellerItemInput.value = "";
  sellerQuantityInput.value = "1";
  sellerBuyPriceInput.value = "0";
  sellerSellPriceInput.value = "0";
  sellerPlatformInput.value = "";
  sellerSupplierInput.value = "";
  sellerStatusInput.value = "in-stock";
  renderSellerView();
}

function updateInventoryQuantity(itemId, rawValue) {
  state.inventory[itemId] = clampInventoryQuantity(rawValue);
  saveInventory(state.inventory);
  renderInventoryView();
}

function removeInventoryItem(itemId) {
  delete state.inventory[itemId];
  saveInventory(state.inventory);
  renderInventoryView();
}

function clearInventoryState() {
  state.inventory = {};
  saveInventory(state.inventory);
  renderInventoryView();
}

function clearSellerRecords() {
  state.sellerRecords = [];
  saveSellerRecords(state.sellerRecords);
  renderSellerView();
}

function getInventoryEligibleItems() {
  return state.items
    .filter((item) => item.current?.supreme?.value != null)
    .sort((left, right) => left.name.localeCompare(right.name));
}

function getSellerRecords() {
  return state.sellerRecords.map((record) => ({
    ...record,
    quantity: clampInventoryQuantity(record.quantity),
    buyPrice: clampMoneyValue(record.buyPrice),
    sellPrice: clampMoneyValue(record.sellPrice),
    status: record.status === "sold" ? "sold" : "in-stock"
  }));
}

function getInventoryHoldings() {
  return Object.entries(state.inventory)
    .map(([itemId, quantity]) => {
      const item = state.items.find((entry) => entry.id === itemId);
      if (!item || item.current?.supreme?.value == null) {
        return null;
      }

      const normalizedQuantity = clampInventoryQuantity(quantity);
      return {
        item,
        quantity: normalizedQuantity,
        unitValue: item.current.supreme.value,
        stackValue: item.current.supreme.value * normalizedQuantity
      };
    })
    .filter(Boolean);
}

function getInventoryCategoryTotals(holdings) {
  const totals = new Map();
  const grandTotal = holdings.reduce((sum, entry) => sum + entry.stackValue, 0) || 1;

  for (const entry of holdings) {
    totals.set(entry.item.category, (totals.get(entry.item.category) || 0) + entry.stackValue);
  }

  return [...totals.entries()]
    .map(([category, value]) => ({
      category,
      value,
      share: Math.round((value / grandTotal) * 100)
    }))
    .sort((left, right) => right.value - left.value);
}

function buildSellerBestItems(records) {
  const soldMap = new Map();
  for (const record of records) {
    if (record.status !== "sold") {
      continue;
    }

    const previous = soldMap.get(record.item) || { quantity: 0, revenue: 0 };
    previous.quantity += record.quantity;
    previous.revenue += record.quantity * record.sellPrice;
    soldMap.set(record.item, previous);
  }

  return [...soldMap.entries()]
    .map(([item, entry]) => ({
      title: item,
      quantity: entry.quantity,
      revenue: entry.revenue,
      meta: `${plainNumber.format(entry.quantity)} sold / ${euro.format(entry.revenue)} revenue`
    }))
    .sort((left, right) => right.quantity - left.quantity || right.revenue - left.revenue)
    .slice(0, 6);
}

function buildSellerMonthlyRevenue(records) {
  const byMonth = new Map();
  for (const record of records) {
    if (record.status !== "sold" || !record.soldAt) {
      continue;
    }

    const date = new Date(record.soldAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = new Intl.DateTimeFormat("en-IE", { month: "short", year: "numeric" }).format(date);
    const previous = byMonth.get(key) || { label, value: 0, quantity: 0 };
    previous.value += record.quantity * record.sellPrice;
    previous.quantity += record.quantity;
    byMonth.set(key, previous);
  }

  return [...byMonth.entries()]
    .sort((left, right) => right[0].localeCompare(left[0]))
    .map(([, value]) => value)
    .slice(0, 6);
}

function updateSellerRecordStatus(recordId, status) {
  state.sellerRecords = state.sellerRecords.map((record) => {
    if (record.id !== recordId) {
      return record;
    }

    const nextStatus = status === "sold" ? "sold" : "in-stock";
    return {
      ...record,
      status: nextStatus,
      soldAt: nextStatus === "sold" ? (record.soldAt || new Date().toISOString()) : null
    };
  });
  saveSellerRecords(state.sellerRecords);
  renderSellerView();
}

function removeSellerRecord(recordId) {
  state.sellerRecords = state.sellerRecords.filter((record) => record.id !== recordId);
  saveSellerRecords(state.sellerRecords);
  renderSellerView();
}

function buildInventoryTimeline(holdings) {
  if (!holdings.length) {
    return [];
  }

  const timestamps = new Set();
  const histories = holdings.map((entry) => ({
    quantity: entry.quantity,
    points: Array.isArray(entry.item.history)
      ? entry.item.history
          .filter((point) => point.supremeValue != null && point.timestamp)
          .map((point) => ({
            timestamp: point.timestamp,
            value: point.supremeValue
          }))
          .sort((left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime())
      : []
  })).filter((entry) => entry.points.length);

  for (const entry of histories) {
    for (const point of entry.points) {
      timestamps.add(point.timestamp);
    }
  }

  const ordered = [...timestamps].sort((left, right) => new Date(left).getTime() - new Date(right).getTime());
  if (!ordered.length) {
    return [];
  }

  return ordered
    .map((timestamp) => {
      let total = 0;
      for (const entry of histories) {
        const point = getPointAtOrBefore(entry.points, timestamp);
        if (point) {
          total += point.value * entry.quantity;
        }
      }
      return { timestamp, value: total };
    })
    .filter((point) => point.value > 0);
}

function getPointAtOrBefore(points, timestamp) {
  const target = new Date(timestamp).getTime();
  let match = null;
  for (const point of points) {
    if (new Date(point.timestamp).getTime() <= target) {
      match = point;
    } else {
      break;
    }
  }
  return match;
}

function clampInventoryQuantity(rawValue) {
  const parsed = Number.parseInt(rawValue, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function clampMoneyValue(rawValue) {
  const parsed = Number.parseFloat(rawValue);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function loadInventory() {
  try {
    const raw = window.localStorage.getItem("godly-tracker-inventory");
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([, quantity]) => Number.isFinite(Number(quantity)) && Number(quantity) > 0)
        .map(([itemId, quantity]) => [itemId, clampInventoryQuantity(quantity)])
    );
  } catch (_error) {
    return {};
  }
}

function saveInventory(inventory) {
  window.localStorage.setItem("godly-tracker-inventory", JSON.stringify(inventory));
}

function loadSellerRecords() {
  try {
    const raw = window.localStorage.getItem("godly-tracker-seller-records");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function saveSellerRecords(records) {
  window.localStorage.setItem("godly-tracker-seller-records", JSON.stringify(records));
}

function createClientId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

function createSvgElement(tagName, attributes, textContent = "") {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tagName);
  for (const [name, value] of Object.entries(attributes)) {
    node.setAttribute(name, String(value));
  }
  if (textContent) {
    node.textContent = textContent;
  }
  return node;
}

function renderTradeSlots(side, container) {
  container.innerHTML = "";

  state.trade[side].forEach((slot, index) => {
    container.appendChild(buildTradeSlot(side, index, slot));
  });
}

function buildTradeSlot(side, index, slotState) {
  const item = state.items.find((entry) => entry.id === slotState.itemId) || null;
  const slot = document.createElement("article");
  slot.className = "trade-slot";

  const visual = document.createElement("div");
  visual.className = "trade-slot-visual";
  if (item?.imageUrl) {
    const img = document.createElement("img");
    img.className = "trade-slot-image";
    img.src = item.imageUrl;
    img.alt = `${item.name} image`;
    img.dataset.fit = item.imageFit || "contain";
    visual.appendChild(img);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "trade-slot-placeholder";
    placeholder.textContent = item ? item.name : "+";
    visual.appendChild(placeholder);
  }

  const head = document.createElement("div");
  head.className = "trade-slot-head";

  const title = document.createElement("strong");
  title.textContent = item ? item.name : `Slot ${index + 1}`;
  head.appendChild(title);

  if (item) {
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "trade-slot-remove";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => updateTradeSlot(side, index, null));
    head.appendChild(removeButton);
  }

  const input = document.createElement("input");
  input.type = "text";
  input.className = "trade-slot-input";
  input.setAttribute("list", "tradeItemOptions");
  input.placeholder = "Search an item name";
  input.value = item ? item.name : "";
  input.addEventListener("change", (event) => applyTradeInput(side, index, event.target.value));
  input.addEventListener("blur", (event) => {
    applyTradeInput(side, index, event.target.value);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyTradeInput(side, index, event.target.value);
    }
  });

  slot.appendChild(visual);
  slot.appendChild(head);
  slot.appendChild(input);

  if (item) {
    const quantityRow = document.createElement("div");
    quantityRow.className = "trade-quantity-row";

    const quantityLabel = document.createElement("label");
    quantityLabel.className = "trade-quantity-label";
    quantityLabel.textContent = "Quantity";

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.className = "trade-quantity-input";
    quantityInput.min = "1";
    quantityInput.max = "999";
    quantityInput.step = "1";
    quantityInput.value = String(slotState.quantity || 1);
    quantityInput.addEventListener("change", (event) => updateTradeQuantity(side, index, event.target.value));
    quantityInput.addEventListener("blur", (event) => updateTradeQuantity(side, index, event.target.value));

    quantityRow.appendChild(quantityLabel);
    quantityRow.appendChild(quantityInput);
    slot.appendChild(quantityRow);

    const meta = document.createElement("div");
    meta.className = "trade-slot-meta";

    const value = document.createElement("span");
    value.textContent = `Supreme ${plainNumber.format(item.current?.supreme?.value ?? 0)} each`;
    meta.appendChild(value);

    const note = document.createElement("span");
    const totalValue = (item.current?.supreme?.value || 0) * (slotState.quantity || 1);
    note.textContent = `Stack total ${plainNumber.format(totalValue)}`;
    meta.appendChild(note);

    slot.appendChild(meta);
  } else {
    const hint = document.createElement("p");
    hint.className = "trade-slot-hint";
    hint.textContent = "Pick one tracked item for this slot.";
    slot.appendChild(hint);
  }

  return slot;
}

function applyTradeInput(side, index, rawValue) {
  const value = rawValue.trim().toLowerCase();
  if (!value) {
    updateTradeSlot(side, index, null);
    return;
  }

  const match = getTradeEligibleItems().find((item) => item.name.toLowerCase() === value);
  updateTradeSlot(side, index, match ? match.id : null);
}

function updateTradeSlot(side, index, itemId) {
  const next = [...state.trade[side]];
  next[index] = {
    itemId,
    quantity: itemId ? Math.max(1, Number(next[index]?.quantity || 1)) : 1
  };
  state.trade[side] = next;
  renderTradeChecker();
}

function updateTradeQuantity(side, index, rawValue) {
  const next = [...state.trade[side]];
  const current = next[index];
  if (!current?.itemId) {
    return;
  }

  const parsed = Number.parseInt(rawValue, 10);
  current.quantity = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  next[index] = current;
  state.trade[side] = next;
  renderTradeChecker();
}

function clearTradeState() {
  state.trade.have = createTradeSlots();
  state.trade.want = createTradeSlots();
  renderTradeChecker();
}

function getTradeEligibleItems() {
  return state.items
    .filter((item) => item.current?.supreme?.value != null)
    .sort((left, right) => left.name.localeCompare(right.name));
}

function renderTradeSummary() {
  const haveTotal = getTradeSideTotal("have");
  const wantTotal = getTradeSideTotal("want");
  const diff = wantTotal - haveTotal;

  tradeHaveTotal.textContent = plainNumber.format(haveTotal);
  tradeWantTotal.textContent = plainNumber.format(wantTotal);
  tradeSummaryHave.textContent = plainNumber.format(haveTotal);
  tradeSummaryWant.textContent = plainNumber.format(wantTotal);
  tradeSummaryDiff.textContent = `${diff > 0 ? "+" : ""}${plainNumber.format(diff)}`;

  const hasHave = state.trade.have.some((slot) => Boolean(slot?.itemId));
  const hasWant = state.trade.want.some((slot) => Boolean(slot?.itemId));

  tradeVerdict.className = "trade-verdict is-neutral";
  if (!hasHave || !hasWant) {
    tradeVerdict.textContent = "Add items on both sides to compare the trade.";
    return;
  }

  if (diff === 0) {
    tradeVerdict.classList.add("is-even");
    tradeVerdict.textContent = "Even trade by tracked Supreme value.";
    return;
  }

  if (diff > 0) {
    tradeVerdict.classList.add("is-win");
    tradeVerdict.textContent = `You are gaining ${plainNumber.format(diff)} in tracked value if the offered side is accurate.`;
    return;
  }

  tradeVerdict.classList.add("is-loss");
  tradeVerdict.textContent = `You are losing ${plainNumber.format(Math.abs(diff))} in tracked value on this trade.`;
}

function getTradeSideTotal(side) {
  return state.trade[side]
    .map((slot) => ({
      slot,
      item: state.items.find((item) => item.id === slot?.itemId)
    }))
    .filter((entry) => entry.item)
    .reduce((total, entry) => total + (entry.item.current?.supreme?.value || 0) * (entry.slot.quantity || 1), 0);
}

function createTradeSlots() {
  return Array.from({ length: 4 }, () => ({ itemId: null, quantity: 1 }));
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

function formatShortDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "short"
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
