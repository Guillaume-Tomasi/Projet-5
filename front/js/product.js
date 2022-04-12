let product = [];

let params = new URLSearchParams(document.location.search);
let id = params.get("id");
let quantityInput = document.querySelector('#quantity');
let colorSelected = document.querySelector("#colors");

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
    document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    document.getElementById("title").innerHTML = product.name;
    document.getElementById("price").innerHTML = product.price;
    document.getElementById("description").innerHTML = product.description;

    function colorsList() {
        for (let i = 0; i < product.colors.length; i++) {
            document.getElementById("colors").innerHTML += `<option value="${product.colors[i]}">${product.colors[i]}</option>`;
        }
    }
    colorsList();
}

productDisplay();


function ProductAddInfo() {

    document.getElementById("addToCart").addEventListener("click", function () {

        cartInfo.id = product._id;
        cartInfo.quantityItem = quantityInput.value;
        cartInfo.colorItem = colorSelected.value;

        let storageAdd = JSON.parse(localStorage.getItem("cart"));

        if (storageAdd) {
            let searchItem = storageAdd.find((element) => element.id == cartInfo.id && element.colorItem == cartInfo.colorItem);

            if (searchItem) {
                searchItem.quantityItem += cartInfo.quantityItem;
                localStorage.setItem("cart", JSON.stringify(storageAdd));
                console.log(storageAdd);
            }
        } else {
            let storageAdd = [];
            storageAdd.push(cartInfo);
            localStorage.setItem("cart", JSON.stringify(storageAdd)); console.log(storageAdd);
        }
    }

    )

}
ProductAddInfo();




