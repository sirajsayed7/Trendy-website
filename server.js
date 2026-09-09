const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const MIRROR = path.join(ROOT, 'mirror');
const manifest = JSON.parse(fs.readFileSync(path.join(MIRROR, 'manifest.json'), 'utf8'));
const port = Number(process.env.PORT || process.argv[2] || 4187);

function pageFor(url) {
  const exact = manifest.pages[url.pathname + url.search];
  if (exact) return exact;
  const plain = manifest.pages[url.pathname];
  if (plain) return plain;
  if (url.pathname.endsWith('/')) return manifest.pages[url.pathname.slice(0, -1)];
  return manifest.pages[url.pathname + '/'];
}

function sendFile(req, res, filename, type) {
  const stat = fs.statSync(filename);
  const range = req.headers.range;
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Type', type || 'application/octet-stream');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (match) {
      const start = match[1] ? Number(match[1]) : 0;
      const end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
      if (start <= end) {
        res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end - start + 1 });
        fs.createReadStream(filename, { start, end }).pipe(res);
        return;
      }
    }
  }
  res.setHeader('Content-Length', stat.size);
  res.writeHead(200);
  fs.createReadStream(filename).pipe(res);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/') {
    res.writeHead(302, { Location: manifest.defaultRoute });
    res.end();
    return;
  }
  const asset = manifest.assets[url.pathname + url.search] || manifest.assets[url.pathname];
  if (asset) {
    sendFile(req, res, path.join(MIRROR, 'assets', asset.file), asset.type);
    return;
  }
  const page = pageFor(url);
  if (page) {
    sendFile(req, res, path.join(MIRROR, 'pages', page.file), 'text/html; charset=utf-8');
    return;
  }
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(`Not captured: ${url.pathname}${url.search}`);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Trendy local mirror: http://127.0.0.1:${port}/en`);
  console.log(`${Object.keys(manifest.pages).length} pages and ${Object.keys(manifest.assets).length} assets available locally.`);
});
