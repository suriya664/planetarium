/**
 * Planetarium Website - Main JavaScript
 * Handles global UI interactions, theme toggling, and mobile navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initScrollEffects();
    initMobileFilters();
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
    const navLinks = document.querySelectorAll('.nav-link');
    const logoText = document.querySelector('.font-brand');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shadow-lg', 'bg-white/90', 'backdrop-blur-md', 'dark:bg-slate-900/90');
                header.classList.remove('bg-transparent', 'fixed-header-transparent');

                // Switch to dark text when background is white (if not in dark mode)
                // We rely on dark: classes for dark mode handling
                header.classList.remove('text-white');
                header.classList.add('text-slate-900', 'dark:text-slate-100');

                // Update nav links
                navLinks.forEach(link => {
                    link.classList.remove('text-white', 'hover:text-white/80');
                    link.classList.add('text-slate-700', 'dark:text-slate-200');
                });

                // Update mobile menu btn if needed
                if (mobileMenuBtn) {
                    mobileMenuBtn.classList.remove('text-white');
                    mobileMenuBtn.classList.add('text-slate-900', 'dark:text-white');
                }

            } else {
                // Only revert to transparent if the header expects it (e.g. on Hero pages)
                const isTransparentPage = header.getAttribute('data-transparent') === 'true';

                if (isTransparentPage) {
                    header.classList.remove('shadow-lg', 'bg-white/90', 'backdrop-blur-md', 'dark:bg-slate-900/90');
                    header.classList.add('bg-transparent', 'fixed-header-transparent', 'text-white');
                    header.classList.remove('text-slate-900', 'dark:text-slate-100');

                    // Update nav links
                    navLinks.forEach(link => {
                        link.classList.add('text-white', 'hover:text-white/80');
                        link.classList.remove('text-slate-700', 'dark:text-slate-200');
                    });

                    if (mobileMenuBtn) {
                        mobileMenuBtn.classList.add('text-white');
                        mobileMenuBtn.classList.remove('text-slate-900', 'dark:text-white');
                    }
                }
            }
        });

        // Trigger once on load to set initial state
        window.dispatchEvent(new Event('scroll'));
    }
}

// Utility: Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Initialize Mobile Filters (Shows Page)
 */
function initMobileFilters() {
    const filterBtn = document.querySelector('button i[data-lucide="filter"]')?.parentElement;
    // targeting by icon inside button since it didn't have an ID in the HTML viewing earlier
    // Actually, looking at shows-schedule.html line 140:
    // <button class="md:hidden w-full ...">... Filter Shows & Dates ...</button>
    // It doesn't have an ID. I should add one or select by class.
    // Let's use a class selector for safety or add the ID in the HTML step.
    // I'll assume I will add `id="mobile-filter-btn"` to the HTML.

    const btn = document.getElementById('mobile-filter-btn');
    const sidebar = document.querySelector('aside'); // The sidebar is an <aside>

    if (btn && sidebar) {
        const applyFiltersBtn = document.getElementById('apply-filters-btn');

        const toggleSidebar = () => {
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('fixed');
            sidebar.classList.toggle('inset-0');
            sidebar.classList.toggle('z-50');
            sidebar.classList.toggle('bg-white');
            sidebar.classList.toggle('dark:bg-slate-900');
            sidebar.classList.toggle('p-6'); // Increased padding slightly for mobile modal
            sidebar.classList.toggle('overflow-y-auto');

            // Handle body scroll locking
            if (sidebar.classList.contains('fixed')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };

        btn.addEventListener('click', toggleSidebar);

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                // Only close if we are in mobile/tablet mode (sidebar is fixed)
                if (sidebar.classList.contains('fixed')) {
                    toggleSidebar();
                }
            });
        }

        const closeFiltersBtn = document.getElementById('close-filters-btn');
        if (closeFiltersBtn) {
            closeFiltersBtn.addEventListener('click', toggleSidebar);
        }
    }
}
