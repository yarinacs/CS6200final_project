// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function getProductImage(product) {
    // If product has a specific image URL (starts with http) or local path (starts with images/), use it
    if (product.imageFile && (product.imageFile.startsWith('http') || product.imageFile.startsWith('images/'))) {
        return product.imageFile;
    }

    // Get product-specific image URL based on product name and category
    // Each product gets a relevant real product image that matches the product type
    const imageSize = '400';
    const keyword = getProductImageKeyword(product);

    // Try Unsplash Source API first (may have rate limits)
    // Format: https://source.unsplash.com/{width}x{height}/?{keyword}
    const unsplashUrl = `https://source.unsplash.com/${imageSize}x${imageSize}/?${keyword}`;

    // Fallback: Use Picsum with product-specific seed for consistent images
    // This ensures each product gets a different but consistent image
    const productIdNum = parseInt(product.id.replace('prod', '')) || 1;
    const seed = productIdNum * 1000;
    const picsumUrl = `https://picsum.photos/seed/${seed}/${imageSize}/${imageSize}`;

    // Return Unsplash URL (will fallback via onerror handler if it fails)
    return unsplashUrl;
}

function getProductImageKeyword(product) {
    // Map product names to specific image search keywords
    // Returns the main keyword for Unsplash (single keyword works better)
    const name = product.name.toLowerCase();

    // Electronics - Phones
    if (name.includes('smartphone') || name.includes('phone')) {
        return 'smartphone';
    }

    // Electronics - Laptops
    if (name.includes('laptop') || name.includes('notebook')) {
        return 'laptop';
    }

    // Electronics - Earbuds
    if (name.includes('earbuds') || name.includes('earphones')) {
        return 'earbuds';
    }

    // Electronics - Headphones
    if (name.includes('headphone')) {
        return 'headphones';
    }

    // Electronics - Mouse
    if (name.includes('mouse')) {
        return 'computer+mouse';
    }

    // Electronics - Keyboard
    if (name.includes('keyboard')) {
        return 'keyboard';
    }

    // Fashion - Shoes/Sneakers
    if (name.includes('sneaker') || name.includes('shoe')) {
        return 'sneakers';
    }

    // Fashion - Jeans
    if (name.includes('jean')) {
        return 'jeans';
    }

    // Home & Kitchen - Coffee Maker
    if (name.includes('coffee')) {
        return 'coffee+maker';
    }

    // Home & Kitchen - Mixer
    if (name.includes('mixer')) {
        return 'mixer';
    }

    // Sports - Yoga Mat
    if (name.includes('yoga')) {
        return 'yoga+mat';
    }

    // Sports - Weights/Dumbbell
    if (name.includes('dumbbell') || name.includes('weight')) {
        return 'dumbbell';
    }

    // Fallback: use first meaningful word of product name
    const words = product.name.split(' ').filter(word => word.length > 2);
    return words.length > 0 ? words[0].toLowerCase() : 'product';
}

function getProductKeywords(productName) {
    // Map product names to specific search keywords for accurate product images
    // Returns comma-separated keywords for Unsplash search
    const name = productName.toLowerCase();

    // Electronics - Phones
    if (name.includes('iphone')) {
        return 'iphone,smartphone,phone,apple';
    }

    // Electronics - Laptops
    if (name.includes('macbook') || name.includes('laptop')) {
        return 'macbook,laptop,computer,apple';
    }

    // Electronics - Earbuds
    if (name.includes('airpods')) {
        return 'airpods,earbuds,wireless,apple';
    }

    // Electronics - Headphones
    if (name.includes('sony') && name.includes('headphone')) {
        return 'sony,headphones,headset,audio';
    }

    // Electronics - Mouse
    if (name.includes('mouse')) {
        return 'wireless,mouse,computer,peripheral';
    }

    // Electronics - Keyboard
    if (name.includes('keyboard')) {
        return 'mechanical,keyboard,computer,gaming';
    }

    // Fashion - Shoes
    if (name.includes('nike') || name.includes('air max') || name.includes('sneaker')) {
        return 'nike,sneakers,shoes,athletic';
    }

    // Fashion - Jeans
    if (name.includes('jeans') || name.includes('levi')) {
        return 'jeans,denim,pants,clothing';
    }

    // Home & Kitchen - Coffee Maker
    if (name.includes('coffee')) {
        return 'coffee,maker,machine,kitchen';
    }

    // Home & Kitchen - Mixer
    if (name.includes('mixer')) {
        return 'stand,mixer,kitchen,appliance';
    }

    // Sports - Yoga Mat
    if (name.includes('yoga')) {
        return 'yoga,mat,fitness,exercise';
    }

    // Sports - Weights
    if (name.includes('dumbbell') || name.includes('weight')) {
        return 'dumbbell,weights,fitness,gym';
    }

    // Fallback: use first meaningful word from product name
    const words = productName.split(' ').filter(word => word.length > 2);
    return words.length > 0 ? words[0] : 'product';
}

// Product List Page Functions
let currentCategory = 'all';
let allProducts = [];

function initProductList() {
    try {
        // Load products
        const response = getMockProducts();
        allProducts = response.body;

        console.log('Products loaded:', allProducts.length);

        // Initialize categories
        initCategories();

        // Initialize search
        initSearch();

        // Render products
        renderProducts(allProducts);

        // Hide loading
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error initializing product list:', error);
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.textContent = 'Error loading products. Please refresh the page.';
        }
    }
}

function initCategories() {
    const categories = getCategories();
    const categoryFilters = document.getElementById('categoryFilters');

    // Add event listener to "All Products" button
    const allProductsBtn = categoryFilters.querySelector('button[data-category="all"]');
    if (allProductsBtn) {
        allProductsBtn.addEventListener('click', () => filterByCategory('all'));
    }

    // Add category buttons
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category;
        btn.setAttribute('data-category', category);
        btn.addEventListener('click', () => filterByCategory(category));
        categoryFilters.appendChild(btn);
    });
}

function filterByCategory(category) {
    currentCategory = category;

    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });

    // Filter products
    let filteredProducts = allProducts;

    // Category filter
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Search filter (if exists)
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value.trim() !== '') {
        const term = searchInput.value.toLowerCase().trim();
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term)
        );
    }

    // Render filtered products
    renderProducts(filteredProducts);
}

function initSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');

    if (searchToggle && searchBox && searchInput) {
        searchToggle.addEventListener('click', () => {
            searchBox.classList.toggle('hidden');
            if (!searchBox.classList.contains('hidden')) {
                searchInput.focus();
            }
        });

        searchInput.addEventListener('input', () => {
            filterByCategory(currentCategory);
        });
    }
}

function renderProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    const productsCount = document.getElementById('productsCount');
    const noProducts = document.getElementById('noProducts');

    // Update count
    productsCount.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;

    // Clear grid
    productsGrid.innerHTML = '';

    if (products.length === 0) {
        noProducts.style.display = 'block';
        return;
    }

    noProducts.style.display = 'none';

    // Render product cards
    products.forEach(product => {
        const card = createProductCard(product);
        productsGrid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('a');
    card.href = `product-detail.html?id=${product.id}`;
    card.className = 'product-card';

    // Generate random size and color for demo (Only for Fashion)
    let attributesHtml = '';
    if (product.category === 'Fashion') {
        const sizes = ['S', 'M', 'L', 'XL'];
        const colors = ['Black', 'White', 'Red', 'Blue', 'Gray', 'Brown'];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        attributesHtml = `<div class="product-details">${size} | ${color}</div>`;
    }

    // Calculate original price (20-30% higher for sale effect)
    const discountPercent = 0.2 + Math.random() * 0.1;
    const originalPrice = Math.round(product.price / (1 - discountPercent));

    const imageUrl = getProductImage(product);

    // Create fallback URL using Picsum
    const productIdNum = parseInt(product.id.replace('prod', '')) || 1;
    const fallbackUrl = `https://picsum.photos/seed/${productIdNum * 1000}/400/400`;

    card.innerHTML = `
        <div class="product-image">
            <img src="${imageUrl}" alt="${product.name}" loading="lazy" 
                 onerror="console.error('Unsplash image failed, trying fallback'); this.onerror=null; this.src='${fallbackUrl}';" />
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name">${product.name}</h3>
            ${attributesHtml}
            <div class="product-stock">In Stock</div>
            <div class="product-price-container">
                <span class="product-price">${formatCurrency(product.price)}</span>
                <span class="product-price-original">${formatCurrency(originalPrice)}</span>
            </div>
            <div class="product-actions">
                <button class="product-action-btn save" onclick="event.preventDefault(); addToWishlist('${product.id}')">Add to Wishlist</button>
                <button class="product-action-btn cart" onclick="event.preventDefault(); addToCart('${product.id}')">Add to Cart</button>
            </div>
        </div>
    `;

    return card;
}

function addToWishlist(productId) {
    alert(`Product ${productId} added to wishlist!`);
}

function addToCart(productId) {
    alert(`Product ${productId} added to cart!`);
}

// Product Detail Page Functions
function loadProductDetail(productId) {
    const response = getMockProductById(productId);
    const productDetail = document.getElementById('productDetail');

    if (!response || !response.body) {
        productDetail.innerHTML = `
            <div class="error">
                <p>Product not found.</p>
                <a href="index.html" class="btn btn-primary">Back to Products</a>
            </div>
        `;
        return;
    }

    const product = response.body;
    renderProductDetail(product);
}

function renderProductDetail(product) {
    const productDetail = document.getElementById('productDetail');

    // Generate random size and color for demo
    const sizes = ['S', 'M', 'L', 'XL'];
    const colors = ['Black', 'White', 'Red', 'Blue', 'Gray', 'Brown'];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Calculate original price (20-30% higher for sale effect)
    const discountPercent = 0.2 + Math.random() * 0.1;
    const originalPrice = Math.round(product.price / (1 - discountPercent));

    productDetail.innerHTML = `
        <div class="product-detail-content">
            <div class="product-detail-image">
                <img src="${getProductImage(product)}" alt="${product.name}" loading="lazy" />
            </div>
            <div class="product-detail-info">
                <div class="product-detail-category">${product.category}</div>
                <h1 class="product-detail-name">${product.name}</h1>
                <div class="product-details" style="margin-bottom: 0.75rem; font-size: 0.9375rem; color: var(--text-secondary);">${size} | ${color}</div>
                <div class="product-stock" style="margin-bottom: 1rem;">In Stock</div>
                <div class="product-price-container" style="margin-bottom: 1.5rem;">
                    <span class="product-price" style="font-size: 1.5rem;">${formatCurrency(product.price)}</span>
                    <span class="product-price-original" style="font-size: 1.125rem;">${formatCurrency(originalPrice)}</span>
                </div>
                <p class="product-detail-description">${product.description}</p>
                <div class="product-detail-actions">
                    <button class="btn btn-primary" onclick="addToCart('${product.id}')">Add to Cart</button>
                    <button class="btn btn-secondary" onclick="window.location.href='index.html'">Continue Shopping</button>
                </div>
            </div>
        </div>
    `;
}

function addToCart(productId) {
    // Placeholder for cart functionality
    alert(`Product ${productId} added to cart! (Cart functionality will be implemented later)`);
}

// Initialize page based on current page
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname;
    const currentFile = window.location.href;

    console.log('Current page:', currentPage);
    console.log('Current file:', currentFile);

    // Initialize authentication
    if (typeof initAuth === 'function') {
        initAuth();
    }

    // Check if we're on the product list page
    if (currentPage.includes('products.html') ||
        (currentPage.includes('product-detail') === false && document.getElementById('productsGrid'))) {
        console.log('Initializing product list...');
        initProductList();
    }
    // Product detail page initialization is handled in product-detail.html
});


