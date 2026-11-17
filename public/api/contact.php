<?php
declare(strict_types=1);

/**
 * POST /api/contact.php — enregistre un message du formulaire de contact.
 * Un message avec au moins un « type de projet » est classé comme demande.
 */

require __DIR__ . '/lib/bootstrap.php';

require_method('POST');
$in = input();

// Champ piège invisible : seuls les robots le remplissent. On répond « OK » sans rien enregistrer.
if (trim((string) ($in['website'] ?? '')) !== '') {
    respond(['ok' => true], 201);
}

$name = clean($in['name'] ?? '', 120);
$email = clean($in['email'] ?? '', 190);
$whatsapp = clean($in['whatsapp'] ?? '', 40);
$message = clean($in['message'] ?? '', 5000, true);

$services = $in['services'] ?? [];
if (is_string($services)) {
    $services = explode(',', $services);
}
$services = is_array($services) ? $services : [];
$services = array_values(array_unique(array_filter(array_map(
    static fn ($s) => str_replace(',', ' ', clean($s, 60)),
    array_slice($services, 0, 10),
))));
$servicesText = mb_substr(implode(', ', $services), 0, 255);

if (mb_strlen($name) < 2) {
    fail('Veuillez entrer votre nom complet.', 422, ['field' => 'name']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('Veuillez entrer une adresse email valide.', 422, ['field' => 'email']);
}
if ($whatsapp !== '' && !preg_match('/^\+?[0-9 ().\-]{6,40}$/', $whatsapp)) {
    fail('Le numéro WhatsApp ne semble pas valide.', 422, ['field' => 'whatsapp']);
}
if (mb_strlen($message) < 10) {
    fail('Le message doit contenir au moins 10 caractères.', 422, ['field' => 'message']);
}

$pdo = db();
$ipHash = client_hash();

// Limite d'envois par visiteur et par heure
$limit = max(1, (int) config('contact_rate_limit', 5));
$recent = $pdo->prepare('SELECT COUNT(*) FROM ' . table('messages') . ' WHERE ip_hash = ? AND created_at > ?');
$recent->execute([$ipHash, gmdate('Y-m-d H:i:s', time() - 3600)]);
if ((int) $recent->fetchColumn() >= $limit) {
    fail('Vous avez déjà envoyé plusieurs messages. Merci de réessayer un peu plus tard.', 429);
}

$kind = $services ? 'demande' : 'contact';
$now = now();
$insert = $pdo->prepare('INSERT INTO ' . table('messages') . '
    (kind, name, email, whatsapp, services, message, status, ip_hash, user_agent, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
$insert->execute([
    $kind, $name, $email, $whatsapp, $servicesText, $message, 'new',
    $ipHash, clean($_SERVER['HTTP_USER_AGENT'] ?? '', 255), $now, $now,
]);
$id = (int) $pdo->lastInsertId();

// Notification par email (facultative) : le message reste de toute façon consultable dans l'admin
$notify = (string) config('notify_email', '');
if ($notify !== '' && filter_var($notify, FILTER_VALIDATE_EMAIL)) {
    $host = preg_replace('/[^A-Za-z0-9.\-]/', '', explode(':', $_SERVER['HTTP_HOST'] ?? 'localhost')[0]) ?: 'localhost';
    $from = (string) config('mail_from', 'no-reply@' . $host);
    $subject = ($kind === 'demande' ? 'Nouvelle demande : ' . $servicesText : 'Nouveau message de contact') . ' — ' . $name;
    $body = "Nom : $name\nEmail : $email\n"
        . ($whatsapp !== '' ? "WhatsApp : $whatsapp\n" : '')
        . ($servicesText !== '' ? "Type de projet : $servicesText\n" : '')
        . "\n$message\n\n-- \nMessage n° $id reçu depuis le formulaire du portfolio.";
    $headers = [
        'From' => $from,
        'Reply-To' => $email,
        'MIME-Version' => '1.0',
        'Content-Type' => 'text/plain; charset=UTF-8',
        'Content-Transfer-Encoding' => '8bit',
    ];
    try {
        @mail($notify, mb_encode_mimeheader($subject, 'UTF-8'), $body, $headers);
    } catch (Throwable $e) {
        error_log('[portfolio-api] notification email impossible : ' . $e->getMessage());
    }
}

respond(['ok' => true, 'id' => $id], 201);
