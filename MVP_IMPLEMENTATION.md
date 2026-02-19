# V3.0 MVP 实施计划 - 开源资源整合优先

## 项目使命

**SAT-DISCOVERY** - 全球开源卫星数据资源整合公益平台

整合全球零碎的开源资源，提供统一访问接口，服务全球用户。

---

## 🎯 MVP 目标 (6周)

### 核心目标

1. **接入 5+ 开源数据源**
2. **集成 5+ 开源算法**
3. **提供统一 API**
4. **100% 开源免费**

---

## 📅 6周实施计划

### Week 1-2: 基础架构 + 第一批数据源

#### 后端基础设施

**Day 1-2: 项目初始化**
- [ ] 创建 Node.js 后端项目
- [ ] 设置 Express/Fastify
- [ ] 配置 TypeScript
- [ ] Docker 开发环境

**Day 3-5: 数据库设置**
- [ ] PostgreSQL + PostGIS
- [ ] Redis (缓存)
- [ ] 数据库迁移工具
- [ ] 基础 Schema

**Day 6-7: API Gateway**
- [ ] 路由设置
- [ ] 基础认证 (可选)
- [ ] CORS 配置
- [ ] 健康检查

**Day 8-10: 连接器框架**
- [ ] DataConnector 接口
- [ ] 连接器注册器
- [ ] 标准化引擎
- [ ] 元数据索引

#### 第一批数据源 (STAC)

**Day 11-14: STAC 连接器**
- [ ] STAC Client 基础
- [ ] AWS Earth Search
- [ ] Microsoft Planetary Computer
- [ ] Radiant MLHub

**测试**:
- [ ] 搜索功能测试
- [ ] 元数据标准化测试
- [ ] 性能测试

---

### Week 3: 轨道预测 + 第二批数据源

#### 轨道域

**Day 15-17: TLE 管理**
- [ ] TLE 数据库模型
- [ ] Celestrak 集成
- [ ] TLE 更新服务
- [ ] 历史TLE存储

**Day 18-19: 轨道计算**
- [ ] satellite.js 集成
- [ ] 过境预测 API
- [ ] AOI 覆盖计算

**Day 20-21: 可视化**
- [ ] 轨道轨迹计算
- [ ] GeoJSON 输出
- [ ] 前端地图集成

#### 第二批数据源 (API)

- [ ] NASA CMR 连接器
- [ ] ESA Copernicus (基础)

---

### Week 4: 处理算法 + 任务队列

#### 处理域

**Day 22-24: 算法框架**
- [ ] Algorithm 接口
- [ ] 算法注册器
- [ ] 输入验证
- [ ] 输出标准化

**Day 25-28: 核心算法**
- [ ] NDVI 算法
  - Rasterio 读取
  - NumPy 计算
  - COG 输出
- [ ] NDWI 算法
- [ ] Cloud Mask (简单)
- [ ] DEM Slope (GDAL)

#### 任务队列

- [ ] Bull Queue 设置
- [ ] Worker 进程
- [ ] 任务状态追踪
- [ ] 基础日志

---

### Week 5: 更多算法 + UI集成

#### 算法扩展

**Day 29-31: SAR 处理**
- [ ] Orfeo ToolBox Python 绑定
- [ ] Speckle Filter
- [ ] Backscatter 分析

**Day 32-33: 时间序列**
- [ ] 时间序列查询
- [ ] NDVI 趋势分析
- [ ] 简单可视化

**Day 34-35: 地形分析**
- [ ] GDAL DEM 工具
- [ ] Slope/Aspect
- [ ] Hillshade

#### UI 集成

- [ ] V2.0 Workbench 连接后端
- [ ] 数据源选择器
- [ ] 算法执行界面
- [ ] 结果展示

---

### Week 6: 文档 + 测试 + 部署

#### 文档

**Day 36-37: API 文档**
- [ ] OpenAPI/Swagger
- [ ] 端点说明
- [ ] 示例代码
- [ ] 教程

**Day 38: 用户指南**
- [ ] 快速开始
- [ ] 数据源使用
- [ ] 算法使用
- [ ] FAQ

#### 测试

**Day 39-40: 集成测试**
- [ ] 端到端测试
- [ ] 性能测试
- [ ] 负载测试
- [ ] 边界测试

#### 部署

**Day 41-42: 生产部署**
- [ ] Docker 容器化
- [ ] Docker Compose
- [ ] 环境配置
- [ ] 监控设置
- [ ] 备份策略

---

## 🏗️ 技术架构

### 后端服务

```
backend/
├── services/
│   ├── gateway/           # API Gateway (Port 3000)
│   ├── data-ingestion/    # 数据接入 (Port 3001)
│   ├── orbital/           # 轨道计算 (Port 3002)
│   └── processing/        # 算法处理 (Port 3003)
│
├── shared/
│   ├── database/          # 数据库工具
│   ├── redis/             # Redis 工具
│   └── utils/             # 通用工具
│
├── connectors/            # 数据源连接器
│   ├── stac/              # STAC 连接器
│   ├── nasa-cmr/          # NASA CMR
│   └── copernicus/        # Copernicus
│
├── algorithms/            # 处理算法
│   ├── spectral/          # 光谱指数
│   ├── sar/               # SAR 处理
│   └── terrain/           # 地形分析
│
└── docker-compose.yml     # 开发环境
```

### 技术栈

**核心**:
- Node.js 18+ / TypeScript
- Python 3.11+ (算法)
- PostgreSQL 14 + PostGIS
- Redis 7

**处理**:
- GDAL 3.6+
- Rasterio
- NumPy/SciPy
- Orfeo ToolBox

**容器**:
- Docker
- Docker Compose

---

## 📊 数据流

```
用户请求
    ↓
API Gateway (认证/路由)
    ↓
数据接入服务
    ├→ STAC 连接器 → AWS/PC/MLHub
    ├→ CMR 连接器 → NASA
    └→ Copernicus 连接器 → ESA
    ↓
元数据标准化
    ↓
存储到 PostgreSQL/PostGIS
    ↓
算法处理服务
    ├→ NDVI 算法
    ├→ SAR 算法
    └→ DEM 算法
    ↓
任务队列 (Bull/Redis)
    ↓
Worker 执行
    ↓
结果存储
    ↓
返回用户
```

---

## 🔌 连接器实现

### STAC 连接器示例

```typescript
// connectors/stac/stac-connector.ts
import { DataConnector, SearchQuery, Item } from '../base';

export class STACConnector implements DataConnector {
  private baseUrl: string;
  
  constructor(config: { url: string }) {
    this.baseUrl = config.url;
  }
  
  async search(query: SearchQuery): Promise<Item[]> {
    const stacQuery = {
      bbox: query.bbox,
      datetime: `${query.startDate}/${query.endDate}`,
      collections: query.collections,
      limit: query.limit || 100
    };
    
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stacQuery)
    });
    
    const data = await response.json();
    
    // 标准化为内部格式
    return data.features.map(this.normalizeItem);
  }
  
  private normalizeItem(stacItem: any): Item {
    return {
      id: stacItem.id,
      collection: stacItem.collection,
      geometry: stacItem.geometry,
      datetime: stacItem.properties.datetime,
      cloudCover: stacItem.properties['eo:cloud_cover'],
      resolution: stacItem.properties.gsd,
      assets: stacItem.assets,
      source: {
        connector: 'stac',
        originalId: stacItem.id
      }
    };
  }
}
```

### NASA CMR 连接器

```typescript
// connectors/nasa-cmr/cmr-connector.ts
export class NASACMRConnector implements DataConnector {
  private baseUrl = 'https://cmr.earthdata.nasa.gov/search';
  
  async search(query: SearchQuery): Promise<Item[]> {
    const cmrQuery = {
      bounding_box: query.bbox.join(','),
      temporal: `${query.startDate},${query.endDate}`,
      page_size: query.limit || 100
    };
    
    const params = new URLSearchParams(cmrQuery);
    const response = await fetch(
      `${this.baseUrl}/granules.json?${params}`
    );
    
    const data = await response.json();
    
    return data.feed.entry.map(this.normalizeItem);
  }
  
  private normalizeItem(cmrItem: any): Item {
    // 转换 CMR 格式到标准格式
    // ...
  }
}
```

---

## 🧮 算法实现

### NDVI 算法

```python
# algorithms/spectral/ndvi.py
import numpy as np
import rasterio
from rasterio.plot import reshape_as_image

def calculate_ndvi(red_band_path: str, nir_band_path: str, output_path: str):
    """
    计算 NDVI (Normalized Difference Vegetation Index)
    NDVI = (NIR - RED) / (NIR + RED)
    """
    # 读取红光波段
    with rasterio.open(red_band_path) as red_src:
        red = red_src.read(1).astype(float)
        profile = red_src.profile
    
    # 读取近红外波段
    with rasterio.open(nir_band_path) as nir_src:
        nir = nir_src.read(1).astype(float)
    
    # 计算 NDVI
    # 避免除以零
    ndvi = np.where(
        (nir + red) == 0,
        0,
        (nir - red) / (nir + red)
    )
    
    # 写入结果
    profile.update(dtype=rasterio.float32, count=1)
    with rasterio.open(output_path, 'w', **profile) as dst:
        dst.write(ndvi.astype(rasterio.float32), 1)
    
    return output_path
```

### DEM Slope

```python
# algorithms/terrain/slope.py
from osgeo import gdal
import numpy as np

def calculate_slope(dem_path: str, output_path: str, units='degrees'):
    """
    使用 GDAL 计算坡度
    """
    # 打开 DEM
    dem = gdal.Open(dem_path)
    
    # 计算坡度
    gdal.DEMProcessing(
        output_path,
        dem,
        'slope',
        format='GTiff',
        computeEdges=True,
        slopeFormat=units
    )
    
    return output_path
```

---

## 🧪 测试策略

### 单元测试

```typescript
// tests/connectors/stac.test.ts
describe('STAC Connector', () => {
  it('should search and return standardized items', async () => {
    const connector = new STACConnector({
      url: 'https://earth-search.aws.element84.com/v1'
    });
    
    const results = await connector.search({
      bbox: [-180, -90, 180, 90],
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      collections: ['sentinel-2-l2a'],
      limit: 10
    });
    
    expect(results).toHaveLength(10);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('geometry');
    expect(results[0].source.connector).toBe('stac');
  });
});
```

---

## 📦 部署配置

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL + PostGIS
  postgres:
    image: postgis/postgis:14-3.3
    environment:
      POSTGRES_DB: sat_discovery
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
  
  # API Gateway
  gateway:
    build: ./services/gateway
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://admin:${DB_PASSWORD}@postgres:5432/sat_discovery
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
  
  # Data Ingestion Service
  data-ingestion:
    build: ./services/data-ingestion
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://admin:${DB_PASSWORD}@postgres:5432/sat_discovery
    depends_on:
      - postgres
  
  # Orbital Service
  orbital:
    build: ./services/orbital
    ports:
      - "3002:3002"
    environment:
      DATABASE_URL: postgresql://admin:${DB_PASSWORD}@postgres:5432/sat_discovery
    depends_on:
      - postgres
  
  # Processing Service
  processing:
    build: ./services/processing
    ports:
      - "3003:3003"
    environment:
      REDIS_URL: redis://redis:6379
    depends_on:
      - redis

volumes:
  postgres_data:
  redis_data:
```

---

## 📝 环境变量

```bash
# .env.example
# Database
DATABASE_URL=postgresql://admin:password@localhost:5432/sat_discovery

# Redis
REDIS_URL=redis://localhost:6379

# API Keys (可选)
NASA_API_KEY=
ESA_USERNAME=
ESA_PASSWORD=

# 服务端口
GATEWAY_PORT=3000
DATA_INGESTION_PORT=3001
ORBITAL_PORT=3002
PROCESSING_PORT=3003

# 开发/生产
NODE_ENV=development
```

---

## 🎯 成功指标

### MVP 完成标准

✅ **数据接入**:
- 5+ 开源数据源可用
- STAC 标准化完成
- 搜索功能正常

✅ **轨道预测**:
- TLE 自动更新
- 过境预测准确
- 覆盖计算正确

✅ **算法处理**:
- 5+ 算法可执行
- 结果格式正确
- 性能可接受

✅ **系统稳定性**:
- API 响应 < 2s
- 无致命错误
- 基础监控就绪

✅ **文档完整**:
- API 文档
- 用户指南
- 部署文档

---

## 🚀 发布计划

### Week 6 末

**Beta 版本**:
- 功能完整
- 文档齐全
- 可公开测试

**发布渠道**:
- GitHub Release
- 技术博客
- 社交媒体
- 遥感社区

**反馈收集**:
- GitHub Issues
- 用户调查
- 社区讨论

---

## 📈 后续规划

### Month 2-3

**更多数据源**:
- Google Earth Engine
- OpenAerialMap
- OpenTopography
- 所有计划中的源

**高级算法**:
- SNAP 处理链
- 机器学习模型
- 复杂时间序列
- 变化检测

**性能优化**:
- 缓存策略
- 并发处理
- 资源管理

### Month 4+

**社区功能**:
- 用户上传算法
- 插件市场
- 数据共享
- 协作功能

---

**文档版本**: V3.0 MVP Implementation  
**创建日期**: 2026-02-19  
**预计完成**: 2026-04-02 (6周)  
**状态**: 启动中 🚀
