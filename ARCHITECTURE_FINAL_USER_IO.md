# SAT-DISCOVERY 最终架构 - 用户自主I/O算法平台

## 🎯 核心理念

**定位**: 算法集成平台 - 用户完全控制输入输出，平台只负责算法执行

### 设计哲学

> "每个用户的情况都不同，根据自己的情况导入或调用自己的数据，然后输出。平台不需要存储数据，用户选择输入路径和输出路径，就像桌面软件一样。"

### 核心原则

1. **用户自主** - 用户控制所有数据
2. **零存储** - 平台不存储任何用户数据
3. **格式兼容** - 支持所有输入输出格式
4. **算法集成** - 集成全球各方向算法
5. **实用主义** - 不纠结像素级精度，够用就好

## 🔄 工作模式

### 类似桌面软件的工作流程

```
┌─────────────────────────────────────────────────────────────┐
│                    1. 用户选择输入                           │
│                                                               │
│  选择类型:                                                    │
│  ○ 本地文件    (/path/to/input.tif)                         │
│  ○ HTTP URL    (https://example.com/data.tif)               │
│  ○ S3 路径     (s3://bucket/data.tif)                       │
│  ○ STAC Item   (STAC JSON)                                  │
│  ○ Azure Blob  (azure://...)                                │
│  ○ Google GCS  (gs://...)                                   │
│  ○ FTP/SFTP    (ftp://server/data.tif)                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    2. 选择算法和参数                         │
│                                                               │
│  算法: NDVI                                                  │
│  参数:                                                        │
│    - NIR 波段: 5                                            │
│    - Red 波段: 4                                            │
│    - 输出格式: GeoTIFF                                       │
│    - 压缩: LZW                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    3. 用户选择输出                           │
│                                                               │
│  选择类型:                                                    │
│  ○ 本地文件    (/path/to/output.tif)                        │
│  ○ S3 路径     (s3://my-bucket/results/)                    │
│  ○ Azure Blob  (azure://my-storage/)                        │
│  ○ Google GCS  (gs://my-bucket/)                            │
│  ○ FTP上传     (ftp://my-server/)                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    4. 执行算法                               │
│                                                               │
│  平台读取输入 → 执行算法 → 直接写入输出位置                  │
│                                                               │
│  ⚠️ 平台不保存中间结果                                       │
│  ⚠️ 平台不缓存任何数据                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
                         完成！
```

## 🏗️ 技术架构

### 三种执行模式

#### 模式1: 浏览器模式（推荐 - 小文件）

**适用场景**: < 100MB文件，简单算法

**技术栈**:
- WebAssembly + GDAL.js
- JavaScript + rasterio.js
- 完全在浏览器执行
- 无需后端服务器

**优点**:
- ✅ 完全客户端，零服务器成本
- ✅ 用户数据不离开本地
- ✅ 快速启动
- ✅ 跨平台

**限制**:
- ⚠️ 文件大小受浏览器内存限制
- ⚠️ 算法复杂度受限

#### 模式2: 本地CLI模式（推荐 - 大文件）

**适用场景**: 任意大小文件，所有算法

**技术栈**:
- Python CLI工具
- GDAL + Rasterio + NumPy
- 本地执行

**安装**:
```bash
# 安装平台CLI
pip install sat-discovery-cli

# 或使用Docker
docker pull sat-discovery/processor
```

**使用**:
```bash
# NDVI计算
sat-discovery ndvi \
  --input s3://sentinel-data/scene.tif \
  --output /local/path/ndvi.tif \
  --nir-band 5 \
  --red-band 4

# SAR滤波
sat-discovery sar-filter \
  --input https://example.com/sar.tif \
  --output gs://my-bucket/filtered.tif \
  --method lee \
  --window-size 7

# DEM坡度
sat-discovery slope \
  --input /local/dem.tif \
  --output s3://results/slope.tif \
  --unit degrees
```

**优点**:
- ✅ 处理任意大小文件
- ✅ 所有算法可用
- ✅ 用户完全控制
- ✅ 可集成到脚本

**限制**:
- ⚠️ 需要安装依赖

#### 模式3: 服务器模式（可选）

**适用场景**: 团队共享，批量处理

**架构**:
```
用户机器 → API请求 → 用户的服务器 → 
读取用户的输入 → 执行 → 写入用户的输出
```

**特点**:
- 服务器由用户自己部署
- 可使用Docker一键部署
- 支持GPU加速
- 支持分布式处理

## 📁 输入输出支持

### 输入协议支持

| 协议 | 格式 | 示例 | 说明 |
|------|------|------|------|
| 本地文件 | file:// | `/path/to/file.tif` | 本地文件系统 |
| HTTP/HTTPS | http(s):// | `https://example.com/data.tif` | 网络文件 |
| AWS S3 | s3:// | `s3://bucket/path/file.tif` | 需要AWS凭证 |
| Azure Blob | azure:// | `azure://container/file.tif` | 需要Azure凭证 |
| Google GCS | gs:// | `gs://bucket/file.tif` | 需要GCP凭证 |
| FTP/SFTP | ftp(s):// | `ftp://server/file.tif` | FTP服务器 |
| STAC | stac:// | `stac://api/item/asset` | STAC标准 |

### 输出位置支持

同输入协议，支持所有协议的写入（如果协议支持）

### 格式支持

**栅格格式**:
- GeoTIFF (.tif, .tiff)
- COG (Cloud-Optimized GeoTIFF)
- HDF (.hdf, .h5)
- NetCDF (.nc)
- JPEG2000 (.jp2)
- PNG (.png)
- ENVI (.dat + .hdr)

**矢量格式**:
- GeoJSON (.geojson)
- Shapefile (.shp)
- GeoPackage (.gpkg)
- KML (.kml)

**元数据格式**:
- JSON
- XML
- CSV

## 🔧 算法执行框架

### 算法标准接口

```python
class Algorithm:
    def __init__(self, name, version):
        self.name = name
        self.version = version
    
    def validate_inputs(self, inputs, params):
        """验证输入和参数"""
        pass
    
    def execute(self, inputs, params, output):
        """执行算法
        
        Args:
            inputs: dict of input paths
            params: algorithm parameters
            output: output path
            
        Returns:
            status, message
        """
        pass
    
    def get_metadata(self):
        """返回算法元数据"""
        return {
            'name': self.name,
            'version': self.version,
            'inputs': [...],
            'parameters': [...],
            'outputs': [...]
        }
```

### 示例：NDVI算法实现

```python
class NDVIAlgorithm(Algorithm):
    def __init__(self):
        super().__init__('NDVI', '1.0.0')
    
    def execute(self, inputs, params, output):
        # 1. 读取输入（支持任意协议）
        with rasterio.open(inputs['multispectral']) as src:
            nir = src.read(params['nir_band'])
            red = src.read(params['red_band'])
            profile = src.profile
        
        # 2. 执行算法
        ndvi = (nir - red) / (nir + red + 1e-8)
        
        # 3. 写入输出（支持任意协议）
        profile.update(dtype=rasterio.float32, count=1)
        with rasterio.open(output, 'w', **profile) as dst:
            dst.write(ndvi, 1)
        
        return True, 'NDVI计算成功'
```

### 配置文件驱动

用户可以创建配置文件批量处理：

```yaml
# process_config.yaml
tasks:
  - name: "处理Sentinel-2数据"
    algorithm: "ndvi"
    inputs:
      multispectral: "s3://sentinel-data/L2A_T50RKU_20240101.tif"
    parameters:
      nir_band: 5
      red_band: 4
    output: "/local/results/ndvi_20240101.tif"
  
  - name: "计算NDWI"
    algorithm: "ndwi"
    inputs:
      multispectral: "s3://sentinel-data/L2A_T50RKU_20240101.tif"
    parameters:
      green_band: 3
      nir_band: 5
    output: "/local/results/ndwi_20240101.tif"
```

运行：
```bash
sat-discovery batch process_config.yaml
```

## 💡 关键优势

### 1. 用户完全控制

**数据主权**:
- ✅ 用户决定数据存储位置
- ✅ 用户控制数据访问权限
- ✅ 平台不接触用户数据
- ✅ 符合数据安全法规

### 2. 格式兼容性

**支持所有格式**:
- 不需要转换格式
- 不需要上传到特定平台
- 直接处理原始数据
- 输出用户需要的格式

### 3. 算法集成

**一个平台，所有算法**:
- 不需要安装多个软件
- 不需要学习多个工具
- 统一的接口和参数
- 可扩展的插件系统

### 4. 实用主义

**像NASA DEM一样实用**:
- 90m DEM够用就好
- 30m DEM更精确
- 不纠结1像素误差
- 关注实际应用价值

### 5. 灵活部署

**适应不同场景**:
- 个人：浏览器模式
- 研究：本地CLI模式
- 团队：自部署服务器
- 企业：私有云部署

## 🌍 实际应用场景

### 场景1: 学生研究项目

```
学生从 USGS 下载 Landsat 数据到本地
↓
使用浏览器打开平台
↓
选择本地文件作为输入
↓
选择NDVI算法
↓
输出保存到本地论文文件夹
↓
完成，数据从未离开学生电脑
```

### 场景2: 企业批量处理

```bash
# 企业将数据存储在自己的S3
# 使用CLI工具批量处理
for file in $(aws s3 ls s3://company-data/*.tif); do
  sat-discovery ndvi \
    --input "s3://company-data/$file" \
    --output "s3://company-results/ndvi_$file" \
    --nir-band 5 \
    --red-band 4
done

# 结果直接写入公司S3，平台从未接触数据
```

### 场景3: 科研团队协作

```
团队部署自己的服务器（Docker）
↓
科研人员通过Web界面提交任务
↓
输入：团队NAS上的数据
输出：团队共享存储
↓
服务器执行算法
↓
结果保存到团队存储，外部无法访问
```

### 场景4: 政府部门合规

```
政府数据不能离开内网
↓
在内网部署平台（私有云）
↓
输入：内网存储的遥感数据
输出：内网结果目录
↓
所有处理在内网完成
↓
满足数据安全合规要求
```

## 🚀 实施路线图

### Phase 1: 浏览器模式 (2周)

**目标**: 实现基础算法的浏览器端执行

**任务**:
- [ ] WebAssembly GDAL集成
- [ ] 实现5个核心算法（NDVI, NDWI, Slope等）
- [ ] 本地文件输入输出
- [ ] 基础UI界面

**可交付**:
- 可在浏览器中处理小文件
- 数据不离开用户电脑

### Phase 2: CLI工具 (2周)

**目标**: 开发命令行工具

**任务**:
- [ ] Python CLI框架
- [ ] 所有35+算法实现
- [ ] 支持所有输入输出协议
- [ ] 批量处理支持

**可交付**:
- pip安装的CLI工具
- 完整的算法库

### Phase 3: Docker部署 (1周)

**目标**: 支持自部署服务器

**任务**:
- [ ] Docker镜像
- [ ] Docker Compose配置
- [ ] API服务器
- [ ] Web管理界面

**可交付**:
- 一键部署的Docker方案
- 适合团队使用

### Phase 4: 插件系统 (2周)

**目标**: 允许用户添加自定义算法

**任务**:
- [ ] 插件API设计
- [ ] 插件管理界面
- [ ] 插件市场
- [ ] 示例插件

**可交付**:
- 可扩展的插件系统
- 社区贡献机制

## 📊 成本分析

### 用户使用成本

**浏览器模式**: $0
- 完全客户端
- 无服务器成本
- 无存储成本

**CLI模式**: $0
- 本地执行
- 使用用户自己的计算资源
- 使用用户自己的存储

**自部署服务器**: 用户自己的服务器成本
- 用户控制成本
- 按需扩展
- 可使用现有基础设施

### 平台运营成本

**前端托管**: $0
- 静态网站托管（Vercel/Netlify）
- 开源代码托管（GitHub）

**文档和社区**: $0
- GitHub Pages
- GitHub Discussions

**总成本**: $0
- 完全开源
- 社区驱动

## 🎯 总结

### 核心价值主张

1. **用户自主** - 完全控制输入输出
2. **零存储** - 平台不存任何数据
3. **格式兼容** - 支持所有格式协议
4. **算法丰富** - 集成全球算法
5. **灵活部署** - 浏览器/CLI/服务器
6. **实用主义** - 够用就好，不纠结精度
7. **完全免费** - 零成本使用

### 对比其他平台

| 特性 | SAT-DISCOVERY | Google Earth Engine | QGIS | SNAP |
|------|---------------|---------------------|------|------|
| 数据位置 | 用户自主 | 平台存储 | 用户自主 | 用户自主 |
| 输入格式 | 所有格式 | 限定格式 | 大部分格式 | 特定格式 |
| 输出位置 | 用户自主 | 下载/Drive | 本地 | 本地 |
| 算法数量 | 35+ (扩展中) | 500+ | 1000+ | 100+ |
| 部署方式 | 浏览器/CLI/自部署 | 云端 | 桌面 | 桌面 |
| 成本 | $0 | 免费（研究） | $0 | $0 |
| 学习曲线 | 低 | 中 | 高 | 高 |

### 适用人群

✅ **学生和研究人员** - 简单易用
✅ **小型企业** - 零成本
✅ **大型企业** - 可自部署
✅ **政府部门** - 满足合规
✅ **开发者** - 可扩展
✅ **任何人** - 免费开源

---

**SAT-DISCOVERY** - 用户自主I/O算法平台  
**原则**: 用户控制数据，平台提供算法  
**目标**: 成为最灵活的遥感处理平台
