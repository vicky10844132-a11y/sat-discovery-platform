// SAT-DISCOVERY Map Module (Phase 2: Stable Map Core)
// - Zero storage: Map itself stores nothing
// - Constrained zoom: prevents infinite zoom-out
// - Vector style: labels remain stable across zoom levels
// - No AOI tools yet (next step)

(function () {
  const DEFAULT_STYLE = "https://demotiles.maplibre.org/style.json";

  const MapManager = {
    map: null,
    aoi: null,

    init(containerId) {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error("Map container not found:", containerId);
        return;
      }

      // Ensure container can render a WebGL canvas
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.minHeight = container.style.minHeight || "420px";

      if (!window.maplibregl) {
        console.error("maplibregl not found. Ensure MapLibre CDN is loaded in app.html <head>.");
        // Minimal fallback UI (still better than silent blank)
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

      // Build map
      const map = new maplibregl.Map({
        container: containerId,
        style: DEFAULT_STYLE,
        center: [0, 20],
        zoom: 2,
        minZoom: 2,   // ✅ cannot zoom out infinitely
        maxZoom: 16,  // ✅ reasonable max for performance
        maxBounds: [[-180, -85], [180, 85]], // ✅ constrain world
        cooperativeGestures: false
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");

      // Optional: show scale (helps with geospatial context)
      map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: "metric" }), "bottom-left");

      map.on("error", (e) => {
        console.error("Map error:", e && e.error ? e.error : e);
      });

      this.map = map;
      console.log("Map initialized (MapLibre)");
    },

    // Placeholder APIs for next steps (AOI / layers)
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
