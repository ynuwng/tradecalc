// Vercel无服务器函数 - API代理
// 文件路径: /api/quote.js

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol, token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'API token required' });
  }

  if (!symbol) {
    return res.status(400).json({ error: 'Stock symbol required' });
  }

  try {
    // 调用Finnhub API
    const finnhubUrl = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(token)}`;
    
    const response = await fetch(finnhubUrl, {
      method: 'GET',
      headers: {
        'X-Finnhub-Token': token
      }
    });

    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // 验证数据
    if (!data.c && !data.pc) {
      return res.status(404).json({ error: 'Invalid symbol or no data available' });
    }

    // 返回数据
    res.status(200).json(data);

  } catch (error) {
    console.error('API Proxy Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stock data', 
      details: error.message 
    });
  }
}

