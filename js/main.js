// Fonction pour le menu mobile
function toggleMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
}

// Gestion du scroll pour la navbar
window.addEventListener('scroll', function() {
    const nav = document.getElementById('mainNav');
    if (window.scrollY > 50) {
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
    }
});

// Animation au défilement
document.addEventListener('DOMContentLoaded', function() {
    // Observer pour les éléments fade-in
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observer pour les éléments slide-in-left
    const slideLeftObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observer pour les éléments slide-in-right
    const slideRightObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Application des observers
    document.querySelectorAll('.fade-in').forEach((el) => fadeObserver.observe(el));
    document.querySelectorAll('.slide-in-left').forEach((el) => slideLeftObserver.observe(el));
    document.querySelectorAll('.slide-in-right').forEach((el) => slideRightObserver.observe(el));
});
