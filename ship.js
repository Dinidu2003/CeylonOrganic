document.addEventListener('DOMContentLoaded', function() {
    // Load cart items from localStorage or initialize empty array
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // DOM Elements
    const shippingForm = document.getElementById('shipping-form');
    const summaryItemsContainer = document.querySelector('.summary-items');
    const subtotalElement = document.getElementById('summary-subtotal');
    const shippingElement = document.getElementById('summary-shipping');
    const taxElement = document.getElementById('summary-tax');
    const totalElement = document.getElementById('summary-total');
    const shippingMethods = document.querySelectorAll('input[name="shipping-method"]');
    
    // Initialize the page
    function init() {
        renderOrderSummary();
        setupEventListeners();
    }
    
    // Render order summary
    function renderOrderSummary() {
        summaryItemsContainer.innerHTML = '';
        
        if (cartItems.length === 0) {
            summaryItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            return;
        }
        
        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'summary-item';
            itemElement.innerHTML = `
                <div class="item-name">${item.name} × ${item.quantity}</div>
                <div class="item-price">Rs ${item.price * item.quantity}</div>
            `;
            summaryItemsContainer.appendChild(itemElement);
        });
        
        // Calculate totals
        const subtotal = calculateSubtotal();
        const tax = calculateTax(subtotal);
        const shipping = getShippingCost();
        const total = subtotal + tax + shipping;
        
        // Update totals
        subtotalElement.textContent = `Rs ${subtotal}`;
        taxElement.textContent = `Rs ${tax}`;
        shippingElement.textContent = `Rs ${shipping}`;
        totalElement.textContent = `Rs ${total}`;
    }
    
    // Calculate subtotal
    function calculateSubtotal() {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    // Calculate tax (10%)
    function calculateTax(subtotal) {
        return subtotal * 0.1;
    }
    
    // Get shipping cost based on selected method
    function getShippingCost() {
        const selectedMethod = document.querySelector('input[name="shipping-method"]:checked').value;
        return selectedMethod === 'standard' ? 500 : 950;
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Shipping method change
        shippingMethods.forEach(method => {
            method.addEventListener('change', function() {
                renderOrderSummary();
            });
        });
        
        // Form submission
        shippingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveShippingInfo();
            window.location.href = 'payment.html';
        });
    }
    
    // Save shipping info to localStorage
    function saveShippingInfo() {
        const shippingInfo = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            address: document.getElementById('address').value,
            address2: document.getElementById('address2').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postal-code').value,
            country: document.getElementById('country').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            saveInfo: document.getElementById('save-info').checked,
            shippingMethod: document.querySelector('input[name="shipping-method"]:checked').value
        };
        
        localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
    }
    
    // Initialize the page
    init();

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
});