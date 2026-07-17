// cart.js

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
function addToCart(id, name, price, image) {
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
    } else { 
        cart.push({ id: id, name: name, price: price, qty: 1, image: image });
    }

    localStorage.setItem('myCart', JSON.stringify(cart));
    renderCart();
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
        total += lineTotal;

        html += '<div class="cart-row">' +
            '<div class="cart-product">' +
            '<img src="' + item.image + '" alt="' + item.name + '">' +
            // ใช้คำสั่ง shortText จากไฟล์ shop.js ได้ทันทีถ้าวางลำดับสคริปต์ถูกต้อง
            '<p class="cart-product-name">' + shortText(item.name, 30) + '</p>' + 
            '</div>' +
            '<div class="cart-qty">' +
            '<button type="button" onclick="changeQty(' + item.id + ', -1)">-</button>' +
            '<span>' + item.qty + '</span>' +
            '<button type="button" onclick="changeQty(' + item.id + ', 1)">+</button>' +
            '</div>' +
            '<div class="cart-line-total">฿' + lineTotal.toFixed(2) + '</div>' +
            '</div>';
    }

    cartItems.innerHTML = html;
    cartTotal.textContent = '฿' + total.toFixed(2);
}

// function ปุ่ม + -
function changeQty(id, amount) {
    let cart = getCart();

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].qty = cart[i].qty + amount;

            if (cart[i].qty <= 0) {
                cart.splice(i, 1); 
            }
            break; 
        }
    }

    localStorage.setItem('myCart', JSON.stringify(cart));
    renderCart();
}

// รันหน้าจอรถเข็นทันทีเมื่อโหลดหน้าเว็บ
renderCart();
