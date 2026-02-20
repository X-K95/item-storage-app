#!/bin/bash

# 物品收纳助手APP安装脚本

echo "====================================="
echo "物品收纳助手APP安装脚本"
echo "====================================="

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "错误：未找到Node.js，请先安装Node.js 14.0或更高版本"
    exit 1
fi

# 检查MongoDB是否安装
if ! command -v mongod &> /dev/null; then
    echo "错误：未找到MongoDB，请先安装MongoDB"
    exit 1
fi

# 安装前端依赖
echo "安装前端依赖..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "前端依赖安装失败"
    exit 1
fi

# 安装后端依赖
echo "安装后端依赖..."
cd ../backend
npm install
if [ $? -ne 0 ]; then
    echo "后端依赖安装失败"
    exit 1
fi

# 启动MongoDB
echo "启动MongoDB..."
mongod --dbpath ./data/db &
if [ $? -ne 0 ]; then
    echo "MongoDB启动失败"
    exit 1
fi

# 启动后端服务器
echo "启动后端服务器..."
npm start &
if [ $? -ne 0 ]; then
    echo "后端服务器启动失败"
    exit 1
fi

# 启动前端应用
echo "启动前端应用..."
cd ../frontend
npm start
if [ $? -ne 0 ]; then
    echo "前端应用启动失败"
    exit 1
fi

echo "====================================="
echo "物品收纳助手APP安装完成"
echo "====================================="
echo "访问地址：http://localhost:3000"
echo "API地址：http://localhost:5000"
echo "====================================="