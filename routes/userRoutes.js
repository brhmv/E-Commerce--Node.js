const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticateAccessToken = require('../middleware/authenticateAccessToken');
const isAdmin = require('../middleware/isAdmin');


router.get('/', authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send(`Error fetching users: ${error.message}`);
    }
});

module.exports = router;
