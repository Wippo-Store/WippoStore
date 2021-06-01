const express = require('express');
const router = express.Router();

/*library passport*/
const passport = require('passport');

/* to open windows */
router.get('/loginU', (req, res) => {
    res.render('login/loginU');
});

/* to open windows */
router.get('/loginV', (req, res) => {
    res.render('login/loginV');
});

router.get('/signOption', (req, res) => {
    res.render('login/signOption', { title: 'Registro ' });
});

router.get('/signupC', (req, res) => {
    res.render('login/signupC');
});

router.get('/signupV', (req, res) => {
    res.render('login/signupV');
});

router.get('/recoverC', (req, res) => {
    res.render('login/recoverC');
});

/* get form */
router.post('/signupC', passport.authenticate('local.signupC', {
    successRedirect: './loginU',
    failureRedirect: './signupC'
}));

router.get('/profile', (req, res) => {
    res.send('this is your profile');
});

module.exports = router;