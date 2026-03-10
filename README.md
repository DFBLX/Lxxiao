# 在线音乐播放器（移动端）

这是一个可在手机浏览器/PWA 使用的在线音乐播放器：

- 在线播放网络歌曲
- 支持上一首 / 下一首 / 播放暂停
- 支持进度拖动与音量调节
- 支持 PWA（可添加到手机桌面）

> 仓库中保留了 JWT 登录接口（`/login`、`/profile`）用于演示后端能力。

## 启动

```bash
npm start
```

打开：`http://localhost:3000`

## 手机使用方式

1. 将服务部署到可公网访问的 HTTPS 地址。
2. 手机上打开该地址。
3. 点击浏览器“添加到主屏幕”，即可像 App 一样使用。

## 一键生成“软件包”（自动复制到桌面）

```bash
npm run package:mobile
```

脚本会自动把包复制到这些位置（谁存在就用谁）：

- `~/Desktop/online-music-player-package.zip`
- `./Desktop/online-music-player-package.zip`（仓库内）
- `~/桌面/online-music-player-package.zip`（中文桌面环境）
- `/mnt/d/desktop/online-music-player-package.zip`（WSL 下对应 `D:\desktop`）

## 立即“打开”软件包（解压查看）

```bash
unzip -o ~/Desktop/online-music-player-package.zip -d ~/Desktop/online-music-player
```

## JWT 演示账号

- 用户名：`admin`
- 密码：`123456`

## 测试

```bash
npm test
```
