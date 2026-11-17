<?php
declare(strict_types=1);

/**
 * GET /api/content.php — contenu du site modifié depuis l'administration.
 *
 * Ne renvoie que les sections enregistrées : le site garde son contenu par défaut
 * pour les autres. Si l'API ou la base est indisponible, le site s'affiche quand
 * même avec ce contenu par défaut.
 */

require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/content.php';

require_method('GET');

// Chaque visite commence par cet appel : le lien vers les fichiers envoyés est
// rétabli avant que la page n'affiche ses images (voir ensure_uploads_link)
ensure_uploads_link();

$content = [];
foreach (stored_sections(db()) as $section => $entry) {
    $content[$section] = $entry['data'];
}

respond(['ok' => true, 'content' => (object) $content]);
