const express = require('express');
const router = express.Router();

const pool = require('../db');

/* to open windows */
router.get('/category', (req, res) => {
    res.render('product/category');
});

module.exports = router;