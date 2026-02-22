/**
 * Map Integration Module
 * Enhanced Leaflet implementation for interactive mapping
 * AOI drawing, layer management, data visualization
 */

class MapIntegration {
  constructor() {
    this.map = null;
    this.drawControl = null;
    this.drawnItems = null;
    this.currentAOI = null;
    this.dataLayers = [];
  }

  /**
   * Initialize Leaflet map
   * @param {String} containerId - DOM element ID for map container
   * @param {Array} center - [latitude, longitude]
   * @param {Number} zoom - Initial zoom level
   * @returns {Object} Leaflet map instance
   */
  initLeafletMap(containerId, center = [0, 0], zoom = 2) {
    if (typeof L === 'undefined') {
      console.error('Leaflet library not loaded');
      return null;
    }

    try {
      // Initialize map
      this.map = L.map(containerId, {
        center: center,
        zoom: zoom,
        zoomControl: true
      });

      // Add base tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(this.map);

      // Initialize feature group for drawn items
      this.drawnItems = new L.FeatureGroup();
      this.map.addLayer(this.drawnItems);

      // Initialize draw control if Leaflet.draw is available
      if (typeof L.Control.Draw !== 'undefined') {
        this._initDrawControl();
      } else {
        console.warn('Leaflet.draw not loaded, drawing tools unavailable');
      }

      // Handle draw events
      this._setupDrawEventHandlers();

      return this.map;
    } catch (error) {
      console.error('Error initializing map:', error);
      return null;
    }
  }

  /**
   * Initialize drawing control
   * @private
   */
  _initDrawControl() {
    this.drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          drawError: {
            color: '#e1e100',
            message: '<strong>Error:</strong> shape edges cannot cross!'
          },
          shapeOptions: {
            color: '#3388ff'
          }
        },
        rectangle: {
          shapeOptions: {
            color: '#3388ff'
          }
        },
        circle: {
          shapeOptions: {
            color: '#3388ff'
          }
        },
        polyline: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: this.drawnItems,
        remove: true
      }
    });

    this.map.addControl(this.drawControl);
  }

  /**
   * Setup event handlers for drawing
   * @private
   */
  _setupDrawEventHandlers() {
    if (!this.map) return;

    // Handle created shapes
    this.map.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;
      
      // Clear previous AOI
      this.clearAOI();
      
      // Add new shape
      this.drawnItems.addLayer(layer);
      
      // Store as current AOI
      this.currentAOI = layer.toGeoJSON();
      
      // Trigger custom event
      this.map.fire('aoi:created', { aoi: this.currentAOI });
    });

    // Handle edited shapes
    this.map.on(L.Draw.Event.EDITED, (event) => {
      const layers = event.layers;
      layers.eachLayer((layer) => {
        this.currentAOI = layer.toGeoJSON();
        this.map.fire('aoi:edited', { aoi: this.currentAOI });
      });
    });

    // Handle deleted shapes
    this.map.on(L.Draw.Event.DELETED, () => {
      this.currentAOI = null;
      this.map.fire('aoi:deleted');
    });
  }

  /**
   * Enable rectangle drawing mode
   */
  drawRectangle() {
    if (this.drawControl && this.map) {
      new L.Draw.Rectangle(this.map, this.drawControl.options.draw.rectangle).enable();
    }
  }

  /**
   * Enable polygon drawing mode
   */
  drawPolygon() {
    if (this.drawControl && this.map) {
      new L.Draw.Polygon(this.map, this.drawControl.options.draw.polygon).enable();
    }
  }

  /**
   * Enable circle drawing mode
   */
  drawCircle() {
    if (this.drawControl && this.map) {
      new L.Draw.Circle(this.map, this.drawControl.options.draw.circle).enable();
    }
  }

  /**
   * Add STAC items as data layer on map
   * @param {Array} stacItems - Array of STAC items
   * @param {Object} options - Layer options (color, etc.)
   * @returns {Object} Layer group
   */
  addDataLayer(stacItems, options = {}) {
    if (!this.map || !stacItems || stacItems.length === 0) return null;

    const layerGroup = L.layerGroup();
    const defaultColor = options.color || '#ff7800';

    stacItems.forEach(item => {
      if (item.geometry) {
        const layer = L.geoJSON(item.geometry, {
          style: {
            color: defaultColor,
            weight: 2,
            opacity: 0.6,
            fillOpacity: 0.2
          }
        });

        // Add popup with metadata
        const popupContent = this._createPopupContent(item);
        layer.bindPopup(popupContent);

        layerGroup.addLayer(layer);
      }
    });

    layerGroup.addTo(this.map);
    this.dataLayers.push(layerGroup);

    return layerGroup;
  }

  /**
   * Create popup content for STAC item
   * @private
   */
  _createPopupContent(item) {
    const props = item.properties || {};
    const id = item.id || 'Unknown';
    const datetime = props.datetime || 'Unknown';
    const cloudCover = typeof props['eo:cloud_cover'] === 'number' ? 
      `${props['eo:cloud_cover'].toFixed(1)}%` : 'N/A';

    return `
      <div style="font-size: 12px;">
        <strong>ID:</strong> ${id}<br>
        <strong>Date:</strong> ${datetime}<br>
        <strong>Cloud Cover:</strong> ${cloudCover}
      </div>
    `;
  }

  /**
   * Clear all data layers
   */
  clearDataLayers() {
    this.dataLayers.forEach(layer => {
      if (this.map) {
        this.map.removeLayer(layer);
      }
    });
    this.dataLayers = [];
  }

  /**
   * Clear current AOI
   */
  clearAOI() {
    if (this.drawnItems) {
      this.drawnItems.clearLayers();
    }
    this.currentAOI = null;
  }

  /**
   * Get current AOI as GeoJSON
   * @returns {Object|null} GeoJSON object or null
   */
  getAOI() {
    return this.currentAOI;
  }

  /**
   * Set AOI from GeoJSON
   * @param {Object} geojson - GeoJSON object
   */
  setAOI(geojson) {
    if (!this.map || !geojson) return;

    this.clearAOI();

    const layer = L.geoJSON(geojson, {
      style: {
        color: '#3388ff'
      }
    });

    this.drawnItems.addLayer(layer);
    this.currentAOI = geojson;

    // Fit map to AOI bounds
    this.map.fitBounds(layer.getBounds());
  }

  /**
   * Fit map to bounds
   * @param {Array} bounds - [west, south, east, north]
   */
  fitBounds(bounds) {
    if (!this.map || !bounds || bounds.length !== 4) return;

    const [west, south, east, north] = bounds;
    const leafletBounds = [[south, west], [north, east]];
    this.map.fitBounds(leafletBounds);
  }

  /**
   * Get map instance
   * @returns {Object} Leaflet map instance
   */
  getMap() {
    return this.map;
  }

  /**
   * Destroy map instance
   */
  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.drawControl = null;
    this.drawnItems = null;
    this.currentAOI = null;
    this.dataLayers = [];
  }
}
