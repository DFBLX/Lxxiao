const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');
const { requestHandler } = require('../app');

async function makeRequest(server, { method, path, body, headers = {} }) {
  const address = server.address();
  const payload = body ? JSON.stringify(body) : null;

  const options = {
    hostname: '127.0.0.1',
    port: address.port,
    path,
    method,
    headers: {
      ...(payload ? { 'Content-Type': 'application/json' } : {}),
      ...headers
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        const contentType = res.headers['content-type'] || '';

        resolve({
          statusCode: res.statusCode,
          contentType,
          body: contentType.includes('application/json') && raw ? JSON.parse(raw) : raw
        });
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

test('serves web app on /', async () => {
  const server = http.createServer(requestHandler);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');

  try {
    const homeRes = await makeRequest(server, {
      method: 'GET',
      path: '/'
    });

    assert.equal(homeRes.statusCode, 200);
    assert.match(homeRes.contentType, /text\/html/);
    assert.match(homeRes.body, /在线音乐播放器/);
  } finally {
    server.close();
  }
});

test('JWT login flow works', async () => {
  const server = http.createServer(requestHandler);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');

  try {
    const loginRes = await makeRequest(server, {
      method: 'POST',
      path: '/login',
      body: { username: 'admin', password: '123456' }
    });

    assert.equal(loginRes.statusCode, 200);
    assert.ok(loginRes.body.token);

    const profileRes = await makeRequest(server, {
      method: 'GET',
      path: '/profile',
      headers: { Authorization: `Bearer ${loginRes.body.token}` }
    });

    assert.equal(profileRes.statusCode, 200);
    assert.equal(profileRes.body.user.username, 'admin');
  } finally {
    server.close();
  }
});

test('rejects invalid credentials', async () => {
  const server = http.createServer(requestHandler);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');

  try {
    const loginRes = await makeRequest(server, {
      method: 'POST',
      path: '/login',
      body: { username: 'admin', password: 'wrong' }
    });

    assert.equal(loginRes.statusCode, 401);
  } finally {
    server.close();
  }
});
