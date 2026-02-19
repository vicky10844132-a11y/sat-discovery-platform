# 无密码邮箱登录设计 (Magic Link Authentication)

## 核心理念

**无需注册，无需密码，只需邮箱**

用户只需要输入邮箱地址，就能：
- 接收登录链接
- 一键登录
- 查看历史记录
- 继续处理任务

## 用户体验流程

### 场景1：首次使用
```
访问网站 → 选择算法 → 提交任务 → 
输入邮箱(可选) → 任务开始 → 
（如输入邮箱）收到结果通知 + 登录链接
```

### 场景2：查看历史
```
点击"我的记录" → 输入邮箱 → 
收到登录邮件 → 点击链接 → 
自动登录 → 查看所有历史记录
```

### 场景3：继续任务
```
已登录状态 → 提交新任务 → 
自动关联到账户 → 可在历史中查看
```

## 技术实现

### 1. 数据库设计

```sql
-- 用户表（最小化设计）
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP DEFAULT NOW(),
  total_tasks INTEGER DEFAULT 0,
  INDEX idx_email (email)
);

-- 魔法链接Token表
CREATE TABLE magic_tokens (
  token VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  used BOOLEAN DEFAULT false,
  INDEX idx_email (email),
  INDEX idx_expires (expires_at)
);

-- 会话表
CREATE TABLE sessions (
  session_id VARCHAR(64) PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  last_activity TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_id (user_id),
  INDEX idx_expires (expires_at)
);

-- 处理历史表
CREATE TABLE processing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  algorithm VARCHAR(100) NOT NULL,
  input_source TEXT,
  output_url TEXT,
  parameters JSONB,
  status VARCHAR(50) NOT NULL, -- pending, processing, completed, failed
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  error_message TEXT,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created (started_at)
);
```

### 2. 后端API设计

#### 2.1 发送登录链接

**Endpoint**: `POST /api/auth/send-magic-link`

**请求**:
```json
{
  "email": "user@example.com",
  "redirect_url": "/history" // 可选，登录后跳转的页面
}
```

**响应**:
```json
{
  "success": true,
  "message": "登录链接已发送到您的邮箱",
  "expires_in": 900 // 15分钟
}
```

**实现**:
```javascript
// backend/src/auth/magic-link.controller.ts
export async function sendMagicLink(req, res) {
  const { email, redirect_url = '/' } = req.body;
  
  // 验证邮箱格式
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  
  // Rate limiting: 同一邮箱5分钟内只能发送一次
  const recentToken = await MagicToken.findOne({
    email,
    created_at: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
  });
  
  if (recentToken) {
    return res.status(429).json({ 
      error: '请等待5分钟后再试' 
    });
  }
  
  // 生成安全token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15分钟
  
  // 保存token
  await MagicToken.create({
    token,
    email,
    expires_at: expiresAt,
    metadata: { redirect_url }
  });
  
  // 生成魔法链接
  const magicLink = `${process.env.BASE_URL}/auth/verify?token=${token}`;
  
  // 发送邮件
  await sendEmail({
    to: email,
    subject: 'SAT-DISCOVERY 登录链接',
    template: 'magic-link',
    data: {
      magicLink,
      expiresInMinutes: 15
    }
  });
  
  res.json({
    success: true,
    message: '登录链接已发送到您的邮箱',
    expires_in: 900
  });
}
```

#### 2.2 验证登录链接

**Endpoint**: `GET /api/auth/verify?token=xxx`

**响应**: 重定向到首页，设置session cookie

**实现**:
```javascript
// backend/src/auth/magic-link.controller.ts
export async function verifyMagicLink(req, res) {
  const { token } = req.query;
  
  // 查找token
  const tokenData = await MagicToken.findOne({ 
    token,
    used: false,
    expires_at: { $gt: new Date() }
  });
  
  if (!tokenData) {
    return res.status(400).render('error', {
      message: '登录链接无效或已过期，请重新发送'
    });
  }
  
  // 标记token为已使用
  await MagicToken.update({ token }, { 
    used: true,
    used_at: new Date()
  });
  
  // 查找或创建用户
  let user = await User.findOne({ email: tokenData.email });
  if (!user) {
    user = await User.create({ 
      email: tokenData.email 
    });
  } else {
    // 更新最后登录时间
    await User.update(
      { id: user.id },
      { last_login: new Date() }
    );
  }
  
  // 创建会话
  const sessionId = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7天
  
  await Session.create({
    session_id: sessionId,
    user_id: user.id,
    expires_at: expiresAt
  });
  
  // 设置cookie
  res.cookie('session_id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7天
  });
  
  // 重定向
  const redirectUrl = tokenData.metadata?.redirect_url || '/';
  res.redirect(redirectUrl);
}
```

#### 2.3 获取当前用户

**Endpoint**: `GET /api/auth/me`

**响应**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "total_tasks": 42,
    "created_at": "2026-02-19T10:00:00Z"
  }
}
```

#### 2.4 登出

**Endpoint**: `POST /api/auth/logout`

**响应**:
```json
{
  "success": true
}
```

### 3. 前端实现

#### 3.1 登录界面

```html
<!-- login.html 或在 index.html 中的模态框 -->
<div class="login-modal">
  <h2>查看我的处理记录</h2>
  <p>输入您的邮箱，我们将发送登录链接</p>
  
  <form id="magic-link-form">
    <input 
      type="email" 
      id="email-input"
      placeholder="your@email.com"
      required
    />
    <button type="submit">发送登录链接</button>
  </form>
  
  <div id="success-message" style="display:none;">
    ✅ 登录链接已发送！请检查您的邮箱
  </div>
  
  <div id="error-message" style="display:none;"></div>
</div>

<script>
document.getElementById('magic-link-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email-input').value;
  const submitBtn = e.target.querySelector('button');
  
  submitBtn.disabled = true;
  submitBtn.textContent = '发送中...';
  
  try {
    const response = await fetch('/api/auth/send-magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      document.getElementById('success-message').style.display = 'block';
      document.getElementById('magic-link-form').style.display = 'none';
    } else {
      document.getElementById('error-message').textContent = data.error;
      document.getElementById('error-message').style.display = 'block';
    }
  } catch (error) {
    document.getElementById('error-message').textContent = '发送失败，请重试';
    document.getElementById('error-message').style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '发送登录链接';
  }
});
</script>
```

#### 3.2 历史记录页面

```html
<!-- history.html -->
<div class="history-page">
  <h1>我的处理记录</h1>
  
  <div id="history-list">
    <!-- 动态加载 -->
  </div>
</div>

<script>
async function loadHistory() {
  try {
    const response = await fetch('/api/processing-history');
    const data = await response.json();
    
    if (response.status === 401) {
      // 未登录，显示登录提示
      showLoginPrompt();
      return;
    }
    
    renderHistory(data.history);
  } catch (error) {
    console.error('Failed to load history:', error);
  }
}

function renderHistory(history) {
  const listEl = document.getElementById('history-list');
  
  if (history.length === 0) {
    listEl.innerHTML = '<p>您还没有处理记录</p>';
    return;
  }
  
  listEl.innerHTML = history.map(item => `
    <div class="history-item">
      <div class="algorithm">${item.algorithm}</div>
      <div class="status ${item.status}">${item.status}</div>
      <div class="date">${formatDate(item.started_at)}</div>
      ${item.output_url ? `
        <a href="${item.output_url}" class="download-btn">下载结果</a>
      ` : ''}
    </div>
  `).join('');
}

// 页面加载时检查登录状态
loadHistory();
</script>
```

### 4. 邮件模板

```html
<!-- email-templates/magic-link.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: #020b16;
      color: #ffd700;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #fff;
      padding: 30px;
      border: 1px solid #ddd;
      border-top: none;
    }
    .button {
      display: inline-block;
      background: #ffd700;
      color: #020b16;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛰️ SAT-DISCOVERY</h1>
  </div>
  
  <div class="content">
    <h2>您的登录链接</h2>
    
    <p>点击下方按钮登录到 SAT-DISCOVERY 平台：</p>
    
    <center>
      <a href="{{magicLink}}" class="button">
        登录到 SAT-DISCOVERY
      </a>
    </center>
    
    <p style="color: #666; font-size: 14px;">
      此链接将在 {{expiresInMinutes}} 分钟后过期。
    </p>
    
    <p style="color: #666; font-size: 14px;">
      如果您没有请求此邮件，请忽略。
    </p>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    
    <p style="font-size: 12px; color: #999;">
      或者复制以下链接到浏览器：<br>
      <code style="background: #f5f5f5; padding: 5px;">{{magicLink}}</code>
    </p>
  </div>
  
  <div class="footer">
    <p>SAT-DISCOVERY - 无存储算法处理平台</p>
    <p>只做计算，不存数据 · 公益免费</p>
  </div>
</body>
</html>
```

### 5. 邮件发送服务

#### 选项1: SendGrid (推荐)

```javascript
// backend/src/services/email.service.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail({ to, subject, template, data }) {
  const html = renderTemplate(template, data);
  
  const msg = {
    to,
    from: 'noreply@sat-discovery.com',
    subject,
    html
  };
  
  await sgMail.send(msg);
}
```

**成本**: 100封/天免费，之后 $15/月起

#### 选项2: AWS SES

```javascript
import AWS from 'aws-sdk';

const ses = new AWS.SES({ region: 'us-east-1' });

export async function sendEmail({ to, subject, template, data }) {
  const html = renderTemplate(template, data);
  
  const params = {
    Source: 'noreply@sat-discovery.com',
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Data: html } }
    }
  };
  
  await ses.sendEmail(params).promise();
}
```

**成本**: $0.10 / 1000封

### 6. 安全措施

#### 6.1 Rate Limiting

```javascript
// 限制同一邮箱发送频率
const rateLimiter = new Map();

function checkRateLimit(email) {
  const key = `magic-link:${email}`;
  const lastSent = rateLimiter.get(key);
  
  if (lastSent && Date.now() - lastSent < 5 * 60 * 1000) {
    throw new Error('请等待5分钟后再试');
  }
  
  rateLimiter.set(key, Date.now());
}
```

#### 6.2 Token 安全

- Token 长度: 64字符 (256 bit)
- 有效期: 15分钟
- 一次性使用
- HTTPS 强制

#### 6.3 Session 管理

- HttpOnly Cookie
- Secure (HTTPS only)
- SameSite: Lax
- 7天过期
- 可随时注销

### 7. 用户隐私

#### GDPR 合规

- ✅ 只存储必要信息（邮箱）
- ✅ 用户可删除账户
- ✅ 用户可导出数据
- ✅ 用户可删除历史记录

#### 隐私声明

```
我们只存储：
- 您的邮箱地址
- 您的处理历史记录

我们不存储：
- 密码（我们不使用密码）
- 您的数据文件
- 任何个人信息

您可以随时：
- 删除您的账户
- 清空历史记录
- 导出您的数据
```

## 实施计划

### Week 1: 后端基础
- [ ] 数据库表创建
- [ ] Magic Link API
- [ ] 邮件服务集成
- [ ] Session 管理

### Week 2: 前端集成
- [ ] 登录界面
- [ ] 历史记录页面
- [ ] 会话状态管理
- [ ] 用户菜单

### Week 3: 测试优化
- [ ] 邮件送达测试
- [ ] 安全测试
- [ ] 用户体验优化
- [ ] 性能优化

## 总结

**核心优势**:
- ✅ 无需注册，降低门槛
- ✅ 无需密码，减少风险
- ✅ 一键登录，体验优秀
- ✅ 安全可靠，符合最佳实践

**技术栈**:
- 后端: Node.js / Express
- 数据库: PostgreSQL
- 邮件: SendGrid / AWS SES
- 会话: Cookie-based

**预期成本**:
- 邮件: $15/月 (SendGrid) 或 $0.10/1000封 (AWS SES)
- 数据库: 已包含在现有架构中
- 总计: ~$15-20/月

**时间估算**: 3周完成
