const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../db');

/* SIGNUP USER BUYER */
passport.use('local.signupC', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'contraseña',
    passReqToCallback: true
}, async(req, correo, contraseña, done) => {
    const { nombre } = req.body;
    const { apaterno } = req.body;
    const { amaterno } = req.body;
    const { calle } = req.body;
    const { noext } = req.body;
    const { noint } = req.body;
    const { colonia } = req.body;
    const { cp } = req.body;
    const { mun_alc } = req.body;
    const { estado } = req.body;
    const { passr } = req.body;
    const rfc = null;
    const tipo = 0;
    if (contraseña === passr) {
        const newUserC = {
            nombre,
            apaterno,
            amaterno,
            correo,
            contraseña,
            rfc,
            tipo
        };
        const result = await pool.query('INSERT INTO usuario SET ?', [newUserC]);
        /*console.log(result);*/
        const idUsuario = result.insertId;
        const newDirectionC = {
            calle,
            noext,
            noint,
            colonia,
            cp,
            mun_alc,
            estado,
            idUsuario
        };
        const result1 = await pool.query('INSERT INTO direccion SET ?', [newDirectionC]);
        /*console.log(result1);*/
        newUserC.id = result.insertId;
        return done(null, newUserC);
    } else {
        console.log("error");
    }

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE idUsuario = ?', [id]);
    done(null, rows[0]);
});