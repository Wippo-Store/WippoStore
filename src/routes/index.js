var express = require('express');
var router = express.Router();

const { isNotLoggedIn } = require('../lib/helpers');
/* GET home page. */
router.get('/', isNotLoggedIn, function(req, res, next) {
    req.flash("msg", "Error Occured");
    res.locals.messages = req.flash();
    res.render('index', { titulo: 'WIPPOSTORE' });
});

module.exports = router;