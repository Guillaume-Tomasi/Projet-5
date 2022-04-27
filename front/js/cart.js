let cart = JSON.parse(localStorage.getItem("cart"));
let contact = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  email: "",
};
let products = [];


// Affichage panier

async function cartDisplay() {
  if (cart) {
    let cart__items = document.getElementById("cart__items");
    for (let items of cart) {
      await fetch(`http://localhost:3000/api/products/${items.id}`)
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          items.imageUrl = data.imageUrl;
          items.name = data.name;
          items.price = data.price;
          items.altTxt = data.altTxt;
        })

      // Création et ajout des éléments HTML 

      let text = `<article class="cart__item" data-id="${items.id}" data-color="${items.colorItem}">
            <div class="cart__item__img">
              <img src=${items.imageUrl} alt=${items.altTxt}>
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${items.name}</h2>
                <p>${items.colorItem}</p>
                <p>${items.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${items.quantityItem}>
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`;
      cart__items.insertAdjacentHTML("beforeend", text);
    }




    let articles = document.querySelectorAll(".cart__item");
    let quantity = document.querySelectorAll(".itemQuantity");
    let deleteItm = document.querySelectorAll(".deleteItem");




    // Actualisation quand article supprimé
    for (let i = 0; i < articles.length; i++) {
      let cart = JSON.parse(localStorage.getItem("cart"));
      deleteItm[i].addEventListener("click", function () {
        let newCart = cart.filter(function (items) {
          return items.id != cart[i].id || items.colorItem != cart[i].colorItem;
        });
        document.querySelector(`[data-id='${cart[i].id}']` && `[data-color='${cart[i].colorItem}']`).remove();
        cart = newCart;
        localStorage.setItem("cart", JSON.stringify(cart));
        refresh();
      });
    }




    // Actualisation quand changement de quantité
    function totalqty() {
      for (let i = 0; i < articles.length; i++) {
        quantity[i].addEventListener("change", function (number) {
          cart[i].quantityItem = parseInt(number.target.value);
          localStorage.setItem("cart", JSON.stringify(cart));
          refresh();

        });
      }
    }
    totalqty();


    // Actualisation total quantité et total prix

    function refresh() {
      let cart = JSON.parse(localStorage.getItem("cart"));
      let totalQty = 0;
      let totalPrice = 0;

      for (let i = 0; i < cart.length; i++) {
        totalQty += cart[i].quantityItem;
        totalPrice += cart[i].price * cart[i].quantityItem;
        console.log(totalQty);
      }
      document.getElementById("totalQuantity").textContent = totalQty;
      document.getElementById("totalPrice").textContent = totalPrice;
    }
    refresh();
  }



  // Si panier vide

  else {
    document.querySelector("h1").textContent = "Votre panier est vide";
    totalQuantity.textContent = "0";
    totalPrice.textContent = "0 ";
  }
}
cartDisplay();


































































// Formulaire

let form = document.querySelectorAll(".cart__order__form__question");
let emailRegExp = /[a-zA-Z0-9]+[@]{1}[a-zA-Z0-9]+[.]{1}[a-z]{2,5}/;
let globalRegExp = /^[a-zA-Z -]+$/;
let addressRegExp = /^[a-zA-Z0-9éè, -]+$/;


// Fonction qui vérifie la validité des inputs

function verifInputs(selectId, selectRegExp, errorMsg) {
  document.getElementById(selectId);
  if (!selectRegExp.test(selectId.value) || selectId.value == "") {
    errorMsg.textContent = "Champ invalide";
    selectId.style.boxShadow = "0 0 6px red";
  } else {
    selectId.style.boxShadow = "0 0 6px green"
    errorMsg.textContent = null;
  }
}

async function verifForm(e) {

  let errorMsgId = document.getElementById(`${e}ErrorMsg`);
  if (e == "email") {
    verifInputs(email, emailRegExp, errorMsgId);
    if (errorMsgId.textContent != "") {
      delete contact.email;
    } else {
      contact.email = email.value;
    }
  }
  else if (e == "address") {
    verifInputs(address, addressRegExp, errorMsgId);
    if (errorMsgId.textContent != "") {
      delete contact.address;
    } else {
      contact.address = address.value;
    }

  } else if (e == "firstName") {
    verifInputs(firstName, globalRegExp, errorMsgId);
    if (errorMsgId.textContent != "") {
      delete contact.firstName;
    } else {
      contact.firstName = firstName.value;
    }


  } else if (e == "lastName") {
    verifInputs(lastName, globalRegExp, errorMsgId);
    if (errorMsgId.textContent != "") {
      delete contact.lastName;
    } else {
      contact.lastName = lastName.value;
    }


  } else {
    verifInputs(city, globalRegExp, errorMsgId);
    if (errorMsgId.textContent != "") {
      delete contact.city;
    } else {
      contact.city = city.value;
    }
  }

}

// Fonction qui ajoute les produits au tableau

async function pushProducts() {
  for (let item of cart) {
    products.push(item.id);
  }
}

// Fonction qui envoie 'contact' et 'products' à l'API

async function sendData() {
  await fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ contact, products })
  })

    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (data) {
      location.href = "confirmation.html?" + `id=${data.orderId}`;
    });
}



let question = document.querySelectorAll(".cart__order__form__question > input");
for (let i = 0; i < question.length; i++) {
  question[i].addEventListener("click", function () {
    verifForm(question[i].id);
  })
  order.addEventListener("click", function (e) {
    e.preventDefault();
    verifForm(question[i].id);


  })
}
order.addEventListener("click", async function () {
  if (Object.keys(contact).length != 5) {
    alert("Coordonnées incorrectes");
  } else {
    if (cart) {
      await pushProducts();
      await sendData();
      localStorage.clear();
    } else {
      alert("Votre panier est vide");
    }
  }
})




























