document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const signupForm = document.getElementById('signup-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const termsCheckbox = document.getElementById('terms');
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);

    // Notification function
    function showNotification(message, isSuccess = true) {
        notification.textContent = message;
        notification.style.backgroundColor = isSuccess ? '#4CAF50' : '#f44336';
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Form validation
    function validateName(name) {
        return name.trim().length >= 3;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 8;
    }

    function passwordsMatch(password, confirmPassword) {
        return password === confirmPassword;
    }

    // Signup form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const acceptedTerms = termsCheckbox.checked;
        
        // Validate inputs
        if (!validateName(name)) {
            showNotification('Please enter your full name (at least 3 characters)', false);
            nameInput.focus();
            return;
        }
        
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', false);
            emailInput.focus();
            return;
        }
        
        if (!validatePassword(password)) {
            showNotification('Password must be at least 8 characters', false);
            passwordInput.focus();
            return;
        }
        
        if (!passwordsMatch(password, confirmPassword)) {
            showNotification('Passwords do not match', false);
            confirmPasswordInput.focus();
            return;
        }
        
        if (!acceptedTerms) {
            showNotification('You must accept the terms and conditions', false);
            return;
        }
        
        // Simulate signup process (in a real app, this would be an API call)
        showNotification('Creating your account...');
        
        setTimeout(() => {
            showNotification('Account created successfully! Redirecting to login...');
            
            // In a real app, you would store the user data and redirect
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }, 1500);
    });

    // Google signup
    googleBtn.addEventListener('click', function() {
        showNotification('Redirecting to Google signup...');
        // In a real app, this would redirect to Google OAuth
        // window.location.href = '/auth/google';
        
        // Simulate Google signup success
        setTimeout(() => {
            showNotification('Google signup successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 2000);
        }, 1500);
    });

    // Facebook signup
    facebookBtn.addEventListener('click', function() {
        showNotification('Redirecting to Facebook signup...');
        // In a real app, this would redirect to Facebook OAuth
        // window.location.href = '/auth/facebook';
        
        // Simulate Facebook signup success
        setTimeout(() => {
            showNotification('Facebook signup successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 2000);
        }, 1500);
    });

    // Burger menu functionality
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle nav
        navLinks.classList.toggle('active');
        
        // Burger animation
        burger.classList.toggle('toggle');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close menu when clicking on a link (for mobile)
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                burger.classList.remove('toggle');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Close menu when window is resized above mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            burger.classList.remove('toggle');
            document.body.style.overflow = 'auto';
        }
    });
});