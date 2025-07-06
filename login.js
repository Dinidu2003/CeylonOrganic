document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.querySelector('.login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
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
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const rememberMe = rememberCheckbox.checked;
        
        // Validate inputs
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', false);
            emailInput.focus();
            return;
        }
        
        if (!validatePassword(password)) {
            showNotification('Password must be at least 6 characters', false);
            passwordInput.focus();
            return;
        }
        
        // Simulate login process (in a real app, this would be an API call)
        setTimeout(() => {
            showNotification('Login successful! Redirecting...');
            
            // Store login state if "Remember me" is checked
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('email', email);
            } else {
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('email');
            }
            
            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 2000);
        }, 1000);
    });

    // Google login
    googleBtn.addEventListener('click', function() {
        showNotification('Redirecting to Google login...');
        // In a real app, this would redirect to Google OAuth
        // window.location.href = '/auth/google';
        
        // Simulate Google login success
        setTimeout(() => {
            showNotification('Google login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 2000);
        }, 1500);
    });

    // Facebook login
    facebookBtn.addEventListener('click', function() {
        showNotification('Redirecting to Facebook login...');
        // In a real app, this would redirect to Facebook OAuth
        // window.location.href = '/auth/facebook';
        
        // Simulate Facebook login success
        setTimeout(() => {
            showNotification('Facebook login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 2000);
        }, 1500);
    });

    // Forgot password link
    document.querySelector('.forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Password reset link sent to your email (simulated)');
    });

    // Check for remembered email
    if (localStorage.getItem('rememberMe') === 'true') {
        const rememberedEmail = localStorage.getItem('email');
        if (rememberedEmail) {
            emailInput.value = rememberedEmail;
            rememberCheckbox.checked = true;
        }
    }

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