create database wippodb;

use wippodb;

create table if not exists Usuario(
	ID_Usuario int(11) not null AUTO_INCREMENT,
    Correo_Electronico varchar(40) not null,
    Contraseña varchar(40) not null,
	Nombre varchar(15) not null,
    Apellido_Paterno varchar(15) not null,
    Apellido_Materno varchar(15) not null, 
    Telefono varchar(17),
    Tipo_Usuario varchar(1) not null,
    Estatus varchar(20) not null DEFAULT 'porActivar',
    RFC varchar(12),
    primary key(ID_Usuario),
    constraint Tipos_de_Usuario check (Tipo_Usuario = 'A' or Tipo_Usuario 
    = 'C' or Tipo_Usuario = 'V'),
    constraint Estado_usuario check (Estatus="Activo" or Estatus="porActivar")
)ENGINE=INNODB;

drop TABLE if exists TokensCorreo;
CREATE TABLE if not exists TokensCorreo(
    ID_Usuario INT(11) NOT NULL UNIQUE,
    token VARCHAR(40) NOT NULL UNIQUE,
    fecha VARCHAR(40) NOT NULL,
    FOREIGN KEY (ID_Usuario) REFERENCES Usuario(ID_Usuario)
)ENGINE=INNODB;

drop PROCEDURE if exists addToken;
DELIMITER &&  
CREATE PROCEDURE addToken (in token VARCHAR(40), in ID_Usuario int)  
BEGIN  
    REPLACE INTO TokensCorreo(ID_Usuario, token, fecha) VALUES(ID_Usuario, token, now());
END &&  
DELIMITER ;  
-- Example: call addToken("1234", 1);

drop PROCEDURE if exists validateToken;
DELIMITER &&  
CREATE PROCEDURE validateToken (in user_token VARCHAR(40), in ID_Usuario_r int)  
BEGIN
    DECLARE tk Varchar(40);
    SELECT `token` INTO tk FROM `TokensCorreo` WHERE ID_Usuario = ID_Usuario_r limit 1;
    if(tk = user_token) then
        DELETE FROM `TokensCorreo` WHERE ID_Usuario = ID_Usuario_r;
        UPDATE Usuario  SET  Estatus = 'Activo'  WHERE ID_Usuario = ID_Usuario_r;
    end if;
END &&  
DELIMITER ;  

drop PROCEDURE if exists validatePasswordToken;
DELIMITER &&  
CREATE PROCEDURE validatePasswordToken (in user_token VARCHAR(40), in ID_Usuario_r int)  
BEGIN
    DECLARE tk Varchar(40);
    SELECT `token` INTO tk FROM `TokensCorreo` WHERE ID_Usuario = ID_Usuario_r limit 1;
    if(tk = user_token) then
        DELETE FROM `TokensCorreo` WHERE ID_Usuario = ID_Usuario_r;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid Token';
    end if;
END &&  
DELIMITER ;  

-- Example: call validateToken("1234", 1);

create table if not exists Producto(
	ID_Producto int(11) not null AUTO_INCREMENT,
    Nombre varchar(30) not null,
    Precio int not null,
    Cantidad int,
    Categoria varchar(20) not null,
    Color varchar(20),
    Descripcion varchar(100) not null,
    Caracteristica_1 varchar (100) not null,
    Caracteristica_2 varchar (100) not null,
    Caracteristica_3 varchar (100) not null,
    Caracteristica_4 varchar (100),
    Caracteristica_5 varchar (100),
    imagen1 varchar(50),
    imagen2 varchar(50),
    iamgen3 varchar(50),
    ID_Usuario int(11) not null,
    Primary Key (ID_Producto, ID_Usuario),
    constraint Referencia_Producto_Usuario Foreign Key (ID_Usuario) references Usuario(ID_Usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    constraint Precio_Negativo check (Precio>0),
    constraint Cantidad_Negatvo check (Cantidad>=0)
)ENGINE=INNODB;

create table if not exists Carrito(
	ID_Carrito int(11) not null AUTO_INCREMENT,
    ID_Usuario int(11) not null,
    Monto_Total int not null,
    primary key(ID_Carrito),
    constraint Referencia_Carrito_Usuario foreign key (ID_Usuario) references Usuario(ID_Usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    constraint Carrito_Monto_Negativo check (Monto_Total>=0)
)ENGINE=INNODB;


drop PROCEDURE if exists updateCartTotal;
DELIMITER &&  
CREATE PROCEDURE updateCartTotal (in toADD int,in ID_Carrito int)  
BEGIN
    DECLARE total int default 0;
    SELECT `carrito`.`Monto_Total` INTO total FROM carrito WHERE `carrito`.`ID_Carrito` = ID_Carrito;
    UPDATE `carrito` SET `Monto_Total` = (total + toADD) WHERE `carrito`.`ID_Carrito` = ID_Carrito;
END &&  
DELIMITER ;

drop PROCEDURE if exists updateCart;
DELIMITER &&  
CREATE PROCEDURE updateCart (in ID_Producto_r int, in ID_Usuario_r int, in Cantidad int)  
BEGIN
    DECLARE ìdCarrito int;
    DECLARE Total int;
    DECLARE res_checkCantidad int;
    DECLARE dif int;
    SELECT `ID_Carrito` INTO ìdCarrito FROM `Carrito` WHERE `ID_Usuario` = ID_Usuario_r limit 1;
    if(ìdCarrito IS NOT NULL) then
        -- select `Cantidad` into Cantidad_Anterior from CarritoContiene where `ID_Carrito` = ìdCarrito and `ID_Producto` = ID_Producto_r;
        call checkCantidad(ìdCarrito, ID_Producto_r, Cantidad, res_checkCantidad, dif);
        if(res_checkCantidad != 0) then
            -- if(Cantidad_Anterior != Cantidad ) then
                SELECT (Producto.Precio * dif) INTO Total FROM `Producto` WHERE `ID_Producto` = ID_Producto_r limit 1;
                REPLACE INTO `CarritoContiene` (`ID_Carrito`, `ID_Producto`, `Cantidad`) VALUES (ìdCarrito, ID_Producto_r, Cantidad);
                if(res_checkCantidad = -1) then
                    call updateCartTotal((Total*-1), ìdCarrito);
                ELSE
                    call updateCartTotal(Total, ìdCarrito);
                end if;
            -- end if;
        end if;
        
    end if;
END &&  
DELIMITER ;  

drop PROCEDURE if exists checkCantidad;
DELIMITER &&  
CREATE PROCEDURE checkCantidad (in ID_Carrito_r int,in ID_Producto_r int, in Cantidad_r int, out result int, out dif int)  
BEGIN
    DECLARE Cantidad_Anterior int;

    select `Cantidad` into Cantidad_Anterior from CarritoContiene where `ID_Carrito` = ID_Carrito_r and `ID_Producto` = ID_Producto_r;

    if(Cantidad_Anterior IS NOT NULL) then
            if(Cantidad_r <  Cantidad_Anterior) then
                select -1 into result;
                select (Cantidad_Anterior - Cantidad_r) into dif;
            ELSEIF (Cantidad_r >  Cantidad_Anterior) then
                select 1 into result;
                select (Cantidad_r - Cantidad_Anterior) into dif;
            else
                select 0 into result;
                select 0 into dif;
            end if;
        -- end if;
    end if;
END &&  
DELIMITER ;  

drop PROCEDURE if exists countCart;
DELIMITER &&  
CREATE PROCEDURE countCart (in ID_Carrito_r int, out lenCarrito int)  
BEGIN
    SELECT COUNT(ID_Producto) into lenCarrito FROM carritocontiene WHERE ID_Carrito = ID_Carrito_r;
END &&  
DELIMITER ;  

drop PROCEDURE if exists purchaseCart;
DELIMITER &&  
CREATE PROCEDURE purchaseCart (in ID_Usuario_r int, in ID_Direccion int, in ID_Tarjeta varchar(30))  
BEGIN
    DECLARE idCarrito int;
    DECLARE montoCarrito int;
    DECLARE idVendedor int;
    DECLARE idProducto int;
    DECLARE Total int;
    DECLARE counter INT DEFAULT 1;
    DECLARE lngth INT;
    DECLARE cantidad_actual int;
    DECLARE cantidad_comprada int;
    SELECT `ID_Carrito`, `Monto_Total` INTO idCarrito, montoCarrito FROM `Carrito` WHERE `ID_Usuario` = ID_Usuario_r limit 1;
    if(idCarrito IS NOT NULL) then
        -- START TRANSACTION; -- TRANSACTION WORKING
            INSERT INTO `orden` (`Estatus`, `Monto_Total`, `ID_Usuario`, `ID_Direccion`,`ID_Tarjeta`)  VALUES ('Pendiente', montoCarrito, ID_Usuario_r, ID_Direccion,ID_Tarjeta);        
            SET @idOrden = LAST_INSERT_ID();
            if(@idOrden IS NOT NULL) then
                    call countCart(idCarrito, lngth);

                    WHILE counter <= lngth DO
                        select `ID_Producto`  into idProducto from carritocontiene where ID_Carrito = idCarrito limit 1;
                        select `Cantidad` into cantidad_actual from producto where ID_Producto = idProducto limit 1;
                        SELECT `Cantidad` into cantidad_comprada FROM `carritocontiene` WHERE ID_Carrito = idCarrito limit 1;
                        CALL `getVendedor`(idProducto, idVendedor); 
                        INSERT INTO `contiene` (ID_Orden, ID_Producto,Cantidad, ID_Usuario)  SELECT @idOrden, `ID_Producto`,`Cantidad`,idVendedor FROM `carritocontiene` WHERE ID_Producto = idProducto;
                        DELETE FROM `CarritoContiene` WHERE ID_Carrito=idCarrito and ID_Producto = idProducto;
                        UPDATE `producto` SET `cantidad` = (cantidad_actual - cantidad_comprada) where `ID_Producto` = idProducto;
                        SET counter = counter + 1;
                    END WHILE;
                UPDATE `Carrito` SET `Monto_Total` = 0 WHERE ID_Carrito = idCarrito limit 1;

            END IF;
        -- COMMIT;
    end if;
END &&  
DELIMITER ; 

drop PROCEDURE if exists addToCart;
DELIMITER &&  
CREATE PROCEDURE addToCart (in ID_Producto_r int, in ID_Usuario_r int, in Cantidad_r int)  
BEGIN
    DECLARE ìdCarrito int;
    DECLARE precioProducto int;
    SELECT `ID_Carrito` INTO ìdCarrito FROM `Carrito` WHERE `ID_Usuario` = ID_Usuario_r limit 1;
    if(ìdCarrito IS NOT NULL) then
        INSERT INTO `CarritoContiene` (`ID_Carrito`, `ID_Producto`, `Cantidad`) VALUES (ìdCarrito, ID_Producto_r, Cantidad_r);
        SELECT `Producto`.`Precio` INTO precioProducto FROM `Producto` WHERE `ID_Producto` = ID_Producto_r limit 1;
        call updateCartTotal((precioProducto*Cantidad_r), ìdCarrito);
    end if;
END &&  
DELIMITER ;
drop PROCEDURE if exists getCart;
DELIMITER &&  
CREATE PROCEDURE getCart (in ID_Usuario_r int)  
BEGIN
    SELECT carrito.ID_Carrito, carrito.ID_Usuario, carritocontiene.ID_Producto, carritocontiene.Cantidad, producto.Nombre, producto.Categoria, producto.Precio, producto.imagen1 
    FROM `carrito` INNER JOIN carritocontiene on carrito.ID_Carrito = carritocontiene.ID_Carrito INNER JOIN producto ON producto.ID_Producto = carritocontiene.ID_Producto where carrito.ID_Usuario = ID_Usuario_r;
END &&  
DELIMITER ;

drop PROCEDURE if exists getOrders;
DELIMITER &&  
CREATE PROCEDURE getOrders (in ID_Usuario_r int, in limit_r int)  
BEGIN
    SELECT * FROM orden limit limit_r;
END &&  
DELIMITER ;


drop PROCEDURE if exists removeFromCart;
DELIMITER &&  
CREATE PROCEDURE removeFromCart (in ID_Usuario_r int, in ID_Producto int)  
BEGIN
    DECLARE idCarrito int;
    DECLARE Total int;

        SELECT `ID_Carrito` INTO idCarrito FROM `Carrito` WHERE `ID_Usuario` = ID_Usuario_r limit 1;
        if(idCarrito IS NOT NULL) then
            DELETE FROM `carritocontiene` WHERE `carritocontiene`.`ID_Carrito` = idCarrito AND `carritocontiene`.`ID_Producto` = ID_Producto;
            SELECT (Producto.Precio * Cantidad) INTO Total FROM `Producto` WHERE `ID_Producto` = ID_Producto limit 1;
            call updateCartTotal((Total * -1), ìdCarrito);
    end if;

END &&  
DELIMITER ;

create table if not exists CarritoContiene(
	ID_Carrito int(11) not null,
    ID_Producto int(11) not null,
    Cantidad int not null,
    constraint Referencia_Carrito_Contiene_Carrito foreign key (ID_Carrito) references Carrito(ID_Carrito) ON DELETE CASCADE ON UPDATE CASCADE,
    constraint Referencia_Carrito_Contiene_Producto foreign key (ID_Producto) references Producto(ID_Producto) ON DELETE CASCADE ON UPDATE CASCADE,
    primary key (ID_Producto,ID_Carrito),
    constraint Carrito_Contenido_Negativo check (Cantidad>0)
)engine=innodb; 

drop PROCEDURE if exists getVendedor;
DELIMITER &&  
CREATE PROCEDURE getVendedor (in ID_Producto_r int, out ID_Vendedor int)  
BEGIN
    SELECT ID_Usuario into ID_Vendedor FROM producto WHERE ID_Producto = ID_Producto_r;
END &&  
DELIMITER ;  

create table if not exists Solicitar_Devolucion(
	Producto_ID_Usuario int(11) not null,
	Producto_ID_Producto int(11) not null,
    Usuario_ID_Usuario int(11) not null,
    Motivo varchar(50),
    Estatus  varchar(20) not null,
    Fecha_Solicitud date not null,
    constraint Referencia_Solicitar_Producto foreign key(Producto_ID_Usuario,Producto_ID_Producto) references  Producto(ID_Usuario,ID_Producto) ON DELETE CASCADE ON UPDATE CASCADE,
    constraint Referencia_Solicitar_Usuario foreign key(Usuario_ID_Usuario) references Usuario(ID_Usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    primary key (Producto_ID_Producto,Producto_ID_Usuario,Usuario_ID_Usuario),
    constraint Estatus_de_Devolucion check (Estatus = "Pendiente" or Estatus = "Devuelto" or Estatus = "Rechazado")
)ENGINE=INNODB;

create table if not exists Califica(
	Usuario_ID_Usuario int(11) not null,
    Producto_ID_Usuario int(11) not null,
    Producto_ID_Producto int(11) not null,
    Modelo varchar(30) not null,
    Calificacion int not null,
    Comentario varchar(70),
    constraint Referencia_Califica_Usuario foreign key (Usuario_ID_Usuario) references Usuario(ID_Usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    constraint Referencia_Califica_Producto foreign key (Producto_ID_Usuario,Producto_ID_Producto) references Producto(ID_Usuario,ID_Producto) ON DELETE CASCADE ON UPDATE CASCADE,
    primary key (Usuario_ID_Usuario,Producto_ID_Usuario,Producto_ID_Producto)
)engine=innodb;


create table if not exists Tarjeta_Registrada(
	ID_Tarjeta varchar(19) not null,
    Nom_Tarjeta  varchar(30) not null,
    Mes char(2) not null,
    Year char(4)  not null,
    ID_Usuario int(11) not null,
    primary key (ID_Tarjeta, ID_Usuario),
    constraint Referencia_Tarjeta_Usuario foreign key (ID_Usuario) references Usuario(ID_Usuario) ON DELETE CASCADE ON UPDATE CASCADE
)engine=innodb;

create table if not exists Direccion(
	ID_Direccion int(11) not null AUTO_INCREMENT,
    Nombre_Calle varchar(30) not null,
    Num_ext int not null,
    Num_int int,
    Colonia varchar(20) not null,
    Municipio varchar(20) not null,
    Estado varchar(20) not null,
    CP char(5) not null,
    ID_Usuario int(11) not null,
    primary key(ID_Direccion,ID_Usuario),
    constraint Referencia_Direccion_Usuario foreign key (ID_Usuario) references Usuario(ID_Usuario) ON DELETE CASCADE ON UPDATE CASCADE
)engine=innodb;

create table if not exists Orden(
	ID_Orden int(11) not null AUTO_INCREMENT,
    Fecha date not null DEFAULT now(),
    Estatus varchar(20) not null DEFAULT "Pendiente",
    Monto_Total int not null,
    ID_Direccion int(11) not null,
    ID_Tarjeta varchar(19) not null,
    ID_Usuario int(11) not null,
    primary key(ID_Orden),
    constraint Referencia_Orden_Usuario foreign key (ID_Usuario) references Usuario(ID_Usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    constraint Referencia_Orden_Direccion foreign key (ID_Direccion) references Direccion(ID_Direccion) ON DELETE CASCADE ON UPDATE CASCADE,
    constraint Referencia_Orden_Tarjeta foreign key (ID_Tarjeta, ID_Usuario) references Tarjeta_Registrada(ID_Tarjeta, ID_Usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    constraint Monto_Negaivo check (Monto_Total>=0),
    constraint Estado_orden check (Estatus="Pendiente" or Estatus="Enviado" or Estatus="Entregado")
)engine=innodb;

create table if not exists Contiene(
	ID_Orden int(11) not null,
    ID_Producto int(11) not null,
    ID_Usuario int(11) not null,
    Cantidad int not null,
    constraint Referencia_Contiene_Orden foreign key (ID_Orden) references Orden(ID_Orden) ON DELETE CASCADE ON UPDATE CASCADE,
    constraint Referencia_Contiene_Producto foreign key (ID_Producto,ID_Usuario) references Producto(ID_Producto,ID_Usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    primary key (ID_Orden,ID_Producto,ID_Usuario),
    constraint Contenido_Negativo check (Cantidad>0)
)engine=innodb; 


INSERT INTO `usuario` (`ID_Usuario`, `Correo_Electronico`, `Contraseña`, `Nombre`, `Apellido_Paterno`, `Apellido_Materno`, `Telefono`, `Tipo_Usuario`, `RFC`) VALUES
(1, 'chavo0022009@gmail.com', '123', 'Roy', 'Rubio', 'Haro', NULL, 'C', NULL),
(2, 'laura@gmail.com', '123', 'Laura', 'Martínez', 'Sánchez', NULL, 'V', 'MASL900101S1');



INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'Sony WH1000XM4/B', '5803.60', '4', 'Electrónicos', 'Negro', 'Audífonos inalámbricos con Noise Cancelling, Negro, Grande.', 'Cancelación de ruido dual te permiten escuchar sin distracciones.', 'Optimizador personal de noise cancelling y optimización de la presión atmosférica.', 'Libertad inalámbrica con tecnología Bluetooth.', NULL, NULL, 'audifonos1.jpg', 'audifonos2.jpg', 'audifonos3.jpg', '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'SAMSUNG Galaxy A51', '5999.00', '4', 'Electrónicos', 'Negro', '128GB Dual Sim 4GB RAM Negro Desbloqueado. Procesador Octa-core 2.3 GHz', 'Pantalla 6.5 pulgadas', 'Cámara Trasera 48+12+5+5MP', 'Cámara Frontal 32MP', NULL, NULL, 'cel1.jpg', 'cel1_2.jpg', 'cel1_3.jpg', '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'Realme - 7', '7999.00', '4', 'Electrónicos', 'Verde', 'Smartphone de 6.5\", 8GB RAM + 128GB ROM, Pantalla 120Hz LCD FHD+.', 'Cuádruple cámara AI 48MP Sony + 16MP cámara Frontal. ', 'Dual SIM + 1 Micro SD, 5000 mAh 30W Dart Charge.', 'Procesador Dimensity 800U 7nm.', NULL, NULL, 'cel11.jpg', 'cel22.jpg', 'cel33.jpg', '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'Playera HTML5', '250', '10', 'Ropa', 'Gris', 'Playera gris con el logo de HTML5.', '100% algodón.', 'Talla: Unitalla', 'Suave.', NULL, NULL, 'tshirt2.jpg', 'tshirt2.jpg', 'tshirt2.jpg', '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'Playera NodeJS', '250', '10', 'Ropa', 'Gris', 'Playera gris con el logo de NodeJS.', '100% algodón.', 'Talla: Unitalla', 'Suave.', NULL, NULL, 'tshirt1.jpg', 'tshirt1.jpg', 'tshirt1.jpg', '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'Playera JS', '250.00', '10', 'Ropa', 'Amarilla', 'Playera amarilla con el logo de JavaScript.', '100% Algodón', 'Suave', 'Talla: Unitalla', NULL, NULL, 'tshirt4.jpg', 'tshirt4.jpg', 'tshirt4.jpg', '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'Playera GitHub', '250', '10', 'Ropa', 'Morada', 'Playera morada con el logo de GitHub.', '100% algodón.', 'Talla: Unitalla', 'Suave.', NULL, NULL, 'tshirt3.jpg', 'tshirt3.jpg', 'tshirt3.jpg', '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'Echo Dot', '1099.00', '7', 'Electrónicos', 'Negro', 'Nuevo Echo Dot (4ta Gen) - Bocina inteligente con Alexa', 'Diseño elegante y compacto ofrece voces nítidas y bajos equilibrados, para un sonido completo.', 'Controla por voz tu entretenimiento', 'Controla tu Casa Inteligente', NULL, NULL, 'b1.jpg', 'b2.jpg', 'b3.jpg', '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'Apple Nuevo Watch SE GPS', '7499.00', '6', 'Electrónicos', 'Arena Rosa', 'Caja de Aluminio Color Oro de 40 mm. Correa Deportiva Color Arena Rosa - Estándar', 'Modelo GPS para recibir llamadas y responder mensajes desde tu muñeca', 'Procesador hasta 2 veces más rápido que el del Apple Watch Series 3', 'Mide entrenamientos como correr, caminar, bailar, nadar, hacer yoga o andar en bicicleta', NULL, NULL, 'aw1.jpg', 'aw2.jpg', 'aw3.jpg', '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'THE COMFY', '750.00', '5', 'Ropa', 'Blush', 'Manta original, te mantiene caliente y acogedor mientras descansas en casa.', 'Talla única: ajusta perfecto para la mayoría de todas las formas y tamaños.', 'Lavarlo en frío y luego secar en secadora por separado a baja temperatura, sale como nuevo', 'Comodidad extrema y material de lujo', NULL, NULL, 's1.jpg', 's2.jpg', 's3.jpg', '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'Cobija de Tortilla', '599.00', '3', 'Ropa', 'Beige', 'Cobija Doble Cara tiene 1.80cm de diámetro con un acogedor diseño.', 'La tela de franela utiliza tintes ecológicos que brindan calidad a la decoloración.', 'Se puede lavar a máquina con agua fría y un ciclo suave.', 'Comodidad extrema y material de lujo', NULL, NULL, 't1.jpg', 't2.jpg', 't3.jpg', '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'The Child Peluche', '1799.00', '2', 'Juguetes', 'Beige', 'Radio Control para niños de 3 años en adelante', '¡Este juguete de peluche de 28 centímetros de The Child encantará a los fans de Star Wars!', 'La adorable figura con piel verde, grandes orejas y enormes ojos se asemeja a “The Child”.', 'El juguete de peluche tiene un cuerpo suave, además de una base resistente rellena con microesferas', NULL, NULL, 'by1.jpg', 'by2.jpg', 'by3.jpg', '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'Peluche Pulpo Reversible', '139.00', '8', 'Juguetes', 'Rosa/Azul', 'Ultra Suave - Rosa y Azul Cielo -', 'Peluche Pulpo reversible como el que viste en redes sociales!', 'Material: Microfibra Ultra Suave de Alta Calidad', 'Medidas: 10cmx10cmx10cm', NULL, NULL, 'pr1.jpg', 'pr2.jpg', 'pr2.jpg', '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'Casa de campaña de Castillo', '369.99', '5', 'Juguetes', 'Azul', 'Tienda de campaña transpirable para guardar juguetes, uso interior y exterior', '2 ventanas de malla transpirables y una puerta plegable, gran carpa para que los niños se diviertan.', 'Hecha de tela de poliéster suave y cableado de acero grueso, es duradera y fácil de limpiar. ', 'Medidas del producto ensamblado: 105 x 135 cm.Lo suficientemente grande para 2-3 niños para jugar.', NULL, NULL, 'tc1.jpg', 'tc2.jpg', 'tc3.jpg', '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'Melissa & Doug Piano', '1589.62', '3', 'Juguetes', 'Brillante', '5 Teclas y 2 Octavas Completas, Instrumentos Musicales, Construcción de Madera Sólida', 'Este piano es un gran regalo para niños de 3 a 5 años.', 'Materiales de alta calidad y su construcción superior garantizan seguridad y durabilidad.', '29.21 cm alto x 24.13 cm ancho x 40.64 cm largo', NULL, NULL, 'tec1.jpg', 'tec2.jpg', 'tec3.jpg', '2');

