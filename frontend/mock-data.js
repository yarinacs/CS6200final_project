// Mock data based on the API structure
// This simulates the response from the backend API

const mockProducts = [
    {
        id: "prod001",
        name: "Smartphone Pro",
        description: "Latest smartphone with advanced camera system and premium design. Perfect for professionals and tech enthusiasts.",
        price: 999,
        category: "Electronics",
        imageFile: "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/1.webp"
    },
    {
        id: "prod002",
        name: "Laptop Pro",
        description: "Powerful laptop with high-performance processor, large display, and exceptional battery life. Ideal for creative professionals and developers.",
        price: 2499,
        category: "Electronics",
        imageFile: "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/1.webp"
    },
    {
        id: "prod003",
        name: "Wireless Earbuds Pro",
        description: "Premium wireless earbuds with active noise cancellation, spatial audio, and adaptive EQ for the perfect listening experience.",
        price: 249,
        category: "Electronics",
        imageFile: "https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/1.webp"
    },
    {
        id: "prod004",
        name: "Athletic Sneakers",
        description: "Classic sneakers with iconic design, comfortable cushioning, and durable construction. Perfect for everyday wear.",
        price: 120,
        category: "Fashion",
        imageFile: "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/1.webp"
    },
    {
        id: "prod005",
        name: "Classic Jeans",
        description: "Original fit jeans with button fly and straight leg. Made from premium denim for lasting comfort and style.",
        price: 89,
        category: "Fashion",
        imageFile: "images/jeans.png"
    },
    {
        id: "prod006",
        name: "Noise Canceling Headphones",
        description: "Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.",
        price: 399,
        category: "Electronics",
        imageFile: "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/1.webp"
    },
    {
        id: "prod007",
        name: "Coffee Maker Deluxe",
        description: "Programmable coffee maker with thermal carafe, 12-cup capacity, and auto shut-off feature for convenience.",
        price: 79,
        category: "Home & Kitchen",
        imageFile: "https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/1.webp"
    },
    {
        id: "prod008",
        name: "Stand Mixer Pro",
        description: "Professional-grade stand mixer with 5.5-quart capacity, multiple attachments, and powerful motor for all your baking needs.",
        price: 349,
        category: "Home & Kitchen",
        imageFile: "https://cdn.dummyjson.com/product-images/kitchen-accessories/hand-blender/1.webp"
    },
    {
        id: "prod009",
        name: "Yoga Mat Premium",
        description: "Eco-friendly yoga mat with superior grip, cushioning, and non-slip surface. Perfect for all yoga practices.",
        price: 45,
        category: "Sports",
        imageFile: "images/yoga-mat.png"
    },
    {
        id: "prod010",
        name: "Dumbbell Set 20kg",
        description: "Adjustable dumbbell set with quick-change weight system. Space-saving design for home gyms.",
        price: 199,
        category: "Sports",
        imageFile: "images/dumbbell.png"
    },
    {
        id: "prod011",
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse with precision tracking, long battery life, and comfortable design for extended use.",
        price: 29,
        category: "Electronics",
        imageFile: "images/mouse.png"
    },
    {
        id: "prod012",
        name: "Mechanical Keyboard",
        description: "RGB backlit mechanical keyboard with Cherry MX switches, programmable keys, and durable aluminum frame.",
        price: 149,
        category: "Electronics",
        imageFile: "images/keyboard.png"
    }
];

// Simulate API response format
function getMockProducts() {
    return {
        message: "Successfully finished operation: GET",
        body: mockProducts
    };
}

function getMockProductById(id) {
    const product = mockProducts.find(p => p.id === id);
    if (product) {
        return {
            message: "Successfully finished operation: GET",
            body: product
        };
    }
    return null;
}

// Get unique categories
function getCategories() {
    const categories = [...new Set(mockProducts.map(p => p.category))];
    return categories.sort();
}

