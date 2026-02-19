# SAT-DISCOVERY 网站快速部署指南

## 🚀 快速上线（3种方式）

您的网站已经准备就绪，可以立即部署！选择以下任一方式：

---

## 方式 1: Vercel 部署（推荐 - 最快）

### ⏱️ 预计时间：60秒

### 步骤：

#### A. 使用 Web 界面（最简单）

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择 GitHub 仓库：`vicky10844132-a11y/sat-discovery-platform`
   - 分支选择：`copilot/create-sat-discovery-foundation`

3. **配置设置**（使用默认值即可）
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: （留空）
   - Output Directory: ./
   - Install Command: （留空）

4. **点击 Deploy**
   - 等待 30-60 秒
   - 部署完成！

5. **获取网址**
   - Vercel 会提供一个 URL，例如：
   - `https://sat-discovery-platform.vercel.app`

#### B. 使用命令行

```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目目录中运行
cd /home/runner/work/sat-discovery-platform/sat-discovery-platform
vercel --prod

# 按照提示操作，网站即可上线
```

---

## 方式 2: Netlify 部署

### ⏱️ 预计时间：2-3分钟

### 步骤：

#### A. 拖放部署（最简单）

1. **访问 Netlify**
   - 打开 https://app.netlify.com
   - 登录或注册账号

2. **拖放部署**
   - 将整个项目文件夹拖到 Netlify 的拖放区域
   - 或者点击 "Add new site" → "Import an existing project"

3. **选择 GitHub**
   - 连接 GitHub 账号
   - 选择仓库：`vicky10844132-a11y/sat-discovery-platform`
   - 分支：`copilot/create-sat-discovery-foundation`

4. **构建设置**
   - Build command: （留空）
   - Publish directory: ./
   - 点击 "Deploy site"

5. **获取网址**
   - Netlify 提供 URL，例如：
   - `https://sat-discovery-platform.netlify.app`

#### B. 使用命令行

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 在项目目录中运行
cd /home/runner/work/sat-discovery-platform/sat-discovery-platform
netlify deploy --prod

# 按照提示操作
```

---

## 方式 3: GitHub Pages 部署

### ⏱️ 预计时间：5分钟

### 步骤：

1. **访问仓库设置**
   - 打开 https://github.com/vicky10844132-a11y/sat-discovery-platform
   - 点击 "Settings"

2. **启用 GitHub Pages**
   - 左侧菜单点击 "Pages"
   - Source: 选择分支 `copilot/create-sat-discovery-foundation`
   - Folder: / (root)
   - 点击 "Save"

3. **等待部署**
   - GitHub 会自动构建和部署
   - 通常需要 2-5 分钟

4. **获取网址**
   - 页面顶部会显示 URL：
   - `https://vicky10844132-a11y.github.io/sat-discovery-platform/`

---

## 📋 部署前检查清单

✅ 所有测试通过（10/10）
✅ vercel.json 配置文件已准备
✅ 无需构建步骤
✅ 无需安装依赖
✅ 所有 HTML/CSS/JS 文件就绪
✅ 所有 JSON 数据文件就绪

---

## 🎯 部署后验证

部署完成后，访问您的网站并检查：

1. **主页面加载**
   - 访问 `/index.html`
   - 应该看到欢迎页面

2. **主控制台**
   - 访问 `/app.html`
   - 应该看到卫星搜索界面

3. **功能测试**
   - 在搜索框输入 "Sentinel"
   - 应该显示 Sentinel 卫星
   - 点击任意卫星卡片
   - 应该跳转到详情页

4. **其他页面**
   - `/sources.html` - 数据源
   - `/orbit.html` - 轨道规划
   - `/delivery.html` - 数据交付

---

## 🔧 常见问题

### Q: 部署失败了怎么办？
A: 检查以下内容：
- 确保分支是 `copilot/create-sat-discovery-foundation`
- 确保没有构建命令
- 确保根目录设置正确

### Q: 页面显示 404 错误？
A: 确保访问正确的文件：
- 主页：`/` 或 `/index.html`
- 应用：`/app.html`

### Q: CSS 样式没有加载？
A: 检查浏览器控制台，确保：
- CSS 文件路径正确
- 没有 CORS 错误

### Q: JavaScript 不工作？
A: 检查浏览器控制台：
- 确保所有 JS 文件加载
- 检查是否有错误信息

---

## 📞 技术支持

如遇问题，请检查：
1. 浏览器开发者控制台（F12）
2. 网络选项卡（检查文件是否加载）
3. Console 选项卡（检查 JavaScript 错误）

---

## 🎉 恭喜！

选择上述任一方式，您的 SAT-DISCOVERY 网站将在几分钟内上线！

**推荐使用 Vercel**，因为：
- ✅ 最快（60秒内完成）
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 免费额度充足
- ✅ 持续部署（GitHub 推送自动更新）

---

**祝部署顺利！** 🚀
