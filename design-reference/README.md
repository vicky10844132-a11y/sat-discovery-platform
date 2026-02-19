# 网站风格设计指南

## 如何提供设计图片

### 方式1: 上传到 GitHub 仓库（推荐）✅

**步骤**:
1. 在本仓库创建 `design-reference` 文件夹
2. 上传您的设计图片到该文件夹
3. 我可以直接查看并实现设计

**支持的格式**:
- PNG（推荐，支持透明背景）
- JPG/JPEG
- SVG（矢量图标）
- GIF
- WebP

**命名建议**:
```
design-reference/
├── 01-homepage.png          # 首页设计
├── 02-color-palette.png     # 配色方案
├── 03-typography.png        # 字体规范
├── 04-components.png        # UI组件
├── 05-data-sources.png      # 数据源页面
├── 06-algorithms.png        # 算法页面
├── 07-login.png             # 登录页面
└── 08-history.png           # 历史记录页面
```

---

### 方式2: 提供在线链接 🔗

如果设计图在以下平台：

**设计工具**:
- Figma: 分享链接（可查看模式）
- Sketch Cloud: 公开分享链接
- Adobe XD: 共享链接
- InVision: 项目链接

**图片平台**:
- Dribbble: 设计链接
- Behance: 项目链接
- Pinterest: Pin链接
- 云盘分享: 百度网盘、Google Drive等

**示例**:
```
https://www.figma.com/file/xxxxx
https://dribbble.com/shots/xxxxx
https://i.imgur.com/xxxxx.png
```

---

### 方式3: 文字描述设计需求 📝

如果没有具体图片，可以描述：

#### 颜色偏好
```
我想要：
- 主色调: 科技蓝 / 深空灰 / 森林绿等
- 强调色: 亮黄 / 橙色 / 青色等
- 整体氛围: 专业 / 活泼 / 简约 / 高级等
```

#### 参考网站
```
我喜欢以下网站的风格：
- Google Earth Engine (https://earthengine.google.com)
- Sentinel Hub (https://www.sentinel-hub.com)
- Planet Explorer (https://www.planet.com)
- 其他网站...
```

#### 布局偏好
```
我想要：
- 导航栏: 顶部固定 / 侧边栏 / 隐藏式
- 卡片样式: 扁平 / 带阴影 / 立体
- 间距: 紧凑 / 舒适 / 宽松
- 动画: 无 / 简单 / 丰富
```

---

## 可调整的设计元素

### 1. 配色方案 🎨

**当前配色**:
```css
/* 主背景 */
--bg-primary: #020b16;      /* 深蓝黑 */
--bg-secondary: #0a1628;    /* 深蓝灰 */

/* 强调色 */
--accent: #ffd700;          /* 金黄色 */
--accent-hover: #ffed4e;    /* 亮黄色 */

/* 文字 */
--text-primary: #c9d1d9;    /* 浅灰白 */
--text-secondary: #8b949e;  /* 中灰色 */

/* 边框 */
--border: #1a2942;          /* 深蓝灰 */
--border-light: #30363d;    /* 浅蓝灰 */
```

**可改为**:
- 科技蓝系: `#0066ff`, `#00ccff`
- 太空黑系: `#000000`, `#1a1a1a`
- 自然绿系: `#00aa55`, `#88cc00`
- 或任何您喜欢的配色

---

### 2. 布局风格 📐

#### 当前布局
- 页面最大宽度: 1200px
- 标准间距: 20px
- 卡片间距: 20px
- 圆角: 6-12px
- 边框: 1px solid

#### 可调整为
- 全宽布局
- 更窄的内容区
- 更大/更小的间距
- 更圆/更方的圆角
- 更粗/更细的边框

---

### 3. 组件样式 🧩

#### 按钮
**当前**: 金黄色填充，圆角6px
```css
background: #ffd700;
color: #020b16;
border-radius: 6px;
padding: 12px 24px;
```

**可改为**: 
- 边框样式（outline）
- 渐变背景
- 扁平风格
- 阴影效果

#### 卡片
**当前**: 暗色背景，细边框
```css
background: #0a1628;
border: 1px solid #1a2942;
border-radius: 8px;
```

**可改为**:
- 卡片阴影（box-shadow）
- 悬停效果
- 渐变边框
- 玻璃态效果（glassmorphism）

#### 表单输入
**当前**: 暗色背景，细边框
```css
background: #0d1117;
border: 1px solid #30363d;
border-radius: 6px;
```

**可改为**:
- 下划线式
- 浮动标签
- 图标装饰

---

### 4. 字体排版 ✍️

#### 当前字体
```css
font-family: -apple-system, BlinkMacSystemFont, 
             "Segoe UI", Roboto, sans-serif;
```

#### 可使用
- Google Fonts:
  - Inter (现代、清晰)
  - Poppins (友好、圆润)
  - Roboto (中性、专业)
  - Montserrat (几何、简约)
- 中文字体:
  - 思源黑体
  - 阿里巴巴普惠体
  - 苹方

#### 字体大小
**当前**:
- 标题 h1: 28-32px
- 标题 h2: 24px
- 正文: 14-16px
- 小字: 12-13px

**可调整为**:
- 更大（提升可读性）
- 更小（紧凑布局）
- 不同的层级比例

---

### 5. 动画效果 ✨

#### 当前动画
```css
transition: all 0.2s ease;
```

#### 可添加
- 页面切换动画
- 卡片悬停效果
- 按钮点击反馈
- 加载动画
- 滚动视差效果

---

### 6. 图标风格 📌

#### 当前使用
- Unicode Emoji: 🛰️ 📊 🔧
- 简单文本图标

#### 可替换为
- Font Awesome
- Material Icons
- Feather Icons
- Custom SVG icons
- Lucide Icons

---

## 设计示例参考

### 风格A: 专业科技风
```
颜色: 深蓝 + 电光蓝
布局: 简洁规整
组件: 扁平无阴影
字体: Inter / Roboto
动画: 微妙过渡
```

### 风格B: 现代轻量风
```
颜色: 浅灰 + 鲜艳强调色
布局: 白色大量留白
组件: 卡片阴影
字体: Poppins
动画: 流畅动效
```

### 风格C: 暗黑炫酷风
```
颜色: 纯黑 + 霓虹色
布局: 对比强烈
组件: 发光效果
字体: 等宽字体
动画: 赛博朋克风
```

### 风格D: 温暖自然风
```
颜色: 米色 + 自然绿
布局: 圆润柔和
组件: 柔和阴影
字体: 圆体字
动画: 弹性动效
```

---

## 提交设计的方式

### GitHub 仓库提交
1. Fork 或直接编辑仓库
2. 上传图片到 `design-reference/` 文件夹
3. 在 Issue 或 PR 中说明设计要求

### 直接告诉我
在对话中：
1. 上传图片（如支持）
2. 提供链接
3. 文字描述

---

## 实施流程

1. **您提供** 设计图片/要求
2. **我分析** 设计元素和风格
3. **我实现** CSS 样式调整
4. **您预览** 效果并反馈
5. **我优化** 直到满意

---

## 设计清单

提供设计时，最好包含：
- [ ] 首页设计
- [ ] 配色方案（主色、强调色、背景色）
- [ ] 字体规范（字体、大小、行高）
- [ ] 组件样式（按钮、卡片、表单）
- [ ] 布局规范（间距、圆角、边框）
- [ ] 图标风格
- [ ] 响应式设计（移动端）
- [ ] 动画效果（可选）

---

**准备好了吗？** 📸

请上传您的设计图片，或告诉我您的设计需求！我会立即开始调整网站风格。
