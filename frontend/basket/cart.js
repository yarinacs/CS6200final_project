// ============================================
// cart.js - Cart business logic and state management
// ============================================

// Global state
let cartItems = [];
let currentUserName = CONFIG.DEFAULT_USERNAME;

// Show/hide loading state
function showLoading(show) {
    const loadingState = document.getElementById('loading-state');
    const cartContainer = document.getElementById('cart-container');
    const emptyState = document.getElementById('empty-state');

    if (show) {
        loadingState.classList.remove('hidden');
        cartContainer.style.display = 'none';
        emptyState.classList.add('hidden');
    } else {
        loadingState.classList.add('hidden');
    }
}

// Load basket from backend
async function loadBasket() {
    const userNameInput = document.getElementById('userName-input');
    currentUserName = userNameInput.value.trim();

    if (!currentUserName) {
        alert('Please enter a username');
        return;
    }

    try {
        showLoading(true);
        const basket = await getBasket(currentUserName);

        if (basket && basket.items && basket.items.length > 0) {
            // Convert backend format to frontend format
            cartItems = basket.items.map((item, index) => ({
                id: item.productId || index,
                name: item.productName || 'Product',
                description: item.description || 'No description',
                price: parseFloat(item.price) || 0,
                salePrice: null,
                image: item.image || "https://via.placeholder.com/150",
                inStock: true,
                quantity: item.quantity || 1,
                shipping: "Free"
            }));
        } else {
            cartItems = [];
        }

        showLoading(false);
        renderCart();
    } catch (error) {
        showLoading(false);
        alert('Failed to load basket: ' + error.message);
    }
}

// Save basket to backend
// Checkout
async function handleCheckout() {
    const userNameInput = document.getElementById('userName-input');
    currentUserName = userNameInput.value.trim();

    if (!currentUserName) {
        alert('Please enter a username');
        return;
    }

    if (cartItems.length === 0) {
        alert('Your basket is empty');
        return;
    }

    try {
        //  STEP 1: Save the basket to database FIRST
        const basketData = {
            userName: currentUserName,
            items: cartItems.map(item => ({
                quantity: item.quantity,
                color: item.color || 'Default',
                price: item.price,
                productId: item.id,
                productName: item.productName
            }))
        };

        console.log('Saving basket:', basketData);
        await createBasket(basketData);  // Save to DynamoDB

        // STEP 2: Now checkout
        const checkoutData = {
            userName: currentUserName,
            // Remove all the extra fields - just send userName
        };

        console.log('Checking out:', checkoutData);
        await checkoutBasket(checkoutData);

        alert('Checkout successful! Your order has been placed.');
        cartItems = [];
        renderCart();

    } catch (error) {
        console.error('Checkout error:', error);
        alert('Checkout failed: ' + error.message);
    }
}

// Update quantity of an item
function updateQuantity(id, change) {
    cartItems = cartItems.map(item => {
        if (item.id === id) {
            return { ...item, quantity: Math.max(1, item.quantity + change) };
        }
        return item;
    });
    renderCart();
}

// Remove item from cart
function removeItem(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    renderCart();
}

async function saveBasket() {
    const userNameInput = document.getElementById('userName-input');
    const userName = userNameInput.value.trim();

    if (!userName) {
        alert('Please enter a username');
        return;
    }

    if (cartItems.length === 0) {
        alert('Your basket is empty');
        return;
    }

    try {
        const basketData = {
            userName: userName,
            items: cartItems.map(item => ({
                quantity: item.quantity,
                color: item.color || 'Default',
                price: item.price,
                productId: item.id,
                productName: item.productName
            }))
        };

        await createBasket(basketData);
        alert('Basket saved successfully!');

    } catch (error) {
        console.error('Save basket error:', error);
        alert('Failed to save basket: ' + error.message);
    }
}

// Add a sample item (for testing)
function addSampleItem() {
    const newItem = {
        id: Date.now(),
        name: "Airpods",
        description: "This is a test product",
        price: 99.99,
        salePrice: null,
        image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-anc-select-202409_FV1?wid=976&hei=916&fmt=jpeg&qlt=90&.v=Qklmb1JJend3cVIxSUxIeFBIRk96cUNGMHVRUVpqOEFiUFU4R0xNRVFxdkhJa2hkRmxkTlJIMk9SdFNSaWFNODE1UUxLT2t0cW42N3FvQzVqaGhrVVcvdmFyQU52eG9rbk9Lb1pmQWN1MGgrYWpGdS9XeFgvbS9ITnNYOEhYaG4",
        inStock: true,
        quantity: 1,
        shipping: "Free"
    };
    cartItems.push(newItem);
    renderCart();
    alert('Sample item added! Click "Save Basket to Backend" to persist it.');
}