// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');

hamburger.addEventListener('click', async () => {
    try {
        if (nav.style.display === 'block') {
            nav.style.display = 'none';
        } else {
            nav.style.display = 'block';
        }
    } catch (error) {
        console.error('Error toggling navigation:', error);
    }
});

// Smart Slider Functionality
function initSmartSlider() {
    const slider = document.querySelector('.smart-slider');
    if (!slider) return;

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000; // Time between auto slides (5 seconds)
    
    // Initialize the slider
    function initSlider() {
        // Set the first slide as active
        slides[0].classList.add('active');
        dots[0].classList.add('active');
        
        // Start automatic slideshow
        startSlideshow();
        
        // Add event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Add event listeners to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        // Pause slideshow on hover
        slider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        // Resume slideshow when mouse leaves
        slider.addEventListener('mouseleave', () => {
            startSlideshow();
        });
    }
    
    // Start automatic slideshow
    function startSlideshow() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, intervalTime);
    }
    
    // Go to previous slide
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Go to next slide
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // Go to specific slide
    function goToSlide(n) {
        // Remove active class from current slide and dot
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        // Calculate the new slide index
        currentSlide = (n + slides.length) % slides.length;
        
        // Add active class to new slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        // Restart the slideshow timer
        startSlideshow();
    }
    
    // Initialize the slider
    initSlider();
}

// Call initSmartSlider on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initSmartSlider();
    
    // Show login form popup when website loads
    showLoginPopup();
    
    // Rest of the existing DOMContentLoaded handlers
    const user = localStorage.getItem('user');
    if (user) {
        updateProfileUI(true);
    } else {
        updateProfileUI(false);
    }
    
    initializeImages();
    initializeSettingsMenu();
    initializeSearch();
    initializeMobileMenu();
    initializeCartModal();
    fixHeroBanner();
});

// Shopping Cart
let cart = [];
const cartIcon = document.querySelector('.fa-shopping-cart');
const cartCount = document.createElement('span');
cartCount.classList.add('cart-count');
cartCount.textContent = '0';
cartIcon.parentElement.appendChild(cartCount);

// Create cart modal
const cartModal = document.createElement('div');
cartModal.classList.add('cart-modal');
cartModal.innerHTML = `
    <div class="cart-content">
        <div class="cart-header">
            <h3>Your Shopping Cart</h3>
            <button class="close-cart"><i class="fas fa-times"></i></button>
        </div>
        <div class="cart-items">
            <!-- Cart items will be added here -->
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Total:</span>
                <span class="total-price">$0.00</span>
            </div>
            <button class="btn checkout-btn">Checkout</button>
        </div>
    </div>
`;
document.body.appendChild(cartModal);

// Add styles for cart modal
const style = document.createElement('style');
style.textContent = `
    .cart-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background-color: var(--secondary-color);
        color: white;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .cart-modal {
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: none;
        justify-content: flex-end;
    }
    
    .cart-content {
        width: 100%;
        max-width: 400px;
        height: 100%;
        background-color: white;
        padding: 20px;
        display: flex;
        flex-direction: column;
    }
    
    .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .close-cart {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
    }
    
    .cart-items {
        flex: 1;
        overflow-y: auto;
    }
    
    .cart-item {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .cart-item-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        margin-right: 15px;
    }
    
    .cart-item-details {
        flex: 1;
    }
    
    .cart-item-name {
        font-weight: bold;
        margin-bottom: 5px;
    }
    
    .cart-item-price {
        color: var(--primary-color);
        font-weight: 600;
    }
    
    .cart-item-quantity {
        display: flex;
        align-items: center;
        margin-top: 5px;
    }
    
    .quantity-btn {
        background: none;
        border: 1px solid var(--border-color);
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    
    .quantity-value {
        margin: 0 10px;
    }
    
    .remove-item {
        color: var(--danger-color);
        background: none;
        border: none;
        cursor: pointer;
        margin-left: 10px;
    }
    
    .cart-footer {
        margin-top: auto;
        padding-top: 20px;
        border-top: 1px solid var(--border-color);
    }
    
    .cart-total {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        margin-bottom: 15px;
        font-size: 18px;
    }
    
    .checkout-btn {
        width: 100%;
        text-align: center;
    }
    
    .empty-cart-message {
        text-align: center;
        margin: 20px 0;
        color: #777;
    }
`;
document.head.appendChild(style);

// Event listeners for cart modal
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const totalPriceElement = document.querySelector('.total-price');

// Open cart when clicking on cart icon
cartIcon.parentElement.addEventListener('click', function(e) {
    e.preventDefault();
    cartModal.style.display = 'flex';
    renderCart();
});

// Close cart when clicking on close button
closeCartBtn.addEventListener('click', function() {
    cartModal.style.display = 'none';
});

// Close cart when clicking outside the cart content
cartModal.addEventListener('click', function(e) {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Render cart items
function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        totalPriceElement.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-btn" data-index="${index}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners for quantity buttons and remove buttons
    document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            decreaseQuantity(index);
        });
    });
    
    document.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            increaseQuantity(index);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
        });
    });
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
    if (count > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
}

// Add to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save cart to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
}

// Decrease quantity
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        removeFromCart(index);
        return;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Increase quantity
function increaseQuantity(index) {
    cart[index].quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Load cart from local storage
window.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
});

// Checkout button
document.querySelector('.checkout-btn').addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Create checkout modal
    const checkoutModal = document.createElement('div');
    checkoutModal.classList.add('checkout-modal');
    
    // Calculate cart totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    checkoutModal.innerHTML = `
        <div class="checkout-content">
            <div class="checkout-header">
                <h3>Checkout</h3>
                <button class="close-checkout"><i class="fas fa-times"></i></button>
            </div>
            <div class="checkout-form">
                <div class="checkout-section">
                    <h4>Shipping Information</h4>
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone</label>
                            <input type="tel" id="phone">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address">Address</label>
                        <input type="text" id="address" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="city">City</label>
                            <input type="text" id="city" required>
                        </div>
                        <div class="form-group">
                            <label for="state">State</label>
                            <input type="text" id="state" required>
                        </div>
                        <div class="form-group">
                            <label for="zip">ZIP Code</label>
                            <input type="text" id="zip" required>
                        </div>
                    </div>
                </div>
                
                <div class="checkout-section">
                    <h4>Payment Method</h4>
                    <div class="form-group">
                        <label for="card-number">Card Number</label>
                        <input type="text" id="card-number" placeholder="XXXX XXXX XXXX XXXX" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="card-name">Name on Card</label>
                            <input type="text" id="card-name" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="expiry">Expiration (MM/YY)</label>
                            <input type="text" id="expiry" placeholder="MM/YY" required>
                        </div>
                        <div class="form-group">
                            <label for="cvv">CVV</label>
                            <input type="text" id="cvv" placeholder="123" required>
                        </div>
                    </div>
                </div>
                
                <div class="checkout-section order-summary">
                    <h4>Order Summary</h4>
                    <div class="order-items">
                        ${cart.map(item => `
                            <div class="order-item">
                                <div class="order-item-name">${item.name} x${item.quantity}</div>
                                <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-totals">
                        <div class="order-subtotal">
                            <span>Subtotal:</span>
                            <span>$${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="order-shipping">
                            <span>Shipping:</span>
                            <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
                        </div>
                        <div class="order-tax">
                            <span>Tax (8%):</span>
                            <span>$${tax.toFixed(2)}</span>
                        </div>
                        <div class="order-total">
                            <span>Total:</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="checkout-actions">
                <button class="btn-outline return-to-cart">Return to Cart</button>
                <button class="btn place-order-btn">Place Order</button>
            </div>
        </div>
    `;
    
    // Add styles for checkout modal
    const checkoutStyles = document.createElement('style');
    checkoutStyles.textContent = `
        .checkout-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1100;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .checkout-content {
            width: 100%;
            max-width: 800px;
            max-height: 90vh;
            background-color: white;
            border-radius: 8px;
            overflow-y: auto;
            padding: 30px;
        }
        
        .checkout-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .checkout-header h3 {
            font-size: 24px;
            margin: 0;
        }
        
        .close-checkout {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
        }
        
        .checkout-section {
            margin-bottom: 30px;
        }
        
        .checkout-section h4 {
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            font-size: 16px;
        }
        
        .form-row {
            display: flex;
            gap: 15px;
        }
        
        .form-row .form-group {
            flex: 1;
        }
        
        .order-items {
            margin-bottom: 20px;
        }
        
        .order-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px dashed var(--border-color);
        }
        
        .order-totals > div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        
        .order-total {
            font-weight: bold;
            font-size: 18px;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid var(--border-color);
        }
        
        .checkout-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        
        .checkout-actions button {
            padding: 12px 25px;
        }
        
        .place-order-btn {
            background-color: var(--success-color);
        }
        
        .processing-order {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            text-align: center;
        }
        
        .processing-order i {
            font-size: 60px;
            color: var(--success-color);
            margin-bottom: 20px;
        }
        
        .processing-order h3 {
            margin-bottom: 20px;
        }
        
        @media (max-width: 768px) {
            .checkout-content {
                padding: 20px;
            }
            
            .form-row {
                flex-direction: column;
                gap: 0;
            }
        }
    `;
    
    document.head.appendChild(checkoutStyles);
    document.body.appendChild(checkoutModal);
    
    // Close checkout when clicking on close button
    const closeCheckoutBtn = checkoutModal.querySelector('.close-checkout');
    closeCheckoutBtn.addEventListener('click', function() {
        checkoutModal.remove();
    });
    
    // Return to cart
    const returnToCartBtn = checkoutModal.querySelector('.return-to-cart');
    returnToCartBtn.addEventListener('click', function() {
        checkoutModal.remove();
    });
    
    // Place order
    const placeOrderBtn = checkoutModal.querySelector('.place-order-btn');
    placeOrderBtn.addEventListener('click', async function() {
        // Get all inputs
        const inputs = checkoutModal.querySelectorAll('input[required]');
        let isValid = true;
        
        // Validate all required fields
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'var(--danger-color)';
                isValid = false;
            } else {
                input.style.borderColor = 'var(--border-color)';
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Show processing screen
        const checkoutForm = checkoutModal.querySelector('.checkout-form');
        const checkoutActions = checkoutModal.querySelector('.checkout-actions');
        
        checkoutForm.style.display = 'none';
        checkoutActions.style.display = 'none';
        
        const processingOrder = document.createElement('div');
        processingOrder.classList.add('processing-order');
        processingOrder.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <h3>Processing Your Order</h3>
            <p>Please wait while we process your payment...</p>
        `;
        
        checkoutModal.querySelector('.checkout-content').appendChild(processingOrder);
        
        // Simulate payment processing
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            processingOrder.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>Order Completed Successfully!</h3>
                <p>Thank you for your purchase. Your order confirmation has been sent to your email.</p>
                <p>Order #${Math.floor(100000 + Math.random() * 900000)}</p>
                <button class="btn" style="margin-top: 20px;">Continue Shopping</button>
            `;
            
            processingOrder.querySelector('button').addEventListener('click', function() {
                checkoutModal.remove();
            });
            
            // Clear cart
            cart = [];
            localStorage.removeItem('cart');
            updateCartCount();
            cartModal.style.display = 'none';
            
        } catch (error) {
            processingOrder.innerHTML = `
                <i class="fas fa-times-circle" style="color: var(--danger-color);"></i>
                <h3>Payment Failed</h3>
                <p>There was an error processing your payment. Please try again.</p>
                <button class="btn" style="margin-top: 20px;">Try Again</button>
            `;
            
            processingOrder.querySelector('button').addEventListener('click', function() {
                checkoutModal.remove();
            });
        }
    });
});

// Product Actions
const addToCartButtons = document.querySelectorAll('.btn-add-cart');
const wishlistButtons = document.querySelectorAll('.btn-wishlist');

addToCartButtons.forEach(button => {
    button.addEventListener('click', async function() {
        try {
            const productInfo = await this.closest('.product-info');
            const productName = await productInfo.querySelector('h3').textContent;
            const productId = await this.getAttribute('data-product-id');
            const productImage = await this.closest('.product-card').querySelector('.product-image img').src;
            
            // Extract price (remove currency symbol and convert to number)
            let priceText = await productInfo.querySelector('.product-price').textContent;
            let productPrice;
            
            // Handle sale prices - get the discounted price, not the original price
            if (priceText.includes('$')) {
                if (priceText.includes('original-price')) {
                    // For products on sale, get the second price (the discounted one)
                    productPrice = parseFloat(priceText.split('$')[2].trim());
                } else {
                    // For regular products, get the price
                    productPrice = parseFloat(priceText.replace('$', '').trim());
                }
            } else {
                productPrice = 0;
            }
            
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            };
            
            addToCart(product);
            
            // Show notification
            const notification = document.createElement('div');
            notification.classList.add('cart-notification');
            notification.textContent = `${productName} added to cart!`;
            document.body.appendChild(notification);
            
            // Add styles for notification
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = 'var(--success-color)';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '4px';
            notification.style.zIndex = '1000';
            notification.style.transition = 'opacity 0.3s ease';
            
            // Show and hide notification
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 2000);
            
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    });
});

wishlistButtons.forEach(button => {
    button.addEventListener('click', async function() {
        try {
            const heart = await this.querySelector('i');
            const productId = await this.getAttribute('data-product-id');
            if (heart.classList.contains('far')) {
                heart.classList.remove('far');
                heart.classList.add('fas');
                heart.style.color = '#f44336';
            } else {
                heart.classList.remove('fas');
                heart.classList.add('far');
                heart.style.color = '';
            }
        } catch (error) {
            console.error('Error updating wishlist:', error);
        }
    });
});

// Sticky Header
window.addEventListener('scroll', async () => {
    try {
        const header = await document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    } catch (error) {
        console.error('Error updating header:', error);
    }
});

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    try {
        const emailInput = await this.querySelector('input');
        const email = await emailInput.value;
        
        if (email && await isValidEmail(email)) {
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        } else {
            alert('Please enter a valid email address.');
        }
    } catch (error) {
        console.error('Error handling newsletter submission:', error);
    }
});

async function isValidEmail(email) {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    } catch (error) {
        console.error('Error validating email:', error);
        return false;
    }
}

// Image Loading Animation
const productImages = document.querySelectorAll('.product-image img');

productImages.forEach(img => {
    img.addEventListener('load', async function() {
        try {
            this.style.opacity = 1;
        } catch (error) {
            console.error('Error loading image:', error);
        }
    });
    
    // Set initial opacity
    img.style.opacity = 0;
    img.style.transition = 'opacity 0.5s ease';
});

// Lazy Loading for Images - REPLACE this entire function
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // All image initialization is now handled by the initializeImages function
        // This prevents conflicts with duplicate event listeners
    } catch (error) {
        console.error('Error initializing image loading:', error);
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', async function (e) {
        e.preventDefault();
        
        try {
            const targetId = await this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = await document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        } catch (error) {
            console.error('Error in smooth scrolling:', error);
        }
    });
});

// Profile Menu Functionality
const profileIcon = document.querySelector('.fa-user');
const profileMenu = document.querySelector('.profile-menu');
const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');
const profileContent = document.querySelector('.profile-content');

// Toggle profile menu
profileIcon.addEventListener('click', function(e) {
    e.stopPropagation();
    profileMenu.classList.toggle('active');
});

// Close profile menu when clicking outside
document.addEventListener('click', function(e) {
    if (!profileMenu.contains(e.target) && !profileIcon.contains(e.target)) {
        profileMenu.classList.remove('active');
    }
});

// Switch between login and signup forms
document.querySelector('.switch-to-signup').addEventListener('click', function(e) {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

document.querySelector('.switch-to-login').addEventListener('click', function(e) {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Handle login
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    try {
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;

        // Simulate login (replace with actual API call)
        if (email && password) {
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify({
                email: email,
                name: email.split('@')[0], // Use email username as name
                isLoggedIn: true
            }));

            // Update UI
            updateProfileUI(true);
            profileMenu.classList.remove('active');
            showNotification('Successfully logged in!', 'success');
        } else {
            showNotification('Please fill in all fields', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    }
});

// Handle signup
signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    try {
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;

        // Simulate signup (replace with actual API call)
        if (name && email && password) {
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify({
                name: name,
                email: email,
                isLoggedIn: true
            }));

            // Update UI
            updateProfileUI(true);
            profileMenu.classList.remove('active');
            showNotification('Account created successfully!', 'success');
        } else {
            showNotification('Please fill in all fields', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Signup failed. Please try again.', 'error');
    }
});

// Handle logout
document.querySelector('.logout-btn').addEventListener('click', function() {
    localStorage.removeItem('user');
    updateProfileUI(false);
    profileMenu.classList.remove('active');
    showNotification('Logged out successfully!', 'success');
});

// Update profile UI based on login state
function updateProfileUI(isLoggedIn) {
    if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('user'));
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        profileContent.style.display = 'block';
        profileContent.querySelector('.user-name').textContent = user.name;
        profileContent.querySelector('.user-email').textContent = user.email;
    } else {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        profileContent.style.display = 'none';
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;
    document.body.appendChild(notification);

    // Add styles for notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.color = 'white';
    notification.style.zIndex = '1000';
    notification.style.transition = 'opacity 0.3s ease';

    // Set background color based on type
    notification.style.backgroundColor = type === 'success' ? 'var(--success-color)' : 'var(--danger-color)';

    // Show and hide notification
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Check login state on page load
document.addEventListener('DOMContentLoaded', function() {
    const user = localStorage.getItem('user');
    if (user) {
        updateProfileUI(true);
    } else {
        updateProfileUI(false);
    }
});

// Shop Now Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all shop now buttons
    const shopNowButtons = document.querySelectorAll('.btn, .btn-outline');
    
    shopNowButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Only process buttons that have href attribute or are in hero/category sections
            if (this.getAttribute('href') || 
                this.closest('.hero') || 
                this.closest('.category-card')) {
                
                e.preventDefault();
                
                // Determine target section
                let targetSection;
                
                // If the button has an href attribute, use that
                if (this.getAttribute('href')) {
                    targetSection = this.getAttribute('href');
                } 
                // If the button is in hero section, scroll to the products section
                else if (this.closest('.hero')) {
                    targetSection = '#men'; // First product section
                }
                // If the button is in a category card, determine which category
                else if (this.closest('.category-card')) {
                    const categoryTitle = this.closest('.category-card').querySelector('h3').textContent.toLowerCase();
                    
                    if (categoryTitle.includes('men')) {
                        targetSection = '#men';
                    } else if (categoryTitle.includes('women')) {
                        targetSection = '#women';
                    } else if (categoryTitle.includes('accessories')) {
                        targetSection = '#accessories';
                    } else {
                        targetSection = '#products';
                    }
                }
                
                // Scroll to the target section if found
                if (targetSection) {
                    const targetElement = document.querySelector(targetSection);
                    
                    if (targetElement) {
                        // Create a custom notification that the shop now button was clicked
                        showNotification(`Browsing ${targetSection.replace('#', '')} collection`, 'success');
                        
                        // Smoothly scroll to the target
                        window.scrollTo({
                            top: targetElement.offsetTop - 80, // Offset for header
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });
});

// Initialize product images with proper loading behavior
function initializeImages() {
    // Preload hero background image
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroStyle = window.getComputedStyle(heroSection);
        const bgImage = heroStyle.backgroundImage;
        
        if (bgImage && bgImage !== 'none') {
            const imageUrl = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
            const img = new Image();
            img.onload = function() {
                heroSection.style.opacity = '1';
            };
            img.onerror = function() {
                // If hero image fails to load, set a fallback
                heroSection.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))';
                heroSection.style.opacity = '1';
            };
            img.src = imageUrl;
            
            // Set initial state
            heroSection.style.opacity = '0';
            heroSection.style.transition = 'opacity 0.5s ease';
        }
    }
    
    // Process product images
    const productImages = document.querySelectorAll('.product-image');
    
    productImages.forEach(container => {
        // Add shimmer effect while loading
        container.classList.add('shimmer');
        
        const img = container.querySelector('img');
        if (img) {
            // Handle successful load
            img.addEventListener('load', function() {
                this.style.opacity = '1';
                container.classList.remove('shimmer');
            });
            
            // Handle load errors
            img.addEventListener('error', function() {
                container.classList.remove('shimmer');
                this.classList.add('error');
                
                // Try to reload once with a cache-busting parameter
                if (!this.src.includes('?retry=')) {
                    this.src = this.src + '?retry=' + new Date().getTime();
                } else {
                    // If retry fails, show placeholder
                    this.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                    
                    // Add notice to product card
                    const productCard = this.closest('.product-card');
                    if (productCard) {
                        const notice = document.createElement('div');
                        notice.className = 'image-error-notice';
                        notice.textContent = 'Image temporarily unavailable';
                        notice.style.position = 'absolute';
                        notice.style.bottom = '0';
                        notice.style.left = '0';
                        notice.style.right = '0';
                        notice.style.background = 'rgba(0,0,0,0.7)';
                        notice.style.color = 'white';
                        notice.style.padding = '5px 10px';
                        notice.style.fontSize = '12px';
                        notice.style.textAlign = 'center';
                        container.appendChild(notice);
                    }
                }
            });
            
            // Set initial state
            if (img.complete) {
                img.style.opacity = '1';
                container.classList.remove('shimmer');
            } else {
                img.style.opacity = '0';
            }
        }
    });
    
    // Also handle category images
    const categoryImages = document.querySelectorAll('.category-card img');
    categoryImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            if (!this.src.includes('?retry=')) {
                this.src = this.src + '?retry=' + new Date().getTime();
            } else {
                this.src = 'https://via.placeholder.com/500x250?text=Category+Image';
            }
        });
        
        // Set initial state
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
        }
    });
}

// Call the initialization function when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeImages();
    
    // Other DOMContentLoaded handlers...
    const user = localStorage.getItem('user');
    if (user) {
        updateProfileUI(true);
    } else {
        updateProfileUI(false);
    }
});

// Website Settings Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize settings elements
    initializeSettingsMenu();
});

function initializeSettingsMenu() {
    // Settings elements
    const settingsIcon = document.querySelector('.settings-icon');
    const settingsModal = document.querySelector('.settings-modal');
    const closeSettingsBtn = document.querySelector('.close-settings');
    const saveSettingsBtn = document.querySelector('.save-settings');
    const resetSettingsBtn = document.querySelector('.reset-settings');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const colorButtons = document.querySelectorAll('.color-btn');
    const textSizeSlider = document.getElementById('textSizeSlider');
    const textSizeValue = document.querySelector('.range-value');
    const animationsToggle = document.getElementById('animationsToggle');
    const imageQualityOptions = document.querySelectorAll('input[name="imageQuality"]');
    
    // Check if elements exist before adding listeners
    if (!settingsIcon || !settingsModal) {
        console.error('Settings elements not found in the document');
        return;
    }

    // Settings object
    let settings = {
        theme: 'light',
        accentColor: '#f9a825',
        textSize: 100,
        animations: true,
        imageQuality: 'high'
    };

    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('websiteSettings');
        if (savedSettings) {
            try {
                settings = JSON.parse(savedSettings);
                applySettings();
            } catch (e) {
                console.error('Failed to parse settings:', e);
                // Reset to defaults if parsing fails
                resetSettings();
            }
        }
    }

    // Save settings to localStorage
    function saveSettings() {
        localStorage.setItem('websiteSettings', JSON.stringify(settings));
        applySettings();
        showNotification('Settings saved successfully!', 'success');
        settingsModal.style.display = 'none';
    }

    // Reset settings to default
    function resetSettings() {
        settings = {
            theme: 'light',
            accentColor: '#f9a825',
            textSize: 100,
            animations: true,
            imageQuality: 'high'
        };
        
        applySettings();
        updateSettingsUI();
        showNotification('Settings reset to default', 'success');
    }

    // Apply settings to the website
    function applySettings() {
        // Apply theme
        if (settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }

        // Apply accent color
        document.documentElement.style.setProperty('--secondary-color', settings.accentColor);

        // Apply text size
        document.documentElement.style.fontSize = `${settings.textSize}%`;

        // Apply animations setting
        if (!settings.animations) {
            let disableStyle = document.getElementById('disable-animations');
            if (!disableStyle) {
                disableStyle = document.createElement('style');
                disableStyle.id = 'disable-animations';
                disableStyle.textContent = `
                    * {
                        animation: none !important;
                        transition: none !important;
                        transform: none !important;
                    }
                `;
                document.head.appendChild(disableStyle);
            }
        } else {
            const disableStyle = document.getElementById('disable-animations');
            if (disableStyle) {
                disableStyle.remove();
            }
        }

        // Apply image quality setting
        const imageQuality = settings.imageQuality;
        const productImages = document.querySelectorAll('.product-image img, .category-card img');
        
        productImages.forEach(img => {
            const originalSrc = img.getAttribute('data-original-src') || img.src;
            
            if (!img.getAttribute('data-original-src')) {
                img.setAttribute('data-original-src', originalSrc);
            }
            
            if (imageQuality === 'low') {
                const lowQualitySrc = originalSrc.replace(/\?.*$/, '') + '?q=50&w=300';
                img.src = lowQualitySrc;
            } else {
                img.src = originalSrc;
            }
        });
    }

    // Update settings UI based on current settings
    function updateSettingsUI() {
        // Update theme buttons
        themeButtons.forEach(btn => {
            if (btn.getAttribute('data-theme') === settings.theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update color buttons
        colorButtons.forEach(btn => {
            if (btn.getAttribute('data-color') === settings.accentColor) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update text size slider
        textSizeSlider.value = settings.textSize;
        textSizeValue.textContent = `${settings.textSize}%`;

        // Update animations toggle
        animationsToggle.checked = settings.animations;

        // Update image quality radio buttons
        imageQualityOptions.forEach(option => {
            if (option.value === settings.imageQuality) {
                option.checked = true;
            }
        });
    }

    // Event listener for settings icon - using an arrow function to ensure correct binding
    settingsIcon.addEventListener('click', (e) => {
        e.preventDefault();
        settingsModal.style.display = 'flex';
        updateSettingsUI();
    });

    // Event listener for close button
    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    // Event listener for clicking outside the modal
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Event listeners for theme buttons
    themeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            settings.theme = theme;
            
            // Update UI
            themeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Event listeners for color buttons
    colorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            settings.accentColor = color;
            
            // Update UI
            colorButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Event listener for text size slider
    textSizeSlider.addEventListener('input', function() {
        const size = this.value;
        settings.textSize = size;
        textSizeValue.textContent = `${size}%`;
    });

    // Event listener for animations toggle
    animationsToggle.addEventListener('change', function() {
        settings.animations = this.checked;
    });

    // Event listeners for image quality options
    imageQualityOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.checked) {
                settings.imageQuality = this.value;
            }
        });
    });

    // Event listener for save button
    saveSettingsBtn.addEventListener('click', saveSettings);

    // Event listener for reset button
    resetSettingsBtn.addEventListener('click', resetSettings);

    // Load settings on initialization
    loadSettings();
}

// Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});

function initializeSearch() {
    // Elements
    const searchIcon = document.querySelector('.search-icon');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearchBtn = document.querySelector('.close-search');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    const categoryFilter = document.querySelector('.category-filter');
    const sortFilter = document.querySelector('.sort-filter');
    const noResults = document.querySelector('.no-results');
    
    // Product data - collect all products from the page
    let allProducts = [];
    
    // Check if elements exist
    if (!searchIcon || !searchOverlay) {
        console.error('Search elements not found');
        return;
    }
    
    // Collect all products from the page
    function collectProducts() {
        const productCards = document.querySelectorAll('.product-card');
        allProducts = [];
        
        productCards.forEach(card => {
            const nameElement = card.querySelector('.product-info h3');
            const priceElement = card.querySelector('.product-price');
            const imageElement = card.querySelector('.product-image img');
            const addToCartBtn = card.querySelector('.btn-add-cart');
            
            if (nameElement && priceElement && imageElement) {
                const name = nameElement.textContent;
                const priceText = priceElement.textContent;
                const price = parseFloat(priceText.replace('$', ''));
                const image = imageElement.src;
                const productId = addToCartBtn ? addToCartBtn.getAttribute('data-product-id') : '';
                
                // Determine category from ID or section
                let category = 'all';
                if (productId) {
                    if (productId.includes('men')) {
                        category = 'men';
                    } else if (productId.includes('women')) {
                        category = 'women';
                    } else if (productId.includes('accessories')) {
                        category = 'accessories';
                    }
                }
                
                allProducts.push({
                    id: productId,
                    name: name,
                    price: price,
                    image: image,
                    category: category
                });
            }
        });
    }
    
    // Event listener for search icon
    searchIcon.addEventListener('click', function(e) {
        e.preventDefault();
        searchOverlay.style.display = 'flex';
        searchInput.focus();
        
        // Collect products if we haven't already
        if (allProducts.length === 0) {
            collectProducts();
        }
    });
    
    // Event listener for close button
    closeSearchBtn.addEventListener('click', function() {
        searchOverlay.style.display = 'none';
    });
    
    // Event listener for clicking outside the search content
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            searchOverlay.style.display = 'none';
        }
    });
    
    // Event listener for search form
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch();
    });
    
    // Event listeners for filters
    categoryFilter.addEventListener('change', performSearch);
    sortFilter.addEventListener('change', performSearch);
    
    // Debounced input listener for real-time search
    let debounceTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(performSearch, 300);
    });
    
    // Perform search
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        const category = categoryFilter.value;
        const sort = sortFilter.value;
        
        // If empty query, show no results message
        if (!query) {
            searchResults.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }
        
        // Filter products
        let filteredProducts = allProducts.filter(product => {
            // Filter by search query
            const matchesQuery = product.name.toLowerCase().includes(query);
            
            // Filter by category
            const matchesCategory = category === 'all' || product.category === category;
            
            return matchesQuery && matchesCategory;
        });
        
        // Sort products
        filteredProducts = sortProducts(filteredProducts, sort);
        
        // Render results
        renderSearchResults(filteredProducts, query);
    }
    
    // Sort products
    function sortProducts(products, sortBy) {
        switch (sortBy) {
            case 'price-low':
                return [...products].sort((a, b) => a.price - b.price);
            case 'price-high':
                return [...products].sort((a, b) => b.price - a.price);
            case 'newest':
                // Since we don't have date info, we'll just reverse the order as a mock
                return [...products].reverse();
            default:
                // Default is relevance, which is already handled by the filter order
                return products;
        }
    }
    
    // Render search results
    function renderSearchResults(products, query) {
        if (products.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No products found matching "${query}"</p>
                </div>
            `;
            return;
        }
        
        // Hide no results message
        noResults.style.display = 'none';
        
        const resultsHTML = products.map(product => {
            // Highlight matching text
            const highlightedName = highlightText(product.name, query);
            
            return `
                <div class="search-result-item" data-product-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="search-result-image">
                    <div class="search-result-details">
                        <div class="search-result-name">${highlightedName}</div>
                        <div class="search-result-category">${getCategoryName(product.category)}</div>
                        <div class="search-result-price">$${product.price.toFixed(2)}</div>
                        <div class="search-result-actions">
                            <button class="btn-add-cart btn-sm" data-product-id="${product.id}">Add to Cart</button>
                            <button class="btn-view btn-sm btn-outline" data-product-id="${product.id}">View Details</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        searchResults.innerHTML = resultsHTML;
        
        // Add event listeners to the search result actions
        document.querySelectorAll('.search-result-actions .btn-add-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                const product = allProducts.find(p => p.id === productId);
                
                if (product) {
                    addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image
                    });
                    
                    showNotification(`${product.name} added to cart!`, 'success');
                }
            });
        });
        
        document.querySelectorAll('.search-result-actions .btn-view').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                // Scroll to the product in the page
                scrollToProduct(productId);
                searchOverlay.style.display = 'none';
            });
        });
    }
    
    // Helper function to highlight search text
    function highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
    
    // Helper function to get category display name
    function getCategoryName(category) {
        switch (category) {
            case 'men':
                return "Men's Collection";
            case 'women':
                return "Women's Collection";
            case 'accessories':
                return "Accessories";
            default:
                return "All Products";
        }
    }
    
    // Helper function to scroll to a product
    function scrollToProduct(productId) {
        const productElement = document.querySelector(`.product-card .btn-add-cart[data-product-id="${productId}"]`);
        
        if (productElement) {
            const productCard = productElement.closest('.product-card');
            
            if (productCard) {
                // Get the section of this product
                const section = productCard.closest('section');
                
                if (section) {
                    // Add a temporary highlight effect to the product card
                    productCard.style.boxShadow = '0 0 0 3px var(--secondary-color)';
                    
                    // Scroll to the section first (for better UX)
                    window.scrollTo({
                        top: section.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Then scroll to the product
                    setTimeout(() => {
                        productCard.scrollIntoView({
                            behavior: 'smooth', 
                            block: 'center'
                        });
                        
                        // Remove highlight after a delay
                        setTimeout(() => {
                            productCard.style.boxShadow = '';
                        }, 3000);
                    }, 500);
                }
            }
        }
    }
}

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initializeMobileMenu();
});

function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    if (!hamburger || !nav) {
        console.error('Mobile menu elements not found');
        return;
    }
    
    // Toggle mobile menu when hamburger is clicked
    hamburger.addEventListener('click', function() {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Toggle icon between bars and X
        const icon = hamburger.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
            
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const isClickInside = nav.contains(e.target) || hamburger.contains(e.target);
        
        if (!isClickInside && nav.classList.contains('active')) {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
            
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Update active menu item based on scroll position
    updateActiveMenuOnScroll();
}

// Update active menu item based on scroll position
function updateActiveMenuOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            } else if (current === '' && link.getAttribute('href') === '#') {
                // Home is active when at the top
                link.classList.add('active');
            }
        });
    });
}

// Fix all menu interactions and dropdowns
document.addEventListener('DOMContentLoaded', function() {
    // Ensure all menus work properly
    fixMenuInteractions();
});

function fixMenuInteractions() {
    // Fix profile menu interactions
    const profileIcon = document.querySelector('.fa-user').parentElement;
    const profileMenu = document.querySelector('.profile-menu');
    
    if (profileIcon && profileMenu) {
        // Make sure the profile menu is properly positioned
        profileMenu.style.position = 'absolute';
        profileMenu.style.top = '100%';
        profileMenu.style.right = '0';
        profileMenu.style.width = '250px';
        profileMenu.style.backgroundColor = 'white';
        profileMenu.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        profileMenu.style.borderRadius = '4px';
        profileMenu.style.zIndex = '1000';
        profileMenu.style.overflow = 'hidden';
        
        // Ensure the profile menu toggle works
        profileIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            profileMenu.classList.toggle('active');
            
            // Close other menus when this one is opened
            const cartModal = document.querySelector('.cart-modal');
            if (cartModal && cartModal.classList.contains('active')) {
                cartModal.classList.remove('active');
            }
        });
    }
    
    // Fix shopping cart menu interactions
    const cartIcon = document.querySelector('.fa-shopping-cart').parentElement;
    const cartModal = document.querySelector('.cart-modal');
    
    if (cartIcon && cartModal) {
        // Make sure the cart modal is properly positioned
        cartModal.style.position = 'absolute';
        cartModal.style.top = '100%';
        cartModal.style.right = '0';
        cartModal.style.width = '300px';
        cartModal.style.backgroundColor = 'white';
        cartModal.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        cartModal.style.borderRadius = '4px';
        cartModal.style.zIndex = '1000';
        
        // Ensure the cart toggle works
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            cartModal.classList.toggle('active');
            
            // Close other menus when this one is opened
            if (profileMenu && profileMenu.classList.contains('active')) {
                profileMenu.classList.remove('active');
            }
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        // Close profile menu when clicking outside
        if (profileMenu && !profileIcon.contains(e.target) && !profileMenu.contains(e.target)) {
            profileMenu.classList.remove('active');
        }
        
        // Close cart modal when clicking outside
        if (cartModal && !cartIcon.contains(e.target) && !cartModal.contains(e.target)) {
            cartModal.classList.remove('active');
        }
    });
    
    // Fix navigation active states
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Fix "Shop Now" buttons
    const shopNowButtons = document.querySelectorAll('.btn, .btn-outline');
    
    shopNowButtons.forEach(button => {
        if (button.textContent.includes('Shop Now') || button.closest('.hero')) {
            button.addEventListener('click', function() {
                // Ensure the menu is closed when navigating
                const nav = document.querySelector('nav');
                const hamburger = document.querySelector('.hamburger');
                
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    hamburger.classList.remove('active');
                    
                    const icon = hamburger.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }
    });
    
    // Apply dark theme adjustments for menus if needed
    applyDarkThemeToMenus();
}

// Apply dark theme styles to menus if dark theme is active
function applyDarkThemeToMenus() {
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    if (isDarkTheme) {
        const profileMenu = document.querySelector('.profile-menu');
        const cartModal = document.querySelector('.cart-modal');
        
        if (profileMenu) {
            profileMenu.style.backgroundColor = '#1f1f1f';
            profileMenu.style.color = '#eee';
            profileMenu.style.borderColor = '#333';
        }
        
        if (cartModal) {
            cartModal.style.backgroundColor = '#1f1f1f';
            cartModal.style.color = '#eee';
            cartModal.style.borderColor = '#333';
        }
    }
}

// Cart Modal Integration
document.addEventListener('DOMContentLoaded', function() {
    initializeCartModal();
});

function initializeCartModal() {
    const cartIcon = document.querySelector('.fa-shopping-cart').parentElement;
    const cartModal = document.querySelector('.cart-modal');
    const closeCartBtn = document.querySelector('.close-cart');
    
    if (!cartIcon || !cartModal) {
        console.error('Cart elements not found');
        return;
    }
    
    // Initialize empty cart items container
    const cartItemsContainer = document.querySelector('.cart-items');
    if (cartItemsContainer) {
        // Check if cart is empty
        updateEmptyCartState();
    }
    
    // Open cart modal
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        cartModal.classList.toggle('active');
        
        // Render cart items
        renderCartInModal();
    });
    
    // Close cart modal
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            cartModal.classList.remove('active');
        });
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (cartModal && !cartIcon.contains(e.target) && !cartModal.contains(e.target)) {
            cartModal.classList.remove('active');
        }
    });
    
    // Handle checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }
            
            // If checkout function exists, call it
            if (typeof checkout === 'function') {
                checkout();
                cartModal.classList.remove('active');
            } else {
                showNotification('Checkout functionality is coming soon!', 'success');
                cartModal.classList.remove('active');
            }
        });
    }
}

// Render cart items in the modal
function renderCartInModal() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalAmountElement = document.querySelector('.total-amount');
    
    if (!cartItemsContainer || !totalAmountElement) return;
    
    // Clear the current items
    cartItemsContainer.innerHTML = '';
    
    // Check if cart is empty
    if (!cart || cart.length === 0) {
        updateEmptyCartState();
        totalAmountElement.textContent = '$0.00';
        return;
    }
    
    // Calculate total
    let total = 0;
    
    // Add each item to the cart
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        // Calculate item total
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-btn" data-index="${index}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-index="${index}">+</button>
                    </div>
                    <button class="remove-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update total amount
    totalAmountElement.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners to cart item buttons
    addCartItemEventListeners();
}

// Update empty cart state
function updateEmptyCartState() {
    const cartItemsContainer = document.querySelector('.cart-items');
    
    if (!cartItemsContainer) return;
    
    if (!cart || cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <p>Add some products to your cart</p>
            </div>
        `;
    }
}

// Add event listeners to cart item buttons
function addCartItemEventListeners() {
    // Decrease quantity buttons
    document.querySelectorAll('.decrease-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            decreaseQuantity(index);
            renderCartInModal();
            updateCartCount();
        });
    });
    
    // Increase quantity buttons
    document.querySelectorAll('.increase-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            increaseQuantity(index);
            renderCartInModal();
            updateCartCount();
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
            renderCartInModal();
            updateCartCount();
            showNotification('Item removed from cart', 'success');
        });
    });
}

// Fix hero banner image
document.addEventListener('DOMContentLoaded', function() {
    fixHeroBanner();
});

function fixHeroBanner() {
    const heroSection = document.querySelector('.hero');
    const fallbackImg = document.querySelector('.hero-fallback-img');
    
    if (!heroSection) return;
    
    // Multiple approaches to ensure banner visibility
    
    // 1. CSS ::before background approach
    const bgImageUrl = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';

    // 2. Direct fallback image approach (already in HTML)
    if (fallbackImg) {
        // Make sure the fallback image has a proper alt text
        fallbackImg.alt = "Summer Fashion Collection Banner";
        
        // Handle fallback image loading
        fallbackImg.onload = function() {
            fallbackImg.style.opacity = '0.7'; // Match the overlay
        };
        
        fallbackImg.onerror = function() {
            // If even the direct image fails, create a colored overlay
            const heroContainer = document.querySelector('.hero-bg-container');
            if (heroContainer) {
                heroContainer.innerHTML = ''; // Remove the broken image
                heroContainer.style.background = 'linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)';
            }
        };
    }
    
    // 3. Additional direct style approach as extra fallback
    const additionalBanner = new Image();
    
    additionalBanner.onload = function() {
        // Only apply if needed (in case ::before doesn't work in some browsers)
        const computedStyle = getComputedStyle(heroSection);
        const hasBgImage = computedStyle.backgroundImage && 
                          computedStyle.backgroundImage !== 'none';
        
        if (!hasBgImage) {
            heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${bgImageUrl}')`;
        }
    };
    
    additionalBanner.onerror = function() {
        // Apply solid gradient as last resort
        heroSection.style.background = 'linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)';
    };
    
    // Start loading the additional image
    additionalBanner.src = bgImageUrl;
}

// Function to show login popup on page load
function showLoginPopup() {
    // Check if user has already logged in
    const user = localStorage.getItem('user');
    if (user) {
        return; // Don't show login popup if user is already logged in
    }
    
    // Check if the popup has been shown in this session
    const hasShownPopup = sessionStorage.getItem('loginPopupShown');
    if (hasShownPopup) {
        return; // Don't show login popup if it was already shown in this session
    }
    
    // Get profile menu and make it visible
    const profileMenu = document.querySelector('.profile-menu');
    if (profileMenu) {
        // Position the popup in the center of the screen
        profileMenu.style.position = 'fixed';
        profileMenu.style.top = '50%';
        profileMenu.style.left = '50%';
        profileMenu.style.transform = 'translate(-50%, -50%)';
        profileMenu.style.width = '380px';
        profileMenu.style.maxWidth = '90%';
        profileMenu.style.zIndex = '2000';
        profileMenu.style.backgroundColor = 'white';
        
        // Show the login form with animation
        profileMenu.classList.add('active', 'popup-mode');
        
        // Add overlay behind the login form
        const overlay = document.createElement('div');
        overlay.className = 'login-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = '1999';
        document.body.appendChild(overlay);
        
        // Add close button to the login form (it's now styled by CSS)
        const closeButton = document.createElement('button');
        closeButton.className = 'close-login-popup';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        profileMenu.appendChild(closeButton);
        
        // Add event listeners to close the popup
        closeButton.addEventListener('click', closeLoginPopup);
        overlay.addEventListener('click', closeLoginPopup);
        
        // Add a welcome message (now styled by CSS)
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = '<h2>Welcome to StyleHub</h2><p>Sign in to access your account and enjoy a personalized shopping experience.</p>';
        profileMenu.insertBefore(welcomeMessage, profileMenu.firstChild);
        
        // Get the login form
        const loginForm = profileMenu.querySelector('.login-form');
        
        if (loginForm) {
            // Create social login buttons
            const socialLogin = document.createElement('div');
            socialLogin.className = 'social-login';
            socialLogin.innerHTML = `
                <button class="social-btn facebook-btn"><i class="fab fa-facebook-f"></i>&nbsp; Facebook</button>
                <button class="social-btn google-btn"><i class="fab fa-google"></i>&nbsp; Google</button>
            `;
            
            // Create divider
            const orDivider = document.createElement('div');
            orDivider.className = 'or-divider';
            orDivider.innerHTML = '<span>OR</span>';
            
            // Create remember me and forgot password section
            const formActions = document.createElement('div');
            formActions.className = 'form-actions';
            formActions.innerHTML = `
                <div class="remember-me">
                    <input type="checkbox" id="remember" name="remember">
                    <label for="remember">Remember me</label>
                </div>
                <a href="#" class="forgot-password">Forgot password?</a>
            `;
            
            // Find existing elements to insert before
            const emailInput = loginForm.querySelector('input[type="email"]').parentNode;
            const submitBtn = loginForm.querySelector('.btn-submit');
            
            // Insert the new elements
            loginForm.insertBefore(socialLogin, emailInput);
            loginForm.insertBefore(orDivider, emailInput);
            loginForm.insertBefore(formActions, submitBtn);
            
            // Add guest button (now styled by CSS)
            const guestButton = document.createElement('button');
            guestButton.className = 'guest-button';
            guestButton.textContent = 'Continue as Guest';
            loginForm.appendChild(guestButton);
            
            // Add event listener to the guest button
            guestButton.addEventListener('click', closeLoginPopup);
            
            // Add event listeners to social buttons
            const facebookBtn = socialLogin.querySelector('.facebook-btn');
            const googleBtn = socialLogin.querySelector('.google-btn');
            
            facebookBtn.addEventListener('click', function() {
                closeLoginPopup();
                showNotification('Facebook login is not implemented in this demo', 'info');
            });
            
            googleBtn.addEventListener('click', function() {
                closeLoginPopup();
                showNotification('Google login is not implemented in this demo', 'info');
            });
        }
        
        // Mark that the popup has been shown in this session
        sessionStorage.setItem('loginPopupShown', 'true');
    }
}

// Function to close the login popup
function closeLoginPopup() {
    const profileMenu = document.querySelector('.profile-menu');
    const overlay = document.querySelector('.login-overlay');
    const closeButton = document.querySelector('.close-login-popup');
    const welcomeMessage = document.querySelector('.welcome-message');
    const guestButton = document.querySelector('.guest-button');
    const socialLogin = document.querySelector('.social-login');
    const orDivider = document.querySelector('.or-divider');
    const formActions = document.querySelector('.form-actions');
    
    // Hide the profile menu and remove custom positioning
    if (profileMenu) {
        profileMenu.classList.remove('active', 'popup-mode');
        // Reset to original styling after animation completes
        setTimeout(() => {
            profileMenu.style.position = 'absolute';
            profileMenu.style.top = '60px';
            profileMenu.style.left = '';
            profileMenu.style.right = '0';
            profileMenu.style.transform = '';
            profileMenu.style.width = '280px';
            profileMenu.style.zIndex = '1000';
            profileMenu.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        }, 300);
    }
    
    // Remove the overlay
    if (overlay) {
        overlay.remove();
    }
    
    // Remove close button
    if (closeButton) {
        closeButton.remove();
    }
    
    // Remove welcome message
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    // Remove guest button
    if (guestButton) {
        guestButton.remove();
    }
    
    // Remove social login buttons
    if (socialLogin) {
        socialLogin.remove();
    }
    
    // Remove OR divider
    if (orDivider) {
        orDivider.remove();
    }
    
    // Remove form actions (remember me & forgot password)
    if (formActions) {
        formActions.remove();
    }
}