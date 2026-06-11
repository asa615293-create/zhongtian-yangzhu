FROM node:18-alpine

WORKDIR /app

# 安装后端依赖
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install --production

# 安装前端依赖并构建
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# 把构建产物移到服务端目录
RUN cp -r dist server/dist

# 暴露端口
EXPOSE 3001

# 启动服务端（同时托管前端静态文件）
WORKDIR /app/server
CMD ["node", "index.js"]
