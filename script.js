// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contact-form');
const adminForm = document.getElementById('admin-form');
const adminLogin = document.getElementById('admin-login');
const responsesContainer = document.getElementById('responses-container');
const responsesList = document.getElementById('responses-list');
const logoutBtn = document.getElementById('logout-btn');
const successModal = document.getElementById('success-modal');
const closeModalBtn = document.querySelector('.close-modal');
const closeModalBtn2 = document.querySelector('.close-btn');

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);

// Theme Toggle
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    const icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
    if (themeToggle) {
        themeToggle.innerHTML = `<i class="fas ${icon}"></i>`;
    }
}

// Mobile Navigation Toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Contact Form Submission
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        saveResponse(formData);
        
        // Show success message
        showSuccessModal();
        
        // Reset form
        this.reset();
    });
}

// Save response to localStorage
function saveResponse(response) {
    let responses = JSON.parse(localStorage.getItem('contactResponses')) || [];
    responses.unshift(response); // Add new response to the beginning
    localStorage.setItem('contactResponses', JSON.stringify(responses));
}

// Show success modal
function showSuccessModal() {
    successModal.style.display = 'flex';
    setTimeout(() => {
        successModal.classList.add('show');
    }, 10);
}

// Close modal
function closeModal() {
    successModal.classList.remove('show');
    setTimeout(() => {
        successModal.style.display = 'none';
    }, 300);
}

// Close modal when clicking the close button or outside the modal
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (closeModalBtn2) closeModalBtn2.addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
window.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeModal();
    }
});

// Admin Login
if (adminForm) {
    adminForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple authentication (in a real app, use a secure authentication method)
        if (username === 'admin' && password === 'admin123') {
            // Store login state
            sessionStorage.setItem('isAdminLoggedIn', 'true');
            
            // Hide login form and show responses
            adminLogin.style.display = 'none';
            responsesContainer.style.display = 'block';
            
            // Load responses
            loadResponses();
        } else {
            alert('Invalid credentials. Please try again.');
        }
        
        // Clear form
        this.reset();
    });
}

// Check if admin is already logged in
function checkAdminLogin() {
    const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
    if (isLoggedIn) {
        adminLogin.style.display = 'none';
        responsesContainer.style.display = 'block';
        loadResponses();
    } else {
        adminLogin.style.display = 'block';
        responsesContainer.style.display = 'none';
    }
}

// Load and display responses
function loadResponses() {
    const responses = JSON.parse(localStorage.getItem('contactResponses')) || [];
    
    if (responses.length === 0) {
        responsesList.innerHTML = '<p>No responses yet.</p>';
        return;
    }
    
    responsesList.innerHTML = responses.map((response, index) => `
        <div class="response-item" style="animation-delay: ${index * 0.1}s">
            <div class="response-header">
                <div>
                    <span class="response-name">${escapeHtml(response.name)}</span>
                    <span class="response-email">${escapeHtml(response.email)}</span>
                </div>
                <span class="response-time">${formatDate(response.timestamp)}</span>
            </div>
            <div class="response-subject">${escapeHtml(response.subject)}</div>
            <p class="response-message">${escapeHtml(response.message)}</p>
        </div>
    `).join('');
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('isAdminLoggedIn');
        checkAdminLogin();
    });
}

// Format date to a readable format
function formatDate(isoString) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Initialize admin section
if (adminLogin && responsesContainer) {
    checkAdminLogin();
}

// Add animation to sections when scrolling
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Add active class to nav links on scroll
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelector(`.nav-links a[href*=${sectionId}]`).classList.add('active');
        } else {
            const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
            if (navLink) {
                navLink.classList.remove('active');
            }
        }
    });
});
