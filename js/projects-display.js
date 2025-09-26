// Fonction pour créer un projet dans la timeline
function createTimelineProject(project) {
    const isRight = project.position === 'right';
    const template = `
        <div class="relative flex items-center justify-between ${isRight ? 'slide-in-left' : 'slide-in-right'}">
            ${isRight ? `
                <!-- Date -->
                <div class="w-32 text-right pr-8 text-gray-500">${project.year}</div>
                
                <!-- Point sur la timeline -->
                <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-custom-orange rounded-full"></div>
                
                <!-- Contenu -->
                <div class="w-1/2 ml-8">
            ` : `
                <!-- Contenu (à gauche) -->
                <div class="w-1/2 pr-8 text-right">
            `}
                    <div class="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 timeline-project">
                        <div class="flex flex-wrap gap-2 mb-4 ${isRight ? '' : 'justify-end'}">
                            ${project.technologies.map(tech => `
                                <span class="${tech.class} px-3 py-1 rounded-full text-sm">${tech.name}</span>
                            `).join('')}
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">${project.title}</h3>
                        <p class="text-gray-600 mb-4">${project.description}</p>
                        <div class="flex items-center gap-4 ${isRight ? '' : 'justify-end'}">
                            <a href="${project.links.demo}" class="text-custom-orange hover:text-orange-600 transition-colors">
                                <i class="fas fa-external-link-alt mr-1"></i>Voir le projet
                            </a>
                            <a href="${project.links.github}" class="text-gray-500 hover:text-gray-700 transition-colors">
                                <i class="fab fa-github mr-1"></i>Code source
                            </a>
                        </div>
                    </div>
                </div>
            ${!isRight ? `
                <!-- Point sur la timeline -->
                <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full"></div>
                
                <!-- Date -->
                <div class="w-32 pl-8 text-gray-500">${project.year}</div>
            ` : ''}
        </div>
    `;
    return template;
}

// Fonction pour créer une carte de projet en vedette
function createFeaturedProject(project) {
    return `
        <div class="project-card" data-category="${project.category}">
            <div class="bg-black/30 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div class="relative group cursor-pointer" onclick="openProjectModal('${project.id}')">
                    <img src="${project.image}" alt="${project.title}" class="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span class="text-white text-lg font-medium transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <i class="fas fa-search mr-2"></i>Voir les détails
                        </span>
                    </div>
                    <div class="absolute top-4 right-4">
                        <span class="bg-${project.badgeColor}/80 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-medium">
                            ${project.badgeText}
                        </span>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-2xl font-bold text-white mb-3">${project.title}</h3>
                    <p class="text-gray-300 mb-4">
                        ${project.shortDescription}
                    </p>
                    <div class="space-y-3">
                        ${project.features.map(feature => `
                            <div class="flex items-start">
                                <i class="fas fa-check-circle text-${project.badgeColor.split('/')[0]} mt-1 mr-2"></i>
                                <span class="text-gray-300">${feature}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="mt-6 flex flex-wrap gap-2">
                        ${project.technologies.map(tech => `
                            <span class="px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-sm text-gray-300">${tech}</span>
                        `).join('')}
                    </div>
                    <div class="mt-6 flex gap-4">
                        ${project.links.demo ? `
                            <a href="${project.links.demo}" target="_blank" class="flex-1 bg-gradient-to-r from-${project.badgeColor.split('/')[0]} to-${project.badgeColor === 'custom-orange' ? 'red-500' : 'blue-700'} text-white text-center py-2 rounded-lg hover:opacity-90 transition-all duration-300">
                                <i class="fas fa-external-link-alt mr-2"></i>Visiter le site
                            </a>
                        ` : `
                            <button onclick="openProjectModal('${project.id}')" class="flex-1 bg-gradient-to-r from-${project.badgeColor.split('/')[0]} to-${project.badgeColor === 'custom-orange' ? 'red-500' : 'blue-700'} text-white text-center py-2 rounded-lg hover:opacity-90 transition-all duration-300">
                                <i class="fas fa-info-circle mr-2"></i>Plus de détails
                            </button>
                        `}
                        <a href="${project.links.github}" class="w-12 h-12 flex items-center justify-center border-2 border-${project.badgeColor.split('/')[0]} text-${project.badgeColor === 'custom-orange' ? 'custom-orange' : 'blue-400'} rounded-lg hover:bg-${project.badgeColor.split('/')[0]} hover:text-white transition-colors duration-300" title="Voir sur GitHub">
                            <i class="fab fa-github text-xl"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Timeline
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineContainer) {
        const timelineHTML = projectsData.timelineProjects
            .map(project => createTimelineProject(project))
            .join('');
        timelineContainer.innerHTML = timelineHTML;
    }

    // Projets en vedette
    const featuredContainer = document.querySelector('#featured-projects .grid');
    if (featuredContainer) {
        const featuredHTML = projectsData.featuredProjects
            .map(project => createFeaturedProject(project))
            .join('');
        featuredContainer.innerHTML = featuredHTML;
    }
});