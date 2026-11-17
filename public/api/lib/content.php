<?php
declare(strict_types=1);

/**
 * Contenu du site modifiable depuis l'administration.
 *
 * Chaque section (profil, domaines, expérience…) est enregistrée en JSON dans la
 * table « content ». Le site part de son contenu par défaut (src/data/portfolio.js)
 * et le remplace section par section par ce qui est enregistré ici.
 *
 * Tout passe par un schéma : champs inconnus ignorés, textes nettoyés et bornés,
 * liens et chemins de fichiers limités à des formes sûres. Le site affiche ces
 * données comme du texte (jamais comme du HTML).
 */

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    http_response_code(404);
    exit;
}

/** Types de champ du schéma. */
final class Field
{
    public static function str(int $max = 200): array { return ['t' => 'str', 'max' => $max]; }
    public static function text(int $max = 5000): array { return ['t' => 'text', 'max' => $max]; }
    public static function int(int $min, int $max): array { return ['t' => 'int', 'min' => $min, 'max' => $max]; }
    public static function bool(): array { return ['t' => 'bool']; }
    public static function enum(string ...$values): array { return ['t' => 'enum', 'values' => $values]; }
    /** Lien http(s) */
    public static function url(): array { return ['t' => 'url']; }
    /** Image, vidéo ou document : asset:…, uploads/…, docs/… ou https://… */
    public static function media(): array { return ['t' => 'media']; }
    /** Classes Font Awesome (« fa-solid fa-code ») */
    public static function icon(): array { return ['t' => 'icon']; }
    public static function slug(): array { return ['t' => 'slug']; }
    public static function list(array $item, int $max = 50): array { return ['t' => 'list', 'item' => $item, 'max' => $max]; }
    public static function obj(array $fields): array { return ['t' => 'obj', 'fields' => $fields]; }
}

const PROJECT_CATEGORIES = ['web', 'application', 'mobile', 'design'];

/** @return array<string, array> schéma de chaque section */
function content_schemas(): array
{
    static $schemas = null;
    if ($schemas !== null) {
        return $schemas;
    }

    $lines = static fn (int $max = 20, int $len = 300) => Field::list(Field::str($len), $max);
    $job = Field::obj([
        'role' => Field::str(160),
        'company' => Field::str(160),
        'period' => Field::str(80),
        'current' => Field::bool(),
        'logo' => Field::media(),
        'tasks' => $lines(15),
        'reference' => Field::obj([
            'name' => Field::str(120),
            'role' => Field::str(160),
            'email' => Field::str(190),
            'phones' => $lines(5, 40),
        ]),
    ]);

    return $schemas = [
        'profile' => Field::obj([
            'fullName' => Field::str(120),
            'shortName' => Field::str(80),
            'logoText' => Field::str(40),
            'role' => Field::str(160),
            'title' => Field::str(200),
            'headline' => Field::str(200),
            'tagline' => Field::str(200),
            'intro' => Field::text(1200),
            'location' => Field::str(120),
            'email' => Field::str(190),
            'phone' => Field::str(40),
            'whatsapp' => Field::str(40),
            'linkedin' => Field::url(),
            'github' => Field::url(),
            'facebook' => Field::url(),
            'instagram' => Field::url(),
            'youtube' => Field::url(),
            'photos' => Field::obj([
                'hero' => Field::media(),
                'portrait' => Field::media(),
                'about' => Field::media(),
                'contact' => Field::media(),
            ]),
            'stats' => Field::list(Field::obj([
                'value' => Field::int(0, 1000000),
                'suffix' => Field::str(10),
                'label' => Field::str(80),
                'icon' => Field::icon(),
            ]), 6),
            'interests' => Field::list(Field::obj(['label' => Field::str(60), 'icon' => Field::icon()]), 12),
            'availability' => Field::list(Field::obj(['day' => Field::str(60), 'hours' => Field::str(60)]), 7),
            'about' => Field::obj([
                'profile' => Field::list(Field::text(2000), 10),
                'vision' => Field::list(Field::text(2000), 10),
            ]),
        ]),

        'cv' => Field::obj([
            'file' => Field::media(),
            'name' => Field::str(160),
            'updatedAt' => Field::str(40),
        ]),

        'domains' => Field::list(Field::obj([
            'slug' => Field::slug(),
            'title' => Field::str(120),
            'shortTitle' => Field::str(80),
            'icon' => Field::icon(),
            'tagline' => Field::str(240),
            'description' => Field::text(4000),
            'cover' => Field::media(),
            'services' => $lines(20, 200),
            'tools' => $lines(30, 80),
            'media' => Field::list(Field::obj([
                'type' => Field::enum('image', 'video'),
                'src' => Field::media(),
                'thumb' => Field::media(),
                'poster' => Field::media(),
                'url' => Field::url(),
                'title' => Field::str(160),
                'text' => Field::text(1500),
            ]), 500),
        ]), 6),

        'experience' => Field::obj([
            'experiences' => Field::list($job, 40),
            'volunteering' => Field::list($job, 20),
            'keySkills' => Field::list(Field::obj([
                'title' => Field::str(80),
                'icon' => Field::icon(),
                'text' => Field::text(500),
            ]), 12),
            'organizations' => Field::list(Field::obj(['name' => Field::str(120), 'logo' => Field::media()]), 24),
        ]),

        'skills' => Field::obj([
            'groups' => Field::list(Field::obj([
                'title' => Field::str(80),
                'icon' => Field::icon(),
                'skills' => Field::list(Field::obj(['name' => Field::str(80), 'level' => Field::int(0, 100)]), 15),
            ]), 8),
            'designTools' => $lines(30, 60),
            'toolbox' => Field::list(Field::obj([
                'title' => Field::str(80),
                'icon' => Field::icon(),
                'items' => Field::str(300),
            ]), 12),
            'languages' => Field::list(Field::obj([
                'name' => Field::str(40),
                'level' => Field::str(60),
                'value' => Field::int(0, 100),
            ]), 8),
        ]),

        'education' => Field::obj([
            'education' => Field::list(Field::obj([
                'title' => Field::str(160),
                'school' => Field::str(160),
                'period' => Field::str(60),
                'current' => Field::bool(),
                'summary' => Field::text(600),
                'topics' => $lines(12, 160),
            ]), 20),
            'certifications' => Field::list(Field::obj([
                'title' => Field::str(160),
                'issuer' => Field::str(160),
                'year' => Field::str(20),
                'logo' => Field::media(),
                'text' => Field::text(800),
            ]), 30),
            'continuousLearning' => Field::obj([
                'text' => Field::text(1200),
                'topics' => $lines(20, 80),
            ]),
        ]),

        'projects' => Field::list(Field::obj([
            'slug' => Field::slug(),
            'title' => Field::str(120),
            'subtitle' => Field::str(120),
            'category' => Field::enum(...PROJECT_CATEGORIES),
            'domain' => Field::slug(),
            'image' => Field::media(),
            'gallery' => Field::list(Field::media(), 20),
            'excerpt' => Field::text(500),
            'description' => Field::text(5000),
            'highlights' => $lines(10, 160),
            'technologies' => $lines(20, 60),
            'features' => $lines(20, 240),
            'demoUrl' => Field::url(),
            'featured' => Field::bool(),
        ]), 100),
    ];
}

/** Nettoie une valeur selon son schéma (les champs absents prennent une valeur vide). */
function sanitize(mixed $value, array $field): mixed
{
    switch ($field['t']) {
        case 'str':
            return clean($value, $field['max']);
        case 'text':
            return clean($value, $field['max'], true);
        case 'int':
            $n = is_numeric($value) ? (int) round((float) $value) : $field['min'];
            return max($field['min'], min($field['max'], $n));
        case 'bool':
            return $value === true || $value === 1 || $value === '1' || $value === 'true';
        case 'enum':
            return in_array($value, $field['values'], true) ? $value : $field['values'][0];
        case 'icon':
            $icon = strtolower(clean($value, 80));
            return preg_match('/^[a-z0-9 -]+$/', $icon) ? $icon : '';
        case 'slug':
            return slugify(clean($value, 120));
        case 'url':
            return safe_url(clean($value, 500));
        case 'media':
            return safe_media(clean($value, 500));
        case 'list':
            if (!is_array($value) || !array_is_list($value)) {
                return [];
            }
            $items = [];
            foreach (array_slice($value, 0, $field['max']) as $item) {
                $item = sanitize($item, $field['item']);
                if (!is_blank($item, $field['item'])) {
                    $items[] = $item;
                }
            }
            return $items;
        case 'obj':
            $value = is_array($value) ? $value : [];
            $out = [];
            foreach ($field['fields'] as $key => $sub) {
                $out[$key] = sanitize($value[$key] ?? null, $sub);
            }
            return $out;
    }
    return null;
}

/** Un élément de liste sans aucun texte (nombres et cases à cocher ignorés) est retiré. */
function is_blank(mixed $value, array $field): bool
{
    return match ($field['t']) {
        'int', 'bool', 'enum' => true,
        'list' => array_reduce($value, static fn (bool $c, $v) => $c && is_blank($v, $field['item']), true),
        'obj' => array_reduce(array_keys($field['fields']), static fn (bool $c, $k) => $c && is_blank($value[$k], $field['fields'][$k]), true),
        default => $value === '',
    };
}

/** Lien http(s) uniquement ; « exemple.com » devient « https://exemple.com ». */
function safe_url(string $url): string
{
    if ($url === '') {
        return '';
    }
    if (!preg_match('~^https?://~i', $url)) {
        $url = 'https://' . $url;
    }
    return filter_var($url, FILTER_VALIDATE_URL) && preg_match('~^https?://[^\s/?#:]+\.[^\s/?#]+~i', $url) ? $url : '';
}

/** Référence de fichier : image du site, fichier téléversé, document du site ou URL https. */
function safe_media(string $ref): string
{
    if ($ref === '' || str_contains($ref, '..')) {
        return '';
    }
    if (preg_match('~^asset:[a-z0-9][a-z0-9/_.-]*$~i', $ref) || preg_match('~^(uploads|docs)/[A-Za-z0-9][A-Za-z0-9/_.-]*$~', $ref)) {
        return $ref;
    }
    return preg_match('~^https://~i', $ref) && filter_var($ref, FILTER_VALIDATE_URL) ? $ref : '';
}

/** Règles propres à certaines sections, appliquées après le nettoyage. */
function finalize_section(string $section, array $data): array
{
    if ($section === 'domains' || $section === 'projects') {
        // Identifiants d'URL uniques, déduits du titre s'ils sont vides
        $seen = [];
        foreach ($data as &$item) {
            $base = $item['slug'] !== '' ? $item['slug'] : slugify($item['title']);
            $base = $base !== '' ? $base : ($section === 'domains' ? 'domaine' : 'projet');
            $slug = $base;
            for ($n = 2; isset($seen[$slug]); $n++) {
                $slug = "$base-$n";
            }
            $seen[$slug] = true;
            $item['slug'] = $slug;
        }
        unset($item);
    }
    if ($section === 'domains') {
        foreach ($data as &$domain) {
            // Un média sans fichier ni lien n'a rien à afficher
            $domain['media'] = array_values(array_filter($domain['media'], static fn ($m) => $m['src'] !== '' || $m['url'] !== ''));
        }
        unset($domain);
    }
    return $data;
}

/**
 * Sections enregistrées, nettoyées avec le schéma actuel (un champ ajouté depuis
 * le dernier enregistrement apparaît vide plutôt qu'absent).
 *
 * @return array<string, array{data: array, version: int, updated_at: ?string}>
 */
function stored_sections(PDO $pdo): array
{
    $schemas = content_schemas();
    $out = [];
    foreach ($pdo->query('SELECT section, data, version, updated_at FROM ' . table('content')) as $row) {
        if (!isset($schemas[$row['section']])) {
            continue;
        }
        $data = json_decode((string) $row['data'], true);
        if (!is_array($data)) {
            continue;
        }
        $out[$row['section']] = [
            'data' => sanitize($data, $schemas[$row['section']]),
            'version' => (int) $row['version'],
            'updated_at' => iso($row['updated_at']),
        ];
    }
    return $out;
}

/** Tout le contenu enregistré, en une chaîne : sert à savoir si un fichier est encore utilisé. */
function content_blob(PDO $pdo): string
{
    return implode("\n", $pdo->query('SELECT data FROM ' . table('content'))->fetchAll(PDO::FETCH_COLUMN));
}
