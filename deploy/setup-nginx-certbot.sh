#!/usr/bin/env bash
set -euo pipefail

DOMAIN="finstroi.com"
APP_DIR="${APP_DIR:-/home/library/new}"
NGINX_SITE="/etc/nginx/sites-available/${DOMAIN}.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN}.conf"
CERTBOT_WEBROOT="/var/www/certbot"

if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
  echo "Run as root: sudo bash deploy/setup-nginx-certbot.sh"
  exit 1
fi

echo "==> Installing nginx and certbot (if missing)"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y nginx certbot python3-certbot-nginx

echo "==> Checking Docker app on port 3338"
if ! curl -fsS --max-time 5 http://127.0.0.1:3338/ >/dev/null; then
  echo "Warning: nothing responds on http://127.0.0.1:3338"
  echo "Start the app first: cd ${APP_DIR} && docker compose up -d --build"
fi

echo "==> Deploying nginx site config"
mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled "${CERTBOT_WEBROOT}"
cp "${APP_DIR}/deploy/nginx/finstroi.com.conf" "${NGINX_SITE}"
ln -sf "${NGINX_SITE}" "${NGINX_ENABLED}"

if [[ -f /etc/nginx/sites-enabled/default ]]; then
  rm -f /etc/nginx/sites-enabled/default
fi

nginx -t
systemctl enable nginx
systemctl reload nginx

echo "==> Requesting Let's Encrypt certificate"
certbot --nginx \
  -d "${DOMAIN}" \
  --non-interactive \
  --agree-tos \
  --register-unsafely-without-email \
  --redirect

echo "==> Enabling certbot auto-renewal"
systemctl enable certbot.timer
systemctl start certbot.timer

echo
echo "Done. Site: https://${DOMAIN}"
echo "Renewal dry-run: certbot renew --dry-run"
