INSERT INTO usuarios (nombre, apellido, email, contrasena, activo, edad, ciudad, codigo_postal, pais, roles_id, usuarios_id_lider)
VALUES
('Mario', 'Giron', 'mario.giron@example.com', 'password123', 1, 29, 'Madrid', '28043', 'España', 1, 1),
('Sarah', 'Johnson', 'sarah.johnson@example.com', 'password123', 1, 31, 'Madrid', '28043', 'España', 2, 1),
('Robert', 'Garcia', 'robert.garcia@example.com', 'password123', 1, 29 ,'Zaragoza',NULL,'España',3, 2),
('Michelle', 'Chen', 'michelle.chen@example.com', 'password123', 1, 33,'Zaragoza',NULL,'España', 4 , 2),
('Daniel', 'Kim', 'daniel.kim@example.com', 'password123', 1, 26, 'Barcelona',NULL,'España',3, 2),
('Sophia', 'Martinez', 'sophia.martinez@example.com', 'password456', 1, 30,'Barcelona',NULL ,'España',4, 2);

INSERT INTO roles (descripcion_rol, responsabilidad) 
VALUES
('Superusuario',50), 
('Jefe de Equipo', 40),
('Encargado', 30), 
('Operario de camion', 20);


