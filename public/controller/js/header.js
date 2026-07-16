function getCurrentPage() {
    let pages = location.pathname.split('/');

    if (pages[1] === 'admin') {
        return 'inventory';
    }

    return pages[2];
}

fetch('/model/json/header.json')
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        let currentPage = getCurrentPage();
        let titleText = data.titles[0].title;

        for (let i = 0; i < data.titles.length; i++) {
            if (currentPage === data.titles[i].page) {
                titleText = data.titles[i].title;
                break;
            }
        }

        document.getElementById('pageTitle').textContent = titleText;

        let links = '';
        for (let i = 0; i < data.nav.length; i++) {
            links = links + '<a href="' + data.nav[i].href + '">' + data.nav[i].label + '</a>';
        }
        document.getElementById('nav').innerHTML = links;
    });
