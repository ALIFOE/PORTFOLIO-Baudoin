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
        }
    ]
};