document.addEventListener('DOMContentLoaded', function() {
  // Cart items data
  let cartItems = [
      {
          id: 'cinnamon',
          name: 'Ceylon Cinnamon',
          category: 'Spices',
          variant: '100g package',
          price: 1000,
          quantity: 1,
          image: 'photos/cinnamon.png'
      },
      {
          id: 'turmeric',
          name: 'Turmeric Powder',
          category: 'Spices',
          variant: '75g package',
          price: 800,
          quantity: 2,
          image: 'photos/tumeric.png'
      },
      {
          id: 'basil',
          name: 'Holy Basil Leaves',
          category: 'Herbs',
          variant: '50g package',
          price: 900,
          quantity: 1,
          image: 'photos/basil.png'
      }
  ];

  // Recommended products data
  const recommendedProducts = [
      {
          id: 'cardamom',
          name: 'Cardamom',
          category: 'Spices',
          price: 1500,
          rating: 2.0,
          image: 'photos/cardmom.png',
          badge: 'Bestseller'
      },
      {
          id: 'cloves',
          name: 'Cloves',
          category: 'Spices',
          price: 900,
          rating: 1.0,
          image: 'photos/cloves.png'
      },
      {
          id: 'nutmeg',
          name: 'Nutmeg & Mace',
          category: 'Spices',
          price: 1200,
          rating: 4.0,
          image: 'photos/nutmeg.png',
          badge: 'Popular'
      },
      {
          id: 'kothala',
          name: 'Kothala Himbutu',
          category: 'Herbs',
          price: 1100,
          rating: 4.0,
          image: 'photos/kothala.png',
          badge: 'Top Rated'
      }
  ];

  // State variables
  let shippingMethod = 'standard';

  // DOM Elements
  const cartItemsContainer = document.getElementById('cart-items');
  const itemCountElement = document.getElementById('item-count');
  const subtotalElement = document.getElementById('subtotal');
  const shippingElement = document.getElementById('shipping');
  const taxElement = document.getElementById('tax');
  const totalElement = document.getElementById('total-amount');
  const clearCartBtn = document.getElementById('clear-cart');
  const updateCartBtn = document.getElementById('update-cart');
  const checkoutBtn = document.getElementById('checkout-btn');
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notification-message');
  const productCarousel = document.getElementById('product-carousel');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-links li');

  // Initialize the page
  function init() {
      loadCartFromStorage();
      renderCartItems();
      updateOrderSummary();
      renderRecommendedProducts();
      setupEventListeners();
      highlightCurrentStep();
  }

  // Render cart items
  function renderCartItems() {
      cartItemsContainer.innerHTML = '';
      let totalItems = 0;

      cartItems.forEach(item => {
          totalItems += item.quantity;
          
          const itemElement = document.createElement('div');
          itemElement.className = 'cart-item';
          itemElement.dataset.id = item.id;
          itemElement.innerHTML = `
              <div class="item-image">
                  <img src="${item.image}" alt="${item.name}">
              </div>
              <div class="item-details">
                  <h3 class="item-name">${item.name}</h3>
                  <p class="item-category">${item.category}</p>
                  <p class="item-variant">${item.variant}</p>
                  <div class="item-unit-price">Rs ${item.price} each</div>
              </div>
              <div class="item-quantity">
                  <button class="qty-btn qty-minus"><i class="fas fa-minus"></i></button>
                  <input type="number" min="1" value="${item.quantity}" class="qty-input">
                  <button class="qty-btn qty-plus"><i class="fas fa-plus"></i></button>
              </div>
              <div class="item-subtotal">Rs ${item.price * item.quantity}</div>
              <div class="item-actions">
                  <button class="item-action save-item"><i class="far fa-heart"></i></button>
                  <button class="item-action remove-item"><i class="far fa-trash-alt"></i></button>
              </div>
          `;
          
          cartItemsContainer.appendChild(itemElement);
      });

      itemCountElement.textContent = `${totalItems} ${totalItems === 1 ? 'Item' : 'Items'}`;
  }

  // Update order summary
  function updateOrderSummary() {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.1;
      const shippingCost = shippingMethod === 'standard' ? 500 : 950;
      const total = subtotal + tax + shippingCost;

      subtotalElement.textContent = `Rs ${subtotal}`;
      taxElement.textContent = `Rs ${tax}`;
      shippingElement.textContent = `Rs ${shippingCost}`;
      totalElement.textContent = `Rs ${total}`;
  }

  // Render recommended products
  function renderRecommendedProducts() {
      productCarousel.innerHTML = '';
      
      recommendedProducts.forEach(product => {
          const stars = Array(5).fill().map((_, i) => 
              i < Math.floor(product.rating) ? 'fas fa-star' : 'far fa-star'
          );
          
          const productElement = document.createElement('div');
          productElement.className = 'product-card';
          productElement.innerHTML = `
              ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
              <div class="product-image">
                  <img src="${product.image}" alt="${item.name}">
                  <div class="product-actions">
                      <button class="quick-add"><i class="fas fa-shopping-cart"></i></button>
                      <button class="quick-view"><i class="far fa-eye"></i></button>
                      <button class="quick-wishlist"><i class="far fa-heart"></i></button>
                  </div>
              </div>
              <div class="product-info">
                  <div class="product-category">${product.category}</div>
                  <h3 class="product-title">${product.name}</h3>
                  <div class="product-rating">
                      ${stars.map(star => `<i class="${star}"></i>`).join('')}
                      <span>(${product.rating})</span>
                  </div>
                  <div class="product-price">Rs ${product.price}</div>
              </div>
          `;
          
          productCarousel.appendChild(productElement);
      });
  }

  // Show notification
  function showNotification(message) {
      notificationMessage.textContent = message;
      notification.classList.add('show');
      
      setTimeout(() => {
          notification.classList.remove('show');
      }, 3000);
  }

  // Setup event listeners
  function setupEventListeners() {
      // Quantity buttons
      document.addEventListener('click', function(e) {
          if (e.target.classList.contains('qty-minus') || e.target.parentElement.classList.contains('qty-minus')) {
              const itemId = e.target.closest('.cart-item').dataset.id;
              const item = cartItems.find(item => item.id === itemId);
              if (item.quantity > 1) {
                  item.quantity--;
                  renderCartItems();
                  updateOrderSummary();
                  showNotification('Quantity decreased');
                  saveCartToStorage();
              }
          }
          
          if (e.target.classList.contains('qty-plus') || e.target.parentElement.classList.contains('qty-plus')) {
              const itemId = e.target.closest('.cart-item').dataset.id;
              const item = cartItems.find(item => item.id === itemId);
              item.quantity++;
              renderCartItems();
              updateOrderSummary();
              showNotification('Quantity increased');
              saveCartToStorage();
          }
      });

      // Quantity input changes
      document.addEventListener('change', function(e) {
          if (e.target.classList.contains('qty-input')) {
              const itemId = e.target.closest('.cart-item').dataset.id;
              const item = cartItems.find(item => item.id === itemId);
              const newQuantity = parseInt(e.target.value);
              
              if (newQuantity > 0) {
                  item.quantity = newQuantity;
                  updateOrderSummary();
                  showNotification('Quantity updated');
                  saveCartToStorage();
              } else {
                  e.target.value = item.quantity;
              }
          }
      });

      // Remove item
      document.addEventListener('click', function(e) {
          if (e.target.classList.contains('remove-item') || e.target.parentElement.classList.contains('remove-item')) {
              const itemId = e.target.closest('.cart-item').dataset.id;
              cartItems = cartItems.filter(item => item.id !== itemId);
              renderCartItems();
              updateOrderSummary();
              showNotification('Item removed from cart');
              saveCartToStorage();
          }
      });

      // Save for later (wishlist)
      document.addEventListener('click', function(e) {
          if (e.target.classList.contains('save-item') || e.target.parentElement.classList.contains('save-item')) {
              const itemId = e.target.closest('.cart-item').dataset.id;
              const item = cartItems.find(item => item.id === itemId);
              showNotification(`${item.name} saved for later`);
          }
      });

      // Shipping method change
      document.querySelectorAll('input[name="shipping"]').forEach(radio => {
          radio.addEventListener('change', function() {
              shippingMethod = this.value;
              updateOrderSummary();
              showNotification(`Shipping method updated to ${this.value}`);
          });
      });

      // Clear cart
      clearCartBtn.addEventListener('click', function() {
          cartItems = [];
          renderCartItems();
          updateOrderSummary();
          showNotification('Cart cleared');
          saveCartToStorage();
      });

      // Update cart
      updateCartBtn.addEventListener('click', function() {
          showNotification('Cart updated');
      });

      // Proceed to checkout
      checkoutBtn.addEventListener('click', function() {
          if (cartItems.length > 0) {
              showNotification('Proceeding to checkout');
              // In a real app, you would redirect to checkout page
              // window.location.href = 'checkout.html';
          } else {
              showNotification('Your cart is empty');
          }
      });

      // Recommended products - quick add
      document.addEventListener('click', function(e) {
          if (e.target.classList.contains('quick-add') || e.target.parentElement.classList.contains('quick-add')) {
              const productCard = e.target.closest('.product-card');
              const productTitle = productCard.querySelector('.product-title').textContent;
              const productPrice = parseInt(productCard.querySelector('.product-price').textContent.replace('Rs ', ''));
              
              // Check if product already in cart
              const existingItem = cartItems.find(item => item.name === productTitle);
              
              if (existingItem) {
                  existingItem.quantity++;
              } else {
                  cartItems.push({
                      id: productTitle.toLowerCase().replace(/\s+/g, '-'),
                      name: productTitle,
                      category: productCard.querySelector('.product-category').textContent,
                      variant: '50g package', // Default variant
                      price: productPrice,
                      quantity: 1,
                      image: productCard.querySelector('img').src
                  });
              }
              
              renderCartItems();
              updateOrderSummary();
              showNotification(`${productTitle} added to cart`);
              saveCartToStorage();
          }
      });

      // Quick view
      document.addEventListener('click', function(e) {
          if (e.target.classList.contains('quick-view') || e.target.parentElement.classList.contains('quick-view')) {
              const productTitle = e.target.closest('.product-card').querySelector('.product-title').textContent;
              showNotification(`Viewing ${productTitle}`);
          }
      });

      // Add to wishlist from recommended
      document.addEventListener('click', function(e) {
          if (e.target.classList.contains('quick-wishlist') || e.target.parentElement.classList.contains('quick-wishlist')) {
              const productTitle = e.target.closest('.product-card').querySelector('.product-title').textContent;
              showNotification(`${productTitle} added to wishlist`);
          }
      });

      // Carousel navigation
      let currentPosition = 0;
      const itemWidth = 250; // Approximate width of each product card + margin
      
      prevBtn.addEventListener('click', function() {
          if (currentPosition < 0) {
              currentPosition += itemWidth;
              productCarousel.style.transform = `translateX(${currentPosition}px)`;
          }
      });
      
      nextBtn.addEventListener('click', function() {
          const maxPosition = -1 * (recommendedProducts.length - 4) * itemWidth;
          if (currentPosition > maxPosition) {
              currentPosition -= itemWidth;
              productCarousel.style.transform = `translateX(${currentPosition}px)`;
          }
      });

      // Burger menu functionality
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

      // Smooth page transitions
      document.querySelectorAll('a').forEach(link => {
          if (link.href.includes('.html') && !link.classList.contains('no-transition')) {
              link.addEventListener('click', function(e) {
                  e.preventDefault();
                  document.body.classList.add('fade-out');
                  
                  setTimeout(() => {
                      window.location.href = link.href;
                  }, 300);
              });
          }
      });
  }

  // Highlight current step in checkout progress
  function highlightCurrentStep() {
      const currentPage = window.location.pathname.split('/').pop();
      const steps = document.querySelectorAll('.progress-step');
      
      steps.forEach(step => {
          step.classList.remove('active');
      });
      
      switch(currentPage) {
          case 'cart.html':
              steps[0].classList.add('active');
              break;
          case 'ship.html':
              steps[1].classList.add('active');
              break;
          case 'payment.html':
              steps[2].classList.add('active');
              break;
          case 'confirm.html':
              steps[3].classList.add('active');
              break;
      }
  }

  // Save cart to localStorage
  function saveCartToStorage() {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  // Load cart from localStorage
  function loadCartFromStorage() {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
          cartItems = JSON.parse(savedCart);
      }
  }

  // Close menu when window is resized above mobile breakpoint
  window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
          navLinks.classList.remove('active');
          burger.classList.remove('toggle');
          document.body.style.overflow = 'auto';
      }
  });

  // Initialize the page
  init();
});