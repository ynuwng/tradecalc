# Stock Calculator — P/L, Risk & Day Trading Guardrails

一个前端股票计算器，支持实时股价获取、风险管理和盈亏计算。

## 功能特性

- 📊 实时股价图表
- 💰 盈亏计算（P/L）
- 🎯 止损/止盈价格计算
- ⚠️ PDT（Pattern Day Trader）风险提醒
- 📱 响应式设计

## 使用方法

### 方案1：仅使用Demo模式
直接打开 `index.html` 文件，选择"Demo (simulated)"模式。

### 方案2：使用真实API数据（推荐）

#### 步骤1：安装依赖
```bash
npm install
```

#### 步骤2：启动代理服务器
```bash
npm start
```

#### 步骤3：访问应用
打开浏览器访问 `http://localhost:3000`

#### 步骤4：配置API
1. 在 [Finnhub.io](https://finnhub.io) 注册账户获取免费API密钥
2. 在应用中选择"Finnhub.io (REST poll)"
3. 输入你的API密钥
4. 点击"Connect"

## CORS问题解决

### 为什么会有CORS问题？
CORS（跨域资源共享）是浏览器的安全机制，阻止网页直接访问第三方API。

### 解决方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **后端代理** ✅ | 完美解决，生产可用 | 需要服务器 | 推荐方案 |
| **浏览器扩展** | 简单快速 | 仅本地有效 | 开发测试 |
| **Demo模式** | 无需配置 | 模拟数据 | 功能演示 |

### 部署到生产环境

即使上线后，CORS问题依然存在。需要：

1. **使用后端代理**：将代理服务器部署到云服务器
2. **或使用无服务器函数**：如Vercel Functions、Netlify Functions
3. **或购买支持CORS的API服务**

## 临时解决方案（仅开发用）

安装CORS浏览器扩展：
- Chrome: "CORS Unblock" 或 "Disable CORS"
- Firefox: "CORS Everywhere"

⚠️ **注意**：这些扩展仅在本地开发时使用，不能解决生产环境问题。

## 文件结构

```
stockcalc/
├── index.html          # 主应用文件
├── proxy-server.js     # Node.js代理服务器
├── package.json        # 项目配置
└── README.md          # 说明文档
```

## API配置

支持的股票代码格式：
- 美股：AAPL, TSLA, GOOGL
- 其他市场：请参考Finnhub文档

## 免责声明

此工具仅供教育和演示用途。实际交易前请验证所有计算结果。计算结果不包含税费。
