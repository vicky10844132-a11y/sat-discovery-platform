// Filters module for SAT-DISCOVERY
// Manages active filters and applies filter logic

const Filters = {
    active: {
        search: '',
        types: [],
        archive: null,  // null, true, false
        tasking: null,  // null, true, false
        commercial: null,  // null, true, false
        operator: null,
        timeRange: {
            start: null,
            end: null
        }
    },
    
    listeners: [],
    
    // Set search filter
    setSearch(query) {
        this.active.search = query;
        this.notifyChange();
    },
    
    // Toggle type filter (Optical/SAR)
    toggleType(type) {
        const index = this.active.types.indexOf(type);
        if (index > -1) {
            this.active.types.splice(index, 1);
        } else {
            this.active.types.push(type);
        }
        this.notifyChange();
    },
    
    // Set archive filter
    setArchive(value) {
        this.active.archive = value;
        this.notifyChange();
    },
    
    // Set tasking filter
    setTasking(value) {
        this.active.tasking = value;
        this.notifyChange();
    },
    
    // Set commercial filter
    setCommercial(value) {
        this.active.commercial = value;
        this.notifyChange();
    },
    
    // Set operator filter
    setOperator(operator) {
        this.active.operator = operator;
        this.notifyChange();
    },
    
    // Set time range filter
    setTimeRange(start, end) {
        this.active.timeRange = {
            start: start || null,
            end: end || null
        };
        this.notifyChange();
    },
    
    // Clear all filters
    clearAll() {
        this.active = {
            search: '',
            types: [],
            archive: null,
            tasking: null,
            commercial: null,
            operator: null,
            timeRange: {
                start: null,
                end: null
            }
        };
        this.notifyChange();
    },
    
    // Clear a specific filter
    clearFilter(filterName) {
        if (filterName === 'types') {
            this.active.types = [];
        } else if (filterName === 'search') {
            this.active.search = '';
        } else {
            this.active[filterName] = null;
        }
        this.notifyChange();
    },
    
    // Apply filters to a dataset
    apply(items) {
        let filtered = [...items];
        
        // Apply search filter
        if (this.active.search) {
            filtered = Indexer.search(this.active.search);
        }
        
        // Apply type filter
        if (this.active.types.length > 0) {
            filtered = filtered.filter(item => 
                this.active.types.includes(item.type)
            );
        }
        
        // Apply archive filter
        if (this.active.archive !== null) {
            filtered = filtered.filter(item => {
                if (this.active.archive === true) {
                    return item.publicArchive === true;
                } else {
                    return item.publicArchive !== true;
                }
            });
        }
        
        // Apply tasking filter
        if (this.active.tasking !== null) {
            filtered = filtered.filter(item => 
                item.programming === this.active.tasking
            );
        }
        
        // Apply commercial filter
        if (this.active.commercial !== null) {
            filtered = filtered.filter(item => 
                item.commercial === this.active.commercial
            );
        }
        
        // Apply operator filter
        if (this.active.operator) {
            filtered = filtered.filter(item => 
                item.operator === this.active.operator
            );
        }
        
        // Apply time range filter
        if (this.active.timeRange && (this.active.timeRange.start || this.active.timeRange.end)) {
            filtered = filtered.filter(item => {
                if (!item.launchDate && !item.acquisitionDate) return true;
                
                const itemDate = new Date(item.launchDate || item.acquisitionDate);
                const startDate = this.active.timeRange.start ? new Date(this.active.timeRange.start) : new Date('1900-01-01');
                const endDate = this.active.timeRange.end ? new Date(this.active.timeRange.end) : new Date('2100-12-31');
                
                return itemDate >= startDate && itemDate <= endDate;
            });
        }
        
        return filtered;
    },
    
    // Get active filter count
    getActiveCount() {
        let count = 0;
        if (this.active.search) count++;
        count += this.active.types.length;
        if (this.active.archive !== null) count++;
        if (this.active.tasking !== null) count++;
        if (this.active.commercial !== null) count++;
        if (this.active.operator) count++;
        if (this.active.timeRange && (this.active.timeRange.start || this.active.timeRange.end)) count++;
        return count;
    },
    
    // Subscribe to filter changes
    onChange(callback) {
        this.listeners.push(callback);
    },
    
    // Notify listeners of changes
    notifyChange() {
        this.listeners.forEach(callback => callback(this.active));
    },
    
    // Get current filters
    getActive() {
        return { ...this.active };
    }
};

// Make it available globally
window.Filters = Filters;
