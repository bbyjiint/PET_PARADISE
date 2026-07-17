const express = require('express');
const app = express();

const productRoutes = require('./routes/product');
const inventoryRoutes = require('./routes/inventory');
const pageRoutes = require('./routes/pages');

app.use(express.json()); //อ่านข้อมูลแบบ JSON จาก request body
app.use(express.urlencoded({ extended: true }));//อ่านข้อมูลแบบ form (ชื่อ=ค่า) จาก request body ใช้เมื่อส่ง form ปกติ เช่น <form> หรือ FormData ที่ไม่ใช่ JSON

app.use(express.static('public'));
app.use(express.static('public/view/html'));

// เสิร์ฟรูปจากโฟลเดอร์ IMG 
app.use('/imgs', express.static('C:/Users/suthi/OneDrive/Desktop/IMG'));

app.use('/product', productRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/', pageRoutes);

// start the server
app.listen(3002, function () {
    console.log('Server is running on port 3002');
});
