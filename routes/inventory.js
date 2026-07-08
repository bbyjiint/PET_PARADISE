const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer'); // multer for image upload

// connect to the database
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '12345',
    database: 'pet_paradise'
});

// keep the uploaded img in memory so it can be stored in the database
const upload = multer({storage: multer.memoryStorage()});

// LIST all products in the database
router.get('/', (req, res) => {
    db.query('SELECT idproduct, name, animal, type, price, stock, description FROM product', (err, rows) => {
        if (err)
            return res.status(500).send(err.message)
        res.json(rows);
    });
});

// add product to the database
router.post('/', upload.single('image'), (req, res) => {
    // let name = req.body.name;
    // let animal = req.body.animal;
    // let type = req.body.type;
    // let price = req.body.price;
    // let stock = req.body.stock;
    // let description = req.body.description;
    let (name, animal, type, price, stock, description) = req.body;

    // ตั้งค่าเริ่มต้น ถ้าไม่มีรูปให้เป็น null
    let image = null;
    let imageType = null;

    // ถ้า user อัปโหลดรูปมา ให้เอาข้อมูลรูปมาเก็บ
    if (req.file) {
        image = req.file.buffer;
        imageType = req.file.mimetype;
    }

    const sql = 'INSERT INTO product (name, animal, type, price, stock, description, image, image_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [name, animal, type, price, stock, description, image, imageType];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).send(err.message)
        res.send('Product added')
    })
})

// get the image of a product
router.get('/image/:id', (req, res) => {
    const productId = req.params.id;

    db.query('SELECT image, image_type FROM product WHERE idproduct = ?', [productId], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        // ถ้าไม่เจอสินค้า
        if (rows.length === 0) {
            return res.status(404).send('Not found');
        }

        const imageData = rows[0].image;
        const imageType = rows[0].image_type;

        res.set('Content-Type', imageType);
        res.send(imageData);
    });
})

// get all types of products
router.get('/types/:animal', (req, res) => {
    const animal = req.params.animal;

    db.query('SELECT DISTINCT type FROM product WHERE animal = ?', [animal], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        // เอาแค่ชื่อ type ออกมาเป็น array
        const types = [];
        for (let i = 0; i < rows.length; i++) {
            types.push(rows[i].type);
        }

        res.json(types);
    });
})

// update product in the database
router.put('/:id', upload.single('image'), (req, res) => {
    const productId = req.params.id;

    let name = req.body.name;
    let animal = req.body.animal;
    let type = req.body.type;
    let price = req.body.price;
    let stock = req.body.stock;
    let description = req.body.description;
    let sql = '';
    let values = [];

    // ถ้ามีรูปใหม่ ให้อัปเดตรูปด้วย
    if (req.file) {
        const image = req.file.buffer;
        const imageType = req.file.mimetype;

        sql = 'UPDATE product SET name=?, animal=?, type=?, price=?, stock=?, description=?, image=?, image_type=? WHERE idproduct=?';
        values = [name, animal, type, price, stock, description, image, imageType, productId];
    } else {
        // ถ้าไม่มีรูปใหม่ อัปเดตแค่ข้อมูล text
        sql = 'UPDATE product SET name=?, animal=?, type=?, price=?, stock=?, description=? WHERE idproduct=?';
        values = [name, animal, type, price, stock, description, productId];
    }

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.send('Product updated');
    });
})

// delete product from the database
router.delete('/:id', (req, res) => {
    const productId = req.params.id;

    db.query('DELETE FROM product WHERE idproduct = ?', [productId], (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.send('Product deleted');
    });
})

module.exports = router;
