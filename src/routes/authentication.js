const express = require('express');
const router = express.Router();

const pool = require('../db');

/* to open windows */
router.get('/loginU', (req, res) => {
    res.render('login/loginU');
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
router.post('/signupC', (req, res) => {

})

module.exports = router;