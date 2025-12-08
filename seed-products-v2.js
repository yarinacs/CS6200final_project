const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS Region
AWS.config.update({ region: 'us-east-1' });

// Create DynamoDB Document Client
const docClient = new AWS.DynamoDB.DocumentClient();

// Define table name
const TABLE_NAME = 'product-v2';

// Mock data from frontend/mock-data.js
const mockProducts = [
    {
        id: "prod001",
        name: "Smartphone Pro",
        description: "Latest smartphone with advanced camera system and premium design. Perfect for professionals and tech enthusiasts.",
        price: 999,
        category: "Electronics",
        imageFile: "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/1.webp",
        availableStock: 45
    },
    {
        id: "prod002",
        name: "Laptop Pro",
        description: "Powerful laptop with high-performance processor, large display, and exceptional battery life. Ideal for creative professionals and developers.",
        price: 2499,
        category: "Electronics",
        imageFile: "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/1.webp",
        availableStock: 12
    },
    {
        id: "prod003",
        name: "Wireless Earbuds Pro",
        description: "Premium wireless earbuds with active noise cancellation, spatial audio, and adaptive EQ for the perfect listening experience.",
        price: 249,
        category: "Electronics",
        imageFile: "https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/1.webp",
        availableStock: 88
    },
    {
        id: "prod004",
        name: "Athletic Sneakers",
        description: "Classic sneakers with iconic design, comfortable cushioning, and durable construction. Perfect for everyday wear.",
        price: 120,
        category: "Fashion",
        imageFile: "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/1.webp",
        availableStock: 34
    },
    {
        id: "prod005",
        name: "Classic Jeans",
        description: "Original fit jeans with button fly and straight leg. Made from premium denim for lasting comfort and style.",
        price: 89,
        category: "Fashion",
        imageFile: "https://images.unsplash.com/photo-1542272617-08f086320497?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        availableStock: 67
    },
    {
        id: "prod006",
        name: "Noise Canceling Headphones",
        description: "Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.",
        price: 399,
        category: "Electronics",
        imageFile: "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/1.webp",
        availableStock: 23
    },
    {
        id: "prod007",
        name: "Coffee Maker Deluxe",
        description: "Programmable coffee maker with thermal carafe, 12-cup capacity, and auto shut-off feature for convenience.",
        price: 79,
        category: "Home & Kitchen",
        imageFile: "https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/1.webp",
        availableStock: 15
    },
    {
        id: "prod008",
        name: "Stand Mixer Pro",
        description: "Professional-grade stand mixer with 5.5-quart capacity, multiple attachments, and powerful motor for all your baking needs.",
        price: 349,
        category: "Home & Kitchen",
        imageFile: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        availableStock: 8
    },
    {
        id: "prod009",
        name: "Yoga Mat Premium",
        description: "Eco-friendly yoga mat with superior grip, cushioning, and non-slip surface. Perfect for all yoga practices.",
        price: 45,
        category: "Sports",
        imageFile: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        availableStock: 50
    },
    {
        id: "prod010",
        name: "Dumbbell Set 20kg",
        description: "Adjustable dumbbell set with quick-change weight system. Space-saving design for home gyms.",
        price: 199,
        category: "Sports",
        imageFile: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        availableStock: 20
    },
    {
        id: "prod011",
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse with precision tracking, long battery life, and comfortable design for extended use.",
        price: 29,
        category: "Electronics",
        imageFile: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        availableStock: 150
    },
    {
        id: "prod012",
        name: "Mechanical Keyboard",
        description: "RGB backlit mechanical keyboard with Cherry MX switches, programmable keys, and durable aluminum frame.",
        price: 149,
        category: "Electronics",
        imageFile: "https://images.unsplash.com/photo-1587829741301-dc798b91add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        availableStock: 42
    }
];

async function seedProducts() {
    console.log(`Seeding data to table: ${TABLE_NAME}...`);

    for (const product of mockProducts) {
        const params = {
            TableName: TABLE_NAME,
            Item: product
        };

        try {
            await docClient.put(params).promise();
            console.log(`Added product: ${product.name}`);
        } catch (err) {
            console.error(`Unable to add product: ${product.name}. Error JSON:`, JSON.stringify(err, null, 2));
        }
    }

    console.log('Seeding completed.');
}

seedProducts();
