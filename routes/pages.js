const express = require('express');
const router = express.Router();

// เปิด /  ไปหน้าแมวที่หน้าร้าน
router.get('/', function (req, res) {
    res.redirect('/shop/cat');
});

// หน้าแอดมิน
router.get('/admin', function (req, res) {
    res.sendFile('Inventory.html', { root: 'public/view/html' });
});

// หน้าร้านตามสัตว์
router.get('/shop/:animal', function (req, res) {
    res.sendFile('ShopPage.html', { root: 'public/view/html' });
});

module.exports = router;
