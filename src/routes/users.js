var express = require('express');
var router = express.Router();

const pool = require('../db');
const { getTax } = require('../lib/globals');
const { isLoggedIn } = require('../lib/helpers');
const { isNotLoggedIn } = require('../lib/helpers');

/* GET users listing. BUYER USER */
router.get('/principalUU', isNotLoggedIn, async(req, res) => { /*UNREGISTERED USER*/
    const products = await pool.query('SELECT * FROM producto WHERE cantidad > 0');
    res.render('principalUU', { titulo: 'WippoStore', user: req.params.user, products });
});

router.get('/principalC', isLoggedIn, async(req, res) => {
    const products = await pool.query('SELECT * FROM producto WHERE cantidad > 0');
    res.render('userC/principalC', {
        products,
        user: req.session.user,
        titulo: 'WippoStore',
        message_er: req.flash('message_er'),
        success: req.flash('success')
    });
});

router.get('/Historial_Pedidos', isLoggedIn, async(req, res) => {
    console.log(req.session.user.id);
    const pedidos = await pool.query('SELECT * FROM orden where ID_Usuario = ?', req.session.user.id);
    console.log(pedidos.length);
    res.render('userC/Historial', {
        pedidos,
        user: req.session.user,
        titulo: 'WippoStore',
        message_er: req.flash('message_er'),
        success: req.flash('success')
    });
});

router.get('/Historial_Pedidos/Detalle', isLoggedIn, async(req, res) => {
    console.log(req.query.transaccion);
    const Detalle_Orden = await pool.query('SELECT contiene.Cantidad, contiene.ID_Orden, producto.Nombre as Producto, producto.imagen1 as Imagen, producto.Precio, usuario.Nombre as NombreVendedor, usuario.Apellido_Paterno as ApellidoVendedor FROM contiene, producto,usuario where contiene.ID_Orden = ? and producto.ID_Producto = contiene.ID_Producto and usuario.ID_Usuario = contiene.ID_Usuario', req.query.transaccion);
    console.log(Detalle_Orden);
    res.render('userC/Historial_Detalle', {
        Detalle_Orden,
        user: req.session.user,
        titulo: 'WippoStore',
        message_er: req.flash('message_er'),
        success: req.flash('success')
    });
});

router.get('/profileC', isLoggedIn, async(req, res) => {
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

    console.log(address_list);

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

router.get('/editProfileC', isLoggedIn, async(req, res) => {
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

    res.render('userC/editProfileC', {
        nombre: req.session.username,
        message_er: req.flash('message_er'),
        success: req.flash('success'),
        user: req.session.user,
        titulo: 'Mi perfil - WippoStore',
        payments_list,
        show_adress,
        show_card,
        address_list,
    });
});

router.get('/addAddressC', isLoggedIn, (req, res) => {
    res.render('userC/addAddressC', { titulo: 'Agregar Dirección' });
});

router.get('/addAddressP', isLoggedIn, (req, res) => {
    res.render('userC/addAddressP', { titulo: 'Agregar Dirección' });
});

router.get('/addCardC', isLoggedIn, (req, res) => {
    res.render('userC/addCardC', {
        titulo: 'Agregar Tarjeta',
        message_er: req.flash('message_er'),
        success: req.flash('success')
    });
});

router.get('/addCardP', isLoggedIn, (req, res) => {
    res.render('userC/addCardP', {
        titulo: 'Agregar Tarjeta',
        message_er: req.flash('message_er'),
        success: req.flash('success')
    });
});

router.get('/shoppingCartC', isLoggedIn, async(req, res) => {
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
    var flag = false;

    if (carrito[0].length > 0) {
        flag = true;
    }

    res.render('userC/shoppingCartC', {
        carrito: carrito[0],
        user,
        total,
        subtotal,
        tax,
        message_er: req.flash('message_er'),
        success: req.flash('success'),
        flag
    });
});

router.get('/shoppingDetails', async(req, res) => {
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

    const prod = await pool.query('SELECT COUNT(*) AS n FROM carrito, carritocontiene WHERE carrito.ID_Usuario = ? AND carritocontiene.ID_Carrito = carrito.ID_Carrito;', [req.session.user.id]);
    if (prod[0].n < 1) {
        console.log(prod)
        console.log("no hay articulos en el carrito");
        req.flash('message_er', 'Error: Carrito vacío');
        res.redirect('./shoppingCartC');
    } else {
        const carrito = await pool.query("CALL `getCart`(?);", req.session.user.id);
        // console.log(carrito);
        var total = 0;
        const iva = getTax();
        carrito[0].forEach(producto => {
            total += producto.Precio * producto.Cantidad;
        });

        var subtotal = total / (iva + 1);
        var tax = total - subtotal;

        res.render('userC/shoppingDetails', {
            subtotal,
            total,
            tax,
            address_list,
            payments_list,
            show_adress,
            show_card,
            carrito: carrito[0],
            price: subtotal,
            user: req.session.user,
            nombre: req.session.username,
            titulo: 'Carrito - WippoStore',
            message_er: req.flash('message_er'),
            success: req.flash('success')
        });
    }
});


router.get('/pedidosC', isLoggedIn, async(req, res) => {
    var ID_Usuario = req.session.user.id;
    var limite = 10;
    console.log("CALL `getOrders`(" + ID_Usuario + ");")
    const orders_list = await pool.query("CALL `getOrders`(?,?);", [ID_Usuario, limite]);
    console.log(orders_list);
    user = req.session.user;
    var show_table = false;

    if (orders_list[0].length > 0) {
        show_table = true;
    }

    res.render('userC/pedidosC', {
        orders_list: orders_list[0],
        user,
        message_er: req.flash('message_er'),
        success: req.flash('success'),
        titulo: "Mis pedidos",
        limite,
        show_table,
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

router.post('/addAddress', isLoggedIn, async(req, res) => {
    const ID_Usuario = req.session.user.id
    const Nombre_Calle = req.body.street;
    const Num_ext = req.body.noext;
    const Num_int = req.body.noint;
    const Colonia = req.body.col;
    const Municipio = req.body.Municipio;
    const Estado = req.body.Estado;
    const CP = req.body.CP;

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

router.post('/addAddressP', isLoggedIn, async(req, res) => {
    const ID_Usuario = req.session.user.id
    const Nombre_Calle = req.body.street;
    const Num_ext = req.body.noext;
    const Num_int = req.body.noint;
    const Colonia = req.body.col;
    const Municipio = req.body.Municipio;
    const Estado = req.body.Estado;
    const CP = req.body.CP;

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
    res.redirect("./shoppingDetails");
});

router.post('/addPayment', isLoggedIn, async(req, res) => {
    const ID_Tarjeta = req.body.ID_Tarjeta;
    const Nom_Tarjeta = req.body.Nom_Tarjeta;
    const Mes = req.body.Mes;
    const Year = req.body.Year;
    const ID_Usuario = req.session.user.id;

    const cards = await pool.query('SELECT COUNT(*) AS n FROM Tarjeta_Registrada WHERE ID_Tarjeta = ? AND ID_Usuario = ?', [ID_Tarjeta, ID_Usuario]);
    if (cards[0].n > 0) {
        console.log("tarjeta ya existente");
        req.flash('message_er', 'Tarjeta repetida');
        res.redirect('./addCardC');
    } else {
        const result = await pool.query("insert into Tarjeta_Registrada (`ID_Tarjeta`,`Nom_Tarjeta`,`Mes`,`Year`,`ID_Usuario`) values(?,?,?,?,?);", [
            ID_Tarjeta,
            Nom_Tarjeta,
            Mes,
            Year,
            ID_Usuario
        ]);
        req.flash('success', 'Tarjeta registrada');
        res.redirect("./profileC");
    }
});

router.post('/addPaymentP', isLoggedIn, async(req, res) => {
    const ID_Tarjeta = req.body.ID_Tarjeta;
    const Nom_Tarjeta = req.body.Nom_Tarjeta;
    const Mes = req.body.Mes;
    const Year = req.body.Year;
    const ID_Usuario = req.session.user.id;

    const cards = await pool.query('SELECT COUNT(*) AS n FROM Tarjeta_Registrada WHERE ID_Tarjeta = ? AND ID_Usuario = ?', [ID_Tarjeta, ID_Usuario]);
    if (cards[0].n > 0) {
        console.log("tarjeta ya existente");
        req.flash('message_er', 'Tarejta repetida');
        res.redirect('./addCardP');
    } else {
        const result = await pool.query("insert into Tarjeta_Registrada (`ID_Tarjeta`,`Nom_Tarjeta`,`Mes`,`Year`,`ID_Usuario`) values(?,?,?,?,?);", [
            ID_Tarjeta,
            Nom_Tarjeta,
            Mes,
            Year,
            ID_Usuario
        ]);
        req.flash('success', 'Tarjeta registrada');
        res.redirect("./shoppingDetails");
    }
});

router.post('/profileC', isLoggedIn, async(req, res) => {
    if (req.body.ID_Direccion) {
        /* Eliminacion de la direccion seleccioonada*/
        console.log('Borra direccion');
        var ID_User = req.session.user.id;
        const query_delete_Address = 'Delete FROM direccion where ID_Direccion = ' + req.body.ID_Direccion + ' and ID_Usuario = ' + ID_User;
        console.log(req.body.ID_Direccion);
        console.log(ID_User);
        const query_delete = await pool.query(query_delete_Address);
        console.log(query_delete);
    } else if (req.body.ID_Tarjeta) {
        /* Eliminacion de la tarjeta*/
        var ID_User = req.session.user.id;
        const query_delete_Address = 'Delete FROM tarjeta_registrada where ID_Tarjeta = ' + req.body.ID_Tarjeta + ' and ID_Usuario = ' + ID_User;
        console.log(req.body.ID_Tarjeta);
        console.log(ID_User);
        const query_delete = await pool.query(query_delete_Address);
        console.log(query_delete);
        console.log('Borrar Tarjeta');
    } else {
        console.log('Problemas');
    }

    /*Responder con la misma interfaz*/
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

    console.log(address_list);

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

module.exports = router;