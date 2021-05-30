CREATE DATABASE wippodb;
USE wippodb;

-- Tabla de usuarios ( tipo 0 -> Comprador / tipo 1 -> Vendedor)
CREATE TABLE usuarios(
    idUsuario INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(15) NOT NULL,
    apaterno VARCHAR(15) NOT NULL,
    amaterno VARCHAR(15) NOT NULL,
    correo VARCHAR(30) NOT NULL,
    username VARCHAR(20) NOT NULL,
    contraseña VARCHAR(30) NOT NULL,
    rfc VARCHAR(13),
    tipo TINYINT NOT NULL,
    PRIMARY KEY(idUsuario)
);

-- Tabla de direcciones de Usuario Comprador
CREATE TABLE direccion(
    idDireccion INT(11) NOT NULL,
    idUsuario INT(11) NOT NULL,
    calle VARCHAR(15) NOT NULL,
    noext VARCHAR(15),
    noint VARCHAR(15),
    colonia VARCHAR(30) NOT NULL,
    cp VARCHAR(20) NOT NULL,
    mun_alc VARCHAR(30) NOT NULL,
    estado VARCHAR(30) NOT NULL
);

ALTER TABLE direccion ADD CONSTRAINT fku FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE direccion ADD CONSTRAINT pkd PRIMARY KEY(idDireccion,idUsuario);
ALTER TABLE direccion MODIFY idDireccion INT(11) AUTO_INCREMENT;

