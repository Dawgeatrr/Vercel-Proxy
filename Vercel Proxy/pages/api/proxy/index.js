export default function handler(req, res) {
  res.status(200).json({
    name: 'Vercel Proxy API',
    version: '1.0.0',
    usage: {
      endpoint: '/api/proxy/[...path]?url=https://example.com',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      examples: {
        get: '/api/proxy/[...path]?url=https://api.example.com/data',
        post: '/api/proxy/[...path]?url=https://api.example.com/data',
      },
      notes: [
        'Include the target URL as the "url" query parameter',
        'The [...]path part can be anything - it\'s just for routing',
        'All request headers and body will be forwarded',
        'CORS headers are enabled for all responses'
      ]
    }
  });
}