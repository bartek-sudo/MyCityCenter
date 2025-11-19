#!/bin/bash

# MyCityCenter Setup Script for Ubuntu Mini
# Skrypt instalacyjny dla aplikacji Laravel MyCityCenter

set -e  # Zatrzymaj przy błędzie

echo "=========================================="
echo "MyCityCenter - Setup Script (Laravel)"
echo "=========================================="

# Aktualizacja systemu
echo "[1/12] Aktualizacja systemu..."
sudo apt-get update
sudo apt-get upgrade -y

# Instalacja niezbędnych narzędzi
echo "[2/12] Instalacja podstawowych narzędzi..."
sudo apt-get install -y \
    git \
    curl \
    wget \
    vim \
    net-tools \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# Instalacja PHP 8.2 i wymaganych rozszerzeń
echo "[3/12] Instalacja PHP 8.2 i rozszerzeń..."
sudo add-apt-repository ppa:ondrej/php -y
sudo apt-get update
sudo apt-get install -y \
    php8.2 \
    php8.2-fpm \
    php8.2-cli \
    php8.2-common \
    php8.2-mysql \
    php8.2-pgsql \
    php8.2-zip \
    php8.2-gd \
    php8.2-mbstring \
    php8.2-curl \
    php8.2-xml \
    php8.2-bcmath \
    php8.2-intl \
    php8.2-readline \
    php8.2-tokenizer

# Weryfikacja instalacji PHP
php -v

# Instalacja Composer
echo "[4/12] Instalacja Composer..."
if ! command -v composer &> /dev/null; then
    cd /tmp
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
    sudo chmod +x /usr/local/bin/composer
fi
composer --version

# Instalacja Node.js i npm
echo "[5/12] Instalacja Node.js i npm..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v

# Instalacja PostgreSQL
echo "[6/12] Instalacja PostgreSQL..."
sudo apt-get install -y postgresql postgresql-contrib

# Uruchomienie PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Konfiguracja bazy danych
echo "[7/12] Konfiguracja bazy danych..."
sudo -u postgres psql <<EOF
CREATE DATABASE mycitycenter;
CREATE USER mycityuser WITH PASSWORD 'changeme123';
ALTER ROLE mycityuser SET client_encoding TO 'utf8';
ALTER ROLE mycityuser SET default_transaction_isolation TO 'read committed';
ALTER ROLE mycityuser SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE mycitycenter TO mycityuser;
\q
EOF

# Klonowanie repozytorium
echo "[8/12] Klonowanie repozytorium MyCityCenter..."
cd /opt
if [ -d "MyCityCenter" ]; then
    echo "Katalog MyCityCenter już istnieje. Usuwanie..."
    sudo rm -rf MyCityCenter
fi
sudo git clone https://github.com/bartek-sudo/MyCityCenter.git
sudo chown -R $USER:$USER MyCityCenter
cd MyCityCenter

# Instalacja zależności PHP
echo "[9/12] Instalacja zależności PHP (Composer)..."
composer install --no-dev --optimize-autoloader

# Instalacja zależności Node.js
echo "[10/12] Instalacja zależności Node.js..."
npm install

# Budowanie frontendu
echo "[10.5/12] Budowanie frontendu (Vite)..."
npm run build

# Konfiguracja .env
echo "[11/12] Konfiguracja pliku .env..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        echo "UWAGA: Plik .env.example nie istnieje. Tworzenie podstawowego pliku .env..."
        php artisan key:generate --show > /dev/null 2>&1 || true
        # Utworzenie podstawowego .env jeśli nie istnieje
        cat > .env <<ENVEOF
APP_NAME=MyCityCenter
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_TIMEZONE=UTC
APP_URL=http://localhost

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=mycitycenter
DB_USERNAME=mycityuser
DB_PASSWORD=changeme123

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

LOG_CHANNEL=stack
LOG_LEVEL=debug
ENVEOF
    fi
fi

# Aktualizacja konfiguracji bazy danych w .env
sed -i 's/DB_CONNECTION=.*/DB_CONNECTION=pgsql/' .env
sed -i 's/DB_HOST=.*/DB_HOST=127.0.0.1/' .env
sed -i 's/DB_PORT=.*/DB_PORT=5432/' .env
sed -i 's/DB_DATABASE=.*/DB_DATABASE=mycitycenter/' .env
sed -i 's/DB_USERNAME=.*/DB_USERNAME=mycityuser/' .env
sed -i 's/DB_PASSWORD=.*/DB_PASSWORD=changeme123/' .env

# Generowanie klucza aplikacji
php artisan key:generate

# Uruchomienie migracji
echo "[11.5/12] Uruchomienie migracji bazy danych..."
php artisan migrate --force

# Konfiguracja uprawnień
echo "[11.6/12] Konfiguracja uprawnień..."
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Instalacja Nginx
echo "[12/12] Instalacja i konfiguracja Nginx..."
sudo apt-get install -y nginx

# Konfiguracja Nginx dla Laravel
sudo tee /etc/nginx/sites-available/mycitycenter > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name _;
    root /opt/MyCityCenter/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOF

# Aktywacja konfiguracji Nginx
sudo ln -sf /etc/nginx/sites-available/mycitycenter /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test konfiguracji Nginx
sudo nginx -t

# Restart usług
sudo systemctl restart php8.2-fpm
sudo systemctl enable php8.2-fpm
sudo systemctl restart nginx
sudo systemctl enable nginx

# Konfiguracja firewall
echo "Konfiguracja firewall..."
sudo apt-get install -y ufw
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Utworzenie skryptu do tworzenia kopii zapasowych
echo "Tworzenie skryptu kopii zapasowych..."
sudo tee /usr/local/bin/mycitycenter-backup.sh > /dev/null <<'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups/mycitycenter"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Kopia bazy danych
sudo -u postgres pg_dump mycitycenter > $BACKUP_DIR/db_$DATE.sql

# Kopia plików
tar -czf $BACKUP_DIR/files_$DATE.tar.gz -C /opt MyCityCenter

# Usuwanie kopii starszych niż 7 dni
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Kopia zapasowa utworzona: $DATE"
EOF

sudo chmod +x /usr/local/bin/mycitycenter-backup.sh

# Konfiguracja cron dla kopii zapasowych (codziennie o 2:00)
echo "0 2 * * * root /usr/local/bin/mycitycenter-backup.sh" | sudo tee -a /etc/crontab

echo "=========================================="
echo "Instalacja zakończona!"
echo "=========================================="
echo ""
echo "Aplikacja działa na:"
echo "  - http://$(hostname -I | awk '{print $1}')"
echo "  - http://localhost"
echo ""
echo "Przydatne komendy:"
echo "  - Status Nginx: sudo systemctl status nginx"
echo "  - Status PHP-FPM: sudo systemctl status php8.2-fpm"
echo "  - Status PostgreSQL: sudo systemctl status postgresql"
echo "  - Logi Nginx: sudo tail -f /var/log/nginx/error.log"
echo "  - Logi Laravel: tail -f /opt/MyCityCenter/storage/logs/laravel.log"
echo "  - Restart Nginx: sudo systemctl restart nginx"
echo "  - Restart PHP-FPM: sudo systemctl restart php8.2-fpm"
echo "  - Uruchomienie migracji: cd /opt/MyCityCenter && php artisan migrate"
echo "  - Tworzenie kopii zapasowej: sudo /usr/local/bin/mycitycenter-backup.sh"
echo ""
echo "Baza danych PostgreSQL:"
echo "  - Nazwa bazy: mycitycenter"
echo "  - Użytkownik: mycityuser"
echo "  - Hasło: changeme123 (ZMIEŃ TO!)"
echo ""
echo "WAŻNE:"
echo "  1. Zmień hasło bazy danych w pliku /opt/MyCityCenter/.env"
echo "  2. Zmień hasło użytkownika PostgreSQL: sudo -u postgres psql -c \"ALTER USER mycityuser WITH PASSWORD 'nowe_haslo';\""
echo "  3. Upewnij się, że firewall jest skonfigurowany poprawnie"
echo ""
echo "=========================================="

