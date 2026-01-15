// ============================================
// Smooth Scrolling Navigation
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add click event listeners for smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
    
    // ============================================
    // Active Nav Link Highlighting on Scroll
    // ============================================
    
    function updateActiveNavLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
    }
    
    // Update active nav link based on scroll position
    function handleScroll() {
        const sections = document.querySelectorAll('.section');
        const headerHeight = document.querySelector('header').offsetHeight;
        const scrollPosition = window.scrollY + headerHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = '#' + section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                updateActiveNavLink(sectionId);
            }
        });
    }
    
    // Throttle scroll event for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(function() {
            handleScroll();
            toggleScrollToTop();
        });
    });
    
    // ============================================
    // Scroll to Top Button
    // ============================================
    
    const scrollToTopButton = document.getElementById('scrollToTop');
    
    function toggleScrollToTop() {
        if (window.scrollY > 300) {
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
    }
    
    // Scroll to top functionality
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Update active nav link to first section
        updateActiveNavLink('#about');
    });
    
    // ============================================
    // Contact Form Validation
    // ============================================
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            // Reset previous error states
            clearErrors();
            
            // Validation flags
            let isValid = true;
            
            // Validate name
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Name is required');
                isValid = false;
            } else if (nameInput.value.trim().length < 2) {
                showError(nameInput, 'Name must be at least 2 characters');
                isValid = false;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate message
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Message is required');
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                showError(messageInput, 'Message must be at least 10 characters');
                isValid = false;
            }
            
            // If form is valid, show success message
            if (isValid) {
                showSuccessMessage();
                contactForm.reset();
            }
        });
        
        // Real-time validation on input
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Clear error on input
                if (this.classList.contains('error')) {
                    clearFieldError(this);
                }
            });
        });
    }
    
    // Helper function to show error
    function showError(input, message) {
        input.classList.add('error');
        input.style.borderColor = '#ef4444';
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        // Insert error message after input
        input.parentNode.appendChild(errorDiv);
    }
    
    // Helper function to clear errors
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => {
            clearFieldError(input);
        });
    }
    
    // Helper function to clear field error
    function clearFieldError(input) {
        input.classList.remove('error');
        input.style.borderColor = '';
        
        const errorMsg = input.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
    
    // Helper function to validate individual field
    function validateField(input) {
        const value = input.value.trim();
        
        switch(input.type) {
            case 'text':
                if (input.id === 'name') {
                    if (!value) {
                        showError(input, 'Name is required');
                        return false;
                    } else if (value.length < 2) {
                        showError(input, 'Name must be at least 2 characters');
                        return false;
                    }
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    showError(input, 'Email is required');
                    return false;
                } else if (!emailRegex.test(value)) {
                    showError(input, 'Please enter a valid email address');
                    return false;
                }
                break;
        }
        
        if (input.tagName === 'TEXTAREA' && input.id === 'message') {
            if (!value) {
                showError(input, 'Message is required');
                return false;
            } else if (value.length < 10) {
                showError(input, 'Message must be at least 10 characters');
                return false;
            }
        }
        
        clearFieldError(input);
        return true;
    }
    
    // Helper function to show success message
    function showSuccessMessage() {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        successDiv.style.cssText = `
            background-color: #10b981;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
            font-weight: 500;
            animation: slideDown 0.3s ease-out;
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Insert success message at the top of form
        contactForm.insertBefore(successDiv, contactForm.firstChild);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.style.animation = 'slideDown 0.3s ease-out reverse';
            setTimeout(() => {
                successDiv.remove();
            }, 300);
        }, 5000);
    }
    
    // ============================================
    // Scroll Animation on Elements
    // ============================================
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Optional: Unobserve after animation to improve performance
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Observe cards and other animated elements
    const animatedElements = document.querySelectorAll(
        '.education-card, .skill-category, .project-card, .contact-item, .contact-form, .profile-image-wrapper, .bio'
    );
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // ============================================
    // Set initial active nav link
    // ============================================
    
    // Check initial scroll position
    handleScroll();
    
    // Animate elements that are already in view on page load
    const checkInitialView = () => {
        const allAnimatedElements = document.querySelectorAll(
            '.education-card, .skill-category, .project-card, .contact-item, .contact-form, .profile-image-wrapper, .bio, .section'
        );
        
        allAnimatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            if (isInView) {
                element.classList.add('animate-in');
            }
        });
    };
    
    // Run check after a short delay to ensure DOM is ready
    setTimeout(checkInitialView, 100);
});
