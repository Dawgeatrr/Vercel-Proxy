export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get the target URL from query parameters
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ 
        error: 'Missing URL parameter. Usage: ?url=https://example.com' 
      });
    }

    // Validate URL
    let targetUrl;
    try {
      targetUrl = new URL(url);
      if (!['http:', 'https:'].includes(targetUrl.protocol)) {
        throw new Error('Only HTTP/HTTPS protocols are allowed');
      }
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL provided' });
    }

    // Prepare fetch options
    const fetchOptions = {
      method: req.method,
      headers: {
        'User-Agent': 'Vercel-Proxy/1.0',
        'Accept': req.headers.accept || '*/*',
      },
    };

    // Forward relevant headers
    const forwardHeaders = ['content-type', 'authorization', 'x-api-key', 'x-forwarded-for'];
    forwardHeaders.forEach(header => {
      if (req.headers[header]) {
        fetchOptions.headers[header] = req.headers[header];
      }
    });

    // Handle request body for non-GET requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const contentType = req.headers['content-type'] || '';
      
      if (contentType.includes('application/json')) {
        fetchOptions.body = JSON.stringify(req.body);
        fetchOptions.headers['Content-Type'] = 'application/json';
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        fetchOptions.body = new URLSearchParams(req.body).toString();
        fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else if (contentType.includes('multipart/form-data')) {
        if (req.body && typeof req.body === 'object') {
          const formData = new FormData();
          Object.keys(req.body).forEach(key => {
            formData.append(key, req.body[key]);
          });
          fetchOptions.body = formData;
        }
      } else if (req.body) {
        fetchOptions.body = req.body;
      }
    }

    // Make the request
    const response = await fetch(targetUrl.toString(), fetchOptions);

    // Get response data
    const contentType = response.headers.get('content-type') || '';
    let data;
    
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else if (contentType.includes('text/')) {
      data = await response.text();
    } else {
      const buffer = await response.arrayBuffer();
      data = Buffer.from(buffer);
    }

    // Forward response status
    res.status(response.status);

    // Forward response headers
    const skipHeaders = ['connection', 'content-encoding', 'content-length', 'transfer-encoding'];
    response.headers.forEach((value, key) => {
      if (!skipHeaders.includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    // Send response
    if (contentType.includes('application/json')) {
      res.json(data);
    } else if (contentType.includes('text/')) {
      res.send(data);
    } else {
      res.send(data);
    }

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy request failed', 
      details: error.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};