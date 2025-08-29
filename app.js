// SpaceX-inspired Portfolio JavaScript

class Portfolio {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav__link');
        this.sections = document.querySelectorAll('.section');
        this.header = document.querySelector('.header');
        this.currentTab = 'home';
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleScroll();
        this.addSmoothAnimations();
        // Initialize with home section active
        this.switchTab('home');
    }
    
    bindEvents() {
        // Tab navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = e.target.getAttribute('data-tab');
                if (targetTab) {
                    this.switchTab(targetTab);
                }
            });
        });
        
        // Header background on scroll
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Project card hover effects (initialize after DOM is ready)
        setTimeout(() => {
            this.addProjectCardEffects();
        }, 100);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }
    
    switchTab(targetTab) {
        // Update current tab
        this.currentTab = targetTab;
        
        // Update active nav link
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-tab') === targetTab) {
                link.classList.add('active');
            }
        });
        
        // Hide all sections first
        this.sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
            section.style.opacity = '0';
        });
        
        // Show target section
        const targetSection = document.getElementById(targetTab);
        if (targetSection) {
            // Force display and opacity
            targetSection.style.display = 'block';
            targetSection.classList.add('active');
            
            // Animate in
            setTimeout(() => {
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
            }, 50);
            
            // Add entrance animation
            this.animateSection(targetTab);
        }
        
        // Update URL hash without jumping
        history.replaceState(null, null, `#${targetTab}`);
        
        // Scroll to top when switching tabs
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    animateSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        // Animate project cards if they exist
        const projectCards = section.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });
    }
    
    handleScroll() {
        const scrolled = window.scrollY > 50;
        
        if (scrolled) {
            this.header.style.background = 'rgba(0, 0, 0, 0.98)';
            this.header.style.borderBottomColor = 'rgba(255, 255, 255, 0.15)';
        } else {
            this.header.style.background = 'rgba(0, 0, 0, 0.95)';
            this.header.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
        }
    }
    
    addProjectCardEffects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                this.handleCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.handleCardHover(card, false);
            });
            
            // Button click effects
            const buttons = card.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    this.handleButtonClick(e);
                });
            });
        });
    }
    
    handleCardHover(card, isHovering) {
        const techBadges = card.querySelectorAll('.tech-badge');
        
        if (isHovering) {
            // Enhanced hover effect with glow
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 112, 243, 0.2), 0 0 0 1px rgba(0, 112, 243, 0.1)';
            card.style.borderColor = 'rgba(0, 112, 243, 0.3)';
            
            // Animate tech badges
            techBadges.forEach((badge, index) => {
                setTimeout(() => {
                    badge.style.transform = 'scale(1.1)';
                    badge.style.backgroundColor = 'rgba(0, 112, 243, 0.2)';
                    badge.style.borderColor = 'rgba(0, 112, 243, 0.4)';
                    badge.style.color = '#ffffff';
                }, index * 30);
            });
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
            card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            
            techBadges.forEach(badge => {
                badge.style.transform = 'scale(1)';
                badge.style.backgroundColor = 'rgba(0, 112, 243, 0.1)';
                badge.style.borderColor = 'rgba(0, 112, 243, 0.2)';
                badge.style.color = '#0070f3';
            });
        }
    }
    
    handleButtonClick(e) {
        const button = e.target;
        
        // Only prevent default for buttons without href (not actual links)
        if (!button.href) {
            e.preventDefault();
        }
        
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 10;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        // Show feedback for placeholder buttons (only non-link buttons)
        const buttonText = button.textContent;
        if (!button.href && (buttonText === 'Live Demo' || buttonText === 'Source Code')) {
            button.style.background = 'rgba(0, 112, 243, 0.8)';
            setTimeout(() => {
                if (button.classList.contains('btn--primary')) {
                    button.style.background = '#0070f3';
                } else {
                    button.style.background = 'transparent';
                }
            }, 200);
        }
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }
    
    handleKeyboardNavigation(e) {
        const activeNavIndex = Array.from(this.navLinks).findIndex(link => 
            link.classList.contains('active')
        );
        
        let newIndex = activeNavIndex;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                newIndex = activeNavIndex > 0 ? activeNavIndex - 1 : this.navLinks.length - 1;
                break;
            case 'ArrowRight':
                e.preventDefault();
                newIndex = activeNavIndex < this.navLinks.length - 1 ? activeNavIndex + 1 : 0;
                break;
            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                newIndex = this.navLinks.length - 1;
                break;
        }
        
        if (newIndex !== activeNavIndex && newIndex >= 0 && newIndex < this.navLinks.length) {
            const targetTab = this.navLinks[newIndex].getAttribute('data-tab');
            this.switchTab(targetTab);
        }
    }
    
    addSmoothAnimations() {
        // Add CSS for ripple animation if not already present
        if (!document.querySelector('#portfolio-animations')) {
            const style = document.createElement('style');
            style.id = 'portfolio-animations';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .tech-badge {
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                
                .project-card {
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Initialize based on URL hash
    initializeFromHash() {
        const hash = window.location.hash.substring(1);
        const validTabs = ['home', 'qa-engineer', 'fullstack', 'contact'];
        
        if (hash && validTabs.includes(hash)) {
            this.switchTab(hash);
        } else {
            this.switchTab('home');
        }
    }
}

// Utility functions
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    smoothScrollTo(element, duration = 1000) {
        const targetPosition = element.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
};

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new Portfolio();
    
    // Initialize from URL hash after DOM is fully loaded
    setTimeout(() => {
        portfolio.initializeFromHash();
        
        // Re-add project card effects after initialization
        setTimeout(() => {
            portfolio.addProjectCardEffects();
        }, 200);
    }, 100);
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', () => {
        portfolio.initializeFromHash();
    });
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});