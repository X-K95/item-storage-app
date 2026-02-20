#!/bin/bash

# 物品收纳助手APP一键部署脚本

echo "====================================="
echo "物品收纳助手APP一键部署脚本"
echo "====================================="

# 检查是否以root身份运行
if [ "$EUID" -ne 0 ]; then
    echo "请以root身份运行此脚本"
    exit 1
fi

# 安装必要的软件包
echo "安装必要的软件包..."
apt update
apt install -y nodejs npm mongodb git

# 安装Yarn
npm install -g yarn

# 克隆项目
echo "克隆项目..."
git clone https://github.com/your-repo/item-storage-app.git
cd item-storage-app

# 安装前端依赖
echo "安装前端依赖..."
cd frontend
yarn install

# 安装后端依赖
echo "安装后端依赖..."
cd ../backend
yarn install

# 配置环境变量
echo "配置环境变量..."
echo "MONGODB_URI=mongodb://localhost:27017/itemStorage" > .env
echo "PORT=5000" >> .env

# 启动MongoDB服务
echo "启动MongoDB服务..."
systemctl start mongodb
systemctl enable mongodb

# 启动后端服务器
echo "启动后端服务器..."
pm start &

# 构建前端应用
echo "构建前端应用..."
cd ../frontend
npm run build

# 配置Nginx
echo "配置Nginx..."
apt install -y nginx
cat > /etc/nginx/sites-available/item-storage-app << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/item-storage-app;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/item-storage-app /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
systemctl restart nginx

# 配置防火墙
echo "配置防火墙..."
ufw allow 'Nginx Full'
ufw allow 22
ufw enable

# 安装SSL证书
echo "安装SSL证书..."
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com

# 完成部署
echo "====================================="
echo "物品收纳助手APP部署完成"
echo "====================================="
echo "访问地址：https://your-domain.com"
echo "API地址：https://your-domain.com/api"
echo "====================================="