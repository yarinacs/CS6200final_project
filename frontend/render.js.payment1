function displayCartItems() {
    const container = document.getElementById('cart-container');
    const emptyState = document.getElementById('empty-state');
    const cartCount = document.getElementById('cart-count');
    const cart = getCart();
    
    console.log('Displaying cart:', cart);
    
    if (cart.length === 0) {
        if (container) container.style.display = 'none';
        if (emptyState) emptyState.classList.remove('hidden');
        if (cartCount) cartCount.textContent = '0';
        updateSummary();
        return;
    }
    
    if (container) container.style.display = 'block';
    if (emptyState) emptyState.classList.add('hidden');
    if (cartCount) cartCount.textContent = cart.length;
    
    if (container) {
        container.innerHTML = cart.map((item, index) => `
            <div class="p-6 border-b border-gray-200">
                <div class="flex gap-6">
                    <img src="${getProductImage(item.productName)}" 
                         alt="${item.productName}"
                         class="w-32 h-32 object-contain bg-gray-50 rounded-lg p-2"
                         onerror="this.src='https://via.placeholder.com/128?text=Product'">
                    
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">${item.productName}</h3>
                        <p class="text-2xl font-bold text-red-700 mb-4">$${item.price.toFixed(2)}</p>
                        
                        <div class="flex items-center gap-4">
                            <div class="flex items-center gap-3">
                                <button onclick="updateQuantity(${index}, -1)" 
                                        class="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 font-bold">
                                    −
                                </button>
                                <span class="font-semibold">Qty: ${item.quantity}</span>
                                <button onclick="updateQuantity(${index}, 1)" 
                                        class="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 font-bold">
                                    +
                                </button>
                            </div>
                            
                            <button onclick="removeFromCart(${index})" 
                                    class="text-red-600 hover:text-red-800 font-medium ml-4">
                                🗑️ Remove
                            </button>
                        </div>
                    </div>
                    
                    <div class="text-right">
                        <p class="text-xl font-bold text-gray-900">$${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    updateSummary();
}

function updateSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.0825;
    const total = subtotal + tax;
    
    const elements = {
        'summary-subtotal': '$' + subtotal.toFixed(2),
        'summary-tax': '$' + tax.toFixed(2),
        'summary-total': '$' + total.toFixed(2),
        'cart-count': cart.reduce((sum, item) => sum + item.quantity, 0)
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    });
}

async function handleCheckout() {
    const userNameInput = document.getElementById('userName');
    const userName = userNameInput ? userNameInput.value.trim() : '';
    
    if (!userName) {
        alert('⚠️ Please enter your name!');
        if (userNameInput) userNameInput.focus();
        return;
    }
    
    const cart = getCart();
    if (cart.length === 0) {
        alert('⚠️ Your cart is empty!');
        return;
    }
    
    try {
        console.log('Saving basket to backend...');
        await BasketAPI.save(userName, cart);
        
        console.log('Checking out...');
        await BasketAPI.checkout(userName);
        
        alert(`✅ Order placed successfully!\n\nThank you, ${userName}!\n\nRedirecting to your orders...`);
        
        // 保存用户名到localStorage
        localStorage.setItem('lastUserName', userName);
        
        clearCart();
        
        // 跳转到my-orders.html并自动加载
        setTimeout(() => {
            window.location.href = 'my-orders.html';
        }, 1000);
    } catch (error) {
        alert('❌ Error during checkout: ' + error.message);
        console.error('Checkout error:', error);
    }
}

async function saveBasket() {
    const userName = prompt('Enter username to save basket:');
    if (!userName) return;
    
    try {
        await BasketAPI.save(userName, getCart());
        alert('✅ Basket saved to backend!');
    } catch (error) {
        alert('❌ Error: ' + error.message);
    }
}

async function deleteBasket() {
    const userName = prompt('Enter username to delete:');
    if (!userName || !confirm('Delete this basket from backend?')) return;
    
    try {
        await BasketAPI.delete(userName);
        alert('✅ Basket deleted from backend!');
    } catch (error) {
        alert('❌ Error: ' + error.message);
    }
}

function addSampleItem() {
    const cart = getCart();
    cart.push({
        productId: 'sample-001',
        productName: 'Sample Product',
        price: 99.99,
        quantity: 1
    });
    saveCart(cart);
    displayCartItems();
}

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('cart-container')) {
            displayCartItems();
        }
    });
}
