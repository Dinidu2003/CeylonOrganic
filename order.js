document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const lookupForm = document.querySelector('.lookup-form');
    const orderNumberInput = document.getElementById('order-number');
    const emailInput = document.getElementById('email');
    const orderDetails = document.querySelector('.order-details');
    const supportLinks = document.querySelectorAll('[href="#"]');
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);

    // Sample order data (in a real app, this would come from an API)
    const sampleOrder = {
        number: 'CO-87654321',
        date: 'March 20, 2025',
        status: 'shipped',
        items: [
            {
                name: 'Ceylon Cinnamon',
                category: 'Spices',
                variant: '100g package',
                quantity: 1,
                price: 1000,
                image: 'photos/cinnamon.png'
            },
            {
                name: 'Turmeric Powder',
                category: 'Spices',
                variant: '75g package',
                quantity: 2,
                price: 800,
                image: 'photos/tumeric.png'
            },
            {
                name: 'Holy Basil Leaves',
                category: 'Herbs',
                variant: '50g package',
                quantity: 1,
                price: 900,
                image: 'photos/basil.png'
            }
        ],
        subtotal: 3500,
        shipping: 500,
        tax: 350,
        total: 4350,
        shippingAddress: {
            name: 'John Doe',
            street: '123 Spice Lane',
            city: 'Colombo',
            region: 'Western Province',
            postalCode: '10100',
            country: 'Sri Lanka',
            phone: '+94 076 779 9288'
        },
        tracking: {
            number: 'SL987654321LK',
            carrier: 'Ceylon Express',
            estimatedDelivery: 'March 24, 2025'
        }
    };

    // Notification function
    function showNotification(message, isSuccess = true) {
        notification.textContent = message;
        notification.style.backgroundColor = isSuccess ? '#4CAF50' : '#f44336';
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Create support modal
    function createSupportModal() {
        const modal = document.createElement('div');
        modal.className = 'support-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Contact Customer Support</h3>
                <div class="support-options">
                    <div class="support-option">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <h4>Email Support</h4>
                        <p>ceylonorganic@gmail.com</p>
                        <a href="mailto:ceylonorganic@gmail.com" class="action-btn">Send Email</a>
                    </div>
                    <div class="support-option">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <h4>Call Us</h4>
                        <p>+94 076 779 9288</p>
                        <a href="tel:+940767799288" class="action-btn">Call Now</a>
                    </div>
                    <div class="support-option">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                        <h4>Live Chat</h4>
                        <p>Available 9AM-5PM (GMT+5:30)</p>
                        <button class="action-btn start-chat">Start Chat</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Close modal
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Start chat button
        modal.querySelector('.start-chat').addEventListener('click', function() {
            showNotification('Connecting you to a support agent...');
            modal.style.display = 'none';
        });
        
        return modal;
    }

    // Track order form submission
    lookupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const orderNumber = orderNumberInput.value.trim();
        const email = emailInput.value.trim();
        
        // Basic validation
        if (!orderNumber || !email) {
            showNotification('Please enter both order number and email', false);
            return;
        }
        
        // In a real app, this would be an API call to verify the order
        // For demo purposes, we'll use the sample order if the number matches
        if (orderNumber === sampleOrder.number) {
            showNotification('Order found! Loading details...');
            
            // Simulate loading
            setTimeout(() => {
                displayOrderDetails(sampleOrder);
                orderDetails.style.display = 'block';
                window.scrollTo({
                    top: orderDetails.offsetTop - 20,
                    behavior: 'smooth'
                });
            }, 1000);
        } else {
            showNotification('Order not found. Please check your details.', false);
        }
    });

    // Display order details
    function displayOrderDetails(order) {
        // Update order header
        document.querySelector('.order-info h2').textContent = `Order #${order.number}`;
        document.querySelector('.order-date').textContent = `Placed on ${order.date}`;
        
        // Update status timeline
        const statusSteps = document.querySelectorAll('.status-step');
        statusSteps.forEach(step => step.classList.remove('active', 'completed'));
        
        if (order.status === 'placed') {
            statusSteps[0].classList.add('completed');
        } else if (order.status === 'processing') {
            statusSteps[0].classList.add('completed');
            statusSteps[1].classList.add('completed');
        } else if (order.status === 'shipped') {
            statusSteps[0].classList.add('completed');
            statusSteps[1].classList.add('completed');
            statusSteps[2].classList.add('active');
            
            // Update tracking info
            const trackingInfo = document.querySelector('.tracking-info');
            trackingInfo.innerHTML = `
                <p>Tracking Number: <a href="#" class="tracking-link">${order.tracking.number}</a></p>
                <p>Carrier: ${order.tracking.carrier}</p>
                <p>Estimated Delivery: ${order.tracking.estimatedDelivery}</p>
            `;
        } else if (order.status === 'delivered') {
            statusSteps.forEach(step => step.classList.add('completed'));
        }
        
        // Update order items
        const itemList = document.querySelector('.item-list');
        itemList.innerHTML = '';
        
        order.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4 class="item-name">${item.name}</h4>
                    <p class="item-category">${item.category}</p>
                    <p class="item-variant">${item.variant}</p>
                </div>
                <div class="item-quantity">
                    <span>Qty: ${item.quantity}</span>
                </div>
                <div class="item-price">
                    <span>Rs ${item.price * item.quantity}</span>
                </div>
            `;
            itemList.appendChild(itemElement);
        });
        
        // Update order summary
        document.querySelector('.summary-row:nth-child(1) span:last-child').textContent = `Rs ${order.subtotal}`;
        document.querySelector('.summary-row:nth-child(2) span:last-child').textContent = `Rs ${order.shipping}`;
        document.querySelector('.summary-row:nth-child(3) span:last-child').textContent = `Rs ${order.tax}`;
        document.querySelector('.summary-row.total span:last-child').textContent = `Rs ${order.total}`;
        
        // Update shipping info
        const shippingAddress = document.querySelector('.info-column:first-child');
        shippingAddress.innerHTML = `
            <h3>Shipping Address</h3>
            <p>${order.shippingAddress.name}</p>
            <p>${order.shippingAddress.street}</p>
            <p>${order.shippingAddress.city}, ${order.shippingAddress.region} ${order.shippingAddress.postalCode}</p>
            <p>${order.shippingAddress.country}</p>
            <p>Phone: ${order.shippingAddress.phone}</p>
        `;
    }

    // Handle support links
    supportLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = createSupportModal();
            modal.style.display = 'flex';
        });
    });

    // Track package button
    document.querySelector('.order-actions-footer .primary').addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Opening tracking page for SL987654321LK...');
        // In a real app, this would open the carrier's tracking page
    });

    // Print receipt button
    document.querySelector('.order-actions .action-btn:first-child').addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Preparing receipt for printing...');
        // In a real app, this would open the print dialog
        setTimeout(() => {
            window.print();
        }, 500);
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