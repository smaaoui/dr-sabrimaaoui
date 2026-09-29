document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navbar.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
            mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars', !isOpen);
            icon.classList.toggle('fa-times', isOpen);
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.setAttribute('aria-label', 'Ouvrir le menu');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // --- Sticky Header & Back to Top Button ---
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('back-to-top');

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for sticky header height
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15 // Trigger when 15% of element is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: stop observing once animated
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Active Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const allNavLinksForHighlight = document.querySelectorAll('.nav-link');

    // --- Écouteur unique pour scroll : header sticky, bouton retour en haut
    //     et lien de nav actif, regroupés pour éviter les recalculs redondants ---
    function onScroll() {
        const scrollY = window.scrollY;

        // Header
        header.classList.toggle('scrolled', scrollY > 50);

        // Back to top button
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('active', scrollY > 500);
        }

        // Active nav link
        const headerHeight = header.offsetHeight + 10;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - headerHeight;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    allNavLinksForHighlight.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                } else if (scrollY < sections[0].offsetTop - headerHeight) {
                    allNavLinksForHighlight.forEach(link => link.classList.remove('active'));
                }
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

});