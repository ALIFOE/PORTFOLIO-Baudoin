<?php
declare(strict_types=1);

/**
 * GET /api/file.php?path=2026/11/photo.jpg — sert un fichier envoyé depuis l'admin.
 *
 * Utilisé quand le dossier des fichiers (uploads_dir) est rangé hors de la racine web,
 * pour qu'il survive aux redéploiements : le .htaccess de la racine renvoie ici les
 * adresses /uploads/… qui ne correspondent à aucun fichier réel.
 * Gère les requêtes partielles (Range) : les vidéos peuvent être lues et parcourues.
 */

require __DIR__ . '/lib/bootstrap.php';

const SERVE_TYPES = [
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'png' => 'image/png',
    'webp' => 'image/webp',
    'gif' => 'image/gif',
    'mp4' => 'video/mp4',
    'webm' => 'video/webm',
    'mov' => 'video/quicktime',
    'pdf' => 'application/pdf',
];

function not_found(): never
{
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Fichier introuvable.';
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET' && $method !== 'HEAD') {
    header('Allow: GET, HEAD');
    http_response_code(405);
    exit;
}

$path = (string) ($_GET['path'] ?? '');
$ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
if (!preg_match('~^[A-Za-z0-9][A-Za-z0-9/_.-]*$~', $path) || str_contains($path, '..') || !isset(SERVE_TYPES[$ext])) {
    not_found();
}
$root = realpath(uploads_dir());
$file = $root ? realpath($root . '/' . $path) : false;
if (!$file || !str_starts_with($file, $root . DIRECTORY_SEPARATOR) || !is_file($file)) {
    not_found();
}

$size = (int) filesize($file);
$mtime = (int) filemtime($file);
$etag = '"' . dechex($mtime) . '-' . dechex($size) . '"';

header_remove('X-Robots-Tag');
header('Content-Type: ' . SERVE_TYPES[$ext]);
// Noms de fichiers uniques : le navigateur et le CDN peuvent les garder longtemps
header('Cache-Control: public, max-age=604800');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $mtime) . ' GMT');
header('ETag: ' . $etag);
header('Accept-Ranges: bytes');
header('Content-Disposition: inline; filename="' . basename($file) . '"');

if (trim((string) ($_SERVER['HTTP_IF_NONE_MATCH'] ?? '')) === $etag) {
    http_response_code(304);
    exit;
}

$start = 0;
$end = $size - 1;
if (preg_match('/^bytes=(\d*)-(\d*)$/', (string) ($_SERVER['HTTP_RANGE'] ?? ''), $m) && ($m[1] !== '' || $m[2] !== '')) {
    if ($m[1] === '') {
        $start = max(0, $size - (int) $m[2]); // derniers octets
    } else {
        $start = (int) $m[1];
        if ($m[2] !== '') {
            $end = min($end, (int) $m[2]);
        }
    }
    if ($start > $end || $start >= $size) {
        http_response_code(416);
        header("Content-Range: bytes */$size");
        exit;
    }
    http_response_code(206);
    header("Content-Range: bytes $start-$end/$size");
} else {
    http_response_code(200);
}
header('Content-Length: ' . ($end - $start + 1));
if ($method === 'HEAD') {
    exit;
}

@set_time_limit(0);
while (ob_get_level() > 0) {
    ob_end_clean();
}
$fh = fopen($file, 'rb');
if ($fh === false) {
    not_found();
}
fseek($fh, $start);
$left = $end - $start + 1;
while ($left > 0 && !feof($fh) && !connection_aborted()) {
    $chunk = fread($fh, min(1048576, $left));
    if ($chunk === false || $chunk === '') {
        break;
    }
    echo $chunk;
    flush();
    $left -= strlen($chunk);
}
fclose($fh);
exit;
