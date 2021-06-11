var express = require('express');
var router = express.Router();

const pool = require('../db');
const { getTax } = require('../lib/globals');
const { isLoggedIn } = require('../lib/helpers');
const { isNotLoggedIn } = require('../lib/helpers');

/* GET users listing. BUYER USER */
router.get('/principalUU', isNotLoggedIn, async (req, res) => { /*UNREGISTERED USER*/
    const products = await pool.query('SELECT * FROM producto');
    res.render('principalUU', { titulo: 'WippoStore', user: req.params.user, products });
});

router.get('/principalC', isLoggedIn, async (req, res) => {
    const products = await pool.query('SELECT * FROM producto');
    res.render('userC/principalC', {
        products,
        user: req.session.user,
        titulo: 'WippoStore',
        message_er: req.flash('message_er'),
        success: req.flash('success')
    });
});


router.post('/addAddress', isLoggedIn, async (req, res) => {
    const ID_Usuario = req.session.user.id
    const Nombre_Calle = req.body.street;
    const Num_ext = req.body.noext;
    const Num_int = req.body.noint;
    const Colonia = req.body.col;
    const Municipio = req.body.munalc;
    const Estado = req.body.state;
    const CP = req.body.cp;

    const result = await pool.query("insert into `direccion` (`ID_Direccion`,`ID_Usuario`,`Nombre_Calle`,`Num_ext`,`Num_int`,`Colonia`,`Municipio`,`Estado`,`CP`) values(NULL,?,?,?,?,?,?,?,?);", [
        ID_Usuario,
        Nombre_Calle,
        Num_ext,
        Num_int,
        Colonia,
        Municipio,
        Estado,
        CP
    ]);
    res.redirect("./profileC");
});

router.post('/addPayment', isLoggedIn, async (req, res) => {
    const No_Tarjeta = req.body.No_Tarjeta;
    const Mes = req.body.Mes;
    const Año = req.body.Año;
    const ID_Usuario = req.session.user.id;

    const result = await pool.query("insert into `tarjeta_registrada` (`No_Tarjeta`,`Mes`,`Año`,`ID_Usuario`) values(?,?,?,?);", [
        No_Tarjeta,
        Mes,
        Año,
        ID_Usuario
    ]);
    res.redirect("./profileC");
});

router.get('/profileC', isLoggedIn, async (req, res) => {
    const address_list = await pool.query(`SELECT * FROM Direccion where ID_Usuario = ${req.session.user.id}`);
    const payments_list = await pool.query(`SELECT * FROM Tarjeta_Registrada where ID_Usuario = ${req.session.user.id}`);

    let address = address_list.reduce((accum, row) => {
        let { ID_Usuario: id } = row;
        accum[id] = accum[id] || { id, total: 0 };
        accum[id].total++;
        return accum;
    }, {});

    let payments = payments_list.reduce((accum, row) => {
        let { ID_Usuario: id } = row;
        accum[id] = accum[id] || { id, total: 0 };
        accum[id].total++;
        return accum;
    }, {});

    let show_adress = Object.values(address) != 0;
    let show_card = Object.values(payments) != 0;
    res.render('userC/profileC', {
        titulo: 'Mi perfil - WippoStore',
        user: req.session.user,
        message_er: req.flash('message_er'),
        success: req.flash('success'),
        show_adress,
        show_card,
        address_list,
        payments_list: payments_list,
    });
});

router.get('/editProfileC', isLoggedIn, (req, res) => {
    res.render('userC/editProfileC', { nombre: req.session.username });
});
router.get('/addDirectionC', isLoggedIn, (req, res) => {
    res.render('userC/addDirectionC', { titulo: 'Agregar Dirección' });
});
router.get('/addCardC', isLoggedIn, (req, res) => {
    res.render('userC/addCardC', { titulo: 'Agregar Tarjeta' });
});
router.get('/shoppingCartC', isLoggedIn, async (req, res) => {
    var ID_Usuario = req.session.user.id;
    // console.log("CALL `getCart`(" + ID_Usuario + ");")
    const carrito = await pool.query("CALL `getCart`(?);", ID_Usuario);
    // console.log(carrito);
    var total = 0;
    const iva = getTax();
    carrito[0].forEach(producto => {
        total += producto.Precio * producto.Cantidad;
    });

    var subtotal = total / (iva + 1);
    var tax = total - subtotal;
    user = req.session.user;
    res.render('userC/shoppingCartC', { carrito: carrito[0], user, total, subtotal, tax });
});


router.get('/shoppingDetails', async (req, res) => {
    // var ID_Usuario = req.session.user.id;
    const carrito = await pool.query("CALL `getCart`(?);", req.session.user.id);
    // console.log(carrito);
    var total = 0;
    const iva = getTax();
    carrito[0].forEach(producto => {
        total += producto.Precio * producto.Cantidad;
    });

    var subtotal = total / (iva + 1);
    var tax = total - subtotal;

    address_list = [
        { id: 0, name: "Casa", street: "Mar meditarraneo", number: "48", distrit: "Gustavo A. Madero", city: "Ciudad de Mexico", cp: 554001 },
        { id: 1, name: "Oficina", street: "Mar meditarraneo", number: "50", distrit: "Gustavo A. Madero", city: "Ciudad de Mexico", cp: 554001 }
    ]

    payments_list = [
        { id: 0, name: "Visa", type: "debito", last_numbers: "178" },
        { id: 1, name: "Mastercad", type: "debito", last_numbers: "178" }
    ]


    res.render('userC/shoppingDetails', {
        subtotal,
        total,
        tax,
        carrito : carrito[0],
        price: subtotal,
        addres_list: address_list,
        payments_list: payments_list,
        user: req.session.user,
        nombre: req.session.username,
        titulo: 'Carrito - WippoStore'
    });
});


/* GET users listing. SELLER USER*/
router.get('/principalV', (req, res) => {
    user = {
        name: "Roy"
    };
    res.render('userV/principal', {
        user: user
    });
});

router.get('/profileV', (req, res) => {
    user = {
        name: "Roy"
    };
    res.render('userV/profile', {
        user: user
    });
});
module.exports = router;