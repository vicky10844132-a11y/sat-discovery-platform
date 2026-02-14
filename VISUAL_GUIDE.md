# SAT-DISCOVERY Platform - Visual Guide

## Main Dashboard (`app.html`)

### Layout Overview
```
┌─────────────────────────────────────────────────────────────┐
│ 🛰️ SAT-DISCOVERY                                           │
│ Dashboard | Sources | Orbit Planner | Data Delivery | About│
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│  Search  │                                                  │
│  [____]  │            MAP PANEL (70%)                       │
│          │                                                  │
│ Sensor   │         [Interactive Map Placeholder]            │
│ Type     │                                                  │
│ □Optical │                                                  │
│ □SAR     │                                                  │
│          │                                                  │
│ Archive  ├──────────────────────────────────────────────────┤
│ ○All     │ RESULTS PANEL (30%)                             │
│ ○Yes     │ [Filter Chips: Type:Optical ×] [Clear All]      │
│ ○No      │                                                  │
│          │ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ Tasking  │ │Sentinel-2│ │PlanetScope│ │ SPOT 6/7 │         │
│ ○All     │ │   ESA    │ │Planet Labs│ │  Airbus  │         │
│ ○Yes     │ │ Optical  │ │  Optical  │ │ Optical  │         │
│ ○No      │ │ Archive  │ │  Tasking  │ │Commercial│         │
│          │ └──────────┘ └──────────┘ └──────────┘         │
│ [Clear]  │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

### Color Scheme
- **Background**: Dark Blue (`#020b16`)
- **Text/Accents**: Yellow/Gold (`#ffd700`)
- **Cards**: Semi-transparent dark blue with yellow borders
- **Badges**: Color-coded by type (Optical: blue, SAR: purple, etc.)

### Key Features
1. **Left Sidebar (320px)**
   - Search input
   - Type filters (checkboxes)
   - Archive filters (radio buttons)
   - Tasking filters (radio buttons)
   - Clear filters button

2. **Map Panel (70% height)**
   - Placeholder for interactive map
   - Grid pattern background
   - AOI drawing tools (stub)

3. **Results Panel (30% height)**
   - Active filter chips
   - Satellite cards in responsive grid
   - Click card to view details

## Satellite Detail Page (`satellite.html`)

```
┌─────────────────────────────────────────────────────────────┐
│ 🛰️ SAT-DISCOVERY                                           │
│ Dashboard | Sources | Orbit Planner | Data Delivery | About│
├─────────────────────────────────────────────────────────────┤
│ [← Back to Dashboard]                                       │
│                                                              │
│ Sentinel-2                                                   │
│ [Optical] [Archive] [Public]                                │
│                                                              │
│ ┌─────────────────────┐ ┌────────────────────────┐         │
│ │ Basic Information   │ │ Archive Information    │         │
│ │ Operator: ESA       │ │ Public Archive: Yes    │         │
│ │ Type: Optical       │ │ Archive Since: 2015-06 │         │
│ │ Group: Optical      │ │ Commercial: No         │         │
│ │                     │ │                        │         │
│ │ Coverage & Cap.     │ │ Data Access            │         │
│ │ Coverage: Global    │ │ [Visit Data Portal →] │         │
│ │ Revisit: 5 days     │ │                        │         │
│ │ Programming: No     │ │                        │         │
│ └─────────────────────┘ └────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Data Sources Page (`sources.html`)

```
┌─────────────────────────────────────────────────────────────┐
│ 🛰️ SAT-DISCOVERY                                           │
│ Dashboard | Sources | Orbit Planner | Data Delivery | About│
├─────────────────────────────────────────────────────────────┤
│ [← Back to Dashboard]                                       │
│                                                              │
│ Data Sources & Providers                                    │
│ Public discovery portals and data providers for satellite   │
│ imagery                                                      │
│                                                              │
│ [Important Notice: No data hosted...]                       │
│                                                              │
│ Commercial & Institutional Sources                          │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│ │ Jilin-1      │ │ CRESDA       │ │ Airbus       │        │
│ │ Store        │ │ Service      │ │ Intelligence │        │
│ │              │ │              │ │              │        │
│ │ [Visit →]    │ │ [Visit →]    │ │ [Visit →]    │        │
│ └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                              │
│ Open Archives                                                │
│ ┌──────────────┐ ┌──────────────┐                          │
│ │ AWS Earth    │ │ Microsoft    │                          │
│ │ Search STAC  │ │ Planetary PC │                          │
│ │              │ │              │                          │
│ │ [Access →]   │ │ [Access →]   │                          │
│ └──────────────┘ └──────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## Orbit Planner Page (`orbit.html`)

```
┌─────────────────────────────────────────────────────────────┐
│ 🛰️ SAT-DISCOVERY                                           │
│ Dashboard | Sources | Orbit Planner | Data Delivery | About│
├─────────────────────────────────────────────────────────────┤
│ [← Back to Dashboard]                                       │
│                                                              │
│ 🛰️ Orbit & Pass Planning                                   │
│ Predict satellite passes and plan observation windows       │
│                                                              │
│ [🚧 Feature Under Development]                              │
│                                                              │
│ ┌────────────────────┐ ┌─────────────────────┐            │
│ │ Select Satellite   │ │ Predicted Passes    │            │
│ │ [Sentinel-1 ▼]     │ │                     │            │
│ │                    │ │ [Configure params]  │            │
│ │ Location           │ │                     │            │
│ │ Latitude: [____]   │ │ Orbital Parameters  │            │
│ │ Longitude: [____]  │ │ Altitude: 693.0 km  │            │
│ │                    │ │ Inclination: 98.18° │            │
│ │ Prediction Params  │ │ Period: 98.6 min    │            │
│ │ Duration: [7] days │ │ Eccentricity: 0.001│            │
│ │ Min Elev: [10]°    │ │                     │            │
│ │                    │ │                     │            │
│ │ [Predict (Soon)]   │ │                     │            │
│ └────────────────────┘ └─────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## Data Delivery Page (`delivery.html`)

```
┌─────────────────────────────────────────────────────────────┐
│ 🛰️ SAT-DISCOVERY                                           │
│ Dashboard | Sources | Orbit Planner | Data Delivery | About│
├─────────────────────────────────────────────────────────────┤
│ [← Back to Dashboard]                                       │
│                                                              │
│ 📦 Data Delivery & Format Selection                         │
│ Understanding satellite data formats and delivery options   │
│                                                              │
│ [Important Notice: Reference only...]                       │
│                                                              │
│ Common Data Formats                                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │ GeoTIFF  │ │HDF/NetCDF│ │   COG    │ │ JPEG2000 │       │
│ │ .tif     │ │ .hdf/.nc │ │  .tif    │ │  .jp2    │       │
│ │ Standard │ │Scientific│ │Cloud-    │ │Compressed│       │
│ │  Format  │ │  Format  │ │Native    │ │ Imagery  │       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
│ Delivery Methods                                             │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │ Direct   │ │   API    │ │  Cloud   │ │Streaming │       │
│ │ Download │ │  Access  │ │ Storage  │ │ Services │       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## UI Components

### Buttons
- **Default**: Yellow border, transparent background
- **Primary**: Yellow background, dark text
- **Hover**: Inverted colors

### Cards
- Semi-transparent dark background
- Yellow border (brightens on hover)
- Card title in yellow
- Card content in lighter yellow
- Footer with badges

### Badges
Color-coded by type:
- **Optical**: Blue (#5dade2)
- **SAR**: Purple (#af7ac5)
- **Archive**: Green (#58d68d)
- **Tasking**: Yellow (#f4d03f)
- **Commercial**: Red (#ec7063)
- **Public**: Blue (#5dade2)

### Filter Chips
- Rounded borders
- Active state: Yellow background
- Remove button (×) on hover
- Smooth transitions

### Input Fields
- Dark semi-transparent background
- Yellow border (brightens on focus)
- Yellow text
- Placeholder in muted yellow

## Responsive Design

### Desktop (>768px)
- Sidebar: 320px fixed width
- Map: 70% height
- Results: 30% height
- Cards: 3-4 columns grid

### Mobile (<768px)
- Sidebar: Full width, 40vh max-height
- Map: 50% height
- Results: 50% height
- Cards: 1-2 columns grid

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- High contrast color scheme
- Focus indicators visible

## Performance

- No dependencies or frameworks
- Minimal JavaScript
- CSS variables for theming
- Lazy loading ready
- Static file deployment

---

*All mockups represent the actual implementation as of the initial release.*
