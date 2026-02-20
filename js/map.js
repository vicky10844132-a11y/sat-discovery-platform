// Map module for SAT-DISCOVERY with Leaflet
// MapManager for map initialization and AOI tools

const MapManager = {
    map: null,
    aoi: null,
    drawControl: null,
    drawnItems: null,
    markers: [],
    
    // Initialize the map with Leaflet
    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Map container not found:', containerId);
            return;
        }
        
        // Check if Leaflet is loaded
        if (typeof L === 'undefined') {
            console.error('Leaflet library not loaded');
            this.initPlaceholder(container);
            return;
        }
        
        try {
            // Clear container
            container.innerHTML = '';
            
            // Initialize Leaflet map
            this.map = L.map(containerId, {
                center: [20, 0], // Center of world
                zoom: 2,
                minZoom: 2,
                maxZoom: 18,
                worldCopyJump: true
            });
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(this.map);
            
            // Initialize draw controls if Leaflet.draw is available
            if (typeof L.Control.Draw !== 'undefined') {
                this.initDrawControls();
            }
            
            // Add scale control
            L.control.scale({
                position: 'bottomright',
                imperial: false
            }).addTo(this.map);
            
            console.log('Leaflet map initialized successfully');
            
        } catch (error) {
            console.error('Error initializing Leaflet map:', error);
            this.initPlaceholder(container);
        }
    },
    
    // Initialize drawing controls
    initDrawControls() {
        // Create a layer group for drawn items
        this.drawnItems = new L.FeatureGroup();
        this.map.addLayer(this.drawnItems);
        
        // Initialize draw control
        this.drawControl = new L.Control.Draw({
            position: 'topright',
            draw: {
                polygon: {
                    allowIntersection: false,
                    showArea: true
                },
                rectangle: {
                    showArea: true
                },
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false
            },
            edit: {
                featureGroup: this.drawnItems,
                remove: true
            }
        });
        this.map.addControl(this.drawControl);
        
        // Handle drawing events
        this.map.on(L.Draw.Event.CREATED, (e) => {
            const layer = e.layer;
            this.drawnItems.addLayer(layer);
            this.updateAOIFromLayer(layer);
        });
        
        this.map.on(L.Draw.Event.EDITED, (e) => {
            const layers = e.layers;
            layers.eachLayer((layer) => {
                this.updateAOIFromLayer(layer);
            });
        });
        
        this.map.on(L.Draw.Event.DELETED, () => {
            this.clearAOI();
        });
    },
    
    // Update AOI from drawn layer
    updateAOIFromLayer(layer) {
        const bounds = layer.getBounds();
        this.aoi = {
            type: 'rectangle',
            bounds: {
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest()
            }
        };
        
        if (typeof Storage !== 'undefined') {
            Storage.saveAOI(this.aoi);
        }
        
        console.log('AOI updated:', this.aoi);
    },
    
    // Fallback placeholder if Leaflet fails
    initPlaceholder(container) {
        container.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #0a1929 0%, #020b16 100%); position: relative;">
                <div style="text-align: center; color: #ffd700; z-index: 1;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🗺️</div>
                    <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">Interactive Map</div>
                    <div style="font-size: 0.9rem; opacity: 0.7;">Loading map...</div>
                </div>
            </div>
        `;
    },
    
    // Draw AOI tool (legacy support)
    drawAOI() {
        if (this.map && this.drawControl) {
            alert('Use the drawing tools on the right side of the map to draw an Area of Interest (AOI)');
        } else {
            console.log('Drawing AOI (fallback)');
            alert('AOI drawing tool - Please ensure Leaflet.draw is loaded');
        }
    },
    
    // Clear AOI
    clearAOI() {
        console.log('Clearing AOI');
        this.aoi = null;
        
        if (this.drawnItems) {
            this.drawnItems.clearLayers();
        }
        
        if (typeof Storage !== 'undefined') {
            Storage.clearAOI();
        }
    },
    
    // Get current AOI
    getAOI() {
        return this.aoi;
    },
    
    // Set AOI
    setAOI(aoi) {
        this.aoi = aoi;
        
        if (this.map && this.drawnItems && aoi && aoi.bounds) {
            // Clear existing
            this.drawnItems.clearLayers();
            
            // Create rectangle from bounds
            const bounds = L.latLngBounds(
                [aoi.bounds.south, aoi.bounds.west],
                [aoi.bounds.north, aoi.bounds.east]
            );
            const rectangle = L.rectangle(bounds, {
                color: '#ffd700',
                weight: 2
            });
            this.drawnItems.addLayer(rectangle);
            
            // Fit map to bounds
            this.map.fitBounds(bounds);
        }
        
        if (typeof Storage !== 'undefined') {
            Storage.saveAOI(aoi);
        }
    },
    
    // Fly to location
    flyTo(lat, lon, zoom = 10) {
        if (this.map) {
            this.map.flyTo([lat, lon], zoom);
            console.log(`Flying to: ${lat}, ${lon} (zoom: ${zoom})`);
        }
    },
    
    // Add marker
    addMarker(lat, lon, options = {}) {
        if (this.map) {
            const marker = L.marker([lat, lon], options).addTo(this.map);
            this.markers.push(marker);
            console.log(`Marker added at: ${lat}, ${lon}`);
            return marker;
        }
    },
    
    // Clear all markers
    clearMarkers() {
        if (this.map) {
            this.markers.forEach(marker => marker.remove());
            this.markers = [];
            console.log('All markers cleared');
        }
    }
};

// Make it available globally
window.MapManager = MapManager;
