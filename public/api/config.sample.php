<?php
/**
 * Modèle de configuration de l'API (formulaire de contact + administration).
 *
 * Ne modifiez pas ce fichier : générez le vrai fichier avec
 *
 *     php scripts/api-setup.php --help
 *
 * puis placez-le sous le nom « portfolio-api.config.php » DEUX niveaux
 * au-dessus du dossier api/, c'est-à-dire hors de la racine web :
 *
 *     en local      →  portfolio-vue/portfolio-api.config.php
 *     sur Hostinger →  à côté du dossier public_html/
 *
 * (Si l'hébergeur ne le permet pas, nommez-le api/config.php : le fichier
 * .htaccess en interdit l'accès depuis le navigateur.)
 */

return [
    // Base MySQL / MariaDB. Les tables sont créées automatiquement au premier appel.
    'db' => [
        'host' => '127.0.0.1',
        'port' => 3306,
        'name' => 'nom_de_la_base',
        'user' => 'utilisateur',
        'pass' => 'mot_de_passe',
        'prefix' => 'pf_',
    ],

    // Premier compte administrateur, créé une seule fois si aucun compte n'existe.
    // Le mot de passe se change ensuite depuis l'espace admin.
    'admin' => [
        'username' => 'admin',
        'password_hash' => '', // résultat de password_hash(), jamais le mot de passe en clair
    ],

    // Chaîne aléatoire propre à ce site (sert à anonymiser les adresses IP)
    'app_secret' => '',

    // Facultatif : adresse qui reçoit un email à chaque nouveau message
    'notify_email' => '',

    // Nombre maximal de messages par visiteur et par heure
    'contact_rate_limit' => 5,

    // Facultatif : dossier des fichiers envoyés depuis l'admin. Par défaut : uploads/
    // à la racine du site, à côté de api/. Il doit rester accessible à l'adresse
    // https://votre-site/uploads/ (le site y lit les images, vidéos et CV).
    // 'uploads_dir' => '/home/utilisateur/public_html/uploads',

    // true = détail des erreurs dans les réponses (à laisser sur false en production)
    'debug' => false,
];
