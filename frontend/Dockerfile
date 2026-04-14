# 构建阶段：生成静态文件
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# 导出阶段：将 dist 内容复制到空镜像的卷挂载点
FROM alpine:3.19

COPY --from=builder /app/dist /dist

# 将 dist 内容复制到命名卷（通过 entrypoint）
CMD ["sh", "-c", "cp -r /dist/. /usr/share/nginx/html/ && echo 'Frontend assets copied.'"]
