# SAT-DISCOVERY Platform 🛰️

**遥感数据处理平台** - 无存储算法处理 · 整合全球资源

## 🎯 项目定位

SAT-DISCOVERY 是一个**无存储的算法处理平台**（Processing-as-a-Service），类似于 Google Earth Engine 和 Sentinel Hub：

- 📊 **整合数据源目录** - 40+ 全球遥感数据源
- 🔧 **提供处理算法** - 35+ 专业算法  
- ☁️ **云端计算** - Serverless 架构
- 💾 **不存储数据** - 只做计算，不存输入输出
- ❤️ **公益免费** - 免费提供服务

## 🔄 工作原理

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  选择数据源  │  →  │  配置算法    │  →  │  提交任务   │
│ (STAC/URL)  │     │  (参数设置)  │     │  (云端处理) │
└─────────────┘     └──────────────┘     └─────────────┘
                                               ↓
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  下载结果   │  ←  │  临时链接    │  ←  │  算法执行   │
│ (24小时内)  │     │ (24小时有效) │     │  (Lambda)   │
└─────────────┘     └──────────────┘     └─────────────┘
                                               ↓
                                         自动清理临时文件
```

**核心特点**:
- ❌ 不存储输入数据（从外部源调用）
- ❌ 不存储输出数据（24小时后自动删除）
- ✅ 只做算法处理（加工器）
- ✅ 低成本运营（$0.002/次）

## 📊 数据源目录 (40+)

查看完整目录: [📖 data_sources.html](./data_sources.html)

### 免费 SAR 数据
- **ESA Sentinel-1** - 全球 C 波段 SAR (PB级, 10m)
- **Alaska Satellite Facility** - Sentinel-1 + ALOS PALSAR
- **JAXA G-Portal** - ALOS / PALSAR数据

### 商业 SAR 样本
- **Capella Space** - 开放数据集 (TB级, 0.5-1m)
- **Umbra** - 样本数据 (GB级, 0.25-1m)
- **ICEYE** - 样本数据 (GB级, ~1m)

### 免费光学数据
- **ESA Copernicus** - Sentinel-2/3 (PB级, 10-60m)
- **NASA/USGS Landsat** - Landsat 8/9 (PB级, 15-30m)
- **NASA Earthdata** - MODIS, VIIRS等

### DEM 数据
- **NASA SRTM** - 全球 DEM (30m)
- **ESA Copernicus DEM** - 全球 DEM (30/90m)
- **OpenTopography** - 高精度 LiDAR

### 聚合平台
- **AWS Open Data** - S3上的Sentinel, Landsat
- **Microsoft Planetary Computer** - STAC API
- **Google Earth Engine** - 1000+ 数据集（云端处理）

## 🔧 算法目录 (35+)

查看完整目录: [📖 algorithms.html](./algorithms.html)

### 1. 光谱指数 (5个)
- **NDVI** - 归一化植被指数
- **NDWI** - 归一化水体指数
- **EVI** - 增强植被指数
- **SAVI** - 土壤调节植被指数
- **NDBI** - 归一化建筑指数

### 2. SAR 处理 (3个)
- **斑点滤波** - Lee, Frost, Gamma MAP
- **相干性计算** - 时间序列相干性
- **地形校正** - Range Doppler 校正

### 3. DEM 分析 (4个)
- **坡度计算** - Slope
- **坡向计算** - Aspect
- **山体阴影** - Hillshade
- **地形位置指数** - TPI

### 4. 变化检测 (3个)
- **影像差值法**
- **NDVI差值法**
- **PCA变化检测**

### 5. 图像处理 (4个)
- **云掩膜** - Fmask, Sen2Cor
- **全色融合** - Pansharpening
- **大气校正** - 6S, DOS
- **影像镶嵌** - Mosaic

### 6. 分类与提取 (3个)
- **监督分类** - Random Forest, SVM
- **非监督分类** - K-means, ISODATA
- **水体提取** - NDWI阈值法

### 7. 时间序列 (2个)
- **时间聚合** - Mean, Max, Min, Median
- **物候分析** - 植被生长季参数

### 8. 通用工具 (5个)
- **AOI裁剪** - Clip
- **投影转换** - Reproject
- **重采样** - Resample
- **分区统计** - Zonal Statistics
- **COG转换** - Cloud-Optimized GeoTIFF

## 💻 技术架构

### 前端
- **框架**: 纯 HTML/CSS/JavaScript (无框架依赖)
- **样式**: 暗色主题 (#020b16) + 黄色强调 (#ffd700)
- **地图**: Leaflet.js (可选)
- **部署**: Vercel/Netlify (免费静态托管)

### 后端 (Serverless)
- **API**: AWS API Gateway / Vercel Functions
- **计算**: AWS Lambda / Google Cloud Functions
- **队列**: Redis (Bull) / AWS SQS
- **临时存储**: S3 (24小时lifecycle) / GCS

### 算法环境
- **运行时**: Python 3.11 + GDAL 3.6
- **核心库**: rasterio, numpy, scipy, scikit-image
- **SAR**: pyroSAR, SNAP (可选)
- **机器学习**: scikit-learn, TensorFlow (可选)

## 💰 成本估算

### 单次处理成本
- Lambda 执行: ~$0.001
- S3 临时存储: ~$0.0003
- 数据传输: ~$0.001
- **总计**: ~$0.002 (约 ¥0.014)

### 月度成本
| 处理次数 | Lambda | 存储 | 传输 | API | 总计 |
|---------|--------|------|------|-----|------|
| 1000次 | $2 | $0.3 | $1 | $3.5 | ~$7 |
| 10000次 | $20 | $3 | $10 | $35 | ~$68 |

**对比**: Google Earth Engine (免费研究版) / Sentinel Hub ($0.1/km²)

## 🚀 快速开始

### 1. 浏览数据源
访问 [data_sources.html](./data_sources.html) 查看40+全球数据源

### 2. 选择算法
访问 [algorithms.html](./algorithms.html) 查看35+处理算法

### 3. 本地部署
```bash
# 克隆仓库
git clone https://github.com/vicky10844132-a11y/sat-discovery-platform.git
cd sat-discovery-platform

# 启动本地服务器（可选）
python -m http.server 8000

# 访问
open http://localhost:8000
```

### 4. 部署到 Vercel（免费）
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

## 📁 项目结构

```
sat-discovery-platform/
├── index.html                   # 首页
├── data_sources.html           # 数据源目录
├── data_sources_catalog.json  # 数据源JSON
├── algorithms.html             # 算法目录
├── algorithms_catalog.json    # 算法JSON
├── app.html                    # Dashboard (旧版)
├── css/                        # 样式文件
│   ├── theme.css              # 主题
│   ├── layout.css             # 布局
│   └── components.css         # 组件
├── js/                         # JavaScript模块
│   ├── dataLoader.js
│   ├── indexer.js
│   └── ...
├── backend/                    # 后端代码（开发中）
│   ├── package.json
│   ├── docker-compose.yml
│   └── src/
├── docs/                       # 文档
│   ├── ARCHITECTURE_PROCESSING_PLATFORM.md
│   ├── OPEN_SOURCE_CATALOG.md
│   └── ...
└── README.md                   # 本文件
```

## 📚 文档索引

### 用户文档
- [数据源目录](./data_sources.html) - 40+ 全球数据源
- [算法目录](./algorithms.html) - 35+ 处理算法
- [快速开始](./QUICKSTART.md) - 使用指南

### 开发文档
- [架构设计](./ARCHITECTURE_PROCESSING_PLATFORM.md) - 无存储处理平台
- [开源资源清单](./OPEN_SOURCE_CATALOG.md) - 详细资源列表
- [开发指南](./DEVELOPER.md) - 技术文档

## 🤝 反馈与建议

欢迎用户反馈！可以：
- 🐛 报告 Bug
- 💡 提出功能建议
- 📝 改进文档
- 💬 使用讨论区交流

### 反馈方式
- **问题反馈**: [Issues](https://github.com/vicky10844132-a11y/sat-discovery-platform/issues)
- **功能建议**: [Discussions](https://github.com/vicky10844132-a11y/sat-discovery-platform/discussions)

## 📄 版权声明

**版权所有 © 2026 SAT-DISCOVERY Platform**

本平台为公益项目，提供免费服务，但源代码为私有财产，不对外公开。

**使用条款**:
- ✅ 平台服务 100% 免费
- ✅ 面向全球用户开放
- ✅ 公益性质，非商业
- ❌ 源代码不公开
- ⚖️ 保留所有权利

## 🌟 致谢

感谢以下开源项目和数据提供者：
- ESA Copernicus / Sentinel 系列
- NASA / USGS Landsat
- AWS Open Data Program
- Microsoft Planetary Computer
- Google Earth Engine
- GDAL / Rasterio / NumPy

## 📞 联系方式

- **项目主页**: [GitHub](https://github.com/vicky10844132-a11y/sat-discovery-platform)
- **问题反馈**: [Issues](https://github.com/vicky10844132-a11y/sat-discovery-platform/issues)
- **讨论区**: [Discussions](https://github.com/vicky10844132-a11y/sat-discovery-platform/discussions)

---

**SAT-DISCOVERY** - 无存储算法处理平台 · 只做计算，不存数据 · 公益免费
