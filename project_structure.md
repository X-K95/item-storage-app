# 物品收纳助手APP项目结构

```
item-storage-app/
├── frontend/                 # 前端代码
│   ├── item_storage_app.js  # 主应用文件
│   ├── package.json        # 前端依赖配置
│   └── assets/             # 静态资源
│       ├── images/         # 图片资源
│       └── fonts/          # 字体资源
│
├── backend/                 # 后端代码
│   ├── server.js           # 服务器文件
│   ├── package.json        # 后端依赖配置
│   └── data/               # 数据库数据
│
├── docs/                   # 文档
│   ├── README.md           # 项目说明文档
│   └── API.md             # API文档
│
├── scripts/                # 脚本文件
│   ├── install.sh         # 安装脚本
│   └── start.sh           # 启动脚本
│
└── LICENSE                 # 许可证文件
```

## 项目文件说明

### 前端文件

**item_storage_app.js**
- React Native应用主文件
- 包含物品管理、搜索、语音播报等核心功能
- 使用Expo框架开发

**package.json**
- 前端依赖配置
- 包含React Native、Expo、Audio API等依赖

### 后端文件

**server.js**
- Node.js服务器文件
- 使用Express框架
- 连接MongoDB数据库
- 提供RESTful API接口

**package.json**
- 后端依赖配置
- 包含Express、Mongoose、CORS等依赖

### 脚本文件

**install.sh**
- 自动化安装脚本
- 检查系统环境
- 安装依赖
- 启动服务

### 文档文件

**README.md**
- 项目说明文档
- 包含功能介绍、安装步骤、使用说明等

**API.md**
- API接口文档
- 包含接口地址、参数、返回值等

## 技术栈

### 前端
- React Native 0.64.3
- Expo 44.0.0
- JavaScript/TypeScript

### 后端
- Node.js 14.0+
- Express 4.17.1
- MongoDB 4.4+
- Mongoose 6.0.12

### 工具
- Git 版本控制
- npm 包管理
- Expo CLI 开发工具

## 部署说明

### 开发环境
1. 安装Node.js 14.0+
2. 安装MongoDB 4.4+
3. 安装Expo CLI
4. 克隆项目
5. 运行install.sh脚本

### 生产环境
1. 使用Docker容器化部署
2. 配置Nginx反向代理
3. 配置SSL证书
4. 配置负载均衡

## 维护说明

### 数据库备份
```bash
mongodump --db itemStorage --out ./backup
```

### 日志查看
```bash
# 前端日志
npm run logs:frontend

# 后端日志
npm run logs:backend
```

### 性能监控
- 使用New Relic监控应用性能
- 使用MongoDB Atlas监控数据库
- 使用Sentry监控错误

## 安全说明

### 数据加密
- 使用HTTPS加密传输
- 使用bcrypt加密用户密码
- 使用JWT进行身份验证

### 权限控制
- 基于角色的访问控制
- API接口限流
- 输入数据验证

## 扩展说明

### 新功能开发
1. 创建新的React Native组件
2. 添加新的API接口
3. 更新数据库模型
4. 编写测试用例

### 第三方集成
- 集成智能家居平台
- 集成语音识别服务
- 集成图像识别服务
- 集成云存储服务