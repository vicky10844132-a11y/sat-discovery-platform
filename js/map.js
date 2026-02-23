// SAT-DISCOVERY Map Module (Phase 7: multi-provider cascade + debug badge)
// Primary:   MapLibre + OSM {a,b,c}.tile.openstreetmap.org
// Secondary: Leaflet  + OSM (same tiles, different engine)
// Tertiary:  Leaflet  + Wikimedia maps.wikimedia.org/osm-intl
// Fallback:  Offline grid (navy + CSS grid + "Map Offline" message)
// Badge:     top-left chip → "ML | OSM | OK" / "LF | WM | BLOCKED" etc.

(function () {
  // Debug mode: activate with ?debugMap=1 in the URL
  const DEBUG_MAP = new URLSearchParams(location.search).has('debugMap');

  // How long to wait for the first tile before switching provider
  const ML_FALLBACK_MS  = 2000;   // MapLibre → Leaflet
  const LF_FALLBACK_MS  = 3000;   // Leaflet OSM → Leaflet Wikimedia → offline

  // Leaflet tile providers (tried in order)
  const LF_PROVIDERS = [
    {
      id: 'OSM',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      opts: { subdomains: 'abc', maxZoom: 19,
              attribution: '\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }
    },
    {
      id: 'WM',
      url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
      opts: { maxZoom: 19,
              attribution: '\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Wikimedia Maps' }
    }
  ];

  // MapLibre raster style — OSM, all 3 subdomains
  const ML_STYLE = {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: [
          'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        attribution: '\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': '#1a3c5e' } },
      { id: 'osm', type: 'raster', source: 'osm' }
    ]
  };

  // Status values used by setBadge and detected in setBadge's class logic
  const STATUS_OK      = 'OK';
  const STATUS_BLOCKED = 'BLOCKED';
  const STATUS_FAILED  = 'FAILED';

  // --- Debug badge (top-left chip) ---
  // Format: "ML | OSM | OK"  /  "LF | WM | BLOCKED"  /  "offline"
  function createBadge(container) {
    const el = document.createElement('div');
    el.id = 'map-status-overlay';
    el.className = 'map-status-overlay';
    el.setAttribute('aria-label', 'Map tile status');
    el.setAttribute('aria-live', 'polite');
    el.textContent = 'ML | OSM | loading\u2026';
    container.appendChild(el);
    return el;
  }

  function setBadge(el, engine, provider, status) {
    if (!el) return;
    const ok      = status === STATUS_OK;
    const blocked = status === STATUS_BLOCKED || status === STATUS_FAILED;
    el.textContent = engine + ' | ' + provider + ' | ' + status;
    el.classList.toggle('map-status-overlay--ok',    ok);
    el.classList.toggle('map-status-overlay--error', blocked);
  }

  // --- Error banner (bottom centre, dismissible) ---
  function showErrorBanner(container, message) {
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

  // --- Helpers ---
  // Move overlay elements into container after innerHTML wipe
  function reattachOverlays(container, badge, banner) {
    if (badge  && badge.parentNode  !== container) container.appendChild(badge);
    if (banner && banner.parentNode !== container) container.appendChild(banner);
  }

  // --- Offline grid (tertiary: all tile sources failed) ---
  function showOfflineGrid(container, badge) {
    const banner = container.querySelector('#map-error-banner');
    container.innerHTML = '';
    container.style.minHeight = '300px';
    const grid = document.createElement('div');
    grid.className = 'map-offline-grid';
    const msg = document.createElement('div');
    msg.className = 'map-offline-msg';
    msg.textContent = 'Map Offline \u2014 no tile providers reachable';
    container.appendChild(grid);
    container.appendChild(msg);
    reattachOverlays(container, badge, banner);
    if (badge) { badge.textContent = 'offline'; badge.className = 'map-status-overlay map-status-overlay--error'; }
    console.warn('[MapFallback] All providers failed — showing offline grid');
  }

  // --- Leaflet cascading mount ---
  function mountLeaflet(container, badge, providerIdx = 0) {

    if (providerIdx >= LF_PROVIDERS.length) {
      showOfflineGrid(container, badge);
      return;
    }

    if (typeof L === 'undefined') {
      console.error('[MapFallback] Leaflet not available');
      showOfflineGrid(container, badge);
      return;
    }

    const p = LF_PROVIDERS[providerIdx];
    setBadge(badge, 'LF', p.id, 'loading\u2026');

    // Preserve overlay elements across innerHTML wipe
    const banner = container.querySelector('#map-error-banner');
    container.innerHTML = '';
    container.style.minHeight = '300px';
    reattachOverlays(container, badge, banner);

    const lmap = L.map(container, {
      zoomControl: true,
      scrollWheelZoom: true,
      minZoom: 2,
      maxZoom: 16,
      maxBounds: [[-90, -180], [90, 180]]
    }).setView([20, 0], 2);

    const layer = L.tileLayer(p.url, p.opts);
    let tilesLoaded = 0;

    layer.on('tileload', () => {
      tilesLoaded++;
      clearTimeout(timer);
      setBadge(badge, 'LF', p.id, STATUS_OK);
      if (DEBUG_MAP) console.log('[MapDebug] LF tile loaded', p.id);
    });

    layer.on('tileerror', () => {
      if (DEBUG_MAP) console.log('[MapDebug] LF tile error', p.id);
    });

    layer.addTo(lmap);

    const timer = setTimeout(() => {
      if (tilesLoaded === 0) {
        console.warn('[MapFallback] LF|' + p.id + ' no tiles in ' + LF_FALLBACK_MS + 'ms — trying next');
        setBadge(badge, 'LF', p.id, STATUS_BLOCKED);
        lmap.remove();
        mountLeaflet(container, badge, providerIdx + 1);
      }
    }, LF_FALLBACK_MS);

    console.log('[MapFallback] Leaflet mounted, provider:', p.id);
  }

  // --- Leaflet fallback entry-point ---
  function activateLeafletFallback(container, badge) {
    console.log('[MapFallback] Activating Leaflet fallback');
    setBadge(badge, 'LF', 'OSM', 'loading\u2026');

    function go() { mountLeaflet(container, badge, 0); }

    if (!document.querySelector('link[href="/css/leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/css/leaflet.css';
      document.head.appendChild(link);
    }

    if (typeof L !== 'undefined') {
      go();
    } else {
      const script = document.createElement('script');
      script.src = '/js/leaflet.js';
      script.onload = go;
      script.onerror = () => { showOfflineGrid(container, badge); };
      document.head.appendChild(script);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  const MapManager = {
    map: null,
    aoi: null,

    init(containerId) {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error('[MapError] Map container not found:', containerId);
        return;
      }

      // Ensure the container has a renderable size
      container.style.width    = '100%';
      container.style.height   = '100%';
      container.style.minHeight = container.style.minHeight || '300px';

      if (!window.maplibregl) {
        console.error('[MapError] maplibregl not found — activating Leaflet directly');
        const badge = createBadge(container);
        activateLeafletFallback(container, badge);
        return;
      }

      // Destroy previous instance if re-initialising
      if (this.map && this.map.remove) {
        try { this.map.remove(); } catch (_) {}
        this.map = null;
      }

      const badge = createBadge(container);
      const stats = { requested: 0, loaded: 0, errored: 0 };

      const map = new maplibregl.Map({
        container:          containerId,
        style:              ML_STYLE,
        center:             [0, 20],
        zoom:               2,
        minZoom:            2,
        maxZoom:            16,
        maxBounds:          [[-180, -85], [180, 85]],
        cooperativeGestures: false,
        attributionControl:  true,
        transformRequest: DEBUG_MAP ? (url, resourceType) => {
          console.log('[MapDebug] request', resourceType, url);
          return { url };
        } : undefined
      });

      // Explicitly enable interactions
      map.scrollZoom.enable();
      map.dragPan.enable();
      map.touchZoomRotate.enable();

      map.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-left');

      map.on('dataloading', (e) => {
        if (e.dataType === 'tile') {
          stats.requested++;
          setBadge(badge, 'ML', 'OSM', '\u2191' + stats.requested + ' \u2713' + stats.loaded + ' \u2717' + stats.errored);
        }
      });

      map.on('data', (e) => {
        if (e.dataType === 'tile') {
          stats.loaded++;
          clearTimeout(fallbackTimer);
          setBadge(badge, 'ML', 'OSM', stats.loaded === stats.requested ? STATUS_OK :
            '\u2191' + stats.requested + ' \u2713' + stats.loaded + ' \u2717' + stats.errored);
        }
        if (DEBUG_MAP && e.dataType === 'source' && e.isSourceLoaded) {
          console.log('[MapDebug] source loaded:', e.sourceId);
        }
      });

      map.on('error', (e) => {
        const err = e && e.error ? e.error : e;
        let url = '';
        if (e && e.tile && e.tile.tileID) url = String(e.tile.tileID);
        else if (err && err.url)          url = err.url;
        console.error('[MapError]', url ? 'Failed: ' + url : err);
        stats.errored++;
        setBadge(badge, 'ML', 'OSM', STATUS_BLOCKED);
        if (stats.errored === 1) {
          showErrorBanner(container, url
            ? 'Tiles blocked (' + url + '). Trying fallback\u2026'
            : 'Map error: ' + (err && err.message ? err.message : String(err)));
        }
      });

      // Switch to Leaflet if no tile loads within ML_FALLBACK_MS
      let fallbackTimer = setTimeout(() => {
        if (stats.loaded === 0) {
          console.warn('[MapFallback] ML|OSM: 0 tiles in ' + ML_FALLBACK_MS + 'ms — switching to Leaflet');
          try { map.remove(); } catch (_) {}
          activateLeafletFallback(container, badge);
        }
      }, ML_FALLBACK_MS);

      // Keep canvas correctly sized when the panel is resized
      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => {
          if (map && !map._removed) try { map.resize(); } catch (_) {}
        });
        ro.observe(container);
      }

      this.map = map;
      console.log('[MapInit] v7 ML|OSM — scrollZoom/dragPan/touchZoom + LF cascade' +
        (DEBUG_MAP ? ' [debugMap ON]' : ''));
    },

    setAOI(aoi)  { this.aoi = aoi; },
    getAOI()     { return this.aoi; },
    clearAOI()   { this.aoi = null; },

    flyTo(lat, lon, zoom = 10) {
      if (!this.map) return;
      this.map.flyTo({ center: [lon, lat], zoom });
    }
  };

  window.MapManager = MapManager;
})();
