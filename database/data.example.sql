
INSERT INTO `usuario` (`ID_Usuario`, `Correo_Electronico`, `Contraseña`, `Nombre`, `Apellido_Paterno`, `Apellido_Materno`, `Telefono`, `Tipo_Usuario`, `RFC`) VALUES
(1, 'chavo0022009@gmail.com', '123', 'Roy', 'Rubio', 'Haro', NULL, 'C', NULL),
(2, 'laura@gmail.com', '123', 'Laura', 'Martínez', 'Sánchez', NULL, 'V', 'MASL900101S1'),



INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'Sony WH1000XM4/B', '5803.60', '4', 'Electrónicos', 'Negro', 'Audífonos inalámbricos con Noise Cancelling, Negro, Grande.', 'Cancelación de ruido dual te permiten escuchar sin distracciones.', 'Optimizador personal de noise cancelling y optimización de la presión atmosférica.', 'Libertad inalámbrica con tecnología Bluetooth.', NULL, NULL, 'audifonos1.jpg', 'audifonos2.jpg', 'audifonos3.jpg', '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'SAMSUNG Galaxy A51', '5999.00', '4', 'Electrónicos', 'Negro', '128GB Dual Sim 4GB RAM Negro Desbloqueado. Procesador Octa-core 2.3 GHz', 'Pantalla 6.5 pulgadas', 'Cámara Trasera 48+12+5+5MP', 'Cámara Frontal 32MP', NULL, NULL, 'cel1.jpg', NULL, NULL, '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'Realme - 7', '7999.00', '4', 'Electrónicos', 'Verde', 'Smartphone de 6.5\", 8GB RAM + 128GB ROM, Pantalla 120Hz LCD FHD+.', 'Cuádruple cámara AI 48MP Sony + 16MP cámara Frontal. ', 'Dual SIM + 1 Micro SD, 5000 mAh 30W Dart Charge.', 'Procesador Dimensity 800U 7nm.', NULL, NULL, 'cel11.jpg', 'cel22.jpg', NULL, '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'Playera HTML5', '250', '10', 'Ropa', 'Gris', 'Playera gris con el logo de HTML5.', '100% algodón.', 'No se despinta.', 'Suave.', NULL, NULL, 'tshirt2.jpg', NULL, NULL, '2');

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Precio`, `Cantidad`, `Categoria`, `Color`, `Descripcion`, `Caracteristica_1`, `Caracteristica_2`, `Caracteristica_3`, `Caracteristica_4`, `Caracteristica_5`, `imagen1`, `imagen2`, `iamgen3`, `ID_Usuario`) VALUES (NULL, 'Playera JS', '250.00', '10', 'Ropa', 'Amarilla', 'Playera amarilla con el logo de JavaScript.', '100% Algodón', 'Suave', 'Duradera**', NULL, NULL, 'tshirt4.jpg', NULL, NULL, '2');
