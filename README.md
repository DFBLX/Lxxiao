# 拍照识别物品（移动端）

这是一个可在手机浏览器/PWA 使用的拍照识别项目：

- 打开摄像头拍照
- 使用 TensorFlow.js + COCO-SSD 模型进行物品识别
- 显示前 5 个识别结果与置信度
- 支持 PWA（可添加到手机桌面）

> 仓库中保留了原有 JWT 登录接口（`/login`、`/profile`）用于演示后端能力。

## 启动

```bash
npm start
```

打开：`http://localhost:3000`

## 手机使用方式

1. 将服务部署到可公网访问的 HTTPS 地址（摄像头权限通常要求 HTTPS）。
2. 手机上打开该地址。
3. 点击浏览器“添加到主屏幕”，即可像 App 一样使用。

## 生成“移动端软件包”（桌面 ZIP）

已提供一个可分发的前端软件包（PWA 文件包）：

```bash
mkdir -p ~/Desktop
zip -r ~/Desktop/object-recognizer-mobile-package.zip public README.md package.json app.js server.js
```

该 ZIP 可传到手机或服务器进行部署；部署后即可在手机上直接使用。

## JWT 演示账号

- 用户名：`admin`
- 密码：`123456`

## 测试

```bash
npm test
```
