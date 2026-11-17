/**
 * Données du portfolio.
 *
 * - defaultContent : contenu d'origine du site. Tout ce qu'il contient se modifie
 *   depuis l'administration (/#/admin) ; ce qui y est enregistré remplace ces
 *   valeurs, section par section. Sans API (hébergement statique), ce contenu
 *   s'affiche tel quel.
 * - le reste (navigation, méthode de travail…) est fixe et se modifie ici.
 *
 * Images : « asset:dossier/fichier.jpg » désigne une image de src/assets/img/,
 * « uploads/… » un fichier envoyé depuis l'admin (voir src/content/media.js).
 */

// ---------- Navigation ----------
// children: 'domains' → sous-menu construit à partir des domaines d'activité
export const navigation = [
  { label: 'Accueil', to: '/' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Réalisations', to: '/realisations', children: 'domains', match: ['/realisations', '/projets'] },
  { label: 'Expérience', to: '/experience' },
  { label: 'Compétences', to: '/competences' },
  { label: 'Formation', to: '/formation' },
  { label: 'Contact', to: '/contact' },
]

// Bandeau défilant des pages intérieures
export const marquee = [
  'Développement Web & Mobile',
  'Applications Full Stack',
  'Laravel & Vue.js',
  'React & Node.js',
  'Flutter / Dart',
  'Photographie',
  'Montage vidéo',
  'Design graphique',
  'Sonorisation live',
  'Streaming OBS / V-MIX',
]

// Méthode de travail (section "process" du template)
export const process = [
  { number: '01', title: 'Analyser', text: 'Comprendre vos besoins et définir la stack technique adaptée au projet.' },
  { number: '02', title: 'Développer', text: 'Coder avec les bonnes pratiques, créer les fonctionnalités et soigner l’UX.' },
  { number: '03', title: 'Tester', text: 'Vérifier, déboguer et valider le fonctionnement sur tous les écrans.' },
  { number: '04', title: 'Déployer', text: 'Mettre en ligne, former les utilisateurs et assurer le suivi technique.' },
]

// Services proposés dans le formulaire de contact
export const contactServices = [
  'Site web',
  'Application web',
  'Application mobile',
  'Photographie',
  'Vidéo & montage',
  'Design graphique',
  'Sonorisation live',
]

// ---------- Projets : catégories (filtres) ----------
export const projectCategories = [
  { key: 'all', label: 'Tous les projets', icon: 'fa-solid fa-grid-2' },
  { key: 'web', label: 'Sites web', icon: 'fa-solid fa-globe' },
  { key: 'application', label: 'Applications web', icon: 'fa-solid fa-desktop' },
  { key: 'mobile', label: 'Applications mobiles', icon: 'fa-solid fa-mobile-screen' },
  { key: 'design', label: 'Design', icon: 'fa-solid fa-paintbrush' },
]

export const categoryLabel = (key) =>
  ({ web: 'Site web', application: 'Application web', mobile: 'Application mobile', design: 'Design graphique' })[key] ?? key

export const domainOf = (url) => (url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : '')

// ======================================================================
// Contenu modifiable depuis l'administration
// ======================================================================

// Référence commune pour deux expériences chez Compassion International Togo
const citgReference = {
  name: 'Dr. Olivier AHONON',
  role: 'Directeur National de CITG',
  email: 'CITogo@tg.ci.org',
  phones: ['+228 99 90 05 05'],
}

const noReference = { name: '', role: '', email: '', phones: [] }

export const defaultContent = {
  // ---------- À propos ----------
  profile: {
    fullName: 'ALIFOE Kokou BAUDOIN',
    shortName: 'ALIFOE Baudoin',
    logoText: 'baudoin',
    role: 'Développeur Web & Mobile Full Stack',
    title: 'Développeur Web & Mobile Full Stack · Multimédia · Sonorisation Live',
    headline: 'Je transforme les idées en applications innovantes',
    tagline: 'Développeur web & mobile, technicien multimédia et ingénieur du son live.',
    intro:
      "Développeur web & mobile full stack, je conçois des sites et des applications complètes, de l'interface au serveur. Technicien multimédia (photo, vidéo, design) et technicien en sonorisation live, je donne aussi vie à vos projets à l'image et sur scène.",
    location: 'Lomé, Togo',
    email: 'Alifoebaudoin228@gmail.com',
    phone: '+228 97 73 43 81',
    whatsapp: '+228 97 73 43 81',
    linkedin: 'https://linkedin.com/in/baudoin-kokou-alifoe-110197231',
    github: '',
    facebook: '',
    instagram: '',
    youtube: '',
    photos: {
      hero: 'asset:portfolio/baudoin-hero.jpg',
      portrait: 'asset:portfolio/baudoin-portrait.jpg',
      about: 'asset:portfolio/baudoin-about.jpg',
      contact: 'asset:portfolio/baudoin-contact.jpg',
    },
    stats: [
      { value: 3, suffix: '+', label: "Ans d'expérience", icon: 'fa-solid fa-briefcase' },
      { value: 8, suffix: '+', label: 'Projets livrés', icon: 'fa-solid fa-rocket' },
      { value: 4, suffix: '', label: 'Certifications', icon: 'fa-solid fa-award' },
    ],
    interests: [
      { label: 'Musique', icon: 'fa-solid fa-music' },
      { label: 'Sport', icon: 'fa-solid fa-futbol' },
      { label: 'Photo', icon: 'fa-solid fa-camera' },
    ],
    availability: [
      { day: 'Lundi — Vendredi', hours: '9h00 — 18h00' },
      { day: 'Samedi', hours: '10h00 — 15h00' },
      { day: 'Dimanche', hours: 'Sur rendez-vous' },
    ],
    about: {
      profile: [
        "Développeur web & mobile full stack, je conçois des sites et des applications modernes — Laravel, Vue.js, React, Node.js, Flutter — de l'interface utilisateur jusqu'au serveur et à la mise en ligne.",
        "En parallèle, je travaille comme technicien multimédia : photographie, montage vidéo, design graphique et diffusion en direct. Je suis aussi technicien en sonorisation live pour les concerts, conférences et événements.",
        "Titulaire d'un BAC+2 en Électronique et certifié en développement web Full Stack, je continue à me former régulièrement aux dernières technologies pour rester à la pointe de l'innovation.",
        'Je cultive une approche méthodique et rigoureuse dans la résolution de problématiques complexes, en mettant la technologie au service du développement communautaire.',
      ],
      vision: [
        "Animé par une démarche d'innovation continue et de perfectionnement technique, je m'attache à livrer des solutions digitales performantes, centrées sur l'expérience utilisateur et alignées sur les objectifs stratégiques de mes partenaires.",
        'Mon parcours professionnel diversifié, allant de la microfinance au secteur associatif, témoigne de ma capacité d’adaptation et de mon engagement à créer des solutions technologiques qui ont un impact positif réel.',
      ],
    },
  },

  // ---------- CV ----------
  cv: {
    file: 'docs/CV-ALIFOE-Kokou-Baudoin.pdf',
    name: 'CV-ALIFOE-Kokou-Baudoin.pdf',
    updatedAt: '',
  },

  // ---------- Domaines d'activité (dans l'ordre d'importance) ----------
  domains: [
    {
      slug: 'developpement-web-mobile',
      title: 'Développeur Web & Mobile Full Stack',
      shortTitle: 'Développement Web & Mobile',
      icon: 'fa-solid fa-code',
      tagline: "Sites web, applications web et mobiles sur mesure, de l'interface au serveur.",
      description:
        "Mon activité principale. Je conçois et développe des sites et des applications complètes : interfaces modernes et responsives, back-end et API, bases de données, mise en ligne et suivi. Chaque projet est pensé pour la performance, l'expérience utilisateur et les objectifs de mes clients — ONG, coopératives, réseaux associatifs et entreprises.",
      cover: 'asset:projects/hezouwe.jpg',
      services: [
        'Sites vitrines et institutionnels',
        'Applications web sur mesure',
        'Applications mobiles (Flutter, React Native)',
        'Boutiques en ligne et espaces membres',
        'API REST, bases de données et back-office',
        'Mise en ligne, hébergement et maintenance',
      ],
      tools: ['HTML / CSS / JS', 'PHP / Laravel', 'Vue.js', 'React / Node.js', 'Flutter / Dart', 'MySQL', 'WordPress', 'Git'],
      media: [],
    },
    {
      slug: 'multimedia-photo-design',
      title: 'Technicien Multimédia, Photographie & Design',
      shortTitle: 'Multimédia, Photo & Design',
      icon: 'fa-solid fa-camera',
      tagline: 'Photographie, vidéo, montage et design graphique pour donner une image forte à vos projets.',
      description:
        "Technicien multimédia chez Compassion International Togo depuis 2023, je gère les équipements audiovisuels, je produis et monte des contenus vidéo, je couvre des événements en photo et je réalise des supports graphiques : affiches, visuels pour les réseaux sociaux, identités visuelles.",
      cover: 'asset:projects/deezpro-designs.jpg',
      services: [
        "Photographie d'événements, portraits et reportages",
        'Production et montage vidéo',
        'Design graphique : affiches, flyers, visuels réseaux sociaux',
        'Identité visuelle et supports de communication',
        'Captation et diffusion en direct',
      ],
      tools: ['Adobe Photoshop', 'Adobe Illustrator', 'DaVinci Resolve', 'Filmora', 'OBS / V-MIX'],
      media: [],
    },
    {
      slug: 'sonorisation-live',
      title: 'Sonorisation Live',
      shortTitle: 'Sonorisation Live',
      icon: 'fa-solid fa-sliders',
      tagline: 'Sonorisation de concerts, conférences et événements, de l’installation au mixage.',
      description:
        "Formé aux techniques du son live, j'assure la sonorisation d'événements : installation et réglage du matériel, mixage en direct, enregistrement et son pour la captation vidéo et le streaming.",
      cover: 'asset:portfolio/baudoin-hero.jpg',
      services: [
        'Installation et réglage de systèmes de sonorisation',
        'Mixage en direct : concerts, conférences, cérémonies',
        'Enregistrement et production audio',
        'Son pour la captation vidéo et le streaming',
      ],
      tools: ['Consoles de mixage', 'Adobe Audition', 'Mixcraft / Acoustica', 'OBS / V-MIX'],
      media: [],
    },
  ],

  // ---------- Expérience ----------
  experience: {
    experiences: [
      {
        role: 'Community Manager',
        company: 'DEEZPRO',
        period: 'Août 2025 — Décembre 2025',
        current: false,
        logo: 'asset:logos/deezpro.png',
        tasks: [
          'Gestion et animation des réseaux sociaux',
          'Création et planification de contenus engageants',
          'Analyse des performances et reporting',
          'Interaction avec la communauté et gestion de la e-réputation',
        ],
        reference: {
          name: 'Komlavi Alphonse GOGOLI',
          role: 'Docteur-Ingénieur en Sciences',
          email: 'contact@deezpro.com',
          phones: ['+228 98 92 62 62', '+33 6 43 52 34 82'],
        },
      },
      {
        role: 'Stagiaire — Développement Web & Mobile',
        company: 'Compassion International Togo',
        period: '2025 — Présent',
        current: true,
        logo: 'asset:logos/compassion.png',
        tasks: [
          "Conception et développement d'applications web & mobile pour l'organisation",
          "Intégration d'interfaces utilisateur modernes et responsives",
          'Développement de fonctionnalités back-end et APIs REST',
          "Collaboration avec l'équipe technique sur les outils digitaux internes",
        ],
        reference: citgReference,
      },
      {
        role: 'Technicien Multimédia',
        company: 'Compassion International Togo',
        period: '2023 — Présent',
        current: false,
        logo: 'asset:logos/compassion.png',
        tasks: [
          'Gestion des équipements multimédia et audiovisuels',
          'Production et montage de contenus audiovisuels',
          'Support technique pour les événements et présentations',
          'Diffusion et gestion des contenus audiovisuels',
        ],
        reference: citgReference,
      },
      {
        role: 'Technicien de Maintenance Réseau',
        company: 'IMS (Informatique Multi-Service)',
        period: '2023 — Présent',
        current: false,
        logo: '',
        tasks: [
          'Maintenance et dépannage des infrastructures réseau complexes',
          'Support technique avancé et formation des clients',
          "Configuration et optimisation des réseaux d'entreprise",
          'Gestion proactive des incidents et résolution de problèmes',
        ],
        reference: noReference,
      },
      {
        role: 'Technicien de Maintenance Informatique',
        company: 'Microfinance MECAD',
        period: '2022 — Prestataire de services',
        current: false,
        logo: '',
        tasks: [
          'Maintenance préventive et curative des systèmes informatiques',
          'Gestion et optimisation du parc informatique',
          'Support utilisateur personnalisé et formation',
          'Installation et configuration des solutions système et logicielles',
        ],
        reference: { name: 'GABIAM Kodjo', role: '', email: '', phones: ['+228 92 72 17 90'] },
      },
      {
        role: 'Chargé de Système Informatique et Réseau',
        company: 'CDEJ SHALOM TG0504',
        period: '2021 — Présent',
        current: false,
        logo: 'asset:logos/cdej.png',
        tasks: [
          'Administration complète des systèmes et réseaux',
          'Support technique et résolution des problèmes',
          'Gestion et coordination des projets informatiques',
          'Formation et accompagnement des utilisateurs',
        ],
        reference: { name: 'ABOTCHI Mawuena', role: '', email: 'mawuenaabotchi9@gmail.com', phones: ['+228 92 48 20 78'] },
      },
    ],
    volunteering: [
      {
        role: 'Chargé de Système Informatique et Réseau',
        company: 'CDEJ SHALOM — Lomé, Togo',
        period: '2021 — Présent',
        current: false,
        logo: 'asset:logos/cdej.png',
        tasks: ["Création et gestion du réseau internet de l'organisation", 'Formation du personnel aux outils informatiques'],
        reference: { name: 'Mawuena ABOTCHI', role: '', email: 'mawuenaabotchi9@gmail.com', phones: ['+228 92 48 20 78'] },
      },
      {
        role: 'Web Master',
        company: 'ONG MDH (Mobilisation pour le Développement Humain) — Lomé, Togo',
        period: 'Janvier 2025 — Présent',
        current: false,
        logo: 'asset:logos/mdh.png',
        tasks: ["Gestion de la présence en ligne de l'organisation", 'Développement de la stratégie de communication digitale'],
        reference: { name: 'Saoute ATARMILA', role: '', email: 'modehumain@gmail.com', phones: ['+228 92 12 95 49'] },
      },
    ],
    keySkills: [
      {
        title: 'Développement Full Stack',
        icon: 'fa-solid fa-code',
        text: 'Conception d’applications web et mobiles complètes, de l’interface au serveur et à la mise en ligne.',
      },
      {
        title: 'Production Multimédia',
        icon: 'fa-solid fa-camera',
        text: 'Photo, vidéo, design et diffusion en direct pour communiquer avec impact.',
      },
      {
        title: 'Gestion Technique & Support',
        icon: 'fa-solid fa-screwdriver-wrench',
        text: 'Maintenance, sonorisation et support utilisateur avec rigueur et réactivité.',
      },
    ],
    // Mur de logos « Ils m'ont fait confiance »
    organizations: [
      { name: 'DEEZPRO', logo: 'asset:logos/deezpro.png' },
      { name: 'Compassion International Togo', logo: 'asset:logos/compassion.png' },
      { name: 'CDEJ SHALOM', logo: 'asset:logos/cdej.png' },
      { name: 'ONG MDH', logo: 'asset:logos/mdh.png' },
      { name: 'CREFER', logo: 'asset:logos/crefer.png' },
      { name: 'COOP CA HEZOUWE', logo: 'asset:logos/hezouwe.png' },
      { name: 'REJEPPAT — Réseau des Jeunes Producteurs et Professionnels Agricoles du Togo', logo: 'asset:logos/rejeppat.png' },
      { name: 'Organisation Internationale de la Francophonie', logo: 'asset:logos/oif.png' },
      { name: 'Université de Montréal', logo: 'asset:logos/udem.png' },
      { name: 'Cisco Networking Academy', logo: 'asset:logos/cisco.png' },
    ],
  },

  // ---------- Compétences ----------
  skills: {
    groups: [
      {
        title: 'Développement Web & Mobile',
        icon: 'fa-solid fa-code',
        skills: [
          { name: 'HTML / CSS / JS / PHP', level: 90 },
          { name: 'Flutter / Dart', level: 85 },
          { name: 'Laravel / Vue.js', level: 80 },
          { name: 'WordPress', level: 80 },
          { name: 'React / Node.js', level: 75 },
        ],
      },
      {
        title: 'Multimédia, Photo & Design',
        icon: 'fa-solid fa-camera',
        skills: [
          { name: 'Photographie', level: 80 },
          { name: 'Design graphique', level: 80 },
          { name: 'Montage vidéo', level: 75 },
          { name: 'Streaming (OBS / V-MIX)', level: 80 },
        ],
      },
      {
        title: 'Sonorisation Live',
        icon: 'fa-solid fa-sliders',
        skills: [
          { name: 'Sonorisation live', level: 85 },
          { name: 'Mixage en direct', level: 80 },
          { name: 'Production audio', level: 75 },
          { name: 'Son pour le streaming', level: 80 },
        ],
      },
      {
        title: 'Réseau & Maintenance',
        icon: 'fa-solid fa-network-wired',
        skills: [
          { name: 'Configuration Réseau', level: 95 },
          { name: 'Maintenance Système', level: 90 },
          { name: 'Support Technique', level: 85 },
          { name: 'Mikrotik / Cisco', level: 80 },
        ],
      },
    ],
    designTools: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe Audition', 'Mixcraft / Acoustica', 'DaVinci Resolve', 'Filmora'],
    toolbox: [
      { title: 'Développement Web', icon: 'fa-solid fa-globe', items: 'HTML5, CSS3, JavaScript, PHP, Laravel, Vue.js, React' },
      { title: 'Développement Mobile', icon: 'fa-solid fa-mobile-screen', items: 'Flutter, React Native' },
      { title: 'Photo & Vidéo', icon: 'fa-solid fa-video', items: 'DaVinci Resolve, Filmora, OBS, V-MIX' },
      { title: 'Design', icon: 'fa-solid fa-pen-nib', items: 'Photoshop, Illustrator' },
      { title: 'Audio', icon: 'fa-solid fa-headphones', items: 'Consoles de mixage, Audition, Mixcraft' },
      { title: 'Infrastructure & outils', icon: 'fa-solid fa-server', items: 'Git, VS Code, Mikrotik, Cisco, Windows Server' },
    ],
    languages: [
      { name: 'Français', level: 'Langue maternelle', value: 100 },
      { name: 'Anglais', level: 'Débutant', value: 30 },
    ],
  },

  // ---------- Formation ----------
  education: {
    education: [
      {
        title: 'BTS Système Réseau Informatique',
        school: 'École IPNET',
        period: 'En cours',
        current: true,
        summary: 'Formation approfondie en informatique moderne :',
        topics: ['Administration système et réseau avancée', 'Sécurité informatique', "Gestion d'infrastructure IT"],
      },
      {
        title: 'BAC Série F2',
        school: 'ITEM GBEYENDZI',
        period: '2020 — 2021',
        current: false,
        summary: 'Spécialisation en électronique et systèmes numériques :',
        topics: ['Électronique numérique et analogique', 'Systèmes embarqués', 'Automatismes industriels'],
      },
    ],
    certifications: [
      {
        title: 'Network Technician Career Path',
        issuer: 'Cisco Networking Academy',
        year: '2024',
        logo: 'asset:logos/cisco.png',
        text: 'Certification complète en administration et maintenance des réseaux, couvrant les protocoles et technologies Cisco.',
      },
      {
        title: 'Développement Web & Mobile',
        issuer: 'Organisation Internationale de la Francophonie',
        year: '2025',
        logo: 'asset:logos/oif.png',
        text: "Formation intensive en développement d'applications modernes avec focus sur les technologies actuelles.",
      },
      {
        title: 'Compétence Numérique',
        issuer: 'Université de Montréal',
        year: '2023',
        logo: 'asset:logos/udem.png',
        text: 'Certification en transformation digitale et maîtrise des outils numériques modernes.',
      },
      {
        title: 'Technique de Son Live',
        issuer: 'Formation Professionnelle',
        year: '2023',
        logo: 'asset:logos/son-live.png',
        text: 'Formation spécialisée en sonorisation événementielle et techniques de streaming professionnel.',
      },
    ],
    continuousLearning: {
      text: 'Je maintiens mes connaissances à jour à travers une veille technologique constante et des formations en ligne sur Coursera, Udemy et OpenClassrooms.',
      topics: ['Développement Web', 'Applications Mobiles', 'Cloud Computing', 'Cybersécurité'],
    },
  },

  // ---------- Projets ----------
  projects: [
    {
      slug: 'hezouwe',
      title: 'HEZOUWE',
      subtitle: 'Coopérative rizicole & vente en ligne',
      category: 'web',
      domain: 'developpement-web-mobile',
      image: 'asset:projects/hezouwe.jpg',
      gallery: ['asset:projects/hezouwe-2.jpg'],
      excerpt:
        'Site de la COOP CA HEZOUWE, coopérative togolaise de transformation et de vente de riz local — produits, commandes en ligne et espace client.',
      description:
        'Plateforme web de la COOP CA HEZOUWE, coopérative togolaise qui collecte, transforme et commercialise du riz local certifié ITRA, avec le soutien de Compassion International Togo. Le site présente la coopérative et ses producteurs, ses produits et ses services, et permet aux clients de créer un compte et de passer commande en ligne.',
      highlights: ['Commande en ligne', 'Comptes clients', 'Actualités & newsletter'],
      technologies: ['Laravel', 'Vue.js', 'MySQL', 'Bootstrap', 'GSAP'],
      features: [
        'Présentation de la coopérative et de ses producteurs',
        'Catalogue de produits : riz blanc, riz étuvé et sous-produits',
        'Commande en ligne',
        'Création de compte et connexion client',
        'Actualités et inscription à la newsletter',
        'Témoignages clients et chiffres clés',
        'Design responsive et animations',
      ],
      demoUrl: 'https://hezouwe.com',
      featured: true,
    },
    {
      slug: 'rejeppat',
      title: 'REJEPPAT',
      subtitle: 'Réseau agricole national',
      category: 'web',
      domain: 'developpement-web-mobile',
      image: 'asset:projects/rejeppat.jpg',
      gallery: ['asset:projects/rejeppat-2.jpg'],
      excerpt:
        'Plateforme du Réseau des Jeunes Producteurs et Professionnels Agricoles du Togo — sections régionales, fermes écoles, boutique de produits locaux et vidéos.',
      description:
        "Site officiel du REJEPPAT, faîtière des organisations paysannes de jeunes au Togo (plus de 15 000 membres et près de 200 coopératives). La plateforme présente le réseau et ses 5 sections régionales, les fermes écoles, les programmes et projets, les actualités, et intègre une boutique de produits locaux, un espace jeunes et des demandes de services, en français et en anglais.",
      highlights: ['Boutique de produits locaux', 'Site bilingue français / anglais', 'Sections régionales & fermes écoles'],
      technologies: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'Bootstrap'],
      features: [
        'Présentation du réseau et de ses 5 sections régionales',
        'Annuaire des fermes écoles',
        'Programmes, projets et actualités',
        'Boutique en ligne avec panier',
        'Espace jeunes et demandes de services',
        'Vidéos du réseau',
        'Version bilingue français / anglais',
        'Contact direct par WhatsApp',
      ],
      demoUrl: 'https://rejeppat.org',
      featured: true,
    },
    {
      slug: 'crefer-tech',
      title: 'CREFER.tech',
      subtitle: 'Énergies renouvelables',
      category: 'web',
      domain: 'developpement-web-mobile',
      image: 'asset:projects/crefer-tech.jpg',
      gallery: ['asset:projects/crefer-tech-2.jpg'],
      excerpt:
        'Plateforme digitale pour les énergies renouvelables — ressources, formations interactives et outils professionnels.',
      description:
        'Plateforme digitale innovante dédiée aux solutions technologiques en énergies renouvelables. Offrant ressources documentaires, formations interactives et outils professionnels pour experts et entreprises du secteur.',
      highlights: ['Apprentissage interactif', 'Ressources documentaires', 'Communauté professionnelle'],
      technologies: ['React', 'Node.js', 'MongoDB', 'TailwindCSS', 'JWT'],
      features: [
        "Plateforme d'apprentissage interactif avec vidéos",
        'Ressources documentaires complètes et téléchargeables',
        'Outils de calcul et de simulation techniques',
        'Communauté professionnelle active avec forums',
        'Actualités du secteur en temps réel',
        'Certification professionnelle en ligne',
        'Système de notifications personnalisées',
      ],
      demoUrl: 'https://crefer.tech',
      featured: true,
    },
    {
      slug: 'modehumain',
      title: 'Mode Humain — ONG',
      subtitle: 'Plateforme humanitaire',
      category: 'web',
      domain: 'developpement-web-mobile',
      image: 'asset:projects/modehumain.jpg',
      gallery: ['asset:projects/modehumain-2.jpg'],
      excerpt:
        "Site web de l'ONG humanitaire Mode Humain — missions, actions sociales, système de donations et blog d'actualités.",
      description:
        "Site web moderne et impactant pour l'organisation humanitaire Mode Humain. Présentant leurs missions, leurs actions et permettant la mobilisation communautaire autour de causes humanitaires importantes.",
      highlights: ['Présentation des missions', 'Système de donations sécurisé', "Blog d'actualités intégré"],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'WordPress', 'WooCommerce'],
      features: [
        'Présentation complète des missions et projets',
        "Système d'appels à projet transparent",
        'Plateforme de donations sécurisée',
        "Blog d'actualités et témoignages",
        'Galerie de projets avec photos et vidéos',
        "Formulaire d'engagement volontaire",
        'Intégration réseaux sociaux',
      ],
      demoUrl: 'https://modehumain.org',
      featured: false,
    },
    {
      slug: 'egenttogo',
      title: 'egenttogo.com',
      subtitle: 'Plateforme de services',
      category: 'web',
      domain: 'developpement-web-mobile',
      image: 'asset:projects/egenttogo.jpg',
      gallery: ['asset:projects/egenttogo-2.jpg'],
      excerpt:
        'Plateforme web togolaise de services — interface intuitive et moderne pour connecter clients et prestataires au Togo.',
      description:
        'Plateforme web moderne pour egenttogo.com, connectant clients et prestataires de services au Togo. Interface intuitive, navigation fluide et présentation claire des offres disponibles.',
      highlights: ['Interface utilisateur moderne', 'Design fully responsive', 'Performance optimisée'],
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      features: [
        'Interface utilisateur intuitive et moderne',
        'Design fully responsive (mobile / tablette / desktop)',
        'Navigation fluide et optimisée',
        'Performance et temps de chargement optimisés',
        'Intégration des coordonnées et formulaire contact',
      ],
      demoUrl: 'https://egenttogo.com',
      featured: false,
    },
    {
      slug: 'agripronab',
      title: 'agripronab.tg',
      subtitle: 'Plateforme agricole',
      category: 'web',
      domain: 'developpement-web-mobile',
      image: 'asset:projects/agripronab.jpg',
      gallery: [],
      excerpt:
        'Plateforme web agricole togolaise — vitrine de services et ressources pour les professionnels du secteur agroalimentaire.',
      description:
        'Site web professionnel pour agripronab.tg, une plateforme dédiée aux professionnels du secteur agroalimentaire au Togo. Présentation des services, contact et ressources adaptées au marché agricole local.',
      highlights: ['Présentation des services agricoles', 'Design responsive & moderne', 'Optimisation SEO'],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'SEO'],
      features: [
        'Site vitrine professionnel et moderne',
        'Présentation des services agricoles',
        'Design responsive toutes plateformes',
        'Optimisation SEO pour le marché togolais',
        'Formulaire de contact intégré',
      ],
      demoUrl: 'https://agripronab.tg',
      featured: false,
    },
    {
      slug: 'smart-parking',
      title: 'Smart Parking',
      subtitle: 'Gestion intelligente',
      category: 'application',
      domain: 'developpement-web-mobile',
      image: 'asset:projects/smart-parking.jpg',
      gallery: [],
      excerpt:
        'Solution complète de gestion de parking avec réservation en ligne et suivi en temps réel des places disponibles.',
      description:
        'Solution complète et innovante de gestion de parking avec réservation en ligne et suivi en temps réel. Plateforme intelligente permettant aux utilisateurs de trouver, réserver et gérer leurs places de parking facilement.',
      highlights: ['Réservation et suivi temps réel', 'Tableau de bord administrateur', 'Système de paiement intégré'],
      technologies: ['Laravel', 'Vue.js', 'MySQL', 'JavaScript', 'API REST'],
      features: [
        'Système de réservation en temps réel',
        'Suivi GPS des places disponibles',
        'Interface mobile responsive',
        'Tableau de bord administrateur',
        'Système de paiement intégré',
        'Notifications et rappels automatiques',
        "Historique et rapports d'utilisation",
      ],
      demoUrl: '',
      featured: false,
    },
    {
      slug: 'designs-deezpro',
      title: 'Designs DEEZPRO',
      subtitle: 'Collection créative',
      category: 'design',
      domain: 'multimedia-photo-design',
      image: 'asset:projects/deezpro-designs.jpg',
      gallery: [],
      excerpt:
        'Collection de designs créatifs pour DEEZPRO — visuels promotionnels, annonces et supports marketing variés.',
      description:
        'Collection complète de designs créatifs réalisés pour DEEZPRO, comprenant des visuels promotionnels, des annonces et des supports marketing variés.',
      highlights: ['Visuels promotionnels & marketing', 'Designs réseaux sociaux', 'Identité visuelle cohérente'],
      technologies: ['Photoshop', 'Illustrator', 'InDesign', 'Conception visuelle', 'Marketing digital'],
      features: [
        "Création d'annonces promotionnelles",
        'Design de supports marketing',
        'Visuels pour réseaux sociaux',
        'Identité visuelle cohérente',
        'Optimisation pour différentes plateformes',
      ],
      demoUrl: '',
      featured: false,
    },
  ],
}
