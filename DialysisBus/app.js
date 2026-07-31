(() => {
  "use strict";

  const DATA =
    window.DIALYSIS_TRANSIT_PUBLIC_DATA ||
    window.DIALYSIS_TRANSIT_SAMPLE_DATA;
  if (!DATA) {
    throw new Error("The dialysis and transit dataset could not be loaded.");
  }
  const IS_PUBLIC_DATA = DATA.metadata.mode === "public_snapshot";
  const CLOSEST_STOPS_PER_FACILITY = 3;
  const EARTH_RADIUS_METERS = 6371008.8;
  const TRANSIT_MIN_ZOOM = 10;
  const TRANSIT_RECORD_LIMIT = 2000;
  const TRANSIT_SERVICE_URL =
    "https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_National_Transit_Map_Stops/FeatureServer/0/query";

  const MAP_STORAGE_KEY = "dialysisTransitGoogleMaps";
  const MAP_CALLBACK = "__dialysisTransitGoogleMapsReady";
  const NATIONAL_VIEW = {
    center: { lat: 37.5, lng: -112 },
    name: "Current map viewport",
    zoom: 3,
  };
  const NATIONAL_BOUNDS = {
    east: -60,
    north: 72,
    south: -15,
    west: 130,
  };
  const STATE_VIEWS = {
    AS: {
      center: { lat: -14.271, lng: -170.132 },
      name: "American Samoa",
      zoom: 9,
    },
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
    MP: {
      center: { lat: 15.18, lng: 145.75 },
      name: "Northern Mariana Islands",
      zoom: 9,
    },
    VI: {
      center: { lat: 18.3358, lng: -64.8963 },
      name: "U.S. Virgin Islands",
      zoom: 9,
    },
  };
  const STATE_NAMES = {
    AK: "Alaska",
    AL: "Alabama",
    AR: "Arkansas",
    AS: "American Samoa",
    AZ: "Arizona",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DC: "District of Columbia",
    DE: "Delaware",
    FL: "Florida",
    GA: "Georgia",
    GU: "Guam",
    HI: "Hawaii",
    IA: "Iowa",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    MA: "Massachusetts",
    MD: "Maryland",
    ME: "Maine",
    MI: "Michigan",
    MN: "Minnesota",
    MO: "Missouri",
    MP: "Northern Mariana Islands",
    MS: "Mississippi",
    MT: "Montana",
    NC: "North Carolina",
    ND: "North Dakota",
    NE: "Nebraska",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NV: "Nevada",
    NY: "New York",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    PR: "Puerto Rico",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VA: "Virginia",
    VI: "U.S. Virgin Islands",
    VT: "Vermont",
    WA: "Washington",
    WI: "Wisconsin",
    WV: "West Virginia",
    WY: "Wyoming",
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
  const TRANSIT_FILTER_KEYS = [
    "agency",
    "stopQuery",
    "stopType",
    "wheelchair",
    "withinRadius",
  ];

  const state = {
    center: { ...NATIONAL_VIEW.center },
    extentBounds: { ...NATIONAL_BOUNDS },
    filters: {
      agency: "",
      chain: "",
      chainOwned: "",
      geocode: "matched",
      inCenter: false,
      lateShift: "",
      ownership: "",
      stationsMax: "",
      stationsMin: "",
      stopQuery: "",
      stopType: "",
      withinRadius: false,
      wheelchair: "",
    },
    layers: {
      centerDistanceHeatmap: false,
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
  let centerDistanceHeatmapOverlay = null;
  let heatmapFacilitiesCache = null;
  let heatmapSummaryCache = null;
  let pendingCredentials = null;
  let lastResults = {
    facilities: [],
    metrics: [],
    stops: [],
  };
  let mapIdleTimer = null;
  let filterInputTimer = null;
  let lastTransitQueryKey = "";
  let transitFetchController = null;
  let transitLoadState = IS_PUBLIC_DATA ? "zoom" : "bundled";
  let transitCandidateStops = [...DATA.stops];
  let closestStopIdsByFacility = new Map();

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const elements = {
    analyticsExcluded: $("#analytics-excluded"),
    analyticsExtentTitle: $("#analytics-extent-title"),
    centerDistanceHeatmapLegend: $("#center-distance-heatmap-legend"),
    centerDistanceHeatmapScale: $("#center-distance-heatmap-scale"),
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
    transitFilterActive: $("#transit-filter-active"),
    transitFilterCount: $("#transit-filter-count"),
    transitRadiusFilterHelp: $("#transit-radius-filter-help"),
    workspace: $("#workspace"),
  };

  function radians(value) {
    return (value * Math.PI) / 180;
  }

  function distanceMeters(first, second) {
    const latitudeDelta = radians(second.lat - first.lat);
    const longitudeDelta = radians(second.lng - first.lng);
    const firstLatitude = radians(first.lat);
    const secondLatitude = radians(second.lat);
    const a =
      Math.sin(latitudeDelta / 2) ** 2 +
      Math.cos(firstLatitude) *
        Math.cos(secondLatitude) *
        Math.sin(longitudeDelta / 2) ** 2;
    return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(a));
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

  function facilityUnitVector(facility) {
    const latitude = radians(facility.lat);
    const longitude = radians(facility.lng);
    const latitudeRadius = Math.cos(latitude);
    return [
      latitudeRadius * Math.cos(longitude),
      latitudeRadius * Math.sin(longitude),
      Math.sin(latitude),
    ];
  }

  function buildFacilitySpatialTree(points, depth = 0) {
    if (!points.length) return null;
    const axis = depth % 3;
    points.sort(
      (first, second) => first.vector[axis] - second.vector[axis],
    );
    const middle = Math.floor(points.length / 2);
    return {
      axis,
      left: buildFacilitySpatialTree(points.slice(0, middle), depth + 1),
      point: points[middle],
      right: buildFacilitySpatialTree(points.slice(middle + 1), depth + 1),
    };
  }

  function squaredVectorDistance(first, second) {
    return first.reduce(
      (total, coordinate, index) =>
        total + (coordinate - second[index]) ** 2,
      0,
    );
  }

  function findNearestFacilityPoint(
    node,
    target,
    best = { distanceSquared: Number.POSITIVE_INFINITY, point: null },
  ) {
    if (!node) return best;
    let nextBest = best;
    if (node.point !== target) {
      const distanceSquared = squaredVectorDistance(
        node.point.vector,
        target.vector,
      );
      if (distanceSquared < nextBest.distanceSquared) {
        nextBest = { distanceSquared, point: node.point };
      }
    }

    const axisDelta = target.vector[node.axis] - node.point.vector[node.axis];
    const nearBranch = axisDelta < 0 ? node.left : node.right;
    const farBranch = axisDelta < 0 ? node.right : node.left;
    nextBest = findNearestFacilityPoint(nearBranch, target, nextBest);
    if (axisDelta ** 2 < nextBest.distanceSquared) {
      nextBest = findNearestFacilityPoint(farBranch, target, nextBest);
    }
    return nextBest;
  }

  function calculateNearestFacilityDistances(facilities) {
    const spatialPoints = facilities
      .filter(
        (facility) =>
          Number.isFinite(facility.lat) && Number.isFinite(facility.lng),
      )
      .map((facility) => ({
        facility,
        vector: facilityUnitVector(facility),
      }));
    if (spatialPoints.length < 2) {
      return { lowerDistance: null, points: [], upperDistance: null };
    }

    const spatialTree = buildFacilitySpatialTree([...spatialPoints]);
    const points = spatialPoints.map((point) => {
      const nearest = findNearestFacilityPoint(spatialTree, point);
      const chordLength = Math.sqrt(nearest.distanceSquared);
      const angularDistance = 2 * Math.asin(Math.min(1, chordLength / 2));
      return {
        ccn: point.facility.ccn,
        lat: point.facility.lat,
        lng: point.facility.lng,
        nearestDistance: angularDistance * EARTH_RADIUS_METERS,
        nearestFacilityName: nearest.point?.facility.name || "",
      };
    });
    const distances = points.map((point) => point.nearestDistance);
    const lowerDistance = percentile(distances, 0.1);
    const upperDistance = percentile(distances, 0.9);
    const distanceSpan = Math.max(1, upperDistance - lowerDistance);

    return {
      lowerDistance,
      points: points.map((point) => ({
        ...point,
        normalizedDistance: Math.max(
          0,
          Math.min(
            1,
            (point.nearestDistance - lowerDistance) / distanceSpan,
          ),
        ),
      })),
      upperDistance,
    };
  }

  function heatmapColor(normalizedDistance) {
    const green = [25, 135, 84];
    const yellow = [242, 201, 76];
    const red = [200, 60, 60];
    const halfwayColor = (first, second) =>
      first.map((channel, index) =>
        Math.round((channel + second[index]) / 2),
      );
    const colors = [
      green,
      halfwayColor(green, yellow),
      yellow,
      halfwayColor(yellow, red),
      red,
    ];
    const bandIndex = Math.min(
      colors.length - 1,
      Math.floor(Math.max(0, normalizedDistance) * colors.length),
    );
    return colors[bandIndex];
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
    if (
      IS_PUBLIC_DATA &&
      Number.isFinite(record.lat) &&
      Number.isFinite(record.lng)
    ) {
      return pointInBounds(record, state.extentBounds);
    }
    if (state.selectedState) return record.state === state.selectedState;
    if (!Number.isFinite(record.lat) || !Number.isFinite(record.lng)) {
      return true;
    }
    return pointInBounds(record, state.extentBounds);
  }

  function buildStateViews() {
    groupByState(DATA.facilities).forEach((facilities, stateCode) => {
      const latitudes = facilities.map((facility) => facility.lat);
      const longitudes = facilities.map((facility) => facility.lng);
      const latitudeSpan = Math.max(...latitudes) - Math.min(...latitudes);
      const longitudeSpan =
        Math.max(...longitudes) - Math.min(...longitudes);
      const maximumSpan = Math.max(latitudeSpan, longitudeSpan);
      const zoom =
        maximumSpan > 30
          ? 4
          : maximumSpan > 15
            ? 5
            : maximumSpan > 7
              ? 6
              : maximumSpan > 3
                ? 7
                : 8;
      STATE_VIEWS[stateCode] = {
        center: clusterPosition(facilities),
        name: STATE_NAMES[stateCode] || stateCode,
        zoom,
      };
    });
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

  function stopMatchesTransitFilters(stop, filters) {
    if (filters.stopQuery) {
      const query = filters.stopQuery.trim().toLocaleLowerCase();
      const searchableText = [
        stop.name,
        stop.stopId,
        stop.objectId,
        stop.sourceObjectId,
        stop.ntdId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
      if (query && !searchableText.includes(query)) return false;
    }
    if (filters.stopType && stop.type !== filters.stopType) return false;
    if (filters.wheelchair && stop.wheelchair !== filters.wheelchair) {
      return false;
    }
    if (filters.agency && stop.agency !== filters.agency) return false;
    return true;
  }

  function matchesStopFilters(stop) {
    return (
      matchesExtent(stop) && stopMatchesTransitFilters(stop, state.filters)
    );
  }

  function selectClosestStopsForFacilities(
    facilities,
    candidateStops,
    limit = CLOSEST_STOPS_PER_FACILITY,
    maximumDistance = Number.POSITIVE_INFINITY,
  ) {
    const selectedStops = new Map();
    const stopIdsByFacility = new Map();

    facilities.forEach((facility) => {
      if (!Number.isFinite(facility.lat) || !Number.isFinite(facility.lng)) {
        stopIdsByFacility.set(facility.ccn, []);
        return;
      }

      const closestStops = candidateStops
        .map((stop) => ({
          distance: distanceMeters(facility, stop),
          stop,
        }))
        .filter((candidate) => candidate.distance <= maximumDistance)
        .sort((first, second) => first.distance - second.distance)
        .slice(0, limit);

      stopIdsByFacility.set(
        facility.ccn,
        closestStops.map((candidate) => candidate.stop.id),
      );
      closestStops.forEach((candidate) => {
        const existing = selectedStops.get(candidate.stop.id);
        if (existing) {
          existing.closestFacilityDistance = Math.min(
            existing.closestFacilityDistance,
            candidate.distance,
          );
          existing.relatedFacilityCount += 1;
          return;
        }
        selectedStops.set(candidate.stop.id, {
          ...candidate.stop,
          closestFacilityDistance: candidate.distance,
          relatedFacilityCount: 1,
        });
      });
    });

    return {
      stopIdsByFacility,
      stops: [...selectedStops.values()].sort(
        (first, second) =>
          first.closestFacilityDistance - second.closestFacilityDistance,
      ),
    };
  }

  function refreshClosestTransitStops(facilities) {
    const selection = selectClosestStopsForFacilities(
      facilities,
      transitCandidateStops.filter(matchesStopFilters),
      CLOSEST_STOPS_PER_FACILITY,
      state.filters.withinRadius
        ? state.radius
        : Number.POSITIVE_INFINITY,
    );
    closestStopIdsByFacility = selection.stopIdsByFacility;
    DATA.stops = selection.stops;
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
      if (
        IS_PUBLIC_DATA &&
        !["limited", "loaded"].includes(transitLoadState)
      ) {
        return {
          ...facility,
          nearestDistance: null,
          nearestStop: null,
          stopCount: null,
        };
      }

      const closestStopIds = new Set(
        closestStopIdsByFacility.get(facility.ccn) || [],
      );
      const facilityStops = closestStopIdsByFacility.has(facility.ccn)
        ? stops.filter((stop) => closestStopIds.has(stop.id))
        : stops;
      const orderedStops = facilityStops
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
    refreshClosestTransitStops(facilities);
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
      `Center-distance heatmap ${state.layers.centerDistanceHeatmap ? "on" : "off"}. ` +
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

    if (IS_PUBLIC_DATA && stateCode) {
      const stateFacilities = DATA.facilities.filter(
        (facility) =>
          facility.state === stateCode &&
          Number.isFinite(facility.lat) &&
          Number.isFinite(facility.lng),
      );
      if (stateFacilities.length) {
        state.extentBounds = {
          east: Math.max(...stateFacilities.map((facility) => facility.lng)),
          north: Math.max(...stateFacilities.map((facility) => facility.lat)),
          south: Math.min(...stateFacilities.map((facility) => facility.lat)),
          west: Math.min(...stateFacilities.map((facility) => facility.lng)),
        };
      }
    }
    if (IS_PUBLIC_DATA && view.zoom < TRANSIT_MIN_ZOOM) {
      clearRuntimeTransitStops("zoom");
    }

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
      stopQuery: $("#filter-stop-query").value.trim(),
      stopType: $("#filter-stop-type").value,
      withinRadius: $("#filter-within-radius").checked,
      wheelchair: $("#filter-wheelchair").value,
    };
    renderAll();
    updateUrl();
  }

  function replaceSelectOptions(element, values, labelForValue) {
    while (element.options.length > 1) element.remove(1);
    [...new Set(values.filter(Boolean))]
      .sort((first, second) =>
        String(labelForValue?.(first) || first).localeCompare(
          String(labelForValue?.(second) || second),
        ),
      )
      .forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = labelForValue?.(value) || value;
        element.append(option);
      });
  }

  function populateTransitFilterOptions() {
    const optionStops = transitCandidateStops.filter(matchesExtent);
    const countsFor = (key) => {
      const counts = new Map();
      optionStops.forEach((stop) => {
        const value = stop[key];
        if (value) counts.set(value, (counts.get(value) || 0) + 1);
      });
      return counts;
    };
    const stopTypeCounts = countsFor("type");
    const agencyCounts = countsFor("agency");
    replaceSelectOptions(
      $("#filter-stop-type"),
      [
        state.filters.stopType,
        ...optionStops.map((stop) => stop.type),
      ],
      (value) => `${value} (${stopTypeCounts.get(value) || 0})`,
    );
    replaceSelectOptions(
      $("#filter-agency"),
      [state.filters.agency, ...optionStops.map((stop) => stop.agency)],
      (value) => `${value} (${agencyCounts.get(value) || 0})`,
    );
    $("#filter-stop-type").options[0].textContent =
      `All stop types (${optionStops.length.toLocaleString()})`;
    $("#filter-agency").options[0].textContent =
      `All agencies (${optionStops.length.toLocaleString()})`;
    const wheelchairCounts = countsFor("wheelchair");
    [...$("#filter-wheelchair").options].forEach((option) => {
      option.textContent = option.value
        ? `${option.value} (${wheelchairCounts.get(option.value) || 0})`
        : `All statuses (${optionStops.length.toLocaleString()})`;
    });
    $("#filter-stop-type").value = state.filters.stopType;
    $("#filter-agency").value = state.filters.agency;
    $("#filter-wheelchair").value = state.filters.wheelchair;
    updateTransitFilterAvailability();
  }

  function activeTransitFilterCount() {
    return TRANSIT_FILTER_KEYS.filter((key) => Boolean(state.filters[key]))
      .length;
  }

  function updateTransitFilterAvailability() {
    const filtersAvailable =
      !IS_PUBLIC_DATA ||
      (["limited", "loaded"].includes(transitLoadState) &&
        transitCandidateStops.length > 0);
    $$('[data-transit-filter="true"]').forEach((control) => {
      control.disabled = !filtersAvailable;
    });
    $("#reset-transit-filters").disabled =
      activeTransitFilterCount() === 0;
  }

  function renderTransitFilterStatus(results) {
    const candidateStops = transitCandidateStops.filter(matchesExtent);
    const filteredCandidates = candidateStops.filter(matchesStopFilters);
    const activeCount = activeTransitFilterCount();
    elements.transitFilterActive.textContent = `${activeCount} active`;
    elements.transitRadiusFilterHelp.textContent =
      `Keep only each facility's closest stops that are within ${formatDistance(state.radius)}.`;

    if (IS_PUBLIC_DATA && transitLoadState === "zoom") {
      elements.transitFilterCount.textContent =
        `Zoom to level ${TRANSIT_MIN_ZOOM}+ to load transit filter options.`;
    } else if (IS_PUBLIC_DATA && transitLoadState === "loading") {
      elements.transitFilterCount.textContent =
        "Loading transit candidates for this viewport…";
    } else if (IS_PUBLIC_DATA && transitLoadState === "error") {
      elements.transitFilterCount.textContent =
        "Transit candidates are unavailable for this viewport.";
    } else {
      elements.transitFilterCount.textContent =
        `${filteredCandidates.length.toLocaleString()} of ${candidateStops.length.toLocaleString()} candidates match · ` +
        `${results.stops.length.toLocaleString()} displayed`;
    }
    updateTransitFilterAvailability();
  }

  function populateFilterOptions() {
    replaceSelectOptions(
      elements.stateSelect,
      DATA.facilities.map((facility) => facility.state),
      (stateCode) => STATE_NAMES[stateCode] || stateCode,
    );
    replaceSelectOptions(
      $("#filter-chain"),
      DATA.facilities.map((facility) => facility.chain),
    );
    populateTransitFilterOptions();
  }

  function clearRuntimeTransitStops(nextLoadState = "zoom") {
    if (!IS_PUBLIC_DATA) return;
    transitFetchController?.abort();
    transitFetchController = null;
    lastTransitQueryKey = "";
    transitLoadState = nextLoadState;
    transitCandidateStops = [];
    closestStopIdsByFacility = new Map();
    DATA.stops = [];
    populateTransitFilterOptions();
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
      {
        count: unresolvedCount,
        label: IS_PUBLIC_DATA ? "Not calculated" : "No valid geocode",
      },
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
    const tableMetrics = metrics.slice(0, 300);
    const cardMetrics = metrics.slice(0, 100);
    elements.facilityTableBody.innerHTML = tableMetrics
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
              <small>${escapeHtml(
                facility.nearestStop?.name ||
                  (Number.isFinite(facility.lat)
                    ? "Zoom in to calculate closest stops"
                    : "No valid geocode"),
              )}</small>
            </td>
            <td>${facility.stopCount ?? "—"}</td>
          </tr>
        `,
      )
      .join("");

    elements.facilityCards.innerHTML = cardMetrics
      .map(
        (facility) => `
          <article>
            <button data-facility="${facility.ccn}" type="button">
              <strong>${escapeHtml(facility.name)}</strong>
              <span>${escapeHtml(facility.city)}, ${facility.state}</span>
            </button>
            <dl>
              <div><dt>Nearest stop</dt><dd>${formatDistance(facility.nearestDistance)}</dd></div>
              <div><dt>Closest 3 in radius</dt><dd>${facility.stopCount ?? "—"}</dd></div>
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
    setMetric("metric-facilities", results.metrics.length.toLocaleString());
    setMetric("metric-within", facilitiesWithin.toLocaleString());
    setMetric("metric-percentage", `${percentage.toFixed(1)}%`);
    setMetric("metric-median", formatDistance(median));
    setMetric(
      "metric-quartiles",
      lowerQuartile === null
        ? "—"
        : `${formatDistance(lowerQuartile)} / ${formatDistance(upperQuartile)}`,
    );
    setMetric("metric-stops", results.stops.length.toLocaleString());
    const geocodeMessage = IS_PUBLIC_DATA
      ? `${(
          DATA.metadata.facilityCount -
          DATA.metadata.geocodedFacilityCount
        ).toLocaleString()} nationwide CMS record${
          DATA.metadata.facilityCount -
            DATA.metadata.geocodedFacilityCount ===
          1
            ? ""
            : "s"
        } could not be Census-geocoded and are not mapped.`
      : `${results.unresolvedInPopulation} unresolved geocode` +
        `${results.unresolvedInPopulation === 1 ? "" : "s"} excluded from spatial analytics.`;
    const transitMessage = !IS_PUBLIC_DATA
      ? ""
      : transitLoadState === "zoom"
        ? ` Zoom to level ${TRANSIT_MIN_ZOOM} or closer to identify each facility's three closest BTS stops.`
        : transitLoadState === "loading"
          ? " Loading BTS candidates and selecting the three closest stops per facility…"
          : transitLoadState === "limited"
            ? ` Closest-stop selection evaluated the first ${TRANSIT_RECORD_LIMIT.toLocaleString()} BTS candidates in this viewport; zoom in for a complete local result.`
            : transitLoadState === "error"
              ? " BTS transit stops are temporarily unavailable for this viewport."
              : " Showing up to three closest BTS stops for each visible CMS facility; shared stops are displayed once.";
    elements.analyticsExcluded.textContent = geocodeMessage + transitMessage;
    elements.resultCount.textContent =
      `${results.metrics.length.toLocaleString()} row${results.metrics.length === 1 ? "" : "s"}` +
      `${results.metrics.length > 300 ? " · first 300 displayed" : ""}`;
    elements.facilityFilterCount.textContent =
      `${results.metrics.length.toLocaleString()} of ${DATA.facilities.length.toLocaleString()} records shown`;
    renderTransitFilterStatus(results);
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
        ${detailRow("Closest 3 in threshold", facility.stopCount === null ? "Not calculated" : String(facility.stopCount))}
        ${detailRow("Source snapshot", escapeHtml(facility.snapshotDate))}
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
        ${detailRow("Source object ID", String(stop.objectId ?? stop.sourceObjectId))}
        ${detailRow("Stop ID", escapeHtml(stop.stopId))}
        ${detailRow("Type", escapeHtml(stop.type))}
        ${detailRow("Agency", escapeHtml(stop.agency))}
        ${detailRow("NTD ID", escapeHtml(stop.ntdId))}
        ${detailRow("Wheelchair field", escapeHtml(stop.wheelchair))}
        ${detailRow("Closest-stop match", `${stop.relatedFacilityCount || 1} visible facilit${(stop.relatedFacilityCount || 1) === 1 ? "y" : "ies"}`)}
        ${detailRow("Source snapshot", escapeHtml(stop.snapshotDate))}
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

  function transitStopType(attributes) {
    if (attributes.stop_type_text) {
      return String(attributes.stop_type_text).replace(/^"+|"+$/g, "");
    }
    return (
      {
        0: "Stop or platform",
        1: "Station",
        2: "Station entrance or exit",
        3: "Generic node",
        4: "Boarding area",
      }[String(attributes.location_type)] || "Transit stop"
    );
  }

  function wheelchairStatus(value) {
    if (String(value) === "1") return "Indicated accessible";
    if (String(value) === "2") return "Indicated not accessible";
    return "Unknown";
  }

  function mapTransitFeature(feature) {
    const attributes = feature.attributes || {};
    const lat = Number(attributes.stop_lat);
    const lng = Number(attributes.stop_lon);
    return {
      agency: attributes.ntd_id
        ? `NTD ${attributes.ntd_id}`
        : "Agency not listed",
      id: `bts-${attributes.OBJECTID}`,
      lat,
      lng,
      name: attributes.stop_name || "Unnamed transit stop",
      ntdId: attributes.ntd_id || "",
      objectId: String(attributes.OBJECTID || ""),
      snapshotDate:
        attributes.download_date ||
        DATA.metadata.transitSnapshotDate ||
        DATA.metadata.preparedAt,
      state: state.selectedState || "",
      stopId: attributes.stop_id || "",
      type: transitStopType(attributes),
      wheelchair: wheelchairStatus(attributes.wheelchair_boarding),
    };
  }

  async function loadTransitStopsForViewport() {
    if (!IS_PUBLIC_DATA || !googleMap || !state.layers.transit) return;
    if (state.zoom < TRANSIT_MIN_ZOOM) {
      const hadStops =
        DATA.stops.length > 0 || transitCandidateStops.length > 0;
      clearRuntimeTransitStops("zoom");
      if (hadStops) {
        renderAll();
      }
      return;
    }

    const bounds = state.extentBounds;
    const queryKey = [
      bounds.west,
      bounds.south,
      bounds.east,
      bounds.north,
    ]
      .map((value) => Number(value).toFixed(4))
      .join(",");
    if (queryKey === lastTransitQueryKey) return;
    lastTransitQueryKey = queryKey;
    transitFetchController?.abort();
    const requestController = new AbortController();
    transitFetchController = requestController;
    transitLoadState = "loading";
    elements.mapLoading.hidden = false;
    renderAnalytics(lastResults);

    const parameters = new URLSearchParams({
      f: "json",
      geometry: `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`,
      geometryType: "esriGeometryEnvelope",
      inSR: "4326",
      orderByFields: "OBJECTID",
      outFields:
        "OBJECTID,ntd_id,stop_id,stop_name,stop_lat,stop_lon,location_type,wheelchair_boarding,stop_type_text,download_date",
      resultRecordCount: String(TRANSIT_RECORD_LIMIT),
      returnGeometry: "false",
      spatialRel: "esriSpatialRelIntersects",
      where: "1=1",
    });

    try {
      const response = await fetch(`${TRANSIT_SERVICE_URL}?${parameters}`, {
        signal: requestController.signal,
      });
      if (!response.ok) {
        throw new Error(`BTS service returned ${response.status}`);
      }
      const payload = await response.json();
      if (payload.error) {
        throw new Error(payload.error.message || "BTS query failed");
      }
      transitCandidateStops = (payload.features || [])
        .map(mapTransitFeature)
        .filter(
          (stop) =>
            Number.isFinite(stop.lat) && Number.isFinite(stop.lng),
        );
      transitLoadState = payload.exceededTransferLimit
        ? "limited"
        : "loaded";
      populateTransitFilterOptions();
      renderAll();
    } catch (error) {
      if (error.name === "AbortError") return;
      lastTransitQueryKey = "";
      transitLoadState = "error";
      transitCandidateStops = [];
      closestStopIdsByFacility = new Map();
      DATA.stops = [];
      populateTransitFilterOptions();
      renderAll();
      showNotice(
        "BTS transit stops could not be loaded for this viewport. The CMS facility layer remains available.",
      );
    } finally {
      if (transitFetchController === requestController) {
        elements.mapLoading.hidden = true;
      }
    }
  }

  function createCenterDistanceHeatmapOverlay() {
    class CenterDistanceHeatmapOverlay extends window.google.maps.OverlayView {
      constructor() {
        super();
        this.animationFrame = null;
        this.canvas = null;
        this.points = [];
      }

      onAdd() {
        this.canvas = document.createElement("canvas");
        this.canvas.className = "center-distance-heatmap-canvas";
        this.getPanes().overlayLayer.append(this.canvas);
      }

      draw() {
        if (!this.canvas) return;
        if (this.animationFrame) {
          window.cancelAnimationFrame(this.animationFrame);
        }
        this.animationFrame = window.requestAnimationFrame(() => {
          this.animationFrame = null;
          this.drawCanvas();
        });
      }

      drawCanvas() {
        const map = this.getMap();
        const projection = this.getProjection();
        if (!map || !projection || !this.canvas) return;
        const mapContainer = map.getDiv();
        const width = mapContainer.clientWidth;
        const height = mapContainer.clientHeight;
        if (!width || !height) return;
        const center = map.getCenter();
        if (!center) return;
        const centerPixel = projection.fromLatLngToDivPixel(center);
        if (!centerPixel) return;
        const left = centerPixel.x - width / 2;
        const top = centerPixel.y - height / 2;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.style.left = `${left}px`;
        this.canvas.style.top = `${top}px`;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.canvas.width = Math.round(width * pixelRatio);
        this.canvas.height = Math.round(height * pixelRatio);

        const context = this.canvas.getContext("2d");
        if (!context) return;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        context.clearRect(0, 0, width, height);
        const zoom = map.getZoom() || 0;
        const cellSize = Math.max(12, 34 - zoom * 1.5);
        const buckets = new Map();

        this.points.forEach((point) => {
          const pixel = projection.fromLatLngToDivPixel(
            new window.google.maps.LatLng(point.lat, point.lng),
          );
          if (!pixel) return;
          const x = pixel.x - left;
          const y = pixel.y - top;
          if (x < -80 || x > width + 80 || y < -80 || y > height + 80) {
            return;
          }
          const key =
            `${Math.floor(x / cellSize)}:` + `${Math.floor(y / cellSize)}`;
          const bucket = buckets.get(key) || {
            count: 0,
            normalizedDistance: 0,
            x: 0,
            y: 0,
          };
          bucket.count += 1;
          bucket.normalizedDistance += point.normalizedDistance;
          bucket.x += x;
          bucket.y += y;
          buckets.set(key, bucket);
        });

        const heatPoints = [...buckets.values()]
          .map((bucket) => ({
            count: bucket.count,
            normalizedDistance:
              bucket.normalizedDistance / bucket.count,
            x: bucket.x / bucket.count,
            y: bucket.y / bucket.count,
          }))
          .sort(
            (first, second) =>
              second.normalizedDistance - first.normalizedDistance,
          );
        const baseRadius = Math.max(24, Math.min(64, 25 + zoom * 2.5));

        heatPoints.forEach((point) => {
          const [red, green, blue] = heatmapColor(
            point.normalizedDistance,
          );
          const radius =
            baseRadius * Math.min(1.45, 1 + Math.log2(point.count) * 0.08);
          const gradient = context.createRadialGradient(
            point.x,
            point.y,
            0,
            point.x,
            point.y,
            radius,
          );
          gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, 0.72)`);
          gradient.addColorStop(0.35, `rgba(${red}, ${green}, ${blue}, 0.42)`);
          gradient.addColorStop(0.72, `rgba(${red}, ${green}, ${blue}, 0.16)`);
          gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);
          context.fillStyle = gradient;
          context.beginPath();
          context.arc(point.x, point.y, radius, 0, Math.PI * 2);
          context.fill();
        });
      }

      onRemove() {
        if (this.animationFrame) {
          window.cancelAnimationFrame(this.animationFrame);
        }
        this.canvas?.remove();
        this.animationFrame = null;
        this.canvas = null;
      }

      setPoints(points) {
        this.points = points;
        this.draw();
      }
    }

    return new CenterDistanceHeatmapOverlay();
  }

  function updateCenterDistanceHeatmap(facilities) {
    if (!state.layers.centerDistanceHeatmap) {
      elements.centerDistanceHeatmapLegend.hidden = true;
      centerDistanceHeatmapOverlay?.setMap(null);
      centerDistanceHeatmapOverlay = null;
      return null;
    }

    elements.centerDistanceHeatmapLegend.hidden = false;
    if (heatmapFacilitiesCache !== facilities) {
      heatmapFacilitiesCache = facilities;
      heatmapSummaryCache = calculateNearestFacilityDistances(facilities);
    }
    if (!heatmapSummaryCache?.points.length) {
      elements.centerDistanceHeatmapScale.textContent =
        "At least two visible, geocoded facilities are required.";
      centerDistanceHeatmapOverlay?.setPoints([]);
      return heatmapSummaryCache;
    }

    elements.centerDistanceHeatmapScale.textContent =
      `Green ≤ ${formatDistance(heatmapSummaryCache.lowerDistance)} · ` +
      `red ≥ ${formatDistance(heatmapSummaryCache.upperDistance)}`;
    if (!centerDistanceHeatmapOverlay) {
      centerDistanceHeatmapOverlay = createCenterDistanceHeatmapOverlay();
      centerDistanceHeatmapOverlay.setMap(googleMap);
    }
    centerDistanceHeatmapOverlay.setPoints(heatmapSummaryCache.points);
    return heatmapSummaryCache;
  }

  function renderMapOverlays() {
    if (!googleMap || !AdvancedMarkerElement) return;
    clearMapMarkers();
    const results = lastResults.metrics.length
      ? lastResults
      : calculateResults();
    const useClusters = state.zoom < 8;
    const heatmapSummary = updateCenterDistanceHeatmap(results.metrics);
    const heatmapPointByFacility = new Map(
      (heatmapSummary?.points || []).map((point) => [point.ccn, point]),
    );

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
            onClick: () => {
              if (state.selectedState === stateCode && googleMap) {
                googleMap.setZoom(Math.max(8, state.zoom + 2));
              } else {
                applySelectedState(stateCode);
              }
            },
            position: clusterPosition(records),
            title: `${records.length.toLocaleString()} dialysis facilities in ${STATE_VIEWS[stateCode]?.name || stateCode}`,
          });
        });
      } else {
        mappableFacilities.forEach((facility) => {
          const heatmapPoint = heatmapPointByFacility.get(facility.ccn);
          addMapMarker({
            kind: "facility",
            label: "+",
            onClick: () => selectFacility(facility.ccn, false),
            position: { lat: facility.lat, lng: facility.lng },
            selected: state.selectedFacility?.ccn === facility.ccn,
            title: heatmapPoint
              ? `${facility.name}. Nearest other dialysis center: ${formatDistance(heatmapPoint.nearestDistance)}.`
              : facility.name,
          });
        });
      }
    }

    if (state.layers.transit && (!IS_PUBLIC_DATA || !useClusters)) {
      if (useClusters) {
        groupByState(results.stops).forEach((records, stateCode) => {
          addMapMarker({
            cluster: true,
            kind: "transit",
            label: String(records.length),
            onClick: () => applySelectedState(stateCode),
            position: clusterPosition(records),
            title: `${records.length.toLocaleString()} transit stops in ${STATE_VIEWS[stateCode]?.name || stateCode}`,
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
    centerDistanceHeatmapOverlay?.setMap(null);
    centerDistanceHeatmapOverlay = null;
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
    const suggestionList = $("#facility-location-suggestions");
    const suggestions = new Set();
    DATA.facilities.forEach((facility) => {
      suggestions.add(facility.city);
      suggestions.add(`${facility.city}, ${facility.state}`);
      suggestions.add(facility.zip);
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
          if (
            IS_PUBLIC_DATA &&
            state.selectedState &&
            state.zoom >
              (STATE_VIEWS[state.selectedState]?.zoom || 6) + 1
          ) {
            state.selectedState = "";
            elements.stateSelect.value = "";
            elements.regionReadout.textContent = "Current map viewport";
            elements.extentDescription.textContent =
              "Current map viewport—not an administrative-area statistic";
          }
          updateMapReadout();
          if (IS_PUBLIC_DATA || !state.selectedState) renderAll();
          else renderMapOverlays();
          updateUrl();
          loadTransitStopsForViewport();
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
      showNotice(
        IS_PUBLIC_DATA
          ? "The Google basemap and nationwide CMS facility snapshot are ready. Zoom in to show the three closest BTS stops per facility."
          : "The live Google basemap and demonstration layers are ready.",
      );
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
    clearRuntimeTransitStops("loading");
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

  function navigateToFacilityResult(query) {
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
    clearRuntimeTransitStops("loading");

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
      `Map moved to ${mappableMatches[0].city} using the facility index.`,
    );
    updateUrl();
    return true;
  }

  async function navigateToPlace(query) {
    if (navigateToFacilityResult(query)) return;
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
        if (!navigateToFacilityResult(query)) {
          showNotice(`No map result was found for “${query}”.`);
        }
        return;
      }
      navigateToGoogleResult(result.formatted_address, result.geometry);
    } catch {
      if (!navigateToFacilityResult(query)) {
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
    if (state.layers.centerDistanceHeatmap) parameters.set("heatmap", "on");
    Object.entries(state.filters).forEach(([key, value]) => {
      if (key === "inCenter") {
        if (value) parameters.set("inCenter", "yes");
      } else if (key === "withinRadius") {
        if (value) parameters.set("withinRadius", "yes");
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
    state.layers.centerDistanceHeatmap = parameters.get("heatmap") === "on";

    const filterKeys = [
      "agency",
      "chain",
      "chainOwned",
      "geocode",
      "lateShift",
      "ownership",
      "stationsMax",
      "stationsMin",
      "stopQuery",
      "stopType",
      "wheelchair",
    ];
    filterKeys.forEach((key) => {
      if (parameters.has(key)) state.filters[key] = parameters.get(key);
    });
    state.filters.inCenter = parameters.get("inCenter") === "yes";
    state.filters.withinRadius = parameters.get("withinRadius") === "yes";

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
    $("#filter-stop-query").value = state.filters.stopQuery;
    $("#filter-stop-type").value = state.filters.stopType;
    $("#filter-within-radius").checked = state.filters.withinRadius;
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
        clearRuntimeTransitStops("loading");
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
      inCenter: false,
      lateShift: "",
      ownership: "",
      stationsMax: "",
      stationsMin: "",
      stopQuery: "",
      stopType: "",
      withinRadius: false,
      wheelchair: "",
    };
    syncControlsFromState();
    renderAll();
    updateUrl();
    showNotice("All filters were reset to Phase 1 defaults.");
  }

  function resetTransitFilters() {
    state.filters.agency = "";
    state.filters.stopQuery = "";
    state.filters.stopType = "";
    state.filters.wheelchair = "";
    state.filters.withinRadius = false;
    syncControlsFromState();
    renderAll();
    updateUrl();
    showNotice("Transit filters were cleared.");
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
      "closest_3_stops_within_threshold",
      "geocode_status",
      "cms_ccn",
      "facility_latitude",
      "facility_longitude",
      "geocode_benchmark",
      "nearest_stop_id",
      "nearest_stop_latitude",
      "nearest_stop_longitude",
      "active_threshold_m",
      "transit_stop_name_or_id_filter",
      "transit_stop_type_filter",
      "transit_wheelchair_filter",
      "transit_agency_filter",
      "transit_limited_to_active_threshold",
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
      state.filters.stopQuery,
      state.filters.stopType,
      state.filters.wheelchair,
      state.filters.agency,
      state.filters.withinRadius ? "yes" : "no",
      currentExtentLabel(),
      facility.snapshotDate,
      facility.nearestStop?.snapshotDate ??
        DATA.metadata.transitSnapshotDate ??
        DATA.metadata.preparedAt,
      exportedAt,
      DATA.metadata.mode,
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
      `${rows.length.toLocaleString()} facility row${rows.length === 1 ? "" : "s"} exported.`,
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
        if (
          toggle.dataset.layerToggle === "transit" &&
          toggle.checked
        ) {
          lastTransitQueryKey = "";
          loadTransitStopsForViewport();
        }
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

    $("#filters-form").addEventListener("change", () => {
      window.clearTimeout(filterInputTimer);
      updateFilterState();
    });
    $("#filters-form").addEventListener("input", (event) => {
      if (event.target.type === "number") {
        updateFilterState();
      } else if (event.target.id === "filter-stop-query") {
        window.clearTimeout(filterInputTimer);
        filterInputTimer = window.setTimeout(updateFilterState, 180);
      }
    });
    $("#reset-filters").addEventListener("click", resetFilters);
    $("#reset-transit-filters").addEventListener(
      "click",
      resetTransitFilters,
    );

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
    buildStateViews();
    populateFilterOptions();
    populateLocationSuggestions();
    restoreStateFromUrl();
    syncControlsFromState();
    bindEvents();
    updateLayerState();
    renderAll();

    if (IS_PUBLIC_DATA) {
      const preparedDate = DATA.metadata.preparedAt || "current build";
      $("#methods-prepared-date").textContent =
        `${preparedDate} · ${DATA.metadata.facilityCount.toLocaleString()} CMS facilities`;
      $("#snapshot-readout").textContent =
        `${DATA.metadata.geocodedFacilityCount.toLocaleString()} geocoded of ${DATA.metadata.facilityCount.toLocaleString()} CMS facilities`;
    } else {
      $("#methods-prepared-date").textContent =
        DATA.metadata.preparedAt || "Fallback fixture";
      $("#snapshot-readout").textContent =
        `${DATA.facilities.length} fallback test facilities`;
    }

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
    calculateNearestFacilityDistances,
    distanceMeters,
    exportCsv,
    formatDistance,
    getState: () => JSON.parse(JSON.stringify(state)),
    percentile,
    heatmapColor,
    selectClosestStopsForFacilities,
    stopMatchesTransitFilters,
    updateRadius,
  };

  if (!window.DIALYSIS_TRANSIT_DISABLE_AUTO_INIT) {
    initialize();
  }
})();
