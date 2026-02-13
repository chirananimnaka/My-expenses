const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth'); // Placeholder for now

// Get all expenses for user
router.get('/', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Add new expense
router.post('/', auth, async (req, res) => {
    try {
        const { date, description, amount, category } = req.body;
        const newExpense = new Expense({
            user: req.user.id,
            date,
            description,
            amount,
            category
        });
        const savedExpense = await newExpense.save();
        res.json(savedExpense);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ msg: 'Expense not found' });
        if (expense.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

        await expense.remove();
        res.json({ msg: 'Expense removed' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
