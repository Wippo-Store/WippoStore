var express = require('express');
var router = express.Router();

const pool = require('../db');

/* GET users listing. */
router.get('/principalC', (req, res) => {
    res.render('userC/principalC');
});

router.get('/profileC', (req, res) => {
    res.render('userC/profileC');
});

module.exports = router;