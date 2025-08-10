// Netlify无服务器函数 - API代理
// 文件路径: /netlify/functions/quote.js

exports.handler = async (event, context) => {
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // 处理预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const { symbol, token } = event.queryStringParameters || {};

  if (!token) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'API token required' })
    };
  }

  if (!symbol) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Stock symbol required' })
    };
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
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Invalid symbol or no data available' })
      };
    }

    // 返回数据
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('API Proxy Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch stock data', 
        details: error.message 
      })
    };
  }
};

