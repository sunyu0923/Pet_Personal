#!/bin/bash
# PETI 一键部署脚本 - peti.asia
# 用法:
#   首次部署:  bash deploy.sh [你的邮箱]
#   更新部署:  bash deploy.sh
# 示例: bash deploy.sh admin@peti.asia

set -e

DOMAIN="peti.asia"
EMAIL="${1:-admin@peti.asia}"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

echo "=========================================="
echo "  PETI 部署到 $DOMAIN"
echo "=========================================="

# ─── 预检查 ───────────────────────────────
if ! command -v docker &> /dev/null; then
    echo "❌ 未安装 Docker，正在自动安装..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "✅ Docker 安装完成"
fi

if ! docker compose version &> /dev/null; then
    echo "❌ 未安装 Docker Compose V2。"
    echo "   请运行: apt install docker-compose-plugin"
    exit 1
fi

# ─── 生成 .env（首次部署自动生成安全密码）────────
if [ ! -f .env ]; then
    POSTGRES_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32)
    cat > .env <<EOF
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
EOF
    chmod 600 .env
    echo "✅ 已生成 .env（数据库密码已自动创建）"
else
    echo "✅ .env 已存在，使用现有配置"
fi

source .env

# ─── 第1步：构建所有服务 ─────────────────────
echo ""
echo "[1/4] 构建 Docker 镜像..."
docker compose build

# ─── 检查证书是否已存在 ─────────────────────
CERTS_EXIST=false
if docker compose run --rm --entrypoint "test" certbot -f "$CERT_PATH" 2>/dev/null; then
    CERTS_EXIST=true
fi

if [ "$CERTS_EXIST" = true ]; then
    echo ""
    echo "[2/4] 证书已存在，跳过申请。"
    echo "[3/4] 尝试续期..."
    docker compose run --rm --entrypoint "certbot" certbot renew --quiet || true

    echo ""
    echo "[4/4] 使用 HTTPS 配置启动所有服务..."
    docker compose up -d
else
    echo ""
    echo "[2/4] 使用 HTTP 配置启动（用于证书申请）..."
    echo "  邮箱: $EMAIL"

    # 备份 SSL 配置，切换到 HTTP-only 模式申请证书
    cp nginx/nginx.conf nginx/nginx.ssl.conf.bak
    trap 'echo "⚠️  出错，恢复 nginx.conf..."; cp nginx/nginx.ssl.conf.bak nginx/nginx.conf; rm -f nginx/nginx.ssl.conf.bak' ERR

    cp nginx/nginx.init.conf nginx/nginx.conf

    # 只启动核心服务（不启动 certbot 续期）
    docker compose up -d db backend frontend nginx

    echo "等待 HTTP 服务就绪..."
    for i in $(seq 1 30); do
        if curl -sf http://localhost/.well-known/acme-challenge/ > /dev/null 2>&1 || \
           curl -sf http://localhost/health > /dev/null 2>&1; then
            echo "  服务已就绪。"
            break
        fi
        if [ "$i" -eq 30 ]; then
            echo "⚠️  等待超时，继续尝试申请证书..."
        fi
        sleep 2
    done

    # ─── 第3步：申请 Let's Encrypt 证书 ──────
    echo ""
    echo "[3/4] 申请 SSL 证书..."
    docker compose run --rm --entrypoint "certbot" certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN" \
        -d "www.$DOMAIN"

    # ─── 第4步：切换到 HTTPS 并启动全部服务 ──
    echo ""
    echo "[4/4] 启用 HTTPS 配置..."
    cp nginx/nginx.ssl.conf.bak nginx/nginx.conf
    rm -f nginx/nginx.ssl.conf.bak
    trap - ERR

    # 重启全部服务（包括 certbot 自动续期容器）
    docker compose up -d
fi

echo ""
echo "=========================================="
echo "  ✅ 部署完成!"
echo "  https://$DOMAIN"
echo "=========================================="
echo ""
echo "常用命令："
echo "  查看日志:       docker compose logs -f"
echo "  查看状态:       docker compose ps"
echo "  重启服务:       docker compose restart"
echo "  更新部署:       git pull && bash deploy.sh"
echo "  手动续期证书:   docker compose exec certbot certbot renew"
