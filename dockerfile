# 使用官方 Node.js 的 Docker 鏡像
FROM node:latest

# 設定工作目錄
WORKDIR /app

# 將當前目錄下的所有檔案複製到工作目錄
COPY . .

# 開放 3000 端口
EXPOSE 5173

# 容器啟動時執行命令
# CMD ["npm", "run", "dev"]