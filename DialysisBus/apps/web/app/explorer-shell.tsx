"use client";

import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { FormEvent, useEffect, useRef, useState } from "react";

type Coordinates = {
  lat: number;
  lng: number;
};

type MapInstance = {
  setCenter(center: Coordinates): void;
  setZoom(zoom: number): void;
};

type MapsNamespace = {
  Map: new (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => MapInstance;
};

declare global {
  interface Window {
    google?: {
      maps: MapsNamespace;
    };
    initializeDialysisTransitMap?: () => void;
  }
}

const NATIONAL_VIEW = { center: { lat: 39.5, lng: -98.35 }, zoom: 4 };
const PROXIMITY_RADIUS_METERS = 400;

const STATE_VIEWS: Record<string, { center: Coordinates; zoom: number }> = {
  AZ: { center: { lat: 34.25, lng: -111.75 }, zoom: 6 },
  CA: { center: { lat: 37.2, lng: -119.7 }, zoom: 6 },
  CO: { center: { lat: 39.0, lng: -105.5 }, zoom: 7 },
  FL: { center: { lat: 28.2, lng: -82.2 }, zoom: 6 },
  IL: { center: { lat: 40.0, lng: -89.2 }, zoom: 7 },
  NY: { center: { lat: 42.9, lng: -75.4 }, zoom: 7 },
  TX: { center: { lat: 31.0, lng: -99.3 }, zoom: 6 },
};

const TABS = [
  { id: "layers", label: "Layers" },
  { id: "filters", label: "Filters" },
  { id: "analytics", label: "Analytics" },
  { id: "methods", label: "Data & Methods" },
] as const;

type TabId = (typeof TABS)[number]["id"];
type MapStatus = "loading" | "ready" | "preview" | "error";
type ApiStatus = "checking" | "online" | "offline";

function ToggleRow({
  checked,
  detail,
  icon,
  label,
  onChange,
}: {
  checked: boolean;
  detail: string;
  icon: "facility" | "transit";
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="toggle-row">
      <span className={`legend-symbol legend-symbol--${icon}`} aria-hidden="true" />
      <span className="toggle-copy">
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <span className="switch">
        <input
          aria-label={label}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
        />
        <span aria-hidden="true" />
      </span>
    </label>
  );
}

export function ExplorerShell() {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapInstance | null>(null);
  const overlay = useRef<GoogleMapsOverlay | null>(null);
  const [mapStatus, setMapStatus] = useState<MapStatus>(() =>
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? "loading" : "preview",
  );
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const [activeTab, setActiveTab] = useState<TabId>("layers");
  const [panelOpen, setPanelOpen] = useState(true);
  const [selectedState, setSelectedState] = useState("");
  const [zoom, setZoom] = useState(NATIONAL_VIEW.zoom);
  const [facilitiesVisible, setFacilitiesVisible] = useState(true);
  const [stopsVisible, setStopsVisible] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchNotice, setSearchNotice] = useState("");

  useEffect(() => {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 3500);

    fetch(`${apiBase}/health/live`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then((response) => setApiStatus(response.ok ? "online" : "offline"))
      .catch(() => setApiStatus("offline"))
      .finally(() => window.clearTimeout(timeout));

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;

    if (!apiKey) return;

    let cancelled = false;

    const initialize = () => {
      if (cancelled || !mapElement.current || !window.google?.maps) {
        return;
      }

      const nextMap = new window.google.maps.Map(mapElement.current, {
        center: NATIONAL_VIEW.center,
        zoom: NATIONAL_VIEW.zoom,
        mapId: mapId || undefined,
        clickableIcons: false,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
      });

      const nextOverlay = new GoogleMapsOverlay({ layers: [] });
      nextOverlay.setMap(
        nextMap as Parameters<GoogleMapsOverlay["setMap"]>[0],
      );

      map.current = nextMap;
      overlay.current = nextOverlay;
      setMapStatus("ready");
    };

    if (window.google?.maps) {
      initialize();
      return () => {
        cancelled = true;
        overlay.current?.setMap(null);
      };
    }

    window.initializeDialysisTransitMap = initialize;
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-dialysis-maps="true"]',
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.dataset.dialysisMaps = "true";
      script.onerror = () => setMapStatus("error");
      script.src =
        "https://maps.googleapis.com/maps/api/js" +
        `?key=${encodeURIComponent(apiKey)}` +
        "&v=weekly&loading=async&callback=initializeDialysisTransitMap";
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      overlay.current?.setMap(null);
      delete window.initializeDialysisTransitMap;
    };
  }, []);

  function selectState(value: string) {
    setSelectedState(value);
    const view = value ? STATE_VIEWS[value] : NATIONAL_VIEW;
    setZoom(view.zoom);
    map.current?.setCenter(view.center);
    map.current?.setZoom(view.zoom);
  }

  function resetNational() {
    setSelectedState("");
    setZoom(NATIONAL_VIEW.zoom);
    map.current?.setCenter(NATIONAL_VIEW.center);
    map.current?.setZoom(NATIONAL_VIEW.zoom);
  }

  function adjustZoom(delta: number) {
    const nextZoom = Math.min(22, Math.max(0, zoom + delta));
    setZoom(nextZoom);
    map.current?.setZoom(nextZoom);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!searchText.trim()) {
      setSearchNotice("Enter a city, ZIP code, or address to navigate.");
      return;
    }
    setSearchNotice(
      "Place navigation will activate with the configured Google Places integration.",
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <div>
            <h1 className="brand-title">Dialysis Bus</h1>
            <p className="brand-subtitle">
              A Nationwide Dialysis & Transit Public Data Explorer
            </p>
          </div>
        </div>

        <form className="location-search" onSubmit={submitSearch}>
          <label className="sr-only" htmlFor="location-search">
            Search by city, ZIP code, or address
          </label>
          <span aria-hidden="true" className="search-glyph" />
          <input
            id="location-search"
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="City, ZIP code, or address"
            type="search"
            value={searchText}
          />
          <button type="submit">Go</button>
        </form>

        <div className="topbar-actions">
          <button
            className="text-button"
            onClick={() => {
              setActiveTab("methods");
              setPanelOpen(true);
            }}
            type="button"
          >
            Data & methods
          </button>
          <span
            className={`api-status api-status--${apiStatus}`}
            title={
              apiStatus === "online"
                ? "The local API health check succeeded."
                : "The interface is available; the data API is not connected."
            }
          >
            <span aria-hidden="true" />
            {apiStatus === "online"
              ? "API ready"
              : apiStatus === "checking"
                ? "Checking API"
                : "Shell preview"}
          </span>
        </div>
      </header>

      {searchNotice ? (
        <div className="notice-bar" role="status">
          {searchNotice}
          <button
            aria-label="Dismiss search notice"
            onClick={() => setSearchNotice("")}
            type="button"
          >
            ×
          </button>
        </div>
      ) : null}

      <div className={`workspace ${panelOpen ? "" : "workspace--panel-closed"}`}>
        <aside className="side-panel" aria-label="Explorer controls">
          <div className="panel-heading">
            <nav aria-label="Explorer sections" className="panel-tabs">
              {TABS.map((tab) => (
                <button
                  aria-selected={activeTab === tab.id}
                  className={activeTab === tab.id ? "is-active" : ""}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <button
              aria-label="Collapse explorer controls"
              className="panel-close"
              onClick={() => setPanelOpen(false)}
              type="button"
            >
              ‹
            </button>
          </div>

          <div className="panel-content">
            {activeTab === "layers" ? (
              <>
                <section className="control-section">
                  <div className="section-title">
                    <div>
                      <span>Map layers</span>
                      <small>Illustrative until source ingestion</small>
                    </div>
                    <span className="count-badge">
                      {Number(facilitiesVisible) + Number(stopsVisible)} active
                    </span>
                  </div>
                  <ToggleRow
                    checked={facilitiesVisible}
                    detail="CMS Medicare-certified facilities"
                    icon="facility"
                    label="Dialysis facilities"
                    onChange={setFacilitiesVisible}
                  />
                  <ToggleRow
                    checked={stopsVisible}
                    detail="BTS National Transit Map stops"
                    icon="transit"
                    label="Public transit stops"
                    onChange={setStopsVisible}
                  />
                </section>

                <section className="control-section">
                  <label className="field-label" htmlFor="state-select">
                    Area selector
                  </label>
                  <div className="select-wrap">
                    <select
                      id="state-select"
                      onChange={(event) => selectState(event.target.value)}
                      value={selectedState}
                    >
                      <option value="">National viewport</option>
                      <option value="AZ">Arizona</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="FL">Florida</option>
                      <option value="IL">Illinois</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                    </select>
                  </div>
                </section>

                <button className="primary-action" disabled type="button">
                  Analysis available after data load
                </button>
              </>
            ) : null}

            {activeTab === "filters" ? (
              <section className="empty-panel">
                <span className="empty-icon" aria-hidden="true">
                  ≡
                </span>
                <h2>Filters are staged for source data.</h2>
                <p>
                  Ownership, chain, late-shift, station-count, geocode, stop
                  type, wheelchair, and agency filters will populate from the
                  current snapshots.
                </p>
              </section>
            ) : null}

            {activeTab === "analytics" ? (
              <section className="empty-panel">
                <span className="empty-icon" aria-hidden="true">
                  ▥
                </span>
                <h2>Analytics need a validated snapshot.</h2>
                <p>
                  Summary cards, the distance distribution, facility table,
                  and CSV export remain intentionally empty until reproducible
                  metrics are loaded.
                </p>
              </section>
            ) : null}

            {activeTab === "methods" ? (
              <section className="methods-panel">
                <span className="eyebrow">Interpret with care</span>
                <h2>What this explorer will measure</h2>
                <p>
                  Phase 1 compares approximate facility coordinates with
                  fixed-route transit stops using geodesic straight-line
                  distance.
                </p>
                <dl>
                  <div>
                    <dt>Dialysis source</dt>
                    <dd>CMS Provider Data Catalog</dd>
                  </div>
                  <div>
                    <dt>Transit source</dt>
                    <dd>USDOT/BTS National Transit Map</dd>
                  </div>
                  <div>
                    <dt>Facility geocoding</dt>
                    <dd>U.S. Census Geocoder</dd>
                  </div>
                </dl>
                <div className="caution-card">
                  Proximity does not measure schedules, walking barriers,
                  safety, disability access, weather exposure, or trip
                  feasibility.
                </div>
              </section>
            ) : null}
          </div>

          <footer className="panel-footer">
            <span>Source snapshots</span>
            <strong>Pending first validated import</strong>
          </footer>
        </aside>

        <section className="map-stage" aria-label="National map explorer">
          <div
            aria-label={
              mapStatus === "ready"
                ? "Google Maps national basemap"
                : "Illustrative national basemap preview"
            }
            className="map-host"
            ref={mapElement}
            role="application"
          />

          {mapStatus !== "ready" ? (
            <div className="map-preview" aria-hidden="true">
              <div className="map-land map-land--west" />
              <div className="map-land map-land--east" />
              {facilitiesVisible ? (
                <>
                  <span className="preview-cluster preview-cluster--facility cluster-a">
                    34
                  </span>
                  <span className="preview-cluster preview-cluster--facility cluster-b">
                    18
                  </span>
                  <span className="preview-cluster preview-cluster--facility cluster-c">
                    42
                  </span>
                </>
              ) : null}
              {stopsVisible ? (
                <>
                  <span className="preview-cluster preview-cluster--transit cluster-d">
                    96
                  </span>
                  <span className="preview-cluster preview-cluster--transit cluster-e">
                    61
                  </span>
                  <span className="preview-cluster preview-cluster--transit cluster-f">
                    127
                  </span>
                </>
              ) : null}
            </div>
          ) : null}

          {!panelOpen ? (
            <button
              className="panel-open"
              onClick={() => setPanelOpen(true)}
              type="button"
            >
              <span aria-hidden="true">›</span>
              Explore
            </button>
          ) : null}

          <div className="preview-label">
            <span>{mapStatus === "ready" ? "Basemap ready" : "Interface preview"}</span>
            <small>
              {mapStatus === "error"
                ? "Google Maps could not load"
                : mapStatus === "preview"
                  ? "Add map credentials to enable Google Maps"
                  : "Google Maps + deck.gl"}
            </small>
          </div>

          <div className="map-controls" aria-label="Map controls">
            <button
              aria-label="Zoom in"
              onClick={() => adjustZoom(1)}
              type="button"
            >
              +
            </button>
            <button
              aria-label="Zoom out"
              onClick={() => adjustZoom(-1)}
              type="button"
            >
              −
            </button>
            <button
              aria-label="Reset to national view"
              className="reset-control"
              onClick={resetNational}
              type="button"
            >
              US
            </button>
          </div>

          <div className="map-legend" aria-label="Map legend">
            <strong>Legend</strong>
            <span>
              <i className="legend-symbol legend-symbol--facility" />
              Dialysis facility
            </span>
            <span>
              <i className="legend-symbol legend-symbol--transit" />
              Transit stop
            </span>
            <small>Preview counts are illustrative, not source data.</small>
          </div>

          <div className="map-attribution">
            CMS · U.S. Census Bureau · USDOT/BTS
            {mapStatus !== "ready" ? " · Basemap preview" : ""}
          </div>

          <p className="sr-only" aria-live="polite">
            {facilitiesVisible ? "Dialysis layer on." : "Dialysis layer off."}
            {stopsVisible ? " Transit layer on." : " Transit layer off."}
            {` Threshold ${PROXIMITY_RADIUS_METERS} meters.`}
          </p>
        </section>
      </div>
    </main>
  );
}
