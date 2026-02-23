// SAT-DISCOVERY Map Module (Phase 4: diagnostics + error banner)
// - Zero storage: Map itself stores nothing
// - Constrained zoom: prevents infinite zoom-out
// - OSM raster tiles: no glyph/sprite dependency
// - Explicit interaction handlers: scrollZoom, dragPan, touchZoomRotate
// - debugMap=1 URL param: verbose tile/worker logging
// - Non-blocking in-map error banner on persistent tile failures

(function () {
  // Debug mode: enable with ?debugMap=1 in the URL
  const DEBUG_MAP = new URLSearchParams(location.search).has('debugMap');

  // OSM raster tile style – uses all three subdomains for reliability
  const OSM_STYLE = {
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
      // Solid background so the map is never fully blank (visible while tiles load)
      { id: "background", type: "background", paint: { "background-color": "#1a3c5e" } },
      { id: "osm", type: "raster", source: "osm" }
    ]
  };

  // Show a dismissible error banner inside the map container (non-blocking)
  function showMapErrorBanner(container, message) {
    if (!container || container.querySelector('#map-error-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'map-error-banner';
    banner.className = 'map-error-banner';
    const text = document.createElement('span');
    text.textContent = message;
    const close = document.createElement('button');
    close.textContent = '✕';
    close.className = 'map-error-banner__close';
    close.setAttribute('aria-label', 'Dismiss map error');
    close.onclick = () => banner.remove();
    banner.appendChild(text);
    banner.appendChild(close);
    container.appendChild(banner);
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

      // Ensure container can render a WebGL canvas
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.minHeight = container.style.minHeight || "300px";

      if (!window.maplibregl) {
        console.error("[MapError] maplibregl not found. Ensure MapLibre is loaded in app.html <head>.");
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

      // If re-init, destroy previous instance
      if (this.map && this.map.remove) {
        try { this.map.remove(); } catch (_) {}
        this.map = null;
      }

      // Build map with OSM raster tiles
      const map = new maplibregl.Map({
        container: containerId,
        style: OSM_STYLE,
        center: [0, 20],
        zoom: 2,
        minZoom: 2,
        maxZoom: 16,
        maxBounds: [[-180, -85], [180, 85]],
        cooperativeGestures: false,
        attributionControl: true,
        // ?debugMap=1: intercept every tile/resource request and log it
        transformRequest: DEBUG_MAP ? (url, resourceType) => {
          console.log("[MapDebug] request", resourceType, url);
          return { url };
        } : undefined
      });

      // Explicitly enable all interactions (guards against accidental disable)
      map.scrollZoom.enable();
      map.dragPan.enable();
      map.touchZoomRotate.enable();

      map.addControl(new maplibregl.NavigationControl(), "top-right");
      map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: "metric" }), "bottom-left");

      // Track consecutive tile errors; show banner after first failure
      let tileErrorCount = 0;
      map.on("error", (e) => {
        const err = e && e.error ? e.error : e;
        let url = "";
        if (e && e.tile && e.tile.tileID) {
          url = String(e.tile.tileID);
        } else if (err && err.url) {
          url = err.url;
        }
        console.error("[MapError]", url ? "Failed to load: " + url : err);
        tileErrorCount++;
        if (tileErrorCount === 1) {
          const msg = url
            ? "Basemap tiles failed to load (" + url + "). Check network/CSP."
            : "Map error: " + (err && err.message ? err.message : String(err));
          showMapErrorBanner(container, msg);
        }
      });

      // In debug mode, also log when tiles successfully load
      if (DEBUG_MAP) {
        map.on("data", (e) => {
          if (e.dataType === "source" && e.isSourceLoaded) {
            console.log("[MapDebug] source loaded:", e.sourceId);
          }
        });
      }

      this.map = map;
      console.log("[MapInit] OSM raster tiles v4 – scrollZoom/dragPan/touchZoom enabled" + (DEBUG_MAP ? " [debugMap ON]" : ""));
    },

    // Placeholder APIs for AOI / layers
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
