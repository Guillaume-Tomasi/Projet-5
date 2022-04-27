// Variable qui contiendra tous les produits

let products = [];

// Récupération des produits + stockage dans la variable

async function fetchApi() {
    await fetch("http://localhost:3000/api/products")
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            products = data;
        })
}

// // Implémentation des produits sur la page

async function productsDisplay() {
    await fetchApi();
    document.getElementById("items");
    for (let i = 0; i < products.length; i++) {
        let text = `<a href="./product.html?id=${products[i]._id}">
        <article>
          <img src="${products[i].imageUrl}" alt="${products[i].altTxt}">
          <h3 class="productName">${products[i].name}</h3>
          <p class="productDescription">${products[i].description}</p>
        </article>
      </a>`
        document.getElementById("items").insertAdjacentHTML("beforeend", text);
    }
}
productsDisplay();