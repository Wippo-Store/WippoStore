const express = require('express');
const router = express.Router();
const pool = require('../db');

/*library passport*/
const passport = require('passport');
const { isNotLoggedIn } = require('../lib/helpers');
const mails = require('../lib/mail/mails');

/* to open windows */
router.get('/loginU', isNotLoggedIn, (req, res) => {
    res.render('login/loginU', { titulo: 'InicioSesion', message_er: req.flash('message_er'), success: req.flash('success') });
});

router.get('/loginV', isNotLoggedIn, (req, res) => {
    res.render('login/loginV', { titulo: 'InicioSesionVendedor' });
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

router.get('/signOption', isNotLoggedIn, (req, res) => {
    res.render('login/signOption', { titulo: 'Registro Usuario' });
});

router.get('/signupC', isNotLoggedIn, (req, res) => {
    res.render('login/signupC', { titulo: 'Registro UsuarioComprador' });
});

router.get('/signupV', isNotLoggedIn, (req, res) => {
    res.render('login/signupV', { titulo: 'Registro UsuarioVendedor' });
});

router.get('/recoverC', isNotLoggedIn, (req, res) => {
    res.render('login/recoverC', { titulo: 'Recuperar Contraseña' });
});

router.get('/send', (req, res) => {
    token = 'wippo_token_' + Math.random().toString(36).substr(2, 9);
    Host = req.get('Host');
    link = "http://" + req.get('Host') + "/verify?id=wippo-" + token;
    console.log("Sending email:")
    // mails.sendValidation(link, "rodrigo.rubio.haro.digital@gmail.com");

    // const { ID_Usuario } = req.body;
    const ID_Usuario = 2;
    pool.query("CALL `addToken`(?, ?);", [token, ID_Usuario], (err, res) => {
        if (err) throw err;
        console.log('Last insert ID:', res.insertId);
        console.log("result:");
    });

    res.redirect("/");
})

/* GET FORM */
router.post('/signupC', passport.authenticate('local.signupC', { // signupC debe hacer passaporte?
    successRedirect: '/',
    failureRedirect: './signupC',
    failureFlash: true
}));

router.post('/loginU', (req, res, next) => {
    passport.authenticate('local.loginU', {
        successRedirect: '../users/principalC',
        failureRedirect: './loginU',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;