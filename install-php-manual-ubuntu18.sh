#!/bin/bash

# Ręczna instalacja PHP 8.2 dla Ubuntu 18.04
# Użyj tego skryptu, jeśli główny skrypt nie działa

set -e

echo "=========================================="
echo "Ręczna instalacja PHP 8.2 dla Ubuntu 18.04"
echo "=========================================="

# Sprawdzenie wersji Ubuntu
CODENAME=$(lsb_release -sc)
echo "Wykryto kodową nazwę dystrybucji: $CODENAME"

# Instalacja wymaganych narzędzi
echo "[1/5] Instalacja wymaganych narzędzi..."
sudo apt-get update
sudo apt-get install -y software-properties-common apt-transport-https lsb-release ca-certificates curl gnupg2

# Dodanie klucza GPG
echo "[2/5] Dodawanie klucza GPG..."
curl -fsSL https://packages.sury.org/php/apt.gpg | sudo gpg --dearmor -o /usr/share/keyrings/deb.sury.org-php.gpg

# Dodanie repozytorium
echo "[3/5] Dodawanie repozytorium PHP..."
echo "deb [signed-by=/usr/share/keyrings/deb.sury.org-php.gpg] https://packages.sury.org/php/ $CODENAME main" | sudo tee /etc/apt/sources.list.d/sury-php.list

# Aktualizacja listy pakietów
echo "[4/5] Aktualizacja listy pakietów..."
sudo apt-get update

# Instalacja PHP 8.2
echo "[5/5] Instalacja PHP 8.2 i rozszerzeń..."
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

# Weryfikacja
echo ""
echo "=========================================="
echo "Instalacja zakończona!"
echo "=========================================="
php -v
echo ""
echo "Uruchom teraz główny skrypt instalacyjny:"
echo "  cd /opt/MyCityCenter"
echo "  sudo ./setup-mycitycenter.sh"
echo ""

