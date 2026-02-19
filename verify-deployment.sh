#!/bin/bash

# ✅ SAT-DISCOVERY 部署验证脚本
# 自动验证部署是否成功

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo ""
echo "🔍 SAT-DISCOVERY 部署验证"
echo "================================"
echo ""

SITE_URL="https://www.sat-index.online"
VERSION_URL="${SITE_URL}/DEPLOYMENT_VERSION.txt"

# 1. 检查验证文件
print_info "检查部署验证文件..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$VERSION_URL")

if [ "$response" = "200" ]; then
    print_success "验证文件可访问"
    
    # 获取内容
    content=$(curl -s "$VERSION_URL")
    echo ""
    echo "📄 部署信息："
    echo "$content"
    echo ""
    
    # 检查分支
    if echo "$content" | grep -q "copilot/create-sat-discovery-foundation"; then
        print_success "部署分支正确"
    else
        print_warning "部署分支可能不正确"
    fi
else
    print_error "验证文件无法访问 (HTTP $response)"
    print_warning "可能原因："
    echo "  1. 部署到了错误的分支"
    echo "  2. DNS 还在传播中"
    echo "  3. CDN 缓存问题"
fi

# 2. 检查主页
print_info "检查网站主页..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")

if [ "$response" = "200" ]; then
    print_success "主页可访问"
    
    # 检查响应时间
    response_time=$(curl -s -o /dev/null -w "%{time_total}" "$SITE_URL")
    print_info "响应时间: ${response_time}s"
else
    print_error "主页无法访问 (HTTP $response)"
fi

# 3. 检查内容
print_info "检查页面内容..."
page_content=$(curl -s "$SITE_URL")

if echo "$page_content" | grep -q "Safe Content"; then
    print_error "检测到 'Safe Content' 错误"
    print_warning "网站可能部署到了错误的分支"
    print_info "解决方法:"
    echo "  1. 运行 ./deploy-now.sh"
    echo "  2. 或运行 npx vercel --prod"
elif echo "$page_content" | grep -q "SAT-"; then
    print_success "页面内容正常"
else
    print_warning "页面内容可能有问题"
fi

# 4. 总结
echo ""
echo "📊 验证总结"
echo "================================"
echo ""

if [ "$response" = "200" ] && ! echo "$page_content" | grep -q "Safe Content"; then
    print_success "部署验证成功！"
    echo ""
    print_info "访问您的网站："
    echo "  🌐 ${SITE_URL}"
    echo ""
    print_info "如果看到旧内容，请清除缓存："
    echo "  💡 Ctrl + Shift + R (Windows/Linux)"
    echo "  💡 Cmd + Shift + R (Mac)"
    echo ""
else
    print_warning "部署可能有问题"
    echo ""
    print_info "建议操作："
    echo "  1. 运行 ./deploy-now.sh 重新部署"
    echo "  2. 清除浏览器缓存"
    echo "  3. 等待 CDN 缓存更新（1-5分钟）"
    echo "  4. 查看文档: DEPLOYMENT_DIAGNOSIS.md"
    echo ""
fi
