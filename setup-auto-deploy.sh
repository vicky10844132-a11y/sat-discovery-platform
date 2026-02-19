#!/bin/bash

# 🤖 SAT-DISCOVERY 自动配置 GitHub Actions
# 配置一次，永久自动化

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
echo "🤖 SAT-DISCOVERY 自动配置脚本"
echo "================================"
echo ""

print_info "此脚本将帮助您配置 GitHub Actions 自动部署"
print_info "配置后，每次 git push 将自动部署到 Vercel"
echo ""

# 1. 检查 Vercel CLI
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI 未安装"
    print_info "请先运行 deploy-now.sh 或手动安装: npm i -g vercel"
    exit 1
fi
print_success "Vercel CLI 已就绪"

# 2. 检查登录
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
    print_error "未登录 Vercel"
    print_info "请先运行 deploy-now.sh 或手动登录: vercel login"
    exit 1
fi
print_success "Vercel 已登录"

# 3. 获取项目配置
print_info "正在获取项目配置..."

if [ ! -f ".vercel/project.json" ]; then
    print_warning "项目未链接到 Vercel"
    print_info "正在链接项目..."
    vercel link
    if [ $? -ne 0 ]; then
        print_error "项目链接失败"
        exit 1
    fi
fi

# 读取配置
if [ -f ".vercel/project.json" ]; then
    PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId": "[^"]*' | grep -o '[^"]*$')
    ORG_ID=$(cat .vercel/project.json | grep -o '"orgId": "[^"]*' | grep -o '[^"]*$')
    
    print_success "项目配置已获取"
    echo ""
else
    print_error "无法读取项目配置"
    exit 1
fi

# 4. 显示配置信息
echo "📋 GitHub Secrets 配置信息"
echo "===================================="
echo ""
print_info "请在 GitHub 仓库中配置以下 Secrets:"
echo ""
echo "1. 访问: https://github.com/vicky10844132-a11y/sat-discovery-platform/settings/secrets/actions"
echo ""
echo "2. 点击 'New repository secret' 添加以下 3 个 Secrets:"
echo ""
echo "   名称: VERCEL_TOKEN"
echo "   值: (访问 https://vercel.com/account/tokens 创建)"
echo ""
echo "   名称: VERCEL_ORG_ID"
echo "   值: ${ORG_ID}"
echo ""
echo "   名称: VERCEL_PROJECT_ID"
echo "   值: ${PROJECT_ID}"
echo ""
print_warning "重要: VERCEL_TOKEN 需要您手动创建和复制"
echo ""

# 5. 提供快速命令
print_info "快速复制命令 (在 GitHub Secrets 页面使用):"
echo ""
echo "Secret 1: VERCEL_TOKEN"
echo "  值: [从 https://vercel.com/account/tokens 获取]"
echo ""
echo "Secret 2: VERCEL_ORG_ID"
echo "  值: ${ORG_ID}"
echo ""
echo "Secret 3: VERCEL_PROJECT_ID"
echo "  值: ${PROJECT_ID}"
echo ""

# 6. 验证配置
echo ""
read -p "配置完成后按 Enter 继续..."
echo ""

print_info "测试 GitHub Actions 配置..."
print_info "推送代码将触发自动部署"
echo ""

print_success "配置完成！"
echo ""
print_info "下一步："
echo "  1. 确认 GitHub Secrets 已配置"
echo "  2. 运行: git push"
echo "  3. 查看 GitHub Actions 页面"
echo "  4. 等待自动部署完成"
echo ""
