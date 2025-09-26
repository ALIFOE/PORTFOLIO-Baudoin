// Données des projets
const projectsData = {
    // Projets de la timeline
    timelineProjects: [
        {
            id: 'cerfer',
            year: '2023',
            title: 'CERFER - Gestion de Formation',
            description: 'Application web de gestion des formations professionnelles pour le CERFER',
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
            id: 'cerfer',
            title: 'CERFER - Gestion de Formation',
            shortDescription: 'Application de gestion complète pour l\'école CERFER',
            fullDescription: 'Application de gestion complète pour l\'école CERFER, spécialisée en énergies renouvelables.',
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