// Data loader module for SAT-DISCOVERY
// Loads satellites.json, sources.json, archives, and coverage rules

const DataLoader = {
    data: {
        satellites: null,
        sources: null,
        archives: null,
        coverageRules: null,
        programming: null
    },
    
    loading: false,
    loaded: false,
    
    async loadAll() {
        if (this.loading) return;
        if (this.loaded) return this.data;
        
        this.loading = true;
        
        try {
            const [satellites, sources, archives, coverageRules, programming] = await Promise.all([
                fetch('/satellites.json').then(r => r.json()),
                fetch('/sources.json').then(r => r.json()),
                fetch('/open_archives.json').then(r => r.json()),
                fetch('/coverage_rules.json').then(r => r.json()),
                fetch('/programming_satellites.json').then(r => r.json())
            ]);
            
            this.data.satellites = satellites;
            this.data.sources = sources;
            this.data.archives = archives;
            this.data.coverageRules = coverageRules;
            this.data.programming = programming;
            
            this.loaded = true;
            this.loading = false;
            
            return this.data;
        } catch (error) {
            console.error('Error loading data:', error);
            this.loading = false;
            throw error;
        }
    },
    
    async getSatellites() {
        if (!this.loaded) await this.loadAll();
        return this.data.satellites;
    },
    
    async getSources() {
        if (!this.loaded) await this.loadAll();
        return this.data.sources;
    },
    
    async getArchives() {
        if (!this.loaded) await this.loadAll();
        return this.data.archives;
    },
    
    async getCoverageRules() {
        if (!this.loaded) await this.loadAll();
        return this.data.coverageRules;
    },
    
    async getProgramming() {
        if (!this.loaded) await this.loadAll();
        return this.data.programming;
    },
    
    // Get all satellites flattened from groups
    async getAllSatellitesFlat() {
        const data = await this.getSatellites();
        const satellites = [];
        
        if (data.groups) {
            data.groups.forEach(group => {
                if (group.satellites) {
                    group.satellites.forEach(sat => {
                        satellites.push({
                            ...sat,
                            groupId: group.id,
                            groupLabel: group.label
                        });
                    });
                }
            });
        }
        
        return satellites;
    },
    
    // Get all sources flattened from groups
    async getAllSourcesFlat() {
        const data = await this.getSources();
        const sources = [];
        
        if (Array.isArray(data)) {
            return data;
        }
        
        if (data.groups) {
            data.groups.forEach(group => {
                if (group.sources) {
                    group.sources.forEach(source => {
                        sources.push({
                            ...source,
                            groupId: group.id,
                            groupLabel: group.label
                        });
                    });
                }
            });
        }
        
        return sources;
    }
};

// Make it available globally
window.DataLoader = DataLoader;
