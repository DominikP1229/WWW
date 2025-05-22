let products = [];
let categories = [];

function fetchProducts() {
    fetch('http://localhost:3000/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            categories = [...new Set(data.map(product => product.category))];
            populateCategories();
            renderCategoryLinks(); // ⬅️ dodajemy tylko raz
            displayProducts(products);
        })
        .catch(error => console.error('Błąd pobierania danych:', error));
    changeNumberOfProductsInCart();
}

// 🔄 Renderuje tylko listę produktów
function displayProducts(filteredProducts) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    if (filteredProducts.length === 0) {
        const productElement = document.createElement('h1');
        productElement.innerHTML = 'Brak pasujących produktów';
        productsContainer.appendChild(productElement);
        return;
    }

    // Grupowanie produktów po kategorii
    const grouped = {};
    filteredProducts.forEach(product => {
        if (!grouped[product.category]) {
            grouped[product.category] = [];
        }
        grouped[product.category].push(product);
    });

    // Renderowanie produktów z grupowaniem
    for (const category of categories) {
        if (!grouped[category]) continue;

        const section = document.createElement("section");
        section.id = category.toLowerCase();
        section.classList = "categories";

        const sectionHeader = document.createElement("header");
        sectionHeader.innerHTML = category;
        section.appendChild(sectionHeader);

        grouped[category].forEach(product => {
            const productElement = document.createElement('article');
            productElement.classList.add('product');

            if (product.image) {
                const img = document.createElement('img');
                img.src = `images/${product.image}`;
                img.alt = product.name;
                productElement.appendChild(img);
            }

            const name = document.createElement('header');
            name.classList.add('product-name');
            name.textContent = product.name;
            productElement.appendChild(name);

            const description = document.createElement('p');
            description.classList.add('product-description');
            description.textContent = product.description;
            productElement.appendChild(description);

            const image = document.createElement('img');
            image.classList.add('product-image');
            image.src = `menu/id_${product.id}.png`;
            productElement.appendChild(image);

            const price = document.createElement('p');
            price.classList.add('product-price');
            price.textContent = `Cena: ${product.price} zł`;
            productElement.appendChild(price);

            const addToCartButton = document.createElement('button');
            addToCartButton.classList.add('product-addToCartButton');
            addToCartButton.textContent = 'Dodaj do koszyka';
            addToCartButton.addEventListener('click', () => {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.push(product.id);
                try {
                    localStorage.setItem('cart', JSON.stringify(cart));
                    alert("Produkt został dodany do koszyka");
                } catch (error) {
                    alert("Nie udało się dodać produktu do koszyka: " + error.message);
                }
                changeNumberOfProductsInCart();
            });

            productElement.appendChild(addToCartButton);
            section.appendChild(productElement);
        });

        productsContainer.appendChild(section);
    }
}

// ✅ Nowa funkcja do tworzenia kategorii z linkami (raz!)
function renderCategoryLinks() {
    const categoriesSection = document.getElementById("categories");
    categoriesSection.innerHTML = "";

    categories.forEach(category => {
        const path = "categories/" + category + ".png";

        const categoryImage = document.createElement("img");
        categoryImage.setAttribute("src", path);

        const h2 = document.createElement("h2");
        h2.innerHTML = category;

        const a = document.createElement("a");
        a.setAttribute("href", "#" + category.toLowerCase());
        a.appendChild(categoryImage);
        a.appendChild(h2);

        categoriesSection.appendChild(a);
    });
}

function populateCategories() {
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '<option value="">Wszystkie</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function applyFilters() {
    let filteredProducts = products;

    const searchQuery = document.getElementById('search').value.toLowerCase();
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery)
        );
    }

    const selectedCategory = document.getElementById('category').value;
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product =>
            product.category === selectedCategory
        );
    }

    const noSpicy = document.getElementById('spicy').checked;
    if (noSpicy) {
        filteredProducts = filteredProducts.filter(product => !product.isSpicy);
    }

    displayProducts(filteredProducts);
}



window.onload = fetchProducts;
