
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Model: database pet_paradise
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '12345',
    database: 'pet_paradise'
});

// GET /product/cat → ดึงสินค้า WHERE animal = 'cat'
router.get('/:product', function (req, res) {
    var product = req.params.product; // ค่าจาก URL เช่น cat, dog

    db.query(
        'SELECT idproduct, name, animal, type, price, stock, description FROM product WHERE animal = ?',
        [product],
        function (err, rows) {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.json(rows);
        }
    );
});

module.exports = router;
