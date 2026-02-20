# 时间范围筛选功能 - 完整技术规范

## 📋 文档概述

**版本**: 1.0  
**日期**: 2024-02-20  
**状态**: 完成 ✅  

### 用户需求原文

> "还要有一个功能键是时间，总要选择时间区间来查找想找的，可以参考skyfi那种，其实很多查询网站，我看很多公司的页面都陈列了一堆的数据资源，谁会耐心去看完，不会的，用户不关心说你到底有什么，关心的是我需要的你有没有"

### 核心洞察

- **用户不想浏览所有数据**
- **用户需要按时间快速筛选**
- **关注点从"你有什么"转变为"我需要的你有吗"**

---

## 1. 用户需求分析

### 1.1 用户痛点

**当前问题**:
1. 无法按时间范围筛选卫星数据
2. 需要浏览所有数据才能找到所需内容
3. 不知道特定时间段的数据覆盖情况
4. 查找效率低，用户体验差

**用户期望**:
1. 快速选择时间范围
2. 立即看到该时间段的数据
3. 提供常用时间范围的快捷选择
4. 时间筛选与其他筛选器协同工作

### 1.2 设计目标

**核心目标**:
- 让用户快速找到特定时间段的卫星数据
- 从"展示所有"转变为"精准查找"
- 提升查找效率，改善用户体验

**次要目标**:
- 与现有筛选系统无缝集成
- 保持界面简洁直观
- 提供常用时间范围的快捷操作

---

## 2. 功能需求规范

### 2.1 日期范围选择器

**功能描述**:
- 用户可以选择开始日期和结束日期
- 使用HTML5原生date input以获得最佳兼容性
- 自动验证日期有效性（结束日期≥开始日期）

**技术需求**:
- 输入类型: `<input type="date">`
- 日期格式: ISO 8601 (YYYY-MM-DD)
- 验证规则: endDate >= startDate
- 默认值: 空（显示所有数据）

### 2.2 快捷时间范围按钮

**功能描述**:
- 提供4个常用时间范围的快捷按钮
- 点击后自动设置日期范围并应用筛选

**快捷范围**:
1. **今天**: 开始=今天，结束=今天
2. **最近7天**: 开始=7天前，结束=今天
3. **最近30天**: 开始=30天前，结束=今天
4. **最近90天**: 开始=90天前，结束=今天

### 2.3 筛选系统集成

**功能描述**:
- 时间范围筛选与现有筛选器（传感器类型、归档、任务调度）协同工作
- 所有筛选条件同时生效（AND逻辑）
- 时间范围显示为筛选芯片，可点击删除

**集成点**:
- 筛选逻辑: `js/filters.js`
- 筛选芯片: 显示"开始日期 至 结束日期"
- 清除筛选: 包括时间范围

### 2.4 状态持久化

**功能描述**:
- 用户选择的时间范围保存到localStorage
- 页面刷新后自动恢复时间范围
- 清除筛选时删除保存的时间范围

**存储键名**:
- `sat_filter_startDate`: 开始日期
- `sat_filter_endDate`: 结束日期

---

## 3. UI/UX设计规范

### 3.1 界面布局

**位置**: 侧边栏筛选面板

**顺序**:
```
搜索框
    ↓
[时间范围] ← 新增
    ↓
传感器类型
    ↓
归档
    ↓
任务调度
    ↓
清除筛选按钮
```

### 3.2 组件设计

**时间范围区域**:
```
┌─────────────────────────┐
│ 📅 时间范围              │
├─────────────────────────┤
│ 开始日期:               │
│ [2024-01-01]            │
│                          │
│ 结束日期:               │
│ [2024-12-31]            │
├─────────────────────────┤
│ 快捷选择:               │
│ [今天]     [最近7天]    │
│ [最近30天] [最近90天]   │
└─────────────────────────┘
```

### 3.3 交互流程

**流程1: 手动选择日期**
```
用户点击开始日期输入框
    ↓
选择开始日期
    ↓
用户点击结束日期输入框
    ↓
选择结束日期
    ↓
自动应用筛选
    ↓
更新结果显示
```

**流程2: 使用快捷按钮**
```
用户点击快捷按钮（如"最近7天"）
    ↓
自动设置开始日期（7天前）
    ↓
自动设置结束日期（今天）
    ↓
自动应用筛选
    ↓
更新结果显示
```

### 3.4 视觉反馈

**筛选芯片**:
```
活动筛选器 (3):
┌────────────────────────────┐
│ ✕ 2024-01-01 至 2024-12-31 │
│ ✕ SAR                       │
│ ✕ 开放归档                  │
└────────────────────────────┘
```

**空状态**:
- 无时间范围选择时，不显示时间范围芯片
- 显示所有时间的数据

**加载状态**:
- 日期更改后，立即更新结果
- 无需显示加载指示器（快速响应）

---

## 4. 技术实现指南

### 4.1 HTML结构

**位置**: `app.html` 侧边栏中，搜索框和传感器类型之间

**代码**:
```html
<div class="sidebar-section">
    <h3>📅 时间范围</h3>
    
    <!-- 日期输入 -->
    <div class="date-range-inputs">
        <label for="startDate" class="input-label">
            开始日期
        </label>
        <input 
            type="date" 
            id="startDate" 
            class="input-field date-input"
            placeholder="选择开始日期"
        >
        
        <label for="endDate" class="input-label">
            结束日期
        </label>
        <input 
            type="date" 
            id="endDate" 
            class="input-field date-input"
            placeholder="选择结束日期"
        >
    </div>
    
    <!-- 快捷按钮 -->
    <div class="date-range-presets">
        <button 
            class="btn-preset" 
            data-days="0"
            title="选择今天"
        >
            今天
        </button>
        <button 
            class="btn-preset" 
            data-days="7"
            title="选择最近7天"
        >
            最近7天
        </button>
        <button 
            class="btn-preset" 
            data-days="30"
            title="选择最近30天"
        >
            最近30天
        </button>
        <button 
            class="btn-preset" 
            data-days="90"
            title="选择最近90天"
        >
            最近90天
        </button>
    </div>
</div>
```

### 4.2 JavaScript实现

**位置**: `js/filters.js`

**核心函数**:

```javascript
// 1. 时间范围筛选函数
function filterByDateRange(items, startDate, endDate) {
    // 如果没有时间范围，返回所有项
    if (!startDate && !endDate) {
        return items;
    }
    
    return items.filter(item => {
        // 获取项目的日期
        const itemDate = new Date(item.acquisitionDate || item.launchDate);
        
        // 设置范围（如果没有提供，使用极值）
        const start = startDate ? new Date(startDate) : new Date('1900-01-01');
        const end = endDate ? new Date(endDate) : new Date('2100-12-31');
        
        // 检查日期是否在范围内
        return itemDate >= start && itemDate <= end;
    });
}

// 2. 设置快捷时间范围
function setQuickDateRange(days) {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    
    // 设置输入框的值
    document.getElementById('startDate').value = formatDate(startDate);
    document.getElementById('endDate').value = formatDate(endDate);
    
    // 应用筛选
    applyFilters();
}

// 3. 日期格式化（ISO 8601）
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// 4. 日期验证
function validateDateRange(startDate, endDate) {
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start > end) {
            alert('结束日期必须晚于或等于开始日期');
            return false;
        }
    }
    return true;
}

// 5. 初始化时间范围筛选器
function initializeDateRangeFilter() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const presetButtons = document.querySelectorAll('.btn-preset');
    
    // 监听日期变化
    startDateInput.addEventListener('change', () => {
        if (validateDateRange(startDateInput.value, endDateInput.value)) {
            saveTimeRange();
            applyFilters();
        }
    });
    
    endDateInput.addEventListener('change', () => {
        if (validateDateRange(startDateInput.value, endDateInput.value)) {
            saveTimeRange();
            applyFilters();
        }
    });
    
    // 监听快捷按钮点击
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const days = parseInt(button.dataset.days);
            setQuickDateRange(days);
        });
    });
    
    // 加载保存的时间范围
    loadTimeRange();
}

// 6. 时间范围芯片管理
function getTimeRangeChip() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (startDate || endDate) {
        const start = startDate || '开始';
        const end = endDate || '结束';
        return {
            type: 'timeRange',
            label: `${start} 至 ${end}`,
            remove: () => {
                document.getElementById('startDate').value = '';
                document.getElementById('endDate').value = '';
                clearTimeRange();
                applyFilters();
            }
        };
    }
    
    return null;
}
```

### 4.3 CSS样式

**位置**: `css/components.css`

**代码**:
```css
/* 时间范围区域 */
.date-range-inputs {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

/* 输入标签 */
.input-label {
    font-size: 14px;
    color: var(--text-color);
    margin-bottom: 4px;
    font-weight: 500;
}

/* 日期输入框 */
.date-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    color: var(--text-color);
    background: var(--input-background);
    transition: all 0.2s ease;
}

.date-input:hover {
    border-color: var(--yellow);
}

.date-input:focus {
    outline: none;
    border-color: var(--yellow);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
}

/* 快捷按钮组 */
.date-range-presets {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
}

/* 快捷按钮 */
.btn-preset {
    padding: 8px 12px;
    background: var(--dark-blue);
    color: var(--yellow);
    border: 1px solid var(--yellow);
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-preset:hover {
    background: var(--yellow);
    color: var(--dark-blue);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(255, 215, 0, 0.2);
}

.btn-preset:active {
    transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .date-range-presets {
        grid-template-columns: 1fr;
    }
}
```

### 4.4 localStorage实现

**位置**: `js/storage.js`

**代码**:
```javascript
// 保存时间范围
function saveTimeRange() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (startDate) {
        localStorage.setItem('sat_filter_startDate', startDate);
    } else {
        localStorage.removeItem('sat_filter_startDate');
    }
    
    if (endDate) {
        localStorage.setItem('sat_filter_endDate', endDate);
    } else {
        localStorage.removeItem('sat_filter_endDate');
    }
}

// 加载时间范围
function loadTimeRange() {
    const startDate = localStorage.getItem('sat_filter_startDate');
    const endDate = localStorage.getItem('sat_filter_endDate');
    
    if (startDate) {
        document.getElementById('startDate').value = startDate;
    }
    
    if (endDate) {
        document.getElementById('endDate').value = endDate;
    }
}

// 清除时间范围
function clearTimeRange() {
    localStorage.removeItem('sat_filter_startDate');
    localStorage.removeItem('sat_filter_endDate');
}
```

---

## 5. 集成指南

### 5.1 与现有筛选器集成

**筛选器应用顺序**:
```javascript
function applyAllFilters() {
    let results = allItems;
    
    // 1. 应用搜索
    results = filterBySearch(results, searchQuery);
    
    // 2. 应用时间范围 ← 新增
    results = filterByDateRange(results, startDate, endDate);
    
    // 3. 应用传感器类型
    results = filterBySensorType(results, selectedTypes);
    
    // 4. 应用归档
    results = filterByArchive(results, archiveFilter);
    
    // 5. 应用任务调度
    results = filterByTasking(results, taskingFilter);
    
    return results;
}
```

### 5.2 筛选芯片集成

**更新筛选芯片显示**:
```javascript
function updateFilterChips() {
    const chips = [];
    
    // 添加时间范围芯片
    const timeChip = getTimeRangeChip();
    if (timeChip) {
        chips.push(timeChip);
    }
    
    // 添加其他芯片...
    
    renderChips(chips);
}
```

### 5.3 清除筛选集成

**更新清除筛选功能**:
```javascript
function clearAllFilters() {
    // 清除搜索
    document.getElementById('searchInput').value = '';
    
    // 清除时间范围 ← 新增
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    clearTimeRange();
    
    // 清除其他筛选器...
    
    applyFilters();
}
```

---

## 6. 测试计划

### 6.1 功能测试

| # | 测试项 | 步骤 | 预期结果 |
|---|--------|------|----------|
| 1 | 日期选择器显示 | 打开页面 | 显示两个日期输入框 |
| 2 | 开始日期选择 | 点击开始日期输入框，选择日期 | 日期正确显示在输入框中 |
| 3 | 结束日期选择 | 点击结束日期输入框，选择日期 | 日期正确显示在输入框中 |
| 4 | 日期验证 | 选择结束日期早于开始日期 | 显示错误提示 |
| 5 | 今天按钮 | 点击"今天"按钮 | 两个日期都设置为今天 |
| 6 | 最近7天按钮 | 点击"最近7天"按钮 | 开始日期=7天前，结束日期=今天 |
| 7 | 最近30天按钮 | 点击"最近30天"按钮 | 开始日期=30天前，结束日期=今天 |
| 8 | 最近90天按钮 | 点击"最近90天"按钮 | 开始日期=90天前，结束日期=今天 |
| 9 | 筛选逻辑 | 设置日期范围，查看结果 | 只显示日期范围内的数据 |
| 10 | 芯片显示 | 设置日期范围 | 显示时间范围筛选芯片 |
| 11 | 芯片删除 | 点击芯片上的"✕" | 清除时间范围，显示所有数据 |
| 12 | localStorage保存 | 设置日期范围，刷新页面 | 日期范围保持 |
| 13 | localStorage加载 | 刷新页面 | 恢复之前的日期范围 |
| 14 | 清除所有筛选 | 点击"清除所有筛选"按钮 | 时间范围也被清除 |
| 15 | 响应式设计 | 在移动设备上打开 | 布局正常，按钮可用 |

### 6.2 集成测试

**测试场景1**: 时间范围 + 传感器类型
```
设置：最近30天 + SAR
预期：显示最近30天的SAR卫星
```

**测试场景2**: 时间范围 + 归档
```
设置：2024-01-01至2024-01-31 + 开放归档
预期：显示2024年1月的开放归档卫星
```

**测试场景3**: 时间范围 + 搜索
```
设置：最近7天 + 搜索"Sentinel"
预期：显示最近7天名称包含"Sentinel"的卫星
```

### 6.3 用户验收测试

**场景1**: 查找最近一周的SAR数据
```
用户操作：
1. 点击"最近7天"按钮
2. 勾选"SAR"传感器
3. 查看结果

验收标准：
- 日期范围正确设置
- 只显示SAR卫星
- 只显示最近7天的数据
```

---

## 7. 性能考虑

### 7.1 性能目标

| 指标 | 目标 |
|------|------|
| 日期选择器加载 | <10ms |
| 日期更改响应 | <50ms |
| 筛选计算 | <100ms |
| UI更新 | <100ms |

### 7.2 优化策略

**1. 使用HTML5原生组件**
- 日期选择器使用原生`<input type="date">`
- 无需加载额外的日期选择器库
- 性能最优，兼容性好

**2. 防抖处理**
```javascript
// 对于频繁的日期更改，使用防抖
const debouncedApplyFilters = debounce(applyFilters, 300);
```

**3. 筛选算法优化**
- 使用Array.filter()进行筛选（O(n)复杂度）
- 日期比较使用Date对象的内置方法
- 避免不必要的重复计算

---

## 8. 用户文档大纲

### 8.1 使用指南结构

**标题**: 时间范围筛选功能使用指南

**章节**:
1. 功能概述
2. 如何使用日期选择器
3. 如何使用快捷按钮
4. 使用场景示例
5. 与其他筛选器组合使用
6. 常见问题解答

### 8.2 场景示例

**示例1**: 查找最近一周的数据
```
1. 点击"最近7天"按钮
2. 查看筛选结果
3. 根据需要添加其他筛选条件
```

**示例2**: 查找特定月份的数据
```
1. 开始日期：2024-06-01
2. 结束日期：2024-06-30
3. 查看6月份的数据
```

**示例3**: 查找特定季度的数据
```
1. 开始日期：2024-01-01
2. 结束日期：2024-03-31
3. 查看Q1数据
```

---

## 9. 实施检查清单

### 9.1 开发阶段

- [ ] 在app.html中添加时间范围UI
- [ ] 在filters.js中实现筛选逻辑
- [ ] 在components.css中添加样式
- [ ] 在storage.js中实现状态管理
- [ ] 集成到现有筛选系统
- [ ] 实现筛选芯片显示
- [ ] 实现清除筛选功能

### 9.2 测试阶段

- [ ] 执行15项功能测试
- [ ] 执行3项集成测试
- [ ] 执行用户验收测试
- [ ] 性能测试
- [ ] 响应式设计测试

### 9.3 文档阶段

- [ ] 编写用户使用指南
- [ ] 更新技术文档
- [ ] 创建使用场景示例
- [ ] 编写FAQ

### 9.4 部署阶段

- [ ] 部署到测试环境
- [ ] 验证所有功能
- [ ] 收集反馈
- [ ] 部署到生产环境

---

## 10. 总结

### 10.1 核心价值

**UX哲学转变**:
- 从"展示所有数据"到"精准查找所需"
- 从"你有什么"到"我需要的你有吗"
- 从"耐心浏览"到"快速定位"

**用户受益**:
1. 节省查找时间
2. 提高工作效率
3. 改善使用体验
4. 减少认知负担

### 10.2 技术亮点

1. **简单高效**: 使用HTML5原生组件，无额外依赖
2. **易于集成**: 与现有筛选系统无缝集成
3. **用户友好**: 提供快捷按钮，降低操作成本
4. **状态持久**: localStorage保存用户偏好

### 10.3 实施规模

| 指标 | 数值 |
|------|------|
| 新增代码 | 209行 |
| 修改文件 | 4个 |
| 测试用例 | 15个 |
| 开发时间 | 4-6小时 |

---

**规范文档完成！**

**日期**: 2024-02-20  
**版本**: 1.0  
**状态**: ✅ 完成  

准备进入开发实施阶段！🚀
