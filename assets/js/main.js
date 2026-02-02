/**
 * Planetarium Website - Main JavaScript
 * Handles global UI interactions, theme toggling, and mobile navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initScrollEffects();
});

/**
 * Initialize Dark/Light Theme
 * logic: Check localStorage -> Check System Preference -> Default to Light
 */
function initTheme() {
    const themeToggleBtns = document.querySelectorAll('#theme-toggle, .theme-toggle-mobile');
    const htmlElement = document.documentElement;

    // Check saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Logic: Light mode as DEFAULT (as per requirements), unless user explicitly set dark
    // or if we want to honor system prefs, but req says "Light mode as DEFAULT"

    if (savedTheme === 'dark') {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    // Toggle Link click handlers
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            if (htmlElement.classList.contains('dark')) {
                htmlElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                htmlElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
            // Optional: Animate icon transition if we implement icon swapping
        });
    });
}

/**
 * Initialize Mobile Navigation (Hamburger Menu)
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            // Show menu
            mobileMenu.classList.remove('hidden');
            // Add slide-in animation class if setup in CSS
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        });

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = '';
            });
        }
    }
}

/**
 * Initialize Scroll Effects (Sticky Header, etc.)
 */
function initScrollEffects() {
    const header = document.querySelector('header');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shadow-lg', 'bg-white/90', 'backdrop-blur-md', 'dark:bg-slate-900/90');
                header.classList.remove('bg-transparent');
            } else {
                // Determine if we are on a page that needs transparent header at top
                if (header.classList.contains('fixed-header-transparent')) {
                    header.classList.remove('shadow-lg', 'bg-white/90', 'backdrop-blur-md', 'dark:bg-slate-900/90');
                    header.classList.add('bg-transparent');
                }
            }
        });
    }
}

// Utility: Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}
