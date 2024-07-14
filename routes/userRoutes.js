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

router.get('/:id', authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        res.status(500).send(`Error fetching user: ${error.message}`);
    }
});

router.put('/:id', authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.passwordHash = await bcrypt.hash(password, 10);
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).send(`Error updating user: ${error.message}`);
    }
});

router.delete('/:id', authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send('User deleted');
    } catch (error) {
        res.status(500).send(`Error deleting user: ${error.message}`);
    }
});

module.exports = router;
