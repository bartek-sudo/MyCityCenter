#!/bin/bash

# MyCityCenter Setup Script for Ubuntu Mini
# Skrypt instalacyjny dla aplikacji Laravel MyCityCenter

set -e  # Zatrzymaj przy błędzie

echo "=========================================="
echo "MyCityCenter - Setup Script (Laravel)"
echo "=========================================="
echo ""
echo "UWAGA: Laravel 11 wymaga PHP 8.2 lub nowszej."
echo "Skrypt automatycznie spróbuje zainstalować PHP 8.2, 8.1 lub 8.0."
echo "Dla Ubuntu 18.04 może być potrzebna aktualizacja systemu."
echo ""

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

# Instalacja PHP i wymaganych rozszerzeń
echo "[3/12] Instalacja PHP i rozszerzeń..."

# Sprawdzenie wersji Ubuntu
UBUNTU_VERSION=$(lsb_release -rs)
echo "Wykryto Ubuntu wersję: $UBUNTU_VERSION"

# Dodanie repozytorium PHP
echo "Dodawanie repozytorium PHP..."
set +e
PPA_ADDED=0

# Próba 1: Standardowe PPA
if sudo add-apt-repository ppa:ondrej/php -y >/dev/null 2>&1; then
    PPA_ADDED=1
    echo "Repozytorium PHP dodane pomyślnie (PPA)"
else
    echo "Nie udało się dodać PPA. Próba alternatywnej metody (DEB.SURY.ORG)..."

    # Próba 2: DEB.SURY.ORG (bardziej niezawodne dla Ubuntu 18.04)
    CODENAME=$(lsb_release -sc)
    echo "Wykryto kodową nazwę dystrybucji: $CODENAME"

    # Instalacja wymaganych narzędzi
    sudo apt-get install -y software-properties-common apt-transport-https lsb-release ca-certificates curl

    # Dodanie klucza GPG
    if curl -fsSL https://packages.sury.org/php/apt.gpg | sudo gpg --dearmor -o /usr/share/keyrings/deb.sury.org-php.gpg 2>/dev/null; then
        echo "Klucz GPG dodany pomyślnie"

        # Dodanie repozytorium
        echo "deb [signed-by=/usr/share/keyrings/deb.sury.org-php.gpg] https://packages.sury.org/php/ $CODENAME main" | sudo tee /etc/apt/sources.list.d/sury-php.list >/dev/null

        if [ $? -eq 0 ]; then
            PPA_ADDED=1
            echo "Repozytorium PHP dodane pomyślnie (DEB.SURY.ORG)"
        fi
    fi

    # Próba 3: PPA z ustawionym locale
    if [ $PPA_ADDED -eq 0 ]; then
        echo "Próba dodania PPA z ustawionym locale..."
        if sudo LC_ALL=C.UTF-8 add-apt-repository ppa:ondrej/php -y >/dev/null 2>&1; then
            PPA_ADDED=1
            echo "Repozytorium PHP dodane pomyślnie (PPA z locale)"
        fi
    fi
fi
set -e

# Dodaj również DEB.SURY.ORG jako dodatkowe repozytorium (może mieć więcej pakietów)
CODENAME=$(lsb_release -sc)
echo "Dodawanie dodatkowego repozytorium DEB.SURY.ORG..."
set +e
if [ ! -f /usr/share/keyrings/deb.sury.org-php.gpg ]; then
    curl -fsSL https://packages.sury.org/php/apt.gpg | sudo gpg --dearmor -o /usr/share/keyrings/deb.sury.org-php.gpg 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "deb [signed-by=/usr/share/keyrings/deb.sury.org-php.gpg] https://packages.sury.org/php/ $CODENAME main" | sudo tee /etc/apt/sources.list.d/sury-php.list >/dev/null
        echo "Repozytorium DEB.SURY.ORG dodane jako dodatkowe źródło"
    fi
fi
set -e

if [ $PPA_ADDED -eq 1 ] || [ -f /etc/apt/sources.list.d/sury-php.list ]; then
    echo "Aktualizacja listy pakietów..."
    sudo apt-get update
else
    echo "OSTRZEŻENIE: Nie udało się dodać repozytorium PHP."
    echo "Próba instalacji PHP z domyślnych repozytoriów Ubuntu..."
    sudo apt-get update
fi

# Funkcja sprawdzająca dostępność pakietu
check_package_available() {
    local package=$1
    apt-cache show "$package" >/dev/null 2>&1
    return $?
}

# Funkcja do próby instalacji konkretnej wersji PHP
install_php_version() {
    local php_version=$1
    echo "Próba instalacji PHP $php_version..."

    # Sprawdź czy podstawowe pakiety są dostępne
    if ! check_package_available "php${php_version}"; then
        echo "Pakiet php${php_version} nie jest dostępny w repozytoriach"
        return 1
    fi

    echo "Sprawdzanie dostępności pakietów PHP ${php_version}..."
    set +e

    # Lista pakietów do zainstalowania
    local packages=(
        "php${php_version}"
        "php${php_version}-fpm"
        "php${php_version}-cli"
        "php${php_version}-common"
        "php${php_version}-mysql"
        "php${php_version}-pgsql"
        "php${php_version}-zip"
        "php${php_version}-gd"
        "php${php_version}-mbstring"
        "php${php_version}-curl"
        "php${php_version}-xml"
        "php${php_version}-bcmath"
        "php${php_version}-intl"
        "php${php_version}-readline"
        "php${php_version}-tokenizer"
    )

    # Sprawdź dostępność wszystkich pakietów
    local missing_packages=()
    for pkg in "${packages[@]}"; do
        if ! check_package_available "$pkg"; then
            missing_packages+=("$pkg")
        fi
    done

    if [ ${#missing_packages[@]} -gt 0 ]; then
        echo "Brakujące pakiety: ${missing_packages[*]}"
        echo "Próba instalacji dostępnych pakietów..."
    fi

    # Próba instalacji (pakiety, które nie istnieją zostaną pominięte)
    sudo apt-get install -y "${packages[@]}" 2>&1 | tee /tmp/php_install.log

    local install_status=${PIPESTATUS[0]}
    set -e

    # Sprawdź czy podstawowe pakiety zostały zainstalowane
    if [ $install_status -eq 0 ] || command -v php${php_version} >/dev/null 2>&1; then
        # Sprawdź czy php działa
        if /usr/bin/php${php_version} -v >/dev/null 2>&1; then
            echo "PHP $php_version zainstalowane pomyślnie!"
            PHP_VER=$php_version
            return 0
        fi
    fi

    echo "Nie udało się zainstalować PHP $php_version"
    if [ -f /tmp/php_install.log ]; then
        echo "Ostatnie błędy:"
        tail -20 /tmp/php_install.log
    fi
    return 1
}

# Sprawdzenie dostępnych wersji PHP w repozytoriach
echo "Sprawdzanie dostępnych wersji PHP w repozytoriach..."
set +e
AVAILABLE_VERSIONS=$(apt-cache search ^php[0-9] | grep -oP '^php\d+\.\d+' | sort -u | grep -oP '\d+\.\d+' | sort -V -r)
set -e

if [ -n "$AVAILABLE_VERSIONS" ]; then
    echo "Dostępne wersje PHP:"
    echo "$AVAILABLE_VERSIONS" | head -5
    echo ""
fi

# Próba instalacji PHP w kolejności: 8.2, 8.1, 8.0
PHP_VER=""
if ! install_php_version "8.2"; then
    if ! install_php_version "8.1"; then
        if ! install_php_version "8.0"; then
            echo ""
            echo "=========================================="
            echo "BŁĄD: Nie udało się zainstalować PHP 8.0 lub nowszej wersji!"
            echo "=========================================="
            echo ""
            echo "Laravel 11 wymaga PHP 8.2 lub nowszej."
            echo ""
            echo "Możliwe rozwiązania:"
            echo "1. Zaktualizuj Ubuntu do wersji 20.04 lub nowszej"
            echo "2. Ręczna instalacja PHP 8.2 z PPA:"
            echo "   sudo add-apt-repository ppa:ondrej/php -y"
            echo "   sudo apt-get update"
            echo "   sudo apt-get install php8.2 php8.2-fpm php8.2-cli php8.2-common"
            echo "   (i pozostałe rozszerzenia php8.2-*)"
            echo "3. Użyj innej wersji Ubuntu (20.04 LTS lub 22.04 LTS)"
            echo ""
            exit 1
        fi
    fi
fi

# Ustawienie domyślnej wersji PHP
sudo update-alternatives --set php /usr/bin/php${PHP_VER} 2>/dev/null || true

# Eksport zmiennej dla użycia w dalszej części skryptu
export PHP_VER

# Weryfikacja instalacji PHP
echo "Zainstalowana wersja PHP:"
php -v
echo "Używana wersja PHP: $PHP_VER"

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
echo "  - Status PHP-FPM: sudo systemctl status php${PHP_VER}-fpm"
echo "  - Status PostgreSQL: sudo systemctl status postgresql"
echo "  - Logi Nginx: sudo tail -f /var/log/nginx/error.log"
echo "  - Logi Laravel: tail -f /opt/MyCityCenter/storage/logs/laravel.log"
echo "  - Restart Nginx: sudo systemctl restart nginx"
echo "  - Restart PHP-FPM: sudo systemctl restart php${PHP_VER}-fpm"
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

