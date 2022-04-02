// Variable qui contiendra tous les produits

let products = [];

// Récupération des produits + stockage dans la variable

async function fetchApi() {
    await fetch("http://localhost:3000/api/products")
        .then(function (res) {
                return res.json();
        })
        .then(function (allProducts) {
            products = allProducts;
        })
}

// Implémentation des produits sur la page
async function productsDisplay() {
    await fetchApi();
    let items = document.getElementById("items");

    for (let i = 0; i < products.length; i++) {
        let link = document.createElement("a");
        let card_item = document.createElement("article");
        let card_img = document.createElement("img"); 
        let card_name = document.createElement("h3");
        let card_description = document.createElement("p");

        items.appendChild(link);
        link.appendChild(card_item);
        card_item.append(card_img, card_name, card_description);

        items.classList.add("items");
        card_name.classList.add("productName");
        card_description.classList.add("productDescription");

        link.href = `./product.html?id=${products[i]._id}`;
        card_img.src = products[i].imageUrl;
        card_img.alt = products[i].altTxt;
        card_name.textContent = products[i].name;
        card_description.textContent = products[i].description;
        
    }
}
productsDisplay();

