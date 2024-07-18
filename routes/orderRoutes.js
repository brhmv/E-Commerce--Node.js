const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const authenticateAccessToken = require('../middleware/authenticateAccessToken');
const isAdmin = require('../middleware/isAdmin');

// Get
router.get('/', authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().populate('products').populate('owner');
        res.json(orders);
    } catch (error) {
        res.status(500).send(`Error fetching orders: ${error.message}`);
    }
});

// Create
router.post('/create', authenticateAccessToken, async (req, res) => {
    try {
        const { products } = req.body;
        const userId = req.user.id;

        const newOrder = new Order({
            products,
            owner: userId,
            status: 'Pending'
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).send(`Error creating order: ${error.message}`);
    }
});

// Update
router.put('/:id', authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { products, status } = req.body;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).send('Order not found');
        }
        if (products) order.products = products;
        if (status) order.status = status;
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).send(`Error updating order: ${error.message}`);
    }
});

// Delete
router.delete('/:id', authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            return res.status(404).send('Order not found');
        }
        res.send('Order deleted');
    } catch (error) {
        res.status(500).send(`Error deleting order: ${error.message}`);
    }
});

module.exports = router;
