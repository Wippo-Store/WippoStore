const express = require('express');
const router = express.Router();

const pool = require('../db');

/* to open windows */
router.get('/category', async(req, res) => {
    const products = await pool.query('SELECT * FROM producto');
    console.log(products);
    res.render('product/category', { products });
});

router.get('/pDetails/:id', async(req, res) => {
    const idU = req.params.id;
    const products = await pool.query('SELECT * FROM producto WHERE ID_Producto = ?', [idU]);
    res.render('product/pDetails', { products });
});

// we should use the post to get id_product from request (req)
// app.post('/pDetails', function (req, res) {
//     var message = req.product;
//     res.render('product/pDetails');
// });

/* */
router.get('/', async(req, res) => {
    const products = await pool.query('SELECT * FROM producto');
    console.log(products);
    res.render('/product/allProduct', { products });
});

module.exports = router;