let params = new URLSearchParams(document.location.search);
let id = params.get("id");
let order = document.querySelector("#orderId");

order.textContent = id;