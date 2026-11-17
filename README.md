# Portfolio — ALIFOE Kokou Baudoin

Site en Vue 3 + Vite (template Devix), avec une petite API interne en PHP + MySQL :
formulaire de contact, et espace d'administration qui gère **tout le contenu du site**.

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Site en local. Lance aussi le serveur PHP de l'API (port 8088, relayé sur `/api` et `/uploads`). |
| `npm run build` | Génère le site dans `dist/`, dossier `api/` compris. |
| `npm run preview` | Sert le contenu de `dist/` en local. |
| `npm run api:setup -- --help` | Génère le fichier de configuration de l'API. |
| `php scripts/admin-account.php --help` | Change l'identifiant / le mot de passe admin directement en base. |

## Contenu du site

Le site met en avant trois domaines d'activité, dans cet ordre :

1. **Développeur Web & Mobile Full Stack** (activité principale)
2. **Technicien Multimédia, Photographie & Design**
3. **Sonorisation Live**

Chaque domaine a sa page (`#/realisations/<domaine>`) avec sa galerie de réalisations
(photos, vidéos, liens YouTube/Vimeo, chacun avec un titre et une description) et les
projets qui lui sont rattachés.

Le contenu d'origine est dans `src/data/portfolio.js` (`defaultContent`). Tout ce qui est
modifié dans l'administration est enregistré en base et **remplace** ce contenu, section
par section ; « Contenu d'origine » dans l'admin revient à la version du fichier.
Sans API (hébergement purement statique), le site s'affiche avec le contenu d'origine.

## Administration (`/#/admin`)

Aucun lien public n'y mène. Sections :

| Section | Contenu |
| --- | --- |
| Messages | Messages et demandes de projet du formulaire : statut, note interne, recherche, export CSV. |
| À propos | Identité, présentation, coordonnées et réseaux, photos, chiffres clés, centres d'intérêt, disponibilités. |
| Domaines d'activité | Les 3 domaines (ordre = importance), leurs services, outils et leur **galerie de réalisations**. |
| Expérience | Expériences, bénévolat, compétences clés, logos « Ils m'ont fait confiance ». |
| Compétences | Groupes et niveaux, outils de design, boîte à outils, langues. |
| Formation | Parcours académique, certifications, formation continue. |
| Projets | Liste des projets : images, galerie, textes, technologies, domaine, « à la une ». |
| Mon CV | Remplacement du CV (PDF), publié immédiatement ; les anciennes versions restent disponibles. |
| Médiathèque | Tous les fichiers envoyés, avec leur utilisation sur le site. |
| Identifiants | Changement d'identifiant et de mot de passe. |

Rien n'est publié avant « Enregistrer » (barre en bas de l'écran, ou Ctrl + S). Si une
section a été enregistrée entre-temps depuis un autre onglet, l'enregistrement est refusé
au lieu d'écraser ces modifications.

### Fichiers envoyés

- Rangés dans `uploads/` à la racine du site (à côté de `api/`), créé automatiquement
  avec un `.htaccess` qui y interdit l'exécution de code.
- Le type est vérifié d'après le contenu du fichier : images JPG, PNG, WebP, GIF ;
  vidéos MP4 (H.264 conseillé), WebM, MOV ; PDF.
- Les photos sont remises à l'endroit, réduites à 2400 px maximum, débarrassées de leurs
  métadonnées (position GPS…), et une miniature est créée pour les galeries (extension GD).
- La taille maximale dépend du serveur (`upload_max_filesize` et `post_max_size` de PHP) ;
  elle est affichée dans la Médiathèque. Pour les longues vidéos, un lien YouTube est plus léger.
- En local, les fichiers vont dans `public/uploads/` : ce dossier n'est ni versionné
  ni copié dans `dist/`.

Tables (créées automatiquement au premier appel) : `pf_messages`, `pf_admins`,
`pf_login_attempts`, `pf_content`, `pf_media`.

### Configuration

L'API lit `portfolio-api.config.php`, placé **deux niveaux au-dessus du dossier `api/`**,
donc hors de la racine web. Ce fichier contient des secrets : il n'est ni versionné ni copié
dans `dist/`.

En local (XAMPP : MySQL démarré, utilisateur `root` sans mot de passe) :

```bash
npm run api:setup -- --user=Baudoin --password=VOTRE_MOT_DE_PASSE
```

Pour changer plus tard d'identifiants sans passer par l'admin (ou retrouver l'accès) :

```bash
php scripts/admin-account.php --user=Baudoin --password=NOUVEAU_MOT_DE_PASSE
# en production : ajouter --config=chemin/vers/portfolio-api.config.php
```

### Mise en ligne (hébergement PHP + MySQL, ex. Hostinger)

1. Créer une base MySQL et son utilisateur dans le panneau de l'hébergeur.
2. Générer la configuration de production :

   ```bash
   php scripts/api-setup.php --db-name=NOM --db-user=UTILISATEUR --db-pass=MOT_DE_PASSE \
       --user=Baudoin --password=MOT_DE_PASSE_ADMIN --notify=votre@email \
       --out=portfolio-api.config.prod.php
   ```

3. `npm run build`, puis envoyer le contenu de `dist/` dans `public_html/`.
   **Ne supprimez jamais `public_html/uploads/`** lors d'une mise à jour : il contient
   les photos, vidéos et CV envoyés depuis l'admin.
4. Envoyer `portfolio-api.config.prod.php` **à côté** de `public_html/` (pas dedans),
   sous le nom `portfolio-api.config.php`.
5. Ouvrir `https://votre-domaine/#/admin` et se connecter.

Le compte admin est créé à partir de la configuration uniquement si la base n'en a pas
encore ; sur une base qui a déjà un compte, utilisez `scripts/admin-account.php` ou la
page « Identifiants » de l'admin.

`--notify` est facultatif : il envoie un email à chaque nouveau message, en plus de l'admin.
PHP 8.1 ou plus récent est requis (extensions pdo_mysql, fileinfo, et GD pour les photos).
Un hébergement purement statique (GitHub Pages) ne peut pas exécuter l'API : le site y
affiche le contenu d'origine, le formulaire propose le repli WhatsApp / email et l'admin
n'est pas disponible.
