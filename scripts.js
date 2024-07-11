document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cart = JSON.parse(localStorage.getItem('cart')) || [];

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const product = button.closest('.product');
        const productId = product.getAttribute('data-id');
        const productName = product.getAttribute('data-name');
        const productPrice = parseFloat(product.getAttribute('data-price')); // Parse price as float

        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${productName} has been added to your cart.`);
    });
});

    

    // Render cart items if on the cart page
    if (document.querySelector('.cart')) {
        const cartTableBody = document.querySelector('#cart-table tbody');
        const cartTotalElement = document.getElementById('cart-total');

        cart.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td> <!-- Display price in rupees -->
                <td>₹${(item.quantity * item.price).toFixed(2)}</td> <!-- Display total in rupees -->
                <td><button class="remove-from-cart" data-id="${item.id}">Remove</button></td>
            `;
            cartTableBody.appendChild(row);
        });

        const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
        cartTotalElement.textContent = `₹${total.toFixed(2)}`; // Display cart total in rupees

        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                const productIndex = cart.findIndex(item => item.id === productId);

                if (productIndex > -1) {
                    cart.splice(productIndex, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    window.location.reload();
                }
            });
        });
    }

    // Handle orders if on the order page
    if (document.querySelector('.orders')) {
        const ordersContainer = document.getElementById('orders-container');
        const orders = JSON.parse(localStorage.getItem('orders')) || [];

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p>You have not placed any orders yet.</p>';
        } else {
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(order => `
                        <tr>
                            <td>${order.id}</td>
                            <td>${order.date}</td>
                            <td>${order.items.map(item => item.name).join(', ')}</td>
                            <td>₹${order.total.toFixed(2)}</td> <!-- Display order total in rupees -->
                            <td>${order.status}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            ordersContainer.appendChild(table);
        }
    }

    // Simulate order placement (for demonstration purposes)
    document.querySelector('.checkout')?.addEventListener('click', () => {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderId = orders.length + 1;
        const orderDate = new Date().toISOString().split('T')[0];
        const orderTotal = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

        const newOrder = {
            id: orderId,
            date: orderDate,
            items: cart,
            total: orderTotal,
            status: 'Processing'
        };

        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        localStorage.removeItem('cart');
        alert('Your order has been placed!');
        window.location.href = 'order.html';
    });
});
