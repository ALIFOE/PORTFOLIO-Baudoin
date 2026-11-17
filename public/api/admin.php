<?php
declare(strict_types=1);

/**
 * /api/admin.php?action=… — espace d'administration.
 *
 *   session       GET   état de la session
 *   login         POST  { username, password }
 *   logout        POST
 *   account       POST  { current, username?, new? }   identifiant et/ou mot de passe
 *
 *   Messages du formulaire de contact
 *   list          GET   ?status=active|new|read|done|archived &kind= &q= &page= &per_page=
 *   update        POST  { ids: [..], status?, note? }
 *   delete        POST  { ids: [..] }
 *   export        GET   mêmes filtres que list, renvoie un fichier CSV
 *
 *   Contenu du site (À propos, domaines, expérience, compétences, formation, projets, CV)
 *   content       GET   sections enregistrées { section: { data, version, updated_at } }
 *   save          POST  { section, data, base }   base = version chargée (null si jamais enregistrée)
 *   reset         POST  { section }               revient au contenu d'origine du site
 *
 *   Fichiers
 *   upload        POST  multipart : file, purpose=media|cv
 *   media         GET   ?kind=image|video|document
 *   media_delete  POST  { ids: [..], force? }
 *
 * Toutes les actions sauf session/login exigent une session ouverte ;
 * toutes les actions POST sauf login exigent en plus l'en-tête X-CSRF-Token.
 */

require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/content.php';
require __DIR__ . '/lib/uploads.php';

const STATUSES = ['new', 'read', 'done', 'archived'];
const KINDS = ['contact', 'demande'];
const SESSION_IDLE_SECONDS = 7200;
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_SECONDS = 900;

start_admin_session();

$action = (string) ($_GET['action'] ?? '');

switch ($action) {
    case 'session':
        require_method('GET');
        respond(session_payload());

    case 'login':
        require_method('POST');
        action_login();

    case 'logout':
        require_method('POST');
        require_admin();
        require_csrf();
        $_SESSION = [];
        session_regenerate_id(true);
        respond(['ok' => true, 'authenticated' => false]);

    case 'list':
        require_method('GET');
        require_admin();
        action_list();

    case 'update':
        require_method('POST');
        require_admin();
        require_csrf();
        action_update();

    case 'delete':
        require_method('POST');
        require_admin();
        require_csrf();
        action_delete();

    case 'export':
        require_method('GET');
        require_admin();
        action_export();

    case 'account':
        require_method('POST');
        require_admin();
        require_csrf();
        action_account();

    case 'content':
        require_method('GET');
        require_admin();
        respond(['ok' => true, 'sections' => (object) stored_sections(db())]);

    case 'save':
        require_method('POST');
        require_admin();
        require_csrf();
        action_save();

    case 'reset':
        require_method('POST');
        require_admin();
        require_csrf();
        action_reset();

    case 'upload':
        require_method('POST');
        require_admin();
        require_csrf();
        $purpose = ($_POST['purpose'] ?? '') === 'cv' ? 'cv' : 'media';
        respond(['ok' => true, 'item' => handle_upload(db(), $purpose)], 201);

    case 'media':
        require_method('GET');
        require_admin();
        action_media();

    case 'media_delete':
        require_method('POST');
        require_admin();
        require_csrf();
        action_media_delete();

    default:
        fail('Action inconnue.', 404);
}

/* ------------------------------------------------------------------
 * Session
 * ------------------------------------------------------------------ */
function start_admin_session(): void
{
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';

    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_name('pf_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $https,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();

    if (isset($_SESSION['admin_id'])) {
        if (time() - (int) ($_SESSION['seen'] ?? 0) > SESSION_IDLE_SECONDS) {
            $_SESSION = [];
            session_regenerate_id(true);
        } else {
            $_SESSION['seen'] = time();
        }
    }
}

function session_payload(): array
{
    $ok = isset($_SESSION['admin_id']);
    return [
        'ok' => true,
        'authenticated' => $ok,
        'username' => $ok ? (string) $_SESSION['username'] : null,
        'csrf' => $ok ? (string) $_SESSION['csrf'] : null,
        // Taille maximale d'un fichier envoyé, pour prévenir avant d'envoyer
        'upload_limit' => $ok ? min(upload_limit(), 2 ** 53) : null,
    ];
}

function require_admin(): void
{
    if (!isset($_SESSION['admin_id'])) {
        fail('Session expirée. Merci de vous reconnecter.', 401, ['code' => 'unauthenticated']);
    }
}

function require_csrf(): void
{
    $sent = (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    if ($sent === '' || !hash_equals((string) ($_SESSION['csrf'] ?? ''), $sent)) {
        fail('Jeton de sécurité invalide. Rechargez la page.', 403, ['code' => 'csrf']);
    }
}

/** Crée le premier compte à partir du fichier de configuration si la table est vide. */
function seed_admin(PDO $pdo): void
{
    if ((int) $pdo->query('SELECT COUNT(*) FROM ' . table('admins'))->fetchColumn() > 0) {
        return;
    }
    $username = clean(config('admin.username', ''), 60);
    $hash = (string) config('admin.password_hash', '');
    if ($username === '' || $hash === '' || password_get_info($hash)['algo'] === null) {
        return;
    }
    $now = now();
    $pdo->prepare('INSERT INTO ' . table('admins') . ' (username, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?)')
        ->execute([$username, $hash, $now, $now]);
}

function action_login(): never
{
    $in = input();
    $username = clean($in['username'] ?? '', 60);
    $password = is_string($in['password'] ?? null) ? $in['password'] : '';

    $pdo = db();
    seed_admin($pdo);

    $ip = client_hash();
    $attempts = table('login_attempts');
    $pdo->prepare("DELETE FROM $attempts WHERE attempted_at < ?")->execute([gmdate('Y-m-d H:i:s', time() - 86400)]);

    $recent = $pdo->prepare("SELECT COUNT(*) FROM $attempts WHERE ip_hash = ? AND attempted_at > ?");
    $recent->execute([$ip, gmdate('Y-m-d H:i:s', time() - LOGIN_WINDOW_SECONDS)]);
    if ((int) $recent->fetchColumn() >= LOGIN_MAX_ATTEMPTS) {
        fail('Trop de tentatives. Réessayez dans quelques minutes.', 429);
    }

    $find = $pdo->prepare('SELECT id, username, password_hash FROM ' . table('admins') . ' WHERE username = ?');
    $find->execute([$username]);
    $admin = $find->fetch() ?: null;

    // Hachage factice : le temps de réponse ne révèle pas si l'identifiant existe
    $hash = $admin['password_hash'] ?? '$2y$10$abcdefghijklmnopqrstuuJ8Q0m0Uu0x7m9o0wJ9b3o2r7g1k5y8e';
    $valid = password_verify($password, $hash) && $admin !== null;

    if (!$valid) {
        $pdo->prepare("INSERT INTO $attempts (ip_hash, attempted_at) VALUES (?, ?)")->execute([$ip, now()]);
        usleep(300000);
        fail('Identifiant ou mot de passe incorrect.', 401);
    }

    $pdo->prepare("DELETE FROM $attempts WHERE ip_hash = ?")->execute([$ip]);
    if (password_needs_rehash($admin['password_hash'], PASSWORD_DEFAULT)) {
        $pdo->prepare('UPDATE ' . table('admins') . ' SET password_hash = ?, updated_at = ? WHERE id = ?')
            ->execute([password_hash($password, PASSWORD_DEFAULT), now(), $admin['id']]);
    }

    session_regenerate_id(true);
    $_SESSION = [
        'admin_id' => (int) $admin['id'],
        'username' => (string) $admin['username'],
        'csrf' => bin2hex(random_bytes(32)),
        'seen' => time(),
    ];
    respond(session_payload());
}

/** Change l'identifiant et/ou le mot de passe ; le mot de passe actuel est toujours exigé. */
function action_account(): never
{
    $in = input();
    $current = is_string($in['current'] ?? null) ? $in['current'] : '';
    $new = is_string($in['new'] ?? null) ? $in['new'] : '';
    $username = clean($in['username'] ?? '', 60);
    $admins = table('admins');
    $id = (int) $_SESSION['admin_id'];

    $changeName = $username !== '' && $username !== (string) $_SESSION['username'];
    if ($changeName && !preg_match('/^[\p{L}\p{N}._@-]{3,60}$/u', $username)) {
        fail("L'identifiant doit faire 3 à 60 caractères : lettres, chiffres, point, tiret, @ ou _.", 422, ['field' => 'username']);
    }
    if ($new !== '' && (mb_strlen($new) < 10 || strlen($new) > 200)) {
        fail('Le nouveau mot de passe doit contenir au moins 10 caractères.', 422, ['field' => 'new']);
    }
    if (!$changeName && $new === '') {
        fail('Aucune modification demandée.', 422);
    }

    $pdo = db();
    $find = $pdo->prepare("SELECT password_hash FROM $admins WHERE id = ?");
    $find->execute([$id]);
    $hash = (string) $find->fetchColumn();
    if ($hash === '' || !password_verify($current, $hash)) {
        usleep(300000);
        fail('Le mot de passe actuel est incorrect.', 422, ['field' => 'current']);
    }

    if ($changeName) {
        $taken = $pdo->prepare("SELECT COUNT(*) FROM $admins WHERE username = ? AND id <> ?");
        $taken->execute([$username, $id]);
        if ((int) $taken->fetchColumn() > 0) {
            fail('Cet identifiant est déjà utilisé.', 422, ['field' => 'username']);
        }
        $pdo->prepare("UPDATE $admins SET username = ?, updated_at = ? WHERE id = ?")->execute([$username, now(), $id]);
        $_SESSION['username'] = $username;
    }
    if ($new !== '') {
        $pdo->prepare("UPDATE $admins SET password_hash = ?, updated_at = ? WHERE id = ?")
            ->execute([password_hash($new, PASSWORD_DEFAULT), now(), $id]);
    }
    session_regenerate_id(true);
    respond(session_payload());
}

/* ------------------------------------------------------------------
 * Contenu du site
 * ------------------------------------------------------------------ */
function input_section(array $in): string
{
    $section = (string) ($in['section'] ?? '');
    if (!isset(content_schemas()[$section])) {
        fail('Section inconnue.', 422);
    }
    return $section;
}

function action_save(): never
{
    $in = input(8 * 1048576);
    $section = input_section($in);
    if (!is_array($in['data'] ?? null)) {
        fail('Contenu manquant.', 422);
    }
    $data = finalize_section($section, sanitize($in['data'], content_schemas()[$section]));
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    if (strlen($json) > 8 * 1048576) {
        fail('Contenu trop volumineux.', 413);
    }

    $pdo = db();
    $contents = table('content');
    $pdo->beginTransaction();
    try {
        $row = $pdo->prepare("SELECT version FROM $contents WHERE section = ? FOR UPDATE");
        $row->execute([$section]);
        $current = $row->fetchColumn();
        $current = $current === false ? null : (int) $current;
        $base = isset($in['base']) && is_numeric($in['base']) ? (int) $in['base'] : null;

        // Enregistrement fait entre-temps ailleurs (autre onglet, autre appareil) : on n'écrase rien
        if ($current !== $base) {
            $pdo->rollBack();
            fail(
                'Cette section a été modifiée entre-temps (dans un autre onglet ?). Rechargez-la pour récupérer la dernière version avant de modifier.',
                409,
                ['code' => 'conflict'],
            );
        }

        $version = ($current ?? 0) + 1;
        $now = now();
        if ($current === null) {
            $pdo->prepare("INSERT INTO $contents (section, data, version, updated_at) VALUES (?, ?, ?, ?)")
                ->execute([$section, $json, $version, $now]);
        } else {
            $pdo->prepare("UPDATE $contents SET data = ?, version = ?, updated_at = ? WHERE section = ?")
                ->execute([$json, $version, $now, $section]);
        }
        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }

    respond(['ok' => true, 'section' => $section, 'data' => $data, 'version' => $version, 'updated_at' => iso($now)]);
}

function action_reset(): never
{
    $section = input_section(input());
    db()->prepare('DELETE FROM ' . table('content') . ' WHERE section = ?')->execute([$section]);
    respond(['ok' => true, 'section' => $section]);
}

/* ------------------------------------------------------------------
 * Fichiers
 * ------------------------------------------------------------------ */
function action_media(): never
{
    $pdo = db();
    $kind = (string) ($_GET['kind'] ?? '');
    $media = table('media');
    if (in_array($kind, ['image', 'video', 'document'], true)) {
        $rows = $pdo->prepare("SELECT * FROM $media WHERE kind = ? ORDER BY id DESC LIMIT 2000");
        $rows->execute([$kind]);
    } else {
        $rows = $pdo->query("SELECT * FROM $media ORDER BY id DESC LIMIT 2000");
    }
    $usage = content_blob($pdo);
    respond([
        'ok' => true,
        'items' => array_map(static fn ($r) => present_media($r, $usage), $rows->fetchAll()),
        'upload_limit' => min(upload_limit(), 2 ** 53),
    ]);
}

function action_media_delete(): never
{
    $in = input();
    $ids = input_ids($in, 'Aucun fichier sélectionné.');
    $pdo = db();
    $media = table('media');
    $marks = implode(',', array_fill(0, count($ids), '?'));
    $rows = $pdo->prepare("SELECT * FROM $media WHERE id IN ($marks)");
    $rows->execute($ids);
    $rows = $rows->fetchAll();

    // Un fichier encore affiché sur le site n'est supprimé que si on le confirme
    if (empty($in['force'])) {
        $usage = content_blob($pdo);
        $used = array_filter($rows, static fn ($r) => present_media($r, $usage)['used']);
        if ($used) {
            fail(
                count($used) > 1 ? 'Ces fichiers sont encore utilisés sur le site.' : 'Ce fichier est encore utilisé sur le site.',
                409,
                ['code' => 'in_use', 'ids' => array_map(static fn ($r) => (int) $r['id'], array_values($used))],
            );
        }
    }

    foreach ($rows as $row) {
        delete_upload_file($row['path']);
        delete_upload_file($row['thumb']);
    }
    $pdo->prepare("DELETE FROM $media WHERE id IN ($marks)")->execute($ids);
    respond(['ok' => true, 'deleted' => count($rows)]);
}

/* ------------------------------------------------------------------
 * Messages
 * ------------------------------------------------------------------ */

/** @return array{0: string, 1: array} clause WHERE + paramètres */
function build_filters(): array
{
    $where = [];
    $params = [];

    $status = (string) ($_GET['status'] ?? 'active');
    if (in_array($status, STATUSES, true)) {
        $where[] = 'status = ?';
        $params[] = $status;
    } else {
        // « Boîte de réception » : tout sauf les archives
        $where[] = "status <> 'archived'";
    }

    $kind = (string) ($_GET['kind'] ?? '');
    if (in_array($kind, KINDS, true)) {
        $where[] = 'kind = ?';
        $params[] = $kind;
    }

    $q = clean($_GET['q'] ?? '', 100);
    if ($q !== '') {
        $like = '%' . addcslashes($q, '\\%_') . '%';
        $where[] = '(name LIKE ? OR email LIKE ? OR whatsapp LIKE ? OR services LIKE ? OR message LIKE ?)';
        array_push($params, $like, $like, $like, $like, $like);
    }

    return [implode(' AND ', $where), $params];
}

function present(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'kind' => $row['kind'],
        'name' => $row['name'],
        'email' => $row['email'],
        'whatsapp' => $row['whatsapp'],
        'services' => $row['services'] === '' ? [] : explode(', ', $row['services']),
        'message' => $row['message'],
        'status' => $row['status'],
        'note' => (string) ($row['note'] ?? ''),
        'created_at' => iso($row['created_at']),
        'updated_at' => iso($row['updated_at']),
    ];
}

function counts(PDO $pdo): array
{
    $counts = ['active' => 0, 'new' => 0, 'read' => 0, 'done' => 0, 'archived' => 0, 'contact' => 0, 'demande' => 0, 'total' => 0];
    foreach ($pdo->query('SELECT status, kind, COUNT(*) AS c FROM ' . table('messages') . ' GROUP BY status, kind') as $row) {
        $c = (int) $row['c'];
        $counts[$row['status']] += $c;
        $counts['total'] += $c;
        if ($row['status'] !== 'archived') {
            $counts['active'] += $c;
            $counts[$row['kind']] += $c;
        }
    }
    return $counts;
}

function action_list(): never
{
    $pdo = db();
    [$where, $params] = build_filters();
    $messages = table('messages');

    $perPage = min(100, max(5, (int) ($_GET['per_page'] ?? 20)));
    $count = $pdo->prepare("SELECT COUNT(*) FROM $messages WHERE $where");
    $count->execute($params);
    $total = (int) $count->fetchColumn();
    $pages = max(1, (int) ceil($total / $perPage));
    $page = min($pages, max(1, (int) ($_GET['page'] ?? 1)));
    $offset = ($page - 1) * $perPage;

    $rows = $pdo->prepare("SELECT id, kind, name, email, whatsapp, services, message, status, note, created_at, updated_at
        FROM $messages WHERE $where ORDER BY created_at DESC, id DESC LIMIT $perPage OFFSET $offset");
    $rows->execute($params);

    respond([
        'ok' => true,
        'items' => array_map('present', $rows->fetchAll()),
        'total' => $total,
        'page' => $page,
        'pages' => $pages,
        'per_page' => $perPage,
        'counts' => counts($pdo),
    ]);
}

/** @return int[] identifiants valides envoyés dans { ids: [...] } */
function input_ids(array $in, string $empty = "Aucun message sélectionné."): array
{
    $ids = $in['ids'] ?? [];
    $ids = is_array($ids) ? $ids : [$ids];
    $ids = array_values(array_unique(array_filter(array_map('intval', array_slice($ids, 0, 200)), static fn ($id) => $id > 0)));
    if (!$ids) {
        fail($empty, 422);
    }
    return $ids;
}

function action_update(): never
{
    $in = input();
    $ids = input_ids($in);
    $set = [];
    $params = [];

    if (array_key_exists('status', $in)) {
        if (!in_array($in['status'], STATUSES, true)) {
            fail('Statut inconnu.', 422, ['field' => 'status']);
        }
        $set[] = 'status = ?';
        $params[] = $in['status'];
    }
    if (array_key_exists('note', $in)) {
        if (count($ids) !== 1) {
            fail('Une note ne peut être enregistrée que sur un seul message.', 422, ['field' => 'note']);
        }
        $set[] = 'note = ?';
        $params[] = clean($in['note'], 5000, true);
    }
    if (!$set) {
        fail('Aucune modification demandée.', 422);
    }

    $pdo = db();
    $set[] = 'updated_at = ?';
    $params[] = now();
    $marks = implode(',', array_fill(0, count($ids), '?'));
    $messages = table('messages');
    $pdo->prepare("UPDATE $messages SET " . implode(', ', $set) . " WHERE id IN ($marks)")->execute([...$params, ...$ids]);

    $rows = $pdo->prepare("SELECT id, kind, name, email, whatsapp, services, message, status, note, created_at, updated_at
        FROM $messages WHERE id IN ($marks)");
    $rows->execute($ids);

    respond(['ok' => true, 'items' => array_map('present', $rows->fetchAll()), 'counts' => counts($pdo)]);
}

function action_delete(): never
{
    $ids = input_ids(input());
    $pdo = db();
    $marks = implode(',', array_fill(0, count($ids), '?'));
    $delete = $pdo->prepare('DELETE FROM ' . table('messages') . " WHERE id IN ($marks)");
    $delete->execute($ids);
    respond(['ok' => true, 'deleted' => $delete->rowCount(), 'counts' => counts($pdo)]);
}

function action_export(): never
{
    $pdo = db();
    [$where, $params] = build_filters();
    $rows = $pdo->prepare('SELECT id, created_at, kind, status, name, email, whatsapp, services, message, note
        FROM ' . table('messages') . " WHERE $where ORDER BY created_at DESC, id DESC");
    $rows->execute($params);

    $labels = [
        'contact' => 'Contact', 'demande' => 'Demande de projet',
        'new' => 'Nouveau', 'read' => 'Lu', 'done' => 'Traité', 'archived' => 'Archivé',
    ];
    // Un tableur ne doit jamais interpréter une cellule saisie par un visiteur comme une formule
    $safe = static fn (string $v): string => preg_match('/^[=+\-@\t\r]/', $v) ? "'" . $v : $v;

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="messages-' . gmdate('Ymd-His') . '.csv"');

    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF"); // BOM : accents corrects à l'ouverture dans Excel
    fputcsv($out, ['N°', 'Date (UTC)', 'Type', 'Statut', 'Nom', 'Email', 'WhatsApp', 'Type de projet', 'Message', 'Note interne'], ';', '"', '');
    while ($row = $rows->fetch()) {
        fputcsv($out, [
            $row['id'],
            $row['created_at'],
            $labels[$row['kind']] ?? $row['kind'],
            $labels[$row['status']] ?? $row['status'],
            $safe($row['name']),
            $safe($row['email']),
            $row['whatsapp'], // déjà limité aux chiffres et signes d'un numéro à l'enregistrement
            $safe($row['services']),
            $safe($row['message']),
            $safe((string) $row['note']),
        ], ';', '"', '');
    }
    fclose($out);
    exit;
}
