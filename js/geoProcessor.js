/**
 * Geo Processor Module
 * Spatial analysis, AOI management, GeoJSON operations
 * Uses Turf.js for geospatial calculations
 */

class GeoProcessor {
  constructor() {
    // Check if Turf.js is available
    this.turf = typeof turf !== 'undefined' ? turf : null;
  }

  /**
   * Calculate area of an AOI (Area of Interest)
   * @param {Object} aoi - GeoJSON Polygon or MultiPolygon
   * @returns {Number} Area in square kilometers
   */
  calculateArea(aoi) {
    if (!this.turf) {
      console.warn('Turf.js not loaded, using approximate calculation');
      return this._approximateArea(aoi);
    }

    try {
      const area = this.turf.area(aoi);
      // Convert square meters to square kilometers
      return area / 1000000;
    } catch (error) {
      console.error('Error calculating area:', error);
      return 0;
    }
  }

  /**
   * Calculate bounding box of a geometry
   * @param {Object} geom - GeoJSON geometry
   * @returns {Array} [west, south, east, north]
   */
  calculateBounds(geom) {
    if (!this.turf) {
      return this._approximateBounds(geom);
    }

    try {
      const bbox = this.turf.bbox(geom);
      return bbox;
    } catch (error) {
      console.error('Error calculating bounds:', error);
      return null;
    }
  }

  /**
   * Check if AOI intersects with dataset bounds
   * @param {Object} aoi - GeoJSON Polygon
   * @param {Array} datasetBounds - [west, south, east, north]
   * @returns {Boolean}
   */
  intersectsDataset(aoi, datasetBounds) {
    if (!this.turf) {
      return this._approximateIntersection(aoi, datasetBounds);
    }

    try {
      const aoiBbox = this.calculateBounds(aoi);
      if (!aoiBbox) return false;

      // Convert bbox to polygon for intersection test
      const datasetPolygon = this.turf.bboxPolygon(datasetBounds);
      const aoiPolygon = aoi.type === 'Polygon' ? aoi : this.turf.bboxPolygon(aoiBbox);
      
      return this.turf.booleanIntersects(aoiPolygon, datasetPolygon);
    } catch (error) {
      console.error('Error checking intersection:', error);
      return false;
    }
  }

  /**
   * Export features to GeoJSON string
   * @param {Array} features - Array of GeoJSON features
   * @returns {String} GeoJSON string
   */
  exportGeoJSON(features) {
    try {
      const featureCollection = {
        type: 'FeatureCollection',
        features: features
      };
      return JSON.stringify(featureCollection, null, 2);
    } catch (error) {
      console.error('Error exporting GeoJSON:', error);
      return null;
    }
  }

  /**
   * Import GeoJSON from string
   * @param {String} geoJsonStr - GeoJSON string
   * @returns {Object} Parsed GeoJSON object
   */
  importGeoJSON(geoJsonStr) {
    try {
      const geojson = JSON.parse(geoJsonStr);
      
      // Validate basic GeoJSON structure
      if (!geojson.type) {
        throw new Error('Invalid GeoJSON: missing type property');
      }

      return geojson;
    } catch (error) {
      console.error('Error importing GeoJSON:', error);
      return null;
    }
  }

  /**
   * Create a circle polygon
   * @param {Array} center - [longitude, latitude]
   * @param {Number} radius - Radius in kilometers
   * @param {Number} steps - Number of points in circle (default 64)
   * @returns {Object} GeoJSON Polygon
   */
  createCircle(center, radius, steps = 64) {
    if (!this.turf) {
      console.warn('Turf.js not loaded, cannot create circle');
      return null;
    }

    try {
      const options = { steps: steps, units: 'kilometers' };
      return this.turf.circle(center, radius, options);
    } catch (error) {
      console.error('Error creating circle:', error);
      return null;
    }
  }

  /**
   * Create a rectangle from bounds
   * @param {Array} bounds - [west, south, east, north]
   * @returns {Object} GeoJSON Polygon
   */
  createRectangle(bounds) {
    const [west, south, east, north] = bounds;
    
    return {
      type: 'Polygon',
      coordinates: [[
        [west, south],
        [east, south],
        [east, north],
        [west, north],
        [west, south]
      ]]
    };
  }

  /**
   * Approximate area calculation without Turf.js
   * @private
   */
  _approximateArea(aoi) {
    if (!aoi || !aoi.coordinates) return 0;
    
    const coords = aoi.type === 'Polygon' ? aoi.coordinates[0] : aoi.coordinates[0][0];
    if (!coords || coords.length < 3) return 0;

    // Very rough approximation using bounding box
    const lons = coords.map(c => c[0]);
    const lats = coords.map(c => c[1]);
    const width = (Math.max(...lons) - Math.min(...lons)) * 111; // deg to km at equator
    const height = (Math.max(...lats) - Math.min(...lats)) * 111;
    
    return width * height;
  }

  /**
   * Approximate bounds calculation without Turf.js
   * @private
   */
  _approximateBounds(geom) {
    if (!geom || !geom.coordinates) return null;

    let coords = [];
    
    // Handle different geometry types
    if (geom.type === 'Point') {
      coords = [geom.coordinates];
    } else if (geom.type === 'LineString' || geom.type === 'MultiPoint') {
      coords = geom.coordinates;
    } else if (geom.type === 'Polygon') {
      coords = geom.coordinates[0];
    } else if (geom.type === 'MultiLineString' || geom.type === 'MultiPolygon') {
      coords = geom.coordinates.flat(2);
    } else {
      coords = geom.coordinates;
    }
    
    if (!coords || coords.length === 0) return null;

    const lons = coords.map(c => c[0]);
    const lats = coords.map(c => c[1]);

    return [
      Math.min(...lons),
      Math.min(...lats),
      Math.max(...lons),
      Math.max(...lats)
    ];
  }

  /**
   * Approximate intersection check without Turf.js
   * @private
   */
  _approximateIntersection(aoi, datasetBounds) {
    const aoiBounds = this._approximateBounds(aoi);
    if (!aoiBounds) return false;

    const [aWest, aSouth, aEast, aNorth] = aoiBounds;
    const [dWest, dSouth, dEast, dNorth] = datasetBounds;

    // Check if bounding boxes overlap
    return !(aEast < dWest || aWest > dEast || aNorth < dSouth || aSouth > dNorth);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GeoProcessor;
}
