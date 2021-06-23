const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/helpers');
const pool = require('../db');
const { route } = require('./users');
const mails = require('../lib/mail/mails');

/* to open windows */

router.get('/category/:Product_Category', async (req, res) => {
    const products = await pool.query('SELECT * FROM producto where Categoria = ? AND cantidad > 0', req.params.Product_Category);
    res.render('product/category', { products, user: req.session.user, titulo: 'WippoStore' });
});

router.get('/', async (req, res) => {
    var Buscar = req.query.search;
    var products;
    const query_busqueda = "SELECT * FROM producto WHERE Nombre LIKE" + "'%" + Buscar + "%' AND cantidad > 0";
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
    const products = await pool.query('SELECT * FROM producto WHERE ID_Producto = ? AND cantidad > 0', [idU]);
    res.render('product/pDetails', {
        products,
        user: req.session.user,
        titulo: 'WippoStore',
        message_er: req.flash('message_er'),
        success: req.flash('success')
    });
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
            console.log("Ha ocurrido un error al generar la Orden");
            console.log(error);
            req.flash("message_er", "Ha ocurrido un error al generar la Orden");
        }
    }).then(async value => {
        const resultado_query = await pool.query("select Correo_Electronico from Usuario where ID_Usuario = ? limit 1; ", { ID_Usuario })
        const { Correo_Electronico } = resultado_query[0];
        
        const resultado_query2 = await pool.query("select ID_Orden, Monto_Total from Orden where ID_Usuario = ? order by ID_Orden DESC limit 1; ", {ID_Usuario})
        const { ID_Orden } = resultado_query2[0];
        const { Monto_Total } = resultado_query2[0];
        mails.sendPurchase(ID_Orden, Monto_Total, Correo_Electronico);
        console.log('Compra realizada con exito');
        req.flash("success", "Compra Realizada");
    });
    res.redirect("/users/pedidosC");
});

router.post('/buynow', isLoggedIn, async (req, res) => {
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
    });
    console.log('Agregado al carrito');

    res.redirect('../users/shoppingDetails');

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

    // const products = await pool.query('SELECT * FROM producto WHERE ID_Producto = ?', [ID_Producto]);

    // res.render('product/pDetails', {
    //     products, user: req.session.user, titulo: 'WippoStore',
    //     message_er: req.flash('message_er'),
    //     success: req.flash('success')
    // });

    res.redirect(`/products/pDetails/${ID_Producto}`);
});


router.post('/remove', isLoggedIn, async (req, res) => {
    const ID_Usuario = req.session.user.id;
    const ID_Producto = req.body.id_producto;
    // const Cantidad = req.body.Cantidad;
    console.log("CALL `removeFromCart`(" + ID_Usuario + ", " + ID_Producto + ");")
    const result = await pool.query("CALL `removeFromCart`(?, ?);", [
        ID_Usuario,
        ID_Producto
    ]).catch(error => {
        console.log("Ocurrio un error al remover el producto:")
        console.log(error)
        req.flash("message_er", "Ocurrio un error al remover el producto");
    });
    console.log('Producto Correctamente elminado del carrito');
    req.flash("success", "Producto Correctamente elminado del carrito");

    res.redirect(`/users/shoppingCartC/`);
});

module.exports = router;