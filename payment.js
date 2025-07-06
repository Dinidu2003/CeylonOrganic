document.addEventListener('DOMContentLoaded', function() {
    // Load cart items and shipping info from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let shippingInfo = JSON.parse(localStorage.getItem('shippingInfo')) || {};
    
    // DOM Elements
    const paymentForm = document.getElementById('payment-form');
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const sameAsShippingCheckbox = document.getElementById('same-as-shipping');
    const billingAddressFields = document.getElementById('billing-address-fields');
    const summaryItemsContainer = document.querySelector('.summary-items');
    const shippingDetailsContainer = document.getElementById('shipping-details');
    const subtotalElement = document.getElementById('summary-subtotal');
    const shippingElement = document.getElementById('summary-shipping');
    const taxElement = document.getElementById('summary-tax');
    const totalElement = document.getElementById('summary-total');
    
    // Payment form sections
    const creditCardForm = document.getElementById('credit-card-form');
    const paypalInfo = document.getElementById('paypal-info');
    const bankTransferInfo = document.getElementById('bank-transfer-info');
    
    // Initialize the page
    function init() {
        renderOrderSummary();
        renderShippingInfo();
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
        const shipping = shippingInfo.shippingMethod === 'standard' ? 500 : 950;
        const total = subtotal + tax + shipping;
        
        // Update totals
        subtotalElement.textContent = `Rs ${subtotal}`;
        taxElement.textContent = `Rs ${tax}`;
        shippingElement.textContent = `Rs ${shipping}`;
        totalElement.textContent = `Rs ${total}`;
    }
    
    // Render shipping information
    function renderShippingInfo() {
        if (!shippingInfo.firstName) return;
        
        shippingDetailsContainer.innerHTML = `
            <p><strong>${shippingInfo.firstName} ${shippingInfo.lastName}</strong></p>
            <p>${shippingInfo.address}</p>
            ${shippingInfo.address2 ? `<p>${shippingInfo.address2}</p>` : ''}
            <p>${shippingInfo.city}, ${shippingInfo.postalCode}</p>
            <p>${shippingInfo.country}</p>
            <p>Phone: ${shippingInfo.phone}</p>
            <p>Email: ${shippingInfo.email}</p>
            <p>Shipping Method: ${shippingInfo.shippingMethod === 'standard' ? 'Standard Delivery' : 'Express Delivery'}</p>
        `;
    }
    
    // Calculate subtotal
    function calculateSubtotal() {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    // Calculate tax (10%)
    function calculateTax(subtotal) {
        return subtotal * 0.1;
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Payment method change
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                updatePaymentFormDisplay();
            });
        });
        
        // Same as shipping checkbox
        sameAsShippingCheckbox.addEventListener('change', function() {
            billingAddressFields.style.display = this.checked ? 'none' : 'block';
        });
        
        // Form submission
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
        });
        
        // Format card number input
        document.getElementById('card-number').addEventListener('input', function(e) {
            this.value = this.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        });
        
        // Format expiry date input
        document.getElementById('card-expiry').addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
        });
        
        // Complete Order button - simply redirect to confirm.html
        document.getElementById('complete-order-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'confirm.html';
        });
    }
    
    // Update which payment form section is visible
    function updatePaymentFormDisplay() {
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        // Hide all sections first
        creditCardForm.style.display = 'none';
        paypalInfo.style.display = 'none';
        bankTransferInfo.style.display = 'none';
        
        // Show selected section
        switch(selectedMethod) {
            case 'credit-card':
                creditCardForm.style.display = 'block';
                break;
            case 'paypal':
                paypalInfo.style.display = 'block';
                break;
            case 'bank-transfer':
                bankTransferInfo.style.display = 'block';
                break;
        }
    }
    
    // Mobile menu toggle functionality
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    if (burger) {
        burger.addEventListener('click', function() {
            nav.classList.toggle('nav-active');
            
            // Animate links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
                }
            });
            
            // Burger animation
            burger.classList.toggle('toggle');
        });
    }
    
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

    // Initialize the page
    init();
});