/**
 * Vanaa Website JavaScript
 * Handles navigation, smooth scrolling, mobile menu, and animations
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================
  // NAVIGATION & MOBILE MENU
  // ===================================
  
  const navToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.querySelector('.site-header');
  
  // Mobile menu toggle
  if (navToggle && navMenu) {
    // Handle both click and touch events
    function toggleMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    }
    
    navToggle.addEventListener('click', toggleMenu);
    navToggle.addEventListener('touchstart', toggleMenu, { passive: false });
    
    // Close mobile menu when clicking on links (only if mobile menu is open)
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        }
      });
      link.addEventListener('touchstart', function() {
        if (navMenu.classList.contains('active')) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        }
      });
    });
    
    // Close mobile menu when clicking outside
    function closeMenu(event) {
      if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    }
    
    document.addEventListener('click', closeMenu);
    document.addEventListener('touchstart', closeMenu);
    
    // Handle window resize - close mobile menu when switching to desktop
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
  
  // ===================================
  // SMOOTH SCROLLING
  // ===================================
  
  // Smooth scroll for anchor links only (not navigation to other pages)
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only apply smooth scrolling to anchor links (starting with #)
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        
        if (targetSection) {
          const headerHeight = header ? header.offsetHeight : 80;
          const targetPosition = targetSection.offsetTop - headerHeight - 20;
        
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Smooth scroll for CTA buttons
  const ctaButtons = document.querySelectorAll('a[href^="#"]');
  ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ===================================
  // SCROLL EFFECTS
  // ===================================
  
  // Header background on scroll
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '';
      }
    });
  }
  
  // ===================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ===================================
  
  // Set up intersection observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Add fade-in class to sections and observe them
  const sections = document.querySelectorAll('.section');
  sections.forEach((section, index) => {
    section.classList.add('fade-in');
    section.style.transitionDelay = `${index * 100}ms`;
    observer.observe(section);
  });
  
  // Also observe cards and other elements
  const cards = document.querySelectorAll('.step-card, .perspective-card, .industry-card, .comparison-card, .security-principle');
  cards.forEach((card, index) => {
    card.classList.add('fade-in');
    card.style.transitionDelay = `${index * 50}ms`;
    observer.observe(card);
  });
  
  // ===================================
  // ACTIVE NAV LINK ON SCROLL
  // ===================================
  
  // Highlight active navigation link based on scroll position
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all nav links
        navLinks.forEach(link => link.classList.remove('active'));
        // Add active class to current nav link
        if (navLink) {
          navLink.classList.add('active');
        }
      }
    });
  }
  
  // Throttle scroll events for performance
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveNavLink, 10);
  });
  
  // ===================================
  // FORM HANDLING
  // ===================================
  
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const formValues = {};
      for (let [key, value] of formData.entries()) {
        formValues[key] = value;
      }
      
      // Simple form validation
      if (!formValues.name || !formValues.email || !formValues.company) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formValues.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }
      
      // Show success message (in a real app, this would submit to a server)
      showNotification('Thank you for your interest! We\'ll be in touch soon.', 'success');
      contactForm.reset();
      
      console.log('Form submission:', formValues);
    });
  }
  
  // ===================================
  // UTILITY FUNCTIONS
  // ===================================
  
  // Show notification
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }
  
  // ===================================
  // KEYBOARD NAVIGATION
  // ===================================
  
  // Handle keyboard navigation for accessibility
  document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
  
  // ===================================
  // PERFORMANCE OPTIMIZATIONS
  // ===================================
  
  // Lazy load images when they come into view
  const images = document.querySelectorAll('img[data-src]');
  if (images.length > 0) {
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  // ===================================
  // ANALYTICS & TRACKING (placeholder)
  // ===================================
  
  // Track CTA button clicks
  const ctaTrackingButtons = document.querySelectorAll('.btn-primary');
  ctaTrackingButtons.forEach(button => {
    button.addEventListener('click', function() {
      const buttonText = this.textContent.trim();
      console.log('CTA clicked:', buttonText);
      // In a real application, this would send data to an analytics service
    });
  });
  
  // Track section views
  const sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id || 'unknown';
        console.log('Section viewed:', sectionId);
        // In a real application, this would send data to an analytics service
      }
    });
  }, { threshold: 0.5 });
  
  sections.forEach(section => {
    if (section.id) {
      sectionObserver.observe(section);
    }
  });
  
});

// ===================================
// ADDITIONAL UTILITIES
// ===================================

// Utility function to debounce events
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Utility function to throttle events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export functions for potential use in other scripts
window.VanaaUtils = {
  debounce,
  throttle
};
