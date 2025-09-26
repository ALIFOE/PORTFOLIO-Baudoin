// Fonction pour le menu mobile
function toggleMenu() {
    var menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', function() {
    // Configuration de l'Intersection Observer pour les animations
    var observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    function handleIntersect(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                // Ajoute la classe appropriée selon le type d'animation
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.add('slide-visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }

    var observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observer tous les éléments avec animation
    var animatedElements = document.querySelectorAll('.slide-in-left, .slide-in-right, .fade-in');
    animatedElements.forEach(function(el) {
        observer.observe(el);
    });

    // Gestion des événements de suivi
    var projectElements = document.querySelectorAll('.timeline-project');
    projectElements.forEach(function(project) {
        var titleEl = project.querySelector('h3');
        var projectTitle = titleEl ? titleEl.textContent : 'Projet';

        // Suivi des clics sur les liens
        var links = project.querySelectorAll('a');
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                var isGithub = this.href.indexOf('github') !== -1;
                gtag('event', isGithub ? 'project_github' : 'project_view', {
                    'event_category': 'Projects',
                    'event_label': projectTitle
                });
            });
        });
    });

    // Animation immédiate pour les éléments déjà visibles
    setTimeout(function() {
        var visibleElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        visibleElements.forEach(function(el) {
            var rect = el.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                if (el.classList.contains('fade-in')) {
                    el.classList.add('visible');
                } else {
                    el.classList.add('slide-visible');
                }
            }
        });
    }, 100);
});