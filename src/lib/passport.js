const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../db');

/* SIGNIN USER */
passport.use('local.loginU', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
    const rows = await pool.query('SELECT idUsuario,contraseña FROM usuario WHERE correo = ?', [username]);
    console.log(rows);
    console.log(rows[0].contraseña);
    if (rows.length > 0) {
        if (rows[0].contraseña === password) {
            done(null, rows[0].idUsuario);
        } else {
            done(null, false);
        }
    } else {
        console.log('usuario no existe');
        return done(null, false);
    }


}));

/* SIGNUP BUYER USER */
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
        const email = await pool.query('SELECT COUNT(*) AS n FROM USUARIO WHERE correo = ? ', [correo]);
        console.log(email[0].n);
        if (email[0].n > 0) {
            console.log('usuario repetido');
        } else {
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
        }
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