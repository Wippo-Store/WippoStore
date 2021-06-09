var express = require('express');
var router = express.Router();

const { isNotLoggedIn } = require('../lib/helpers');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { titulo: 'WIPPOSTORE' });
});

module.exports = router;