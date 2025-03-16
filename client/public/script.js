// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Offset for fixed header
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Tab functionality for loan types in application section
    const loanTabBtns = document.querySelectorAll('.loan-tab-btn');
    loanTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            loanTabBtns.forEach(tab => tab.classList.remove('active'));
            
            // Hide all tab content
            document.querySelectorAll('.loan-tab-content').forEach(content => {
                content.classList.add('hidden');
                content.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show the associated tab content
            const tabId = this.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId + '-content');
            tabContent.classList.remove('hidden');
            tabContent.classList.add('active');
        });
    });

    // Glossary search functionality
    const glossarySearch = document.getElementById('glossary-search');
    const glossaryItems = document.querySelectorAll('.glossary-item');
    
    if (glossarySearch) {
        glossarySearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            glossaryItems.forEach(item => {
                const termTitle = item.querySelector('h3').textContent.toLowerCase();
                const termDescription = item.querySelector('p').textContent.toLowerCase();
                
                if (termTitle.includes(searchTerm) || termDescription.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Form submission for newsletter
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const interest = document.getElementById('interest').value;
            
            // Basic validation
            if (!name || !email || !interest) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';
            
            // Simulate API call
            setTimeout(() => {
                submitBtn.textContent = 'Subscribed!';
                subscribeForm.reset();
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }

    // "Start Learning" button scroll functionality
    const startLearningBtn = document.getElementById('startLearningBtn');
    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', function() {
            const loanTypesSection = document.getElementById('loan-types');
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = loanTypesSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }

    // Add hover animation classes to relevant elements
    const animateItems = document.querySelectorAll('.bg-white.p-6.rounded-xl');
    animateItems.forEach(item => {
        item.classList.add('hover-animate');
    });

    // Add fade-in animation for sections as user scrolls
    const fadeInElements = document.querySelectorAll('section');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeInElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeInObserver.observe(element);
    });

    // Apply image hover effects
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.classList.add('image-hover');
    });
});

// Prevent zooming
window.addEventListener("wheel", (e) => {
    const isPinching = e.ctrlKey;
    if (isPinching) e.preventDefault();
}, { passive: false });
