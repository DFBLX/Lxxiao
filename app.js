const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key';
const TOKEN_EXPIRES_SECONDS = 60 * 60;
const PUBLIC_DIR = path.join(__dirname, 'public');

const DEMO_USER = {
  id: 1,
  username: 'admin',
  password: '123456',
  role: 'admin'
};

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(input) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, 'base64').toString('utf8');
}

function createJWT(payload, secret, expiresInSeconds) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(fullPayload));
  const data = `${headerEncoded}.${payloadEncoded}`;

  const signature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${data}.${signature}`;
}

function verifyJWT(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('invalid token format');
  }

  const [headerEncoded, payloadEncoded, signature] = parts;
  const data = `${headerEncoded}.${payloadEncoded}`;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expectedSignature) {
    throw new Error('invalid signature');
  }

  const payload = JSON.parse(base64UrlDecode(payloadEncoded));
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp < now) {
    throw new Error('token expired');
  }

  return payload;
}

function jsonResponse(res, statusCode, body) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function serveStatic(req, res) {
  const urlPath = req.url === '/' ? '/index.html' : req.url;
  const safePath = path.normalize(urlPath).replace(/^([.][.][/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    return false;
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return false;
  }

  const ext = path.extname(filePath);
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.svg': 'image/svg+xml; charset=utf-8'
  };

  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

async function parseJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) {
    return {};
  }

  return JSON.parse(raw);
}

async function requestHandler(req, res) {
  if (req.method === 'GET' && serveStatic(req, res)) {
    return;
  }

  if (req.method === 'POST' && req.url === '/login') {
    try {
      const { username, password } = await parseJsonBody(req);
      if (username !== DEMO_USER.username || password !== DEMO_USER.password) {
        return jsonResponse(res, 401, { message: '用户名或密码错误' });
      }

      const token = createJWT(
        {
          sub: DEMO_USER.id,
          username: DEMO_USER.username,
          role: DEMO_USER.role
        },
        JWT_SECRET,
        TOKEN_EXPIRES_SECONDS
      );

      return jsonResponse(res, 200, {
        message: '登录成功',
        token,
        tokenType: 'Bearer',
        expiresIn: `${TOKEN_EXPIRES_SECONDS}s`
      });
    } catch {
      return jsonResponse(res, 400, { message: '请求体必须是合法 JSON' });
    }
  }

  if (req.method === 'GET' && req.url === '/profile') {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return jsonResponse(res, 401, { message: '缺少或无效的 Authorization Header' });
    }

    try {
      const token = authHeader.slice('Bearer '.length);
      const payload = verifyJWT(token, JWT_SECRET);
      return jsonResponse(res, 200, {
        message: '受保护资源访问成功',
        user: payload
      });
    } catch {
      return jsonResponse(res, 401, { message: 'Token 无效或已过期' });
    }
  }

  return jsonResponse(res, 404, { message: 'Not Found' });
}

module.exports = {
  requestHandler,
  createJWT,
  verifyJWT
};
