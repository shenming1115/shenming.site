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
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Initialize starry night animation
    initializeStarryNight();
    
    console.log('✅ UI module initialized');
}

function initializeNavigation() {
    // Navigation is now handled by script.js to avoid conflicts
    // This function is kept for compatibility but does nothing
    console.log('🧭 Navigation handled by main script.js');
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

function initializeInteractiveElements() {
    // Initialize play button
    const playButton = document.getElementById('playButton');
    const audioPlayer = document.getElementById('audioPlayer');
    
    if (playButton && audioPlayer) {
        playButton.addEventListener('click', function() {
            audioPlayer.play().catch(e => {
                console.log('Audio play failed:', e);
                // Show user feedback
                playButton.innerHTML = '<span>🔇</span> Audio Unavailable';
                setTimeout(() => {
                    playButton.innerHTML = '<span>🎵</span> Play Sound';
                }, 2000);
            });
        });
    }
    
    // Initialize eye tracking
    initializeEyeTracking();
}

function initializeEyeTracking() {
    const eyes = document.querySelectorAll('.eye');
    const pupils = document.querySelectorAll('.pupil');
    
    if (eyes.length === 0 || pupils.length === 0) return;
    
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        pupils.forEach((pupil, index) => {
            const eye = eyes[index];
            if (!eye) return;
            
            const eyeRect = eye.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;
            
            const deltaX = mouseX - eyeCenterX;
            const deltaY = mouseY - eyeCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            const maxDistance = 15; // Maximum pupil movement
            const moveX = (deltaX / distance) * Math.min(distance, maxDistance);
            const moveY = (deltaY / distance) * Math.min(distance, maxDistance);
            
            pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

window.initializeStarryNight = function initializeStarryNight() {
    const canvas = document.getElementById('starryNightCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const stars = [];
    const shootingStars = [];
    const numStars = 200;
    let starColors = ['255, 255, 255', '255, 200, 200', '200, 200, 255', '255, 255, 200'];
    let currentColorIndex = 0;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create stars
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            drift: {
                x: (Math.random() - 0.5) * 0.2,
                y: (Math.random() - 0.5) * 0.2
            },
            colorIndex: Math.floor(Math.random() * starColors.length)
        });
    }
    
    // Global functions for animation controls
    window.starryNight = {
        changeColors: function() {
            currentColorIndex = (currentColorIndex + 1) % starColors.length;
            stars.forEach(star => {
                star.colorIndex = Math.floor(Math.random() * starColors.length);
            });
        },
        addShootingStar: function() {
            shootingStars.push({
                x: Math.random() * canvas.width,
                y: 0,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                length: Math.random() * 80 + 20,
                opacity: 1,
                life: 100
            });
        }
    };
    
    function animate() {
        // Clear canvas with dark blue background
        ctx.fillStyle = '#0a0c18';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw and animate stars
        stars.forEach(star => {
            // Update position
            star.x += star.drift.x;
            star.y += star.drift.y;
            
            // Wrap around edges
            if (star.x < 0) star.x = canvas.width;
            if (star.x > canvas.width) star.x = 0;
            if (star.y < 0) star.y = canvas.height;
            if (star.y > canvas.height) star.y = 0;
            
            // Twinkle effect
            star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.01;
            star.opacity = Math.max(0.1, Math.min(1, star.opacity));
            
            // Draw star with color
            const color = starColors[star.colorIndex];
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, ${star.opacity})`;
            ctx.fill();
            
            // Add glow effect for brighter stars
            if (star.opacity > 0.7) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color}, ${star.opacity * 0.1})`;
                ctx.fill();
            }
        });
        
        // Draw and animate shooting stars
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const shootingStar = shootingStars[i];
            
            // Update position
            shootingStar.x += shootingStar.vx;
            shootingStar.y += shootingStar.vy;
            shootingStar.life--;
            shootingStar.opacity = shootingStar.life / 100;
            
            // Draw shooting star trail
            ctx.beginPath();
            ctx.moveTo(shootingStar.x, shootingStar.y);
            ctx.lineTo(
                shootingStar.x - shootingStar.vx * shootingStar.length / 10,
                shootingStar.y - shootingStar.vy * shootingStar.length / 10
            );
            ctx.strokeStyle = `rgba(255, 255, 255, ${shootingStar.opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Remove dead shooting stars
            if (shootingStar.life <= 0 || shootingStar.y > canvas.height) {
                shootingStars.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}