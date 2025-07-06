// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  
  if (burger && navLinks) {
    burger.addEventListener('click', function() {
      navLinks.classList.toggle('nav-active');
      burger.classList.toggle('toggle');
    });
  }

  // Blog button enhancement script
  const viewAllBtn = document.querySelector('.view-all-btn');
  if (viewAllBtn) {
    const blogPosts = document.querySelector('.blog-posts');
    const blogCta = document.querySelector('.blog-cta');
    
    // Add hover effect classes
    viewAllBtn.classList.add('pulse-animation');
    
    // Create additional blog posts that will be shown on button click
    const hiddenBlogPosts = [
      {
        image: "photos/spice-storage.png",
        date: "February 15, 2025",
        title: "Storing Spices: How to Maintain Freshness and Flavor",
        excerpt: "Learn the best practices for storing your premium spices to ensure they retain their aromatic properties and flavors for months to come."
      },
      {
        image: "photos/health-benefits.png",
        date: "February 5, 2025",
        title: "Health Benefits of Traditional Sri Lankan Spices",
        excerpt: "Discover how incorporating these ancient spices into your daily diet can boost your immune system and improve overall wellness."
      }
    ];
    
    // Create container for hidden posts
    const hiddenPostsContainer = document.createElement('div');
    hiddenPostsContainer.className = 'hidden-blog-posts';
    hiddenPostsContainer.style.display = 'none';
    hiddenPostsContainer.style.opacity = '0';
    hiddenPostsContainer.style.transition = 'opacity 0.5s ease';
    
    // Create the HTML for hidden posts
    hiddenBlogPosts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'blog-post';
      postElement.innerHTML = `
        <div class="blog-image">
          <img src="${post.image}" alt="${post.title}" onerror="this.src='photos/meet.png'">
        </div>
        <div class="blog-content">
          <div class="blog-date">${post.date}</div>
          <h3 class="blog-title">${post.title}</h3>
          <p class="blog-excerpt">${post.excerpt}</p>
          <a href="#" class="read-more">Read More</a>
        </div>
      `;
      hiddenPostsContainer.appendChild(postElement);
    });
    
    // Add the hidden posts after the visible posts
    blogPosts.after(hiddenPostsContainer);
    
    // Create loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-spinner';
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>Loading more posts...</p>';
    loadingIndicator.style.display = 'none';
    loadingIndicator.style.textAlign = 'center';
    loadingIndicator.style.margin = '30px 0';
    
    // Add loading spinner styles
    const style = document.createElement('style');
    style.textContent = `
      .pulse-animation {
        animation: pulse 1.5s infinite;
        box-shadow: 0 0 0 rgba(76, 175, 80, 0.4);
      }
      
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
        }
      }
      
      .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #4CAF50;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 1s linear infinite;
        margin: 0 auto 15px;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .hidden-blog-posts {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 30px;
        margin-top: 30px;
      }
      
      .view-all-btn.clicked {
        background-color: #333;
        pointer-events: none;
      }
      
      @media (max-width: 768px) {
        .hidden-blog-posts {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Add loading indicator before the CTA
    blogCta.before(loadingIndicator);
    
    // Add button click event
    viewAllBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Show loading spinner
      loadingIndicator.style.display = 'block';
      
      // Change button state
      viewAllBtn.classList.add('clicked');
      viewAllBtn.textContent = 'Loading...';
      
      // Simulate loading time
      setTimeout(() => {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        
        // Show hidden posts with animation
        hiddenPostsContainer.style.display = 'grid';
        setTimeout(() => {
          hiddenPostsContainer.style.opacity = '1';
        }, 50);
        
        // Change button text and behavior
        viewAllBtn.textContent = 'Visit Blog Page';
        viewAllBtn.classList.remove('clicked');
        
        // Setup redirect on next click
        viewAllBtn.addEventListener('click', function(e) {
          e.preventDefault();
          // Add page transition effect
          const transition = document.createElement('div');
          transition.style.position = 'fixed';
          transition.style.top = '0';
          transition.style.left = '0';
          transition.style.width = '100%';
          transition.style.height = '100%';
          transition.style.backgroundColor = '#4CAF50';
          transition.style.zIndex = '9999';
          transition.style.opacity = '0';
          transition.style.transition = 'opacity 0.5s ease';
          document.body.appendChild(transition);
          
          setTimeout(() => {
            transition.style.opacity = '1';
            setTimeout(() => {
              window.location.href = 'blog.html';
            }, 500);
          }, 50);
        }, { once: true });
      }, 1500);
    });
  }

  // Newsletter form validation for both forms
  const blogSubscribeForm = document.querySelector('.blog-subscribe-form');
  if (blogSubscribeForm) {
    setupFormValidation(blogSubscribeForm, 'blog');
  }
  
  const footerSubscribeForm = document.querySelector('.footer-col form');
  if (footerSubscribeForm) {
    setupFormValidation(footerSubscribeForm, 'footer');
  }
  
  function setupFormValidation(form, formType) {
    const emailInput = form.querySelector('input[type="email"]');
    
    const messageContainer = document.createElement('div');
    messageContainer.className = `newsletter-message ${formType}-message`;
    messageContainer.style.marginTop = '15px';
    messageContainer.style.fontWeight = '500';
    messageContainer.style.transition = 'opacity 0.3s ease';
    messageContainer.style.opacity = '0';
    messageContainer.style.height = '20px';
    messageContainer.style.textAlign = 'center';
    
    if (formType === 'footer') {
      messageContainer.style.color = 'white';
    }
    
    form.parentNode.insertBefore(messageContainer, form.nextSibling);
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!email) {
        showMessage(messageContainer, 'Please enter your email address', 'error');
      } else if (!emailRegex.test(email)) {
        showMessage(messageContainer, 'Please enter a valid email address', 'error');
      } else {
        showMessage(messageContainer, 'Thank you for subscribing to our newsletter!', 'success');
        emailInput.value = '';
        console.log(`${formType} form submitted with email:`, email);
      }
    });
    
    emailInput.addEventListener('focus', function() {
      this.style.boxShadow = '0 0 0 2px rgba(76, 175, 80, 0.3)';
    });
    
    emailInput.addEventListener('blur', function() {
      this.style.boxShadow = 'none';
    });
    
    emailInput.addEventListener('input', function() {
      if (messageContainer.style.color === 'rgb(231, 76, 60)') {
        messageContainer.style.opacity = '0';
      }
    });
  }
  
  function showMessage(container, text, type) {
    container.textContent = text;
    
    if (type === 'error') {
      container.style.color = '#e74c3c';
    } else if (type === 'success') {
      container.style.color = '#2ecc71';
    }
    
    container.style.opacity = '1';
    
    if (type === 'success') {
      setTimeout(() => {
        container.style.opacity = '0';
      }, 5000);
    }
  }
  
  // Add styles for form elements
  const formStyle = document.createElement('style');
  formStyle.textContent = `
    .footer-col form {
      display: flex;
      flex-direction: column;
    }
    
    .footer-col form button {
      position: relative;
      overflow: hidden;
    }
    
    .footer-col form button:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 5px;
      height: 5px;
      background: rgba(255, 255, 255, 0.5);
      opacity: 0;
      border-radius: 100%;
      transform: scale(1, 1) translate(-50%);
      transform-origin: 50% 50%;
    }
    
    .footer-col form button:focus:not(:active):after {
      animation: ripple 1s ease-out;
    }
    
    @keyframes ripple {
      0% {
        transform: scale(0, 0);
        opacity: 0.5;
      }
      20% {
        transform: scale(25, 25);
        opacity: 0.5;
      }
      100% {
        opacity: 0;
        transform: scale(40, 40);
      }
    }
  `;
  document.head.appendChild(formStyle);
});