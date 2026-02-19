# DNS 配置指南

## 当前配置 ✅

### 域名信息
- **域名**: sat-index.online
- **DNS 提供商**: Cloudflare
- **部署平台**: Vercel

---

## 📋 Cloudflare DNS 配置

### Nameservers
Cloudflare 分配的权威域名服务器：
```
jamie.ns.cloudflare.com
koa.ns.cloudflare.com
```

**状态**: ✅ 已激活

### DNS 记录

| 类型 | 名称 | 内容 | 代理状态 | TTL | 说明 |
|------|------|------|----------|-----|------|
| **A** | sat-index.online | 216.198.79.1 | 🔘 DNS only | Auto | 根域名指向 Vercel |
| **CNAME** | www | 2882f84c7fcdcf31.vercel-dns-017.com | 🔘 DNS only | Auto | www 子域名指向 Vercel |

---

## 🔍 配置详解

### A 记录配置

**记录类型**: A (Address)
```
名称: sat-index.online (或 @)
类型: A
内容: 216.198.79.1
代理状态: DNS only (灰色云朵)
TTL: Auto
```

**用途**:
- 将根域名指向 Vercel 服务器
- 允许直接访问 `sat-index.online`

**为什么是 DNS only**:
- Vercel 需要直接管理 SSL 证书
- Cloudflare 代理会干扰 Vercel 的证书验证
- 保持灰色云朵（不通过 Cloudflare 代理）

---

### CNAME 记录配置

**记录类型**: CNAME (Canonical Name)
```
名称: www
类型: CNAME
内容: 2882f84c7fcdcf31.vercel-dns-017.com
代理状态: DNS only (灰色云朵)
TTL: Auto
```

**用途**:
- 将 www 子域名指向 Vercel DNS
- 允许访问 `www.sat-index.online`

**Vercel DNS 值**:
- `2882f84c7fcdcf31.vercel-dns-017.com` 是 Vercel 分配的唯一 DNS 端点
- 自动管理路由和负载均衡
- 不要修改此值

---

## ✅ 验证配置

### 方法1: 使用 dig 命令

**检查 A 记录**:
```bash
dig sat-index.online +short
```
**预期输出**: `216.198.79.1`

**检查 CNAME 记录**:
```bash
dig www.sat-index.online +short
```
**预期输出**: 
```
2882f84c7fcdcf31.vercel-dns-017.com.
216.198.79.1
```

### 方法2: 使用 nslookup

**检查根域名**:
```bash
nslookup sat-index.online
```

**检查 www 域名**:
```bash
nslookup www.sat-index.online
```

### 方法3: 在线工具

**DNS Checker**:
- 访问: https://dnschecker.org/
- 输入: `www.sat-index.online`
- 查看全球 DNS 传播状态

**MXToolBox**:
- 访问: https://mxtoolbox.com/SuperTool.aspx
- 测试 DNS 记录

### 方法4: 浏览器测试

**测试根域名**:
```
https://sat-index.online/
```
✅ 应该正常访问

**测试 www 域名**:
```
https://www.sat-index.online/
```
✅ 应该正常访问

---

## 🔄 域名重定向配置（推荐）

### 为什么需要重定向？

**SEO 优势**:
- 统一 URL 结构
- 避免重复内容
- 集中页面权重

**用户体验**:
- 统一访问入口
- 避免混淆
- 品牌一致性

### 推荐方案

**目标**: 将所有流量重定向到 www 版本
```
sat-index.online → www.sat-index.online
```

### Vercel 配置步骤

#### 1. 访问 Vercel Dashboard
```
https://vercel.com/dashboard
```

#### 2. 选择项目
找到 `sat-discovery-platform` 项目

#### 3. 进入 Domains 设置
项目页面 → Settings → Domains

#### 4. 添加根域名
- 点击 "Add Domain"
- 输入: `sat-index.online`
- 点击 "Add"

#### 5. 配置重定向
- 找到 `sat-index.online` 记录
- 点击旁边的 "..." 菜单
- 选择 "Redirect to"
- 输入: `www.sat-index.online`
- 勾选 "Permanent (308)"
- 保存

#### 6. 验证
访问 `https://sat-index.online/`，应该自动跳转到 `https://www.sat-index.online/`

---

## 🔧 Cloudflare 设置

### 当前推荐设置

#### SSL/TLS 模式
```
Encryption mode: Full (strict)
```
✅ 推荐用于 Vercel

#### Proxy 状态
```
A 记录: DNS only (灰色云朵)
CNAME 记录: DNS only (灰色云朵)
```
⚠️ **重要**: 必须是 DNS only，不能启用 Cloudflare 代理

#### 原因
- Vercel 需要直接管理 SSL 证书
- Cloudflare 代理会导致证书验证失败
- DNS only 模式仍然使用 Cloudflare nameservers

### 可选优化

#### 1. Always Use HTTPS
```
SSL/TLS → Edge Certificates → Always Use HTTPS: On
```

#### 2. Automatic HTTPS Rewrites
```
SSL/TLS → Edge Certificates → Automatic HTTPS Rewrites: On
```

#### 3. Minimum TLS Version
```
SSL/TLS → Edge Certificates → Minimum TLS Version: TLS 1.2
```

---

## 🐛 常见问题

### 问题1: 网站无法访问

**症状**: 域名解析失败

**检查**:
```bash
dig sat-index.online
dig www.sat-index.online
```

**可能原因**:
- DNS 未传播（等待 24-48 小时）
- Nameservers 未正确配置
- DNS 记录错误

**解决方案**:
1. 检查 Cloudflare nameservers 是否激活
2. 验证 DNS 记录配置正确
3. 等待 DNS 传播

### 问题2: SSL 证书错误

**症状**: HTTPS 显示证书警告

**可能原因**:
- Cloudflare 代理已启用（橙色云朵）
- SSL 模式设置不正确

**解决方案**:
1. 将 DNS 记录改为 DNS only（灰色云朵）
2. SSL/TLS 模式设置为 Full (strict)
3. 等待几分钟让 Vercel 重新颁发证书

### 问题3: 两个域名都显示内容但想统一

**症状**: sat-index.online 和 www.sat-index.online 都可访问

**解决方案**:
按照上面"域名重定向配置"部分在 Vercel 设置重定向

### 问题4: DNS 传播很慢

**症状**: 某些地区能访问，某些不能

**原因**: DNS 传播需要时间

**解决方案**:
1. 耐心等待（通常 1-6 小时）
2. 清除本地 DNS 缓存：
   ```bash
   # Windows
   ipconfig /flushdns
   
   # macOS
   sudo dscacheutil -flushcache
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

---

## 📊 DNS 传播时间

### 正常时间

| 变更类型 | 预期时间 |
|----------|----------|
| 新增记录 | 5-30 分钟 |
| 修改记录 | 5-30 分钟 |
| Nameserver 变更 | 24-48 小时 |
| 删除记录 | TTL 时间 |

### 加速传播

1. **设置低 TTL**:
   - 变更前将 TTL 改为 5 分钟
   - 变更后等待传播
   - 再将 TTL 改回 Auto

2. **使用 Cloudflare**:
   - Cloudflare DNS 传播较快
   - 全球网络加速

3. **Vercel 自动处理**:
   - Vercel 会自动处理 DNS 更新
   - 通常几分钟内生效

---

## 🎯 最佳实践

### DNS 配置

1. ✅ 使用 Cloudflare nameservers
2. ✅ A 记录指向 Vercel IP
3. ✅ CNAME 记录指向 Vercel DNS
4. ✅ 保持 DNS only 模式（灰色云朵）
5. ✅ 配置域名重定向（统一 URL）

### SSL/TLS

1. ✅ Cloudflare SSL 模式: Full (strict)
2. ✅ Always Use HTTPS: On
3. ✅ Minimum TLS: 1.2
4. ✅ HSTS: Enabled
5. ✅ Automatic HTTPS Rewrites: On

### 监控

1. ✅ 设置 uptime 监控
2. ✅ 检查 SSL 证书到期时间
3. ✅ 监控 DNS 解析状态
4. ✅ 定期检查访问日志

---

## 📞 需要帮助？

### 验证工具

- **DNS Checker**: https://dnschecker.org/
- **MXToolBox**: https://mxtoolbox.com/
- **SSL Labs**: https://www.ssllabs.com/ssltest/

### 文档资源

- **Cloudflare Docs**: https://developers.cloudflare.com/
- **Vercel Docs**: https://vercel.com/docs/concepts/projects/domains

### 支持渠道

- Cloudflare Community: https://community.cloudflare.com/
- Vercel Support: https://vercel.com/support
- GitHub Issues: 本项目 Issues 页面

---

## 📝 配置历史

### 2026-02-19
- ✅ 配置 Cloudflare nameservers
- ✅ 添加 A 记录: sat-index.online → 216.198.79.1
- ✅ 添加 CNAME 记录: www → vercel-dns
- ✅ 验证 HTTPS 正常工作
- ✅ 网站成功上线

### 待完成
- [ ] 配置域名重定向（www 统一）
- [ ] 设置 uptime 监控
- [ ] 优化 DNS TTL 设置

---

**最后更新**: 2026-02-19  
**状态**: ✅ 配置完成并运行正常  
**访问地址**: https://www.sat-index.online/
