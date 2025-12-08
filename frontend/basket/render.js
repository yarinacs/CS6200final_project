// ============================================
// render.js - UI rendering and display functions
// ============================================

// Main render function - updates entire cart display
function renderCart() {
    const container = document.getElementById('cart-container');
    const emptyState = document.getElementById('empty-state');
    const countSpan = document.getElementById('cart-count');

    // Update cart count
    countSpan.textContent = cartItems.length;

    // Show empty state if no items
    if (cartItems.length === 0) {
        container.style.display = 'none';
        emptyState.classList.remove('hidden');
        updateSummary(0, 0, 0);
        return;
    } else {
        container.style.display = 'block';
        emptyState.classList.add('hidden');
    }

    // Calculate totals
    const subtotal = calculateSubtotal();
    const shippingCost = subtotal > 100 ? 0 : 15.00;
    const estimatedTax = subtotal * 0.08;

    let html = '';

    // Add free shipping banner if applicable
    if (shippingCost === 0) {
        html += `
           <div class="bg-green-50 px-6 py-3 flex items-center gap-3 border-b border-green-100">
             <div class="bg-green-100 p-1 rounded-full">
               <i data-lucide="truck" class="w-4 h-4 text-green-700"></i>
             </div>
             <p class="text-sm text-green-800 font-medium">
               You've qualified for <span class="font-bold">FREE Standard Shipping</span>
             </p>
           </div>
        `;
    }

    // Render all cart items
    html += '<ul class="divide-y divide-gray-200">';
    html += cartItems.map(item => renderCartItem(item)).join('');
    html += '</ul>';

    // Update container
    container.innerHTML = html;

    // Update summary section
    updateSummary(subtotal, shippingCost, estimatedTax);

    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Render a single cart item
function renderCartItem(item) {
    // Determine price display (sale price vs regular price)
    const displayPrice = item.salePrice
        ? `<div class="flex flex-col items-end">
             <span class="text-lg font-bold text-red-600">$${item.salePrice.toFixed(2)}</span>
             <span class="text-sm text-gray-500 line-through">$${item.price.toFixed(2)}</span>
           </div>`
        : `<span class="text-lg font-bold text-gray-900">$${item.price.toFixed(2)}</span>`;

    return `
        <li class="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50/50 transition-colors">
          <!-- Product Image -->
          <div class="relative w-full sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover object-center" />
          </div>

          <!-- Product Details -->
          <div class="flex-1 flex flex-col justify-between">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium text-gray-900">${item.name}</h3>
                <p class="mt-1 text-sm text-gray-500">${item.description}</p>
                <p class="mt-2 text-xs font-medium ${item.inStock ? 'text-green-600' : 'text-red-500'}">
                    ${item.inStock ? 'In Stock' : 'Backordered'}
                </p>
              </div>
              <div class="text-right">${displayPrice}</div>
            </div>

            <!-- Quantity Controls and Actions -->
            <div class="mt-4 sm:mt-0 flex flex-wrap items-center justify-between gap-4">
               <!-- Quantity Selector -->
               <div class="flex items-center border border-gray-300 rounded-md">
                 <button onclick="updateQuantity(${item.id}, -1)" 
                    class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-l-md disabled:opacity-50"
                    ${item.quantity <= 1 ? 'disabled' : ''}>
                   <i data-lucide="minus" class="w-3 h-3"></i>
                 </button>
                 <span class="w-10 text-center text-sm font-medium text-gray-900">${item.quantity}</span>
                 <button onclick="updateQuantity(${item.id}, 1)"
                    class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-r-md">
                   <i data-lucide="plus" class="w-3 h-3"></i>
                 </button>
               </div>

               <!-- Remove Button -->
               <div class="flex items-center gap-4">
                 <button onclick="removeItem(${item.id})" class="text-sm font-medium text-red-600 hover:text-red-500 flex items-center gap-1">
                   <i data-lucide="trash-2" class="w-4 h-4"></i>
                   <span>Remove</span>
                 </button>
               </div>
            </div>
          </div>
        </li>
    `;
}

// Calculate subtotal from all items
function calculateSubtotal() {
    return cartItems.reduce((acc, item) => {
        const price = item.salePrice || item.price;
        return acc + (price * item.quantity);
    }, 0);
}

// Update the order summary section
function updateSummary(subtotal, shippingCost, estimatedTax) {
    const total = subtotal + estimatedTax + shippingCost;

    document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summary-shipping').textContent = shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`;
    document.getElementById('summary-tax').textContent = `$${estimatedTax.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});