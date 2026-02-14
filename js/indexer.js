// Indexer module for SAT-DISCOVERY
// Normalizes data, builds searchable index, and provides search functionality

const Indexer = {
    index: [],
    searchIndex: new Map(),
    
    async buildIndex() {
        const satellites = await DataLoader.getAllSatellitesFlat();
        
        // Normalize and index each satellite
        this.index = satellites.map((sat, idx) => {
            const normalized = {
                id: idx,
                name: sat.name || '',
                operator: sat.operator || '',
                type: sat.type || '',
                commercial: sat.commercial || false,
                publicArchive: sat.public_archive || false,
                archiveSince: sat.archive_since || null,
                coverage: sat.coverage || '',
                revisitDays: sat.revisit_days || null,
                programming: sat.programming || false,
                queryUrl: sat.query_url || '',
                groupId: sat.groupId || '',
                groupLabel: sat.groupLabel || ''
            };
            
            // Build search keywords
            const keywords = [
                normalized.name.toLowerCase(),
                normalized.operator.toLowerCase(),
                normalized.type.toLowerCase(),
                normalized.groupLabel.toLowerCase()
            ].join(' ');
            
            this.searchIndex.set(idx, keywords);
            
            return normalized;
        });
        
        return this.index;
    },
    
    search(query) {
        if (!query || query.trim() === '') {
            return this.index;
        }
        
        const searchTerm = query.toLowerCase().trim();
        
        return this.index.filter((item, idx) => {
            const keywords = this.searchIndex.get(idx);
            return keywords && keywords.includes(searchTerm);
        });
    },
    
    getById(id) {
        return this.index.find(item => item.id === id);
    },
    
    getByName(name) {
        return this.index.find(item => 
            item.name.toLowerCase() === name.toLowerCase()
        );
    },
    
    getAll() {
        return this.index;
    },
    
    // Get unique values for filters
    getUniqueTypes() {
        return [...new Set(this.index.map(item => item.type))].filter(Boolean);
    },
    
    getUniqueOperators() {
        return [...new Set(this.index.map(item => item.operator))].filter(Boolean).sort();
    },
    
    getUniqueGroups() {
        return [...new Set(this.index.map(item => item.groupLabel))].filter(Boolean);
    }
};

// Make it available globally
window.Indexer = Indexer;
