// Storage module for SAT-DISCOVERY
// localStorage persistence for filters, AOI, and preferences

const Storage = {
    keys: {
        FILTERS: 'sat_discovery_filters',
        AOI: 'sat_discovery_aoi',
        PREFERENCES: 'sat_discovery_preferences',
        RECENT_SEARCHES: 'sat_discovery_recent_searches'
    },
    
    // Save filters
    saveFilters(filters) {
        try {
            localStorage.setItem(this.keys.FILTERS, JSON.stringify(filters));
        } catch (e) {
            console.error('Error saving filters:', e);
        }
    },
    
    // Load filters
    loadFilters() {
        try {
            const data = localStorage.getItem(this.keys.FILTERS);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading filters:', e);
            return null;
        }
    },
    
    // Clear filters
    clearFilters() {
        localStorage.removeItem(this.keys.FILTERS);
    },
    
    // Save AOI
    saveAOI(aoi) {
        try {
            localStorage.setItem(this.keys.AOI, JSON.stringify(aoi));
        } catch (e) {
            console.error('Error saving AOI:', e);
        }
    },
    
    // Load AOI
    loadAOI() {
        try {
            const data = localStorage.getItem(this.keys.AOI);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading AOI:', e);
            return null;
        }
    },
    
    // Clear AOI
    clearAOI() {
        localStorage.removeItem(this.keys.AOI);
    },
    
    // Save preferences
    savePreferences(preferences) {
        try {
            localStorage.setItem(this.keys.PREFERENCES, JSON.stringify(preferences));
        } catch (e) {
            console.error('Error saving preferences:', e);
        }
    },
    
    // Load preferences
    loadPreferences() {
        try {
            const data = localStorage.getItem(this.keys.PREFERENCES);
            return data ? JSON.parse(data) : {
                theme: 'dark',
                resultsPerPage: 20,
                defaultView: 'grid'
            };
        } catch (e) {
            console.error('Error loading preferences:', e);
            return {
                theme: 'dark',
                resultsPerPage: 20,
                defaultView: 'grid'
            };
        }
    },
    
    // Add recent search
    addRecentSearch(query) {
        try {
            let searches = this.getRecentSearches();
            
            // Remove if already exists
            searches = searches.filter(s => s !== query);
            
            // Add to beginning
            searches.unshift(query);
            
            // Keep only last 10
            searches = searches.slice(0, 10);
            
            localStorage.setItem(this.keys.RECENT_SEARCHES, JSON.stringify(searches));
        } catch (e) {
            console.error('Error saving recent search:', e);
        }
    },
    
    // Get recent searches
    getRecentSearches() {
        try {
            const data = localStorage.getItem(this.keys.RECENT_SEARCHES);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading recent searches:', e);
            return [];
        }
    },
    
    // Clear recent searches
    clearRecentSearches() {
        localStorage.removeItem(this.keys.RECENT_SEARCHES);
    },
    
    // Clear all storage
    clearAll() {
        Object.values(this.keys).forEach(key => {
            localStorage.removeItem(key);
        });
    }
};

// Make it available globally
window.Storage = Storage;
