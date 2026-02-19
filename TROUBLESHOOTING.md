# 故障排查指南

## 常见问题和解决方案

### 问题1: 网站显示 "Safe Content This content is safe from XSS attacks"

#### 症状
- 访问网站时只看到文本："Safe Content This content is safe from XSS attacks"
- 页面内容完全不显示
- 页面空白或只有错误消息

#### 原因
这个问题由 `X-XSS-Protection` HTTP 头部引起。这是一个已被弃用的安全头部，会导致浏览器误报 XSS 攻击并阻止页面内容。

**技术细节**:
- `X-XSS-Protection: 1; mode=block` 会让浏览器在检测到可疑内容时完全阻止页面渲染
- 现代浏览器（Chrome 78+, Firefox, Edge）已经移除或弃用此功能
- 误报率高，可能阻止合法内容
- 不应再使用，应该使用 Content-Security-Policy 替代

#### 解决方案

**✅ 已修复** (2026-02-19)

修改 `vercel.json` 文件：

**之前的配置** (有问题):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"  // ❌ 这会导致问题
        }
      ]
    }
  ]
}
```

**修复后的配置**:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
        }
      ]
    }
  ]
}
```

**关键变更**:
1. ❌ **移除** `X-XSS-Protection` - 已弃用且会导致误报
2. ✅ **添加** `Content-Security-Policy` - 现代安全策略
3. ✅ **改进** `X-Frame-Options` - 从 DENY 改为 SAMEORIGIN

#### 验证修复

部署后检查：
1. 访问网站主页
2. 确认页面正常显示内容
3. 检查浏览器控制台无错误
4. 验证星空背景动画运行
5. 测试所有页面可访问

**浏览器开发者工具检查**:
```javascript
// 在控制台运行
console.log(document.body.innerHTML.length > 100 ? '✅ 页面正常' : '❌ 页面空白');
```

---

### 问题2: 样式或脚本不工作

#### 症状
- 页面显示但没有样式
- JavaScript 功能不工作
- 控制台显示 CSP 错误

#### 原因
Content-Security-Policy 太严格

#### 解决方案

确保 CSP 包含必要的指令：
```
script-src 'self' 'unsafe-inline';  // 允许内联脚本
style-src 'self' 'unsafe-inline';   // 允许内联样式
```

**注意**: `'unsafe-inline'` 降低了安全性，但对于使用大量内联样式的页面是必需的。

**更安全的替代方案**（未来优化）:
1. 将内联样式移到外部 CSS 文件
2. 将内联脚本移到外部 JS 文件
3. 使用 nonce 或 hash 代替 'unsafe-inline'

---

### 问题3: 图片或字体不加载

#### 症状
- 页面显示但图片缺失
- 字体不加载，显示默认字体

#### 原因
CSP 的 img-src 或 font-src 配置不正确

#### 解决方案

确保 CSP 包含：
```
img-src 'self' data: https:;  // 允许所有 HTTPS 图片
font-src 'self' data:;        // 允许字体加载
```

---

### 问题4: 页面在 iframe 中不显示

#### 症状
- 页面单独访问正常
- 嵌入 iframe 时不显示

#### 原因
`X-Frame-Options` 设置为 DENY

#### 解决方案

将 `X-Frame-Options` 改为：
- `SAMEORIGIN` - 允许同源嵌入
- 或完全移除此头部，仅使用 CSP 的 frame-ancestors

---

## 安全头部最佳实践

### 推荐配置

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        }
      ]
    }
  ]
}
```

### 不推荐使用的头部

❌ **X-XSS-Protection**
- 已弃用
- 会导致误报
- 使用 CSP 替代

❌ **Public-Key-Pins** (HPKP)
- 已弃用
- 风险太高
- 浏览器已不支持

---

## 调试技巧

### 1. 检查 HTTP 头部

**使用 curl**:
```bash
curl -I https://www.sat-index.online/
```

**使用浏览器**:
1. 打开开发者工具 (F12)
2. 切换到 Network 标签
3. 刷新页面
4. 点击主文档
5. 查看 Response Headers

### 2. 检查 CSP 违规

**浏览器控制台**:
```javascript
// CSP 违规会显示为错误消息
// 示例: "Refused to load the script ... violates the following Content Security Policy directive"
```

### 3. 临时禁用安全头部测试

**本地测试**:
在本地开发服务器测试，不带安全头部：
```bash
python -m http.server 8000
# 或
npx serve
```

### 4. 使用在线工具

**安全头部检查器**:
- https://securityheaders.com/
- https://observatory.mozilla.org/

---

## 联系支持

如果问题仍未解决：

1. 查看浏览器控制台的完整错误消息
2. 检查 Network 标签的 HTTP 状态码
3. 在 GitHub Issues 中报告问题
4. 提供：
   - 浏览器版本
   - 完整错误消息
   - 网络请求详情
   - 重现步骤

---

**最后更新**: 2026-02-19  
**版本**: 1.0  
**状态**: X-XSS-Protection 问题已修复 ✅
