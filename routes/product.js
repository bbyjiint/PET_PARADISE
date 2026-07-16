
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '12345',
    database: 'pet_paradise'
});

// ดึงสินค้าตามสัตว์ เช่น /product/cat (use in ShopPage.html)
router.get('/:product', function (req, res) {
    let product = req.params.product;
    console.log(product);
    db.query(
        'SELECT * FROM product WHERE animal = ?',
        [product], // ส่ง "cat" ไปให้ DB เพื่อดึงข้อมูลสินค้าของสัตว์ชนิด cat
        function (err, rows) { // DB ส่งผลลัพธ์มาที่ rows 
            if (err) {
                return res.send('SERVER_ERROR: Failed to load product');
            }
            res.json(rows); // เอา rows ส่งต่อให้ frontend 
        }
    );
});

// เปลี่ยนราคา (use in ShopPage.html)
router.post('/updatePrice', function (req, res) {
    let {id,newPrice} = req.body;
    console.log('POST update price:', id, newPrice); // ดูใน terminal ที่รัน node

    db.query(
        'UPDATE product SET price = ? WHERE idproduct = ?',
        [newPrice, id],
        function (err, result) { // DB ส่งผลลัพธ์มาที่ result 
            if (err) {
                return res.status(500).send(err.message);
            }
            res.send('Price updated'); // เอา result ส่งต่อให้ frontend
        }
    );
});

module.exports = router;
