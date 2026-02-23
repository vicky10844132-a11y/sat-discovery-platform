// SAT-DISCOVERY Map Module (Phase 6: OSM primary tiles, Leaflet OSM fallback)
// - OSM tiles (primary: not blocked by ad/content blockers)
// - OSM tiles also in Leaflet fallback for consistency
// - Tile status overlay (↑req ✓loaded ✗errored) — visible without DevTools
// - ResizeObserver + map.resize() for correct canvas sizing
// - Leaflet fallback if MapLibre tiles fail within 2 seconds
// - ?debugMap=1 URL param: verbose tile/worker logging

(function () {
  // Debug mode: enable with ?debugMap=1 in the URL
  const DEBUG_MAP = new URLSearchParams(location.search).has('debugMap');
  // Seconds to wait for tiles before activating Leaflet fallback
  const TILE_FALLBACK_TIMEOUT_MS = 2000;

  // OSM raster tiles: operated by OSM foundation, not blocked by ad-blockers
  const TILE_STYLE = {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: [
          "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ],
        tileSize: 256,
        attribution: "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      }
    },
    layers: [
      // Solid background visible while tiles load (or if they fail)
      { id: "background", type: "background", paint: { "background-color": "#1a3c5e" } },
      { id: "osm", type: "raster", source: "osm" }
    ]
  };

  // --- Status overlay ---
  function createStatusOverlay(container) {
    const el = document.createElement('div');
    el.id = 'map-status-overlay';
    el.className = 'map-status-overlay';
    el.setAttribute('aria-label', 'Map tile status');
    el.textContent = '↑0 ✓0 ✗0';
    container.appendChild(el);
    return el;
  }

  function updateStatusOverlay(el, stats, label) {
    if (!el) return;
    const text = label
      ? label
      : '\u2191' + stats.requested + ' \u2713' + stats.loaded + ' \u2717' + stats.errored;
    el.textContent = text;
    el.classList.toggle('map-status-overlay--error', stats.errored > 0 && stats.loaded === 0);
    el.classList.toggle('map-status-overlay--ok', stats.loaded > 0);
  }

  // --- Error banner ---
  function showMapErrorBanner(container, message) {
    if (!container || container.querySelector('#map-error-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'map-error-banner';
    banner.className = 'map-error-banner';
    const text = document.createElement('span');
    text.textContent = message;
    const close = document.createElement('button');
    close.textContent = '\u2715';
    close.className = 'map-error-banner__close';
    close.setAttribute('aria-label', 'Dismiss map error');
    close.onclick = () => banner.remove();
    banner.appendChild(text);
    banner.appendChild(close);
    container.appendChild(banner);
  }

  // --- Leaflet fallback ---
  function activateLeafletFallback(container, statusEl) {
    console.log('[MapFallback] Activating Leaflet fallback');
    updateStatusOverlay(statusEl, {}, 'Leaflet fallback…');

    function mountLeaflet() {
      if (typeof L === 'undefined') {
        console.error('[MapFallback] Leaflet not available');
        updateStatusOverlay(statusEl, {}, 'Map unavailable');
        return;
      }
      // Clear existing map content but keep status overlay and error banner
      const banner = container.querySelector('#map-error-banner');
      const statusDiv = container.querySelector('#map-status-overlay');
      container.innerHTML = '';
      container.style.minHeight = '300px';
      if (banner) container.appendChild(banner);
      if (statusDiv) container.appendChild(statusDiv);

      const lmap = L.map(container, {
        zoomControl: true,
        scrollWheelZoom: true
      }).setView([20, 0], 2);

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: 'abc',
          maxZoom: 19
        }
      ).addTo(lmap);

      updateStatusOverlay(statusEl, {}, 'Leaflet \u2713');
      console.log('[MapFallback] Leaflet map ready');
    }

    // Load CSS
    if (!document.querySelector('link[href="/css/leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/css/leaflet.css';
      document.head.appendChild(link);
    }

    // Load JS (vendored) if not already available
    if (typeof L !== 'undefined') {
      mountLeaflet();
    } else {
      const script = document.createElement('script');
      script.src = '/js/leaflet.js';
      script.onload = mountLeaflet;
      script.onerror = () => {
        console.error('[MapFallback] Failed to load Leaflet');
        updateStatusOverlay(statusEl, {}, 'Map unavailable');
      };
      document.head.appendChild(script);
    }
  }

  const MapManager = {
    map: null,
    aoi: null,

    init(containerId) {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error("[MapError] Map container not found:", containerId);
        return;
      }

      // Ensure container has a renderable size
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.minHeight = container.style.minHeight || "300px";

      if (!window.maplibregl) {
        console.error("[MapError] maplibregl not found.");
        container.innerHTML = `
          <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
            <div style="text-align:center;opacity:.9;">
              <div style="font-size:2rem;margin-bottom:.5rem;">🗺️</div>
              <div style="font-weight:600;">Map engine not loaded</div>
              <div style="font-size:.9rem;opacity:.7;margin-top:.25rem;">Missing MapLibre dependency</div>
            </div>
          </div>
        `;
        return;
      }

      // Destroy previous instance if re-initialising
      if (this.map && this.map.remove) {
        try { this.map.remove(); } catch (_) {}
        this.map = null;
      }

      // Status overlay
      const statusEl = createStatusOverlay(container);
      const stats = { requested: 0, loaded: 0, errored: 0 };

      const map = new maplibregl.Map({
        container: containerId,
        style: TILE_STYLE,
        center: [0, 20],
        zoom: 2,
        minZoom: 2,
        maxZoom: 16,
        maxBounds: [[-180, -85], [180, 85]],
        cooperativeGestures: false,
        attributionControl: true,
        transformRequest: DEBUG_MAP ? (url, resourceType) => {
          console.log("[MapDebug] request", resourceType, url);
          return { url };
        } : undefined
      });

      // Explicitly enable interactions
      map.scrollZoom.enable();
      map.dragPan.enable();
      map.touchZoomRotate.enable();

      map.addControl(new maplibregl.NavigationControl(), "top-right");
      map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: "metric" }), "bottom-left");

      // Track tile requests via data events
      map.on("dataloading", (e) => {
        if (e.dataType === "tile") {
          stats.requested++;
          updateStatusOverlay(statusEl, stats);
        }
      });

      map.on("data", (e) => {
        if (e.dataType === "tile") {
          stats.loaded++;
          clearTimeout(fallbackTimer);
          updateStatusOverlay(statusEl, stats);
        }
        if (DEBUG_MAP && e.dataType === "source" && e.isSourceLoaded) {
          console.log("[MapDebug] source loaded:", e.sourceId);
        }
      });

      map.on("error", (e) => {
        const err = e && e.error ? e.error : e;
        let url = "";
        if (e && e.tile && e.tile.tileID) {
          url = String(e.tile.tileID);
        } else if (err && err.url) {
          url = err.url;
        }
        console.error("[MapError]", url ? "Failed to load: " + url : err);
        stats.errored++;
        updateStatusOverlay(statusEl, stats);
        if (stats.errored === 1) {
          const msg = url
            ? "Basemap tiles failed (" + url + "). Check network/CSP."
            : "Map error: " + (err && err.message ? err.message : String(err));
          showMapErrorBanner(container, msg);
        }
      });

      let fallbackTimer = setTimeout(() => {
        if (stats.loaded === 0) {
          console.warn("[MapFallback] No tiles loaded after 2s — activating Leaflet fallback");
          try { map.remove(); } catch (_) {}
          activateLeafletFallback(container, statusEl);
        }
      }, TILE_FALLBACK_TIMEOUT_MS);

      // ResizeObserver: keep canvas correctly sized when layout changes
      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => {
          if (map && !map._removed) {
            try { map.resize(); } catch (_) {}
          }
        });
        ro.observe(container);
      }

      this.map = map;
      console.log("[MapInit] OSM tiles v6 – scrollZoom/dragPan/touchZoom + Leaflet fallback" +
        (DEBUG_MAP ? " [debugMap ON]" : ""));
    },

    setAOI(aoi) { this.aoi = aoi; },
    getAOI() { return this.aoi; },
    clearAOI() { this.aoi = null; },

    flyTo(lat, lon, zoom = 10) {
      if (!this.map) return;
      this.map.flyTo({ center: [lon, lat], zoom });
    }
  };

  window.MapManager = MapManager;
})();
