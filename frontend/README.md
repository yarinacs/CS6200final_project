# E-Commerce Frontend

A modern, responsive frontend application for the AWS Serverless Microservices e-commerce project.

## Features

- ✅ Product listing with grid layout
- ✅ Product detail page
- ✅ Category filtering
- ✅ Currency formatting
- ✅ Responsive design (mobile-friendly)
- ✅ Modern UI with smooth animations

## Technology Stack

- **HTML5** - Structure
- **CSS3** - Styling with modern CSS features
- **Vanilla JavaScript** - No frameworks, pure JS

## Project Structure

```
frontend/
├── index.html          # Product list page
├── product-detail.html # Product detail page
├── styles.css          # All styles
├── app.js             # Main application logic
├── mock-data.js       # Mock data (simulating API responses)
└── README.md          # This file
```

## Getting Started

### ⚠️ Important: Use a Local Server

**Do NOT open `index.html` directly in the browser** (file:// protocol). This will cause CORS errors and images won't load.

### Option 1: Python HTTP Server (Recommended)

```bash
cd frontend
python3 -m http.server 8000
```

Then open: **http://localhost:8000**

### Option 2: Node.js http-server

```bash
npm install -g http-server
cd frontend
http-server
```

### Option 3: VS Code Live Server

Install "Live Server" extension and click "Go Live"

## Why Use a Server?

- **CORS Security**: Browsers block external image requests from `file://` protocol
- **Image Loading**: Unsplash images require HTTP/HTTPS protocol
- **Better Development**: Local server simulates real web environment

## API Integration (Future)

Currently, the app uses mock data from `mock-data.js`. To connect to the real API:

1. Update `app.js` to replace `getMockProducts()` and `getMockProductById()` with actual API calls
2. Set the API base URLs:
   - Product API: `https://xxx.execute-api.region.amazonaws.com/prod`

Example API call structure:

```javascript
async function fetchProducts() {
  const response = await fetch(`${PRODUCT_API}/product`);
  const data = await response.json();
  return data.body; // API returns { message: "...", body: [...] }
}
```

## Data Models

### Product

```javascript
{
    id: "string",
    name: "string",
    description: "string",
    price: number,
    category: "string",
    imageFile: "string"
}
```

## API Endpoints (Reference)

### Product API

- `GET /product` - Get all products
- `GET /product/{id}` - Get product by ID
- `POST /product` - Create product
- `PUT /product/{id}` - Update product
- `DELETE /product/{id}` - Delete product

**Response Format:**

```json
{
    "message": "Successfully finished operation: GET",
    "body": [...]
}
```

## Features Implemented

### ✅ Product Browsing

- Product list with grid layout
- Product detail page
- Category filtering
- Responsive design

### 🚧 Coming Soon

- Shopping cart functionality
- Order history
- API integration
- User authentication

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Images Not Loading?

1. **Make sure you're using a local server** (not file://)
2. Check browser console for CORS errors
3. Verify internet connection (images load from Unsplash)
4. Try refreshing the page

### Products Not Showing?

1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify `mock-data.js` is loaded
4. Check that `initProductList()` is called

## Notes

- All content is displayed in English
- Prices are formatted as USD currency
- Images are loaded from Unsplash based on product keywords
- Mock data includes 12 sample products across 4 categories
