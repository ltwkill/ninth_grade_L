const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 服务器配置
const PORT = 8080;
const PUBLIC_DIR = path.join(__dirname, '.');

// 支持的文件类型
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain'
};

// 创建服务器
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let filePath = path.join(PUBLIC_DIR, parsedUrl.pathname);

    // 记录请求日志
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${req.headers['user-agent']}`);

    // 如果路径是目录，默认加载index.html
    fs.stat(filePath, (err, stats) => {
        if (err) {
            // 文件不存在
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('404 Not Found');
            console.error(`[${new Date().toISOString()}] 404 Not Found: ${filePath}`);
            return;
        }

        if (stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        // 读取文件并发送响应
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('500 Internal Server Error');
                console.error(`[${new Date().toISOString()}] Server Error: ${err.message}`);
                return;
            }

            // 设置正确的MIME类型
            const ext = path.extname(filePath);
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';

            res.writeHead(200, {'Content-Type': contentType});
            res.end(data);
            console.log(`[${new Date().toISOString()}] 200 OK: ${filePath}`);
        });
    });
});

// 启动服务器
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Serving files from: ${PUBLIC_DIR}`);
    console.log('Press Ctrl+C to stop server');
});

// 处理服务器关闭
process.on('SIGINT', () => {
    console.log('Server is shutting down...');
    server.close(() => {
        console.log('Server stopped');
        process.exit(0);
    });
});