// SAT-DISCOVERY Map Module (Phase 3: OSM raster tiles v3)
// - Zero storage: Map itself stores nothing
// - Constrained zoom: prevents infinite zoom-out
// - OSM raster tiles: no glyph/sprite dependency
// - Explicit interaction handlers: scrollZoom, dragPan, touchZoomRotate

(function () {
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
    layers: [{ id: "osm", type: "raster", source: "osm" }]
  };

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
      container.style.minHeight = container.style.minHeight || "420px";

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
        attributionControl: true
      });

      // Explicitly enable all interactions (guards against accidental disable)
      map.scrollZoom.enable();
      map.dragPan.enable();
      map.touchZoomRotate.enable();

      map.addControl(new maplibregl.NavigationControl(), "top-right");
      map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: "metric" }), "bottom-left");

      // Enhanced error handler: log URL so tile failures are identifiable
      map.on("error", (e) => {
        const err = e && e.error ? e.error : e;
        let url = "";
        if (e && e.tile && e.tile.tileID) {
          url = String(e.tile.tileID);
        } else if (err && err.url) {
          url = err.url;
        }
        console.error("[MapError]", url ? "Failed to load: " + url : err);
      });

      this.map = map;
      console.log("[MapInit] OSM raster tiles v3 – scrollZoom/dragPan/touchZoom enabled");
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
