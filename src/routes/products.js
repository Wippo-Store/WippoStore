const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/helpers');
const pool = require('../db');

/* to open windows */

router.get('/category/:Product_Category', async (req, res) => {
    const products = await pool.query('SELECT * FROM producto where Categoria = ?', req.params.Product_Category);
    res.render('product/category', { products, user: req.session.user, titulo: 'WippoStore' });
});

router.get('/', async (req, res) => {
    var Buscar = req.query.search;
    var products;
    const query_busqueda = "SELECT * FROM producto WHERE Nombre LIKE" + "'%" + Buscar + "%'";
    if (req.query.search == '' || Buscar == undefined) {
        products = await pool.query('SELECT * FROM producto');
        console.log("Vacio");
    } else {
        products = await pool.query(query_busqueda);
        console.log("Buscar" + Buscar);
    }
    res.render('product/Productos', { products, user: req.session.user, titulo: 'WippoStore' });
});

router.get('/pDetails/:id', async (req, res) => {
    const idU = req.params.id;
    const products = await pool.query('SELECT * FROM producto WHERE ID_Producto = ?', [idU]);
    res.render('product/pDetails', { products, user: req.session.user, titulo: 'WippoStore' });
});

router.post('/updateCart', isLoggedIn, async (req, res) => {
    const ID_Usuario = req.session.user.id;
    const ID_Producto = req.body.ID_Producto;
    const Cantidad = req.body.cantidad;
    console.log("CALL `updateCart`(" + ID_Producto + ", " + ID_Usuario + ", " + Cantidad + ");")
    const result = await pool.query("CALL `updateCart`(?, ?, ?);", [
        ID_Producto,
        ID_Usuario,
        Cantidad
    ]).catch(error => {
        console.log("Articulo ya existe en carrito")
        req.flash("message_er", "Articulo ya existe en carrito");
    });
    res.redirect("/users/shoppingCartC");
})

router.post('/purchaseCart', isLoggedIn, async (req, res) => {


    const ID_Usuario = req.session.user.id;
    const ID_Direccion = req.body.ID_Direccion
    const ID_Tarjeta = req.body.ID_Tarjeta
    console.log("CALL `purchaseCart`(" + ID_Usuario + ", " + ID_Direccion + ", " + ID_Tarjeta + ");")
    const result = await pool.query("CALL `purchaseCart`(?,?,?);", [
        ID_Usuario,
        ID_Direccion,
        ID_Tarjeta
    ]).catch(error => {
        if (error) {
            console.log("Ha ocurrido un error al generar la Orden")
            console.log(error)
            req.flash("message_er", "Ha ocurrido un error al generar la Orden");
        } else {
            console.log('Compra realizada');
            req.flash("success", "Compra Realizada");
        }
    });
    res.redirect("/users/shoppingCartC");
});

router.post('/addtoCart', isLoggedIn, async (req, res) => {
    const ID_Usuario = req.session.user.id;
    const ID_Producto = req.body.ID_Producto;
    const Cantidad = req.body.Cantidad;
    console.log("CALL `addToCart`(" + ID_Producto + ", " + ID_Usuario + ", " + Cantidad + ");")
    const result = await pool.query("CALL `addToCart`(?, ?, ?);", [
        ID_Producto,
        ID_Usuario,
        Cantidad
    ]).catch(error => {
        console.log("Articulo ya existe en carrito")
        req.flash("message_er", "Articulo ya existe en carrito");
    });
    console.log('Agregado al carrito');
    req.flash("success", "Articulo agregado al carrito");
    res.redirect("/users/shoppingCartC");
});

module.exports = router;