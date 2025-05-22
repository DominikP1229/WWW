function changeNumberOfProductsInCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productsLength = cart.length;
    document.getElementById('cart').style.setProperty('--after-content', `"${productsLength}"`);
}

changeNumberOfProductsInCart();