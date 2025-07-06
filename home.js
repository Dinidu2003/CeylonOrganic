// Burger menu functionality
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('nav-active');
  burger.classList.toggle('toggle');
});

// Photo Gallery Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Create gallery modal elements and append to body
  const galleryModal = document.createElement('div');
  galleryModal.className = 'gallery-modal';
  galleryModal.innerHTML = `
    <div class="gallery-modal-content">
      <span class="gallery-close">&times;</span>
      <img class="gallery-modal-img" src="" alt="Gallery Image">
      <div class="gallery-caption"></div>
      <div class="gallery-navigation">
        <button class="gallery-prev">&#10094;</button>
        <button class="gallery-next">&#10095;</button>
      </div>
    </div>
  `;
  document.body.appendChild(galleryModal);

  // Get all gallery images
  const galleryImages = document.querySelectorAll('.footer-gallery .gallery-img');
  let currentImageIndex = 0;
  
  // Add click event to each gallery image
  galleryImages.forEach((img, index) => {
    img.addEventListener('click', function() {
      openGalleryModal(img.src, img.getAttribute('data-caption'), index);
    });
  });
  
  // Gallery modal functions
  function openGalleryModal(src, captionText, index) {
    const modal = document.querySelector('.gallery-modal');
    const modalImg = document.querySelector('.gallery-modal-img');
    const caption = document.querySelector('.gallery-caption');
    
    document.body.style.overflow = 'hidden';
    modal.style.display = 'flex';
    modalImg.src = src;
    caption.textContent = captionText;
    currentImageIndex = index;
    
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
  }
  
  function closeGalleryModal() {
    const modal = document.querySelector('.gallery-modal');
    modal.style.opacity = '0';
    
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }
  
  function navigateGallery(direction) {
    const images = Array.from(document.querySelectorAll('.footer-gallery .gallery-img'));
    
    if (direction === 'next') {
      currentImageIndex = (currentImageIndex + 1) % images.length;
    } else {
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    }
    
    const newImage = images[currentImageIndex];
    document.querySelector('.gallery-modal-img').src = newImage.src;
    document.querySelector('.gallery-caption').textContent = newImage.getAttribute('data-caption');
  }
  
  // Event listeners for gallery
  document.querySelector('.gallery-close').addEventListener('click', closeGalleryModal);
  
  document.querySelector('.gallery-modal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeGalleryModal();
    }
  });
  
  document.querySelector('.gallery-prev').addEventListener('click', () => navigateGallery('prev'));
  document.querySelector('.gallery-next').addEventListener('click', () => navigateGallery('next'));
  
  document.addEventListener('keydown', function(e) {
    if (!document.querySelector('.gallery-modal').style.display || 
        document.querySelector('.gallery-modal').style.display === 'none') {
      return;
    }
    
    if (e.key === 'Escape') {
      closeGalleryModal();
    } else if (e.key === 'ArrowRight') {
      navigateGallery('next');
    } else if (e.key === 'ArrowLeft') {
      navigateGallery('prev');
    }
  });
});

// Review Popup Functionality
document.addEventListener('DOMContentLoaded', function() {
  const reviewBtn = document.querySelector('.leave-review-btn');
  const reviewPopup = document.getElementById('reviewPopup');
  const closeBtn = document.querySelector('.close-popup');
  const reviewForm = document.getElementById('reviewForm');
  
  // Open popup when button is clicked
  if (reviewBtn) {
    reviewBtn.addEventListener('click', function(e) {
      e.preventDefault();
      document.body.style.overflow = 'hidden';
      reviewPopup.classList.add('active');
      
      setTimeout(() => {
        reviewPopup.querySelector('.review-popup-content').style.transform = 'translateY(0)';
      }, 10);
    });
  }
  
  // Close popup functions
  function closePopup() {
    if (reviewPopup && reviewPopup.querySelector('.review-popup-content')) {
      reviewPopup.querySelector('.review-popup-content').style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        reviewPopup.classList.remove('active');
        document.body.style.overflow = '';
      }, 300);
    }
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closePopup);
  }
  
  if (reviewPopup) {
    reviewPopup.addEventListener('click', function(e) {
      if (e.target === reviewPopup) {
        closePopup();
      }
    });
  }
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && reviewPopup && reviewPopup.classList.contains('active')) {
      closePopup();
    }
  });
  
  // Handle form submission
  if (reviewForm) {
    reviewForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const location = document.getElementById('location').value;
      const rating = document.querySelector('input[name="rating"]:checked')?.value || '5';
      const reviewText = document.getElementById('review').value;
      
      console.log({
        name,
        location,
        rating,
        review: reviewText
      });
      
      // Replace form with confirmation
      reviewForm.innerHTML = `
        <div class="review-confirmation show">
          <div style="font-size: 3rem; color: #4CAF50; margin-bottom: 15px;">✓</div>
          <h3>Thank You for Your Review!</h3>
          <p>We appreciate your feedback, ${name}.</p>
          <button class="submit-review" id="closeConfirmation" style="margin-top: 20px;">Close</button>
        </div>
      `;
      
      // Add event listener to close button
      document.getElementById('closeConfirmation').addEventListener('click', function() {
        closePopup();
        
        // Reset form after closing
        setTimeout(() => {
          reviewForm.innerHTML = `
            <div class="form-group">
              <label for="name">Your Name</label>
              <input type="text" id="name" required>
            </div>
            <div class="form-group">
              <label for="location">Location</label>
              <input type="text" id="location" required>
            </div>
            <div class="form-group">
              <label for="rating">Rating</label>
              <div class="star-rating">
                <input type="radio" id="star5" name="rating" value="5">
                <label for="star5">★</label>
                <input type="radio" id="star4" name="rating" value="4">
                <label for="star4">★</label>
                <input type="radio" id="star3" name="rating" value="3">
                <label for="star3">★</label>
                <input type="radio" id="star2" name="rating" value="2">
                <label for="star2">★</label>
                <input type="radio" id="star1" name="rating" value="1">
                <label for="star1">★</label>
              </div>
            </div>
            <div class="form-group">
              <label for="review">Your Review</label>
              <textarea id="review" rows="5" required></textarea>
            </div>
            <button type="submit" class="submit-review">Submit Review</button>
          `;
        }, 300);
      });
    });
  }
});

// Newsletter subscription functionality
document.addEventListener('DOMContentLoaded', function() {
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (newsletterForm) {
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = emailInput.value.trim();
      
      if (email === '') {
        showMessage('Please enter your email address', 'error');
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
      }
      
      console.log('Email subscription for:', email);
      showMessage('Thank you for subscribing!', 'success');
      emailInput.value = '';
    });
    
    function showMessage(message, type) {
      const existingMessage = newsletterForm.querySelector('.newsletter-message');
      if (existingMessage) {
        existingMessage.remove();
      }
      
      const messageElement = document.createElement('div');
      messageElement.className = `newsletter-message ${type}`;
      messageElement.textContent = message;
      messageElement.style.padding = '10px';
      messageElement.style.marginTop = '10px';
      messageElement.style.borderRadius = '5px';
      messageElement.style.textAlign = 'center';
      messageElement.style.fontWeight = '500';
      
      if (type === 'success') {
        messageElement.style.backgroundColor = '#dff2bf';
        messageElement.style.color = '#4F8A10';
        messageElement.style.border = '1px solid #4F8A10';
      } else {
        messageElement.style.backgroundColor = '#ffbaba';
        messageElement.style.color = '#D8000C';
        messageElement.style.border = '1px solid #D8000C';
      }
      
      newsletterForm.appendChild(messageElement);
      
      setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
          messageElement.remove();
        }, 500);
      }, 3000);
    }
  }

  
});

// Add to Cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// Prevent scrolling to top when 'Add to Cart' button is clicked
addToCartButtons.forEach(button => {
  button.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default action

    const messageElement = document.createElement('div');
    messageElement.className = 'cart-message';
    messageElement.textContent = 'Added to cart successfully!';
    messageElement.style.padding = '10px';
    messageElement.style.marginTop = '10px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.textAlign = 'center';
    messageElement.style.fontWeight = '500';
    messageElement.style.backgroundColor = '#dff2bf';
    messageElement.style.color = '#4F8A10';
    messageElement.style.border = '1px solid #4F8A10';

    this.parentElement.appendChild(messageElement);

    setTimeout(() => {
      messageElement.style.opacity = '0';
      messageElement.style.transition = 'opacity 0.5s ease';

      setTimeout(() => {
        messageElement.remove();
      }, 500);
    }, 3000);
  });
});