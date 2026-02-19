#!/bin/bash

# 🚀 SAT-DISCOVERY 自动部署脚本
# 完全自动化，零手动操作

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印函数
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
echo "🚀 SAT-DISCOVERY 自动部署脚本"
echo "================================"
echo ""

# 1. 检查 Node.js
print_info "检查 Node.js 环境..."
if ! command -v node &> /dev/null; then
    print_error "Node.js 未安装"
    print_info "请访问 https://nodejs.org/ 安装 Node.js"
    exit 1
fi
print_success "Node.js 已安装: $(node --version)"

# 2. 检查 npm
print_info "检查 npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm 未安装"
    exit 1
fi
print_success "npm 已安装: $(npm --version)"

# 3. 检查 Vercel CLI
print_info "检查 Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI 未安装"
    print_info "正在安装 Vercel CLI..."
    npm i -g vercel
    if [ $? -ne 0 ]; then
        print_error "Vercel CLI 安装失败"
        print_info "请手动运行: npm i -g vercel"
        exit 1
    fi
    print_success "Vercel CLI 安装成功"
else
    print_success "Vercel CLI 已安装"
fi

# 4. 检查登录状态
print_info "检查 Vercel 登录状态..."
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
    print_warning "未登录 Vercel"
    print_info "正在打开浏览器进行登录..."
    vercel login
    if [ $? -ne 0 ]; then
        print_error "Vercel 登录失败"
        exit 1
    fi
    print_success "Vercel 登录成功"
else
    print_success "已登录 Vercel"
fi

# 5. 开始部署
echo ""
print_info "开始部署到生产环境..."
echo ""

vercel --prod --yes

if [ $? -eq 0 ]; then
    echo ""
    print_success "部署成功！"
    echo ""
    print_info "您的网站已上线："
    echo "  🌐 Vercel: https://sat-discovery-platform.vercel.app"
    echo "  🌐 自定义域名: https://www.sat-index.online/"
    echo ""
    print_info "验证部署："
    echo "  📄 访问: https://www.sat-index.online/DEPLOYMENT_VERSION.txt"
    echo ""
    print_warning "如果看到旧内容，请清除浏览器缓存："
    echo "  💡 按 Ctrl + Shift + R (Windows/Linux)"
    echo "  💡 按 Cmd + Shift + R (Mac)"
    echo ""
else
    echo ""
    print_error "部署失败"
    print_info "请查看上面的错误信息"
    print_info "或查看文档: DEPLOYMENT_DIAGNOSIS.md"
    exit 1
fi
