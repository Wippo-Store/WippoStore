var express = require('express');
var router = express.Router();

const pool = require('../db');
const { isLoggedIn } = require('../lib/helpers');
const { isNotLoggedIn } = require('../lib/helpers');

/* GET users listing. BUYER USER */
router.get('/principalUU', isNotLoggedIn, async (req, res) => { /*UNREGISTERED USER*/
    const products = await pool.query('SELECT * FROM producto');
    res.render('principalUU', { titulo: 'WippoStore', products });
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
        show_adress,
        show_card,
        address_list,
        user: req.session.user,
        payments_list: payments_list,
        titulo: 'Mi perfil - WippoStore'
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
router.get('/shoppingCartC', isLoggedIn, (req, res) => {
    res.render('userC/shoppingCartC', { nombre: req.session.username });
});


router.get('/shoppingDetails', (req, res) => {
    var subtotal = 500;
    const iva = 0.16;
    var tax = subtotal * iva;
    var total = subtotal + tax;

    address_list = [
        { id: 0, name: "Casa", street: "Mar meditarraneo", number: "48", distrit: "Gustavo A. Madero", city: "Ciudad de Mexico", cp: 554001 },
        { id: 1, name: "Oficina", street: "Mar meditarraneo", number: "50", distrit: "Gustavo A. Madero", city: "Ciudad de Mexico", cp: 554001 }
    ]

    payments_list = [
        { id: 0, name: "Visa", type: "debito", last_numbers: "178" },
        { id: 1, name: "Mastercad", type: "debito", last_numbers: "178" }
    ]


    res.render('userC/shoppingDetails', {
        price: subtotal,
        tax: tax,
        total: total,
        addres_list: addess_list,
        payments_list: payments_list,
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