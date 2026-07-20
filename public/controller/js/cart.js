// get cart from localStorage
function getCart() {
    let startCart = localStorage.getItem('myCart');
    let cart;

    if (startCart === null) {
        cart = [];
    } else {
        cart = JSON.parse(startCart);
    }

    return cart;
}

// function add product to cart
function addToCart(id) {
    let cart = getCart();
    let item = null;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            item = cart[i];
            break;
        }
    }

    if (item) {
        item.qty = item.qty + 1;
        localStorage.setItem('myCart', JSON.stringify(cart));
        renderCart();

    } else {
        fetch('/product/id/' + id)
            .then(function (response) {
                return response.json();
            })
            .then(function (productData) {
                let p = productData[0];

                cart.push({
                    id: p.idproduct,
                    name: p.name,
                    price: p.price,
                    qty: 1,
                    image: p.image
                });
                localStorage.setItem('myCart', JSON.stringify(cart));
                renderCart();
            });
    }
}

// render cart
function renderCart() {
    let cart = getCart();
    let cartItems = document.getElementById('cartItems');
    let cartTotal = document.getElementById('cartTotal');
    let total = 0;
    let html = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        cartTotal.textContent = '฿0.00';
        return;
    }

    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let lineTotal = item.price * item.qty;
        total = total + lineTotal;

        html += '<div class="cart-row">' +
            '<div class="cart-product">' +
            '<img src="' + item.image + '" alt="' + item.name + '">' +
            '<p class="cart-product-name">' + shortText(item.name, 30) + '</p>' +
            '</div>' +
            '<div class="cart-qty">' +
            '<button type="button" onclick="minusFood(' + i + ')">-</button>' +
            '<span>' + item.qty + '</span>' +
            '<button type="button" onclick="plusFood(' + i + ')">+</button>' +
            '</div>' +
            '<div class="cart-line-total">฿' + lineTotal.toFixed(2) + '</div>' +
            '</div>';
    }

        cartItems.innerHTML = html;
        cartTotal.textContent = '฿' + total.toFixed(2);
    }


    // function ปุ่ม + 
    function plusFood(i) {
        let cart = getCart();
        if (cart[i]) { 
            cart[i].qty = cart[i].qty + 1; 
        }
       
        localStorage.setItem('myCart', JSON.stringify(cart));
        renderCart();
    }

    // function ปุ่ม -
    function minusFood(i) {
        let cart = getCart();
        if (!cart[i]) 
            return;
        cart[i].qty = cart[i].qty - 1;
        
        if (cart[i].qty <= 0) { 
            cart.splice(i, 1); //ลบสินค้านั้นออกจากตะกร้าไปเลย 1 รายการ
        }
        localStorage.setItem('myCart', JSON.stringify(cart));
        renderCart();
    }


    renderCart();
