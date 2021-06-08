const express = require('express');
const router = express.Router();

const pool = require('../db');

/* to open windows */
router.get('/category/:Product_Category', async(req, res) => {
    const products = await pool.query('SELECT * FROM producto where Categoria = ?', req.params.Product_Category);
    res.render('product/category', { products, user: req.session.user, titulo: 'WippoStore' });
});

router.get('/pDetails/:id', async(req, res) => {
    const idU = req.params.id;
    const products = await pool.query('SELECT * FROM producto WHERE ID_Producto = ?', [idU]);
    res.render('product/pDetails', { products, user: req.session.user, titulo: 'WippoStore' });
});

module.exports = router;