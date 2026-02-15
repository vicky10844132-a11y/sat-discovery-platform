# SAT-DISCOVERY Platform

A neutral satellite discovery index and data access platform for publicly available satellite imagery search portals.

## Overview

SAT-DISCOVERY provides two main functionalities:

1. **Discovery Index** (`index.html`) - A public discovery index for satellite imagery search portals
2. **Data Access Platform** (`app.html`) - Interactive STAC-based satellite data search and visualization

## Features

### Discovery Index
- Reference catalog of publicly available satellite imagery portals
- Links to official data sources (AWS EarthSearch, Microsoft Planetary Computer, etc.)
- No data hosting, downloads, or transactions

### Data Access Platform
- **STAC API Integration**: Query AWS EarthSearch and Microsoft Planetary Computer
- **Interactive Mapping**: Leaflet-based map with drawing tools for Area of Interest (AOI)
- **Geospatial Analysis**: Calculate area, bounds, and spatial intersections using Turf.js
- **Collection Support**: Sentinel-2, Landsat 8-9, Sentinel-1, and more
- **Advanced Filters**: Date range, cloud cover, collection type
- **GeoJSON Export**: Export AOI and search results

## Project Structure

```
├── js/
│   ├── stacClient.js          # STAC API client
│   ├── geoProcessor.js        # Geospatial processing
│   └── mapIntegration.js      # Leaflet map integration
├── css/
│   ├── theme.css              # Color palette and variables
│   ├── base.css               # Base styles
│   ├── layout.css             # App layout (sidebar, main area)
│   ├── components.css         # Reusable UI components
│   └── map.css                # Map-specific styles
├── index.html                 # Discovery index page
├── app.html                   # Data access platform
├── about.html                 # About page
├── compliance.html            # Compliance information
├── package.json               # Frontend dependencies
├── vercel.json                # Deployment configuration
└── README.md                  # This file
```

## Getting Started

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

### Data Access Platform

1. **Define Area of Interest (AOI)**:
   - Use the drawing tools on the map to create a rectangle, polygon, or circle
   - The AOI area and bounds will be calculated automatically

2. **Configure Search**:
   - Select a STAC endpoint (AWS EarthSearch or Microsoft Planetary Computer)
   - Choose a satellite collection (Sentinel-2, Landsat, etc.)
   - Set date range and filters (cloud cover, max results)

3. **Search for Data**:
   - Click "Search STAC" to query available satellite imagery
   - Results will appear on the map as footprints and in the sidebar

4. **Export Results**:
   - Export your AOI as GeoJSON
   - Export search results as GeoJSON for use in other tools

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
