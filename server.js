const crypto = require('crypto');
require('dotenv').config();
const { webcrypto } = require('node:crypto');
if (!globalThis.crypto) globalThis.crypto = webcrypto;
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // Để đọc dữ liệu JSON từ Postman

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Đã kết nối MongoDB thành công!'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Định nghĩa Schema Product
const productSchema = new mongoose.Schema({
    pid: { type: String, required: true, unique: true },
    pname: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
});
const Product = mongoose.model('Product', productSchema);

// 1. API Thêm sản phẩm (Create)
app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 2. API Lấy danh sách sản phẩm (Read)
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// 3. API Healthcheck (Yêu cầu Bước 9)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Product API is running' });
});

// Khởi chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy ở cổng ${PORT}`);
});