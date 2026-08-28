export default function handler(req, res) {
  res.status(200).json({
    name: 'Vercel Proxy API',
    version: '1.0.0',
    status: 'online',
    usage: {
      endpoint: '/api/proxy/[...path]?url=https://example.com',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      examples: {
        get: '/api/proxy/test?url=https://api.example.com/data',
        post: '/api/proxy/test?url=https://api.example.com/data',
      },
      notes: [
        'Include the target URL as the "url" query parameter',
        'The [...]path part can be anything - it\'s just for routing',
        'All request headers and body will be forwarded',
        'CORS headers are enabled for all responses'
      ]
    },
    test: {
      'jsonplaceholder': '/api/proxy/test?url=https://jsonplaceholder.typicode.com/posts/1',
      'github': '/api/proxy/test?url=https://api.github.com/users/vercel',
      'httpbin': '/api/proxy/test?url=https://httpbin.org/get'
    }
  });
}