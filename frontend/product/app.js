let allProducts = [];
let isLoading = false;

window.addEventListener('DOMContentLoaded', () => {
    console.log('Page ready');
    loadProducts();
    updateCartCount();
});

async function loadProducts() {
    if (isLoading) return;
    isLoading = true;

    const loading = document.getElementById('loading');
    const grid = document.getElementById('productsGrid');

    if (loading) loading.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch(API_BASE_URL.PRODUCT);
        const data = await response.json();
        allProducts = data.body || [];

        if (loading) loading.style.display = 'none';
        displayProducts(allProducts);
    } catch (error) {
        if (loading) loading.innerHTML = '<p style="color:red;">Error: ' + error.message + '</p>';
    } finally {
        isLoading = false;
    }
}

function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = products.map(p => {
        const stock = p.availableStock || 0;
        let emoji = '📦';
        const n = p.name.toLowerCase();
        if (n.includes('iphone')) emoji = '📱';
        if (n.includes('ipad')) emoji = '📱';
        if (n.includes('macbook') || n.includes('laptop')) emoji = '💻';
        if (n.includes('watch')) emoji = '⌚';
        if (n.includes('airpods') || n.includes('headphone') || n.includes('sony')) emoji = '🎧';
        if (n.includes('keyboard')) emoji = '⌨️';
        if (n.includes('mouse')) emoji = '🖱️';
        if (n.includes('monitor') || n.includes('samsung')) emoji = '🖥️';

        return '<div style="background:white;border:1px solid #ddd;border-radius:8px;padding:20px;">' +
            '<div style="width:100%;height:150px;background:#f8f8f8;border-radius:8px;margin-bottom:15px;display:flex;align-items:center;justify-content:center;font-size:80px;">' + emoji + '</div>' +
            '<h3 style="font-size:16px;font-weight:600;margin-bottom:10px;color:#007185;min-height:48px;">' + p.name + '</h3>' +
            '<p style="font-size:24px;color:#b12704;font-weight:bold;margin-bottom:10px;">$' + p.price.toFixed(2) + '</p>' +
            '<div style="padding:5px 12px;border-radius:4px;font-size:13px;margin-bottom:10px;background:' + (stock > 20 ? '#d4edda' : stock > 0 ? '#fff3cd' : '#f8d7da') + ';color:' + (stock > 20 ? '#155724' : stock > 0 ? '#856404' : '#721c24') + ';display:inline-block;">Stock: ' + stock + '</div>' +
            '<p style="font-size:14px;color:#565959;margin-bottom:15px;min-height:40px;">' + (p.description || '') + '</p>' +
            '<button onclick="addToCart(\'' + p.id + '\',\'' + p.name.replace(/'/g, "\\'") + '\',' + p.price + ',' + stock + ')" style="width:100%;padding:12px;background:' + (stock > 0 ? '#ffd814' : '#e7e9ec') + ';border:none;border-radius:8px;cursor:' + (stock > 0 ? 'pointer' : 'not-allowed') + ';font-weight:600;" ' + (stock <= 0 ? 'disabled' : '') + '>' + (stock > 0 ? '🛒 Add to Cart' : 'Out of Stock') + '</button>' +
            '</div>';
    }).join('');
}

function updateCartCount() {
    try {
        const cart = getCart();
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('nav span').forEach(span => {
            const style = span.getAttribute('style');
            if (style && style.includes('position: absolute')) {
                span.textContent = total;
            }
        });
    } catch (e) { }
}
