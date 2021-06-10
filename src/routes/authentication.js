const express = require('express');
const router = express.Router();
const pool = require('../db');
const querystring = require('querystring');
/*library passport*/
const passport = require('passport');
const { isNotLoggedIn } = require('../lib/helpers');
const mails = require('../lib/mail/mails');

/* to open windows */
router.get('/loginU', isNotLoggedIn, (req, res) => {
    res.render('login/loginU', {
        titulo: 'InicioSesion',
        message_er: req.flash('message_er'),
        success: req.flash('success')
    });
});

router.get('/loginV', isNotLoggedIn, (req, res) => {
    res.render('login/loginV', { titulo: 'InicioSesionVendedor' });
});

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.get('/signOption', isNotLoggedIn, (req, res) => {
    res.render('login/signOption', { titulo: 'Registro Usuario' });
});

router.get('/signupC', isNotLoggedIn, (req, res) => {
    res.render('login/signupC', {
        titulo: 'Registro UsuarioComprador',
        message_er: req.flash('message_er'),
        success: req.flash('success')
    });

});

router.get('/signupV', isNotLoggedIn, (req, res) => {
    res.render('login/signupV', { titulo: 'Registro UsuarioVendedor' });
});

router.get('/recoverC', isNotLoggedIn, (req, res) => {
    res.render('login/recoverC', { titulo: 'Recuperar Contraseña' });
});

router.get('/send', (req, res) => {
    token = 'wippo_token_' + Math.random().toString(36).substr(2, 9);
    const { ID_Usuario } = req.query;
    const { Correo_Electronico } = req.query;
    link = "http://" + req.get('Host') + "/authentication/verify?token=" + token + "&ID_Usuario=" + ID_Usuario;
    console.log("Sending email:");
    mails.sendValidation(link, Correo_Electronico);
    pool.query("CALL `addToken`(?, ?);", [token, ID_Usuario], (err, res) => {
        if (err) throw err;
        else {
            console.log('Last insert ID:', res.insertId);
            console.log("token addded");
        }
    });
    res.redirect("/");
})

router.get('/verify', function (req, res) {
    Host = "localhost:3000";
    console.log(req.protocol + ":/" + req.get('Host'));
    const { token } = req.query;
    // console.log("token:" + token);
    const { ID_Usuario } = req.query;
    // console.log("ID_Usuario:" + ID_Usuario);
    if ((req.protocol + "://" + req.get('Host')) == ("http://" + Host)) {
        console.log("Domain is matched. Information is from Authentic email");
        // console.log("Generating query: CALL `validateToken`(?, ?);" + [token, ID_Usuario]);

        pool.query("CALL `validateToken`(?, ?);", [token, ID_Usuario], (err) => {
            if (err) {
                console.log("email is not verified");
                res.end("<h1>Bad Request</h1>");
                throw err;
            } else {
                console.log("email is verified");
                // res.send("<h1>Email is been Successfully verified");
                req.flash('sucess', 'El correo ha sido verificado exitosamente');
                res.redirect('/')
            }
        });
    } else
        res.end(`<h1>Request is from unknown source: ${req.protocol}://${req.get('Host')} == http://${Host}}`);

});

router.post('/loginU', (req, res, next) => {
    passport.authenticate('local.loginU', {
        successRedirect: '../users/principalC',
        failureRedirect: './loginU',
        failureFlash: true
    })(req, res, next);
});

router.post('/signupC', isNotLoggedIn, async(req, res) => {
    const { Correo_Electronico } = req.body;
    const { Contraseña } = req.body;
    const { Nombre } = req.body;
    const { Apellido_Paterno } = req.body;
    const { Apellido_Materno } = req.body;
    const { Nombre_Calle } = req.body;
    const { Num_ext } = req.body;
    const { Num_int } = req.body;
    const { Colonia } = req.body;
    const { CP } = req.body;
    const { Municipio } = req.body;
    const { Estado } = req.body;
    const RFC = null;
    const Tipo_Usuario = 'C';

    const newUserC = {
        Nombre,
        Apellido_Paterno,
        Apellido_Materno,
        Correo_Electronico,
        Contraseña,
        RFC,
        Tipo_Usuario
    };

    /*Verificamos que no se repita el correo */
    const email = await pool.query('SELECT COUNT(*) AS n FROM Usuario WHERE Correo_Electronico = ? ', [Correo_Electronico]);
    console.log(email[0].n);
    if (email[0].n > 0) {
        console.log("usuario ya existente");
        req.flash('message_er', 'Usuario ya existente');
        res.redirect('./signupC');
    } else {
        const result = await pool.query('INSERT INTO Usuario SET ?', [newUserC]);
        /*console.log(result);*/
        const ID_Usuario = result.insertId;
        const newDirectionC = {
            Nombre_Calle,
            Num_ext,
            Num_int,
            Colonia,
            CP,
            Municipio,
            Estado,
            ID_Usuario
        };
        const result1 = await pool.query('INSERT INTO Direccion SET ?', [newDirectionC]);
        /*console.log(result1);*/
        console.log('registro exitoso');
        req.flash('success', 'Registro exitoso');

        const query = querystring.stringify({
            'Correo_Electronico': Correo_Electronico,
            'ID_Usuario': ID_Usuario
        });
        res.redirect('./send?' + query);
    }
});

module.exports = router;