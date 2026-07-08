function loadShop(page) {

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
            var html = '<div class="productCard">';
            for (var i = 0; i < products.length; i++) {
                var p = products[i];
                html += '<article class="productCardInfo">' +
                    '<img src="/inventory/image/' + p.idproduct + '" alt="' + p.name + '">' +
                    '<h3>' + p.name + '</h3>' +
                    '<p class="productType">' + p.type + '</p>' +
                    '<p class="productPrice">฿' + p.price + '</p>' +
                    '<p class="productStock">Stock: ' + p.stock + '</p>' +
                    '<p class="productDescription">' + p.description + '</p>' +
                    '</article>';
            }
            html += '</div>';
            document.getElementById('mainContent').innerHTML = html;
        })
        .catch(function () {
            document.getElementById('mainContent').innerHTML = '<p class="shopError">Could not load products.</p>';
        });
}

loadShop(getCurrentPage());
