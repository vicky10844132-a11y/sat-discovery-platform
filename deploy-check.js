#!/usr/bin/env node

/**
 * SAT-DISCOVERY Platform - 部署前验证脚本
 * 检查所有必要的文件和配置是否就绪
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 SAT-DISCOVERY 部署前验证\n');

let errors = 0;
let warnings = 0;
let passed = 0;

// 检查函数
function check(name, condition, errorMsg, isWarning = false) {
  process.stdout.write(`${name}... `);
  if (condition) {
    console.log('✅ 通过');
    passed++;
  } else {
    if (isWarning) {
      console.log('⚠️  警告: ' + errorMsg);
      warnings++;
    } else {
      console.log('❌ 失败: ' + errorMsg);
      errors++;
    }
  }
}

// 检查文件是否存在
function fileExists(filepath) {
  return fs.existsSync(path.join(__dirname, filepath));
}

// 检查文件大小
function fileSize(filepath) {
  try {
    const stats = fs.statSync(path.join(__dirname, filepath));
    return stats.size;
  } catch {
    return 0;
  }
}

console.log('📄 核心HTML页面检查:');
check('index.html', fileExists('index.html'), 'index.html 文件缺失');
check('data_sources.html', fileExists('data_sources.html'), 'data_sources.html 文件缺失');
check('algorithms.html', fileExists('algorithms.html'), 'algorithms.html 文件缺失');
check('login.html', fileExists('login.html'), 'login.html 文件缺失');
check('history.html', fileExists('history.html'), 'history.html 文件缺失');

console.log('\n🎨 CSS样式文件检查:');
check('cyber-theme.css', fileExists('css/cyber-theme.css'), 'cyber-theme.css 文件缺失');
check('theme.css', fileExists('css/theme.css'), 'theme.css 文件缺失', true);
check('layout.css', fileExists('css/layout.css'), 'layout.css 文件缺失', true);
check('components.css', fileExists('css/components.css'), 'components.css 文件缺失', true);

console.log('\n📊 数据文件检查:');
check('data_sources_catalog.json', fileExists('data_sources_catalog.json'), '数据源目录缺失');
check('algorithms_catalog.json', fileExists('algorithms_catalog.json'), '算法目录缺失');
check('satellites.json', fileExists('satellites.json'), '卫星数据缺失', true);

console.log('\n⚙️  配置文件检查:');
check('vercel.json', fileExists('vercel.json'), 'vercel.json 配置文件缺失');
check('.gitignore', fileExists('.gitignore'), '.gitignore 文件缺失');
check('robots.txt', fileExists('robots.txt'), 'robots.txt 文件缺失', true);
check('sitemap.xml', fileExists('sitemap.xml'), 'sitemap.xml 文件缺失', true);

console.log('\n📖 文档文件检查:');
check('README.md', fileExists('README.md'), 'README.md 文件缺失');
check('DEPLOYMENT_GUIDE.md', fileExists('DEPLOYMENT_GUIDE.md'), '部署指南缺失', true);

console.log('\n🔒 安全检查:');
// 检查是否有敏感信息
const sensitiveFiles = ['.env', '.env.local', 'config.json', 'secrets.json'];
let hasSensitive = false;
sensitiveFiles.forEach(file => {
  if (fileExists(file)) {
    hasSensitive = true;
    console.log(`⚠️  警告: 发现敏感文件 ${file}，请确保已添加到 .gitignore`);
    warnings++;
  }
});
if (!hasSensitive) {
  console.log('✅ 未发现敏感文件');
  passed++;
}

console.log('\n📦 文件大小检查:');
const maxSize = 5 * 1024 * 1024; // 5MB
const largeFiles = [
  'index.html',
  'data_sources.html',
  'algorithms.html',
  'css/cyber-theme.css'
];

let oversized = false;
largeFiles.forEach(file => {
  const size = fileSize(file);
  if (size > maxSize) {
    console.log(`⚠️  警告: ${file} 文件较大 (${(size / 1024 / 1024).toFixed(2)}MB)`);
    warnings++;
    oversized = true;
  }
});
if (!oversized) {
  console.log('✅ 文件大小合理');
  passed++;
}

// 验证HTML语法（简单检查）
console.log('\n🔍 HTML语法检查:');
function validateHTML(filepath) {
  try {
    const content = fs.readFileSync(path.join(__dirname, filepath), 'utf8');
    // 检查基本的HTML结构
    const hasDoctype = content.includes('<!DOCTYPE html>') || content.includes('<!doctype html>');
    const hasHtml = content.includes('<html');
    const hasHead = content.includes('<head>');
    const hasBody = content.includes('<body>');
    const closingHtml = content.includes('</html>');
    
    return hasDoctype && hasHtml && hasHead && hasBody && closingHtml;
  } catch {
    return false;
  }
}

check('index.html 结构', validateHTML('index.html'), 'HTML结构不完整');
check('data_sources.html 结构', validateHTML('data_sources.html'), 'HTML结构不完整', true);
check('algorithms.html 结构', validateHTML('algorithms.html'), 'HTML结构不完整', true);

// 验证JSON文件
console.log('\n📋 JSON文件验证:');
function validateJSON(filepath) {
  try {
    const content = fs.readFileSync(path.join(__dirname, filepath), 'utf8');
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}

check('data_sources_catalog.json', validateJSON('data_sources_catalog.json'), 'JSON格式错误');
check('algorithms_catalog.json', validateJSON('algorithms_catalog.json'), 'JSON格式错误');
check('vercel.json', validateJSON('vercel.json'), 'vercel.json 格式错误');

// 最终报告
console.log('\n' + '='.repeat(50));
console.log('📊 验证结果汇总:');
console.log(`✅ 通过: ${passed}`);
console.log(`⚠️  警告: ${warnings}`);
console.log(`❌ 错误: ${errors}`);
console.log('='.repeat(50));

if (errors > 0) {
  console.log('\n❌ 部署验证失败！请修复上述错误后再部署。');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n⚠️  部署验证通过，但有警告。建议修复后部署。');
  console.log('✅ 可以继续部署，但建议先处理警告。');
  process.exit(0);
} else {
  console.log('\n✅ 所有检查通过！可以安全部署。');
  console.log('\n🚀 部署命令:');
  console.log('  vercel --prod           # Vercel部署');
  console.log('  netlify deploy --prod   # Netlify部署');
  console.log('\n或访问:');
  console.log('  https://vercel.com      # Vercel Web界面');
  console.log('  https://netlify.com     # Netlify Web界面');
  process.exit(0);
}
