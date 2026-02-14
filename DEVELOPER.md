# SAT-DISCOVERY Platform - Developer Guide

## Overview

SAT-DISCOVERY is a static web application for discovering and exploring satellite remote sensing capabilities. Built with pure HTML/CSS/vanilla JavaScript, it provides a modular, extensible architecture for satellite data discovery.

## Architecture

### Technology Stack
- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Deployment**: Static site (Vercel compatible)
- **No Build Step**: Direct deployment without compilation
- **No Backend**: All data loaded from static JSON files

### Color Scheme
- **Primary Background**: `#020b16` (Dark Blue)
- **Primary Foreground**: `#ffd700` (Yellow/Gold)
- All colors defined as CSS variables in `/css/theme.css`

## Project Structure

```
sat-discovery-platform/
├── css/
│   ├── theme.css           # Color scheme & CSS variables
│   ├── layout.css          # Page layouts (header, sidebar, grid)
│   └── components.css      # Reusable components (buttons, cards, etc.)
├── js/
│   ├── dataLoader.js       # JSON data loading
│   ├── indexer.js          # Search indexing & normalization
│   ├── filters.js          # Filter state management
│   ├── ui.js               # UI rendering functions
│   ├── map.js              # Map stub (future integration)
│   ├── router.js           # Hash-based routing
│   ├── storage.js          # localStorage persistence
│   └── orbit_stub.js       # Orbit planning stub
├── app.html                # Main dashboard
├── satellite.html          # Satellite detail page
├── sources.html            # Data sources listing
├── orbit.html              # Orbit planner (stub)
├── delivery.html           # Data delivery info
├── index.html              # Landing page
├── satellites.json         # Satellite data
├── sources.json            # Data provider listings
├── open_archives.json      # Open archive sources
├── coverage_rules.json     # Coverage metadata
└── programming_satellites.json  # Tasking satellite list
```

## JavaScript Modules

All modules are designed as singleton objects attached to the global `window` object.

### DataLoader (`js/dataLoader.js`)
Loads and caches JSON data files.

```javascript
// Load all data
await DataLoader.loadAll();

// Get specific datasets
const satellites = await DataLoader.getSatellites();
const sources = await DataLoader.getSources();

// Get flattened data
const allSats = await DataLoader.getAllSatellitesFlat();
```

### Indexer (`js/indexer.js`)
Normalizes satellite data and provides search functionality.

```javascript
// Build search index
await Indexer.buildIndex();

// Search satellites
const results = Indexer.search('sentinel');

// Get unique values for filters
const types = Indexer.getUniqueTypes();
const operators = Indexer.getUniqueOperators();
```

### Filters (`js/filters.js`)
Manages active filters and applies filtering logic.

```javascript
// Set filters
Filters.setSearch('sentinel');
Filters.toggleType('Optical');
Filters.setArchive(true);

// Apply filters to dataset
const filtered = Filters.apply(allSatellites);

// Listen for changes
Filters.onChange((activeFilters) => {
    // Update UI
});
```

### UI (`js/ui.js`)
Renders UI components from data.

```javascript
// Render satellite cards
UI.renderCards(satellites, containerElement);

// Render filter chips
UI.renderFilterChips(containerElement);

// Update results count
UI.updateResultsCount(count, counterElement);
```

### Storage (`js/storage.js`)
Persists user state to localStorage.

```javascript
// Save/load filters
Storage.saveFilters(filters);
const filters = Storage.loadFilters();

// Save/load AOI
Storage.saveAOI(aoiGeometry);
const aoi = Storage.loadAOI();

// Preferences
Storage.savePreferences({ theme: 'dark' });
```

### Router (`js/router.js`)
Hash-based client-side routing.

```javascript
// Initialize router
Router.init();

// Register routes
Router.register('/dashboard', (route) => {
    // Handle dashboard route
});

// Navigate
Router.navigate('#/satellite/Sentinel-2');
```

### MapManager (`js/map.js`)
Map integration stub for future implementation.

```javascript
// Initialize map
MapManager.init('mapContainerId');

// AOI tools (stubs)
MapManager.drawAOI();
MapManager.clearAOI();
```

### OrbitPlanner (`js/orbit_stub.js`)
Orbit prediction stub for future TLE integration.

```javascript
// Initialize
OrbitPlanner.init();

// Predict passes (stub)
const passes = await OrbitPlanner.predictPasses(
    'Sentinel-1', 
    { lat: 40.7, lon: -74 }, 
    7  // days
);
```

## CSS Components

### Layout Classes
- `.sidebar` - Left sidebar (320px wide)
- `.content` - Main content area
- `.map-panel` - Map display (70% height)
- `.results-panel` - Results list (30% height)
- `.detail-container` - Detail page container

### Component Classes
- `.btn` - Button styles
- `.card` - Card container
- `.badge` - Status badges
- `.chip` - Filter chips
- `.input-field` - Input fields
- `.modal` - Modal dialogs

### Color Scheme
Use CSS variables for consistency:
```css
color: var(--yellow);
background-color: var(--dark-blue);
```

## Data Format

### satellites.json
```json
{
  "groups": [
    {
      "id": "optical",
      "label": "Optical",
      "satellites": [
        {
          "name": "Sentinel-2",
          "operator": "ESA",
          "type": "Optical",
          "commercial": false,
          "public_archive": true,
          "archive_since": "2015-06",
          "coverage": "Global",
          "revisit_days": 5,
          "programming": false
        }
      ]
    }
  ]
}
```

## Development

### Local Development
```bash
# Start a simple HTTP server
python3 -m http.server 8000

# Open browser
open http://localhost:8000/app.html
```

### Testing
```bash
# Validate JavaScript syntax
for file in js/*.js; do node --check "$file"; done

# Test components
open http://localhost:8000/test.html
```

### Deployment
Deploy as a static site to Vercel, Netlify, GitHub Pages, or any static hosting:

```bash
# No build step required!
# Just deploy the entire directory
```

## Feature Roadmap

### Current Features (v1.0)
- ✅ Satellite discovery and search
- ✅ Filter by type, archive, tasking
- ✅ Data source listings
- ✅ localStorage persistence
- ✅ Responsive layout
- ✅ Dark theme with yellow accents

### Planned Features
- 🚧 Interactive map integration (Leaflet/Mapbox)
- 🚧 Orbit prediction with TLE data
- 🚧 Coverage visualization
- 🚧 Satellite comparison tool
- 🚧 Export results to CSV/JSON
- 🚧 Advanced filtering options
- 🚧 Satellite detail enhancements

## Contributing

This is a reference-only tool. Contributions should:
1. Maintain pure HTML/CSS/JS (no frameworks)
2. Preserve the dark-blue/yellow color scheme
3. Keep all modules modular and independent
4. Update documentation with changes
5. Ensure Vercel deployability

## License

See LICENSE file for details.

## Disclaimer

This tool provides reference information only:
- No imagery is hosted, stored, or distributed
- No proprietary APIs are accessed
- Data availability depends on providers
- Information is for reference purposes only
