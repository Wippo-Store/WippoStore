const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const pool = require('../db');

/* LOGIN USER */
passport.use('local.loginU', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
    const rows = await pool.query('SELECT ID_Usuario AS id,Contraseña,Nombre,Correo_Electronico FROM Usuario WHERE Correo_Electronico = ?', [username]);
    if (rows.length > 0) {
        if (rows[0].Contraseña == password) {
            const user = rows[0];
            console.log('Acceso exitoso');
            req.session.user = user;
            console.log(user);
            done(null, user, req.flash('success', 'Bienvenido ' + user.Nombre));

        } else {
            console.log('Contraseñas no coinciden');
            done(null, false, req.flash('message_er', 'Contraseña incorrecta'));
        }
    } else {
        console.log('Usuario no exite');
        return done(null, false, req.flash('message_er', 'El usuario no existe'));
    }
}));

/* SIGNUP BUYER USER */
passport.use('local.signupC', new LocalStrategy({
    usernameField: 'Correo_Electronico',
    passwordField: 'Contraseña',
    passReqToCallback: true
}, async(req, Correo_Electronico, Contraseña, done) => {
    //console.log(req.body);
    const { Nombre } = req.body;
    const { Apellido_Paterno } = req.body;
    const { Apellido_Materno } = req.body;
    const { Nombre_Calle } = req.body;
    const { Num_ext } = req.body;
    const { Num_int } = req.body;
    const { Colonia } = req.body;
    const { CP } = req.body;
    const { Municipio } = req.body;
    const { Estado } = req.body;
    const { passr } = req.body;
    const RFC = null;
    const Tipo_Usuario = 'C';

    const newUserC = {
        Nombre,
        Apellido_Paterno,
        Apellido_Materno,
        Correo_Electronico,
        Contraseña,
        RFC,
        Tipo_Usuario
    };
    const email = await pool.query('SELECT COUNT(*) AS n, ID_Usuario as id FROM Usuario WHERE Correo_Electronico = ? ', [Correo_Electronico]);
    console.log(email[0].n);
    if (email[0].n > 0) {
        console.log("usuario ya existente");
        done(null, false, req.flash('message_er', 'Usuario ya existente'));
    } else {
        const result = await pool.query('INSERT INTO Usuario SET ?', [newUserC]);
        /*console.log(result);*/
        const ID_Usuario = result.insertId;
        const newDirectionC = {
            Nombre_Calle,
            Num_ext,
            Num_int,
            Colonia,
            CP,
            Municipio,
            Estado,
            ID_Usuario
        };
        const result1 = await pool.query('INSERT INTO Direccion SET ?', [newDirectionC]);
        /*console.log(result1);*/
        newUserC.id = result.insertId;
        console.log('registro exitoso')
        return done(null, newUserC, req.flash('success', 'Registro exitoso'));
    }

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    const rows = await pool.query('SELECT * FROM Usuario WHERE ID_Usuario = ?', [id]);
    done(null, rows[0]);
});