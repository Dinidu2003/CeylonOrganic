// Product filtering functionality for Ceylon Organic
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const categoryFilter = document.getElementById('category');
  const sortFilter = document.getElementById('sort');
  const priceFilter = document.getElementById('price');
  const searchInput = document.querySelector('.search-input');
  const productsGrid = document.querySelector('.products-grid');
  const productCards = document.querySelectorAll('.product-card');
  
  // Store original product cards for resetting
  const originalProductCards = Array.from(productCards);
  
  // Event listeners for filters
  categoryFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
  priceFilter.addEventListener('change', applyFilters);
  
  // Event listener for search with slight delay to avoid excessive filtering while typing
  let searchTimeout;
  searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(applyFilters, 300);
  });
  
  // Main filter function
  function applyFilters() {
      const category = categoryFilter.value;
      const sortBy = sortFilter.value;
      const priceRange = priceFilter.value;
      const searchTerm = searchInput.value.toLowerCase().trim();
      
      // Make a copy of the original products to work with
      let filteredProducts = [...originalProductCards];
      
      // Filter by category
      if (category !== 'all') {
          filteredProducts = filteredProducts.filter(product => {
              const productCategory = product.querySelector('.product-category').textContent.toLowerCase();
              return productCategory.includes(category.toLowerCase());
          });
      }
      
      // Filter by price range
      if (priceRange !== 'all') {
          filteredProducts = filteredProducts.filter(product => {
              const priceText = product.querySelector('.product-price').textContent;
              const price = parseInt(priceText.replace(/[^0-9]/g, ''));
              
              switch(priceRange) {
                  case 'under-10':
                      return price < 1000;
                  case '10-20':
                      return price >= 1000 && price <= 2000;
                  case '20-30':
                      return price >= 2000 && price <= 3000;
                  case 'over-30':
                      return price > 3000;
                  default:
                      return true;
              }
          });
      }
      
      // Filter by search term
      if (searchTerm) {
          filteredProducts = filteredProducts.filter(product => {
              const title = product.querySelector('.product-title').textContent.toLowerCase();
              const description = product.querySelector('.product-desc').textContent.toLowerCase();
              const category = product.querySelector('.product-category').textContent.toLowerCase();
              
              return title.includes(searchTerm) || 
                     description.includes(searchTerm) || 
                     category.includes(searchTerm);
          });
      }
      
      // Sort products
      filteredProducts.sort((a, b) => {
          const priceA = parseInt(a.querySelector('.product-price').textContent.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.querySelector('.product-price').textContent.replace(/[^0-9]/g, ''));
          
          const ratingA = a.querySelector('.product-rating').textContent.split('★').length - 1;
          const ratingB = b.querySelector('.product-rating').textContent.split('★').length - 1;
          
          switch(sortBy) {
              case 'price-low':
                  return priceA - priceB;
              case 'price-high':
                  return priceB - priceA;
              case 'popularity':
                  return ratingB - ratingA; // Higher rating = more popular
              default:
                  return 0; // Keep original order for "newest"
          }
      });
      
      // Update the UI with filtered products
      updateProductsDisplay(filteredProducts);
  }
  
  // Update the display of products
  function updateProductsDisplay(filteredProducts) {
      // Clear current products
      productsGrid.innerHTML = '';
      
      if (filteredProducts.length === 0) {
          // Show "no products found" message
          const noProductsMessage = document.createElement('div');
          noProductsMessage.className = 'no-products-message';
          noProductsMessage.textContent = 'No products match your filters. Please try different criteria.';
          noProductsMessage.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 40px; font-size: 1.2rem; color: #666;';
          productsGrid.appendChild(noProductsMessage);
      } else {
          // Add filtered products to the grid
          filteredProducts.forEach(product => {
              productsGrid.appendChild(product.cloneNode(true));
          });
          
          // Re-attach event listeners to "Add to Cart" buttons
          document.querySelectorAll('.add-to-cart').forEach(button => {
              button.addEventListener('click', function(e) {
                  e.preventDefault();
                  const productName = this.closest('.product-card').querySelector('.product-title').textContent;
                  alert(`${productName} added to cart!`);
              });
          });
      }
      
      // Update result count information (optional)
      const resultCountElement = document.createElement('div');
      resultCountElement.className = 'filter-results-count';
      resultCountElement.textContent = `Showing ${filteredProducts.length} product(s)`;
      resultCountElement.style.cssText = 'text-align: center; margin-top: 20px; font-size: 0.9rem; color: #666;';
      
      // Check if result count element already exists
      const existingCount = document.querySelector('.filter-results-count');
      if (existingCount) {
          existingCount.remove();
      }
      
      // Add result count after the products grid
      productsGrid.parentNode.insertBefore(resultCountElement, productsGrid.nextSibling);
  }
  
  // Initialize "Add to Cart" functionality
  document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function(e) {
          e.preventDefault();
          const productName = this.closest('.product-card').querySelector('.product-title').textContent;
          alert(`${productName} added to cart!`);
      });
  });
  
  // Add to Cart functionality with message display
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('.product-title').textContent;

      // Display green message
      const messageElement = document.createElement('div');
      messageElement.className = 'cart-message';
      messageElement.textContent = `${productName} added to cart successfully!`;
      messageElement.style.padding = '10px';
      messageElement.style.marginTop = '10px';
      messageElement.style.borderRadius = '5px';
      messageElement.style.textAlign = 'center';
      messageElement.style.fontWeight = '500';
      messageElement.style.backgroundColor = '#dff2bf';
      messageElement.style.color = '#4F8A10';
      messageElement.style.border = '1px solid #4F8A10';

      productCard.appendChild(messageElement);

      setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
          messageElement.remove();
        }, 500);
      }, 3000);
    });
  });
  
  // Reset filters button (optional enhancement)
  const filterContainer = document.querySelector('.filter-container');
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset Filters';
  resetButton.className = 'reset-filters-btn';
  resetButton.style.cssText = 'background-color: #ddd; color: #333; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-top: 30px;';
  
  resetButton.addEventListener('click', function() {
      categoryFilter.value = 'all';
      sortFilter.value = 'popularity';
      priceFilter.value = 'all';
      searchInput.value = '';
      updateProductsDisplay(originalProductCards);
  });
  
  filterContainer.appendChild(resetButton);
  
  // Mobile menu toggle functionality
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li');
  
  // Only set up the burger menu if we're on mobile
  if (window.innerWidth <= 768) {
      burger.addEventListener('click', function() {
          // Toggle Nav
          nav.classList.toggle('nav-active');
          
          // Animate Links
          navLinks.forEach((link, index) => {
              if (link.style.animation) {
                  link.style.animation = '';
              } else {
                  link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
              }
          });
          
          // Burger Animation
          burger.classList.toggle('toggle');
      });

      // Close menu when clicking on a link
      navLinks.forEach(link => {
          link.addEventListener('click', () => {
              nav.classList.remove('nav-active');
              burger.classList.remove('toggle');
              navLinks.forEach(link => {
                  link.style.animation = '';
              });
          });
      });
  }
  
  // Handle window resize
  window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
          // Reset menu if window is resized to desktop size
          nav.classList.remove('nav-active');
          burger.classList.remove('toggle');
          navLinks.forEach(link => {
              link.style.animation = '';
          });
      }
  });
});