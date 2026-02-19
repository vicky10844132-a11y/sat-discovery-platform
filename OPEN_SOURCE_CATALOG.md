# 全球开源卫星数据资源和算法清单

## 项目定位

**SAT-DISCOVERY** - 全球开源卫星数据资源整合公益平台

让零碎的开源资源统一在一个平台，服务全球用户。

---

## 🌍 开源数据源清单

### 官方空间机构 (政府开放数据)

#### 1. NASA Earth Data
**描述**: 美国航空航天局地球观测数据  
**类型**: 完全开放  
**访问**: https://earthdata.nasa.gov/  
**数据**:
- MODIS (Terra/Aqua)
- Landsat (1-9)
- ASTER
- SMAP (土壤湿度)
- GPM (降水)
- ICESat/GLAS (冰雪)
- GRACE (重力)

**API**:
- CMR (Common Metadata Repository)
- GIBS (全球影像浏览服务)
- OPeNDAP

**集成优先级**: ⭐⭐⭐⭐⭐ (最高)

#### 2. ESA Copernicus
**描述**: 欧洲航天局哥白尼计划  
**类型**: 完全开放  
**访问**: https://scihub.copernicus.eu/  
**数据**:
- Sentinel-1 (SAR)
- Sentinel-2 (光学)
- Sentinel-3 (海洋/陆地)
- Sentinel-5P (大气)

**API**:
- SciHub API
- Copernicus Data Space API
- STAC API

**集成优先级**: ⭐⭐⭐⭐⭐ (最高)

#### 3. USGS EarthExplorer
**描述**: 美国地质调查局  
**类型**: 免费注册  
**访问**: https://earthexplorer.usgs.gov/  
**数据**:
- Landsat (全系列)
- ASTER
- Aerial Photography
- DEM (SRTM, NED)
- Historical Maps

**API**:
- USGS M2M API
- STAC API

**集成优先级**: ⭐⭐⭐⭐⭐ (最高)

#### 4. JAXA Earth Observation
**描述**: 日本宇宙航空研究开发机构  
**类型**: 部分开放  
**访问**: https://www.eorc.jaxa.jp/  
**数据**:
- ALOS (PALSAR, AVNIR-2)
- GCOM (全球气候观测)
- GPM/DPR
- Himawari (气象卫星)

**集成优先级**: ⭐⭐⭐⭐

#### 5. NOAA Data Catalog
**描述**: 美国国家海洋和大气管理局  
**类型**: 完全开放  
**访问**: https://www.noaa.gov/  
**数据**:
- GOES (气象)
- NOAA-AVHRR
- Sea Surface Temperature
- Ocean Color

**集成优先级**: ⭐⭐⭐⭐

#### 6. EUMETSAT
**描述**: 欧洲气象卫星组织  
**类型**: 免费注册  
**访问**: https://www.eumetsat.int/  
**数据**:
- Meteosat (气象)
- MetOp (极轨气象)

**集成优先级**: ⭐⭐⭐

---

### 云平台开放数据

#### 7. AWS Open Data - Earth
**描述**: 亚马逊云开放数据集  
**类型**: 完全开放  
**访问**: https://registry.opendata.aws/  
**数据**:
- Sentinel-2 (全球)
- Landsat-8 (全球)
- NAIP (美国航空影像)
- NEXRAD (气象雷达)
- Terrain Tiles (地形)

**API**:
- S3 直接访问
- STAC API (Earth Search)

**集成优先级**: ⭐⭐⭐⭐⭐ (最高)

#### 8. Google Earth Engine
**描述**: 谷歌地球引擎公共数据集  
**类型**: 免费学术/非盈利  
**访问**: https://earthengine.google.com/  
**数据**:
- Landsat (全系列)
- Sentinel (全系列)
- MODIS
- SRTM DEM
- 1000+ 数据集

**API**:
- Earth Engine API
- Code Editor

**集成优先级**: ⭐⭐⭐⭐⭐ (最高)

#### 9. Microsoft Planetary Computer
**描述**: 微软行星计算机  
**类型**: 完全开放  
**访问**: https://planetarycomputer.microsoft.com/  
**数据**:
- Sentinel-1, 2, 3
- Landsat
- NAIP
- MODIS
- ASTER

**API**:
- STAC API (最佳实践)
- Dask 集群

**集成优先级**: ⭐⭐⭐⭐⭐ (最高)

#### 10. Google Cloud Public Datasets
**描述**: 谷歌云公共数据集  
**类型**: 完全开放  
**访问**: https://cloud.google.com/public-datasets  
**数据**:
- Landsat
- Sentinel-2
- NAIP

**集成优先级**: ⭐⭐⭐⭐

---

### 社区与研究平台

#### 11. Radiant Earth MLHub
**描述**: 地球观测机器学习数据集  
**类型**: 完全开放  
**访问**: https://mlhub.earth/  
**数据**:
- Training Datasets (标注数据)
- Land Cover
- Crop Type
- Building Detection

**API**:
- STAC API
- MLHub API

**集成优先级**: ⭐⭐⭐⭐⭐ (最高，机器学习)

#### 12. OpenAerialMap
**描述**: 开源航空影像  
**类型**: 众包开放  
**访问**: https://openaerialmap.org/  
**数据**:
- UAV/Drone 影像
- 灾害响应影像
- Community Mapping

**API**:
- OAM API
- TMS/WMTS

**集成优先级**: ⭐⭐⭐⭐

#### 13. OpenTopography
**描述**: 高分辨率地形数据  
**类型**: 完全开放  
**访问**: https://opentopography.org/  
**数据**:
- LiDAR Point Clouds
- DEM (Global, Regional)
- Bathymetry

**API**:
- REST API
- Web Services

**集成优先级**: ⭐⭐⭐⭐

#### 14. CEOS Analysis Ready Data
**描述**: 分析就绪数据  
**类型**: 开放标准  
**访问**: https://ceos.org/ard/  
**数据**:
- ARD Landsat
- ARD Sentinel

**集成优先级**: ⭐⭐⭐

---

### 专题数据集

#### 15. Global Forest Watch
**描述**: 全球森林监测  
**类型**: 完全开放  
**访问**: https://www.globalforestwatch.org/  
**数据**:
- Tree Cover Loss
- Forest Cover
- Fire Alerts

**集成优先级**: ⭐⭐⭐

#### 16. Ocean Data Viewer
**描述**: 海洋数据  
**类型**: 开放  
**数据**:
- Sea Surface Temperature
- Ocean Color
- Bathymetry

**集成优先级**: ⭐⭐⭐

#### 17. Climate Data Store
**描述**: 气候数据存储  
**类型**: 免费注册  
**访问**: https://cds.climate.copernicus.eu/  
**数据**:
- Reanalysis (ERA5)
- Climate Projections

**集成优先级**: ⭐⭐⭐

---

## 🔧 开源处理算法库

### 核心处理框架

#### 1. GDAL/OGR ⭐⭐⭐⭐⭐
**描述**: 地理空间数据抽象库  
**语言**: C/C++ (Python bindings)  
**功能**:
- 格式转换
- 投影转换
- 栅格处理
- 矢量处理

**许可**: MIT/X  
**仓库**: https://github.com/OSGeo/gdal

#### 2. Rasterio ⭐⭐⭐⭐⭐
**描述**: 现代 Python 栅格处理  
**语言**: Python  
**功能**:
- 读写栅格
- 地理变换
- 窗口读取
- COG 支持

**许可**: BSD  
**仓库**: https://github.com/rasterio/rasterio

#### 3. GeoPandas ⭐⭐⭐⭐⭐
**描述**: Python 地理空间矢量处理  
**语言**: Python  
**功能**:
- 矢量操作
- 空间连接
- 叠加分析

**许可**: BSD  
**仓库**: https://github.com/geopandas/geopandas

---

### 遥感专业工具

#### 4. Orfeo ToolBox (OTB) ⭐⭐⭐⭐⭐
**描述**: 遥感图像处理  
**语言**: C++ (Python bindings)  
**功能**:
- 图像滤波
- 特征提取
- 分类
- 分割
- SAR 处理
- 变化检测

**许可**: Apache 2.0  
**仓库**: https://gitlab.orfeo-toolbox.org/orfeotoolbox/otb

#### 5. SNAP (Sentinel Application Platform) ⭐⭐⭐⭐⭐
**描述**: ESA Sentinel 官方工具  
**语言**: Java (GPT 命令行)  
**功能**:
- Sentinel-1 SAR 处理
- Sentinel-2 光学处理
- Radiometric Correction
- Terrain Correction

**许可**: GPL v3  
**仓库**: https://github.com/senbox-org/snap-engine

#### 6. Google Earth Engine ⭐⭐⭐⭐⭐
**描述**: 云端遥感分析  
**语言**: JavaScript / Python  
**功能**:
- 时间序列分析
- 大规模处理
- 机器学习
- 导出结果

**许可**: 免费（非商业）  
**文档**: https://earthengine.google.com/

---

### 图像处理算法

#### 7. scikit-image ⭐⭐⭐⭐⭐
**描述**: Python 图像处理  
**语言**: Python  
**功能**:
- 滤波
- 边缘检测
- 分割
- 特征提取

**许可**: BSD  
**仓库**: https://github.com/scikit-image/scikit-image

#### 8. OpenCV ⭐⭐⭐⭐
**描述**: 计算机视觉库  
**语言**: C++ (Python bindings)  
**功能**:
- 图像处理
- 特征匹配
- 目标检测

**许可**: Apache 2.0  
**仓库**: https://github.com/opencv/opencv

---

### 机器学习框架

#### 9. TensorFlow / Keras ⭐⭐⭐⭐⭐
**描述**: 深度学习框架  
**语言**: Python  
**功能**:
- 图像分类
- 目标检测
- 语义分割
- 时间序列

**许可**: Apache 2.0  
**仓库**: https://github.com/tensorflow/tensorflow

#### 10. PyTorch ⭐⭐⭐⭐⭐
**描述**: 深度学习框架  
**语言**: Python  
**功能**:
- 动态图
- 研究友好
- 部署灵活

**许可**: BSD  
**仓库**: https://github.com/pytorch/pytorch

#### 11. Segmentation Models (PyTorch) ⭐⭐⭐⭐⭐
**描述**: 遥感图像分割模型  
**语言**: Python  
**功能**:
- U-Net
- DeepLab
- FPN
- 预训练模型

**许可**: MIT  
**仓库**: https://github.com/qubvel/segmentation_models.pytorch

---

### GIS 桌面工具 (可集成)

#### 12. QGIS Processing ⭐⭐⭐⭐⭐
**描述**: 开源 GIS 处理框架  
**语言**: Python / C++  
**功能**:
- 500+ 处理算法
- 图形建模器
- Python API

**许可**: GPL v2  
**仓库**: https://github.com/qgis/QGIS

#### 13. GRASS GIS ⭐⭐⭐⭐
**描述**: 地理资源分析支持系统  
**语言**: C / Python  
**功能**:
- 栅格/矢量处理
- 时空数据
- 地形分析

**许可**: GPL v2+  
**仓库**: https://github.com/OSGeo/grass

#### 14. SAGA GIS ⭐⭐⭐⭐
**描述**: 自动化地学分析系统  
**语言**: C++  
**功能**:
- 地形分析
- 水文模拟
- 统计分析

**许可**: GPL v2  
**仓库**: https://sourceforge.net/projects/saga-gis/

#### 15. WhiteboxTools ⭐⭐⭐⭐
**描述**: 先进的地学分析  
**语言**: Rust  
**功能**:
- 水文分析
- DEM 处理
- LiDAR 处理

**许可**: MIT  
**仓库**: https://github.com/jblindsay/whitebox-tools

---

### 专题算法

#### 16. ACOLITE ⭐⭐⭐⭐
**描述**: 水体遥感大气校正  
**语言**: Python  
**功能**:
- Sentinel-2/3 大气校正
- 水质参数反演

**许可**: GPL v3  
**仓库**: https://github.com/acolite/acolite

#### 17. Sen2Cor ⭐⭐⭐⭐
**描述**: Sentinel-2 大气校正  
**语言**: Python  
**功能**:
- L1C → L2A
- 气溶胶校正
- 云掩膜

**许可**: GPL v3  
**官网**: https://step.esa.int/main/snap-supported-plugins/sen2cor/

#### 18. pylandtemp ⭐⭐⭐
**描述**: 地表温度反演  
**语言**: Python  
**功能**:
- Landsat LST
- MODIS LST

**许可**: MIT  
**仓库**: https://github.com/pylandtemp/pylandtemp

---

### 轨道工具

#### 19. satellite.js ⭐⭐⭐⭐⭐
**描述**: SGP4 轨道传播  
**语言**: JavaScript  
**功能**:
- TLE 解析
- 轨道计算
- 过境预测

**许可**: MIT  
**仓库**: https://github.com/shashwatak/satellite-js

#### 20. Skyfield ⭐⭐⭐⭐⭐
**描述**: Python 天文计算  
**语言**: Python  
**功能**:
- 高精度轨道
- 天体位置
- 观测计划

**许可**: MIT  
**仓库**: https://github.com/skyfielders/python-skyfield

#### 21. Poliastro ⭐⭐⭐⭐
**描述**: Python 轨道力学  
**语言**: Python  
**功能**:
- 轨道传播
- 机动规划
- 可视化

**许可**: MIT  
**仓库**: https://github.com/poliastro/poliastro

---

## 📋 集成计划

### 第一批 (MVP - 2周)

**数据源** (3个):
1. ✅ AWS Open Data (STAC)
2. ✅ Microsoft Planetary Computer (STAC)
3. ✅ Radiant MLHub (STAC)

**算法** (2个):
1. ✅ NDVI (基于 Rasterio)
2. ✅ Cloud Mask (简单阈值)

**轨道**:
1. ✅ satellite.js (TLE + SGP4)

### 第二批 (Month 1)

**数据源** (4个):
1. ✅ NASA CMR
2. ✅ ESA Copernicus
3. ✅ USGS EarthExplorer
4. ✅ Google Earth Engine

**算法** (5个):
1. ✅ NDWI, EVI, SAVI
2. ✅ SAR Speckle Filter (基于 OTB)
3. ✅ DEM Slope/Aspect (基于 GDAL)

### 第三批 (Month 2)

**数据源** (所有剩余):
- OpenAerialMap
- OpenTopography
- JAXA
- NOAA

**算法** (高级):
- Orfeo ToolBox 集成
- SNAP 处理链
- 机器学习模型
- 时间序列分析

---

## 🔗 许可证兼容性

所有集成的资源和算法必须符合以下之一:

✅ **完全兼容**:
- MIT License
- Apache 2.0
- BSD License
- Public Domain

⚠️ **兼容但需注明**:
- GPL v2 / v3 (独立模块)
- LGPL

❌ **不可集成**:
- 商业许可
- 限制性许可

---

## 🌐 公益声明

**SAT-DISCOVERY** 是一个非盈利的公益项目，旨在:

1. **民主化卫星数据访问** - 让所有人都能使用卫星数据
2. **整合零碎资源** - 统一的接口访问全球开源资源
3. **降低技术门槛** - 简化复杂的遥感分析
4. **教育与研究** - 支持学术研究和教育
5. **环境监测** - 服务环境保护和可持续发展

**开源承诺**:
- 平台代码 100% 开源
- 不收取任何费用
- 接入开源资源
- 使用开源算法
- 社区驱动开发

---

**最后更新**: 2026-02-19  
**资源总数**: 20+ 数据源 + 20+ 算法库  
**集成进度**: 0% (启动中)
