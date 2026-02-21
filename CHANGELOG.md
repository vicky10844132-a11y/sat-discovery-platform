# Changelog

All notable changes to the Satellite Discovery Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2025-02-21

#### RS_RESOURCES_2025.json - Comprehensive Resource Catalog
- **60+ Remote Sensing Resources** across 10 major categories
- **Open Data Sources** (10 resources):
  - ICEYE SAR Open Data (STAC + S3, includes China region)
  - ALOS-4 Sample Products (JAXA SAR samples)
  - SpaceEye-T VVHR optical data
  - Vivid Mosaic 15cm ultra high-resolution samples
  - Copernicus DEM (GLO-30, GLO-90)
  - COG CopDEM (800GB global merged version)
  - SRTM DEM 30m (USGS)
  - ASTER GDEM (NASA)
  - AW3D 30m (JAXA)
  - NASA CORONA declassified imagery + EOSDA LandViewer

- **Satellite Tracking Tools** (1 resource):
  - Look4Sat 4.0.2 with custom TLE support

- **SAR Visualization** (1 platform):
  - Terraq SAR global visualization platform

- **OSINT Geospatial Tools** (10 tools):
  - Pano Date, Bellingcat Filename Finder (street view analysis)
  - World Imagery Wayback (historical imagery)
  - Spot Beta, Bellingcat OSM Search (geolocation)
  - Bellingcat Grid Generator (grid search)
  - Heywhatsthat, Multimap, DualMaps (map comparison)
  - EOSDA LandViewer

- **Visualization Components** (1 component):
  - Gio.js 3D data flow globe (npm package)

- **GIS Processing Tools** (3 tools):
  - GDB empty layer cleanup tool
  - NC2TIFF converter
  - WGS84-UTM batch converter

- **Data Collection Systems** (1 system):
  - WebSpoon + Kettle ETL system

- **Historical Imagery Services** (1 service):
  - ESRI Wayback MapServer

- **NASA Documentation** (1 collection):
  - NASA-SP-8001 to SP-8126 aerospace engineering docs

- **RS Algorithms 2025** (8 algorithm types, 30+ models):
  - Super-resolution (Diffusion, Mamba, CNN, SRLatentDiffusion)
  - Semantic segmentation (HDFormer, CM-UNet)
  - Change detection (MF-UNet, CIUCD, CDMamba)
  - Pansharpening (WFANet)
  - Hyperspectral classification (WaveMamba)
  - Diffusion model applications
  - Wavelet + Deep Learning fusion
  - RS-Mamba framework

#### tools/gis_tools/ - GIS Processing Tools
- **gdb_cleaner.py**: Complete GDB empty layer cleanup tool
  - Python + GDAL + Tkinter GUI application
  - Automatic detection of 0-feature layers
  - Two operation modes: backup (safe) and direct (fast)
  - Real-time color-coded logging
  - Threading for responsive UI
  - Error handling and validation
  - PyInstaller packaging support

- **README.md**: Comprehensive documentation
  - Installation guide
  - Usage tutorial (3 simple steps)
  - Technical specifications
  - Example scripts
  - Troubleshooting section
  - FAQs

- **requirements.txt**: Dependency management
  - GDAL>=3.0.0

#### NISAR Satellite
- Added NISAR (NASA-ISRO SAR Mission) to SAR satellites
- Operator: NASA/ISRO
- Type: L-band + S-band SAR
- Public archive: true
- Query URL: https://search.asf.alaska.edu/#/?dataset=NISAR
- Expected launch: 2024-Q1
- Revisit: 12 days
- Global coverage

#### GDAL Processing Documentation
- Created new "preprocessing" category in algorithms_catalog.json
- Documented gdal.Warp() for image clipping
- Parameters explained:
  - destNameOrDestDS - output dataset
  - srcDSOrSrcDSTab - source data
  - options - WarpOptions for clipping info
- Included code example
- Applications: vector clipping, coordinate clipping, reprojection
- Added GDAL Translate and reproject tools
- Updated statistics: 38 algorithms, 9 categories

### Statistics Summary

#### Before Updates
- Satellites: 21
- Data Sources: ~20
- Algorithms: 35
- Tools: ~10

#### After Updates
- Satellites: 22 (+NISAR)
- Data Sources: 30+ (+10 open data sources)
- Algorithms: 38 (+3 GDAL preprocessing)
- Tools: 25+ (+15 specialized tools)
- Total Resources: 100+

## [1.0.0] - Previous Release

### Features
- 22 Satellite missions cataloged
- Interactive map with Leaflet
- Time range filtering
- Location input with coordinates
- AOI drawing tools
- Search functionality with keyboard shortcuts (Ctrl+K)
- Type filtering (Optical, SAR, Hyperspectral, Weather)
- Archive filtering (Public/Private)
- Tasking filtering (Available/Not Available)
- Filter chips with clear functionality
- Sidebar collapse/expand
- Mobile responsive design
- Tooltips and help text
- Loading states and error handling

### Documentation
- README.md - Main platform documentation
- FEATURE_REFINEMENTS.md - Feature details
- TIME_RANGE_FILTER_SPEC.md - Time filter specifications
- PLATFORM_FUNCTIONAL.md - Functionality report
- Multiple deployment and setup guides

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
