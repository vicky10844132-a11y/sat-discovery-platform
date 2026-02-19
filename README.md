# SAT-DISCOVERY - 全球开源卫星数据资源整合公益平台

## 🌍 项目使命

**整合全球零碎的开源资源，让卫星数据服务所有人**

SAT-DISCOVERY 是一个100%开源、100%免费的公益项目，致力于：

- 🔓 **民主化数据访问** - 让每个人都能使用卫星数据
- 🔗 **统一零碎资源** - 一个平台访问全球20+开源数据源
- 🛠️ **开放处理工具** - 集成20+开源算法库
- 📚 **降低技术门槛** - 简化复杂的遥感分析
- 🌱 **支持可持续发展** - 服务环境保护和科学研究

---

## 📊 项目状态

### 三个版本并行开发

#### V1.0 - 静态前端 ✅ 生产就绪

**状态**: 可立即部署  
**功能**: 基础搜索、数据源目录、轨道规划  
**部署**: Vercel静态托管  
**成本**: $0  

**立即部署**:
```bash
cd /home/runner/work/sat-discovery-platform/sat-discovery-platform
vercel --prod
```

#### V2.0 - 客户端架构 🚧 开发中 (10%)

**状态**: 开发中  
**功能**: Workbench UI、客户端插件  
**部署**: Vercel静态托管  
**成本**: $0  
**完成时间**: 8周  

#### V3.0 MVP - 五域全栈 🚀 刚启动 (5%)

**状态**: 基础架构搭建  
**功能**: 后端API、开源资源整合  
**部署**: Docker + Kubernetes  
**成本**: $450-2400/月 (运营)  
**完成时间**: 6周MVP / 16周完整版  

---

## 🌐 开源资源整合

### 数据源 (20+)

#### 官方空间机构
- ✅ **NASA Earth Data** - MODIS, Landsat, ASTER等
- ✅ **ESA Copernicus** - Sentinel-1/2/3/5P
- ✅ **USGS EarthExplorer** - Landsat, DEM
- ✅ **JAXA** - ALOS, GCOM
- ✅ **NOAA** - GOES, AVHRR
- ✅ **EUMETSAT** - Meteosat, MetOp

#### 云平台开放数据
- ✅ **AWS Open Data** - S3上的Sentinel, Landsat
- ✅ **Google Earth Engine** - 1000+数据集
- ✅ **Microsoft Planetary Computer** - STAC最佳实践
- ✅ **Google Cloud Public Datasets**

#### 社区平台
- ✅ **Radiant Earth MLHub** - 机器学习数据集
- ✅ **OpenAerialMap** - 众包航空影像
- ✅ **OpenTopography** - LiDAR点云
- ✅ **Global Forest Watch** - 森林监测

查看完整清单: [OPEN_SOURCE_CATALOG.md](./OPEN_SOURCE_CATALOG.md)

### 算法库 (20+)

#### 核心框架
- ✅ **GDAL/OGR** - 地理空间数据处理
- ✅ **Rasterio** - Python栅格处理
- ✅ **GeoPandas** - 矢量处理

#### 遥感工具
- ✅ **Orfeo ToolBox** - 专业遥感处理
- ✅ **SNAP** - ESA Sentinel官方工具
- ✅ **Google Earth Engine** - 云端分析

#### 机器学习
- ✅ **TensorFlow/Keras** - 深度学习
- ✅ **PyTorch** - 研究友好
- ✅ **Segmentation Models** - 图像分割

#### GIS工具
- ✅ **QGIS Processing** - 500+算法
- ✅ **GRASS GIS** - 地学分析
- ✅ **SAGA GIS** - 自动化分析
- ✅ **WhiteboxTools** - 地形分析

#### 轨道工具
- ✅ **satellite.js** - SGP4轨道计算
- ✅ **Skyfield** - 高精度天文计算
- ✅ **Poliastro** - 轨道力学

查看完整清单: [OPEN_SOURCE_CATALOG.md](./OPEN_SOURCE_CATALOG.md)

---

## 🏗️ 技术架构

### 前端 (V1.0 + V2.0)
- 纯 HTML/CSS/JavaScript
- 单页应用 Workbench
- Leaflet 地图
- WebAssembly 轻量级处理

### 后端 (V3.0)

**微服务架构**:
```
├── API Gateway (3000)      - 认证、路由、限流
├── Data Ingestion (3001)   - 数据源接入
├── Orbital Service (3002)  - 轨道预测
├── Processing (3003)       - 算法处理
└── Scheduler               - 任务调度
```

**技术栈**:
- Node.js 18+ / TypeScript
- PostgreSQL 14 + PostGIS
- Redis 7 (缓存/队列)
- Bull (任务队列)
- Docker + Kubernetes

**科学计算**:
- GDAL 3.6+
- Rasterio / GeoPandas
- NumPy / SciPy
- Orfeo ToolBox
- satellite.js (SGP4)

---

## 🚀 快速开始

### 部署 V1.0 (立即可用)

```bash
# 1. 克隆仓库
git clone https://github.com/vicky10844132-a11y/sat-discovery-platform.git
cd sat-discovery-platform

# 2. 部署到 Vercel
vercel --prod

# 或者直接在 vercel.com 导入 GitHub 仓库
```

### 开发 V3.0 MVP (本地)

```bash
# 1. 进入后端目录
cd backend

# 2. 复制环境变量
cp .env.example .env

# 3. 启动服务
docker-compose up -d

# 4. 检查服务
curl http://localhost:3000/health
```

---

## 📖 文档

### 用户文档
- [快速开始](./QUICKSTART.md) - 5分钟上手
- [部署指南](./DEPLOYMENT_CN.md) - 详细部署步骤
- [用户指南](./VISUAL_GUIDE.md) - UI使用说明

### 开发文档
- [开发者指南](./DEVELOPER.md) - 技术文档
- [V2.0 架构](./ARCHITECTURE_V2.md) - 客户端架构
- [V3.0 架构](./ARCHITECTURE_V3_FULLSTACK.md) - 全栈架构
- [MVP 实施计划](./MVP_IMPLEMENTATION.md) - 6周计划
- [开源资源清单](./OPEN_SOURCE_CATALOG.md) - 完整资源列表

### 项目管理
- [项目状态](./PROJECT_STATUS.md) - 当前进度
- [实施路线图](./IMPLEMENTATION_ROADMAP.md) - 长期规划
- [最终总结](./FINAL_SUMMARY_CN.md) - 三版本策略

---

## 🤝 参与贡献

这是一个社区驱动的公益项目，欢迎所有人参与！

### 贡献方式

1. **添加数据源** - 接入更多开源卫星数据
2. **贡献算法** - 集成开源处理算法
3. **改进文档** - 完善用户指南和教程
4. **报告问题** - 提交 Issues
5. **代码贡献** - 提交 Pull Requests
6. **推广使用** - 分享给更多用户

### 开发指南

```bash
# Fork 仓库
# Clone 到本地
git clone https://github.com/YOUR_USERNAME/sat-discovery-platform.git

# 创建分支
git checkout -b feature/your-feature

# 开发并提交
git add .
git commit -m "Add: your feature"
git push origin feature/your-feature

# 提交 Pull Request
```

---

## 📋 MVP 实施计划

### Week 1-2: 基础架构 + STAC数据源
- [x] 后端项目初始化
- [x] Docker 环境配置
- [ ] STAC 连接器
- [ ] 数据标准化引擎

### Week 3: 轨道预测 + NASA/ESA
- [ ] TLE 管理器
- [ ] SGP4 轨道计算
- [ ] NASA CMR 连接器
- [ ] ESA Copernicus 连接器

### Week 4: 算法框架 + 核心算法
- [ ] 算法插件系统
- [ ] NDVI/NDWI 算法
- [ ] DEM 处理
- [ ] 任务队列

### Week 5: 高级算法 + UI集成
- [ ] SAR 处理
- [ ] 时间序列
- [ ] Workbench 集成

### Week 6: 文档 + 测试 + 部署
- [ ] API 文档
- [ ] 用户指南
- [ ] 测试完善
- [ ] Beta 发布

---

## 💰 成本透明

### 开发成本
- V1.0: 已完成 ✅
- V2.0: 2人 × 8周
- V3.0 MVP: 2-3人 × 6周

### 运营成本 (月)
- V1.0: $0 (Vercel免费)
- V2.0: $0 (Vercel免费)
- V3.0: $450-2400 (云服务)

**资金来源**:
- 个人捐赠
- 机构赞助
- 云服务赞助

---

## 📜 开源许可

**平台代码**: MIT License  
**数据源**: 各数据源原始许可  
**算法库**: 各算法库原始许可  

所有集成的资源和算法都是开源的，符合以下许可之一:
- MIT / Apache 2.0 / BSD
- GPL v2/v3 (独立模块)
- Public Domain

---

## 🌟 致谢

感谢以下开源项目和组织:

**数据提供者**:
- NASA, ESA, USGS, JAXA, NOAA
- AWS, Microsoft, Google
- Radiant Earth, OpenAerialMap

**算法库**:
- OSGeo, QGIS, GRASS
- Orfeo ToolBox, SNAP
- TensorFlow, PyTorch
- GDAL, Rasterio

**社区**:
- 所有贡献者
- 用户反馈
- 开源社区

---

## 📞 联系我们

- **GitHub**: https://github.com/vicky10844132-a11y/sat-discovery-platform
- **Issues**: 提交问题和建议
- **Discussions**: 社区讨论
- **Email**: (待补充)

---

## 🎯 项目里程碑

- ✅ **2026-02-19**: V1.0 完成，可立即部署
- 🚧 **2026-03-19**: V2.0 Beta 发布 (预计)
- 🚀 **2026-04-02**: V3.0 MVP 发布 (预计)
- 📈 **2026-06-01**: V3.0 完整版 (预计)

---

**让卫星数据服务所有人！** 🌍🛰️

---

**最后更新**: 2026-02-19  
**当前版本**: V1.0 (生产) + V2.0 (开发中) + V3.0 (启动中)  
**项目性质**: 公益 · 开源 · 免费
