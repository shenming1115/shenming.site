// 简单的静态文件服务器用于测试
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// SQL注入防护中间件（仅示例，实际生产建议使用ORM/参数化查询）
function sqlInjectionSanitizer(req, res, next) {
  // 仅对 POST/GET 参数做简单过滤
  function sanitize(obj) {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // 常见SQL注入关键字和符号
        obj[key] = obj[key]
          .replace(/('|--|;|\/\*|\*\/|xp_|exec|union|select|insert|update|delete|drop|alter|create|truncate|information_schema|sleep|benchmark|or\s+1=1|and\s+1=1)/gi, '')
          .replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, ''); // 过滤特殊字符
      }
    }
  }
  if (req.method === 'POST' && req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const json = JSON.parse(body);
        sanitize(json);
        req.body = json;
        next();
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    // GET参数
    const url = require('url');
    const query = url.parse(req.url, true).query;
    sanitize(query);
    req.query = query;
    next();
  }
}

const server = http.createServer((req, res) => {
  // Generate a nonce for each request
  const nonce = crypto.randomBytes(16).toString('base64');

  // Define security headers
  const securityHeaders = {
    // Content Security Policy (CSP)
    'Content-Security-Policy': [
      `default-src 'self'`,
      `script-src 'self' https://challenges.cloudflare.com 'nonce-${nonce}' 'unsafe-inline'`, // 'unsafe-inline' is a fallback
      `style-src 'self' 'unsafe-inline'`, // Allow inline styles
      `img-src 'self' data: https://upload.wikimedia.org`,
      `font-src 'self'`,
      `connect-src 'self' https://timeapi.io https://api.myip.com https://cloudflare.com https://api64.ipify.org https://ipapi.co https://ipinfo.io`,
      `frame-src 'self' https://challenges.cloudflare.com`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer'
  };

  // SQL注入防护
  sqlInjectionSanitizer(req, res, () => {
    let filePath = '.' + req.url;
    if (filePath === './') {
      filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.wav': 'audio/wav',
      '.mp3': 'audio/mpeg',
      '.mp4': 'video/mp4',
      '.woff': 'application/font-woff',
      '.ttf': 'application/font-ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'application/font-otf',
      '.wasm': 'application/wasm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('404 Not Found', 'utf-8');
        } else {
          res.writeHead(500);
          res.end('Server Error: ' + error.code, 'utf-8');
        }
      } else {
        // Apply security headers to HTML responses
        if (contentType === 'text/html') {
          Object.entries(securityHeaders).forEach(([key, value]) => {
            res.setHeader(key, value);
          });
          // Inject nonce into the HTML
          content = content.toString().replace(/<script nonce="[^"]*">/g, `<script nonce="${nonce}">`);
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
