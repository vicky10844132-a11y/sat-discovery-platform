#!/usr/bin/env node

/**
 * 功能和资源完整性测试脚本
 * 测试所有功能按钮和外部资源
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// 测试结果统计
const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: []
};

// 测试 CDN 资源
async function testCDNResource(name, url) {
    return new Promise((resolve) => {
        const protocol = url.startsWith('https') ? https : http;
        
        protocol.get(url, (res) => {
            if (res.statusCode === 200) {
                results.passed++;
                results.tests.push({ name, status: 'PASS', url });
                log(`✓ ${name} - OK`, 'green');
                resolve(true);
            } else {
                results.failed++;
                results.tests.push({ name, status: 'FAIL', url, code: res.statusCode });
                log(`✗ ${name} - 失败 (${res.statusCode})`, 'red');
                resolve(false);
            }
        }).on('error', (err) => {
            results.failed++;
            results.tests.push({ name, status: 'FAIL', url, error: err.message });
            log(`✗ ${name} - 错误: ${err.message}`, 'red');
            resolve(false);
        });
    });
}

// 测试本地文件
function testLocalFile(name, filePath) {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        results.passed++;
        results.tests.push({ name, status: 'PASS', path: filePath, size: stats.size });
        log(`✓ ${name} - 存在 (${(stats.size / 1024).toFixed(2)} KB)`, 'green');
        return true;
    } else {
        results.failed++;
        results.tests.push({ name, status: 'FAIL', path: filePath });
        log(`✗ ${name} - 不存在`, 'red');
        return false;
    }
}

// 测试 HTML 文件中的功能
function testHTMLFeatures(name, filePath) {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) {
        results.failed++;
        log(`✗ ${name} - 文件不存在`, 'red');
        return false;
    }
    
    const content = fs.readFileSync(fullPath, 'utf-8');
    const features = [];
    
    // 检查常见功能元素
    const checks = [
        { name: 'Navigation', pattern: /<nav[^>]*>|<a href/i },
        { name: 'Buttons', pattern: /<button[^>]*>|class="btn/i },
        { name: 'Forms', pattern: /<input[^>]*>|<form[^>]*>/i },
        { name: 'Scripts', pattern: /<script[^>]*>/i },
        { name: 'Stylesheets', pattern: /<link[^>]*stylesheet/i }
    ];
    
    let allPassed = true;
    checks.forEach(check => {
        if (check.pattern.test(content)) {
            features.push(check.name);
        } else {
            allPassed = false;
        }
    });
    
    if (allPassed) {
        results.passed++;
        results.tests.push({ name, status: 'PASS', features });
        log(`✓ ${name} - 包含所有基本功能`, 'green');
    } else {
        results.warnings++;
        results.tests.push({ name, status: 'WARN', features });
        log(`⚠ ${name} - 某些功能缺失`, 'yellow');
    }
    
    return allPassed;
}

// 主测试函数
async function runTests() {
    log('\n==========================================', 'cyan');
    log('  功能和资源完整性测试', 'cyan');
    log('==========================================\n', 'cyan');
    
    // 1. 测试外部 CDN 资源
    log('1. 测试外部 CDN 资源\n', 'blue');
    await testCDNResource('Leaflet CSS', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
    await testCDNResource('Leaflet JS', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
    await testCDNResource('Leaflet.draw CSS', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css');
    await testCDNResource('Leaflet.draw JS', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js');
    
    // 测试地图瓦片（随机测试一个瓦片）
    await testCDNResource('OpenStreetMap Tiles', 'https://tile.openstreetmap.org/0/0/0.png');
    
    log('\n');
    
    // 2. 测试本地 JavaScript 模块
    log('2. 测试本地 JavaScript 模块\n', 'blue');
    testLocalFile('storage.js', 'js/storage.js');
    testLocalFile('dataLoader.js', 'js/dataLoader.js');
    testLocalFile('indexer.js', 'js/indexer.js');
    testLocalFile('filters.js', 'js/filters.js');
    testLocalFile('ui.js', 'js/ui.js');
    testLocalFile('map.js', 'js/map.js');
    testLocalFile('router.js', 'js/router.js');
    
    log('\n');
    
    // 3. 测试 CSS 文件
    log('3. 测试 CSS 文件\n', 'blue');
    testLocalFile('theme.css', 'css/theme.css');
    testLocalFile('layout.css', 'css/layout.css');
    testLocalFile('components.css', 'css/components.css');
    
    log('\n');
    
    // 4. 测试数据文件
    log('4. 测试数据文件\n', 'blue');
    testLocalFile('satellites.json', 'satellites.json');
    testLocalFile('open_archives.json', 'open_archives.json');
    testLocalFile('sources.json', 'sources.json');
    testLocalFile('algorithms_catalog.json', 'algorithms_catalog.json');
    testLocalFile('data_sources_catalog.json', 'data_sources_catalog.json');
    
    log('\n');
    
    // 5. 测试 HTML 页面
    log('5. 测试 HTML 页面功能\n', 'blue');
    testHTMLFeatures('app.html', 'app.html');
    testHTMLFeatures('index.html', 'index.html');
    testHTMLFeatures('about.html', 'about.html');
    testHTMLFeatures('data_sources.html', 'data_sources.html');
    testHTMLFeatures('algorithms.html', 'algorithms.html');
    
    log('\n');
    
    // 6. 测试关键功能（基于文件内容）
    log('6. 测试关键功能实现\n', 'blue');
    
    // 检查 app.html 中的关键功能
    const appHtml = fs.readFileSync(path.join(__dirname, 'app.html'), 'utf-8');
    
    const functionalityChecks = [
        { name: '侧边栏折叠按钮', pattern: /sidebar-toggle|sidebarToggle/i },
        { name: '搜索输入框', pattern: /searchInput|type="text"/i },
        { name: '传感器类型筛选', pattern: /typeFilters|Sensor Type/i },
        { name: '归档筛选', pattern: /archive|Archive/i },
        { name: '任务调度筛选', pattern: /tasking|Tasking/i },
        { name: '清除筛选按钮', pattern: /clearFiltersBtn|Clear Filters/i },
        { name: '地图容器', pattern: /<div id="map"/i },
        { name: '结果网格', pattern: /resultsGrid|results-grid/i },
        { name: '初始化函数', pattern: /function init\(\)|async function init/i },
        { name: 'Leaflet 初始化', pattern: /MapManager\.init/i }
    ];
    
    functionalityChecks.forEach(check => {
        if (check.pattern.test(appHtml)) {
            results.passed++;
            results.tests.push({ name: check.name, status: 'PASS' });
            log(`✓ ${check.name} - 已实现`, 'green');
        } else {
            results.failed++;
            results.tests.push({ name: check.name, status: 'FAIL' });
            log(`✗ ${check.name} - 未找到`, 'red');
        }
    });
    
    log('\n');
    
    // 7. 检查 JavaScript 模块功能
    log('7. 测试 JavaScript 模块功能\n', 'blue');
    
    const mapJs = fs.readFileSync(path.join(__dirname, 'js/map.js'), 'utf-8');
    const mapFeatures = [
        { name: 'Leaflet 地图初始化', pattern: /L\.map\(/i },
        { name: 'OpenStreetMap 瓦片', pattern: /tile\.openstreetmap\.org|L\.tileLayer/i },
        { name: 'AOI 绘制功能', pattern: /L\.draw|Leaflet\.draw/i },
        { name: '地图标记功能', pattern: /L\.marker|addMarker/i }
    ];
    
    mapFeatures.forEach(check => {
        if (check.pattern.test(mapJs)) {
            results.passed++;
            results.tests.push({ name: check.name, status: 'PASS' });
            log(`✓ ${check.name} - 已实现`, 'green');
        } else {
            results.warnings++;
            results.tests.push({ name: check.name, status: 'WARN' });
            log(`⚠ ${check.name} - 未找到`, 'yellow');
        }
    });
    
    log('\n');
    
    // 生成测试报告
    log('==========================================', 'cyan');
    log('  测试报告', 'cyan');
    log('==========================================\n', 'cyan');
    
    log(`总测试数: ${results.passed + results.failed + results.warnings}`, 'blue');
    log(`通过: ${results.passed}`, 'green');
    log(`失败: ${results.failed}`, 'red');
    log(`警告: ${results.warnings}`, 'yellow');
    
    const successRate = ((results.passed / (results.passed + results.failed + results.warnings)) * 100).toFixed(1);
    log(`\n成功率: ${successRate}%`, successRate > 80 ? 'green' : 'yellow');
    
    // 保存详细报告
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            total: results.passed + results.failed + results.warnings,
            passed: results.passed,
            failed: results.failed,
            warnings: results.warnings,
            successRate: parseFloat(successRate)
        },
        tests: results.tests
    };
    
    fs.writeFileSync(
        path.join(__dirname, 'test-report.json'),
        JSON.stringify(report, null, 2)
    );
    
    log('\n详细报告已保存到: test-report.json', 'cyan');
    
    log('\n==========================================\n', 'cyan');
    
    // 退出代码
    process.exit(results.failed > 0 ? 1 : 0);
}

// 运行测试
runTests().catch(err => {
    log(`\n错误: ${err.message}`, 'red');
    process.exit(1);
});
