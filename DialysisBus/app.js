(() => {
  "use strict";

  const MAP_STORAGE_KEY = "dialysisTransitGoogleMaps";
  const MAP_CALLBACK = "__dialysisTransitGoogleMapsReady";
  const NATIONAL_VIEW = {
    center: { lat: 39.8283, lng: -98.5795 },
    name: "United States",
    zoom: 4,
  };
  const stateViews = {
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

  const workspace = document.querySelector("#workspace");
  const panelOpen = document.querySelector("#panel-open");
  const panelClose = document.querySelector("#panel-close");
  const tabs = [...document.querySelectorAll("[role='tab']")];
  const panels = [...document.querySelectorAll("[role='tabpanel']")];
  const layerToggles = [
    ...document.querySelectorAll("[data-layer-toggle]"),
  ];
  const layerCount = document.querySelector("#layer-count");
  const layerAnnouncement = document.querySelector("#layer-announcement");
  const stateSelect = document.querySelector("#state-select");
  const extentDescription = document.querySelector("#extent-description");
  const regionReadout = document.querySelector("#region-readout");
  const mapStateReadout = document.querySelector("#map-state-readout");
  const radiusReadout = document.querySelector("#radius-readout");
  const radiusButtons = [...document.querySelectorAll("[data-radius]")];
  const noticeBar = document.querySelector("#notice-bar");
  const noticeText = document.querySelector("#notice-text");
  const mapSetupBackdrop = document.querySelector("#map-setup-backdrop");
  const mapSetupForm = document.querySelector("#map-setup");
  const mapSetupStatus = document.querySelector("#map-setup-status");
  const mapApiKey = document.querySelector("#map-api-key");
  const mapId = document.querySelector("#map-id");
  const mapConnect = document.querySelector("#map-connect");
  const mapConnectionStatus = document.querySelector(
    "#map-connection-status",
  );
  const mapConnectionText = document.querySelector("#map-connection-text");
  const forgetMapKey = document.querySelector("#forget-map-key");

  let googleMap = null;
  let geocoder = null;
  let radius = 400;
  let zoom = NATIONAL_VIEW.zoom;
  let pendingCredentials = null;

  function setActiveTab(tabName, focus = false) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.tab === tabName;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      if (isActive && focus) tab.focus();
    });

    panels.forEach((panel) => {
      panel.hidden = panel.id !== `panel-${tabName}`;
    });
  }

  function updateLayerState() {
    const activeLayers = layerToggles
      .filter((toggle) => toggle.checked)
      .map((toggle) => toggle.dataset.layerToggle);

    layerCount.textContent = `${activeLayers.length} selected`;
    const facilityState = activeLayers.includes("facility") ? "on" : "off";
    const transitState = activeLayers.includes("transit") ? "on" : "off";
    layerAnnouncement.textContent =
      `Dialysis layer ${facilityState}. Transit layer ${transitState}. ` +
      `Threshold ${radius} meters.`;
  }

  function updateMapReadout() {
    mapStateReadout.textContent =
      `${radius.toLocaleString()} m threshold · zoom ${Math.round(zoom)}`;
  }

  function selectRadius(nextRadius) {
    radius = nextRadius;
    radiusReadout.textContent = `${radius.toLocaleString()} m`;
    radiusButtons.forEach((button) => {
      const selected = Number(button.dataset.radius) === radius;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    updateMapReadout();
    updateLayerState();
  }

  function selectState(stateCode) {
    const view = stateViews[stateCode] || NATIONAL_VIEW;
    regionReadout.textContent = view.name;
    extentDescription.textContent = stateCode
      ? `${view.name} selected-state extent`
      : "Current national viewport";
    zoom = view.zoom;

    if (googleMap) {
      googleMap.panTo(view.center);
      googleMap.setZoom(view.zoom);
    }

    updateMapReadout();
  }

  function showNotice(message) {
    noticeText.textContent = message;
    noticeBar.hidden = false;
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
      // Storage can be unavailable in privacy modes; the page can still reload.
    }
  }

  function setSetupStatus(message, isError = false) {
    mapSetupStatus.textContent = message;
    mapSetupStatus.classList.toggle("is-error", isError);
  }

  function setConnectionStatus(message, connected = false) {
    mapConnectionText.textContent = message;
    mapConnectionStatus.classList.toggle("is-connected", connected);
  }

  function handleMapLoadFailure(message) {
    googleMap = null;
    geocoder = null;
    mapSetupBackdrop.hidden = false;
    mapConnect.disabled = false;
    mapConnect.textContent = "Try again";
    setSetupStatus(message, true);
    setConnectionStatus("Map connection failed");
    clearCredentials();
  }

  async function initializeGoogleMap() {
    try {
      const [{ Map }, { Geocoder }] = await Promise.all([
        window.google.maps.importLibrary("maps"),
        window.google.maps.importLibrary("geocoding"),
      ]);
      const selectedView = stateViews[stateSelect.value] || NATIONAL_VIEW;
      const options = {
        center: selectedView.center,
        clickableIcons: false,
        fullscreenControl: false,
        gestureHandling: "cooperative",
        mapId: pendingCredentials.mapId || "DEMO_MAP_ID",
        mapTypeControl: false,
        streetViewControl: false,
        zoom: selectedView.zoom,
        zoomControl: false,
      };

      googleMap = new Map(document.querySelector("#google-map"), options);
      geocoder = new Geocoder();
      zoom = selectedView.zoom;

      googleMap.addListener("zoom_changed", () => {
        const currentZoom = googleMap.getZoom();
        if (typeof currentZoom === "number") {
          zoom = currentZoom;
          updateMapReadout();
        }
      });

      saveCredentials(pendingCredentials);
      mapSetupBackdrop.hidden = true;
      mapConnect.disabled = false;
      mapConnect.textContent = "Load Google map";
      forgetMapKey.hidden = false;
      setConnectionStatus("Google Maps connected", true);
      updateMapReadout();
      showNotice("The live Google basemap is connected.");
    } catch {
      handleMapLoadFailure(
        "Google Maps loaded but could not initialize. Check that Maps JavaScript API and Geocoding API are enabled.",
      );
    }
  }

  function loadGoogleMaps(credentials) {
    if (!credentials.apiKey) {
      setSetupStatus("Enter a Google Maps Platform browser key.", true);
      mapApiKey.focus();
      return;
    }

    pendingCredentials = credentials;
    mapConnect.disabled = true;
    mapConnect.textContent = "Connecting…";
    setSetupStatus("Requesting the Google Maps JavaScript API…");
    setConnectionStatus("Connecting Google Maps");

    if (window.google?.maps?.importLibrary) {
      initializeGoogleMap();
      return;
    }

    document.querySelector("#google-maps-api")?.remove();
    window[MAP_CALLBACK] = initializeGoogleMap;
    window.gm_authFailure = () => {
      handleMapLoadFailure(
        "Google rejected this key. Check its API enablement, billing, and localhost referrer restriction.",
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
        "The Google Maps script could not load. Check the internet connection and key restrictions.",
      );
    };
    document.head.append(script);
  }

  async function navigateToPlace(query) {
    if (!googleMap || !geocoder) {
      showNotice("Connect Google Maps before searching for a place.");
      mapSetupBackdrop.hidden = false;
      mapApiKey.focus();
      return;
    }

    try {
      const response = await geocoder.geocode({
        address: query,
        region: "US",
      });
      const result = response.results[0];
      if (!result) {
        showNotice(`No map result was found for “${query}”.`);
        return;
      }

      stateSelect.value = "";
      regionReadout.textContent = result.formatted_address;
      extentDescription.textContent = "Custom place search extent";
      if (result.geometry.viewport) {
        googleMap.fitBounds(result.geometry.viewport);
      } else {
        googleMap.panTo(result.geometry.location);
        googleMap.setZoom(14);
      }
      showNotice(`Map moved to ${result.formatted_address}.`);
    } catch {
      showNotice(
        "Google could not complete that place search. Check that Geocoding API is enabled for this key.",
      );
    }
  }

  tabs.forEach((tab, index) => {
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

  layerToggles.forEach((toggle) => {
    toggle.addEventListener("change", updateLayerState);
  });

  radiusButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectRadius(Number(button.dataset.radius));
    });
  });

  stateSelect.addEventListener("change", () => {
    selectState(stateSelect.value);
  });

  panelClose.addEventListener("click", () => {
    workspace.classList.add("workspace--panel-closed");
    panelOpen.hidden = false;
  });

  panelOpen.addEventListener("click", () => {
    workspace.classList.remove("workspace--panel-closed");
    panelOpen.hidden = true;
    panelClose.focus();
  });

  document.querySelector("#methods-shortcut").addEventListener("click", () => {
    workspace.classList.remove("workspace--panel-closed");
    panelOpen.hidden = true;
    setActiveTab("methods", true);
  });

  document.querySelector("#zoom-in").addEventListener("click", () => {
    const nextZoom = Math.min(22, zoom + 1);
    if (googleMap) googleMap.setZoom(nextZoom);
    zoom = nextZoom;
    updateMapReadout();
  });

  document.querySelector("#zoom-out").addEventListener("click", () => {
    const nextZoom = Math.max(0, zoom - 1);
    if (googleMap) googleMap.setZoom(nextZoom);
    zoom = nextZoom;
    updateMapReadout();
  });

  document.querySelector("#reset-view").addEventListener("click", () => {
    stateSelect.value = "";
    selectState("");
  });

  document.querySelector("#location-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const query = document.querySelector("#location-search").value.trim();
    if (query) {
      navigateToPlace(query);
    } else {
      showNotice("Enter a city, ZIP code, or address to navigate.");
    }
  });

  mapSetupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loadGoogleMaps({
      apiKey: mapApiKey.value.trim(),
      mapId: mapId.value.trim(),
    });
  });

  document.querySelector("#toggle-api-key").addEventListener("click", () => {
    const showKey = mapApiKey.type === "password";
    mapApiKey.type = showKey ? "text" : "password";
    document.querySelector("#toggle-api-key").textContent = showKey
      ? "Hide"
      : "Show";
  });

  forgetMapKey.addEventListener("click", () => {
    clearCredentials();
    window.location.reload();
  });

  document.querySelector("#notice-close").addEventListener("click", () => {
    noticeBar.hidden = true;
    document.querySelector("#location-search").focus();
  });

  updateLayerState();
  updateMapReadout();

  const storedCredentials = readStoredCredentials();
  if (storedCredentials) {
    mapId.value = storedCredentials.mapId;
    loadGoogleMaps(storedCredentials);
  } else if (window.location.protocol === "file:") {
    setSetupStatus(
      "For a safely restricted key, serve this folder at http://localhost:8080 instead of opening the file directly.",
    );
  }
})();
