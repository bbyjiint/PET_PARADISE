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

    // หาว่ามีสินค้านี้อยู่แล้วไหม
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            item = cart[i];
            break;
        }
    }

    if (item) {  // ถ้ามีแล้ว เพิ่มจำนวน 
        item.qty = item.qty + 1;
    } else { // ถ้ายังไม่มี เพิ่มสินค้าใหม่
        cart.push({ id: id, name: name, price: price, qty: 1, image: image  });
    }

    // บันทึกลง localStorage
    localStorage.setItem('myCart', JSON.stringify(cart));

    //  อัปเดตหน้าจอรถเข็น
    renderCart();
}
//truncate text
function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }

// render cart
function renderCart() {
    let cart = getCart();
    let cartItems = document.getElementById('cartItems');
    let cartTotal = document.getElementById('cartTotal');
    let total = 0;
    let html = '';


    // ถ้าไม่มีสินค้า แสดงข้อความว่าง
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>'; //inner html เพราะมี <>
        // cartItems.textContent= 'Your cart is empty';
        cartTotal.textContent = '฿0.00'; //text content เพราะว่าเขียนtextตรงๆได้เลย
        return;
    }

    // วนลูปสร้าง HTML แต่ละสินค้า
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let lineTotal = item.price * item.qty;
        total += lineTotal;

        let truncatedName = truncateText(item.name, 20);
        html += '<div class="cart-row">' +
            '<div class="cart-product">' +
            '<img src="' + item.image + '" alt="' + item.name + '">' +
            '<p class="cart-product-name">' + truncatedName + '</p>' +
            '</div>' +
            '<div class="cart-qty">' +
            '<button type="button" onclick="changeQty(' + item.id + ', -1)">-</button>' +
            '<span>' + item.qty + '</span>' +
            '<button type="button" onclick="changeQty(' + item.id + ', 1)">+</button>' +
            '</div>' +
            '<div class="cart-line-total">฿' + lineTotal.toFixed(2) + '</div>' +
            '</div>';
    }

    // แสดงผลลงหน้าจอ
    cartItems.innerHTML = html;
    cartTotal.textContent = '฿' + total.toFixed(2);
}




// // function to change quantity of product in cart
// function changeQty(id, delta) {
//     let cart = getCart();
//     let item = null;
//     let index = -1;

//     // หาสินค้าที่ต้องการเปลี่ยนจำนวน
//     for (let i = 0; i < cart.length; i++) {
//         if (cart[i].id === id) {
//             item = cart[i];
//             index = i;
//             break;
//         }
//     }

//     if (!item) {
//         return;
//     }

//     // เปลี่ยนจำนวน ถ้าเป็น 0 ให้ลบออก
//     item.qty += delta;

//     if (item.qty <= 0) {
//         cart.splice(index, 1);
//     }

//     // บันทึกลง localStorage
//     localStorage.setItem('myCart', JSON.stringify(cart));

//     // อัปเดตหน้าจอรถเข็น
//     renderCart();
// }

// เปิดหน้า shop  แสดงรถเข็นทันที
renderCart();



/*
===== โค้ดเวอร์ชันเก่า (ใช้ helper function) =====
// อ่านรายการสินค้าในรถเข็นจาก localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

// บันทึกรถเข็นลง localStorage แล้วอัปเดตหน้าจอรถเข็น
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// แปลงตัวเลขราคาให้เป็นรูปแบบ ฿xx.xx
function formatPrice(amount) {
    return '฿' + Number(amount).toFixed(2);
}

// เพิ่มสินค้าเข้ารถเข็น (ถ้ามีอยู่แล้วให้เพิ่มจำนวน)
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
        item.qty += 1;
    } else {
        cart.push({ id: id, name: name, price: price, qty: 1, image: image || '' });
    }

    saveCart(cart);
}

// เปลี่ยนจำนวนสินค้า (+/-) ถ้าจำนวนเป็น 0 ให้ลบออกจากรถเข็น
function changeQty(id, delta) {
    let cart = getCart();
    let item = null;
    let index = -1;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            item = cart[i];
            index = i;
            break;
        }
    }

    if (!item) {
        return;
    }

    item.qty += delta;

    if (item.qty <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
}

// แสดงรายการสินค้าในแผงรถเข็นด้านขวา และคำนวณราคารวมทั้งสิ้น
function renderCart() {
    let cart = getCart();
    let cartItems = document.getElementById('cartItems');
    let cartTotal = document.getElementById('cartTotal');
    let total = 0;
    let html = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        cartTotal.textContent = formatPrice(0);
        return;
    }

    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let lineTotal = item.price * item.qty;
        total += lineTotal;

        html += '<div class="cart-row">' +
            '<div class="cart-product">' +
            (item.image
                ? '<img src="' + item.image + '" alt="' + item.name + '">'
                : '<div class="cart-product-placeholder"></div>') +
            '<p class="cart-product-name">' + item.name + '</p>' +
            '</div>' +
            '<div class="cart-qty">' +
            '<button type="button" onclick="changeQty(' + item.id + ', -1)">-</button>' +
            '<span>' + item.qty + '</span>' +
            '<button type="button" onclick="changeQty(' + item.id + ', 1)">+</button>' +
            '</div>' +
            '<div class="cart-line-total">' + formatPrice(lineTotal) + '</div>' +
            '</div>';
    }

    cartItems.innerHTML = html;
    cartTotal.textContent = formatPrice(total);
}

// โหลดครั้งแรกเมื่อเปิดหน้า shop
renderCart();
*/
