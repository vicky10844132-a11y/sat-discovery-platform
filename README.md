# SAT-DISCOVERY Platform

Open Satellite Observation Capability Index - A web-based platform for discovering and exploring satellite remote sensing capabilities.

## 🌟 Features

- **Search & Discovery**: Search satellites by name, operator, or type
- **Advanced Filtering**: Filter by sensor type (Optical/SAR), archive availability, and tasking capability
- **Interactive Interface**: Modern dashboard with map panel and card-based results
- **Data Sources**: Comprehensive directory of commercial and public data providers
- **Orbit Planning**: Satellite pass prediction (coming soon)
- **Data Delivery Info**: Information on formats and delivery methods

## 🚀 Quick Start

### For Users

Visit the deployed site or open `app.html` in your browser:

```bash
# Start local server
python3 -m http.server 8000

# Open browser
open http://localhost:8000/app.html
```

### For Developers

```bash
# Clone repository
git clone <repository-url>
cd sat-discovery-platform

# Run smoke tests
node smoke-test.js

# Read documentation
cat DEVELOPER.md
cat QUICKSTART.md
```

## 📁 Project Structure

```
sat-discovery-platform/
├── css/                    # Stylesheets
│   ├── theme.css          # Color scheme & variables
│   ├── layout.css         # Page layouts
│   └── components.css     # UI components
├── js/                    # JavaScript modules
│   ├── dataLoader.js      # JSON data loading
│   ├── indexer.js         # Search & indexing
│   ├── filters.js         # Filter management
│   ├── ui.js              # UI rendering
│   ├── map.js             # Map stub
│   ├── router.js          # Client-side routing
│   ├── storage.js         # localStorage
│   └── orbit_stub.js      # Orbit planning stub
├── app.html               # Main dashboard
├── satellite.html         # Satellite details
├── sources.html           # Data sources
├── orbit.html             # Orbit planner
├── delivery.html          # Data delivery info
└── *.json                 # Data files
```

## 🎨 Color Scheme

- **Primary Background**: `#020b16` (Dark Blue)
- **Primary Foreground**: `#ffd700` (Yellow/Gold)

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - User guide and quick start
- **[DEVELOPER.md](DEVELOPER.md)** - Technical documentation
- **[VISUAL_GUIDE.md](VISUAL_GUIDE.md)** - UI layouts and components

## 🛠️ Technology Stack

- **Pure HTML5/CSS3/JavaScript** - No frameworks or build tools
- **Vanilla ES6+** - Modern JavaScript features
- **Static Site** - Vercel/Netlify deployable
- **No Backend** - All processing client-side

## 🧪 Testing

```bash
# Run smoke tests
node smoke-test.js

# Test components
open test.html
```

## 📊 Data Sources

All data from static JSON files:
- `satellites.json` - Satellite catalog
- `sources.json` - Data providers
- `open_archives.json` - Open archives
- `coverage_rules.json` - Coverage metadata
- `programming_satellites.json` - Tasking satellites

## ⚠️ Scope & Disclaimer

- **Reference Only**: This tool provides reference information only
- **No Data Hosted**: No imagery is hosted, stored, proxied, or distributed
- **No APIs**: No proprietary APIs or private systems are accessed
- **Indicative Only**: All information is indicative and for reference only
- **Provider Dependent**: Access to external sites is subject to their policies

## 🎯 Purpose

To help users quickly understand which satellite missions may have observed, or may be capable of observing, a given area and time period.

## 📝 License

See LICENSE file for details.

## 🤝 Contributing

Contributions welcome! Please maintain:
- Pure HTML/CSS/JavaScript (no frameworks)
- Dark-blue/yellow color scheme
- Modular architecture
- Documentation updates
- Passing smoke tests

## 🔗 Links

- **Main Dashboard**: [app.html](app.html)
- **Data Sources**: [sources.html](sources.html)
- **Documentation**: [DEVELOPER.md](DEVELOPER.md)
