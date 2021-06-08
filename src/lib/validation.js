function validationSignUp(data) {
    const { Nombre, Apellido_Paterno, Apellido_Materno, Correo_Electronico } = data;

    // name validation
    if (typeof Nombre !== 'string') {
        throw 'debe ser un string';
    }
}

module.exports = {
    validationSignUp,
};