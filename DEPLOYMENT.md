# 部署指南 / Deployment Guide

## 上线方案对比

| 方案 | 优点 | 缺点 | 成本 | 推荐度 |
|------|------|------|------|--------|
| **GitHub Pages** ✅ | 免费、简单、自动部署 | 仅静态文件，依赖公共代理 | 免费 | ⭐⭐⭐⭐ |
| **Vercel** ✅ | 支持无服务器函数 | 有使用限制 | 免费额度 | ⭐⭐⭐⭐⭐ |
| **Netlify** ✅ | 支持无服务器函数 | 有使用限制 | 免费额度 | ⭐⭐⭐⭐⭐ |
| **云服务器** | 完全控制 | 需要运维 | 付费 | ⭐⭐⭐ |

## 方案1：GitHub Pages（推荐新手）

### 步骤：
1. **创建GitHub仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/stockcalc.git
   git push -u origin main
   ```

2. **启用GitHub Pages**
   - 进入仓库设置 → Pages
   - Source选择"GitHub Actions"
   - 代码推送后自动部署

3. **访问地址**
   ```
   https://你的用户名.github.io/stockcalc/
   ```

### 特点：
- ✅ 完全免费
- ✅ 自动部署
- ✅ 使用公共CORS代理
- ⚠️ 依赖第三方代理服务

## 方案2：Vercel（推荐进阶）

### 步骤：
1. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **创建API函数**
   ```bash
   mkdir api
   ```

3. **部署**
   ```bash
   vercel --prod
   ```

### 特点：
- ✅ 支持无服务器函数
- ✅ 自动HTTPS
- ✅ 全球CDN
- ✅ 更可靠的API代理

## 方案3：Netlify（推荐进阶）

### 步骤：
1. **连接GitHub仓库**
   - 登录Netlify
   - 选择"New site from Git"
   - 连接GitHub仓库

2. **配置构建**
   - Build command: 留空
   - Publish directory: ./

### 特点：
- ✅ 支持无服务器函数
- ✅ 表单处理
- ✅ 身份验证
- ✅ 自动部署

## 当前代码的智能适配

代码已经做了三层fallback：
1. **本地代理**（开发环境）
2. **公共CORS代理**（GitHub Pages）
3. **直接API访问**（备用）

## 推荐部署流程

### 对于初学者：
```bash
# 1. 推送到GitHub
git init
git add .
git commit -m "Stock calculator app"
git remote add origin https://github.com/你的用户名/stockcalc.git
git push -u origin main

# 2. 在GitHub仓库设置中启用Pages
# 3. 等待自动部署完成
```

### 对于进阶用户：
```bash
# 使用Vercel一键部署
vercel --prod
```

## 注意事项

1. **API密钥安全**：前端代码中的API密钥会暴露，建议：
   - 使用Finnhub免费额度
   - 设置API密钥的域名限制
   - 考虑后端代理方案

2. **公共代理限制**：
   - 可能有请求频率限制
   - 服务可用性不保证
   - 建议监控和备用方案

3. **性能优化**：
   - 启用CDN加速
   - 压缩静态资源
   - 缓存策略优化

