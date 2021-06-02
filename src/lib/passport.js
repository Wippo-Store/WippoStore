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
        const user = rows[0];
        if (rows[0].contraseña === password) {

            done(null, user, req.flash('success', 'Bienvenido ' + user.username));
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'El usuario no existe'));
    }
}));

/* SIGNUP BUYER USER */
passport.use('local.signupC', new LocalStrategy({
    usernameField: 'Correo_Electronico',
    passwordField: 'Contraseña',
    passReqToCallback: true
}, async(req, Correo_Electronico, Contraseña, done) => {
    const { Nombre } = req.body;
    const { Apellido_Paterno } = req.body;
    const { Apellido_Materno } = req.body;
    const { Nombre_Calle } = req.body;
    const { Num_ext } = req.body;
    const { Nun_int } = req.body;
    const { Colonia } = req.body;
    const { CP } = req.body;
    const { Municipio } = req.body;
    const { Estado } = req.body;
    const { passr } = req.body;
    const RFC = null;
    const Tipo_Usuario = 'C';
    if (Contraseña === passr) {
        const newUserC = {
            Nombre,
            Apellido_Paterno,
            Apellido_Materno,
            Correo_Electronico,
            Contraseña,
            RFC,
            Tipo_Usuario
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
                Nombre_Calle,
                Num_ext,
                Nun_int,
                Colonia,
                CP,
                Municipio,
                Estado,
                idUsuario
            };
            const result1 = await pool.query('INSERT INTO Direccion SET ?', [newDirectionC]);
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
    const rows = await pool.query('SELECT * FROM Usuario WHERE ID_Usuario = ?', [id]);
    done(null, rows[0]);
});