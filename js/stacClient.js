/**
 * STAC Client Module
 * Queries AWS EarthSearch and Microsoft Planetary Computer STAC endpoints
 * Provides satellite imagery discovery capabilities
 */

class STACClient {
  constructor() {
    this.endpoints = {
      aws: 'https://earth-search.aws.element84.com/v1',
      microsoft: 'https://planetarycomputer.microsoft.com/api/stac/v1'
    };
  }

  /**
   * Search for STAC items within a bounding box and date range
   * @param {Array} bbox - [west, south, east, north] bounding box coordinates
   * @param {Object} dateRange - {start: 'YYYY-MM-DD', end: 'YYYY-MM-DD'}
   * @param {Object} query - Additional query parameters (cloud_cover, etc.)
   * @param {String} endpoint - 'aws' or 'microsoft'
   * @returns {Promise<Object>} {items: [], links: [], context: {}}
   */
  async searchItems(bbox, dateRange, query = {}, endpoint = 'aws') {
    try {
      const baseUrl = this.endpoints[endpoint];
      const searchUrl = `${baseUrl}/search`;
      
      const requestBody = {
        bbox: bbox,
        datetime: `${dateRange.start}T00:00:00Z/${dateRange.end}T23:59:59Z`,
        limit: query.limit || 10
      };

      // Add query filters if provided
      if (query.collections && query.collections.length > 0) {
        requestBody.collections = query.collections;
      }

      if (query.cloud_cover !== undefined) {
        requestBody.query = {
          'eo:cloud_cover': {
            lt: query.cloud_cover
          }
        };
      }

      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`STAC search failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        items: data.features || [],
        links: data.links || [],
        context: data.context || {}
      };
    } catch (error) {
      console.error('Error searching STAC items:', error);
      throw error;
    }
  }

  /**
   * Search by specific collection
   * @param {String} collection - Collection ID (e.g., 'sentinel-2-l2a')
   * @param {Array} bbox - Bounding box coordinates
   * @param {Object} dateRange - Date range object
   * @param {String} endpoint - 'aws' or 'microsoft'
   * @returns {Promise<Object>}
   */
  async searchByCollection(collection, bbox, dateRange, endpoint = 'aws') {
    return this.searchItems(bbox, dateRange, { collections: [collection] }, endpoint);
  }

  /**
   * Get details for a specific STAC item
   * @param {String} itemId - Item identifier
   * @param {String} collection - Collection identifier
   * @param {String} endpoint - 'aws' or 'microsoft'
   * @returns {Promise<Object>}
   */
  async getItemDetails(itemId, collection, endpoint = 'aws') {
    try {
      const baseUrl = this.endpoints[endpoint];
      const itemUrl = `${baseUrl}/collections/${collection}/items/${itemId}`;
      
      const response = await fetch(itemUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to get item details: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting item details:', error);
      throw error;
    }
  }

  /**
   * Get available collections from STAC endpoint
   * @param {String} endpoint - 'aws' or 'microsoft'
   * @returns {Promise<Array>}
   */
  async getCollections(endpoint = 'aws') {
    try {
      const baseUrl = this.endpoints[endpoint];
      const collectionsUrl = `${baseUrl}/collections`;
      
      const response = await fetch(collectionsUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to get collections: ${response.statusText}`);
      }

      const data = await response.json();
      return data.collections || [];
    } catch (error) {
      console.error('Error getting collections:', error);
      throw error;
    }
  }
}