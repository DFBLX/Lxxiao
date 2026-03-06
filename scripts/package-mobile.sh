#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PKG_NAME="object-recognizer-mobile-package.zip"

TARGETS=(
  "$HOME/Desktop"
  "$ROOT_DIR/Desktop"
)

# 兼容部分系统的中文“桌面”目录
if [ -d "$HOME/桌面" ] || [ ! -e "$HOME/桌面" ]; then
  TARGETS+=("$HOME/桌面")
fi

mkdir -p "$ROOT_DIR/.artifacts"
TMP_ZIP="$ROOT_DIR/.artifacts/$PKG_NAME"

cd "$ROOT_DIR"
zip -rq "$TMP_ZIP" public README.md package.json app.js server.js test

echo "打包完成: $TMP_ZIP"
for dir in "${TARGETS[@]}"; do
  mkdir -p "$dir"
  cp -f "$TMP_ZIP" "$dir/$PKG_NAME"
  echo "已复制到: $dir/$PKG_NAME"
done

echo "\n可直接解压查看（示例）:"
echo "unzip -o \"$HOME/Desktop/$PKG_NAME\" -d \"$HOME/Desktop/object-recognizer-mobile-package\""
