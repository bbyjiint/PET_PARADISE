var express = require('express');
var app = express();

var productRoutes = require('./routes/product');
var inventoryRoutes = require('./routes/inventory');

app.use(express.json()); //อ่านข้อมูลแบบ JSON จาก request body
app.use(express.urlencoded({ extended: true }));//อ่านข้อมูลแบบ form (ชื่อ=ค่า) จาก request body ใช้เมื่อส่ง form ปกติ เช่น <form> หรือ FormData ที่ไม่ใช่ JSON

app.use(express.static('public'));
app.use(express.static('public/view/html'));


app.use('/product', productRoutes);
app.use('/inventory', inventoryRoutes);

// start the server
app.listen(3000, function () {
    console.log('Server is running on port 3000');
});
