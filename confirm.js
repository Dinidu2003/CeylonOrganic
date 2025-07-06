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
    const completeOrderBtn = document.getElementById('complete-order-btn');
    
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
                <div class="item-price">Rs ${(item.price * item.quantity).toFixed(2)}</div>
            `;
            summaryItemsContainer.appendChild(itemElement);
        });
        
        // Calculate totals
        const subtotal = calculateSubtotal();
        const tax = calculateTax(subtotal);
        const shipping = shippingInfo.shippingMethod === 'standard' ? 500 : 950;
        const total = subtotal + tax + shipping;
        
        // Update totals
        subtotalElement.textContent = `Rs ${subtotal.toFixed(2)}`;
        taxElement.textContent = `Rs ${tax.toFixed(2)}`;
        shippingElement.textContent = `Rs ${shipping.toFixed(2)}`;
        totalElement.textContent = `Rs ${total.toFixed(2)}`;
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
        
        // Complete Order button
        completeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validate payment method and form
            const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
            if (!selectedMethod) {
                showNotification('Please select a payment method', 'error');
                return;
            }
            
            // For credit card, validate the form
            if (selectedMethod.value === 'credit-card' && !validateCreditCardForm()) {
                showNotification('Please fill in all credit card details correctly', 'error');
                return;
            }
            
            if (cartItems.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }
            
            if (!shippingInfo.firstName) {
                showNotification('Shipping information is missing', 'error');
                return;
            }
            
            // Create order object
            const order = {
                orderId: generateOrderId(),
                date: new Date().toISOString(),
                items: cartItems,
                shippingInfo: shippingInfo,
                paymentMethod: selectedMethod.value,
                billingAddress: sameAsShippingCheckbox.checked ? shippingInfo : getBillingAddress(),
                subtotal: calculateSubtotal(),
                tax: calculateTax(calculateSubtotal()),
                shipping: shippingInfo.shippingMethod === 'standard' ? 500 : 950,
                status: 'processing'
            };
            
            // Save order to localStorage
            saveOrder(order);
            
            // Clear cart
            localStorage.removeItem('cartItems');
            
            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            this.disabled = true;
            
            // Simulate processing delay
            setTimeout(() => {
                // Redirect to confirmation page with order ID
                window.location.href = `confirm.html?orderId=${order.orderId}`;
            }, 1500);
        });
        
        // Format card number input
        document.getElementById('card-number').addEventListener('input', function(e) {
            this.value = this.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        });
        
        // Format expiry date input
        document.getElementById('card-expiry').addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
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
    
    // Validate credit card form
    function validateCreditCardForm() {
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const cardName = document.getElementById('card-name').value.trim();
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvc = document.getElementById('card-cvc').value.trim();
        
        // Simple validation
        if (cardNumber.length < 16 || !/^\d+$/.test(cardNumber)) {
            return false;
        }
        
        if (cardName.length < 3) {
            return false;
        }
        
        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            return false;
        }
        
        if (cardCvc.length < 3 || !/^\d+$/.test(cardCvc)) {
            return false;
        }
        
        return true;
    }
    
    // Get billing address from form
    function getBillingAddress() {
        return {
            firstName: document.getElementById('billing-first-name').value,
            lastName: document.getElementById('billing-last-name').value,
            address: document.getElementById('billing-address').value,
            address2: document.getElementById('billing-address2').value,
            city: document.getElementById('billing-city').value,
            postalCode: document.getElementById('billing-postal-code').value,
            country: document.getElementById('billing-country').value
        };
    }
    
    // Generate a random order ID
    function generateOrderId() {
        return 'CEY' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    }
    
    // Save order to localStorage
    function saveOrder(order) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        
        notificationMessage.textContent = message;
        notification.className = 'notification ' + type;
        notification.style.display = 'flex';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Mobile menu toggle functionality
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    // Toggle nav
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

    // Initialize the page
    init();

    
});