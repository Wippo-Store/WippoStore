const express = require('express');
const router = express.Router();

const pool = require('../db');

/* to open windows */
router.get('/category', (req, res) => {
    res.render('product/category');
});

router.get('/pDetails', (req, res) => {

    product = {
        id: 0,
        name: "Sony WH1000XM4/B",
        description: "Audífonos inalámbricos con Noise Cancelling, Negro, Grande",
        color: "Negro",
        price: "6,500.00", //with IVA
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1200px-Imagen_no_disponible.svg.png",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1200px-Imagen_no_disponible.svg.png",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1200px-Imagen_no_disponible.svg.png"
        ]
    }

    res.render('product/pDetails', {
        product: product
    });
});

// we should use the post to get id_product from request (req)
// app.post('/pDetails', function (req, res) {
//     var message = req.product;
//     res.render('product/pDetails');
// });

module.exports = router;