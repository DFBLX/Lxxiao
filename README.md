# JWT 登录 Demo

一个基于 Node.js 内置模块（无第三方依赖）的最小 JWT 登录示例。

## 功能

- `POST /login`：用户名密码登录，返回 JWT
- `GET /profile`：需要 Bearer Token 的受保护接口

## 快速开始

```bash
npm start
```

服务启动后访问：`http://localhost:3000`

## 演示账号

- 用户名：`admin`
- 密码：`123456`

## API 示例

### 1. 登录获取 Token

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

### 2. 使用 Token 访问受保护接口

```bash
curl http://localhost:3000/profile \
  -H "Authorization: Bearer <your_token>"
```

## 运行测试

```bash
npm test
```
