(() => {
  "use strict";

  const DATA = window.DIALYSIS_TRANSIT_SAMPLE_DATA;
  if (!DATA) {
    throw new Error("The bundled demonstration dataset could not be loaded.");
  }

  const MAP_STORAGE_KEY = "dialysisTransitGoogleMaps";
  const MAP_CALLBACK = "__dialysisTransitGoogleMapsReady";
  const NATIONAL_VIEW = {
    center: { lat: 39.5, lng: -98.35 },
    name: "Current map viewport",
    zoom: 4,
  };
  const NATIONAL_BOUNDS = {
    east: -66,
    north: 50,
    south: 24,
    west: -125,
  };
  const STATE_VIEWS = {
    AZ: {
      center: { lat: 34.2744, lng: -111.6602 },
      name: "Arizona",
      zoom: 6,
    },
    CA: {
      center: { lat: 37.1841, lng: -119.4696 },
      name: "California",
      zoom: 6,
    },
    CO: {
      center: { lat: 38.9972, lng: -105.5478 },
      name: "Colorado",
      zoom: 7,
    },
    FL: {
      center: { lat: 28.6305, lng: -82.4497 },
      name: "Florida",
      zoom: 6,
    },
    IL: {
      center: { lat: 40.0417, lng: -89.1965 },
      name: "Illinois",
      zoom: 7,
    },
    NY: {
      center: { lat: 42.9538, lng: -75.5268 },
      name: "New York",
      zoom: 7,
    },
    TX: {
      center: { lat: 31.2639, lng: -98.5456 },
      name: "Texas",
      zoom: 6,
    },
  };
  const MATCHED_GEOCODES = new Set([
    "exact",
    "non_exact",
    "manual_override",
  ]);
  const DISTANCE_BINS = [
    { key: "0-250", label: "0–250 m", test: (distance) => distance <= 250 },
    {
      key: "251-400",
      label: "251–400 m",
      test: (distance) => distance > 250 && distance <= 400,
    },
    {
      key: "401-800",
      label: "401–800 m",
      test: (distance) => distance > 400 && distance <= 800,
    },
    {
      key: "801-1600",
      label: "801–1,600 m",
      test: (distance) => distance > 800 && distance <= 1600,
    },
    {
      key: "over-1600",
      label: "More than 1,600 m",
      test: (distance) => distance > 1600,
    },
  ];

  const state = {
    center: { ...NATIONAL_VIEW.center },
    extentBounds: { ...NATIONAL_BOUNDS },
    filters: {
      agency: "",
      chain: "",
      chainOwned: "",
      geocode: "matched",
      inCenter: true,
      lateShift: "",
      ownership: "",
      stationsMax: "",
      stationsMin: "",
      stopType: "",
      wheelchair: "",
    },
    layers: {
      facility: true,
      transit: true,
    },
    radius: 400,
    selectedFacility: null,
    selectedState: "",
    selectedStop: null,
    selectionLayers: {
      circle: false,
      line: false,
    },
    sort: {
      direction: "desc",
      key: "nearestDistance",
    },
    zoom: NATIONAL_VIEW.zoom,
  };

  let googleMap = null;
  let geocoder = null;
  let autocomplete = null;
  let AdvancedMarkerElement = null;
  let mapMarkers = [];
  let thresholdCircle = null;
  let nearestLine = null;
  let pendingCredentials = null;
  let lastResults = {
    facilities: [],
    metrics: [],
    stops: [],
  };
  let mapIdleTimer = null;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const elements = {
    analyticsExcluded: $("#analytics-excluded"),
    analyticsExtentTitle: $("#analytics-extent-title"),
    customRadius: $("#custom-radius"),
    detailCircleButton: $("#detail-toggle-circle"),
    detailLineButton: $("#detail-toggle-line"),
    distanceDistribution: $("#distance-distribution"),
    extentDescription: $("#extent-description"),
    facilityCards: $("#facility-cards"),
    facilityDetail: $("#facility-detail"),
    facilityDetailAddress: $("#facility-detail-address"),
    facilityDetailContent: $("#facility-detail-content"),
    facilityDetailTitle: $("#facility-detail-title"),
    facilityFilterCount: $("#facility-filter-count"),
    facilityTableBody: $("#facility-table-body"),
    forgetMapKey: $("#forget-map-key"),
    layerAnnouncement: $("#layer-announcement"),
    layerCount: $("#layer-count"),
    mapApiKey: $("#map-api-key"),
    mapConnect: $("#map-connect"),
    mapConnectionStatus: $("#map-connection-status"),
    mapConnectionText: $("#map-connection-text"),
    mapId: $("#map-id"),
    mapLoading: $("#map-loading"),
    mapSetupBackdrop: $("#map-setup-backdrop"),
    mapSetupStatus: $("#map-setup-status"),
    mapStateReadout: $("#map-state-readout"),
    noticeBar: $("#notice-bar"),
    noticeText: $("#notice-text"),
    panelClose: $("#panel-close"),
    panelOpen: $("#panel-open"),
    radiusReadout: $("#radius-readout"),
    regionReadout: $("#region-readout"),
    resultCount: $("#result-count"),
    stateSelect: $("#state-select"),
    stopDetail: $("#stop-detail"),
    stopDetailContent: $("#stop-detail-content"),
    stopDetailTitle: $("#stop-detail-title"),
    workspace: $("#workspace"),
  };

  function radians(value) {
    return (value * Math.PI) / 180;
  }

  function distanceMeters(first, second) {
    const earthRadius = 6371008.8;
    const latitudeDelta = radians(second.lat - first.lat);
    const longitudeDelta = radians(second.lng - first.lng);
    const firstLatitude = radians(first.lat);
    const secondLatitude = radians(second.lat);
    const a =
      Math.sin(latitudeDelta / 2) ** 2 +
      Math.cos(firstLatitude) *
        Math.cos(secondLatitude) *
        Math.sin(longitudeDelta / 2) ** 2;
    return 2 * earthRadius * Math.asin(Math.sqrt(a));
  }

  function formatDistance(value, includeMetricTitle = false) {
    if (!Number.isFinite(value)) return "Not calculated";
    const roundedMeters = Math.round(value);
    const label =
      roundedMeters < 1000
        ? `${roundedMeters.toLocaleString()} m`
        : `${(value / 1609.344).toFixed(2)} mi`;
    return includeMetricTitle
      ? `<span title="${roundedMeters.toLocaleString()} meters">${label}</span>`
      : label;
  }

  function percentile(values, percentileValue) {
    if (!values.length) return null;
    const sorted = [...values].sort((first, second) => first - second);
    const position = (sorted.length - 1) * percentileValue;
    const lowerIndex = Math.floor(position);
    const upperIndex = Math.ceil(position);
    if (lowerIndex === upperIndex) return sorted[lowerIndex];
    const weight = position - lowerIndex;
    return (
      sorted[lowerIndex] * (1 - weight) + sorted[upperIndex] * weight
    );
  }

  function pointInBounds(point, bounds) {
    if (!point || !bounds) return true;
    const longitudeInBounds =
      bounds.west <= bounds.east
        ? point.lng >= bounds.west && point.lng <= bounds.east
        : point.lng >= bounds.west || point.lng <= bounds.east;
    return (
      longitudeInBounds &&
      point.lat >= bounds.south &&
      point.lat <= bounds.north
    );
  }

  function matchesExtent(record) {
    if (state.selectedState) return record.state === state.selectedState;
    if (!Number.isFinite(record.lat) || !Number.isFinite(record.lng)) {
      return true;
    }
    return pointInBounds(record, state.extentBounds);
  }

  function matchesFacilityFilters(facility, includeGeocode = true) {
    const filters = state.filters;
    if (!matchesExtent(facility)) return false;
    if (filters.inCenter && !facility.inCenterHd) return false;
    if (filters.ownership && facility.ownership !== filters.ownership) {
      return false;
    }
    if (filters.chainOwned && facility.chainOwned !== filters.chainOwned) {
      return false;
    }
    if (filters.chain && facility.chain !== filters.chain) return false;
    if (filters.lateShift && facility.lateShift !== filters.lateShift) {
      return false;
    }
    if (
      filters.stationsMin !== "" &&
      facility.stations < Number(filters.stationsMin)
    ) {
      return false;
    }
    if (
      filters.stationsMax !== "" &&
      facility.stations > Number(filters.stationsMax)
    ) {
      return false;
    }
    if (!includeGeocode) return true;

    if (
      filters.geocode === "matched" &&
      !MATCHED_GEOCODES.has(facility.geocodeStatus)
    ) {
      return false;
    }
    if (
      filters.geocode === "unresolved" &&
      MATCHED_GEOCODES.has(facility.geocodeStatus)
    ) {
      return false;
    }
    if (
      filters.geocode &&
      !["matched", "unresolved"].includes(filters.geocode) &&
      facility.geocodeStatus !== filters.geocode
    ) {
      return false;
    }
    return true;
  }

  function matchesStopFilters(stop) {
    const filters = state.filters;
    if (!matchesExtent(stop)) return false;
    if (filters.stopType && stop.type !== filters.stopType) return false;
    if (filters.wheelchair && stop.wheelchair !== filters.wheelchair) {
      return false;
    }
    if (filters.agency && stop.agency !== filters.agency) return false;
    return true;
  }

  function enrichFacilities(facilities, stops) {
    return facilities.map((facility) => {
      if (!Number.isFinite(facility.lat) || !Number.isFinite(facility.lng)) {
        return {
          ...facility,
          nearestDistance: null,
          nearestStop: null,
          stopCount: null,
        };
      }

      const orderedStops = stops
        .map((stop) => ({
          distance: distanceMeters(facility, stop),
          stop,
        }))
        .sort((first, second) => first.distance - second.distance);

      return {
        ...facility,
        nearestDistance: orderedStops[0]?.distance ?? null,
        nearestStop: orderedStops[0]?.stop ?? null,
        stopCount: orderedStops.filter(
          (candidate) => candidate.distance <= state.radius,
        ).length,
      };
    });
  }

  function compareValues(first, second, key) {
    const firstValue =
      key === "location"
        ? `${first.city}, ${first.state}`
        : first[key];
    const secondValue =
      key === "location"
        ? `${second.city}, ${second.state}`
        : second[key];

    if (firstValue === null || firstValue === undefined) return 1;
    if (secondValue === null || secondValue === undefined) return -1;
    if (typeof firstValue === "number" && typeof secondValue === "number") {
      return firstValue - secondValue;
    }
    return String(firstValue).localeCompare(String(secondValue));
  }

  function sortFacilities(facilities) {
    const multiplier = state.sort.direction === "asc" ? 1 : -1;
    return [...facilities].sort((first, second) => {
      const firstValue = first[state.sort.key];
      const secondValue = second[state.sort.key];
      if (
        state.sort.key === "nearestDistance" &&
        (firstValue === null || secondValue === null)
      ) {
        if (firstValue === null && secondValue === null) return 0;
        return firstValue === null ? 1 : -1;
      }
      return compareValues(first, second, state.sort.key) * multiplier;
    });
  }

  function calculateResults() {
    const facilities = DATA.facilities.filter((facility) =>
      matchesFacilityFilters(facility),
    );
    const stops = DATA.stops.filter(matchesStopFilters);
    const metrics = sortFacilities(enrichFacilities(facilities, stops));
    const unresolvedInPopulation = DATA.facilities.filter(
      (facility) =>
        matchesFacilityFilters(facility, false) &&
        !MATCHED_GEOCODES.has(facility.geocodeStatus),
    ).length;
    lastResults = {
      facilities,
      metrics,
      stops,
      unresolvedInPopulation,
    };
    return lastResults;
  }

  function currentExtentLabel() {
    return state.selectedState
      ? `${STATE_VIEWS[state.selectedState].name} selected-state extent`
      : "Current map viewport";
  }

  function showNotice(message) {
    elements.noticeText.textContent = message;
    elements.noticeBar.hidden = false;
  }

  function setActiveTab(tabName, focus = false) {
    $$("[role='tab']").forEach((tab) => {
      const isActive = tab.dataset.tab === tabName;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      if (isActive && focus) tab.focus();
    });
    $$("[role='tabpanel']").forEach((panel) => {
      panel.hidden = panel.id !== `panel-${tabName}`;
    });
  }

  function updateLayerState() {
    const activeLayers = Object.entries(state.layers)
      .filter(([, active]) => active)
      .map(([layer]) => layer);
    elements.layerCount.textContent = `${activeLayers.length} selected`;
    elements.layerAnnouncement.textContent =
      `Dialysis layer ${state.layers.facility ? "on" : "off"}. ` +
      `Transit layer ${state.layers.transit ? "on" : "off"}. ` +
      `Threshold ${state.radius} meters.`;
    renderMapOverlays();
  }

  function updateMapReadout() {
    elements.mapStateReadout.textContent =
      `${formatDistance(state.radius)} threshold · zoom ${Math.round(state.zoom)}`;
  }

  function updateRadius(nextRadius) {
    if (!Number.isFinite(nextRadius) || nextRadius < 100 || nextRadius > 5000) {
      showNotice("Custom radius must be between 100 and 5,000 meters.");
      elements.customRadius.focus();
      return false;
    }

    state.radius = Math.round(nextRadius);
    elements.radiusReadout.textContent = formatDistance(state.radius);
    $$("[data-radius]").forEach((button) => {
      const selected = Number(button.dataset.radius) === state.radius;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    elements.customRadius.value = $$("[data-radius]").some(
      (button) => Number(button.dataset.radius) === state.radius,
    )
      ? ""
      : String(state.radius);
    updateMapReadout();
    renderAll();
    updateSelectionOverlays();
    updateUrl();
    return true;
  }

  function applySelectedState(stateCode, moveMap = true) {
    state.selectedState = stateCode;
    elements.stateSelect.value = stateCode;
    const view = STATE_VIEWS[stateCode] || NATIONAL_VIEW;
    elements.regionReadout.textContent = view.name;
    elements.extentDescription.textContent = stateCode
      ? `${view.name} selected-state extent`
      : "Current map viewport—not an administrative-area statistic";

    if (moveMap) {
      state.center = { ...view.center };
      state.zoom = view.zoom;
      if (googleMap) {
        googleMap.setCenter(view.center);
        googleMap.setZoom(view.zoom);
      }
    }
    updateMapReadout();
    renderAll();
    updateUrl();
  }

  function updateFilterState() {
    state.filters = {
      agency: $("#filter-agency").value,
      chain: $("#filter-chain").value,
      chainOwned: $("#filter-chain-owned").value,
      geocode: $("#filter-geocode").value,
      inCenter: $("#filter-in-center").checked,
      lateShift: $("#filter-late-shift").value,
      ownership: $("#filter-ownership").value,
      stationsMax: $("#filter-stations-max").value,
      stationsMin: $("#filter-stations-min").value,
      stopType: $("#filter-stop-type").value,
      wheelchair: $("#filter-wheelchair").value,
    };
    renderAll();
    updateUrl();
  }

  function populateFilterOptions() {
    const optionTargets = [
      {
        element: $("#filter-chain"),
        values: DATA.facilities.map((facility) => facility.chain),
      },
      {
        element: $("#filter-stop-type"),
        values: DATA.stops.map((stop) => stop.type),
      },
      {
        element: $("#filter-agency"),
        values: DATA.stops.map((stop) => stop.agency),
      },
    ];
    optionTargets.forEach(({ element, values }) => {
      [...new Set(values)]
        .sort((first, second) => first.localeCompare(second))
        .forEach((value) => {
          const option = document.createElement("option");
          option.value = value;
          option.textContent = value;
          element.append(option);
        });
    });
  }

  function setMetric(id, value) {
    $(`#${id}`).textContent = value;
  }

  function renderDistribution(metrics) {
    const counts = Object.fromEntries(
      DISTANCE_BINS.map((bin) => [bin.key, 0]),
    );
    let unresolvedCount = 0;
    metrics.forEach((facility) => {
      if (!Number.isFinite(facility.nearestDistance)) {
        unresolvedCount += 1;
        return;
      }
      const bin = DISTANCE_BINS.find((candidate) =>
        candidate.test(facility.nearestDistance),
      );
      if (bin) counts[bin.key] += 1;
    });

    const rows = [
      ...DISTANCE_BINS.map((bin) => ({
        count: counts[bin.key],
        label: bin.label,
      })),
      { count: unresolvedCount, label: "No valid geocode" },
    ];
    const maximum = Math.max(1, ...rows.map((row) => row.count));
    elements.distanceDistribution.innerHTML = rows
      .map(
        (row) => `
          <div class="distribution-row">
            <span>${row.label}</span>
            <div class="distribution-track" aria-hidden="true">
              <i style="width: ${(row.count / maximum) * 100}%"></i>
            </div>
            <strong>${row.count}</strong>
          </div>
        `,
      )
      .join("");
    elements.distanceDistribution.setAttribute(
      "aria-label",
      rows.map((row) => `${row.label}: ${row.count}`).join(". "),
    );
  }

  function renderTable(metrics) {
    elements.facilityTableBody.innerHTML = metrics
      .map(
        (facility) => `
          <tr>
            <td>
              <button class="table-facility" data-facility="${facility.ccn}" type="button">
                <strong>${escapeHtml(facility.name)}</strong>
                <small>CCN ${facility.ccn}</small>
              </button>
            </td>
            <td>${escapeHtml(facility.city)}, ${facility.state}</td>
            <td>
              ${escapeHtml(facility.ownership)}
              <small>${escapeHtml(facility.chain)}</small>
            </td>
            <td>${facility.stations}</td>
            <td>
              ${formatDistance(facility.nearestDistance, true)}
              <small>${escapeHtml(facility.nearestStop?.name || "No valid geocode")}</small>
            </td>
            <td>${facility.stopCount ?? "—"}</td>
          </tr>
        `,
      )
      .join("");

    elements.facilityCards.innerHTML = metrics
      .map(
        (facility) => `
          <article>
            <button data-facility="${facility.ccn}" type="button">
              <strong>${escapeHtml(facility.name)}</strong>
              <span>${escapeHtml(facility.city)}, ${facility.state}</span>
            </button>
            <dl>
              <div><dt>Nearest stop</dt><dd>${formatDistance(facility.nearestDistance)}</dd></div>
              <div><dt>Stops in radius</dt><dd>${facility.stopCount ?? "—"}</dd></div>
              <div><dt>Stations</dt><dd>${facility.stations}</dd></div>
            </dl>
          </article>
        `,
      )
      .join("");

    $$("[data-facility]").forEach((button) => {
      button.addEventListener("click", () =>
        selectFacility(button.dataset.facility),
      );
    });

    $$("th").forEach((header) => header.removeAttribute("aria-sort"));
    const activeSortButton = $(`[data-sort="${state.sort.key}"]`);
    if (activeSortButton) {
      activeSortButton.closest("th").setAttribute(
        "aria-sort",
        state.sort.direction === "asc" ? "ascending" : "descending",
      );
    }
  }

  function renderAnalytics(results) {
    const validDistances = results.metrics
      .map((facility) => facility.nearestDistance)
      .filter(Number.isFinite);
    const facilitiesWithin = results.metrics.filter(
      (facility) =>
        Number.isFinite(facility.nearestDistance) &&
        facility.nearestDistance <= state.radius,
    ).length;
    const percentage = validDistances.length
      ? (facilitiesWithin / validDistances.length) * 100
      : 0;
    const lowerQuartile = percentile(validDistances, 0.25);
    const median = percentile(validDistances, 0.5);
    const upperQuartile = percentile(validDistances, 0.75);

    elements.analyticsExtentTitle.textContent = currentExtentLabel();
    setMetric("metric-facilities", String(results.metrics.length));
    setMetric("metric-within", String(facilitiesWithin));
    setMetric("metric-percentage", `${percentage.toFixed(1)}%`);
    setMetric("metric-median", formatDistance(median));
    setMetric(
      "metric-quartiles",
      lowerQuartile === null
        ? "—"
        : `${formatDistance(lowerQuartile)} / ${formatDistance(upperQuartile)}`,
    );
    setMetric("metric-stops", String(results.stops.length));
    elements.analyticsExcluded.textContent =
      `${results.unresolvedInPopulation} unresolved geocode` +
      `${results.unresolvedInPopulation === 1 ? "" : "s"} excluded from spatial analytics.`;
    elements.resultCount.textContent =
      `${results.metrics.length} row${results.metrics.length === 1 ? "" : "s"}`;
    elements.facilityFilterCount.textContent =
      `${results.metrics.length} of ${DATA.facilities.length} records shown`;
    renderDistribution(results.metrics);
    renderTable(results.metrics);
  }

  function renderAll() {
    const results = calculateResults();
    renderAnalytics(results);
    renderMapOverlays();
    if (
      state.selectedFacility &&
      !results.metrics.some(
        (facility) => facility.ccn === state.selectedFacility.ccn,
      )
    ) {
      closeFacilityDetail();
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function detailRow(label, value) {
    return `
      <div>
        <dt>${escapeHtml(label)}</dt>
        <dd>${value || "—"}</dd>
      </div>
    `;
  }

  function selectFacility(ccn, focusDrawer = true) {
    const facility =
      lastResults.metrics.find((candidate) => candidate.ccn === ccn) ||
      enrichFacilities(
        DATA.facilities.filter((candidate) => candidate.ccn === ccn),
        lastResults.stops,
      )[0];
    if (!facility) return;

    state.selectedFacility = facility;
    state.selectedStop = null;
    elements.stopDetail.hidden = true;
    elements.facilityDetailTitle.textContent = facility.name;
    elements.facilityDetailAddress.textContent =
      `${facility.address}, ${facility.city}, ${facility.state} ${facility.zip}`;
    const modalities = [
      facility.inCenterHd ? "In-center HD" : null,
      facility.peritonealDialysis ? "Peritoneal dialysis" : null,
      facility.homeHdTraining ? "Home HD training" : null,
    ]
      .filter(Boolean)
      .join(", ");
    const nearestStop = facility.nearestStop;
    elements.facilityDetailContent.innerHTML = `
      <dl class="detail-grid">
        ${detailRow("CMS CCN", escapeHtml(facility.ccn))}
        ${detailRow("Telephone", escapeHtml(facility.telephone))}
        ${detailRow("Ownership", escapeHtml(facility.ownership))}
        ${detailRow("Chain", `${escapeHtml(facility.chain)} · ${facility.chainOwned === "Yes" ? "chain owned" : "not chain owned"}`)}
        ${detailRow("Stations", String(facility.stations))}
        ${detailRow("Modalities", escapeHtml(modalities))}
        ${detailRow("Late shift", escapeHtml(facility.lateShift))}
        ${detailRow("Geocoding", escapeHtml(facility.geocodeStatus.replaceAll("_", " ")))}
        ${detailRow("Matched address", escapeHtml(facility.matchedAddress || "Unresolved"))}
        ${detailRow("Coordinate source", escapeHtml(facility.geocodeSource))}
        ${detailRow("Nearest stop", escapeHtml(nearestStop?.name || "Not calculated"))}
        ${detailRow("Stop type / agency", nearestStop ? `${escapeHtml(nearestStop.type)} · ${escapeHtml(nearestStop.agency)}` : "—")}
        ${detailRow("Wheelchair field", escapeHtml(nearestStop?.wheelchair || "—"))}
        ${detailRow("Nearest distance", formatDistance(facility.nearestDistance, true))}
        ${detailRow("Stops in threshold", facility.stopCount === null ? "Not calculated" : String(facility.stopCount))}
        ${detailRow("Fixture snapshot", escapeHtml(facility.snapshotDate))}
      </dl>
    `;
    elements.facilityDetail.hidden = false;
    $$("[data-selection-layer]").forEach((toggle) => {
      toggle.disabled = !Number.isFinite(facility.lat);
    });
    updateSelectionButtons();
    updateSelectionOverlays();
    renderMapOverlays();
    if (googleMap && Number.isFinite(facility.lat)) {
      googleMap.panTo({ lat: facility.lat, lng: facility.lng });
      if (googleMap.getZoom() < 9) googleMap.setZoom(11);
    }
    if (focusDrawer) elements.facilityDetailTitle.focus?.();
  }

  function closeFacilityDetail() {
    state.selectedFacility = null;
    state.selectionLayers.circle = false;
    state.selectionLayers.line = false;
    elements.facilityDetail.hidden = true;
    $$("[data-selection-layer]").forEach((toggle) => {
      toggle.checked = false;
      toggle.disabled = true;
    });
    clearSelectionOverlays();
    renderMapOverlays();
  }

  function selectStop(stopId) {
    const stop = DATA.stops.find((candidate) => candidate.id === stopId);
    if (!stop) return;
    state.selectedStop = stop;
    elements.stopDetailTitle.textContent = stop.name;
    elements.stopDetailContent.innerHTML = `
      <dl class="detail-grid">
        ${detailRow("Source object ID", String(stop.sourceObjectId))}
        ${detailRow("Stop ID", escapeHtml(stop.stopId))}
        ${detailRow("Type", escapeHtml(stop.type))}
        ${detailRow("Agency", escapeHtml(stop.agency))}
        ${detailRow("NTD ID", escapeHtml(stop.ntdId))}
        ${detailRow("Wheelchair field", escapeHtml(stop.wheelchair))}
        ${detailRow("Fixture snapshot", escapeHtml(stop.snapshotDate))}
      </dl>
    `;
    elements.stopDetail.hidden = false;
    if (googleMap) {
      googleMap.panTo({ lat: stop.lat, lng: stop.lng });
      if (googleMap.getZoom() < 11) googleMap.setZoom(13);
    }
  }

  function updateSelectionButtons() {
    elements.detailLineButton.textContent = state.selectionLayers.line
      ? "Hide nearest-stop line"
      : "Show nearest-stop line";
    elements.detailCircleButton.textContent = state.selectionLayers.circle
      ? "Hide threshold circle"
      : "Show threshold circle";
    $('[data-selection-layer="line"]').checked =
      state.selectionLayers.line;
    $('[data-selection-layer="circle"]').checked =
      state.selectionLayers.circle;
  }

  function toggleSelectionLayer(layer) {
    if (!state.selectedFacility) {
      showNotice("Select a geocoded facility before showing detail layers.");
      return;
    }
    state.selectionLayers[layer] = !state.selectionLayers[layer];
    updateSelectionButtons();
    updateSelectionOverlays();
  }

  function clearSelectionOverlays() {
    if (thresholdCircle) {
      thresholdCircle.setMap(null);
      thresholdCircle = null;
    }
    if (nearestLine) {
      nearestLine.setMap(null);
      nearestLine = null;
    }
  }

  function updateSelectionOverlays() {
    clearSelectionOverlays();
    const facility = state.selectedFacility;
    if (
      !googleMap ||
      !facility ||
      !Number.isFinite(facility.lat) ||
      !Number.isFinite(facility.lng)
    ) {
      return;
    }
    if (state.selectionLayers.circle) {
      thresholdCircle = new window.google.maps.Circle({
        center: { lat: facility.lat, lng: facility.lng },
        fillColor: "#d66b3d",
        fillOpacity: 0.12,
        map: googleMap,
        radius: state.radius,
        strokeColor: "#a84526",
        strokeOpacity: 0.8,
        strokeWeight: 2,
      });
    }
    if (state.selectionLayers.line && facility.nearestStop) {
      nearestLine = new window.google.maps.Polyline({
        geodesic: true,
        map: googleMap,
        path: [
          { lat: facility.lat, lng: facility.lng },
          {
            lat: facility.nearestStop.lat,
            lng: facility.nearestStop.lng,
          },
        ],
        strokeColor: "#0b5955",
        strokeOpacity: 0.9,
        strokeWeight: 3,
      });
    }
  }

  function clearMapMarkers() {
    mapMarkers.forEach((marker) => {
      marker.map = null;
    });
    mapMarkers = [];
  }

  function markerContent(kind, label, selected = false, cluster = false) {
    const content = document.createElement("div");
    content.className =
      `map-marker map-marker--${kind}` +
      `${selected ? " is-selected" : ""}` +
      `${cluster ? " is-cluster" : ""}`;
    content.textContent = label;
    return content;
  }

  function addMapMarker({
    cluster = false,
    kind,
    label,
    onClick,
    position,
    selected = false,
    title,
  }) {
    if (!googleMap || !AdvancedMarkerElement) return;
    const content = markerContent(kind, label, selected, cluster);
    content.addEventListener("click", (event) => {
      event.stopPropagation();
      onClick();
    });
    const marker = new AdvancedMarkerElement({
      content,
      gmpClickable: true,
      map: googleMap,
      position,
      title,
    });
    marker.addListener("gmp-click", onClick);
    mapMarkers.push(marker);
  }

  function groupByState(records) {
    const groups = new Map();
    records.forEach((record) => {
      if (!Number.isFinite(record.lat) || !Number.isFinite(record.lng)) return;
      const group = groups.get(record.state) || [];
      group.push(record);
      groups.set(record.state, group);
    });
    return groups;
  }

  function clusterPosition(records) {
    return {
      lat:
        records.reduce((total, record) => total + record.lat, 0) /
        records.length,
      lng:
        records.reduce((total, record) => total + record.lng, 0) /
        records.length,
    };
  }

  function renderMapOverlays() {
    if (!googleMap || !AdvancedMarkerElement) return;
    clearMapMarkers();
    const results = lastResults.metrics.length
      ? lastResults
      : calculateResults();
    const useClusters = state.zoom < 8;

    if (state.layers.facility) {
      const mappableFacilities = results.metrics.filter(
        (facility) =>
          Number.isFinite(facility.lat) && Number.isFinite(facility.lng),
      );
      if (useClusters) {
        groupByState(mappableFacilities).forEach((records, stateCode) => {
          addMapMarker({
            cluster: true,
            kind: "facility",
            label: String(records.length),
            onClick: () => applySelectedState(stateCode),
            position: clusterPosition(records),
            title: `${records.length} demonstration dialysis facilities in ${STATE_VIEWS[stateCode]?.name || stateCode}`,
          });
        });
      } else {
        mappableFacilities.forEach((facility) => {
          addMapMarker({
            kind: "facility",
            label: "+",
            onClick: () => selectFacility(facility.ccn, false),
            position: { lat: facility.lat, lng: facility.lng },
            selected: state.selectedFacility?.ccn === facility.ccn,
            title: facility.name,
          });
        });
      }
    }

    if (state.layers.transit) {
      if (useClusters) {
        groupByState(results.stops).forEach((records, stateCode) => {
          addMapMarker({
            cluster: true,
            kind: "transit",
            label: String(records.length),
            onClick: () => applySelectedState(stateCode),
            position: clusterPosition(records),
            title: `${records.length} demonstration transit stops in ${STATE_VIEWS[stateCode]?.name || stateCode}`,
          });
        });
      } else {
        results.stops.forEach((stop) => {
          addMapMarker({
            kind: "transit",
            label: "",
            onClick: () => selectStop(stop.id),
            position: { lat: stop.lat, lng: stop.lng },
            selected: state.selectedStop?.id === stop.id,
            title: stop.name,
          });
        });
      }
    }
    updateSelectionOverlays();
  }

  function readStoredCredentials() {
    try {
      const stored = window.localStorage.getItem(MAP_STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return typeof parsed.apiKey === "string" && parsed.apiKey
        ? {
            apiKey: parsed.apiKey,
            mapId: typeof parsed.mapId === "string" ? parsed.mapId : "",
          }
        : null;
    } catch {
      return null;
    }
  }

  function saveCredentials(credentials) {
    try {
      window.localStorage.setItem(
        MAP_STORAGE_KEY,
        JSON.stringify(credentials),
      );
    } catch {
      showNotice(
        "The map is connected, but this browser could not remember the key.",
      );
    }
  }

  function clearCredentials() {
    try {
      window.localStorage.removeItem(MAP_STORAGE_KEY);
    } catch {
      // The browser can still reload if storage is unavailable.
    }
  }

  function setSetupStatus(message, isError = false) {
    elements.mapSetupStatus.textContent = message;
    elements.mapSetupStatus.classList.toggle("is-error", isError);
  }

  function setConnectionStatus(message, connected = false) {
    elements.mapConnectionText.textContent = message;
    elements.mapConnectionStatus.classList.toggle(
      "is-connected",
      connected,
    );
  }

  function handleMapLoadFailure(message) {
    googleMap = null;
    geocoder = null;
    elements.mapSetupBackdrop.hidden = false;
    elements.mapConnect.disabled = false;
    elements.mapConnect.textContent = "Try again";
    setSetupStatus(message, true);
    setConnectionStatus("Map connection failed");
    if (!window.DIALYSIS_TRANSIT_CONFIG?.googleMapsApiKey) {
      clearCredentials();
    }
  }

  async function initializeSearchServices() {
    try {
      const { Geocoder } =
        await window.google.maps.importLibrary("geocoding");
      geocoder = new Geocoder();
    } catch {
      geocoder = null;
    }

    if (!window.DIALYSIS_TRANSIT_CONFIG?.googlePlacesAutocomplete) {
      return;
    }

    try {
      const places = await window.google.maps.importLibrary("places");
      if (places.PlaceAutocompleteElement) {
        const originalInput = $("#location-search");
        const placeAutocomplete = new places.PlaceAutocompleteElement({
          includedRegionCodes: ["us"],
        });
        placeAutocomplete.id = "google-place-search";
        placeAutocomplete.className = "google-place-search";
        placeAutocomplete.placeholder = originalInput.placeholder;
        placeAutocomplete.setAttribute(
          "aria-label",
          "Search by city, ZIP code, or address",
        );
        originalInput.hidden = true;
        originalInput.insertAdjacentElement("afterend", placeAutocomplete);
        placeAutocomplete.addEventListener("input", () => {
          originalInput.value = String(placeAutocomplete.value || "");
        });
        placeAutocomplete.addEventListener("gmp-select", async (event) => {
          const place = event.placePrediction?.toPlace();
          if (!place) return;
          await place.fetchFields({
            fields: [
              "displayName",
              "formattedAddress",
              "location",
              "viewport",
            ],
          });
          if (place.location) {
            navigateToGoogleResult(
              place.formattedAddress ||
                place.displayName ||
                "selected place",
              {
                location: place.location,
                viewport: place.viewport,
              },
            );
          }
        });
        autocomplete = placeAutocomplete;
      }
    } catch {
      autocomplete = null;
    }
  }

  function populateLocationSuggestions() {
    const suggestionList = $("#fixture-location-suggestions");
    const suggestions = new Set();
    DATA.facilities.forEach((facility) => {
      suggestions.add(facility.city);
      suggestions.add(`${facility.city}, ${facility.state}`);
      suggestions.add(facility.zip);
      suggestions.add(facility.address);
    });
    [...suggestions]
      .sort((a, b) => a.localeCompare(b))
      .forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        suggestionList.append(option);
      });
  }

  async function initializeGoogleMap() {
    try {
      const [{ Map }, markerLibrary] = await Promise.all([
        window.google.maps.importLibrary("maps"),
        window.google.maps.importLibrary("marker"),
      ]);
      AdvancedMarkerElement = markerLibrary.AdvancedMarkerElement;
      const options = {
        center: state.center,
        clickableIcons: false,
        fullscreenControl: false,
        gestureHandling: "cooperative",
        mapId: pendingCredentials.mapId || "DEMO_MAP_ID",
        mapTypeControl: false,
        streetViewControl: false,
        zoom: state.zoom,
        zoomControl: false,
      };
      const requestedCenter = { ...state.center };
      const requestedZoom = state.zoom;
      let mapViewInitialized = false;

      googleMap = new Map($("#google-map"), options);
      googleMap.setCenter(requestedCenter);
      googleMap.setZoom(requestedZoom);
      googleMap.addListener("idle", () => {
        if (!mapViewInitialized) {
          mapViewInitialized = true;
          googleMap.setCenter(requestedCenter);
          googleMap.setZoom(requestedZoom);
          return;
        }
        window.clearTimeout(mapIdleTimer);
        mapIdleTimer = window.setTimeout(() => {
          const center = googleMap.getCenter();
          const bounds = googleMap.getBounds();
          const currentZoom = googleMap.getZoom();
          if (center) {
            state.center = { lat: center.lat(), lng: center.lng() };
          }
          if (bounds) {
            const northeast = bounds.getNorthEast();
            const southwest = bounds.getSouthWest();
            state.extentBounds = {
              east: northeast.lng(),
              north: northeast.lat(),
              south: southwest.lat(),
              west: southwest.lng(),
            };
          }
          if (Number.isFinite(currentZoom)) state.zoom = currentZoom;
          updateMapReadout();
          if (!state.selectedState) renderAll();
          renderMapOverlays();
          updateUrl();
        }, 300);
      });

      saveCredentials(pendingCredentials);
      elements.mapSetupBackdrop.hidden = true;
      elements.mapConnect.disabled = false;
      elements.mapConnect.textContent = "Load Google map";
      elements.forgetMapKey.hidden =
        Boolean(readStoredCredentials()) &&
        !window.DIALYSIS_TRANSIT_CONFIG?.googleMapsApiKey;
      setConnectionStatus("Google Maps connected", true);
      await initializeSearchServices();
      renderAll();
      showNotice("The live Google basemap and demonstration layers are ready.");
    } catch {
      handleMapLoadFailure(
        "Google Maps loaded but could not initialize. Check Maps JavaScript API, vector Map ID, and billing.",
      );
    }
  }

  function loadGoogleMaps(credentials) {
    if (!credentials.apiKey) {
      setSetupStatus("Enter a Google Maps Platform browser key.", true);
      elements.mapApiKey.focus();
      return;
    }

    pendingCredentials = credentials;
    elements.mapConnect.disabled = true;
    elements.mapConnect.textContent = "Connecting…";
    setSetupStatus("Requesting the Google Maps JavaScript API…");
    setConnectionStatus("Connecting Google Maps");

    if (window.google?.maps?.importLibrary) {
      initializeGoogleMap();
      return;
    }

    $("#google-maps-api")?.remove();
    window[MAP_CALLBACK] = initializeGoogleMap;
    window.gm_authFailure = () => {
      handleMapLoadFailure(
        "Google rejected this key. Check API enablement, billing, and the GitHub Pages referrer restriction.",
      );
    };

    const parameters = new URLSearchParams({
      auth_referrer_policy: "origin",
      callback: MAP_CALLBACK,
      key: credentials.apiKey,
      loading: "async",
      v: "weekly",
    });
    const script = document.createElement("script");
    script.id = "google-maps-api";
    script.async = true;
    script.src =
      `https://maps.googleapis.com/maps/api/js?${parameters.toString()}`;
    script.onerror = () => {
      handleMapLoadFailure(
        "The Google Maps script could not load. Check the connection and key restrictions.",
      );
    };
    document.head.append(script);
  }

  function navigateToGoogleResult(label, geometry) {
    state.selectedState = "";
    elements.stateSelect.value = "";
    elements.regionReadout.textContent = label;
    elements.extentDescription.textContent =
      "Current map viewport—not an administrative-area statistic";
    if (geometry.viewport) {
      googleMap.fitBounds(geometry.viewport);
    } else {
      googleMap.panTo(geometry.location);
      googleMap.setZoom(14);
    }
    showNotice(`Map moved to ${label}.`);
  }

  function navigateToFixtureResult(query) {
    const normalizedQuery = query.trim().toLowerCase();
    const matches = DATA.facilities.filter((facility) => {
      const searchable = [
        facility.address,
        facility.city,
        facility.name,
        facility.state,
        facility.zip,
      ]
        .join(" ")
        .toLowerCase();
      return searchable.includes(normalizedQuery);
    });
    const mappableMatches = matches.filter(
      (facility) =>
        Number.isFinite(facility.lat) && Number.isFinite(facility.lng),
    );
    if (!mappableMatches.length) return false;

    const center = {
      lat:
        mappableMatches.reduce(
          (total, facility) => total + facility.lat,
          0,
        ) / mappableMatches.length,
      lng:
        mappableMatches.reduce(
          (total, facility) => total + facility.lng,
          0,
        ) / mappableMatches.length,
    };
    state.selectedState = "";
    elements.stateSelect.value = "";
    state.center = center;
    state.zoom = 13;
    elements.regionReadout.textContent =
      `${mappableMatches[0].city}, ${mappableMatches[0].state}`;
    elements.extentDescription.textContent =
      "Current map viewport—not an administrative-area statistic";
    if (googleMap) {
      googleMap.setCenter(center);
      googleMap.setZoom(13);
    }
    showNotice(
      `Map moved to ${mappableMatches[0].city} using the bundled fixture index.`,
    );
    updateUrl();
    return true;
  }

  async function navigateToPlace(query) {
    if (navigateToFixtureResult(query)) return;
    if (!googleMap || !geocoder) {
      showNotice("Connect Google Maps before searching for a place.");
      elements.mapSetupBackdrop.hidden = false;
      elements.mapApiKey.focus();
      return;
    }

    try {
      const response = await geocoder.geocode({
        address: query,
        region: "US",
      });
      const result = response.results[0];
      if (!result) {
        if (!navigateToFixtureResult(query)) {
          showNotice(`No map result was found for “${query}”.`);
        }
        return;
      }
      navigateToGoogleResult(result.formatted_address, result.geometry);
    } catch {
      if (!navigateToFixtureResult(query)) {
        showNotice(
          "Google could not complete that search. Check that Geocoding API is enabled.",
        );
      }
    }
  }

  function serializeState() {
    const parameters = new URLSearchParams();
    if (state.selectedState) parameters.set("state", state.selectedState);
    if (state.radius !== 400) parameters.set("radius", String(state.radius));
    if (!state.layers.facility) parameters.set("facilities", "off");
    if (!state.layers.transit) parameters.set("stops", "off");
    Object.entries(state.filters).forEach(([key, value]) => {
      if (key === "inCenter") {
        if (!value) parameters.set("inCenter", "no");
      } else if (
        value !== "" &&
        !(key === "geocode" && value === "matched")
      ) {
        parameters.set(key, String(value));
      }
    });
    if (!state.selectedState) {
      parameters.set("lat", state.center.lat.toFixed(5));
      parameters.set("lng", state.center.lng.toFixed(5));
      parameters.set("zoom", String(Math.round(state.zoom)));
    }
    return parameters;
  }

  function updateUrl() {
    const parameters = serializeState();
    const query = parameters.toString();
    const nextUrl =
      `${window.location.pathname}${query ? `?${query}` : ""}` +
      window.location.hash;
    window.history.replaceState(null, "", nextUrl);
  }

  function restoreStateFromUrl() {
    const parameters = new URLSearchParams(window.location.search);
    const stateCode = parameters.get("state");
    if (stateCode && STATE_VIEWS[stateCode]) state.selectedState = stateCode;
    const radius = Number(parameters.get("radius"));
    if (Number.isFinite(radius) && radius >= 100 && radius <= 5000) {
      state.radius = Math.round(radius);
    }
    state.layers.facility = parameters.get("facilities") !== "off";
    state.layers.transit = parameters.get("stops") !== "off";

    const filterKeys = [
      "agency",
      "chain",
      "chainOwned",
      "geocode",
      "lateShift",
      "ownership",
      "stationsMax",
      "stationsMin",
      "stopType",
      "wheelchair",
    ];
    filterKeys.forEach((key) => {
      if (parameters.has(key)) state.filters[key] = parameters.get(key);
    });
    state.filters.inCenter = parameters.get("inCenter") !== "no";

    const latitude = Number(parameters.get("lat"));
    const longitude = Number(parameters.get("lng"));
    const zoom = Number(parameters.get("zoom"));
    if (
      parameters.has("lat") &&
      parameters.has("lng") &&
      parameters.has("zoom") &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      Number.isFinite(zoom)
    ) {
      state.center = { lat: latitude, lng: longitude };
      state.zoom = Math.min(22, Math.max(0, zoom));
    } else if (state.selectedState) {
      state.center = { ...STATE_VIEWS[state.selectedState].center };
      state.zoom = STATE_VIEWS[state.selectedState].zoom;
    }
  }

  function syncControlsFromState() {
    elements.stateSelect.value = state.selectedState;
    elements.regionReadout.textContent = state.selectedState
      ? STATE_VIEWS[state.selectedState].name
      : NATIONAL_VIEW.name;
    elements.extentDescription.textContent = state.selectedState
      ? `${STATE_VIEWS[state.selectedState].name} selected-state extent`
      : "Current map viewport—not an administrative-area statistic";
    elements.radiusReadout.textContent = formatDistance(state.radius);
    $$("[data-radius]").forEach((button) => {
      const selected = Number(button.dataset.radius) === state.radius;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    $$("[data-layer-toggle]").forEach((toggle) => {
      toggle.checked = state.layers[toggle.dataset.layerToggle];
    });
    $("#filter-agency").value = state.filters.agency;
    $("#filter-chain").value = state.filters.chain;
    $("#filter-chain-owned").value = state.filters.chainOwned;
    $("#filter-geocode").value = state.filters.geocode;
    $("#filter-in-center").checked = state.filters.inCenter;
    $("#filter-late-shift").value = state.filters.lateShift;
    $("#filter-ownership").value = state.filters.ownership;
    $("#filter-stations-max").value = state.filters.stationsMax;
    $("#filter-stations-min").value = state.filters.stationsMin;
    $("#filter-stop-type").value = state.filters.stopType;
    $("#filter-wheelchair").value = state.filters.wheelchair;
    updateMapReadout();
  }

  function copyViewLink() {
    updateUrl();
    const url = window.location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => showNotice("Shareable analysis link copied."))
        .catch(() => showNotice(`Copy this analysis link: ${url}`));
    } else {
      showNotice(`Copy this analysis link: ${url}`);
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      showNotice("Current-location access is not available in this browser.");
      return;
    }
    showNotice("Waiting for browser location permission…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        state.selectedState = "";
        elements.stateSelect.value = "";
        const center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        state.center = center;
        state.zoom = 13;
        if (googleMap) {
          googleMap.setCenter(center);
          googleMap.setZoom(13);
        }
        elements.regionReadout.textContent = "Current location viewport";
        showNotice("Map moved to your current location.");
        updateUrl();
      },
      () => {
        showNotice(
          "Location was unavailable or permission was not granted. Nothing was stored.",
        );
      },
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 },
    );
  }

  function resetFilters() {
    state.filters = {
      agency: "",
      chain: "",
      chainOwned: "",
      geocode: "matched",
      inCenter: true,
      lateShift: "",
      ownership: "",
      stationsMax: "",
      stationsMin: "",
      stopType: "",
      wheelchair: "",
    };
    syncControlsFromState();
    renderAll();
    updateUrl();
    showNotice("All filters were reset to Phase 1 defaults.");
  }

  function csvCell(value) {
    let text = String(value ?? "");
    if (/^[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  }

  function exportCsv() {
    const headers = [
      "facility_name",
      "city",
      "state",
      "ownership",
      "chain_organization",
      "dialysis_stations",
      "nearest_stop_name",
      "nearest_stop_distance_m",
      "stops_within_threshold",
      "geocode_status",
      "cms_ccn",
      "facility_latitude",
      "facility_longitude",
      "geocode_benchmark",
      "nearest_stop_id",
      "nearest_stop_latitude",
      "nearest_stop_longitude",
      "active_threshold_m",
      "active_extent",
      "cms_snapshot_date",
      "ntm_snapshot_date",
      "exported_at_utc",
      "data_mode",
    ];
    const exportedAt = new Date().toISOString();
    const rows = lastResults.metrics.map((facility) => [
      facility.name,
      facility.city,
      facility.state,
      facility.ownership,
      facility.chain,
      facility.stations,
      facility.nearestStop?.name ?? "",
      Number.isFinite(facility.nearestDistance)
        ? facility.nearestDistance.toFixed(3)
        : "",
      facility.stopCount ?? "",
      facility.geocodeStatus,
      facility.ccn,
      facility.lat ?? "",
      facility.lng ?? "",
      facility.geocodeBenchmark,
      facility.nearestStop?.stopId ?? "",
      facility.nearestStop?.lat ?? "",
      facility.nearestStop?.lng ?? "",
      state.radius,
      currentExtentLabel(),
      facility.snapshotDate,
      facility.nearestStop?.snapshotDate ?? DATA.metadata.preparedAt,
      exportedAt,
      "synthetic_demonstration_fixture",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = exportedAt.slice(0, 10);
    const extent = state.selectedState || "viewport";
    link.href = url;
    link.download =
      `dialysis-transit-explorer_${date}_${extent}_${state.radius}-m.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showNotice(
      `${rows.length} demonstration facility row${rows.length === 1 ? "" : "s"} exported.`,
    );
  }

  function bindEvents() {
    $$("[role='tab']").forEach((tab, index, tabs) => {
      tab.addEventListener("click", () => setActiveTab(tab.dataset.tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
          return;
        }
        event.preventDefault();
        let nextIndex = index;
        if (event.key === "ArrowLeft") {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === "ArrowRight") {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabs.length - 1;
        }
        setActiveTab(tabs[nextIndex].dataset.tab, true);
      });
    });

    $$("[data-layer-toggle]").forEach((toggle) => {
      toggle.addEventListener("change", () => {
        state.layers[toggle.dataset.layerToggle] = toggle.checked;
        updateLayerState();
        updateUrl();
      });
    });

    $$("[data-selection-layer]").forEach((toggle) => {
      toggle.addEventListener("change", () => {
        const layer = toggle.dataset.selectionLayer;
        state.selectionLayers[layer] = toggle.checked;
        updateSelectionButtons();
        updateSelectionOverlays();
      });
    });

    $$("[data-radius]").forEach((button) => {
      button.addEventListener("click", () =>
        updateRadius(Number(button.dataset.radius)),
      );
    });

    $("#custom-radius-form").addEventListener("submit", (event) => {
      event.preventDefault();
      updateRadius(Number(elements.customRadius.value));
    });

    elements.stateSelect.addEventListener("change", () => {
      applySelectedState(elements.stateSelect.value);
    });

    $("#filters-form").addEventListener("change", updateFilterState);
    $("#filters-form").addEventListener("input", (event) => {
      if (event.target.type === "number") updateFilterState();
    });
    $("#reset-filters").addEventListener("click", resetFilters);

    $$("[data-sort]").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.sort;
        if (state.sort.key === key) {
          state.sort.direction =
            state.sort.direction === "asc" ? "desc" : "asc";
        } else {
          state.sort.key = key;
          state.sort.direction = key === "nearestDistance" ? "desc" : "asc";
        }
        renderAll();
      });
    });

    elements.panelClose.addEventListener("click", () => {
      elements.workspace.classList.add("workspace--panel-closed");
      elements.panelOpen.hidden = false;
    });
    elements.panelOpen.addEventListener("click", () => {
      elements.workspace.classList.remove("workspace--panel-closed");
      elements.panelOpen.hidden = true;
      elements.panelClose.focus();
    });
    $("#methods-shortcut").addEventListener("click", () => {
      elements.workspace.classList.remove("workspace--panel-closed");
      elements.panelOpen.hidden = true;
      setActiveTab("methods", true);
    });

    $("#zoom-in").addEventListener("click", () => {
      state.zoom = Math.min(22, state.zoom + 1);
      if (googleMap) googleMap.setZoom(state.zoom);
      updateMapReadout();
      renderMapOverlays();
      updateUrl();
    });
    $("#zoom-out").addEventListener("click", () => {
      state.zoom = Math.max(0, state.zoom - 1);
      if (googleMap) googleMap.setZoom(state.zoom);
      updateMapReadout();
      renderMapOverlays();
      updateUrl();
    });
    $("#reset-view").addEventListener("click", () => {
      state.extentBounds = { ...NATIONAL_BOUNDS };
      applySelectedState("");
    });
    $("#analyze-viewport").addEventListener("click", () => {
      state.selectedState = "";
      elements.stateSelect.value = "";
      elements.regionReadout.textContent = "Current map viewport";
      elements.extentDescription.textContent =
        "Current map viewport—not an administrative-area statistic";
      renderAll();
      updateUrl();
      showNotice("Analytics now use the current map viewport.");
    });
    $("#current-location").addEventListener("click", useCurrentLocation);
    $("#copy-view-link").addEventListener("click", copyViewLink);

    $("#location-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const query = String(
        autocomplete?.value || $("#location-search").value,
      ).trim();
      if (query) navigateToPlace(query);
      else showNotice("Enter a city, ZIP code, or address to navigate.");
    });

    $("#map-setup").addEventListener("submit", (event) => {
      event.preventDefault();
      loadGoogleMaps({
        apiKey: elements.mapApiKey.value.trim(),
        mapId: elements.mapId.value.trim(),
      });
    });
    $("#toggle-api-key").addEventListener("click", () => {
      const showKey = elements.mapApiKey.type === "password";
      elements.mapApiKey.type = showKey ? "text" : "password";
      $("#toggle-api-key").textContent = showKey ? "Hide" : "Show";
    });
    elements.forgetMapKey.addEventListener("click", () => {
      clearCredentials();
      window.location.reload();
    });

    $("#export-csv").addEventListener("click", exportCsv);
    $("#facility-detail-close").addEventListener("click", closeFacilityDetail);
    $("#stop-detail-close").addEventListener("click", () => {
      state.selectedStop = null;
      elements.stopDetail.hidden = true;
      renderMapOverlays();
    });
    elements.detailLineButton.addEventListener("click", () =>
      toggleSelectionLayer("line"),
    );
    elements.detailCircleButton.addEventListener("click", () =>
      toggleSelectionLayer("circle"),
    );

    $("#notice-close").addEventListener("click", () => {
      elements.noticeBar.hidden = true;
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (!elements.stopDetail.hidden) {
          elements.stopDetail.hidden = true;
          state.selectedStop = null;
        } else if (!elements.facilityDetail.hidden) {
          closeFacilityDetail();
        }
      }
    });
  }

  function initialize() {
    populateFilterOptions();
    populateLocationSuggestions();
    restoreStateFromUrl();
    syncControlsFromState();
    bindEvents();
    updateLayerState();
    renderAll();

    const hostedConfiguration = window.DIALYSIS_TRANSIT_CONFIG || {};
    const storedCredentials = readStoredCredentials();
    const credentials = hostedConfiguration.googleMapsApiKey
      ? {
          apiKey: hostedConfiguration.googleMapsApiKey,
          mapId: hostedConfiguration.googleMapId || "",
        }
      : storedCredentials;

    if (credentials) {
      elements.mapId.value = credentials.mapId;
      loadGoogleMaps(credentials);
    } else if (window.location.protocol === "file:") {
      setSetupStatus(
        "For a restricted key, serve this folder over localhost or GitHub Pages instead of opening the file directly.",
      );
    }
  }

  window.DialysisTransitExplorer = {
    calculateResults,
    distanceMeters,
    exportCsv,
    formatDistance,
    getState: () => JSON.parse(JSON.stringify(state)),
    percentile,
    updateRadius,
  };

  initialize();
})();
