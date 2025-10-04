class GrimGrimSite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupModals();
        this.setupFormValidation();
        this.setupSmoothScrolling();
        this.setupAnimations();
    }

    setupEventListeners() {
        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle?.classList.remove('active');
                navMenu?.classList.remove('active');
            });
        });

        // Header scroll effect
        window.addEventListener('scroll', this.handleScroll.bind(this));

        // Concert ticket buttons
        document.querySelectorAll('.concert-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const venue = e.target.dataset.venue;
                const date = e.target.dataset.date;
                this.openTicketModal(venue, date);
            });
        });

        // Main ticket button
        const orderTicketBtn = document.getElementById('orderTicketBtn');
        if (orderTicketBtn) {
            orderTicketBtn.addEventListener('click', () => {
                this.openTicketModal('Найближчий концерт', 'Дивіться розклад нижче');
            });
        }

        // Social links
        document.getElementById('instagramLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSocialPopup('Instagram', 'https://instagram.com/grimgrim_band');
        });

        document.getElementById('youtubeLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSocialPopup('YouTube', 'https://youtube.com/@grimgrim_band');
        });

        document.getElementById('facebookLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSocialPopup('Facebook', 'https://facebook.com/grimgrim.band');
        });
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupModals() {
        // Modal close functionality
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Ticket form submission
        const ticketForm = document.getElementById('ticketForm');
        if (ticketForm) {
            ticketForm.addEventListener('submit', this.handleTicketSubmission.bind(this));
        }
    }

    setupFormValidation() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmission.bind(this));
            
            // Real-time validation
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
        }
    }

    setupSmoothScrolling() {
        // Enhanced smooth scrolling with easing
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = 80;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    this.smoothScrollTo(targetPosition, 800);
                }
            });
        });
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.member-card, .table-row, .story-text p').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    handleScroll() {
        const header = document.querySelector('.header');
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.style.background = 'rgba(26, 26, 26, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
            header.style.boxShadow = 'none';
        }
    }

    openTicketModal(venue, date) {
        const modal = document.getElementById('ticketModal');
        const venueInfo = document.getElementById('modalVenueInfo');
        
        if (modal && venueInfo) {
            venueInfo.textContent = `${venue} - ${date}`;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Focus first input for accessibility
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    showSocialPopup(platform, url) {
        const popup = confirm(`Перейти на нашу сторінку в ${platform}?`);
        if (popup) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}Error`);
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearError(field);

        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    errorMessage = 'Ім\'я повинно містити принаймні 2 символи';
                    isValid = false;
                } else if (!/^[а-яА-ЯіІїЇєЄa-zA-Z\s\-\']+$/.test(value)) {
                    errorMessage = 'Ім\'я може містити тільки літери, пробіли та дефіси';
                    isValid = false;
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = 'Введіть коректну email адресу';
                    isValid = false;
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    errorMessage = 'Повідомлення повинно містити принаймні 10 символів';
                    isValid = false;
                } else if (value.length > 1000) {
                    errorMessage = 'Повідомлення не може перевищувати 1000 символів';
                    isValid = false;
                }
                break;
        }

        if (!isValid && errorElement) {
            errorElement.textContent = errorMessage;
            field.style.borderColor = '#e74c3c';
        }

        return isValid;
    }

    clearError(field) {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
        field.style.borderColor = '#34495e';
    }

    handleContactSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        let isFormValid = true;

        // Validate all fields
        const fields = form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showError('Будь ласка, виправте помилки у формі');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Відправляємо...';
        submitBtn.disabled = true;

        // Simulate form submission with GET request
        const params = new URLSearchParams();
        for (let [key, value] of formData.entries()) {
            params.append(key, value);
        }

        // Create GET request URL (in real implementation, this would be your backend endpoint)
        const submitUrl = `https://example.com/contact?${params.toString()}`;
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            this.showSuccessModal('Дякуємо за ваше повідомлення! Ми зв\'яжемося з вами найближчим часом.');
            
            // Reset form
            form.reset();
            
            // Log the GET request URL (in real implementation, you would make actual request)
            console.log('Contact form GET request URL:', submitUrl);
            
        }, 1500);
    }

    handleTicketSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Basic validation
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const quantity = formData.get('quantity');
        
        if (!name || name.length < 2) {
            alert('Будь ласка, введіть коректне ім\'я');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Будь ласка, введіть коректну email адресу');
            return;
        }

        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Обробляємо...';
        submitBtn.disabled = true;

        // Create GET request for ticket booking
        const params = new URLSearchParams();
        for (let [key, value] of formData.entries()) {
            params.append(key, value);
        }
        params.append('type', 'ticket_booking');

        const bookingUrl = `https://example.com/book-ticket?${params.toString()}`;

        // Simulate booking process
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            this.closeModal('ticketModal');
            this.showSuccessModal(`Дякуємо, ${name}! Ваше замовлення на ${quantity} квиток(ів) прийнято. Деталі надіслано на ${email}.`);
            
            form.reset();
            
            console.log('Ticket booking GET request URL:', bookingUrl);
            
        }, 2000);
    }

    showSuccessModal(message) {
        const modal = document.getElementById('successModal');
        const messageElement = document.getElementById('successMessage');
        
        if (modal && messageElement) {
            messageElement.textContent = message;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    showError(message) {
        // Create temporary error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 3000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    smoothScrollTo(target, duration) {
        const start = window.pageYOffset;
        const distance = target - start;
        let startTime = null;

        const easeInOutQuart = (t) => {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        };

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutQuart(progress);
            
            window.scrollTo(0, start + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }
}

// Performance optimizations
const optimizations = {
    // Lazy load images
    lazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    },

    // Preload critical resources
    preloadCriticalResources() {
        const criticalImages = [
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    },

    // Optimize font loading
    optimizeFonts() {
        // Font display swap is already set in CSS
        // This could include additional font optimization logic
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main site functionality
    new GrimGrimSite();
    
    // Apply performance optimizations
    optimizations.lazyLoadImages();
    optimizations.preloadCriticalResources();
    optimizations.optimizeFonts();
    
    // Add loading complete class for any CSS animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any unnecessary animations or processes
    } else {
        // Resume animations or processes
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GrimGrimSite;
}

// Global function for modal closing (used in HTML)
window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};