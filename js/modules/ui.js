// UI Module - Handle all user interface interactions
export function initializeUI() {
    console.log('🎨 Initializing UI module...');
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize theme toggle
    initializeThemeToggle();
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Initialize button effects
    initializeButtonEffects();
    
    // Initialize page transitions
    initializePageTransitions();
    
    console.log('✅ UI module initialized');
}

function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Smart navbar hide/show on scroll
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        // Add transparency effect
        if (scrollTop > 50) {
            navbar.classList.add('transparent');
        } else {
            navbar.classList.remove('transparent');
        }
        
        lastScrollTop = scrollTop;
    });
}

function initializeThemeToggle() {
    const toggleMode = document.getElementById('toggleMode');
    if (!toggleMode) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-mode');
        toggleMode.textContent = '☀️';
    }
    
    toggleMode.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            this.textContent = '☀️';
            localStorage.setItem('darkMode', 'true');
        } else {
            this.textContent = '🌙';
            localStorage.setItem('darkMode', 'false');
        }
    });
}

function initializeScrollEffects() {
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Smart navbar hide/show with smooth transition
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        
        // Add transparent background when scrolling
        if (currentScrollY > 50) {
            navbar.classList.add('transparent');
        } else {
            navbar.classList.remove('transparent');
        }
        
        lastScrollY = currentScrollY;
        
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        }
        
        // Scroll reveal animations
        const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
        
        // Stagger animations for grouped elements
      const staggerContainers = document.querySelectorAll('.projects-grid, .about-details, .skills-grid, .contact-grid, .social-links');
      staggerContainers.forEach(container => {
        const containerTop = container.getBoundingClientRect().top;
        if (containerTop < window.innerHeight - 100) {
          const staggerItems = container.querySelectorAll('.stagger-item');
          staggerItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('revealed');
            }, index * 100);
          });
        }
      });
        
        // Fade in elements on scroll
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    });
    
    // Parallax effect for gradient backgrounds
    const parallax = document.querySelector('.gradient-bg');
    if (parallax) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        });
    }
    
    // Intersection Observer for loading elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements with loading class
    document.querySelectorAll('.loading').forEach(el => {
        observer.observe(el);
    });
}

function initializeButtonEffects() {
    // Ripple effect for buttons
    document.querySelectorAll('button, .button-63').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Enhanced hover effects for cards
    document.querySelectorAll('.card, .content-rect').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function initializePageTransitions() {
    // Page navigation system
    const navLinks = document.querySelectorAll('.navbar a');
    const pages = document.querySelectorAll('.content, .section, .games-page, .animation-page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Handle page navigation
            if (href === '#games') {
                e.preventDefault();
                showGamesPage();
            } else if (href === '#animation') {
                e.preventDefault();
                showAnimationPage();
            } else if (href === '#content') {
                e.preventDefault();
                showContentPage();
            } else if (href === '#home' || href === '#') {
                e.preventDefault();
                showHomePage();
            }
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Back to home buttons
    const backHomeBtnAnim = document.getElementById('backHomeBtnAnim');
    const backHomeBtnGames = document.getElementById('backHomeBtnGames');
    
    if (backHomeBtnAnim) {
        backHomeBtnAnim.addEventListener('click', showHomePage);
    }
    
    if (backHomeBtnGames) {
        backHomeBtnGames.addEventListener('click', showHomePage);
    }
}

function showGamesPage() {
    document.body.classList.add('games-mode');
    document.body.classList.remove('animation-mode', 'content-mode');
}

function showAnimationPage() {
    document.body.classList.add('animation-mode');
    document.body.classList.remove('games-mode', 'content-mode');
}

function showContentPage() {
    document.body.classList.add('content-mode');
    document.body.classList.remove('games-mode', 'animation-mode');
}

function showHomePage() {
    document.body.classList.remove('games-mode', 'animation-mode', 'content-mode');
    
    // Update navbar active state
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(l => l.classList.remove('active'));
    const homeLink = document.querySelector('.navbar a[href="#home"], .navbar a[href="#"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Page visibility change handling
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.title = '👋 Come back! - Shen Ming Portfolio';
    } else {
        document.title = 'Shen Ming - Computer Science Student | Web Developer | shenming.site';
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('UI Error:', e.error);
});