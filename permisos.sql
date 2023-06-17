


select u.usuarios_id,u.nombre,u.email,u.apellido,u.activo,u.edad, u.ciudad, u.codigo_postal, u.pais, u.imagen, u.estado, u.roles_id, u.usuarios_id_lider,
r.descripcion_rol as rol_de_usuario, 
u2.nombre as nombre_jefe,u2.email as email_jefe, u2.roles_id as rol_jefe 
from usuarios as u 
join roles as r on r.roles_id=u.roles_id 
join usuarios as u2 on u.usuarios_id_lider=u2.usuarios_id 
where (u.usuarios_id_lider=26 or u.usuarios_id=26) and u.usuarios_id=26




















insert into permisos (metodo, ruta) values
( 'GET' , '/api/usuarios%' ),
( 'GET' , '/api/roles%' ),
( 'GET' , '/api/pedidos%' ),
( 'GET' , '/api/permisos%' ),
( 'GET' , '/api/stocks%' ),
( 'GET' , '/api/materiales%' ),
( 'GET' , '/api/categorias%' ),
( 'GET' , '/api/almacenes%' ),
( 'GET' , '/api/camiones%' ),
( 'PUT' , '/api/usuarios%' ),
( 'PUT' , '/api/roles%' ),
( 'PUT' , '/api/pedidos%' ),
( 'PUT' , '/api/permisos%' ),
( 'PUT' , '/api/stocks%' ),
( 'PUT' , '/api/materiales%' ),
( 'PUT' , '/api/categorias%' ),
( 'PUT' , '/api/almacenes%' ),
( 'PUT' , '/api/camiones%' ),
( 'POST' , '/api/usuarios%' ),
( 'POST' , '/api/roles%' ),
( 'POST' , '/api/pedidos%' ),
( 'POST' , '/api/permisos%' ),
( 'POST' , '/api/stocks%' ),
( 'POST' , '/api/materiales%' ),
( 'POST' , '/api/categorias%' ),
( 'POST' , '/api/almacenes%' ),
( 'POST' , '/api/camiones%' ),
( 'DELETE' , '/api/usuarios%' ),
( 'DELETE' , '/api/roles%' ),
( 'DELETE' , '/api/pedidos%' ),
( 'DELETE' , '/api/permisos%' ),
( 'DELETE' , '/api/stocks%' ),
( 'DELETE' , '/api/materiales%' ),
( 'DELETE' , '/api/categorias%' ),
( 'DELETE' , '/api/almacenes%' ),
( 'DELETE' , '/api/camiones%' );


insert into roles_have_permisos (roles_id,permisos_id) values
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10),
(2, 11),
(2, 12),
(2, 13),
(2, 14),
(2, 15),
(2, 16),
(2, 17),
(2, 18),
(2, 19),
(2, 20),
(2, 21),
(2, 22),
(2, 23),
(2, 24),
(2, 25),
(2, 26),
(2, 27),
(2, 28),
(2, 29),
(2, 30),
(2, 31),
(2, 32),
(2, 33),
(2, 34),
(2, 35),
(2, 36),
(2, 37),
(3, 4),
(3, 6),
(3, 7),
(3, 8),
(3, 9),
(3, 13),
(3, 15),
(3, 24),
(3, 33),
(3, 18),
(4, 4),
(4, 13),
(4, 22),
(4, 6),
(4, 7),
(4, 8),
(4, 9),
(4, 10);