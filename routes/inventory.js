const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer'); // multer for image upload
const path = require('path');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '12345',
    database: 'pet_paradise'
});

// local img file
const IMGFOLDER_PATH = 'C:/Users/suthi/OneDrive/Desktop/IMG';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, IMGFOLDER_PATH);
    },
    filename: function (req, file, cb) {
        // หั่นชื่อไฟล์ด้วย '.' แล้วดึงคำสุดท้ายออกมา จะได้นามสกุลไฟล์ 
        const fileExtension = file.originalname.split('.').pop(); 
        
        // ผลลัพธ์: ตัวเลขเวลา . นามสกุล (เช่น 1711958400000.png) 
        cb(null, Date.now() + '.' + fileExtension);
    }
    
});
const upload = multer({ storage: storage }); // เซฟไฟล์รูปภาพที่ local

// list all products
router.get('/', (req, res) => {
    db.query(
        'SELECT * FROM product',
        (err, rows) => {
            if (err)
                return res.send('Failed to load products');
            res.json(rows);
        }
    );
});

// สร้างสินค้า 
router.post('/', upload.single('image'), (req, res) => {
    let { name, animal, type, price, stock, description } = req.body;

    let imagePath = null;
    if (req.file) {
        imagePath = '/imgs/' + req.file.filename;
    }

    const sql = 'INSERT INTO product (name, animal, type, price, stock, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [name, animal, type, price, stock, description, imagePath];

    db.query(sql, values, 
        (err,result) => { // DB ส่งผลลัพธ์มาที่ result 
        if (err) {
            return res.send('Failed to add product');
        }
        res.send('Product added'); // เอา result ส่งต่อให้ frontend
    });
});

// แก้ไขสินค้า
router.post('/:id', upload.single('image'), (req, res) => {
    const productId = req.params.id;
    let { name, animal, type, price, stock, description } = req.body;

    let sql = '';
    let values = [];

    if (req.file) {
        const imagePath = '/imgs/' + req.file.filename;
        sql = 'UPDATE product SET name=?, animal=?, type=?, price=?, stock=?, description=?, image=? WHERE idproduct=?';
        values = [name, animal, type, price, stock, description, imagePath, productId];
    } else {
        sql = 'UPDATE product SET name=?, animal=?, type=?, price=?, stock=?, description=? WHERE idproduct=?';
        values = [name, animal, type, price, stock, description, productId];
    }

    db.query(sql, values, (err) => {
        if (err)
            return res.send('Failed to load products');
        res.send('Product updated');
    });
});

// ลบสินค้า
router.delete('/:id', (req, res) => {
    const productId = req.params.id;

    db.query('DELETE FROM product WHERE idproduct = ?', 
        [productId], 
        (err, result) => { // DB ส่งผลลัพธ์มาที่ result 
        if (err)
            return res.send('Failed to load products');
        res.send('Product deleted'); // เอา result ส่งต่อให้ frontend
    });
});

module.exports = router;

/*
โค้ดเก่า (blob in DB + memoryStorage)

const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer'); // multer for image upload

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '12345',
    database: 'pet_paradise'
});

// keep the uploaded img in memory so it can be stored in the database
const upload = multer({ storage: multer.memoryStorage() });

// list all products (use in Inventory.html)
router.get('/', (req, res) => {
    db.query('SELECT idproduct, name, animal, type, price, stock, description FROM product',
        (err, rows) => {
            if (err)
                return res.send('Failed to load products');
            res.json(rows);
        });
});

// add product (use in Inventory.html)
router.post('/', upload.single('image'), (req, res) => {
    let { name, animal, type, price, stock, description } = req.body;

    let image = null;
    let imageType = null;

    if (req.file) {
        image = req.file.buffer;
        imageType = req.file.mimetype;
    }

    const sql = 'INSERT INTO product (name, animal, type, price, stock, description, image, image_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [name, animal, type, price, stock, description, image, imageType];

    db.query(sql, values,
        (err, result) => {
            if (err)
                return res.send('Failed to load products');
            res.send('Product added')
        })
})

// get product image (use in Inventory.html + ShopPage.html)
router.get('/image/:id', (req, res) => {
    const productId = req.params.id;

    db.query('SELECT image, image_type FROM product WHERE idproduct = ?',
        [productId],
        (err, rows) => {
            if (err) {
                return res.send("Fail to get image");
            }
            if (rows.length === 0) {
                return res.send("Not found");
            }

            const imageData = rows[0].image;
            const imageType = rows[0].image_type;

            res.set('Content-Type', imageType);
            res.send(imageData);
        });
})

// update product (use in Inventory.html)
router.post('/:id', upload.single('image'), (req, res) => {
    const productId = req.params.id;

    let name = req.body.name;
    let animal = req.body.animal;
    let type = req.body.type;
    let price = req.body.price;
    let stock = req.body.stock;
    let description = req.body.description;
    let sql = '';
    let values = [];

    if (req.file) {
        const image = req.file.buffer;
        const imageType = req.file.mimetype;

        sql = 'UPDATE product SET name=?, animal=?, type=?, price=?, stock=?, description=?, image=?, image_type=? WHERE idproduct=?';
        values = [name, animal, type, price, stock, description, image, imageType, productId];
    } else {
        sql = 'UPDATE product SET name=?, animal=?, type=?, price=?, stock=?, description=? WHERE idproduct=?';
        values = [name, animal, type, price, stock, description, productId];
    }

    db.query(sql, values,
        (err, result) => {
            if (err)
                return res.send('Failed to load products');
            res.send('Product updated');
        });
})

// delete product (use in Inventory.html)
router.delete('/:id', (req, res) => {
    const productId = req.params.id;

    db.query('DELETE FROM product WHERE idproduct = ?',
        [productId],
        (err, result) => {
            if (err)
                return res.send('Failed to load products');
            res.send('Product deleted');
        });
})

module.exports = router;

*/
