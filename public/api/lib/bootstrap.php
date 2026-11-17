<?php
declare(strict_types=1);

/**
 * Socle commun de l'API du portfolio (PHP >= 8.1 + MySQL/MariaDB).
 *
 * - contact.php : reçoit les messages du formulaire public
 * - content.php : contenu du site modifié depuis l'administration (lecture publique)
 * - admin.php   : espace d'administration (session + jeton CSRF)
 *
 * La configuration (accès base de données, compte admin initial) est lue dans
 * un fichier placé HORS du dossier public — voir config.sample.php.
 */

// Ce fichier n'est jamais appelé directement
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    http_response_code(404);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Referrer-Policy: same-origin');
header('X-Robots-Tag: noindex');

/* ------------------------------------------------------------------
 * Réponses JSON
 * ------------------------------------------------------------------ */
function respond(array $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $message, int $status = 400, array $extra = []): never
{
    respond(['ok' => false, 'error' => $message] + $extra, $status);
}

set_exception_handler(function (Throwable $e): void {
    error_log(sprintf('[portfolio-api] %s: %s @ %s:%d', $e::class, $e->getMessage(), $e->getFile(), $e->getLine()));
    $isDb = $e instanceof PDOException;
    fail(
        $isDb ? 'La base de données est inaccessible pour le moment.' : 'Erreur interne du serveur.',
        $isDb ? 503 : 500,
        config('debug', false) ? ['detail' => $e->getMessage()] : [],
    );
});

/* ------------------------------------------------------------------
 * Configuration
 * ------------------------------------------------------------------ */
function config(?string $key = null, mixed $default = null): mixed
{
    static $cfg = null;

    if ($cfg === null) {
        $apiDir = dirname(__DIR__);
        $candidates = array_filter([
            getenv('PORTFOLIO_API_CONFIG') ?: null,
            // Emplacement recommandé : au-dessus de la racine web (ex. à côté de public_html)
            dirname($apiDir, 2) . '/portfolio-api.config.php',
            // Solution de repli si l'hébergeur interdit de sortir de la racine web
            $apiDir . '/config.php',
        ]);
        foreach ($candidates as $file) {
            if (@is_file($file)) {
                $loaded = require $file;
                if (is_array($loaded)) {
                    $cfg = $loaded;
                    relocate_config($file, $apiDir);
                    break;
                }
            }
        }
        if ($cfg === null) {
            $cfg = [];
            fail("L'API n'est pas encore configurée sur ce serveur.", 503, ['code' => 'not_configured']);
        }
    }

    if ($key === null) {
        return $cfg;
    }
    $value = $cfg;
    foreach (explode('.', $key) as $part) {
        if (!is_array($value) || !array_key_exists($part, $value)) {
            return $default;
        }
        $value = $value[$part];
    }
    return $value;
}

/**
 * Configuration envoyée dans api/config.php (hébergeur sans accès au-dessus de la
 * racine web) : déplacée au premier appel vers l'emplacement recommandé, hors de la
 * racine web. Elle n'y est plus exposée, et un redéploiement qui remplace tout le
 * site ne l'efface plus.
 */
function relocate_config(string $file, string $apiDir): void
{
    $preferred = dirname($apiDir, 2) . '/portfolio-api.config.php';
    if ($file !== $apiDir . '/config.php' || is_file($preferred) || !is_writable(dirname($preferred))) {
        return;
    }
    $tmp = $preferred . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (@copy($file, $tmp)) {
        @chmod($tmp, 0600);
        if (@rename($tmp, $preferred)) {
            @unlink($file);
            return;
        }
    }
    @unlink($tmp);
}

/* ------------------------------------------------------------------
 * Base de données
 * ------------------------------------------------------------------ */
function table(string $name): string
{
    $prefix = (string) config('db.prefix', 'pf_');
    if (!preg_match('/^[A-Za-z0-9_]*$/', $prefix)) {
        $prefix = 'pf_';
    }
    return '`' . $prefix . $name . '`';
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = (string) config('db.host', '127.0.0.1');
    $port = (int) config('db.port', 3306);
    $name = (string) config('db.name', '');
    $user = (string) config('db.user', '');
    $pass = (string) config('db.pass', '');
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $host, $port, $name);

    try {
        $pdo = new PDO($dsn, $user, $pass, $options);
    } catch (PDOException $e) {
        // Base inexistante (cas typique en local avec XAMPP) : on tente de la créer
        if ((int) ($e->errorInfo[1] ?? 0) !== 1049 && !str_contains($e->getMessage(), '[1049]')) {
            throw $e;
        }
        $server = new PDO(sprintf('mysql:host=%s;port=%d;charset=utf8mb4', $host, $port), $user, $pass, $options);
        $server->exec('CREATE DATABASE IF NOT EXISTS `' . str_replace('`', '``', $name) . '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        $pdo = new PDO($dsn, $user, $pass, $options);
    }

    ensure_schema($pdo);
    return $pdo;
}

/** Crée les tables au premier appel : aucune installation manuelle n'est nécessaire. */
function ensure_schema(PDO $pdo): void
{
    $engine = 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci';

    $pdo->exec('CREATE TABLE IF NOT EXISTS ' . table('messages') . " (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        kind ENUM('contact','demande') NOT NULL DEFAULT 'contact',
        name VARCHAR(120) NOT NULL,
        email VARCHAR(190) NOT NULL,
        whatsapp VARCHAR(40) NOT NULL DEFAULT '',
        services VARCHAR(255) NOT NULL DEFAULT '',
        message TEXT NOT NULL,
        status ENUM('new','read','done','archived') NOT NULL DEFAULT 'new',
        note TEXT NULL,
        ip_hash CHAR(64) NOT NULL DEFAULT '',
        user_agent VARCHAR(255) NOT NULL DEFAULT '',
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        KEY idx_status_created (status, created_at),
        KEY idx_created (created_at),
        KEY idx_ip_created (ip_hash, created_at)
    ) $engine");

    $pdo->exec('CREATE TABLE IF NOT EXISTS ' . table('admins') . " (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(60) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        UNIQUE KEY uniq_username (username)
    ) $engine");

    $pdo->exec('CREATE TABLE IF NOT EXISTS ' . table('login_attempts') . " (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        ip_hash CHAR(64) NOT NULL,
        attempted_at DATETIME NOT NULL,
        KEY idx_ip_time (ip_hash, attempted_at)
    ) $engine");

    // Contenu du site modifié depuis l'admin : une ligne JSON par section (profil, projets…)
    $pdo->exec('CREATE TABLE IF NOT EXISTS ' . table('content') . " (
        section VARCHAR(40) NOT NULL PRIMARY KEY,
        data MEDIUMTEXT NOT NULL,
        version INT UNSIGNED NOT NULL DEFAULT 1,
        updated_at DATETIME NOT NULL
    ) $engine");

    // Fichiers téléversés (images, vidéos, CV)
    $pdo->exec('CREATE TABLE IF NOT EXISTS ' . table('media') . " (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        path VARCHAR(255) NOT NULL,
        thumb VARCHAR(255) NOT NULL DEFAULT '',
        kind ENUM('image','video','document') NOT NULL,
        mime VARCHAR(100) NOT NULL,
        size BIGINT UNSIGNED NOT NULL DEFAULT 0,
        width INT UNSIGNED NOT NULL DEFAULT 0,
        height INT UNSIGNED NOT NULL DEFAULT 0,
        original_name VARCHAR(190) NOT NULL DEFAULT '',
        created_at DATETIME NOT NULL,
        UNIQUE KEY uniq_path (path),
        KEY idx_kind_created (kind, created_at)
    ) $engine");
}

/* ------------------------------------------------------------------
 * Requête
 * ------------------------------------------------------------------ */
function require_method(string ...$allowed): void
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (!in_array($method, $allowed, true)) {
        header('Allow: ' . implode(', ', $allowed));
        fail('Méthode non autorisée.', 405);
    }
}

/** Corps de la requête : JSON (borné à $maxBytes) ou formulaire classique. */
function input(int $maxBytes = 65536): array
{
    if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
        if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > $maxBytes) {
            fail('Requête trop volumineuse.', 413);
        }
        $raw = file_get_contents('php://input', false, null, 0, $maxBytes);
        $data = json_decode($raw === false ? '' : $raw, true);
        return is_array($data) ? $data : [];
    }
    return $_POST;
}

/** Nettoie une valeur texte : UTF-8 valide, sans caractères de contrôle, longueur bornée. */
function clean(mixed $value, int $max, bool $multiline = false): string
{
    if (!is_string($value) && !is_int($value) && !is_float($value)) {
        return '';
    }
    $value = (string) $value;
    if (!mb_check_encoding($value, 'UTF-8')) {
        $value = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
    }
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = $multiline
        ? (preg_replace('/[^\P{Cc}\n\t]/u', '', $value) ?? '')
        : (preg_replace('/\p{Cc}+/u', ' ', $value) ?? '');
    return mb_substr(trim($value), 0, $max);
}

function now(): string
{
    return gmdate('Y-m-d H:i:s');
}

/** Date SQL (UTC) → ISO 8601 pour le navigateur. */
function iso(?string $sqlDate): ?string
{
    return $sqlDate ? str_replace(' ', 'T', $sqlDate) . 'Z' : null;
}

/** Empreinte de l'adresse IP (jamais l'adresse en clair) pour limiter les abus. */
function client_hash(): string
{
    return hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . (string) config('app_secret', ''));
}

/** Transforme un texte en identifiant d'URL : « Développeur Web » → « developpeur-web ». */
function slugify(string $text, int $max = 80): string
{
    if (class_exists('Transliterator')) {
        $t = Transliterator::create('Any-Latin; Latin-ASCII');
        $text = $t ? (string) $t->transliterate($text) : $text;
    } else {
        $text = strtr($text, [
            'à' => 'a', 'â' => 'a', 'ä' => 'a', 'á' => 'a', 'ã' => 'a', 'ç' => 'c', 'é' => 'e', 'è' => 'e', 'ê' => 'e',
            'ë' => 'e', 'î' => 'i', 'ï' => 'i', 'í' => 'i', 'ô' => 'o', 'ö' => 'o', 'ó' => 'o', 'ù' => 'u', 'û' => 'u',
            'ü' => 'u', 'ú' => 'u', 'ÿ' => 'y', 'ñ' => 'n', 'œ' => 'oe', 'æ' => 'ae', 'À' => 'A', 'É' => 'E', 'È' => 'E',
        ]);
    }
    $text = strtolower((string) preg_replace('/[^A-Za-z0-9]+/', '-', $text));
    return trim(substr(trim($text, '-'), 0, $max), '-');
}

/**
 * Dossier des fichiers téléversés : « uploads/ » à la racine du site
 * (à côté de api/), modifiable avec la clé uploads_dir de la configuration.
 */
function uploads_dir(): string
{
    $dir = (string) config('uploads_dir', '');
    return rtrim($dir !== '' ? $dir : public_uploads_path(), '/\\');
}

/** Adresse publique des fichiers : <racine web>/uploads */
function public_uploads_path(): string
{
    return dirname(__DIR__, 2) . '/uploads';
}

/**
 * Quand uploads_dir est hors de la racine web (il survit alors aux redéploiements),
 * les adresses /uploads/… sont servies par api/file.php (règle du .htaccess racine).
 * Si l'hébergeur autorise les liens symboliques, un lien <racine web>/uploads est
 * créé à la place, pour que le serveur web les serve directement.
 */
function ensure_uploads_link(): void
{
    $dir = uploads_dir();
    $link = public_uploads_path();
    if ($dir === $link || !function_exists('symlink') || is_link($link) || file_exists($link)) {
        return;
    }
    try {
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        if (is_dir($dir)) {
            @symlink($dir, $link);
        }
    } catch (Throwable) {
        // lien impossible : api/file.php sert les fichiers
    }
}

/** Taille en octets d'une valeur php.ini (« 128M » → 134217728). */
function ini_bytes(string $key): int
{
    $value = trim((string) ini_get($key));
    if ($value === '' || $value === '-1') {
        return PHP_INT_MAX;
    }
    $number = (float) $value;
    return (int) match (strtolower(substr($value, -1))) {
        'g' => $number * 1024 ** 3,
        'm' => $number * 1024 ** 2,
        'k' => $number * 1024,
        default => $number,
    };
}

/** Taille maximale d'un fichier envoyé, imposée par la configuration PHP du serveur. */
function upload_limit(): int
{
    return min(ini_bytes('upload_max_filesize'), ini_bytes('post_max_size'));
}
