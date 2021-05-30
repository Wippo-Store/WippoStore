const express = require('express');
const router = express.Router();

const pool = require('../db');

/* PARA ABRIR LAS PÁGINAS */
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

/* obtener datos de formulario */
router.post('/signupC', (req, res) => {

})

module.exports = router;