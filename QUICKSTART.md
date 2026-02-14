# SAT-DISCOVERY Platform - Quick Start Guide

## What is SAT-DISCOVERY?

SAT-DISCOVERY is a web-based platform for discovering and exploring satellite remote sensing capabilities. It helps you find which satellites may have observed or can observe a given area.

## Key Features

### 🔍 **Search & Discovery**
- Search satellites by name or operator
- Filter by sensor type (Optical/SAR)
- Filter by archive availability
- Filter by tasking capability

### 🗺️ **Interactive Interface**
- Map panel for visualizing coverage
- Sidebar filters for quick refinement
- Card-based results display
- Detailed satellite specifications

### 📊 **Data Sources**
- Browse commercial and public data sources
- Access STAC APIs and discovery portals
- Reference information for data providers

### 🛰️ **Orbit Planning** (Coming Soon)
- Satellite pass predictions
- Visibility window calculations
- TLE data integration

### 📦 **Data Delivery Info**
- Common satellite data formats
- Delivery methods overview
- Processing level explanations

## Getting Started

### For Users

1. **Open the Dashboard**
   - Navigate to `app.html` in your browser
   - Or visit the deployed site URL

2. **Search Satellites**
   - Use the search box to find satellites by name
   - Example: "Sentinel" or "Planet"

3. **Apply Filters**
   - Select sensor type (Optical/SAR)
   - Choose archive availability
   - Filter by tasking capability

4. **View Results**
   - Browse satellite cards in the results panel
   - Click a card to view detailed specifications

5. **Explore Sources**
   - Click "Sources" to browse data providers
   - Visit external portals for data access

### For Developers

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd sat-discovery-platform
   ```

2. **Start Local Server**
   ```bash
   python3 -m http.server 8000
   ```

3. **Open in Browser**
   ```
   http://localhost:8000/app.html
   ```

4. **Run Tests**
   ```bash
   node smoke-test.js
   ```

5. **Read Documentation**
   - See `DEVELOPER.md` for technical details
   - See `VISUAL_GUIDE.md` for UI layouts

## Navigation

### Main Pages

- **Dashboard** (`app.html`) - Main search and discovery interface
- **Sources** (`sources.html`) - Data provider directory
- **Orbit Planner** (`orbit.html`) - Satellite pass prediction (stub)
- **Data Delivery** (`delivery.html`) - Format and delivery information
- **About** (`about.html`) - About the platform

### Satellite Details

Click any satellite card to view:
- Basic information (operator, type, group)
- Coverage and capability details
- Archive information
- Data access links

## Understanding the Interface

### Sidebar Filters

**Search**
- Type satellite name or operator
- Real-time filtering as you type

**Sensor Type**
- Optical: Visual and multispectral imagery
- SAR: Synthetic Aperture Radar (all-weather)

**Archive**
- All: Show all satellites
- Public Archive: Only satellites with public data archives
- No Archive: Only satellites without public archives

**Tasking**
- All: Show all satellites
- Available: Only satellites accepting new tasking orders
- Not Available: Only satellites not accepting tasking

### Results Panel

**Filter Chips**
- Shows active filters
- Click × to remove individual filters
- Click "Clear All" to remove all filters

**Satellite Cards**
- Name and operator displayed prominently
- Coverage and revisit information
- Colored badges indicate capabilities:
  - Blue: Optical sensors
  - Purple: SAR sensors
  - Green: Public archive available
  - Yellow: Tasking available
  - Red: Commercial
  - Blue: Public/Free

### Map Panel

Currently displays a placeholder for future interactive map integration.

## Data Sources

All data is loaded from static JSON files:

- `satellites.json` - Satellite mission catalog
- `sources.json` - Data provider listings
- `open_archives.json` - Open archive sources
- `coverage_rules.json` - Coverage metadata
- `programming_satellites.json` - Tasking-capable satellites

## Persistence

The platform saves your preferences locally:

- Search queries
- Active filters
- Area of interest (AOI)
- User preferences

Data is stored in your browser's localStorage and persists between sessions.

## Limitations

**Reference Only**
- This tool provides reference information only
- No imagery is hosted, stored, or distributed
- No proprietary APIs are accessed
- Data availability depends on providers

**No Backend**
- All processing happens in your browser
- No server-side components
- No user accounts or authentication

**Static Data**
- JSON files updated manually
- Not real-time satellite positions
- Archive dates are approximate

## Tips & Tricks

1. **Quick Search**: Use the search box for fastest results
2. **Combine Filters**: Stack multiple filters for precise results
3. **Clear Filters**: Use "Clear All" to start fresh
4. **Bookmark Results**: Save URLs with hash fragments
5. **Check Sources**: Visit data provider portals for actual data access

## Common Use Cases

### Finding Archive Data
1. Search for your area of interest
2. Filter by "Public Archive: Yes"
3. Check satellite cards for archive dates
4. Visit data portals to search for specific imagery

### Planning New Acquisitions
1. Filter by "Tasking: Available"
2. Compare revisit times and coverage
3. Check commercial vs. public options
4. Contact operators through their portals

### Comparing Sensors
1. Search for missions of interest
2. View detailed specifications
3. Compare optical vs. SAR capabilities
4. Check coverage and revisit patterns

## Browser Support

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires JavaScript enabled and localStorage support.

## Privacy

- No tracking or analytics
- No cookies (except localStorage)
- No data sent to external servers
- All processing happens locally

## Getting Help

- Check `DEVELOPER.md` for technical documentation
- See `VISUAL_GUIDE.md` for UI reference
- Review source code (fully commented)
- Open issues on GitHub

## Contributing

Contributions welcome! Please:
- Maintain pure HTML/CSS/JS
- Preserve the color scheme
- Keep modules independent
- Update documentation
- Run smoke tests

## License

See LICENSE file for details.

---

**Disclaimer**: This tool provides reference information only. All information is indicative and for reference purposes. Access to external sites is subject to the policies and availability of the respective data providers.
