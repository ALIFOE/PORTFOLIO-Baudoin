/**
 * Toutes les données du portfolio.
 *
 * Pour mettre à jour le site, il suffit de modifier ce fichier :
 * les pages Vue se construisent automatiquement à partir de ces données.
 */

// ---------- Images ----------
import photoHero from '@/assets/img/portfolio/baudoin-hero.jpg'
import photoPortrait from '@/assets/img/portfolio/baudoin-portrait.jpg'
import photoAbout from '@/assets/img/portfolio/baudoin-about.jpg'
import photoContact from '@/assets/img/portfolio/baudoin-contact.jpg'

import logoDeezpro from '@/assets/img/logos/deezpro.png'
import logoCompassion from '@/assets/img/logos/compassion.png'
import logoCdej from '@/assets/img/logos/cdej.png'
import logoMdh from '@/assets/img/logos/mdh.png'
import logoOif from '@/assets/img/logos/oif.png'
import logoUdem from '@/assets/img/logos/udem.png'
import logoCisco from '@/assets/img/logos/cisco.png'
import logoSonLive from '@/assets/img/logos/son-live.png'
import logoCrefer from '@/assets/img/logos/crefer.png'

import imgCrefer from '@/assets/img/projects/crefer-tech.jpg'
import imgCrefer2 from '@/assets/img/projects/crefer-tech-2.jpg'
import imgAgripronab from '@/assets/img/projects/agripronab.jpg'
import imgEgent from '@/assets/img/projects/egenttogo.jpg'
import imgEgent2 from '@/assets/img/projects/egenttogo-2.jpg'
import imgModehumain from '@/assets/img/projects/modehumain.jpg'
import imgModehumain2 from '@/assets/img/projects/modehumain-2.jpg'
import imgParking from '@/assets/img/projects/smart-parking.jpg'
import imgDeezpro from '@/assets/img/projects/deezpro-designs.jpg'

// ---------- Profil ----------
export const profile = {
  fullName: 'ALIFOE Kokou BAUDOIN',
  shortName: 'ALIFOE Baudoin',
  logoText: 'baudoin',
  role: 'Développeur Full Stack',
  title: 'Développeur Full Stack & Architecte Solutions Digitales',
  tagline: 'Technicien Réseau & Développeur passionné.',
  intro:
    'Développeur Full Stack & Architecte Solutions Digitales. Je transforme les idées en applications innovantes — web, mobile et cloud — avec React, Node.js et les technologies modernes.',
  location: 'Lomé, Togo',
  email: 'Alifoebaudoin228@gmail.com',
  phone: '+228 97 73 43 81',
  phoneHref: 'tel:+22897734381',
  whatsapp: 'https://wa.me/22897734381',
  linkedin: 'https://linkedin.com/in/baudoin-kokou-alifoe-110197231',
  // Lien GitHub personnel : l'ancien site pointait vers https://github.com (page d'accueil).
  // Renseignez votre profil (ex. https://github.com/alifoe) pour l'afficher.
  github: '',
  cv: 'docs/CV-ALIFOE-Kokou-Baudoin.pdf',
  // Formulaire de contact (même endpoint Formspree que l'ancien site)
  formEndpoint: 'https://formspree.io/f/2781463317787442707',
  photos: {
    hero: photoHero,
    portrait: photoPortrait,
    about: photoAbout,
    contact: photoContact,
  },
  stats: [
    { value: 3, suffix: '+', label: "Ans d'expérience", icon: 'fa-solid fa-briefcase' },
    { value: 5, suffix: '+', label: 'Projets livrés', icon: 'fa-solid fa-rocket' },
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
}

// Liens sociaux réutilisés (header, hero, footer, contact)
export const socials = [
  { label: 'LinkedIn', url: profile.linkedin, icon: 'icon-linkedin' },
  { label: 'WhatsApp', url: profile.whatsapp, icon: 'fa-brands fa-whatsapp' },
  { label: 'Email', url: `mailto:${profile.email}`, icon: 'fa-regular fa-envelope' },
  ...(profile.github ? [{ label: 'GitHub', url: profile.github, icon: 'icon-github' }] : []),
]

// ---------- Navigation ----------
export const navigation = [
  { label: 'Accueil', to: '/' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Expérience', to: '/experience' },
  { label: 'Compétences', to: '/competences' },
  { label: 'Formation', to: '/formation' },
  { label: 'Projets', to: '/projets' },
  { label: 'Contact', to: '/contact' },
]

// Bandeau défilant des pages intérieures
export const marquee = [
  'Développement Web',
  'Applications Mobiles',
  'Réseau & Maintenance',
  'Audio & Streaming',
  'React & Node.js',
  'Laravel & Vue.js',
  'Flutter / Dart',
  'WordPress',
  'Mikrotik / Cisco',
  'OBS / V-MIX',
  'Design graphique',
]

// ---------- À propos ----------
export const about = {
  profile: [
    "Fort d'une expertise approfondie en développement web moderne (React, Vue.js, Node.js) et mobile (React Native, Flutter), je conçois et développe des applications innovantes qui répondent aux standards actuels de performance et d'expérience utilisateur.",
    "Ma double compétence en développement et en architecture système me permet d'avoir une vision à 360° des projets, de l'interface utilisateur jusqu'à l'infrastructure cloud.",
    "Titulaire d'un BAC+2 en Électronique et certifié en développement web Full Stack, je continue à me former régulièrement aux dernières technologies pour rester à la pointe de l'innovation.",
    'Je cultive une approche méthodique et rigoureuse dans la résolution de problématiques complexes, en mettant la technologie au service du développement communautaire.',
  ],
  vision: [
    "Animé par une démarche d'innovation continue et de perfectionnement technique, je m'attache à livrer des solutions digitales performantes, centrées sur l'expérience utilisateur et alignées sur les objectifs stratégiques de mes partenaires.",
    'Mon parcours professionnel diversifié, allant de la microfinance au secteur associatif, témoigne de ma capacité d’adaptation et de mon engagement à créer des solutions technologiques qui ont un impact positif réel.',
  ],
}

// Domaines d'expertise (section "solutions" du template)
export const expertise = [
  {
    title: 'Réseau & Maintenance',
    icon: 'fa-solid fa-network-wired',
    text: "Expertise en maintenance réseau et systèmes informatiques, avec une approche proactive de la gestion d'infrastructures.",
    image: photoContact,
  },
  {
    title: 'Développement',
    icon: 'fa-solid fa-code',
    text: "Création d'applications web et mobile modernes, avec un focus sur la performance, l'UX et les bonnes pratiques de développement.",
    image: imgCrefer,
  },
  {
    title: 'Audio & Streaming',
    icon: 'fa-solid fa-headphones',
    text: 'Expertise en sonorisation live, recording et streaming événementiel pour des productions audiovisuelles de qualité professionnelle.',
    image: photoHero,
  },
]

// Méthode de travail (section "process" du template)
export const process = [
  { number: '01', title: 'Analyser', text: 'Comprendre vos besoins et définir la stack technique adaptée au projet.' },
  { number: '02', title: 'Développer', text: 'Coder avec les bonnes pratiques, créer les fonctionnalités et soigner l’UX.' },
  { number: '03', title: 'Tester', text: 'Vérifier, déboguer et valider le fonctionnement sur tous les écrans.' },
  { number: '04', title: 'Déployer', text: 'Mettre en ligne, former les utilisateurs et assurer le suivi technique.' },
]

// ---------- Expérience ----------
export const experiences = [
  {
    role: 'Community Manager',
    company: 'DEEZPRO',
    period: 'Août 2025 — Décembre 2025',
    logo: logoDeezpro,
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
    logo: logoCompassion,
    tasks: [
      "Conception et développement d'applications web & mobile pour l'organisation",
      "Intégration d'interfaces utilisateur modernes et responsives",
      'Développement de fonctionnalités back-end et APIs REST',
      "Collaboration avec l'équipe technique sur les outils digitaux internes",
    ],
    reference: {
      name: 'Dr. Olivier AHONON',
      role: 'Directeur National de CITG',
      email: 'CITogo@tg.ci.org',
      phones: ['+228 99 90 05 05'],
    },
  },
  {
    role: 'Technicien Multimédia',
    company: 'Compassion International Togo',
    period: '2023 — Présent',
    logo: logoCompassion,
    tasks: [
      'Gestion des équipements multimédia et audiovisuels',
      'Production et montage de contenus audiovisuels',
      'Support technique pour les événements et présentations',
      'Diffusion et gestion des contenus audiovisuels',
    ],
    reference: {
      name: 'Dr. Olivier AHONON',
      role: 'Directeur National de CITG',
      email: 'CITogo@tg.ci.org',
      phones: ['+228 99 90 05 05'],
    },
  },
  {
    role: 'Technicien de Maintenance Réseau',
    company: 'IMS (Informatique Multi-Service)',
    period: '2023 — Présent',
    tasks: [
      'Maintenance et dépannage des infrastructures réseau complexes',
      'Support technique avancé et formation des clients',
      "Configuration et optimisation des réseaux d'entreprise",
      'Gestion proactive des incidents et résolution de problèmes',
    ],
  },
  {
    role: 'Technicien de Maintenance Informatique',
    company: 'Microfinance MECAD',
    period: '2022 — Prestataire de services',
    tasks: [
      'Maintenance préventive et curative des systèmes informatiques',
      'Gestion et optimisation du parc informatique',
      'Support utilisateur personnalisé et formation',
      'Installation et configuration des solutions système et logicielles',
    ],
    reference: {
      name: 'GABIAM Kodjo',
      phones: ['+228 92 72 17 90'],
    },
  },
  {
    role: 'Chargé de Système Informatique et Réseau',
    company: 'CDEJ SHALOM TG0504',
    period: '2021 — Présent',
    logo: logoCdej,
    tasks: [
      'Administration complète des systèmes et réseaux',
      'Support technique et résolution des problèmes',
      'Gestion et coordination des projets informatiques',
      'Formation et accompagnement des utilisateurs',
    ],
    reference: {
      name: 'ABOTCHI Mawuena',
      email: 'mawuenaabotchi9@gmail.com',
      phones: ['+228 92 48 20 78'],
    },
  },
]

export const volunteering = [
  {
    role: 'Chargé de Système Informatique et Réseau',
    company: 'CDEJ SHALOM — Lomé, Togo',
    period: '2021 — Présent',
    logo: logoCdej,
    tasks: [
      "Création et gestion du réseau internet de l'organisation",
      'Formation du personnel aux outils informatiques',
    ],
    reference: {
      name: 'Mawuena ABOTCHI',
      email: 'mawuenaabotchi9@gmail.com',
      phones: ['+228 92 48 20 78'],
    },
  },
  {
    role: 'Web Master',
    company: 'ONG MDH (Mobilisation pour le Développement Humain) — Lomé, Togo',
    period: 'Janvier 2025 — Présent',
    logo: logoMdh,
    tasks: [
      "Gestion de la présence en ligne de l'organisation",
      'Développement de la stratégie de communication digitale',
    ],
    reference: {
      name: 'Saoute ATARMILA',
      email: 'modehumain@gmail.com',
      phones: ['+228 92 12 95 49'],
    },
  },
]

export const keySkills = [
  {
    title: 'Gestion Technique',
    icon: 'fa-solid fa-screwdriver-wrench',
    text: 'Maintenance, dépannage et optimisation des systèmes avec expertise approfondie.',
  },
  {
    title: 'Support Utilisateur',
    icon: 'fa-solid fa-headset',
    text: 'Formation personnalisée, assistance proactive et résolution efficace des problèmes.',
  },
  {
    title: 'Gestion de Projets',
    icon: 'fa-solid fa-diagram-project',
    text: 'Coordination stratégique et suivi rigoureux des projets informatiques.',
  },
]

// Organisations avec lesquelles j'ai travaillé / été formé (mur de logos)
export const organizations = [
  { name: 'DEEZPRO', logo: logoDeezpro },
  { name: 'Compassion International Togo', logo: logoCompassion },
  { name: 'CDEJ SHALOM', logo: logoCdej },
  { name: 'ONG MDH', logo: logoMdh },
  { name: 'CREFER', logo: logoCrefer },
  { name: 'Organisation Internationale de la Francophonie', logo: logoOif },
  { name: 'Université de Montréal', logo: logoUdem },
  { name: 'Cisco Networking Academy', logo: logoCisco },
]

// ---------- Compétences ----------
export const skillGroups = [
  {
    title: 'Développement',
    icon: 'fa-solid fa-code',
    skills: [
      { name: 'HTML / CSS / JS / PHP', level: 90 },
      { name: 'Flutter / Dart', level: 85 },
      { name: 'WordPress', level: 80 },
      { name: 'React / Node.js', level: 75 },
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
  {
    title: 'Audio & Streaming',
    icon: 'fa-solid fa-headphones',
    skills: [
      { name: 'Sonorisation Live', level: 85 },
      { name: 'Streaming', level: 80 },
      { name: 'Production Audio', level: 75 },
      { name: 'OBS / V-MIX', level: 80 },
    ],
  },
]

export const designTools = [
  'Adobe Photoshop',
  'Adobe Illustrator',
  'Adobe Audition',
  'Mixcraft / Acoustica',
  'DaVinci Resolve',
  'Filmora',
]

export const languages = [
  { name: 'Français', level: 'Langue maternelle', value: 100 },
  { name: 'Anglais', level: 'Débutant', value: 30 },
]

export const toolbox = [
  { title: 'Développement Web', icon: 'fa-solid fa-globe', items: 'HTML5, CSS3, JS, React' },
  { title: 'Développement Mobile', icon: 'fa-solid fa-mobile-screen', items: 'Flutter, React Native' },
  { title: 'Infrastructure', icon: 'fa-solid fa-server', items: 'Mikrotik, Cisco, Windows Server' },
  { title: 'Outils Dev', icon: 'fa-solid fa-code-branch', items: 'Git, VS Code, Adobe Suite' },
  { title: 'Multimédia', icon: 'fa-solid fa-video', items: 'OBS, V-MIX, DaVinci, Filmora' },
  { title: 'Design', icon: 'fa-solid fa-pen-nib', items: 'Photoshop, Illustrator, Audition' },
]

// ---------- Formation ----------
export const education = [
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
    summary: 'Spécialisation en électronique et systèmes numériques :',
    topics: ['Électronique numérique et analogique', 'Systèmes embarqués', 'Automatismes industriels'],
  },
]

export const certifications = [
  {
    title: 'Network Technician Career Path',
    issuer: 'Cisco Networking Academy',
    year: '2024',
    logo: logoCisco,
    text: 'Certification complète en administration et maintenance des réseaux, couvrant les protocoles et technologies Cisco.',
  },
  {
    title: 'Développement Web & Mobile',
    issuer: 'Organisation Internationale de la Francophonie',
    year: '2025',
    logo: logoOif,
    text: "Formation intensive en développement d'applications modernes avec focus sur les technologies actuelles.",
  },
  {
    title: 'Compétence Numérique',
    issuer: 'Université de Montréal',
    year: '2023',
    logo: logoUdem,
    text: 'Certification en transformation digitale et maîtrise des outils numériques modernes.',
  },
  {
    title: 'Technique de Son Live',
    issuer: 'Formation Professionnelle',
    year: '2023',
    logo: logoSonLive,
    text: 'Formation spécialisée en sonorisation événementielle et techniques de streaming professionnel.',
  },
]

export const continuousLearning = {
  text: 'Je maintiens mes connaissances à jour à travers une veille technologique constante et des formations en ligne sur Coursera, Udemy et OpenClassrooms.',
  topics: ['Développement Web', 'Applications Mobiles', 'Cloud Computing', 'Cybersécurité'],
}

// ---------- Projets ----------
export const projectCategories = [
  { key: 'all', label: 'Tous les projets', icon: 'fa-solid fa-grid-2' },
  { key: 'web', label: 'Web', icon: 'fa-solid fa-globe' },
  { key: 'application', label: 'Applications', icon: 'fa-solid fa-desktop' },
  { key: 'design', label: 'Design', icon: 'fa-solid fa-paintbrush' },
]

export const projects = [
  {
    slug: 'crefer-tech',
    title: 'CREFER.tech',
    subtitle: 'Énergies renouvelables',
    category: 'web',
    image: imgCrefer,
    gallery: [imgCrefer2],
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
    image: imgModehumain,
    gallery: [imgModehumain2],
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
    featured: true,
  },
  {
    slug: 'egenttogo',
    title: 'egenttogo.com',
    subtitle: 'Plateforme de services',
    category: 'web',
    image: imgEgent,
    gallery: [imgEgent2],
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
    featured: true,
  },
  {
    slug: 'agripronab',
    title: 'agripronab.tg',
    subtitle: 'Plateforme agricole',
    category: 'web',
    image: imgAgripronab,
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
  },
  {
    slug: 'smart-parking',
    title: 'Smart Parking',
    subtitle: 'Gestion intelligente',
    category: 'application',
    image: imgParking,
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
  },
  {
    slug: 'designs-deezpro',
    title: 'Designs DEEZPRO',
    subtitle: 'Collection créative',
    category: 'design',
    image: imgDeezpro,
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
  },
]

export const categoryLabel = (key) =>
  ({ web: 'Site web', application: 'Application', design: 'Design graphique' })[key] ?? key

export const domainOf = (url) => (url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : '')

// Services proposés dans le formulaire de contact
export const contactServices = [
  'Site web',
  'Application mobile',
  'Application web',
  'Réseau & maintenance',
  'Audio & streaming',
  'Design graphique',
]
