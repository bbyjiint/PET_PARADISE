function loadShop(page) {
    console.log(page);
    fetch('/product/' + page)
        .then(function (res) {
            if (!res.ok) {
                throw new Error('Failed to load products');
            }
            return res.json();
        })
        .then(function (products) {
            if (products.length === 0) {
                document.getElementById('mainContent').innerHTML = '<p class="shopNothing">No products for ' + page + '</p>';
                return;
            }

            // สร้างการ์ดสินค้าทีละชิ้น
            let html = '<div class="productCard">';
            for (let i = 0; i < products.length; i++) {
                let p = products[i];
                let truncatedName = truncateText(p.name, 20);
                // let truncatedDescription = truncateText(p.description, 20);
                html += '<article class="productCardInfo">' +
                    '<img src="' + p.image + '" alt="' + p.name + '">' +
                    '<h3>' + truncatedName + '</h3>' +
                    '<p class="productType">' + p.type + '</p>' +
                    '<p class="productPrice" id="price-' + p.idproduct + '">฿' + p.price + '</p>' +
                    '<p class="productStock">Stock: ' + p.stock + '</p>' +
                    '<p class="productDescription">' + p.description + '</p>' +
                    // '<input type="number" id="newPrice' + p.idproduct + '" min="0" value="' + p.price + '">' +
                    // '<button type="button" onclick="updatePrice(' + p.idproduct + ')">Submit</button>' +
                    '<button type="button" class="save-btn"  onclick="addToCart(' + p.idproduct + ', \'' + p.name.replace(/'/g, "\\'") + '\', ' + p.price + ', \'' + p.image + '\')"><i class="fa-solid fa-bag-shopping"></i> Add to cart</button>' +
                    '</article>';
            }
            html += '</div>';
            document.getElementById('mainContent').innerHTML = html;
        });
}


// // เปลี่ยนราคา
// function updatePrice(id) {
//     let newPrice = document.getElementById('newPrice' + id).value;
//     console.log('updatePrice:', id, newPrice);

//     fetch('/product/updatePrice', {
//         method: 'POST',
//         body: JSON.stringify({ id: id, newPrice: newPrice }),
//         headers: { 'Content-Type': 'application/json', },
//     })
//         .then(function (res) {
//             if (!res.ok) {
//                 throw new Error('Failed to update price');
//             }
//             return res.text();
//         })
//         .then(function () {
//             document.getElementById('price-' + id).textContent = '฿' + newPrice;
//             console.log('Price updated');
//         })
// }

// function updatePrice(id) {
//     let newPrice = document.getElementById('newPrice' + id).value;
//     // console.log('updatePrice:', id, newPrice);

//     fetch('/product/' + id + '/newPrice/' + newPrice, { method: 'POST' })
//         .then(function (res) {
//             if (!res.ok) {
//                 throw new Error('Failed to update price');
//             }
//             return res.text(); //
//         })
//         .then(function () {
//             document.getElementById('price-' + id).textContent = '฿' + newPrice;
//             console.log('Price updated');
//         })
// }

loadShop(getCurrentPage());

