# SAT-DISCOVERY Platform

A comprehensive satellite data discovery platform providing STAC API integration, interactive mapping, curated resources, and geospatial analysis tools.

## Overview

SAT-DISCOVERY is a multi-functional platform for satellite imagery discovery and access:

1. **Landing Page** (`index.html`) - Main entry point showcasing platform features
2. **Map Search** (`app.html`) - Interactive STAC-based satellite data search with Leaflet mapping
3. **Resources Hub** (`resources.html`) - Curated links to satellite data portals, OSINT tools, and tracking platforms
4. **Tools & Algorithms** (`tools.html`) - Practical geospatial utilities and data processing tools
5. **About & Compliance** - Platform information and usage policies

## Features

### Map Search (STAC Integration)
- **STAC API Integration**: Query AWS EarthSearch and Microsoft Planetary Computer
- **Interactive Mapping**: Leaflet-based map with drawing tools for Area of Interest (AOI)
- **Geospatial Analysis**: Calculate area, bounds, and spatial intersections using Turf.js
- **Collection Support**: Sentinel-2, Landsat 8-9, Sentinel-1, Copernicus DEM
- **Advanced Filters**: Date range, cloud cover, max results
- **GeoJSON Export**: Export AOI and search results

### Resources Hub
- **STAC APIs & Open Data**: AWS EarthSearch, Microsoft Planetary Computer, Google Earth Engine
- **SAR & DEM Data**: Alaska Satellite Facility, Copernicus DEM, NASA Earthdata
- **OSINT Tools**: Sentinel Hub EO Browser, NASA Worldview, Zoom Earth
- **Satellite Tracking**: N2YO, Heavens Above, CelesTrak, Space-Track
- **Commercial Portals**: Planet, Maxar, Airbus, Apollo Mapping
- **Libraries & Tools**: GDAL, Rasterio, QGIS, PySTAC

### Tools & Algorithms
- **GDB Empty Layer Cleaner**: Python utility for maintaining clean ESRI File Geodatabase structures
  - GUI and CLI operation
  - GDAL-based scanning
  - Backup and direct deletion modes
  - Cross-platform support

## Project Structure

```
├── index.html                 # Landing page with feature overview
├── app.html                   # Map search / STAC integration
├── resources.html             # Resources hub (data-driven)
├── tools.html                 # Tools & algorithms showcase
├── about.html                 # About page
├── compliance.html            # Compliance information
├── js/
│   ├── stacClient.js          # STAC API client
│   ├── geoProcessor.js        # Geospatial processing
│   ├── mapIntegration.js      # Leaflet map integration
│   ├── map.js                 # Map utilities
│   └── router.js              # Client-side routing
├── css/
│   ├── theme.css              # Color palette and variables
│   ├── base.css               # Base styles
│   ├── layout.css             # App layout
│   ├── components.css         # Reusable UI components
│   └── map.css                # Map-specific styles
├── resources.json             # Resources data (6 categories)
├── tools.json                 # Tools descriptions
├── sources.json               # Legacy satellite portal links
├── package.json               # Frontend dependencies
├── vercel.json                # Deployment configuration
└── README.md                  # This file
```

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for external libraries and STAC APIs

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/vicky10844132-a11y/sat-discovery-platform.git
cd sat-discovery-platform
```

2. Start a local web server:
```bash
python3 -m http.server 8000
# or
npm run serve
```

3. Open your browser:
- Discovery Index: http://localhost:8000/index.html
- Data Access Platform: http://localhost:8000/app.html

### Dependencies

The project uses CDN-hosted libraries (no build step required):
- **Leaflet** (v1.9.4) - Interactive mapping
- **Leaflet Draw** (v1.0.4) - Drawing tools for AOI
- **Turf.js** (v6.5.0) - Geospatial calculations

## Usage

### Map Search
1. Navigate to the **Map Search** page from the main navigation
2. Draw an Area of Interest (AOI) on the map using the drawing tools (rectangle, polygon, or circle)
3. Select a STAC data source (AWS EarthSearch or Microsoft Planetary Computer)
4. Choose a satellite collection (Sentinel-2, Landsat, etc.)
5. Set your date range and filters (cloud cover, max results)
6. Click "Search STAC" to find available satellite data
7. View results on the map and in the sidebar
8. Export your AOI or results as GeoJSON

### Browsing Resources
1. Navigate to the **Resources** page
2. Browse organized categories:
   - STAC APIs & Open Data
   - SAR & DEM Data
   - OSINT & Imagery Tools
   - Satellite Tracking
   - Commercial Data Portals
   - Libraries & Tools
3. Click any resource card to visit the external portal

### Exploring Tools
1. Navigate to the **Tools** page
2. Review detailed documentation for available tools
3. Follow the 3-step usage guide
4. Access source code and download links (placeholders for now)

## Navigation

All pages include a unified navigation bar:
- **Home**: Landing page with feature overview
- **Map Search**: Interactive STAC search and AOI drawing
- **Resources**: Curated links to data portals and tools
- **Tools**: Algorithms and utilities documentation
- **About**: Platform information

## Deployment

### Vercel (Production)
- Domain: `sat-index.online`
- Production tracks `main` branch
- Preview deployments available on feature branches
- No build step required (static site)

### Local Development
1. Clone the repository
2. Start a local web server:
   ```bash
   python3 -m http.server 8000
   # or
   npm run serve
   ```
3. Open http://localhost:8000 in your browser

## API Integration

### STAC Endpoints

- **AWS EarthSearch**: https://earth-search.aws.element84.com/v1
  - Sentinel-2 L2A
  - Landsat 8-9 Collection 2 Level 2
  - Copernicus DEM

- **Microsoft Planetary Computer**: https://planetarycomputer.microsoft.com/api/stac/v1
  - Sentinel-1 GRD
  - Sentinel-2 L2A
  - Landsat Collection 2
  - MODIS, NAIP, and more

## Technical Details

### Architecture
- **No Build Step**: Pure vanilla JavaScript (ES6+)
- **Static Site**: Deployable to any static hosting (Vercel, GitHub Pages, etc.)
- **Client-Side Only**: All processing happens in the browser
- **localStorage**: AOI persistence across sessions

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Security
- CSP headers configured in `vercel.json`
- No server-side processing
- External API calls to public STAC endpoints only
- All dependencies checked for vulnerabilities

## Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Set source to main branch
3. Site will be available at `https://username.github.io/sat-discovery-platform`

### Static Hosting
Upload all files to any static web server. No server-side processing required.

## Scope and Limitations

- **Reference Only**: This is a discovery tool, not a data provider
- **No Data Hosting**: No imagery is stored, proxied, or distributed
- **No Authentication**: Uses public STAC APIs without authentication
- **No Ordering**: Links to external portals for actual data access
- **Indicative Only**: All information is for reference purposes

## Contributing

This project is maintained as a public reference. For corrections or additions to the discovery index, please contact the maintainer.

## License

This project references publicly available satellite data portals. Access to external sites is subject to the policies and availability of the respective data providers.

## Disclaimer

All information is indicative and for reference only. This tool does not guarantee data availability, quality, or access. Users are responsible for complying with terms of service of the respective data providers.

## Contact

For corrections, additions, or removal requests, please open an issue or contact the maintainer.

## Acknowledgments

- AWS EarthSearch for public STAC API
- Microsoft Planetary Computer for open data access
- Leaflet and Turf.js communities for excellent geospatial tools
