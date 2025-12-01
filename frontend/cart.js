let cart = JSON.parse(localStorage.getItem('cart')) || [];

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cartData) {
    localStorage.setItem('cart', JSON.stringify(cartData));
    cart = cartData;
    updateCartDisplay();
}

function addToCart(productId, productName, price, availableStock) {
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= availableStock) {
            alert(`⚠️ Only ${availableStock} units available!`);
            return;
        }
        existingItem.quantity++;
    } else {
        cart.push({ productId, productName, price, quantity: 1 });
    }
    
    saveCart(cart);
    
    // 显示添加成功的反馈
    const feedback = document.createElement('div');
    feedback.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #00d100; color: white; padding: 15px 25px; border-radius: 8px; z-index: 9999; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
    feedback.textContent = '✅ Added to cart!';
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 2000);
}

function updateQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart(cart);
    if (typeof displayCartItems === 'function') {
        displayCartItems();
    }
}

function removeFromCart(index) {
    if (confirm('Remove this item?')) {
        cart.splice(index, 1);
        saveCart(cart);
        if (typeof displayCartItems === 'function') {
            displayCartItems();
        }
    }
}

function clearCart() {
    cart = [];
    saveCart(cart);
}

function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // 更新购物车徽章数字 - 查找position: absolute的span
    document.querySelectorAll('nav span').forEach(span => {
        const style = span.getAttribute('style');
        if (style && style.includes('position: absolute')) {
            span.textContent = totalItems;
        }
    });
}

document.addEventListener('DOMContentLoaded', updateCartDisplay);
