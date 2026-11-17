<?php
declare(strict_types=1);

/**
 * Génère le fichier de configuration de l'API (portfolio-api.config.php).
 *
 *   php scripts/api-setup.php                       configuration locale (XAMPP : root sans mot de passe)
 *   php scripts/api-setup.php --db-name=u123_site --db-user=u123_site --db-pass=... \
 *       --notify=moi@exemple.com --out=portfolio-api.config.prod.php
 *
 * Options :
 *   --user=admin            identifiant du compte administrateur
 *   --password=...          mot de passe admin (sinon un mot de passe est généré et affiché une fois)
 *   --db-host=127.0.0.1     --db-port=3306
 *   --db-name=portfolio_baudoin   --db-user=root   --db-pass=
 *   --prefix=pf_            préfixe des tables
 *   --notify=               adresse email prévenue à chaque message (facultatif)
 *   --rate-limit=5          messages maximum par visiteur et par heure
 *   --out=chemin            fichier à écrire (défaut : portfolio-api.config.php à la racine du projet)
 *   --force                 remplacer le fichier s'il existe déjà
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

$opt = getopt('', [
    'help', 'force', 'user:', 'password:', 'db-host:', 'db-port:', 'db-name:', 'db-user:', 'db-pass:',
    'prefix:', 'notify:', 'rate-limit:', 'out:',
]);

if (isset($opt['help'])) {
    preg_match('#/\*\*(.*?)\*/#s', (string) file_get_contents(__FILE__), $doc);
    echo trim(preg_replace('/^ \* ?/m', '', $doc[1] ?? '')), PHP_EOL;
    exit(0);
}

$out = $opt['out'] ?? dirname(__DIR__) . DIRECTORY_SEPARATOR . 'portfolio-api.config.php';
if (is_file($out) && !isset($opt['force'])) {
    fwrite(STDERR, "Le fichier existe déjà : $out\nAjoutez --force pour le remplacer (le compte admin déjà créé en base n'est pas modifié).\n");
    exit(1);
}

$generated = !isset($opt['password']);
$password = $generated ? rtrim(strtr(base64_encode(random_bytes(15)), '+/', '-_'), '=') : (string) $opt['password'];
if (strlen($password) < 10) {
    fwrite(STDERR, "Le mot de passe doit contenir au moins 10 caractères.\n");
    exit(1);
}

$config = [
    'db' => [
        'host' => $opt['db-host'] ?? '127.0.0.1',
        'port' => (int) ($opt['db-port'] ?? 3306),
        'name' => $opt['db-name'] ?? 'portfolio_baudoin',
        'user' => $opt['db-user'] ?? 'root',
        'pass' => $opt['db-pass'] ?? '',
        'prefix' => $opt['prefix'] ?? 'pf_',
    ],
    'admin' => [
        'username' => $opt['user'] ?? 'admin',
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
    ],
    'app_secret' => bin2hex(random_bytes(24)),
    'notify_email' => $opt['notify'] ?? '',
    'contact_rate_limit' => (int) ($opt['rate-limit'] ?? 5),
    'debug' => false,
];

$php = "<?php\n// Configuration de l'API du portfolio — généré par scripts/api-setup.php.\n"
    . "// Contient des secrets : ne jamais publier ni versionner ce fichier.\n\nreturn "
    . var_export($config, true) . ";\n";

if (file_put_contents($out, $php) === false) {
    fwrite(STDERR, "Impossible d'écrire $out\n");
    exit(1);
}

echo "Configuration écrite : $out\n";
echo "Identifiant admin    : {$config['admin']['username']}\n";
if ($generated) {
    echo "Mot de passe admin   : $password\n";
    echo "(affiché une seule fois — changez-le ensuite depuis l'espace admin)\n";
}
