const express = require('express');
const router = express.Router();

/*library passport*/
const passport = require('passport');
const { isNotLoggedIn } = require('../lib/helpers');

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