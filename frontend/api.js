async function getAuthTokenPromise() {
    return new Promise((resolve) => {
        if (window.getAuthToken) {
            window.getAuthToken(resolve);
        } else {
            resolve(null);
        }
    });
}

async function authenticatedFetch(url, options = {}) {
    const token = await getAuthTokenPromise();
    if (token) {
        options.headers = options.headers || {};
        options.headers['Authorization'] = token;
    }
    return fetch(url, options);
}

const ProductAPI = {
    async getAll() {
        const response = await fetch(API_BASE_URL.PRODUCT);
        const data = await response.json();
        return data.body || [];
    },

    async getById(id) {
        const response = await fetch(`${API_BASE_URL.PRODUCT}/${id}`);
        const data = await response.json();
        return data.body || {};
    },

    async create(product) {
        const response = await fetch(API_BASE_URL.PRODUCT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        return await response.json();
    }
};

const BasketAPI = {
    async save(userName, items) {
        const response = await authenticatedFetch(API_BASE_URL.BASKET, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, items })
        });
        return await response.json();
    },

    async checkout(userName) {
        const response = await authenticatedFetch(`${API_BASE_URL.BASKET}/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName })
        });
        return await response.json();
    },

    async delete(userName) {
        const response = await authenticatedFetch(`${API_BASE_URL.BASKET}/${userName}`, {
            method: 'DELETE'
        });
        return await response.json();
    }
};

const OrderAPI = {
    async getAll() {
        const response = await authenticatedFetch(API_BASE_URL.ORDER);
        const data = await response.json();
        return data.body || [];
    }
};
