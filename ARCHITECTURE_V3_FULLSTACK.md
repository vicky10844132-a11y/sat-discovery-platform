# SAT-DISCOVERY V3.0 - 五域全栈企业级架构

## 概述

从静态前端升级到完整的企业级卫星数据平台，实现五大域架构。

---

## 🎯 架构演进

### V1.0 - 静态前端 (已完成 ✅)
- 多页面静态站点
- 客户端搜索过滤
- Vercel 部署
- 无后端

### V2.0 - 客户端六域 (规划中 🚧)
- 单页应用 Workbench
- 客户端插件系统
- 前端状态管理
- 仍无后端

### V3.0 - 五域全栈 (本文档 📋)
- 完整后端架构
- 分布式处理
- 企业级能力
- 可扩展平台

---

## 🏛️ 五域架构详解

### 域 1: 数据接入域 (Data Ingestion Domain)

#### 职责
- 所有数据源接入
- 数据标准化
- 元数据索引
- 数据注册

#### 支持的数据源 (17+)

**1. STAC 系列**
- 公共 STAC Catalogs
- 私有 STAC APIs
- EarthSearch
- Planetary Computer STAC
- Radiant MLHub STAC

**2. 云服务提供商**
- AWS S3 (Sentinel-2, Landsat)
- Azure Blob Storage
- Google Cloud Storage
- Alibaba Cloud OSS

**3. 空间机构**
- NASA CMR (Common Metadata Repository)
- ESA SciHub (Copernicus Sentinel)
- Copernicus Data Space
- JAXA Satellite Data
- NOAA Data Catalog
- USGS EarthExplorer
- EUMETSAT Data Store

**4. Web 服务**
- WMS (Web Map Service)
- WMTS (Web Map Tile Service)
- OGC API - Features
- OGC API - Coverages
- OGC API - Processes

**5. 专业平台**
- Sentinel Hub
- OpenTopography
- Planet Explorer API

**6. 传统协议**
- FTP/SFTP 服务器
- HTTP/HTTPS 直接下载

#### 架构设计

```javascript
// 数据源连接器接口
interface DataConnector {
  id: string;
  name: string;
  type: 'stac' | 'wms' | 's3' | 'ogc' | 'ftp' | 'api';
  
  // 初始化连接
  async connect(config: ConnectorConfig): Promise<void>;
  
  // 搜索数据
  async search(query: SearchQuery): Promise<SearchResult[]>;
  
  // 获取元数据
  async getMetadata(itemId: string): Promise<Metadata>;
  
  // 下载数据
  async download(itemId: string, options: DownloadOptions): Promise<string>;
  
  // 获取能力
  getCapabilities(): Capabilities;
  
  // 验证配置
  validateConfig(config: ConnectorConfig): ValidationResult;
}
```

#### 数据标准化

所有数据源统一标准化为:

```json
{
  "id": "unique-id",
  "collection": "collection-name",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[...]]
  },
  "bbox": [minX, minY, maxX, maxY],
  "datetime": "2024-01-01T00:00:00Z",
  "properties": {
    "platform": "Sentinel-2A",
    "instrument": "MSI",
    "cloudCover": 10,
    "gsd": 10,
    "...": "..."
  },
  "assets": {
    "visual": { "href": "...", "type": "image/tiff" },
    "data": { "href": "...", "type": "application/x-netcdf" }
  },
  "links": [
    { "rel": "self", "href": "..." },
    { "rel": "parent", "href": "..." }
  ],
  "source": {
    "connector": "nasa-cmr",
    "originalId": "...",
    "ingestTime": "2024-01-01T00:00:00Z"
  }
}
```

#### 元数据索引

使用 PostgreSQL + PostGIS:

```sql
CREATE TABLE data_items (
  id UUID PRIMARY KEY,
  collection VARCHAR(255),
  geometry GEOMETRY(Polygon, 4326),
  bbox BOX2D,
  datetime TIMESTAMPTZ,
  properties JSONB,
  assets JSONB,
  source JSONB,
  indexed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_data_items_geometry ON data_items USING GIST(geometry);
CREATE INDEX idx_data_items_datetime ON data_items(datetime);
CREATE INDEX idx_data_items_properties ON data_items USING GIN(properties);
```

#### 插件注册机制

```javascript
// 连接器注册器
class ConnectorRegistry {
  private connectors: Map<string, DataConnector> = new Map();
  
  register(connector: DataConnector) {
    // 验证接口实现
    this.validateConnector(connector);
    
    // 注册
    this.connectors.set(connector.id, connector);
    
    // 持久化到数据库
    this.persistConnector(connector);
    
    console.log(`✓ Registered connector: ${connector.name}`);
  }
  
  getConnector(id: string): DataConnector {
    return this.connectors.get(id);
  }
  
  listConnectors(): DataConnector[] {
    return Array.from(this.connectors.values());
  }
}
```

---

### 域 2: 轨道域 (Orbital Domain)

#### 职责
- 卫星轨道传播
- 过境预测
- AOI 覆盖计算
- 可见性分析

#### 子能力

**1. TLE 管理器**
- 自动从 Celestrak/Space-Track 更新
- NORAD catalog 查询
- TLE 版本管理
- 历史 TLE 存档

**2. SGP4 引擎**
- 轨道传播计算
- 卫星位置预测
- 速度矢量计算
- 高度/方位角计算

**3. 过境预测器**
- 给定地点的过境时间
- 最大仰角计算
- 过境持续时间
- 上升/下降方向

**4. 覆盖估算器**
- AOI 覆盖百分比
- Swath 多边形计算
- 重访频率分析
- 云量历史趋势

**5. 可视化引擎**
- 地面轨迹绘制
- 实时位置显示
- 覆盖区域动画
- 3D 轨道视图

#### 数据源

支持从以下源获取 TLE:
- Celestrak (推荐)
- Space-Track (需注册)
- N2YO API
- Open Orbital Data
- Heavens Above
- EUMETSAT ephemeris

#### 架构设计

```javascript
// TLE 管理器
class TLEManager {
  async updateTLE(satelliteId: string): Promise<TLE> {
    // 从多个源获取最新 TLE
    const sources = [
      'celestrak',
      'space-track',
      'n2yo'
    ];
    
    for (const source of sources) {
      try {
        const tle = await this.fetchTLE(satelliteId, source);
        if (tle) {
          // 保存到数据库
          await this.saveTLE(tle);
          return tle;
        }
      } catch (error) {
        console.error(`Failed to fetch from ${source}:`, error);
      }
    }
    
    throw new Error('Failed to update TLE from all sources');
  }
  
  async getTLE(satelliteId: string, epoch?: Date): Promise<TLE> {
    // 获取指定时间的 TLE (历史或最新)
    if (epoch) {
      return this.getHistoricalTLE(satelliteId, epoch);
    }
    return this.getLatestTLE(satelliteId);
  }
}

// 过境预测器
class PassPredictor {
  async predictPasses(
    satelliteId: string,
    location: Location,
    startTime: Date,
    endTime: Date,
    minElevation: number = 10
  ): Promise<Pass[]> {
    const tle = await TLEManager.getTLE(satelliteId);
    const passes: Pass[] = [];
    
    // 使用 SGP4 传播
    let currentTime = startTime;
    while (currentTime < endTime) {
      const pass = this.calculatePass(tle, location, currentTime, minElevation);
      if (pass) {
        passes.push(pass);
        currentTime = pass.endTime;
      }
      currentTime = new Date(currentTime.getTime() + 60000); // +1分钟
    }
    
    return passes;
  }
  
  private calculatePass(
    tle: TLE,
    location: Location,
    startTime: Date,
    minElevation: number
  ): Pass | null {
    // SGP4 轨道传播计算
    // 计算仰角、方位角、距离
    // 返回过境信息
  }
}

// AOI 覆盖计算器
class CoverageCalculator {
  async calculateCoverage(
    satelliteId: string,
    aoi: Polygon,
    timeRange: TimeRange
  ): Promise<CoverageResult> {
    const passes = await PassPredictor.predictPasses(
      satelliteId,
      aoi.centroid,
      timeRange.start,
      timeRange.end
    );
    
    let totalCoverage = 0;
    const coveragePolygons: Polygon[] = [];
    
    for (const pass of passes) {
      // 计算 swath 多边形
      const swath = this.calculateSwath(satelliteId, pass);
      
      // 计算与 AOI 的交集
      const intersection = turf.intersect(aoi, swath);
      if (intersection) {
        totalCoverage += turf.area(intersection);
        coveragePolygons.push(intersection);
      }
    }
    
    return {
      coveragePercentage: (totalCoverage / turf.area(aoi)) * 100,
      passCount: passes.length,
      coveragePolygons
    };
  }
}
```

#### 数据库设计

```sql
CREATE TABLE satellite_catalog (
  norad_id INTEGER PRIMARY KEY,
  name VARCHAR(255),
  international_designator VARCHAR(20),
  launch_date DATE,
  platform_type VARCHAR(50),
  sensor_type VARCHAR(50),
  swath_width_km FLOAT,
  revisit_days INTEGER
);

CREATE TABLE tle_history (
  id SERIAL PRIMARY KEY,
  norad_id INTEGER REFERENCES satellite_catalog(norad_id),
  epoch TIMESTAMPTZ,
  line1 TEXT,
  line2 TEXT,
  source VARCHAR(50),
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(norad_id, epoch)
);

CREATE INDEX idx_tle_history_epoch ON tle_history(norad_id, epoch DESC);
```

---

### 域 3: 处理域 (Processing Domain)

#### 职责
- 算法执行
- 数据转换
- 分析计算

#### 算法类型

**光谱指数**
- NDVI (Normalized Difference Vegetation Index)
- NDWI (Normalized Difference Water Index)
- NDBI (Normalized Difference Built-up Index)
- EVI (Enhanced Vegetation Index)
- SAVI (Soil Adjusted Vegetation Index)

**SAR 处理**
- SAR Coherence
- Speckle Filtering
- Backscatter Analysis
- InSAR Processing
- Polarimetric Decomposition

**DEM 工具**
- Slope/Aspect
- Hillshade
- Contours
- Viewshed Analysis
- Terrain Correction

**变化检测**
- Image Differencing
- PCA (Principal Component Analysis)
- MAD (Multivariate Alteration Detection)
- Time Series Analysis

**图像处理**
- Cloud Masking
- Atmospheric Correction
- Pansharpening
- Super Resolution (AI)
- Mosaic & Tiling

**空间分析**
- AOI Clipping
- Zonal Statistics
- Buffer Analysis
- Overlay Operations

**时间序列**
- Time Series Aggregation
- Trend Analysis
- Anomaly Detection
- Seasonal Decomposition

**机器学习**
- Land Cover Classification
- Object Detection
- Segmentation
- Feature Extraction

#### 算法插件接口

```javascript
interface ProcessingAlgorithm {
  id: string;
  name: string;
  version: string;
  category: 'spectral' | 'sar' | 'dem' | 'change' | 'ml';
  
  // 输入输出定义
  inputs: InputSchema[];
  outputs: OutputSchema[];
  parameters: ParameterSchema[];
  
  // 执行算法
  async process(
    inputs: Map<string, any>,
    parameters: Map<string, any>
  ): Promise<Map<string, any>>;
  
  // 验证输入
  validateInputs(inputs: Map<string, any>): ValidationResult;
  
  // 预估资源需求
  estimateResources(inputs: Map<string, any>): ResourceEstimate;
  
  // 获取文档
  getDocumentation(): Documentation;
}
```

#### 执行环境

**选项 1: WebAssembly Sandbox (客户端)**
```javascript
// 使用 WASM 在浏览器中执行
class WasmAlgorithmRunner {
  async loadAlgorithm(algorithmId: string): Promise<WasmModule> {
    const wasmFile = await fetch(`/algorithms/${algorithmId}.wasm`);
    const wasmModule = await WebAssembly.compile(await wasmFile.arrayBuffer());
    return WebAssembly.instantiate(wasmModule);
  }
  
  async execute(
    algorithm: WasmModule,
    inputs: any,
    parameters: any
  ): Promise<any> {
    // 调用 WASM 函数
    return algorithm.exports.process(inputs, parameters);
  }
}
```

**选项 2: 后端服务 (推荐)**
```javascript
// Node.js 后端 API
app.post('/api/v1/process/:algorithmId', async (req, res) => {
  const { algorithmId } = req.params;
  const { inputs, parameters } = req.body;
  
  // 创建任务
  const task = await TaskQueue.enqueue({
    type: 'processing',
    algorithmId,
    inputs,
    parameters,
    userId: req.user.id
  });
  
  // 异步处理
  ProcessingWorker.process(task);
  
  // 返回任务 ID
  res.json({
    taskId: task.id,
    status: 'queued',
    estimatedTime: task.estimatedTime
  });
});
```

**选项 3: Serverless Function**
```javascript
// AWS Lambda / Vercel Function
export default async function handler(req, res) {
  const { algorithmId, inputs, parameters } = req.body;
  
  // 加载算法
  const algorithm = await AlgorithmRegistry.get(algorithmId);
  
  // 执行
  const result = await algorithm.process(inputs, parameters);
  
  // 保存结果到 S3
  await saveResult(result);
  
  res.json({ result });
}
```

#### 资源管理

```javascript
class ResourceManager {
  // 检查资源可用性
  async checkAvailability(estimate: ResourceEstimate): Promise<boolean> {
    const available = await this.getAvailableResources();
    return (
      available.cpu >= estimate.cpu &&
      available.memory >= estimate.memory &&
      available.storage >= estimate.storage
    );
  }
  
  // 分配资源
  async allocate(taskId: string, resources: Resources): Promise<void> {
    await this.reserveResources(taskId, resources);
  }
  
  // 释放资源
  async release(taskId: string): Promise<void> {
    await this.freeResources(taskId);
  }
}
```

---

### 域 4: 调度域 (Orchestration Domain)

#### 职责
- 任务管理
- 资源分配
- 状态控制

#### 子能力

**1. 任务队列**
- 优先级队列
- FIFO/LIFO
- 延迟执行
- 定时任务

**2. 任务调度器**
- 资源调度
- 负载均衡
- 并发控制
- 依赖管理

**3. 重试管理器**
- 失败重试
- 指数退避
- 最大重试次数
- 死信队列

**4. 日志系统**
- 结构化日志
- 日志聚合
- 实时日志流
- 日志查询

**5. 资源分配器**
- CPU 分配
- 内存管理
- 存储配额
- 网络带宽

#### 架构设计

```javascript
// 任务队列
class TaskQueue {
  private redis: Redis;
  
  async enqueue(task: Task): Promise<Task> {
    // 生成任务 ID
    task.id = uuidv4();
    task.status = 'queued';
    task.queuedAt = new Date();
    
    // 计算优先级
    const priority = this.calculatePriority(task);
    
    // 添加到 Redis 队列
    await this.redis.zadd('task_queue', priority, JSON.stringify(task));
    
    // 保存到数据库
    await this.saveTask(task);
    
    // 触发事件
    this.emit('task:queued', task);
    
    return task;
  }
  
  async dequeue(): Promise<Task | null> {
    // 从 Redis 获取最高优先级任务
    const tasks = await this.redis.zpopmax('task_queue', 1);
    if (tasks.length === 0) return null;
    
    const task = JSON.parse(tasks[0]);
    task.status = 'running';
    task.startedAt = new Date();
    
    await this.updateTask(task);
    
    return task;
  }
}

// 任务调度器
class JobScheduler {
  private workers: Worker[] = [];
  private maxWorkers: number = 10;
  
  async start(): Promise<void> {
    // 启动工作进程
    for (let i = 0; i < this.maxWorkers; i++) {
      const worker = new Worker();
      worker.on('task:completed', (task) => this.handleCompletion(task));
      worker.on('task:failed', (task, error) => this.handleFailure(task, error));
      worker.start();
      this.workers.push(worker);
    }
    
    console.log(`✓ Started ${this.maxWorkers} workers`);
  }
  
  private async handleCompletion(task: Task): Promise<void> {
    task.status = 'completed';
    task.completedAt = new Date();
    await TaskQueue.updateTask(task);
    
    // 释放资源
    await ResourceManager.release(task.id);
    
    // 执行依赖任务
    await this.executeDependents(task);
  }
  
  private async handleFailure(task: Task, error: Error): Promise<void> {
    task.attempts = (task.attempts || 0) + 1;
    
    if (task.attempts < task.maxRetries) {
      // 重试
      await RetryManager.scheduleRetry(task);
    } else {
      // 标记为失败
      task.status = 'failed';
      task.error = error.message;
      await TaskQueue.updateTask(task);
      
      // 移到死信队列
      await this.moveToDeadLetter(task);
    }
  }
}

// 重试管理器
class RetryManager {
  async scheduleRetry(task: Task): Promise<void> {
    // 计算延迟时间 (指数退避)
    const delay = Math.pow(2, task.attempts) * 1000; // 2^n 秒
    
    // 重新入队
    task.status = 'retry_scheduled';
    task.retryAt = new Date(Date.now() + delay);
    await TaskQueue.updateTask(task);
    
    // 使用 Redis 延迟队列
    await this.redis.zadd(
      'retry_queue',
      task.retryAt.getTime(),
      JSON.stringify(task)
    );
  }
}
```

#### 数据库设计

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  type VARCHAR(50),
  status VARCHAR(20),
  priority INTEGER,
  
  -- 配置
  config JSONB,
  
  -- 资源
  resources JSONB,
  
  -- 时间戳
  queued_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- 重试
  attempts INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  retry_at TIMESTAMPTZ,
  
  -- 结果
  result JSONB,
  error TEXT,
  
  -- 用户
  user_id UUID,
  
  CONSTRAINT chk_status CHECK (
    status IN ('queued', 'running', 'completed', 'failed', 'retry_scheduled', 'cancelled')
  )
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority DESC) WHERE status = 'queued';
CREATE INDEX idx_tasks_retry_at ON tasks(retry_at) WHERE status = 'retry_scheduled';

CREATE TABLE task_logs (
  id SERIAL PRIMARY KEY,
  task_id UUID REFERENCES tasks(id),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  level VARCHAR(10),
  message TEXT,
  metadata JSONB
);

CREATE INDEX idx_task_logs_task_id ON task_logs(task_id, timestamp DESC);
```

---

### 域 5: 访问域 (Access Domain)

#### 职责
- UI 界面
- API 网关
- 插件注册
- 权限控制

#### 子能力

**1. Web UI**
- 统一 Workbench
- 地图客户端
- 任务监控面板
- 数据浏览器

**2. API Gateway**
- RESTful API
- GraphQL API
- WebSocket API
- gRPC API (内部)

**3. 插件注册表**
- 插件发布
- 版本管理
- 依赖解析
- 插件市场

**4. 权限控制**
- 用户认证
- API Key 管理
- 权限层级
- RBAC (Role-Based Access Control)

**5. SDK 生成器**
- JavaScript SDK
- Python SDK
- CLI 工具
- API 文档自动生成

#### API 网关设计

```javascript
// API Gateway
class APIGateway {
  private rateLimiter: RateLimiter;
  private authenticator: Authenticator;
  private router: Router;
  
  async handleRequest(req: Request, res: Response): Promise<void> {
    try {
      // 1. 认证
      const user = await this.authenticator.authenticate(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // 2. 限流
      const allowed = await this.rateLimiter.check(user.id);
      if (!allowed) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }
      
      // 3. 权限检查
      const hasPermission = await this.checkPermission(user, req.path, req.method);
      if (!hasPermission) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      // 4. 路由到相应服务
      const result = await this.router.route(req);
      
      // 5. 记录使用统计
      await this.recordUsage(user, req);
      
      // 6. 返回结果
      res.json(result);
      
    } catch (error) {
      console.error('API Gateway error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// 限流器
class RateLimiter {
  private redis: Redis;
  
  async check(userId: string, limit: number = 100): Promise<boolean> {
    const key = `rate_limit:${userId}:${Math.floor(Date.now() / 60000)}`;
    const count = await this.redis.incr(key);
    
    if (count === 1) {
      await this.redis.expire(key, 60); // 1分钟过期
    }
    
    return count <= limit;
  }
}

// API Key 管理
class APIKeyManager {
  async createKey(userId: string, permissions: string[]): Promise<APIKey> {
    const key = this.generateKey();
    const apiKey = {
      id: uuidv4(),
      key: await this.hashKey(key),
      userId,
      permissions,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1年
      isActive: true
    };
    
    await this.saveAPIKey(apiKey);
    
    return { ...apiKey, key }; // 只返回一次明文 key
  }
  
  async validateKey(key: string): Promise<APIKey | null> {
    const hashedKey = await this.hashKey(key);
    const apiKey = await this.findByHash(hashedKey);
    
    if (!apiKey || !apiKey.isActive || apiKey.expiresAt < new Date()) {
      return null;
    }
    
    return apiKey;
  }
}
```

#### 插件注册表

```javascript
class PluginRegistry {
  async publish(plugin: Plugin): Promise<void> {
    // 1. 验证插件
    await this.validatePlugin(plugin);
    
    // 2. 检查版本冲突
    const existing = await this.findPlugin(plugin.id, plugin.version);
    if (existing) {
      throw new Error('Plugin version already exists');
    }
    
    // 3. 解析依赖
    await this.resolveDependencies(plugin);
    
    // 4. 保存到数据库
    await this.savePlugin(plugin);
    
    // 5. 上传到对象存储
    await this.uploadPluginFiles(plugin);
    
    // 6. 触发事件
    this.emit('plugin:published', plugin);
  }
  
  async install(pluginId: string, version: string, userId: string): Promise<void> {
    // 1. 获取插件
    const plugin = await this.findPlugin(pluginId, version);
    if (!plugin) {
      throw new Error('Plugin not found');
    }
    
    // 2. 检查权限
    await this.checkInstallPermission(userId, plugin);
    
    // 3. 安装依赖
    for (const dep of plugin.dependencies) {
      await this.install(dep.id, dep.version, userId);
    }
    
    // 4. 下载插件文件
    await this.downloadPluginFiles(plugin);
    
    // 5. 激活插件
    await this.activatePlugin(pluginId, userId);
  }
}
```

---

## 🔧 技术栈

### 后端

**核心服务**
- Node.js (Express / Fastify)
- Python (FastAPI) - 用于科学计算
- TypeScript - 类型安全

**数据库**
- PostgreSQL 14+ (主数据库)
- PostGIS (空间扩展)
- Redis (缓存 + 队列)
- Elasticsearch (日志 + 搜索)

**消息队列**
- Bull (Redis-based)
- RabbitMQ (可选)
- Apache Kafka (大规模)

**对象存储**
- MinIO (自托管)
- AWS S3
- Azure Blob

**轨道计算**
- satellite.js (SGP4)
- Python skyfield
- GMAT (高精度)

**处理引擎**
- GDAL (地理数据)
- Rasterio (栅格)
- NumPy / SciPy
- TensorFlow / PyTorch (ML)

### 容器化

```yaml
# docker-compose.yml
version: '3.8'

services:
  # API Gateway
  gateway:
    build: ./services/gateway
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
  
  # 数据接入服务
  data-ingestion:
    build: ./services/data-ingestion
    environment:
      - DATABASE_URL=postgresql://...
    depends_on:
      - postgres
  
  # 轨道服务
  orbital:
    build: ./services/orbital
    environment:
      - DATABASE_URL=postgresql://...
  
  # 处理服务
  processing:
    build: ./services/processing
    deploy:
      replicas: 3
    environment:
      - REDIS_URL=redis://redis:6379
  
  # 任务调度
  scheduler:
    build: ./services/scheduler
    environment:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://redis:6379
  
  # 数据库
  postgres:
    image: postgis/postgis:14-3.3
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=sat_discovery
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secret
  
  # 缓存/队列
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
  
  # 对象存储
  minio:
    image: minio/minio
    volumes:
      - minio_data:/data
    command: server /data
    ports:
      - "9000:9000"

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

### Kubernetes 部署

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: gateway
  template:
    metadata:
      labels:
        app: gateway
    spec:
      containers:
      - name: gateway
        image: sat-discovery/gateway:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: gateway
spec:
  selector:
    app: gateway
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

---

## 📊 项目目录结构

```
sat-discovery-platform/
├── frontend/                    # 前端 (V1/V2)
│   ├── public/
│   ├── src/
│   └── package.json
│
├── backend/                     # 后端服务
│   ├── services/
│   │   ├── gateway/            # API Gateway
│   │   ├── data-ingestion/     # 数据接入
│   │   ├── orbital/            # 轨道服务
│   │   ├── processing/         # 处理服务
│   │   └── scheduler/          # 任务调度
│   │
│   ├── shared/                 # 共享库
│   │   ├── database/
│   │   ├── auth/
│   │   └── utils/
│   │
│   └── docker-compose.yml
│
├── plugins/                     # 插件
│   ├── connectors/
│   │   ├── stac/
│   │   ├── wms/
│   │   └── s3/
│   │
│   ├── algorithms/
│   │   ├── ndvi/
│   │   ├── sar/
│   │   └── ml/
│   │
│   └── visualizers/
│
├── infrastructure/              # 基础设施
│   ├── k8s/
│   ├── terraform/
│   └── ansible/
│
├── docs/                        # 文档
│   ├── api/
│   ├── architecture/
│   └── guides/
│
└── tests/                       # 测试
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## 🚀 实施路线图

### Phase 1: 基础设施 (4 周)

**Week 1-2: 数据库 + 后端框架**
- [ ] PostgreSQL + PostGIS 设置
- [ ] Redis 设置
- [ ] API Gateway 骨架
- [ ] 认证/授权系统

**Week 3-4: 数据接入域**
- [ ] 连接器接口定义
- [ ] STAC Connector 实现
- [ ] NASA CMR Connector 实现
- [ ] 数据标准化引擎
- [ ] 元数据索引

### Phase 2: 轨道域 (3 周)

**Week 5-6: TLE 管理 + SGP4**
- [ ] TLE 管理器
- [ ] Celestrak 集成
- [ ] SGP4 引擎集成
- [ ] 轨道传播 API

**Week 7: 过境预测**
- [ ] Pass 预测器
- [ ] AOI 覆盖计算
- [ ] 可视化 API

### Phase 3: 处理域 (4 周)

**Week 8-9: 算法框架**
- [ ] 算法接口定义
- [ ] 算法注册器
- [ ] 执行引擎 (后端)
- [ ] 资源管理器

**Week 10-11: 核心算法**
- [ ] NDVI/NDWI 实现
- [ ] SAR 处理基础
- [ ] DEM 工具
- [ ] 时间序列分析

### Phase 4: 调度域 (3 周)

**Week 12: 任务队列**
- [ ] Task Queue 实现
- [ ] Job Scheduler
- [ ] Worker 进程

**Week 13-14: 监控 + 重试**
- [ ] 重试管理器
- [ ] 日志系统
- [ ] 监控面板

### Phase 5: 访问域 (2 周)

**Week 15: API + SDK**
- [ ] RESTful API 完善
- [ ] JavaScript SDK
- [ ] Python SDK
- [ ] CLI 工具

**Week 16: 插件系统**
- [ ] 插件注册表
- [ ] 插件市场 UI
- [ ] 插件安装器

---

## ✅ 交付标准

### 功能完整性

1. ✅ 至少 10 个数据源连接器可用
2. ✅ 轨道预测准确率 > 95%
3. ✅ 至少 5 种处理算法可执行
4. ✅ 任务队列支持 1000+ 并发
5. ✅ API 响应时间 < 200ms (p95)

### 性能指标

- 数据索引速度: > 10k items/min
- 轨道计算: < 100ms/pass
- 算法执行: 根据算法复杂度
- 任务吞吐: > 100 tasks/min

### 可靠性

- 服务可用性: > 99.9%
- 数据一致性: 强一致性
- 失败重试成功率: > 90%

### 安全性

- 所有 API 需要认证
- 敏感数据加密存储
- 审计日志完整
- GDPR 合规

---

## 💰 成本估算

### 开发成本

- 全栈工程师 x 2: 16 周
- 后端工程师 x 2: 16 周
- DevOps 工程师 x 1: 8 周
- QA 工程师 x 1: 4 周

### 运营成本 (月)

**基础版 (1000 用户)**
- 数据库: $100 (RDS)
- 缓存: $50 (ElastiCache)
- 计算: $200 (EC2/ECS)
- 存储: $100 (S3)
- **总计: ~$450/月**

**企业版 (10000 用户)**
- 数据库: $500
- 缓存: $200
- 计算: $1000
- 存储: $500
- CDN: $200
- **总计: ~$2400/月**

---

## 🎯 MVP 范围

如果需要快速验证，MVP 应包括:

### 最小可行域

**1. 数据接入域 (简化)**
- STAC Connector (2-3 个公共源)
- 基础元数据索引

**2. 轨道域 (简化)**
- TLE 更新 (Celestrak)
- 简单过境预测
- 无云量分析

**3. 处理域 (简化)**
- NDVI 算法 (仅此一个)
- 同步执行 (无队列)

**4. 调度域 (简化)**
- 简单任务表
- 无重试
- 基础日志

**5. 访问域 (简化)**
- 基础 API
- 简单认证
- 无 SDK

### MVP 时间线

- **4-6 周** 开发
- **2 周** 测试
- **总计: 6-8 周**

---

## 📝 总结

从静态站点到企业级五域平台是一个重大的架构升级,需要:

1. **后端基础设施** - Node.js + Python + PostgreSQL + Redis
2. **容器化部署** - Docker + Kubernetes
3. **分布式架构** - 微服务 + 消息队列
4. **专业工具** - GDAL + satellite.js + 科学计算库
5. **团队扩展** - 全栈/后端/DevOps 工程师

**建议**:
- 保持 V1.0 可部署 (立即上线)
- V3.0 分阶段开发 (16周完整版 或 6-8周 MVP)
- 考虑混合架构 (前端 Vercel + 后端云服务)

---

**文档版本**: V3.0 Architecture  
**创建日期**: 2026-02-19  
**状态**: 规划中
