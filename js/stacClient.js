// stacClient.js

const axios = require('axios');

/**
 * STAC Client for EarthSearch and Planetary Computer Services
 * @class STACClient
 */
class STACClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    /**
     * Fetch catalog from the STAC API
     * @returns {Promise<Object>} Catalog data
     */
    async getCatalog() {
        const response = await axios.get(`${this.baseURL}/collections`);
        return response.data;
    }

    /**
     * Fetch items from a collection
     * @param {string} collectionId - The ID of the collection
     * @returns {Promise<Object>} Items data
     */
    async getItems(collectionId) {
        const response = await axios.get(`${this.baseURL}/collections/${collectionId}/items`);
        return response.data;
    }

    /**
     * Search for items based on a query
     * @param {Object} query - Query parameters for the search
     * @returns {Promise<Object>} Search result data
     */
    async searchItems(query) {
        const response = await axios.post(`${this.baseURL}/search`, query);
        return response.data;
    }
}

module.exports = STACClient;