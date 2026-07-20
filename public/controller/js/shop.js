let currentProductList = [];

// ย่อข้อความ 
function shortText(text, max) {
    if (!text) return "";
    if (text.length > max) return text.slice(0, max) + "...";
    return text;
}

// 1. โหลดข้อมูล
function loadShop(page) {
    fetch('/product/' + page)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Failed to load products');
            }
            return response.json();
        })
        .then((productData) => {
            renderCard(productData, page);
        })
}

// 2. render การ์ด
function renderCard(productsData, page) {
    currentProductList = productsData;

    if (productsData.length === 0) {
        document.getElementById('mainContent').innerHTML = '<p class="shopNothing">No products for ' + page + '</p>';
        return;
    }
    let html = '<section class="products">';
    for (let i = 0; i < currentProductList.length; i++) {
        let p = currentProductList[i];


        html =
            html +
            '<article class="cardProduct">' +
            '<div class="card-img" onclick="openModal(' + p.idproduct + ')" >' + // open modal
            '<img src="' + p.image + '" alt="' + p.name + '">' +
            '<div class="middle"><div>more details</div></div>' +
            '</div>' +  
            '<div class="card-info">' +
            '<h3>' + shortText(p.name, 30) + '</h3>' +
            '<p>' + shortText(p.description, 50) + '</p>' +  
            '<div class="card-bottom">' +
            '<span class="price">฿' + p.price + '</span>' +
            // '<button class="add-btn" type="button" onclick="addToCart(' + p.idproduct + ', \'' + p.name + '\', ' + p.price + ', \'' + p.image + '\')">add to card  </button>' +
            // '<i class="fa-solid fa-cart-plus"></i> Add to Cart' +
            // '</button>' +
            '<button class="add-btn" type="button" onclick="addToCart(' + p.idproduct + ')">add to card  </button>' +     
            '</div>' +
            '</div>' +
            '</article>';
    }
    html = html + '</section>';
    document.getElementById('mainContent').innerHTML = html;
}

// 3. เปิดดู Description
function openModal(id) {
    let p = null;
    for (let i = 0; i < currentProductList.length; i++) {
        if (currentProductList[i].idproduct === id) {
            p = currentProductList[i];
            break;
        }
    }
    if (!p) return;

    document.getElementById('modalBox').innerHTML =
        '<button class="modal-close" onclick="closeModal()">✕</button>' +
        '<img class="modal-img" src="' + p.image + '" alt="' + p.name + '">' +
        '<div class="modal-body">' +
        '<span class="modal-type">' + p.type + '</span>' +
        '<h2 class="modal-name">' + p.name + '</h2>' +
        '<p class="modal-price">฿' + p.price + '</p>' +
        '<p class="modal-stock">Stock: ' + p.stock + ' items</p>' +
        '<p class="modal-desc">' + p.description + '</p>' +
        '</div>';

    document.getElementById('modal').classList.add('open'); //
    document.body.style.overflow = 'hidden'; //ล้อคพื้นหลัง
}

function closeModal() {
    document.getElementById('modal').classList.remove('open');
    document.body.style.overflow = '';
}

// // document.getElementById('modal').addEventListener('click', function (e) {
// //     if (e.target === this) {
// //         closeModal();
// //     }
// });


loadShop(getCurrentPage());
