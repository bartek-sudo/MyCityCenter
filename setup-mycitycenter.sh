#!/bin/bash

# MyCityCenter Setup Script for Ubuntu Mini
# Prosty i niezawodny skrypt instalacyjny dla aplikacji Laravel MyCityCenter

set -e

echo "=========================================="
echo "MyCityCenter - Setup Script (Laravel)"
echo "=========================================="
echo ""

# Krok 1: Czyszczenie nieprawidłowych repozytoriów
echo "[1/13] Czyszczenie nieprawidłowych repozytoriów..."
sudo rm -f /etc/apt/sources.list.d/sury-php.list 2>/dev/null || true
sudo rm -f /usr/share/keyrings/deb.sury.org-php.gpg 2>/dev/null || true
echo "✓ Nieprawidłowe repozytoria usunięte"

# Krok 2: Aktualizacja systemu
echo "[2/13] Aktualizacja systemu..."
sudo apt-get update
sudo apt-get upgrade -y

# Krok 3: Instalacja podstawowych narzędzi
echo "[3/13] Instalacja podstawowych narzędzi..."
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

# Krok 4: Dodanie repozytorium PHP (tylko PPA ondrej/php)
echo "[4/13] Dodawanie repozytorium PHP (PPA ondrej/php)..."
UBUNTU_VERSION=$(lsb_release -rs)
echo "Wykryto Ubuntu wersję: $UBUNTU_VERSION"

# Sprawdź czy PPA już istnieje
if ! grep -q "ondrej/php" /etc/apt/sources.list.d/*.list 2>/dev/null; then
    sudo add-apt-repository ppa:ondrej/php -y
    echo "✓ Repozytorium PPA dodane"
else
    echo "✓ Repozytorium PPA już istnieje"
fi

# Aktualizacja listy pakietów
sudo apt-get update

# Krok 5: Instalacja PHP
echo "[5/13] Instalacja PHP..."
PHP_VER=""

# Funkcja instalacji PHP
install_php() {
    local version=$1
    echo "  Próba instalacji PHP $version..."
    
    if sudo apt-get install -y \
        php${version} \
        php${version}-fpm \
        php${version}-cli \
        php${version}-common \
        php${version}-mysql \
        php${version}-pgsql \
        php${version}-zip \
        php${version}-gd \
        php${version}-mbstring \
        php${version}-curl \
        php${version}-xml \
        php${version}-bcmath \
        php${version}-intl \
        php${version}-readline \
        php${version}-tokenizer 2>/dev/null; then
        
        if /usr/bin/php${version} -v >/dev/null 2>&1; then
            PHP_VER=$version
            echo "  ✓ PHP $version zainstalowane pomyślnie!"
            return 0
        fi
    fi
    return 1
}

# Próba instalacji PHP 8.2, 8.1, 8.0
if install_php "8.2"; then
    : # PHP 8.2 zainstalowane
elif install_php "8.1"; then
    : # PHP 8.1 zainstalowane
elif install_php "8.0"; then
    : # PHP 8.0 zainstalowane
else
    echo ""
    echo "=========================================="
    echo "BŁĄD: Nie udało się zainstalować PHP!"
    echo "=========================================="
    echo ""
    echo "Sprawdź dostępne wersje PHP:"
    echo "  apt-cache search ^php[0-9] | grep -E '^php[0-9]'"
    echo ""
    echo "Dla Ubuntu 18.04 może być potrzebna aktualizacja do 20.04 LTS."
    echo ""
    exit 1
fi

# Ustawienie domyślnej wersji PHP
sudo update-alternatives --set php /usr/bin/php${PHP_VER} 2>/dev/null || true
export PHP_VER

echo "Zainstalowana wersja PHP:"
php -v

# Krok 6: Instalacja Composer
echo "[6/13] Instalacja Composer..."
if ! command -v composer &> /dev/null; then
    cd /tmp
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
    sudo chmod +x /usr/local/bin/composer
fi
composer --version

# Krok 7: Instalacja Node.js i npm
echo "[7/13] Instalacja Node.js i npm..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v

# Krok 8: Instalacja PostgreSQL
echo "[8/13] Instalacja PostgreSQL..."
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Krok 9: Konfiguracja bazy danych
echo "[9/13] Konfiguracja bazy danych..."
sudo -u postgres psql <<EOF
CREATE DATABASE mycitycenter;
CREATE USER mycityuser WITH PASSWORD 'changeme123';
ALTER ROLE mycityuser SET client_encoding TO 'utf8';
ALTER ROLE mycityuser SET default_transaction_isolation TO 'read committed';
ALTER ROLE mycityuser SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE mycitycenter TO mycityuser;
\q
EOF

# Krok 10: Klonowanie/kopiowanie repozytorium
echo "[10/13] Przygotowanie repozytorium MyCityCenter..."
cd /opt
if [ -d "MyCityCenter" ]; then
    echo "  Katalog już istnieje, używam istniejącego..."
    cd MyCityCenter
    sudo git pull || true
else
    echo "  Klonowanie repozytorium..."
    sudo git clone https://github.com/bartek-sudo/MyCityCenter.git
    cd MyCityCenter
fi
sudo chown -R $USER:$USER .

# Krok 11: Instalacja zależności
echo "[11/13] Instalacja zależności..."
echo "  Instalacja zależności PHP (Composer)..."
composer install --no-dev --optimize-autoloader

echo "  Instalacja zależności Node.js..."
npm install

echo "  Budowanie frontendu (Vite)..."
npm run build

# Krok 12: Konfiguracja aplikacji
echo "[12/13] Konfiguracja aplikacji Laravel..."

# Konfiguracja .env
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
    else
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
php artisan migrate --force

# Konfiguracja uprawnień
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Krok 13: Konfiguracja Nginx
echo "[13/13] Konfiguracja Nginx..."
sudo apt-get install -y nginx

# Konfiguracja Nginx dla Laravel
sudo tee /etc/nginx/sites-available/mycitycenter > /dev/null <<EOF
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
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php\$ {
        fastcgi_pass unix:/var/run/php/php${PHP_VER}-fpm.sock;
        fastcgi_param SCRIPT_FILENAME \$realpath_root\$fastcgi_script_name;
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
sudo systemctl restart php${PHP_VER}-fpm
sudo systemctl enable php${PHP_VER}-fpm
sudo systemctl restart nginx
sudo systemctl enable nginx

# Konfiguracja firewall
echo "Konfiguracja firewall..."
sudo apt-get install -y ufw
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Utworzenie skryptu kopii zapasowych
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

echo ""
echo "=========================================="
echo "Instalacja zakończona pomyślnie!"
echo "=========================================="
echo ""
echo "Aplikacja działa na:"
echo "  - http://$(hostname -I | awk '{print $1}')"
echo "  - http://localhost"
echo ""
echo "Przydatne komendy:"
echo "  - Status Nginx: sudo systemctl status nginx"
echo "  - Status PHP-FPM: sudo systemctl status php${PHP_VER}-fpm"
echo "  - Status PostgreSQL: sudo systemctl status postgresql"
echo "  - Logi Laravel: tail -f /opt/MyCityCenter/storage/logs/laravel.log"
echo "  - Restart Nginx: sudo systemctl restart nginx"
echo "  - Restart PHP-FPM: sudo systemctl restart php${PHP_VER}-fpm"
echo ""
echo "Baza danych PostgreSQL:"
echo "  - Nazwa bazy: mycitycenter"
echo "  - Użytkownik: mycityuser"
echo "  - Hasło: changeme123 (ZMIEŃ TO!)"
echo ""
echo "WAŻNE:"
echo "  1. Zmień hasło bazy danych w pliku /opt/MyCityCenter/.env"
echo "  2. Zmień hasło użytkownika PostgreSQL"
echo ""
echo "=========================================="
