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
    const { ID_Usuario } = req.query;
    const { mail } = req.query;
    link = "http://" + req.get('Host') + "/authentication/verify?token=" + token + "&ID_Usuario=" + ID_Usuario;
    console.log("Sending email:");
    mails.sendValidation(link, mail);
    pool.query("CALL `addToken`(?, ?);", [token, ID_Usuario], (err, res) => {
        if (err) throw err;
        else {
            console.log('Last insert ID:', res.insertId);
            console.log("token addded");
        }
    });
    res.redirect("/");
})

router.post('/verify', function (req, res) {
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
                res.send("<h1>Email is been Successfully verified");
            }
        });
    }
    else
        res.end(`<h1>Request is from unknown source: ${req.protocol}://${req.get('Host')} == http://${Host}}`);

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