# DNS配置清单 - tradecalc.xyz

## 🎯 当前状态
- ✅ Vercel项目已部署
- ✅ 域名已添加到Vercel
- ⏳ 需要配置DNS记录

## 📋 必需的DNS记录

### A记录配置
```
类型: A
名称: @ (或 tradecalc.xyz)
值: 76.76.21.21
TTL: 300
```

### WWW子域名（推荐）
```
类型: A
名称: www
值: 76.76.21.21
TTL: 300
```

## 🔧 各大域名注册商设置指南

### Namecheap
1. 登录 Namecheap → Domain List
2. 点击域名旁的 "Manage"
3. Advanced DNS → Add New Record
4. 选择 "A Record"，Host填写"@"，Value填写"76.76.21.21"

### GoDaddy
1. 登录 GoDaddy → My Products → Domains
2. 点击域名旁的 "DNS"
3. 添加记录 → 类型选择"A"，名称填写"@"，值填写"76.76.21.21"

### 阿里云
1. 登录阿里云 → 域名控制台
2. 点击域名后的 "解析"
3. 添加记录 → 记录类型选择"A"，主机记录填写"@"，记录值填写"76.76.21.21"

### 腾讯云
1. 登录腾讯云 → 域名注册控制台
2. 点击域名后的 "解析"
3. 添加记录 → 记录类型选择"A"，主机记录填写"@"，记录值填写"76.76.21.21"

### Cloudflare
1. 登录 Cloudflare → 选择域名
2. DNS → Add record
3. Type选择"A"，Name填写"@"，IPv4 address填写"76.76.21.21"

## ✅ 验证步骤

### 1. 命令行验证
```bash
# 检查A记录
dig tradecalc.xyz A

# 检查www记录
dig www.tradecalc.xyz A

# 或使用nslookup
nslookup tradecalc.xyz
nslookup www.tradecalc.xyz
```

### 2. 在线工具验证
- https://dnschecker.org/
- https://www.whatsmydns.net/

### 3. 预期结果
- `tradecalc.xyz` 解析到 `76.76.21.21`
- `www.tradecalc.xyz` 解析到 `76.76.21.21`

## ⏰ 时间线

| 时间 | 状态 | 说明 |
|------|------|------|
| 0-5分钟 | 配置DNS | 在域名注册商处添加记录 |
| 5-30分钟 | 传播中 | DNS记录开始全球传播 |
| 30分钟-2小时 | 大部分生效 | 大部分地区可以访问 |
| 2-48小时 | 完全生效 | 全球所有地区都可访问 |

## 🚀 完成后的访问地址

配置完成后，你可以通过以下地址访问：
- https://tradecalc.xyz
- https://www.tradecalc.xyz
- https://stockcalc-q57orbhan-yuan-wangs-projects-e294e3fc.vercel.app (备用)

## 🔍 故障排除

### 如果域名不工作：
1. **检查DNS记录是否正确**
   - 确保A记录指向 `76.76.21.21`
   - 确保没有CNAME冲突

2. **检查DNS传播**
   - 使用 https://dnschecker.org/ 检查全球传播状态

3. **清除DNS缓存**
   ```bash
   # macOS
   sudo dscacheutil -flushcache

   # Windows
   ipconfig /flushdns
   ```

4. **联系支持**
   - Vercel支持：https://vercel.com/help
   - 域名注册商客服

## 📞 需要帮助？

如果遇到问题，请提供：
- 域名注册商名称
- DNS配置截图
- 错误信息

现在就去配置DNS记录吧！🚀
