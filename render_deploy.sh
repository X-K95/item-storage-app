#!/bin/bash

# Render一键部署脚本

echo "====================================="
echo "物品收纳助手APP Render一键部署脚本"
echo "====================================="

# 检查是否安装了curl
if ! command -v curl &> /dev/null; then
    echo "错误：未找到curl，请先安装curl"
    exit 1
fi

# 检查是否安装了git
if ! command -v git &> /dev/null; then
    echo "错误：未找到git，请先安装git"
    exit 1
fi

# 检查是否安装了node
if ! command -v node &> /dev/null; then
    echo "错误：未找到node，请先安装node"
    exit 1
fi

# 克隆项目
echo "克隆项目..."
git clone https://github.com/your-repo/item-storage-app.git
cd item-storage-app

# 初始化Git仓库
echo "初始化Git仓库..."
git init
git add .
git commit -m "initial commit"

# 部署到Render
echo "部署到Render..."
curl -s https://render.com/deploy?repo=https://github.com/your-repo/item-storage-app | bash

echo "====================================="
echo "部署完成！"
echo "====================================="
echo "访问地址：https://item-storage-app.onrender.com"
echo "API地址：https://item-storage-backend.onrender.com/api"
echo "====================================="