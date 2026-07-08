// function getCurrentPage() {
//     if (location.pathname.toLowerCase().includes('inventory.html')) {
//         return 'inventory';
//     }
//     var pages = ['cat', 'dog', 'fish', 'bird'];
//     var page = 'cat';
//     var url = location.search;
//     for (var i = 0; i < pages.length; i++) {
//         if (url.indexOf('page=' + pages[i]) !== -1) {
//             page = pages[i];
//         }
//     }
//     return page;
// }


function getCurrentPage() {
    if (location.pathname.toLowerCase().includes('inventory.html')) {
        return 'inventory';
    }
    var params = new URLSearchParams(location.search);
    return params.get('page') || 'cat';
}

fetch('/model/json/header.json')
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        var currentPage = getCurrentPage();
        var titleText = data.titles[0].title;

        for (var i = 0; i < data.titles.length; i++) {
            if (currentPage === data.titles[i].page) {
                titleText = data.titles[i].title;
                break;
            }
        }

        document.getElementById('pageTitle').textContent = titleText;

        var links = '';
        for (var i = 0; i < data.nav.length; i++) {
            links = links + '<a href="' + data.nav[i].href + '">' + data.nav[i].label + '</a>';
        }
        document.getElementById('nav').innerHTML = links;
    });
// เมื่อวาน: มีแค่ header.js + ShopPage.html
// fetch('/model/json/header.json')
// .then(function (res) {
//     return res.json();
// })
// .then(function (data) {
//     var currentPage = data.titles[0].page;
//     var titleText = data.titles[0].title;

//     for (var i = 0; i < data.titles.length; i++) {
//         if (currentPage === data.titles[i].page) {
//             titleText = data.titles[i].title;
//             break;
//         }
//     }

//     document.getElementById('pageTitle').textContent = titleText;

//     var links = '';
//     for (var i = 0; i < data.nav.length; i++) {
//         links = links + '<a href="' + data.nav[i].href + '">' + data.nav[i].label + '</a>';
//     }
//     document.getElementById('nav').innerHTML = links;
// });
