function loadForm() {
    console.log("Odpalone");
    const form = document.getElementById('orderForm');
    const statusEl = document.getElementById('orderStatus');
    const cartItemsEl = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<li>Twój koszyk jest pusty.</li>';
        form.style.display = 'none';
        totalPriceEl.style.display = 'none';
        return;
    }

    // Pobierz produkty z serwera i dopasuj do ID w koszyku
    fetch('http://localhost:3000/products')
        .then(response => response.json())
        .then(products => {
            const orderItems = cart
                .map(id => {
                    const product = products.find(p => p.id === id);
                    return product || null;
                })
                .filter(Boolean); let total = 0;

            orderItems.forEach(product => {
                const item = document.createElement('li');

                const nameSpan = document.createElement('span');
                nameSpan.textContent = product.name;

                const priceSpan = document.createElement('span');
                priceSpan.textContent = `${product.price} zł`;

                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Usuń';
                removeBtn.className = 'remove-btn';
                removeBtn.addEventListener('click', () => {
                    // Usuń pierwszy wystąpienie tego ID z koszyka
                    const index = cart.indexOf(product.id);
                    if (index !== -1) {
                        cart.splice(index, 1);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        location.reload(); // odświeżenie widoku formularza
                    }
                });

                item.appendChild(nameSpan);
                item.appendChild(priceSpan);
                item.appendChild(removeBtn);
                cartItemsEl.appendChild(item);

                total += product.price;
            });


            totalPriceEl.innerHTML = `<strong>Suma: </strong>${total} zł`;
        });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const orderData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            address: formData.get('address'),
            products: cart.map(id => Number(id)),
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('http://localhost:3000/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) throw new Error("Błąd serwera");

            statusEl.textContent = "Dziękujemy! Zamówienie zostało przyjęte.";
            statusEl.style.color = 'green';
            form.reset();
            localStorage.removeItem('cart');
            cartItemsEl.innerHTML = '';
            totalPriceEl.innerHTML = '';
            form.style.display = 'none';
        } catch (err) {
            statusEl.textContent = "Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie później.";
            statusEl.style.color = 'red';
        }
    });
};

window.onload = loadForm;