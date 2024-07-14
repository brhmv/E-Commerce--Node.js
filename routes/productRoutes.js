const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const authenticateAccessToken = require('../middleware/authenticateAccessToken');
const isAdmin = require('../middleware/isAdmin');


router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).send(`Error fetching products: ${error.message}`);
    }
});


router.post('/create', authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const { name, description, price, stock, gallery } = req.body;

        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            gallery
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).send(`Error creating product: ${error.message}`);
    }
});

module.exports = router;
