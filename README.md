# TradeCalc 📊

Professional stock calculator with real-time quotes, risk management, and P/L analysis. Built with vanilla JS and deployed on Vercel.

🌐 **Live Demo**: https://tradecalc.xyz

## 功能特性

- 📊 实时股价图表
- 💰 盈亏计算（P/L）
- 🎯 止损/止盈价格计算
- ⚠️ PDT（Pattern Day Trader）风险提醒
- 📱 响应式设计
- 🚀 无服务器函数支持
- ⚡ 极速加载优化

## 快速开始

### 在线使用（推荐）
直接访问 **https://tradecalc.xyz** 即可使用完整功能。

### 本地开发

#### 方案1：仅使用Demo模式
直接打开 `index.html` 文件，选择"Demo (simulated)"模式。

#### 方案2：使用真实API数据
```bash
# 安装依赖
npm install

# 启动代理服务器
npm start

# 访问 http://localhost:3000
```

#### API配置
1. 在 [Finnhub.io](https://finnhub.io) 注册获取免费API密钥
2. 选择"Finnhub.io (REST poll)"
3. 输入API密钥并点击"Connect"

## 技术栈

- **前端**: Vanilla JavaScript, Chart.js, CSS3
- **后端**: Vercel Serverless Functions
- **API**: Finnhub.io
- **部署**: Vercel
- **监控**: Vercel Analytics & Speed Insights

## 文件结构

```
tradecalc/
├── index.html              # 主应用文件
├── api/quote.js            # Vercel无服务器函数
├── proxy-server.js         # 本地开发代理
├── package.json            # 项目配置
├── vercel.json             # Vercel部署配置
└── README.md              # 说明文档
```

## 部署

### Vercel部署（推荐）
```bash
npm install -g vercel
vercel --prod
```

### 自定义域名
```bash
vercel domains add your-domain.com
```

## API支持

支持的股票代码格式：
- 美股：AAPL, TSLA, GOOGL, NVDA
- 其他市场：请参考Finnhub文档

## 免责声明

此工具仅供教育和演示用途。实际交易前请验证所有计算结果。计算结果不包含税费。

## License

MIT License - 详见 [LICENSE](LICENSE) 文件
