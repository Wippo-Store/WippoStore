const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/helpers');
const pool = require('../db');

/* to open windows */
router.get('/category/:Product_Category', async (req, res) => {
    const products = await pool.query('SELECT * FROM producto where Categoria = ?', req.params.Product_Category);
    res.render('product/category', { products, user: req.session.user, titulo: 'WippoStore' });
});

router.get('/pDetails/:id', async (req, res) => {
    const idU = req.params.id;
    const products = await pool.query('SELECT * FROM producto WHERE ID_Producto = ?', [idU]);
    res.render('product/pDetails', { products, user: req.session.user, titulo: 'WippoStore' });
});

router.post('/addtoCart', isLoggedIn, async (req, res) => {
    const ID_Usuario = req.session.user.id;
    const ID_Producto = req.body.ID_Producto;
    const Cantidad = req.body.Cantidad;
    console.log("CALL `addToCart`(" + ID_Producto +", " + ID_Usuario +", " + Cantidad +");")
    const result = await pool.query("CALL `addToCart`(?, ?, ?);", [
        ID_Producto,
        ID_Usuario,
        Cantidad
    ]);
    console.log('Agredado al carrito');
    res.redirect("/users/shoppingCartC");
});

module.exports = router;