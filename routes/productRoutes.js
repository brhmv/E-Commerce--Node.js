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

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.json(product);
    } catch (error) {
        res.status(500).send(`Error fetching product: ${error.message}`);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, gallery, category } = req.body;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.gallery = gallery || product.gallery;
        product.category = category || product.category;
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).send(`Error updating product: ${error.message}`);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.send('Product deleted');
    } catch (error) {
        res.status(500).send(`Error deleting product: ${error.message}`);
    }
});

module.exports = router;