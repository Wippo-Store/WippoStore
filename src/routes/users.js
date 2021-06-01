var express = require('express');
var router = express.Router();

const pool = require('../db');

/* GET users listing. */
router.get('/principalUU', (req, res) => { /*UNREGISTERED USER*/
    res.render('principalUU');
});

router.get('/principalC', (req, res) => {
    res.render('userC/principalC');
});

router.get('/profileC', (req, res) => {
    res.render('userC/profileC');
});

router.get('/editProfileC', (req, res) => {
    res.render('userC/editProfileC');
});
router.get('/addDirectionC', (req, res) => {
    res.render('userC/addDirectionC');
});
router.get('/addCardC', (req, res) => {
    res.render('userC/addCardC');
});
router.get('/shoppingCartC', (req, res) => {
    res.render('userC/shoppingCartC');
});
module.exports = router;