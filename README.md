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

## 一键生成“移动端软件包”（自动复制到桌面）

```bash
npm run package:mobile
```

脚本会自动把包复制到这些位置（谁存在就用谁）：

- `~/Desktop/object-recognizer-mobile-package.zip`
- `./Desktop/object-recognizer-mobile-package.zip`（仓库内）
- `~/桌面/object-recognizer-mobile-package.zip`（中文桌面环境）

## 立即“打开”软件包（解压查看）

```bash
unzip -o ~/Desktop/object-recognizer-mobile-package.zip -d ~/Desktop/object-recognizer-mobile-package
```

## JWT 演示账号

- 用户名：`admin`
- 密码：`123456`

## 测试

```bash
npm test
```
