# Instrukcja instalacji MyCityCenter na Ubuntu Mini

## Wymagania wstępne

- Maszyna wirtualna Ubuntu Mini z zainstalowanym `cloud-init`
- Połączenie z internetem
- Uprawnienia administratora (sudo)

## Instalacja

### Krok 1: Pobranie skryptu

Skopiuj skrypt `setup-mycitycenter.sh` na maszynę wirtualną lub sklonuj repozytorium:

```bash
cd /opt
sudo git clone https://github.com/bartek-sudo/MyCityCenter.git
cd MyCityCenter
```

### Krok 2: Nadanie uprawnień wykonywania

```bash
chmod +x setup-mycitycenter.sh
```

### Krok 3: Uruchomienie skryptu

```bash
sudo ./setup-mycitycenter.sh
```

Skrypt automatycznie:
- Zaktualizuje system
- Zainstaluje PHP 8.2, Composer, Node.js, PostgreSQL, Nginx
- Sklonuje repozytorium
- Zainstaluje zależności
- Zbuduje frontend
- Skonfiguruje bazę danych
- Skonfiguruje Nginx jako reverse proxy
- Skonfiguruje firewall
- Utworzy automatyczne kopie zapasowe

## Po instalacji

### Sprawdzenie statusu usług

```bash
sudo systemctl status nginx
sudo systemctl status php8.2-fpm
sudo systemctl status postgresql
```

### Dostęp do aplikacji

Aplikacja będzie dostępna pod adresem:
- `http://IP_MASZYNY` (sprawdź IP: `hostname -I`)
- `http://localhost` (z poziomu maszyny wirtualnej)

### Zmiana hasła bazy danych

**WAŻNE:** Zmień domyślne hasło bazy danych!

1. Edytuj plik `.env`:
```bash
cd /opt/MyCityCenter
nano .env
```

2. Zmień hasło w linii `DB_PASSWORD=changeme123`

3. Zaktualizuj hasło w PostgreSQL:
```bash
sudo -u postgres psql -c "ALTER USER mycityuser WITH PASSWORD 'nowe_haslo';"
```

4. Zrestartuj aplikację:
```bash
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx
```

### Logi aplikacji

```bash
# Logi Laravel
tail -f /opt/MyCityCenter/storage/logs/laravel.log

# Logi Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Migracje bazy danych

Jeśli potrzebujesz uruchomić migracje ponownie:

```bash
cd /opt/MyCityCenter
php artisan migrate
```

### Kopie zapasowe

Skrypt automatycznie tworzy kopie zapasowe codziennie o 2:00. Możesz również utworzyć kopię ręcznie:

```bash
sudo /usr/local/bin/mycitycenter-backup.sh
```

Kopie zapasowe są przechowywane w `/opt/backups/mycitycenter/`

## Rozwiązywanie problemów

### Aplikacja nie działa

1. Sprawdź status usług:
```bash
sudo systemctl status nginx
sudo systemctl status php8.2-fpm
```

2. Sprawdź logi:
```bash
sudo journalctl -u nginx -f
sudo journalctl -u php8.2-fpm -f
```

3. Sprawdź uprawnienia:
```bash
sudo chown -R www-data:www-data /opt/MyCityCenter/storage
sudo chown -R www-data:www-data /opt/MyCityCenter/bootstrap/cache
sudo chmod -R 775 /opt/MyCityCenter/storage
sudo chmod -R 775 /opt/MyCityCenter/bootstrap/cache
```

### Błąd połączenia z bazą danych

1. Sprawdź czy PostgreSQL działa:
```bash
sudo systemctl status postgresql
```

2. Sprawdź połączenie:
```bash
sudo -u postgres psql -c "\l" | grep mycitycenter
```

3. Sprawdź konfigurację w `.env`:
```bash
cd /opt/MyCityCenter
cat .env | grep DB_
```

### Frontend nie ładuje się

1. Zbuduj frontend ponownie:
```bash
cd /opt/MyCityCenter
npm run build
```

2. Sprawdź czy pliki zostały wygenerowane:
```bash
ls -la /opt/MyCityCenter/public/build
```

## Konfiguracja dla OpenStack

### Przygotowanie obrazu

Po zakończeniu instalacji i konfiguracji:

1. Zatrzymaj maszynę:
```bash
sudo shutdown -h now
```

2. Na hoście wykonaj:
```bash
virt-sysprep -d base_server
```

### Cloud-init

Upewnij się, że plik `/etc/cloud/cloud.cfg` zawiera odpowiednią konfigurację dla OpenStack.

## Bezpieczeństwo

1. **Zmień hasła domyślne** - zarówno w bazie danych, jak i w pliku `.env`
2. **Skonfiguruj SSL/TLS** - rozważ użycie Let's Encrypt dla HTTPS
3. **Ogranicz dostęp** - skonfiguruj firewall, aby zezwalał tylko na niezbędne porty
4. **Regularne aktualizacje** - wykonuj `sudo apt-get update && sudo apt-get upgrade` regularnie
5. **Kopie zapasowe** - sprawdź czy kopie zapasowe są tworzone poprawnie

## Wsparcie

W przypadku problemów sprawdź:
- Logi aplikacji: `/opt/MyCityCenter/storage/logs/`
- Logi systemowe: `sudo journalctl -xe`
- Dokumentację Laravel: https://laravel.com/docs

