const API_BASE_URL = {
    PRODUCT: 'https://hnwuoxfcc8.execute-api.us-east-1.amazonaws.com/prod/product',
    BASKET: 'https://yt8ktnrkv7.execute-api.us-east-1.amazonaws.com/prod/basket',
    ORDER: 'https://0ke1j0wymi.execute-api.us-east-1.amazonaws.com/prod/order',
    INVENTORY: 'https://ezwefeul2c.execute-api.us-east-1.amazonaws.com/prod/inventory',
    PAYMENT: 'https://169tph9xp0.execute-api.us-east-1.amazonaws.com/prod/payment'
};

function getProductImage(name) {
    const n = name.toLowerCase();
    if (n.includes('macbook')) return 'https://m.media-amazon.com/images/I/61TlNi96DpL._AC_SL1500_.jpg';
    if (n.includes('laptop')) return 'https://m.media-amazon.com/images/I/61+r3+JstZL._AC_SL1500_.jpg';
    if (n.includes('ipad')) return 'https://m.media-amazon.com/images/I/61uA2UVnYWL._AC_SL1500_.jpg';
    if (n.includes('iphone')) return 'https://m.media-amazon.com/images/I/71d7rfSl0wL._AC_SL1500_.jpg';
    if (n.includes('airpods')) return 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg';
    if (n.includes('watch')) return 'https://m.media-amazon.com/images/I/71u+WNED+hL._AC_SL1500_.jpg';
    if (n.includes('sony')) return 'https://m.media-amazon.com/images/I/61vJO46b9eL._AC_SL1500_.jpg';
    if (n.includes('keyboard')) return 'https://m.media-amazon.com/images/I/51VxMht23rL._AC_SL1500_.jpg';
    if (n.includes('mouse') || n.includes('logitech')) return 'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg';
    if (n.includes('samsung') || n.includes('monitor')) return 'https://m.media-amazon.com/images/I/81lhXRQuyfL._AC_SL1500_.jpg';

    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f0f0f0" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="60"%3E📦%3C/text%3E%3C/svg%3E';
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
