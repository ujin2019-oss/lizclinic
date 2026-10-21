const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.woff2': 'font/woff2' };
http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    res.writeHead(error ? 404 : 200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(error ? 'Not found' : data);
  });
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
