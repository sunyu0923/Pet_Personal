#!/bin/bash
# PETI 部署脚本 - peti.asia
# 用法: bash deploy.sh [你的邮箱]
# 示例: bash deploy.sh admin@peti.asia

set -e

DOMAIN="peti.asia"
EMAIL="${1:-admin@peti.asia}"

echo "=========================================="
echo "  PETI 部署到 $DOMAIN"
echo "  邮箱: $EMAIL"
echo "=========================================="

# 第1步：构建所有服务
echo ""
echo "[1/4] 构建 Docker 镜像..."
docker compose build

# 第2步：使用 HTTP-only 配置先启动（用于 Certbot 验证）
echo ""
echo "[2/4] 启动 HTTP 服务（用于证书申请）..."
# 临时使用 init 配置
cp nginx/nginx.conf nginx/nginx.ssl.conf.bak
cp nginx/nginx.init.conf nginx/nginx.conf
docker compose up -d

echo "等待服务启动..."
sleep 10

# 第3步：申请 Let's Encrypt 证书
echo ""
echo "[3/4] 申请 SSL 证书..."
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

# 第4步：切换到 HTTPS 配置并重启 Nginx
echo ""
echo "[4/4] 启用 HTTPS 配置..."
cp nginx/nginx.ssl.conf.bak nginx/nginx.conf
rm nginx/nginx.ssl.conf.bak
docker compose restart nginx

echo ""
echo "=========================================="
echo "  部署完成!"
echo "  https://$DOMAIN"
echo "=========================================="
echo ""
echo "证书会由 certbot 容器每12小时自动检查续期。"
echo "如需手动续期: docker compose run --rm certbot renew"
