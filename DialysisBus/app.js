(() => {
  "use strict";

  const stateViews = {
    AZ: { name: "Arizona", zoom: 6 },
    CA: { name: "California", zoom: 6 },
    CO: { name: "Colorado", zoom: 7 },
    FL: { name: "Florida", zoom: 6 },
    IL: { name: "Illinois", zoom: 7 },
    NY: { name: "New York", zoom: 7 },
    TX: { name: "Texas", zoom: 6 },
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

  let radius = 400;
  let zoom = 4;

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

    layerToggles.forEach((toggle) => {
      const layer = toggle.dataset.layerToggle;
      document.querySelectorAll(`[data-layer="${layer}"]`).forEach((marker) => {
        marker.hidden = !toggle.checked;
      });
    });

    layerCount.textContent = `${activeLayers.length} active`;
    const facilityState = activeLayers.includes("facility") ? "on" : "off";
    const transitState = activeLayers.includes("transit") ? "on" : "off";
    layerAnnouncement.textContent =
      `Dialysis layer ${facilityState}. Transit layer ${transitState}. ` +
      `Threshold ${radius} meters.`;
  }

  function updateMapReadout() {
    mapStateReadout.textContent =
      `${radius.toLocaleString()} m threshold · zoom ${zoom}`;
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
    const state = stateViews[stateCode];
    if (!state) {
      regionReadout.textContent = "United States";
      extentDescription.textContent = "Current national viewport";
      zoom = 4;
    } else {
      regionReadout.textContent = state.name;
      extentDescription.textContent = `${state.name} selected-state extent`;
      zoom = state.zoom;
    }
    updateMapReadout();
  }

  function showNotice(message) {
    noticeText.textContent = message;
    noticeBar.hidden = false;
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
    zoom = Math.min(22, zoom + 1);
    updateMapReadout();
  });

  document.querySelector("#zoom-out").addEventListener("click", () => {
    zoom = Math.max(0, zoom - 1);
    updateMapReadout();
  });

  document.querySelector("#reset-view").addEventListener("click", () => {
    stateSelect.value = "";
    selectState("");
  });

  document.querySelector("#location-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const query = document.querySelector("#location-search").value.trim();
    showNotice(
      query
        ? "Place navigation will activate when the Google Maps integration is configured."
        : "Enter a city, ZIP code, or address to navigate.",
    );
  });

  document.querySelector("#notice-close").addEventListener("click", () => {
    noticeBar.hidden = true;
    document.querySelector("#location-search").focus();
  });

  updateLayerState();
  updateMapReadout();
})();
