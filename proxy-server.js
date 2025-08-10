// 简单的Node.js代理服务器
// 运行命令: node proxy-server.js

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

// 允许跨域
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static('.'));

// Finnhub API代理
app.get('/api/quote', async (req, res) => {
  try {
    const { symbol, token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'API token required' });
    }
    
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${token}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`代理服务器运行在 http://localhost:${PORT}`);
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
