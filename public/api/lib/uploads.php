<?php
declare(strict_types=1);

/**
 * Téléversement des fichiers de l'administration (images, vidéos, CV).
 *
 * - Le type est reconnu d'après le contenu du fichier, jamais d'après son nom.
 * - Le fichier est renommé (nom nettoyé + suffixe aléatoire, extension imposée).
 * - Les photos trop grandes sont réduites, remises à l'endroit et débarrassées de
 *   leurs métadonnées (position GPS…) ; une miniature est créée pour les galeries.
 * - Le dossier uploads/ reçoit un .htaccess qui interdit d'y exécuter du code.
 */

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    http_response_code(404);
    exit;
}

const MB = 1048576;

/** type MIME → [extension, catégorie, taille maximale] */
const UPLOAD_TYPES = [
    'image/jpeg' => ['jpg', 'image', 40 * MB],
    'image/png' => ['png', 'image', 40 * MB],
    'image/webp' => ['webp', 'image', 40 * MB],
    'image/gif' => ['gif', 'image', 20 * MB],
    'video/mp4' => ['mp4', 'video', 2048 * MB],
    'video/webm' => ['webm', 'video', 2048 * MB],
    'video/quicktime' => ['mov', 'video', 2048 * MB],
    'application/pdf' => ['pdf', 'document', 40 * MB],
];
const MIME_ALIASES = [
    'image/jpg' => 'image/jpeg',
    'image/pjpeg' => 'image/jpeg',
    'video/x-m4v' => 'video/mp4',
    'application/x-pdf' => 'application/pdf',
];
const IMAGE_MAX_SIDE = 2400;
const THUMB_MAX_SIDE = 900;

function human_size(int $bytes): string
{
    if ($bytes >= PHP_INT_MAX) {
        return 'illimité';
    }
    return $bytes >= MB ? round($bytes / MB) . ' Mo' : max(1, round($bytes / 1024)) . ' Ko';
}

/** Crée le dossier uploads/ (et sa protection) au besoin. */
function ensure_upload_dir(string $sub): string
{
    $root = uploads_dir();
    $dir = $root . '/' . $sub;
    if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) {
        fail("Impossible de créer le dossier des fichiers ($root). Vérifiez les droits d'écriture.", 500);
    }
    if (!is_writable($dir)) {
        fail("Le dossier des fichiers n'est pas accessible en écriture ($dir).", 500);
    }
    $htaccess = $root . '/.htaccess';
    if (!is_file($htaccess)) {
        @file_put_contents($htaccess, implode("\n", [
            '# Fichiers envoyés depuis l\'administration : aucun code n\'est exécuté ici.',
            'Options -Indexes',
            '<FilesMatch "(?i)\.(php\d?|phtml|phar|pl|py|cgi|sh|shtml|html?|svg)$">',
            '    Require all denied',
            '</FilesMatch>',
            '<IfModule mod_mime.c>',
            '    RemoveHandler .php .phtml .php3 .php4 .php5 .php7 .php8 .phar',
            '    RemoveType .php .phtml .php3 .php4 .php5 .php7 .php8 .phar',
            '</IfModule>',
            '<IfModule mod_headers.c>',
            '    Header set X-Content-Type-Options "nosniff"',
            '</IfModule>',
            '',
        ]));
    }
    return $dir;
}

/**
 * Enregistre le fichier reçu dans le champ « file ».
 * $purpose = 'cv' : seul un PDF est accepté, rangé dans uploads/cv/.
 */
function handle_upload(PDO $pdo, string $purpose): array
{
    $limit = upload_limit();
    $tooBig = 'Fichier trop volumineux : ce serveur accepte au maximum ' . human_size($limit) . ' par fichier.';

    // Requête plus grosse que post_max_size : PHP vide alors $_FILES et $_POST
    if (empty($_FILES) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > ini_bytes('post_max_size')) {
        fail($tooBig, 413);
    }
    $file = $_FILES['file'] ?? null;
    if (!is_array($file) || is_array($file['error'] ?? null)) {
        fail('Aucun fichier reçu.', 422);
    }
    switch ((int) $file['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            fail($tooBig, 413);
        case UPLOAD_ERR_PARTIAL:
            fail("L'envoi a été interrompu. Réessayez.", 400);
        case UPLOAD_ERR_NO_FILE:
            fail('Aucun fichier reçu.', 422);
        default:
            fail("Le serveur n'a pas pu recevoir le fichier (dossier temporaire indisponible).", 500);
    }
    if (!is_uploaded_file($file['tmp_name'])) {
        fail('Fichier invalide.', 422);
    }

    $mime = (string) (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    $mime = MIME_ALIASES[$mime] ?? $mime;
    if (!isset(UPLOAD_TYPES[$mime])) {
        fail('Format non accepté. Images : JPG, PNG, WebP, GIF — vidéos : MP4, WebM, MOV — documents : PDF.', 415);
    }
    [$ext, $kind, $max] = UPLOAD_TYPES[$mime];
    if ($purpose === 'cv' && $kind !== 'document') {
        fail('Le CV doit être un fichier PDF.', 415);
    }
    if ((int) $file['size'] > $max) {
        fail('Fichier trop volumineux (maximum ' . human_size($max) . ' pour ce type de fichier).', 413);
    }
    if ($kind === 'image' && !@getimagesize($file['tmp_name'])) {
        fail('Image illisible ou endommagée.', 422);
    }

    $sub = $purpose === 'cv' ? 'cv' : gmdate('Y/m');
    $dir = ensure_upload_dir($sub);
    $original = clean(basename((string) $file['name']), 190);
    $base = slugify(pathinfo($original, PATHINFO_FILENAME), 60) ?: ($purpose === 'cv' ? 'cv' : $kind);
    $name = $base . '-' . bin2hex(random_bytes(4));
    $target = "$dir/$name.$ext";
    if (!move_uploaded_file($file['tmp_name'], $target)) {
        fail("Le fichier n'a pas pu être enregistré sur le serveur.", 500);
    }
    @chmod($target, 0644);

    $path = "uploads/$sub/$name.$ext";
    $thumb = '';
    $width = $height = 0;
    if ($kind === 'image') {
        [$width, $height, $hasThumb] = process_image($target, $mime, "$dir/$name-thumb.$ext");
        $thumb = $hasThumb ? "uploads/$sub/$name-thumb.$ext" : '';
    }
    clearstatcache(true, $target);
    $size = (int) filesize($target);

    $pdo->prepare('INSERT INTO ' . table('media') . '
        (path, thumb, kind, mime, size, width, height, original_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
        ->execute([$path, $thumb, $kind, $mime, $size, $width, $height, $original, now()]);

    return present_media([
        'id' => $pdo->lastInsertId(), 'path' => $path, 'thumb' => $thumb, 'kind' => $kind, 'mime' => $mime,
        'size' => $size, 'width' => $width, 'height' => $height, 'original_name' => $original, 'created_at' => now(),
    ]);
}

function present_media(array $row, ?string $usage = null): array
{
    $item = [
        'id' => (int) $row['id'],
        'path' => $row['path'],
        'thumb' => $row['thumb'],
        'kind' => $row['kind'],
        'mime' => $row['mime'],
        'size' => (int) $row['size'],
        'width' => (int) $row['width'],
        'height' => (int) $row['height'],
        'name' => $row['original_name'],
        'created_at' => iso($row['created_at']),
    ];
    if ($usage !== null) {
        $item['used'] = str_contains($usage, $row['path']) || ($row['thumb'] !== '' && str_contains($usage, $row['thumb']));
    }
    return $item;
}

/** Supprime un fichier téléversé, uniquement s'il se trouve bien dans le dossier uploads/. */
function delete_upload_file(string $path): void
{
    if ($path === '' || !str_starts_with($path, 'uploads/') || str_contains($path, '..')) {
        return;
    }
    $root = realpath(uploads_dir());
    $file = realpath(uploads_dir() . '/' . substr($path, strlen('uploads/')));
    if ($root && $file && str_starts_with($file, $root . DIRECTORY_SEPARATOR) && is_file($file)) {
        @unlink($file);
    }
}

/* ------------------------------------------------------------------
 * Images
 * ------------------------------------------------------------------ */

/**
 * Remet la photo à l'endroit, la réduit si besoin et crée une miniature.
 * Sans l'extension GD (ou image trop lourde pour la mémoire), le fichier reste tel quel.
 *
 * @return array{0: int, 1: int, 2: bool} largeur, hauteur, miniature créée
 */
function process_image(string $path, string $mime, string $thumbPath): array
{
    $info = @getimagesize($path);
    $width = (int) ($info[0] ?? 0);
    $height = (int) ($info[1] ?? 0);
    $loaders = ['image/jpeg' => 'imagecreatefromjpeg', 'image/png' => 'imagecreatefrompng', 'image/webp' => 'imagecreatefromwebp'];
    $loader = $loaders[$mime] ?? null;
    if (!$loader || !function_exists($loader) || !$width || !$height) {
        return [$width, $height, false];
    }

    // Une image décodée occupe environ 5 octets par pixel, en double pendant le redimensionnement
    @ini_set('memory_limit', '512M');
    $memory = ini_bytes('memory_limit');
    if ($memory !== PHP_INT_MAX && memory_get_usage() + $width * $height * 5 * 2.2 > $memory) {
        return [$width, $height, false];
    }

    $orientation = $mime === 'image/jpeg' ? jpeg_orientation($path) : 1;
    $image = @$loader($path);
    if (!$image) {
        return [$width, $height, false];
    }
    $image = apply_orientation($image, $orientation);
    $width = imagesx($image);
    $height = imagesy($image);

    // JPEG toujours réenregistré : supprime les métadonnées (appareil, position GPS…)
    if ($mime === 'image/jpeg' || $orientation !== 1 || max($width, $height) > IMAGE_MAX_SIDE) {
        $main = resize_image($image, IMAGE_MAX_SIDE);
        save_image($main, $path, $mime, 86);
        $width = imagesx($main);
        $height = imagesy($main);
        $image = $main; // (PHP 8 libère seul les images GD qui ne sont plus référencées)
    }

    $hasThumb = false;
    if (max($width, $height) > THUMB_MAX_SIDE * 1.25) {
        $hasThumb = save_image(resize_image($image, THUMB_MAX_SIDE), $thumbPath, $mime, 80);
    }
    return [$width, $height, $hasThumb];
}

function resize_image(GdImage $src, int $maxSide): GdImage
{
    $w = imagesx($src);
    $h = imagesy($src);
    $scale = $maxSide / max($w, $h);
    if ($scale >= 1) {
        return $src;
    }
    $nw = max(1, (int) round($w * $scale));
    $nh = max(1, (int) round($h * $scale));
    $dst = imagecreatetruecolor($nw, $nh);
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    imagefill($dst, 0, 0, imagecolorallocatealpha($dst, 0, 0, 0, 127));
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);
    return $dst;
}

function save_image(GdImage $image, string $path, string $mime, int $quality): bool
{
    if ($mime === 'image/jpeg') {
        imageinterlace($image, true); // JPEG progressif : s'affiche plus vite
        $ok = imagejpeg($image, $path, $quality);
    } elseif ($mime === 'image/png') {
        $ok = imagepng($image, $path, 6);
    } elseif ($mime === 'image/webp' && function_exists('imagewebp')) {
        $ok = imagewebp($image, $path, $quality);
    } else {
        $ok = false;
    }
    if ($ok) {
        @chmod($path, 0644);
    }
    return $ok;
}

function apply_orientation(GdImage $image, int $orientation): GdImage
{
    if (in_array($orientation, [2, 4, 5, 7], true)) {
        imageflip($image, $orientation === 4 ? IMG_FLIP_VERTICAL : IMG_FLIP_HORIZONTAL);
    }
    // imagerotate tourne dans le sens inverse des aiguilles d'une montre
    $angle = match ($orientation) {
        3 => 180,
        6, 7 => -90,
        5, 8 => 90,
        default => 0,
    };
    if ($angle !== 0) {
        $rotated = imagerotate($image, $angle, 0);
        if ($rotated) {
            return $rotated;
        }
    }
    return $image;
}

/** Orientation EXIF d'un JPEG (1 à 8), lue sans dépendre de l'extension exif. */
function jpeg_orientation(string $file): int
{
    if (function_exists('exif_read_data')) {
        $exif = @exif_read_data($file);
        $value = (int) ($exif['Orientation'] ?? 1);
        return $value >= 1 && $value <= 8 ? $value : 1;
    }
    $fh = @fopen($file, 'rb');
    if (!$fh) {
        return 1;
    }
    try {
        if (fread($fh, 2) !== "\xFF\xD8") {
            return 1;
        }
        while (!feof($fh)) {
            $marker = fread($fh, 4);
            if (strlen($marker) < 4 || $marker[0] !== "\xFF" || $marker[1] === "\xDA") {
                return 1;
            }
            $length = (ord($marker[2]) << 8) | ord($marker[3]);
            if ($length < 2) {
                return 1;
            }
            if ($marker[1] !== "\xE1") {
                fseek($fh, $length - 2, SEEK_CUR);
                continue;
            }
            $segment = (string) fread($fh, $length - 2);
            if (!str_starts_with($segment, "Exif\0\0")) {
                continue;
            }
            $tiff = substr($segment, 6);
            $little = substr($tiff, 0, 2) === 'II';
            $u16 = static function (int $at) use ($tiff, $little): int {
                $b = substr($tiff, $at, 2);
                return strlen($b) < 2 ? 0 : ($little ? ord($b[0]) | (ord($b[1]) << 8) : (ord($b[0]) << 8) | ord($b[1]));
            };
            $u32 = static function (int $at) use ($tiff, $little): int {
                $b = substr($tiff, $at, 4);
                if (strlen($b) < 4) {
                    return 0;
                }
                $bytes = $little ? array_reverse(str_split($b)) : str_split($b);
                return (ord($bytes[0]) << 24) | (ord($bytes[1]) << 16) | (ord($bytes[2]) << 8) | ord($bytes[3]);
            };
            $ifd = $u32(4);
            $count = $u16($ifd);
            for ($i = 0; $i < $count && $i < 200; $i++) {
                $entry = $ifd + 2 + $i * 12;
                if ($u16($entry) === 0x0112) {
                    $value = $u16($entry + 8);
                    return $value >= 1 && $value <= 8 ? $value : 1;
                }
            }
            return 1;
        }
    } finally {
        fclose($fh);
    }
    return 1;
}
