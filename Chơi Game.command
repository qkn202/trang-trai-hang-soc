#!/bin/bash
# ============================================================
#  Chơi Game.command — double-click (macOS) để chạy game
#  - Tự cài dependencies nếu lần đầu
#  - Khởi động dev server (Vite)
#  - Mở trình duyệt đúng port
#  Đóng cửa sổ Terminal (hoặc Ctrl-C) để tắt server.
# ============================================================
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "Lần chạy đầu: đang cài dependencies (npm install)..."
  npm install || { echo "Lỗi npm install — kiểm tra kết nối mạng."; read -p "Nhấn Enter để thoát..."; exit 1; }
fi

echo "Đang khởi động game server..."
VITE_LOG=$(mktemp)
npm run dev > "$VITE_LOG" 2>&1 &
VITE_PID=$!

# Chờ Vite in ra địa chỉ (tối đa 15s)
URL=""
for i in $(seq 1 30); do
  URL=$(grep -oE 'http://localhost:[0-9]+' "$VITE_LOG" | head -1)
  [ -n "$URL" ] && break
  sleep 0.5
done

if [ -z "$URL" ]; then
  echo "Không khởi động được server. Log:"
  cat "$VITE_LOG"
  read -p "Nhấn Enter để thoát..."
  exit 1
fi

echo "Game đang chạy tại: $URL"
echo "Đóng Terminal này để dừng server."
open "$URL"
wait $VITE_PID
