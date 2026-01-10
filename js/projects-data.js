// Données des projets
const projectsData = {
    // Projets de la timeline
    timelineProjects: [
        {
            id: 'design-deezpro',
            year: '2023',
            title: 'Designs DEEZPRO',
            description: 'Collection complète de designs créatifs réalisés pour DEEZPRO',
            technologies: [
                { name: 'Photoshop', class: 'bg-blue-100 text-blue-600' },
                { name: 'Illustrator', class: 'bg-custom-orange/20 text-custom-orange' }
            ],
            links: {
                demo: '#galerie',
                github: '#'
            },
            position: 'right'
        },
        {
            id: 'CREFER',
            year: '2023',
            title: 'CREFER - Gestion de Formation',
            description: 'Application web de gestion des formations professionnelles pour le CREFER',
            technologies: [
                { name: 'Laravel', class: 'bg-custom-orange/20 text-custom-orange' },
                { name: 'PHP', class: 'bg-blue-100 text-blue-600' }
            ],
            links: {
                demo: '#',
                github: '#'
            },
            position: 'right' // ou 'left'
        },
        {
            id: 'portfolio',
            year: '2022',
            title: 'Portfolio Personnel',
            description: 'Site web personnel présentant mes compétences et réalisations',
            technologies: [
                { name: 'React', class: 'bg-purple-100 text-purple-600' },
                { name: 'Node.js', class: 'bg-green-100 text-green-600' }
            ],
            links: {
                demo: '#',
                github: '#'
            },
            position: 'left'
        }
    ],

    // Projets en vedette
    featuredProjects: [
        {
            id: 'design-deezpro',
            title: 'Designs DEEZPRO',
            shortDescription: 'Collection complète de designs créatifs réalisés pour DEEZPRO',
            fullDescription: 'Collection complète de designs créatifs réalisés pour DEEZPRO, comprenant des visuels promotionnels, des annonces et des supports marketing variés.',
            image: 'img/designs/deezpro/cover.png',
            category: 'design',
            badgeColor: 'emerald-500',
            badgeText: 'Design',
            features: [
                'Visuels promotionnels',
                'Design d\'annonces',
                'Supports marketing',
                'Identité visuelle'
            ],
            technologies: ['Photoshop', 'Illustrator', 'InDesign'],
            gallery: [
                'img/designs/deezpro/design1.png',
                'img/designs/deezpro/design2.png',
                'img/designs/deezpro/design3.png'
            ],
            links: {
                demo: '#galerie',
                github: '#'
            }
        },
        {
            id: 'CREFER',
            title: 'CREFER - Gestion de Formation',
            shortDescription: 'Application de gestion complète pour l\'école CREFER',
            fullDescription: 'Application de gestion complète pour l\'école CREFER, spécialisée en énergies renouvelables.',
            image: 'logo  v 02 concept tech.png',
            category: 'application',
            badgeColor: 'custom-orange',
            badgeText: 'Laravel',
            features: [
                'Gestion multi-rôles',
                'Réservation de formations',
                'Suivi des interventions'
            ],
            technologies: ['Laravel', 'MySQL', 'Bootstrap'],
            links: {
                demo: '#',
                github: '#'
            }
        },
        {
            id: 'mdh',
            title: 'MDH - Site Vitrine ONG',
            shortDescription: 'Site web moderne pour l\'ONG humanitaire MDH',
            fullDescription: 'Site web moderne pour l\'ONG humanitaire MDH, mettant en valeur leurs actions et impact social.',
            image: 'photo2.png',
            category: 'web',
            badgeColor: 'blue-600',
            badgeText: 'Web',
            features: [
                'Design responsive',
                'Actions humanitaires',
                'Blog d\'actualités'
            ],
            technologies: ['HTML5', 'CSS3', 'JavaScript'],
            links: {
                demo: 'http://modehumain.org',
                github: '#'
            }
        },
        {
            id: 'parking',
            title: 'Smart Parking',
            shortDescription: 'Solution complète de gestion de parking',
            fullDescription: 'Solution complète de gestion de parking avec réservation en ligne et suivi en temps réel.',
            image: 'photo3.png',
            category: 'application',
            badgeColor: 'custom-orange',
            badgeText: 'Laravel',
            features: [
                'Gestion temps réel',
                'Réservation avancée',
                'Tableau de bord'
            ],
            technologies: ['Laravel', 'Vue.js', 'MySQL'],
            links: {
                demo: '#',
                github: '#'
            }
        },
        {
            id: 'crefer-tech',
            title: 'CREFER.tech',
            shortDescription: 'Plateforme digitale pour les énergies renouvelables',
            fullDescription: 'Plateforme innovante dédiée aux solutions technologiques en énergies renouvelables, offrant ressources, formations et outils pour professionnels et entreprises du secteur.',
            image: 'img/projects/crefer-tech.png',
            category: 'web',
            badgeColor: 'blue-600',
            badgeText: 'Web',
            features: [
                'Plateforme d\'apprentissage interactif',
                'Ressources documentaires complètes',
                'Outils de gestion technique',
                'Communauté professionnelle active',
                'Actualités du secteur en temps réel'
            ],
            technologies: ['React', 'Node.js', 'MongoDB', 'TailwindCSS'],
            gallery: [],
            links: {
                demo: 'https://crefer.tech',
                github: '#'
            }
        },
        {
            id: 'modehumain-org',
            title: 'Mode Humain - ONG',
            shortDescription: 'Site d\'une ONG humanitaire dédiée à l\'aide sociale',
            fullDescription: 'Plateforme web moderne pour l\'organisation humanitaire Mode Humain, présentant leurs missions, leurs actions et permettant la mobilisation communautaire autour de causes humanitaires.',
            image: 'logos/MDH-Logo.png',
            category: 'web',
            badgeColor: 'emerald-500',
            badgeText: 'Web',
            features: [
                'Présentation des missions',
                'Appels à projet et donations',
                'Blog d\'actualités',
                'Galerie de projets',
                'Formulaire d\'engagement volontaire'
            ],
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'WordPress'],
            gallery: [],
            links: {
                demo: 'https://modehumain.org',
                github: '#'
            }
        }
    ]
};