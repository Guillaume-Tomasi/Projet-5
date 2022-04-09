let product = [];
let params = new URLSearchParams(document.location.search);
let id = params.get("id");


async function fetchApi() {
    await fetch(`http://localhost:3000/api/products/${id}`)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            product = data;
        })
}

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
