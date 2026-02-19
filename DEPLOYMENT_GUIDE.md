# 🚀 SAT-DISCOVERY 部署指南

## 快速部署（3种方式）

### 方式1: Vercel 部署 ⚡（推荐）

#### 使用Vercel CLI
```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
cd /path/to/sat-discovery-platform
vercel --prod
```

#### 使用Vercel Web界面
1. 访问 https://vercel.com
2. 点击 "New Project"
3. 导入GitHub仓库: `vicky10844132-a11y/sat-discovery-platform`
4. 选择分支: `copilot/create-sat-discovery-foundation`
5. 点击 "Deploy"
6. 等待30-60秒
7. ✅ 完成！获得URL: `https://sat-discovery.vercel.app`

**优势**:
- 🚀 最快速度（30-60秒）
- 🌍 全球CDN
- 🔒 自动HTTPS
- 🔄 自动部署（推送代码即部署）
- 💰 完全免费

---

### 方式2: Netlify 部署 🔷

#### 拖放部署
1. 访问 https://app.netlify.com
2. 拖放项目文件夹到页面
3. 等待构建完成
4. ✅ 获得URL

#### Git部署
1. 访问 https://app.netlify.com
2. "New site from Git"
3. 选择GitHub仓库
4. 选择分支: `copilot/create-sat-discovery-foundation`
5. Build设置留空（静态站点）
6. 点击 "Deploy"

**优势**:
- 🎯 简单易用
- 🔒 免费SSL
- 📊 分析工具
- 💰 免费套餐充足

---

### 方式3: GitHub Pages 📄

#### 启用GitHub Pages
1. 访问仓库: https://github.com/vicky10844132-a11y/sat-discovery-platform
2. 点击 "Settings"
3. 左侧菜单点击 "Pages"
4. Source选择: `copilot/create-sat-discovery-foundation`
5. 文件夹选择: `/ (root)`
6. 点击 "Save"
7. 等待2-5分钟
8. ✅ 访问: `https://vicky10844132-a11y.github.io/sat-discovery-platform/`

**优势**:
- 💰 完全免费
- 🔗 GitHub原生集成
- 📦 无需额外服务

---

## 自定义域名配置

### Vercel自定义域名
1. 在Vercel项目设置中
2. 点击 "Domains"
3. 添加域名: `sat-discovery.com`
4. 添加DNS记录（Vercel提供）
   - Type: `CNAME`
   - Name: `@` 或 `www`
   - Value: `cname.vercel-dns.com`
5. 等待DNS传播（10分钟-24小时）

### Netlify自定义域名
1. 在Netlify站点设置中
2. "Domain management" → "Add custom domain"
3. 添加域名
4. 配置DNS：
   - Type: `A`
   - Name: `@`
   - Value: `75.2.60.5`
5. 等待验证

---

## 部署验证清单

### 部署前检查
- [ ] 所有HTML页面可访问
- [ ] CSS样式正确加载
- [ ] JavaScript功能正常
- [ ] 图片和资源正常显示
- [ ] 移动端响应式正常
- [ ] 所有链接有效

### 部署后验证
- [ ] 首页正常显示
- [ ] 数据源页面正常
- [ ] 算法页面正常
- [ ] 登录页面正常
- [ ] HTTPS已启用
- [ ] 全球访问速度测试

---

## 环境变量配置（如需后端）

### Vercel环境变量
1. 项目设置 → Environment Variables
2. 添加变量：
   - `DATABASE_URL`
   - `SENDGRID_API_KEY`
   - `JWT_SECRET`
   等

### Netlify环境变量
1. Site settings → Environment variables
2. 添加相同的变量

---

## 性能优化

### CDN加速
- ✅ Vercel/Netlify自动提供全球CDN
- ✅ 自动Brotli/Gzip压缩
- ✅ 图片自动优化

### 缓存配置
已在 `vercel.json` 中配置：
- HTML: 无缓存（保持更新）
- CSS/JS: 长期缓存
- 图片: 长期缓存

---

## 监控与分析

### Vercel Analytics
- 自动收集访问数据
- 性能指标
- 访客地理分布

### Google Analytics（可选）
在 `index.html` 添加：
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 故障排查

### 部署失败
1. 检查 `vercel.json` 配置
2. 查看构建日志
3. 确认文件路径正确
4. 检查分支名称

### 页面404
1. 确认文件名大小写
2. 检查路由配置
3. 清除浏览器缓存

### 样式不显示
1. 检查CSS文件路径
2. 确认MIME类型正确
3. 检查CDN缓存

---

## 回滚部署

### Vercel回滚
1. 访问项目部署页面
2. 选择之前的部署
3. 点击 "Promote to Production"

### Netlify回滚
1. Deploys页面
2. 选择之前的部署
3. 点击 "Publish deploy"

---

## 成本估算

### 免费方案（推荐）
- Vercel: 100GB带宽/月
- Netlify: 100GB带宽/月
- GitHub Pages: 100GB/月

**预期**: $0/月（完全免费）

### 如需升级（流量增长）
- Vercel Pro: $20/月（1TB带宽）
- Netlify Pro: $19/月（400GB带宽）

---

## 支持

### 问题反馈
- GitHub Issues
- 邮件支持

### 文档
- README.md
- QUICKSTART.md
- 本部署指南

---

## 快速命令参考

```bash
# Vercel部署
vercel --prod

# 查看部署状态
vercel ls

# 查看日志
vercel logs

# 本地预览
python -m http.server 8000
# 或
npx serve .

# 访问: http://localhost:8000
```

---

**部署时间**: 30秒 - 5分钟  
**预期成本**: $0  
**全球访问**: ✅ CDN加速  
**HTTPS**: ✅ 自动配置

🎉 **准备就绪，可立即部署！**
