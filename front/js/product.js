let product = [];
let params = new URLSearchParams(document.location.search);
let id = params.get("id");
let cartInfo = {
    id: "",
    quantityItem: "",
    colorItem: "",
};

// Récupération du produit + stockage dans la variable

async function fetchApi() {
    await fetch(`http://localhost:3000/api/products/${id}`)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            product = data;
        })
}

// Implémentation du produit sur la page

async function productDisplay() {
    await fetchApi();
    document.title = product.name;
    document.querySelector(".item__img").insertAdjacentHTML("afterbegin", `<img src="${product.imageUrl}" alt="${product.altTxt}">`);
    document.getElementById("title").textContent = product.name;
    document.getElementById("price").textContent = product.price;
    document.getElementById("description").textContent = product.description;

    function colorsList() {
        let selectColor = document.querySelector("#colors");
        for (let i = 0; i < product.colors.length; i++) {
            selectColor.insertAdjacentHTML("beforeend", `<option value="${product.colors[i]}">${product.colors[i]}</option>`);
        }
    }
    colorsList();
};
productDisplay();

// Ajout du produit au Panier

document.querySelector("#colors").addEventListener("input", function (color) {
    cartInfo.colorItem = color.target.value;
})
document.querySelector("#quantity").addEventListener("change", function (number) {
    cartInfo.quantityItem = parseInt(number.target.value);
})
cartInfo.id = id;

document.querySelector("#addToCart").addEventListener("click", function add() {
    let storageAdd = JSON.parse(localStorage.getItem("cart"));

    if (cartInfo.colorItem == "") {
        alert("Veuillez sélectionner une couleur.");
    } else if (cartInfo.quantityItem == "" || cartInfo.quantityItem >= 100) {
        alert("Nombre d'articles incorrect.");
    } else {

        // Recherche dans le localstorage d'un produit identique à celui ajouté. S'il y en a un, modification de la quantité. Sinon, ajout d'un nouvel élément.

        if (storageAdd) {
            let searchItem = storageAdd.find((element) => element.id == cartInfo.id && element.colorItem == cartInfo.colorItem);

            if (searchItem) {
                searchItem.quantityItem += cartInfo.quantityItem;
                localStorage.setItem("cart", JSON.stringify(storageAdd));
            } else {
                storageAdd.push(cartInfo);
                localStorage.setItem("cart", JSON.stringify(storageAdd));
            }
        } else {
            let storageAdd = [];
            storageAdd.push(cartInfo);
            localStorage.setItem("cart", JSON.stringify(storageAdd)); console.log(storageAdd);
        }
        alert("Produit ajouté au panier.");
    }
});