# SAT-DISCOVERY 2.0 架构设计 - 六大域系统

## 概述

将当前多页面架构重构为统一 Workbench 单页应用，实现六大域功能系统。

---

## 🎯 架构目标

### 核心原则
1. **不托管影像** - 仅提供索引和接口
2. **不缓存私有数据** - 保护用户隐私
3. **不内置专有API** - 保持开放性
4. **不存储敏感数据** - 安全第一

### 交付标准
- ✅ 任意 STAC 可接入
- ✅ 至少一个轨道引擎可运行
- ✅ 至少两个处理引擎可运行
- ✅ 所有 skeleton 插件可加载
- ✅ UI 不崩溃
- ✅ 所有错误都有明确提示

---

## 🏗️ 六大域详细设计

### 1️⃣ 数据接入域 (Data Connector Domain)

#### 架构
```javascript
DataConnectorManager
  ├── connectors/
  │   ├── StacConnector
  │   ├── NasaCmrConnector
  │   ├── CopernicusConnector
  │   ├── UsgsConnector
  │   ├── SentinelHubConnector
  │   ├── OgcApiConnector
  │   ├── WmsWmtsConnector
  │   ├── S3Connector
  │   ├── HttpFtpConnector
  │   └── CustomApiConnector
  ├── ConnectorRegistry (插件注册)
  └── ConnectorConfig (可视化配置)
```

#### 核心接口
```javascript
class DataConnector {
  async connect(config) {}
  async search(query) {}
  async getMetadata(id) {}
  async getCapabilities() {}
  validate(config) {}
}
```

#### 配置示例
```json
{
  "type": "stac",
  "name": "AWS Earth Search",
  "url": "https://earth-search.aws.element84.com/v1",
  "auth": null,
  "collections": ["sentinel-2-l2a"]
}
```

---

### 2️⃣ 搜索与过滤域 (Search & Filter Domain)

#### 架构
```javascript
SearchEngine
  ├── QueryBuilder
  │   ├── BboxQuery
  │   ├── PolygonQuery
  │   ├── TimeRangeQuery
  │   ├── CloudCoverQuery
  │   ├── ResolutionQuery
  │   ├── OrbitQuery
  │   └── CustomFieldQuery
  ├── ResultNormalizer
  ├── MapVisualizer
  └── JsonExporter
```

#### 查询接口
```javascript
{
  geometry: {
    type: "bbox",
    coordinates: [minX, minY, maxX, maxY]
  },
  temporal: {
    start: "2024-01-01",
    end: "2024-12-31"
  },
  filters: {
    cloudCover: { max: 20 },
    resolution: { min: 10, max: 30 },
    sensorType: ["optical"],
    orbit: { ascending: true }
  },
  extensions: {
    customField: "value"
  }
}
```

#### 标准化输出
```javascript
{
  id: "unique-id",
  geometry: GeoJSON,
  properties: {
    datetime: ISO8601,
    cloudCover: number,
    resolution: number,
    sensorType: string,
    ...extensions
  },
  assets: {
    preview: { href: url },
    data: { href: url }
  },
  source: { connector: name, collection: name }
}
```

---

### 3️⃣ 轨道预测域 (Orbit Prediction Domain)

#### 架构
```javascript
OrbitEngine
  ├── TleManager
  │   ├── import(tle)
  │   ├── update()
  │   └── validate()
  ├── PassPredictor
  │   ├── calculatePasses(satellite, location, duration)
  │   ├── getNextPass()
  │   └── getVisibilityWindow()
  ├── AoiCoverageCalculator
  │   ├── calculateCoverage(satellite, aoi, timeRange)
  │   └── getSwathPolygons()
  └── ScheduleAnalyzer
      ├── getFutureSchedule()
      └── optimizeAcquisition()
```

#### TLE 数据结构
```javascript
{
  name: "SENTINEL-1A",
  noradId: 39634,
  line1: "1 39634U 14016A ...",
  line2: "2 39634 ...",
  epoch: ISO8601,
  source: "celestrak"
}
```

#### Pass 预测输出
```javascript
{
  satellite: "SENTINEL-1A",
  startTime: ISO8601,
  endTime: ISO8601,
  maxElevation: degrees,
  direction: "ascending/descending",
  aoiCoverage: percentage,
  swathGeometry: GeoJSON
}
```

---

### 4️⃣ 处理算法域 (Processing Algorithm Domain)

#### 架构
```javascript
ProcessingEngine
  ├── algorithms/
  │   ├── NdviAlgorithm
  │   ├── SarProcessor
  │   ├── VectorStatistics
  │   ├── ClipProcessor
  │   ├── CogConverter
  │   └── CustomAlgorithm (plugin)
  ├── AlgorithmRegistry
  └── AlgorithmExecutor
```

#### 算法接口
```javascript
class Algorithm {
  name: string
  version: string
  inputs: Schema
  outputs: Schema
  
  async execute(inputs, config) {}
  validate(inputs) {}
  getDocumentation() {}
}
```

#### 算法配置示例
```javascript
{
  algorithm: "ndvi",
  inputs: {
    red_band: { asset: "B04", connector: "stac" },
    nir_band: { asset: "B08", connector: "stac" }
  },
  config: {
    outputFormat: "cog",
    noDataValue: -9999
  }
}
```

---

### 5️⃣ 任务调度域 (Task Scheduler Domain)

#### 架构
```javascript
TaskScheduler
  ├── TaskQueue
  │   ├── add(task)
  │   ├── remove(taskId)
  │   ├── pause(taskId)
  │   └── resume(taskId)
  ├── StateMachine
  │   ├── states: [pending, running, success, failed, cancelled]
  │   └── transitions
  ├── Logger
  │   ├── logInfo()
  │   ├── logError()
  │   └── getHistory()
  └── ErrorHandler
      ├── retry(taskId, maxRetries)
      └── rollback(taskId)
```

#### 任务定义
```javascript
{
  id: "task-uuid",
  type: "processing",
  status: "pending",
  config: {
    algorithm: "ndvi",
    inputs: {...},
    outputs: {...}
  },
  metadata: {
    createdAt: ISO8601,
    startedAt: ISO8601,
    completedAt: ISO8601,
    retries: 0,
    maxRetries: 3
  },
  logs: [
    { timestamp, level, message }
  ]
}
```

---

### 6️⃣ 插件管理域 (Plugin Management Domain)

#### 架构
```javascript
PluginManager
  ├── PluginRegistry
  │   ├── register(plugin)
  │   ├── unregister(pluginId)
  │   ├── list()
  │   └── get(pluginId)
  ├── VersionManager
  │   ├── checkCompatibility()
  │   └── migrate()
  ├── StateManager
  │   ├── enable(pluginId)
  │   ├── disable(pluginId)
  │   └── getStatus(pluginId)
  └── ConfigManager
      ├── getTemplate()
      ├── validate(config)
      └── save(config)
```

#### 插件规范
```javascript
{
  id: "plugin-uuid",
  name: "Custom STAC Connector",
  version: "1.0.0",
  type: "connector", // connector, algorithm, visualizer
  author: "...",
  description: "...",
  
  // 插件元数据
  metadata: {
    tags: ["stac", "connector"],
    license: "MIT",
    homepage: "...",
    repository: "..."
  },
  
  // 依赖
  dependencies: {
    platform: ">=2.0.0",
    plugins: ["base-connector"]
  },
  
  // 配置模板
  configSchema: {...},
  
  // 帮助文档
  documentation: {
    readme: "...",
    examples: [...]
  },
  
  // 插件代码
  main: "plugin.js",
  exports: {
    Connector: Class,
    Algorithm: Class
  }
}
```

---

## 🖥️ UI 统一 Workbench 设计

### 布局结构
```
┌────────────────────────────────────────────────────────────┐
│  Header: SAT-DISCOVERY 2.0                                 │
├──────────┬──────────────────────────────────┬──────────────┤
│          │                                  │              │
│  Left    │        Center Map                │    Right     │
│  Nav     │                                  │   Panel      │
│  (200px) │                                  │   (320px)    │
│          │                                  │              │
│  □ Home  │     [Interactive Map]            │ ┌──────────┐ │
│  □ Data  │                                  │ │ Active   │ │
│  □ Search│     - Basemap layers             │ │ Module   │ │
│  □ Orbit │     - Search results             │ │          │ │
│  □ Tasks │     - AOI drawing                │ │ Config   │ │
│  □ Algos │     - Satellite tracks           │ │ Inputs   │ │
│  □ Plugins                                  │ │ Outputs  │ │
│          │                                  │ │ Actions  │ │
│          │                                  │ └──────────┘ │
└──────────┴──────────────────────────────────┴──────────────┘
```

### 模块化面板
每个域对应一个左侧导航项，点击后右侧显示对应的操作面板：

1. **Data Connectors** - 数据源管理
2. **Search & Filter** - 搜索配置
3. **Orbit Prediction** - 轨道预测
4. **Processing** - 算法执行
5. **Tasks** - 任务管理
6. **Plugins** - 插件管理

---

## 📦 技术栈

### 前端框架
- **保持 Vanilla JS** - 无框架依赖
- **Leaflet / OpenLayers** - 地图库
- **Chart.js** - 图表可视化

### 状态管理
```javascript
// 全局状态管理
const AppState = {
  currentModule: 'search',
  connectors: [],
  searchQuery: {},
  searchResults: [],
  selectedItems: [],
  tasks: [],
  plugins: [],
  
  // Event emitter
  listeners: {},
  emit(event, data) {},
  on(event, handler) {}
}
```

### 路由
```javascript
// Hash 路由 (保持现有 Router)
#/data/connectors
#/search
#/orbit/prediction
#/tasks
#/plugins
```

---

## 🔌 插件系统实现

### 插件加载机制
```javascript
class PluginLoader {
  async load(pluginPath) {
    // 1. 加载插件代码
    const code = await fetch(pluginPath)
    
    // 2. 沙箱执行
    const sandbox = this.createSandbox()
    const plugin = sandbox.execute(code)
    
    // 3. 验证接口
    this.validate(plugin)
    
    // 4. 注册到系统
    PluginManager.register(plugin)
    
    return plugin
  }
  
  createSandbox() {
    // 隔离环境，限制权限
    return {
      console: console,
      fetch: limitedFetch,
      localStorage: null, // 不允许直接访问
      // 提供受限API
      api: {
        registerConnector: (connector) => {},
        registerAlgorithm: (algo) => {}
      }
    }
  }
}
```

---

## 🚦 实施路线图

### Phase 1: 基础架构 (Week 1-2)
- [ ] 重构为单页应用 Workbench
- [ ] 实现左中右三栏布局
- [ ] 集成地图库 (Leaflet)
- [ ] 实现模块化路由
- [ ] 全局状态管理

### Phase 2: 核心域 (Week 3-4)
- [ ] 数据接入域 - STAC Connector
- [ ] 搜索与过滤域 - 基础查询
- [ ] 轨道预测域 - TLE 导入
- [ ] 插件管理域 - 注册机制

### Phase 3: 扩展域 (Week 5-6)
- [ ] 数据接入域 - 更多 Connector
- [ ] 处理算法域 - NDVI, SAR
- [ ] 任务调度域 - 队列和状态机

### Phase 4: 完善与测试 (Week 7-8)
- [ ] 所有插件接口完善
- [ ] 错误处理和提示
- [ ] 性能优化
- [ ] 文档完善
- [ ] 测试覆盖

---

## 📝 代码示例

### Workbench 主结构
```javascript
// workbench.js
class Workbench {
  constructor() {
    this.leftNav = new LeftNavigation()
    this.centerMap = new MapView()
    this.rightPanel = new RightPanel()
    this.state = AppState
  }
  
  init() {
    this.leftNav.render()
    this.centerMap.init()
    this.rightPanel.render()
    this.setupEventListeners()
  }
  
  switchModule(moduleName) {
    this.state.currentModule = moduleName
    this.rightPanel.loadModule(moduleName)
    this.state.emit('moduleChanged', moduleName)
  }
}
```

### STAC Connector 示例
```javascript
// connectors/stac-connector.js
class StacConnector extends DataConnector {
  constructor(config) {
    super()
    this.url = config.url
    this.collections = config.collections
  }
  
  async search(query) {
    const stacQuery = this.toStacQuery(query)
    const response = await fetch(`${this.url}/search`, {
      method: 'POST',
      body: JSON.stringify(stacQuery)
    })
    const data = await response.json()
    return this.normalizeResults(data)
  }
  
  toStacQuery(query) {
    return {
      bbox: query.geometry.coordinates,
      datetime: `${query.temporal.start}/${query.temporal.end}`,
      collections: this.collections,
      query: {
        "eo:cloud_cover": { lte: query.filters.cloudCover.max }
      }
    }
  }
  
  normalizeResults(stacData) {
    return stacData.features.map(feature => ({
      id: feature.id,
      geometry: feature.geometry,
      properties: {
        datetime: feature.properties.datetime,
        cloudCover: feature.properties["eo:cloud_cover"],
        resolution: feature.properties["gsd"],
        sensorType: "optical"
      },
      assets: feature.assets,
      source: { connector: "stac", collection: feature.collection }
    }))
  }
}
```

---

## ✅ 验收标准

### 功能验收
1. ✅ 可以添加至少 3 种不同的 STAC 源
2. ✅ 可以在地图上绘制 AOI 并搜索
3. ✅ 可以导入 TLE 并预测过境时间
4. ✅ 可以执行 NDVI 和 SAR 处理
5. ✅ 可以查看任务队列和状态
6. ✅ 可以加载和配置插件

### 性能验收
- 地图操作流畅 (60fps)
- 搜索结果返回 < 3s
- UI 无卡顿
- 内存使用合理

### 安全验收
- 不存储敏感数据
- 插件沙箱隔离
- XSS 防护
- CORS 正确配置

---

## 📚 文档要求

1. **架构文档** (本文档)
2. **API 文档** - 所有接口说明
3. **插件开发指南** - 如何开发插件
4. **用户手册** - 如何使用 Workbench
5. **部署指南** - 如何部署到生产

---

**开始实施日期**: 2026-02-19
**目标完成日期**: 2026-04-15 (8周)
**当前状态**: 规划阶段
