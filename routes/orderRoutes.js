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


router.put('/:id', authenticateAccessToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { product, quantity } = req.body;
        const orderItem = await OrderItem.findById(id);
        if (!orderItem) {
            return res.status(404).send('Order not found');
        }
        if (product) orderItem.product = product;
        if (quantity) orderItem.quantity = quantity;
        await orderItem.save();
        res.json(orderItem);
    } catch (error) {
        res.status(500).send(`Error updating order: ${error.message}`);
    }
});

router.delete('/:id', authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const orderItem = await OrderItem.findByIdAndDelete(id);
        if (!orderItem) {
            return res.status(404).send('Order not found');
        }
        res.send('Order deleted');
    } catch (error) {
        res.status(500).send(`Error deleting order: ${error.message}`);
    }
});

module.exports = router;
