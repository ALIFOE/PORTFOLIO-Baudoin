<?php
declare(strict_types=1);

/**
 * Définit l'identifiant et le mot de passe du compte administrateur, directement en base.
 * Sert à changer d'identifiants sans passer par l'admin, ou à retrouver l'accès.
 *
 *   php scripts/admin-account.php --user=NOM --password=MOT_DE_PASSE
 *   php scripts/admin-account.php --user=NOM --password=... --config=portfolio-api.config.prod.php
 *
 * Le compte existant est renommé (l'ancien identifiant ne fonctionne plus) ;
 * s'il n'y a encore aucun compte, il est créé. Les tentatives de connexion
 * bloquées sont effacées. Le fichier de configuration est aussi mis à jour
 * (compte créé automatiquement sur une base neuve).
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

$opt = getopt('', ['user:', 'password:', 'config:', 'help']);
if (isset($opt['help']) || empty($opt['user']) || !isset($opt['password'])) {
    preg_match('#/\*\*(.*?)\*/#s', (string) file_get_contents(__FILE__), $doc);
    echo trim(preg_replace('/^ \* ?/m', '', $doc[1] ?? '')), PHP_EOL;
    exit(isset($opt['help']) ? 0 : 1);
}

$username = trim((string) $opt['user']);
$password = (string) $opt['password'];
if (!preg_match('/^[\p{L}\p{N}._@-]{3,60}$/u', $username)) {
    fwrite(STDERR, "Identifiant invalide (3 à 60 caractères : lettres, chiffres, point, tiret, @ ou _).\n");
    exit(1);
}
if (mb_strlen($password) < 10) {
    fwrite(STDERR, "Le mot de passe doit contenir au moins 10 caractères.\n");
    exit(1);
}

$configFile = $opt['config'] ?? dirname(__DIR__) . '/portfolio-api.config.php';
if (!is_file($configFile)) {
    fwrite(STDERR, "Configuration introuvable : $configFile (créez-la avec php scripts/api-setup.php).\n");
    exit(1);
}
putenv('PORTFOLIO_API_CONFIG=' . realpath($configFile));
$_SERVER['SCRIPT_FILENAME'] = __FILE__;
require dirname(__DIR__) . '/public/api/lib/bootstrap.php';
header_remove();

$hash = password_hash($password, PASSWORD_DEFAULT);
$pdo = db();
$admins = table('admins');
$now = now();

$same = $pdo->prepare("SELECT id FROM $admins WHERE username = ?");
$same->execute([$username]);
$id = $same->fetchColumn() ?: $pdo->query("SELECT id FROM $admins ORDER BY id LIMIT 1")->fetchColumn();

if ($id) {
    $pdo->prepare("UPDATE $admins SET username = ?, password_hash = ?, updated_at = ? WHERE id = ?")
        ->execute([$username, $hash, $now, $id]);
    echo "Compte administrateur mis à jour : $username\n";
} else {
    $pdo->prepare("INSERT INTO $admins (username, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?)")
        ->execute([$username, $hash, $now, $now]);
    echo "Compte administrateur créé : $username\n";
}
$pdo->exec('DELETE FROM ' . table('login_attempts'));

// Même identifiant dans la configuration, pour une base neuve
$config = require $configFile;
if (is_array($config)) {
    $config['admin'] = ['username' => $username, 'password_hash' => $hash];
    $php = "<?php\n// Configuration de l'API du portfolio — généré par scripts/api-setup.php.\n"
        . "// Contient des secrets : ne jamais publier ni versionner ce fichier.\n\nreturn "
        . var_export($config, true) . ";\n";
    if (file_put_contents($configFile, $php) !== false) {
        echo "Configuration mise à jour : $configFile\n";
    }
}
