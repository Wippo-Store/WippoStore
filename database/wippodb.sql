create database wippodb;

use wippodb;

create table if not exists Usuario(
	ID_Usuario varchar(30) not null,
    Correo_Electronico varchar(40) not null,
    Contraseña varchar(40) not null,
	Nombre varchar(15) not null,
    Apellido_Paterno varchar(15) not null,
    Apellido_Materno varchar(15) not null, 
    Telefono varchar(17) not null,
    Fecha_Nacimiento date not null,
    Tipo_Usuario varchar(1) not null,
    RFC varchar(12),
    primary key(ID_Usuario)
    constraint Tipos_de_USuario check (Tipo_Usuario = 'A' or Tipo_Usuario 
    = 'C' or Tipo_Usuario = 'V')

)ENGINE=INNODB;

create table if not exists Producto(
	ID_Producto varchar(30) not null,
    Nombre varchar(30) not null,
    Precio int not null,
    Cantidad int null,
    Categoria varchar(20) not null,
    Color varchar(20) not null,
    Descripcion varchar(50),
    Caracteristica_1 varchar (40),
    Caracteristica_2 varchar (40),
    Caracteristica_3 varchar (40),
    Caracteristica_4 varchar (40),
    Caracteristica_5 varchar (40),
    ID_Usuario varchar(30),
    Primary Key (ID_Producto, ID_Usuario),
    constraint Referencia_Producto_Usuario Foreign Key (ID_Usuario) references Usuario(ID_Usuario),
    constraint Precio_Negativo check (Precio>0),
    constraint Cantidad_Negatvo check (Cantidad>0),
)ENGINE=INNODB;

create table if not exists Orden(
	ID_Orden varchar(30) not null,
    Fecha date not null,
    Estatus varchar(20) not null,
    Monto_Total int not null,
    ID_Usuario varchar(30) not null,
    primary key(ID_Orden),
    constraint Referencia_Orden_Usuario foreign key (ID_Usuario) references Usuario(ID_Usuario),
    constraint Monto_Negaivo check (Monto_Total>0),
    constraint Estado_orden check (Estatus="Pendiente" or Estatus="Enviado" or Estatus="Entregado")
);

create table if not exists Solicitar_Devolucion(
	Producto_ID_Usuario varchar(30) not null,
	Producto_ID_Producto varchar(30) not null,
    Usuario_ID_Usuario varchar (30) not null,
    Motivo		varchar(50) ,
    Estatus		varchar(20) not null,
    Fecha_Solicitud date not null,
    constraint Referencia_Solitar_Producto foreign key(Producto_ID_Usuario,Producto_ID_Producto) references  Producto(ID_Usuario,ID_Producto),
    constraint Referencia_Solictar_Usuario foreign key(Usuario_ID_Usuario) references Usuario(ID_Usuario),
    primary key (Producto_ID_Producto,Producto_ID_Usuario,Usuario_ID_Usuario),
    constraint Estatus_de_Devolucion check (Estatus = "Pendiente" or Estatus = "Devuelto" or Estatus = "Rechazado")
)ENGINE=INNODB;

create table if not exists Califica(
	Usuario_ID_Usuario varchar(30) not null,
    Producto_ID_Usuario varchar(30) not null,
    Producto_ID_Producto varchar(30) not null,
    Modelo varchar(30) not null,
    Calificacion int not null,
    Comentario varchar(70),
    constraint Referencia_Califica_Usuario foreign key (Usuario_ID_Usuario) references Usuario(ID_Usuario),
    constraint Referencia_Califica_Producto foreign key (Producto_ID_Usuario,Producto_ID_Producto) references Producto(ID_Usuario,ID_Producto),
    primary key (Usuario_ID_Usuario,Producto_ID_Usuario,Producto_ID_Producto)
)engine=innodb;

create table if not exists Contiene(
	ID_Orden varchar(30) not null,
    ID_Producto varchar(30) not null,
    ID_Usuario varchar(30) not null,
    Cantidad int not null,
    constraint Referencia_Contiene_Orden foreign key (ID_Orden) references Orden(ID_Orden),
    constraint Referencia_Contiene Producto foreign key (ID_Producto,ID_Usuario) references Producto(ID_Producto,ID_Usuario),
    primary key (ID_Orden,ID_Producto,ID_Usuario),
    constraint Contenido_Negativo check (Cantidad>0)
)engine=innodb; 

create table if not exists Tarjeta_Registrada(
	ID_Tarjeta	varchar(30) not null,
    No_Tarjeta varchar(16) not null,
    Mes char(2) not null,
    Año char(2)  not null,
    ID_Usuario varchar(30) not null,
    primary key (No_Tarjeta),
    constraint Referencia_Tarjeta_Usuario foreign key (ID_Usuario) references Usuario(ID_Usuario)
)engine=innodb;

create table if not exists Direccion(
	ID_Direccion varchar(30) not null,
    Nombre_Calle varchar(30) not null,
    Num_ext int not null,
    Num_int int,
    Colonia varchar(20) not null,
    Municipio varchar(20) not null,
    Estado varchar(15) not null,
    CP char(5) not null,
    ID_Usuario varchar(30) not null,
    
    primary key(ID_Direccion,ID_Usuario),
    constraint Referencia_Direccion_Usuario foreign key (ID_Usuario) references Usuario(ID_Usuario)
)engine=innodb;