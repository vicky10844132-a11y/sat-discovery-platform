# SAT-DISCOVERY Platform - File Structure

Complete file structure of the SAT-DISCOVERY platform after implementation.

## Project Root

```
sat-discovery-platform/
│
├── 📁 css/                          CSS Stylesheets
│   ├── base.css                     (Pre-existing)
│   ├── theme.css                    Color scheme & CSS variables (Pre-existing)
│   ├── layout.css                   ✨ NEW: Responsive layouts
│   └── components.css               ✨ NEW: UI components
│
├── 📁 js/                           ✨ NEW DIRECTORY: JavaScript Modules
│   ├── dataLoader.js                Load & cache JSON data
│   ├── indexer.js                   Search indexing & normalization
│   ├── filters.js                   Filter state management
│   ├── ui.js                        UI rendering functions
│   ├── map.js                       Map stub integration
│   ├── router.js                    Hash-based routing
│   ├── storage.js                   localStorage persistence
│   └── orbit_stub.js                Orbit planner stub
│
├── 📄 index.html                    Landing page (Pre-existing)
├── 📄 about.html                    About page (Pre-existing)
├── 📄 compliance.html               Compliance page (Pre-existing)
│
├── 📄 app.html                      ✨ NEW: Main dashboard
├── 📄 satellite.html                ✨ NEW: Satellite detail page
├── 📄 sources.html                  ✨ NEW: Data sources listing
├── 📄 orbit.html                    ✨ NEW: Orbit planner interface
├── 📄 delivery.html                 ✨ NEW: Data delivery info
├── 📄 test.html                     ✨ NEW: Component testing
│
├── 📊 satellites.json               Satellite catalog (Unchanged)
├── 📊 sources.json                  Data providers (Unchanged)
├── 📊 open_archives.json            Open archives (Unchanged)
├── 📊 coverage_rules.json           Coverage metadata (Unchanged)
├── 📊 programming_satellites.json   Tasking satellites (Unchanged)
├── 📊 sources.default.json          Default sources (Pre-existing)
│
├── 📘 README.md                     ✨ UPDATED: Project overview
├── 📘 DEVELOPER.md                  ✨ NEW: Technical documentation
├── 📘 VISUAL_GUIDE.md               ✨ NEW: UI layouts & components
├── 📘 QUICKSTART.md                 ✨ NEW: User guide
├── 📘 IMPLEMENTATION_SUMMARY.md     ✨ NEW: Implementation details
├── 📘 FILE_STRUCTURE.md             ✨ NEW: This file
│
├── 🧪 smoke-test.js                 ✨ NEW: Automated validation
├── ⚙️ vercel.json                   ✨ NEW: Deployment config
├── 📝 .gitignore                    ✨ NEW: Git exclusions
│
├── 📜 app.js                        (Pre-existing animation script)
├── 📜 styles.css                    (Pre-existing styles)
├── 📄 robots.txt                    (Pre-existing)
└── 📄 tle_cache.txt                 (Pre-existing)
```

## File Counts

### New Files Created: 23
- CSS Files: 2
- JavaScript Modules: 8
- HTML Pages: 5
- Documentation: 6
- Configuration: 2

### Pre-existing Files: 11
- CSS: 2
- HTML: 3
- JSON: 5
- Other: 1

### Total Files: 34

## Module Dependencies

### app.html Dependencies
```
app.html
├── css/theme.css
├── css/layout.css
├── css/components.css
├── js/storage.js
├── js/dataLoader.js
├── js/indexer.js
├── js/filters.js
├── js/ui.js
├── js/map.js
└── js/router.js
```

### satellite.html Dependencies
```
satellite.html
├── css/theme.css
├── css/layout.css
├── css/components.css
├── js/storage.js
├── js/dataLoader.js
└── js/indexer.js
```

### sources.html Dependencies
```
sources.html
├── css/theme.css
├── css/layout.css
├── css/components.css
├── js/storage.js
├── js/dataLoader.js
└── js/ui.js
```

### orbit.html Dependencies
```
orbit.html
├── css/theme.css
├── css/layout.css
├── css/components.css
├── js/storage.js
├── js/dataLoader.js
├── js/indexer.js
└── js/orbit_stub.js
```

### delivery.html Dependencies
```
delivery.html
├── css/theme.css
├── css/layout.css
└── css/components.css
```

### test.html Dependencies
```
test.html
├── css/theme.css
├── css/layout.css
├── css/components.css
├── js/storage.js
├── js/dataLoader.js
├── js/indexer.js
├── js/filters.js
├── js/ui.js
├── js/map.js
├── js/router.js
└── js/orbit_stub.js
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                          User                               │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                       app.html                              │
│                    (Main Dashboard)                         │
└───────────────────┬─────────────────────────────────────────┘
                    │
         ┌──────────┼──────────┐
         ▼          ▼          ▼
    ┌────────┐ ┌────────┐ ┌────────┐
    │Layout  │ │Component│ │ Theme  │
    │  CSS   │ │  CSS   │ │  CSS   │
    └────────┘ └────────┘ └────────┘
                    │
         ┌──────────┼──────────┬──────────┬──────────┐
         ▼          ▼          ▼          ▼          ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
    │DataLoad│ │Indexer │ │Filters │ │   UI   │ │Storage │
    │   er   │ │        │ │        │ │        │ │        │
    └────┬───┘ └───┬────┘ └───┬────┘ └───┬────┘ └────────┘
         │         │          │          │
         ▼         ▼          ▼          ▼
    ┌─────────────────────────────────────────┐
    │           JSON Data Files               │
    │  satellites.json | sources.json         │
    │  open_archives.json | coverage_rules.json│
    └─────────────────────────────────────────┘
```

## Module Interactions

```
┌──────────────────────────────────────────────────────────────┐
│                    Module Interaction Map                     │
└──────────────────────────────────────────────────────────────┘

DataLoader ──(loads)──> JSON Files
    │
    └──(provides)──> Indexer
                       │
                       └──(provides)──> Filters
                                         │
                                         └──(provides)──> UI
                                                           │
                                                           └──(renders)──> DOM

Storage <──(saves/loads)── Filters
Storage <──(saves/loads)── MapManager
Storage <──(saves/loads)── Router

Router ──(controls)──> Page Navigation
MapManager ──(manages)──> AOI Tools
OrbitPlanner ──(plans)──> Satellite Passes
```

## CSS Architecture

```
theme.css          (CSS Variables, Base Styles)
    ├── --dark-blue: #020b16
    ├── --yellow: #ffd700
    └── CSS Reset

layout.css         (Page Layouts)
    ├── Header
    ├── Sidebar
    ├── Main Content
    ├── Map Panel
    ├── Results Panel
    ├── Detail Pages
    └── Footer

components.css     (UI Components)
    ├── Buttons
    ├── Cards
    ├── Badges
    ├── Chips
    ├── Inputs
    ├── Modals
    ├── Loading States
    └── Info Boxes
```

## JavaScript Module Exports

All modules export to global `window` object:

```javascript
window.DataLoader     // Data loading & caching
window.Indexer        // Search & indexing
window.Filters        // Filter management
window.UI             // UI rendering
window.MapManager     // Map stub
window.Router         // Routing
window.Storage        // localStorage
window.OrbitPlanner   // Orbit stub
```

## Deployment Structure

```
Production Deployment
│
├── Static Assets (No build required)
│   ├── HTML files served directly
│   ├── CSS files served directly
│   └── JS files served directly
│
├── Data Files
│   └── JSON files served directly
│
└── Configuration
    └── vercel.json (deployment settings)
```

## Key Characteristics

✅ **No Build Step**: All files deployable as-is
✅ **Zero Dependencies**: Pure vanilla JavaScript
✅ **Modular Architecture**: Independent, reusable modules
✅ **Static Deployment**: Works on any static host
✅ **Responsive Design**: Mobile and desktop layouts
✅ **Well Documented**: 6 documentation files

---

*Last updated: February 14, 2026*
