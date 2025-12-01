// ============================================
// api.js - All API calls to AWS Lambda backend
// ============================================

// GET basket by userName
async function getBasket(userName) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/basket/${userName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            return data.body;
        } else {
            throw new Error(data.message || 'Failed to fetch basket');
        }
    } catch (error) {
        console.error('Error fetching basket:', error);
        throw error;
    }
}

// POST - Create/Update basket
async function createBasket(basketData) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/basket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(basketData)
        });

        const data = await response.json();

        if (response.ok) {
            return data.body;
        } else {
            throw new Error(data.message || 'Failed to save basket');
        }
    } catch (error) {
        console.error('Error saving basket:', error);
        throw error;
    }
}

// DELETE basket
async function deleteBasket(userName) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/basket/${userName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            return data.body;
        } else {
            throw new Error(data.message || 'Failed to delete basket');
        }
    } catch (error) {
        console.error('Error deleting basket:', error);
        throw error;
    }
}

// POST - Checkout basket
async function checkoutBasket(checkoutData) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/basket/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkoutData)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('API Error:', data);
            throw new Error(data.errorMsg || data.message || 'Failed to checkout');
        }

        return data;

    } catch (error) {
        console.error('Checkout error:', error);
        throw error;
    }
}