const express = require('express');
const router = express.Router();
const OrderItem = require('../models/orderItem');
const authenticateAccessToken = require('../middleware/authenticateAccessToken');
const isAdmin = require('../middleware/isAdmin');


router.get('/', authenticateAccessToken, async (req, res) => {
    try {
        const orders = await OrderItem.find().populate('product');
        res.json(orders);
    } catch (error) {
        res.status(500).send(`Error fetching orders: ${error.message}`);
    }
});


router.post('/create', authenticateAccessToken, async (req, res) => {
    try {
        const { product, quantity } = req.body;

        const newOrderItem = new OrderItem({
            product,
            quantity
        });

        await newOrderItem.save();
        res.status(201).json(newOrderItem);
    } catch (error) {
        res.status(500).send(`Error creating order: ${error.message}`);
    }
});

module.exports = router;
