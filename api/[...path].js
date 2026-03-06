export default async function handler(req, res) {
  // Extract path from query
  const { path = [] } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : path;
  
  // Build target URL
  const targetUrl = `https://api.heylika.com${apiPath.startsWith('/') ? '' : '/'}${apiPath}`;
  
  // Build query string
  const queryString = new URLSearchParams(req.url.split('?')[1] || '').toString();
  const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;
  
  console.log('Proxying:', req.method, fullUrl);
  
  try {
    // Forward request to backend
    const response = await fetch(fullUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Lika-MiniApp-Proxy/1.0',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    const data = await response.text();
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    // Handle OPTIONS
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    
    // Return response
    res.setHeader('Content-Type', 'application/json');
    res.status(response.status).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message,
      url: fullUrl 
    });
  }
}
