const express = require('express');
const router = express.Router();

const pool = require('../db');

/* to open windows */
router.get('/category', async(req, res) => {
    const products = await pool.query('SELECT * FROM producto');
    res.render('product/category', { products, nombre: req.session.username, titulo: 'WippoStore' });
});

router.get('/pDetails/:id', async(req, res) => {
    const idU = req.params.id;
    const products = await pool.query('SELECT * FROM producto WHERE ID_Producto = ?', [idU]);
    res.render('product/pDetails', { products, nombre: req.session.username, titulo: 'WippoStore' });
});

module.exports = router;