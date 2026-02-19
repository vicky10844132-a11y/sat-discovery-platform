# Vercel 部署配置指南

## 🚨 重要：检查生产分支设置

### 问题症状

如果网站显示 "Safe Content This content is safe from XSS attacks"，可能是因为 Vercel 部署到了错误的分支。

---

## ✅ 正确配置步骤

### 1. 访问 Vercel Dashboard

访问: https://vercel.com/dashboard

### 2. 进入项目设置

1. 点击项目 `sat-discovery-platform`
2. 点击 **Settings** (设置)
3. 点击左侧的 **Git**

### 3. 检查生产分支（Production Branch）

**当前应该设置为**:
```
Production Branch: copilot/create-sat-discovery-foundation
```

**如果不是这个分支**:

1. 找到 "Production Branch" 设置
2. 点击 "Edit" (编辑)
3. 输入: `copilot/create-sat-discovery-foundation`
4. 点击 "Save" (保存)

### 4. 触发重新部署

**方法1: 在 Deployments 页面**
1. 点击 **Deployments**
2. 找到最新的 commit (31c3a4d)
3. 点击右侧的 "..." 菜单
4. 选择 **Redeploy**
5. 确认 "Redeploy"

**方法2: 在 Git 页面**
1. 回到 **Git** 页面
2. 点击 "Deploy" 按钮
3. 选择分支 `copilot/create-sat-discovery-foundation`
4. 点击 "Deploy"

---

## 🔍 验证部署

### 步骤1: 等待部署完成

在 Vercel Dashboard → Deployments 页面，等待状态变为 "Ready" (绿色勾号)。

通常需要 30-60 秒。

### 步骤2: 访问验证文件

在浏览器中访问:
```
https://www.sat-index.online/DEPLOYMENT_VERSION.txt
```

**应该看到**:
```
分支 (Branch): copilot/create-sat-discovery-foundation
版本 (Version): 2026-02-19-v2
```

**如果看到 404 或其他内容**: 部署可能仍然指向错误的分支。

### 步骤3: 访问网站

访问: https://www.sat-index.online/

**应该看到**:
- 深色背景
- 星空动画
- "SAT-DISCOVERY Platform" 或 "SAT-INDEX" 标题
- 导航栏
- 功能卡片

**不应该看到**:
- "Safe Content This content is safe from XSS attacks"

---

## 🔧 如果问题仍然存在

### 选项1: 清除缓存

**浏览器缓存**:
- Chrome/Edge: `Ctrl + Shift + R` (Windows) 或 `Cmd + Shift + R` (Mac)
- Firefox: `Ctrl + F5` (Windows) 或 `Cmd + Shift + R` (Mac)
- Safari: `Cmd + Option + R`

**或使用隐私/无痕模式**:
- Chrome/Edge: `Ctrl + Shift + N`
- Firefox: `Ctrl + Shift + P`
- Safari: `Cmd + Shift + N`

### 选项2: 清除 Cloudflare 缓存

1. 访问 Cloudflare Dashboard: https://dash.cloudflare.com
2. 选择域名 `sat-index.online`
3. 点击左侧 **Caching**
4. 点击 **Configuration**
5. 点击 **Purge Everything**
6. 确认清除

等待 1-2 分钟后重新访问网站。

### 选项3: 检查域名设置

确认 Cloudflare DNS 中的 CNAME 记录指向正确的 Vercel 部署：

```
类型: CNAME
名称: www
内容: 2882f84c7fcdcf31.vercel-dns-017.com
代理状态: DNS only (灰色云朵)
```

---

## 📊 部署流程图

```
Git Push
    ↓
GitHub 接收代码
    ↓
Vercel 检测到更新
    ↓
检查 Production Branch 设置
    ↓
    ├─ 如果是 copilot/create-sat-discovery-foundation ✅
    │       ↓
    │   自动部署新代码
    │       ↓
    │   网站更新
    │
    └─ 如果是 main 或其他分支 ❌
            ↓
        部署旧代码
            ↓
        网站显示 "Safe Content" 错误
```

---

## 🎯 快速检查清单

- [ ] Vercel Production Branch = `copilot/create-sat-discovery-foundation`
- [ ] 手动触发重新部署
- [ ] 等待部署完成（30-60秒）
- [ ] 访问 `/DEPLOYMENT_VERSION.txt` 验证
- [ ] 清除浏览器缓存
- [ ] 访问网站验证内容正常

---

## 📞 需要帮助？

如果完成以上所有步骤后问题仍然存在，请提供：

1. Vercel Dashboard 中 Production Branch 设置的截图
2. 访问 `/DEPLOYMENT_VERSION.txt` 的结果（截图或文本）
3. 浏览器控制台的错误信息（F12 → Console）
4. 网络请求信息（F12 → Network → 刷新页面）

---

**最后更新**: 2026-02-19
**当前正确分支**: copilot/create-sat-discovery-foundation
