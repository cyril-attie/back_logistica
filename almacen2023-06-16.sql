-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: localhost    Database: almacen
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `almacenes`
--

DROP TABLE IF EXISTS `almacenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `almacenes` (
  `almacenes_id` int NOT NULL AUTO_INCREMENT,
  `nombre_almacen` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `calle` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_postal` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `localidad` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pais` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `coordenadas` point NOT NULL,
  `capacidad_almacen` decimal(3,1) NOT NULL,
  `usuarios_id_encargado` int NOT NULL,
  PRIMARY KEY (`almacenes_id`),
  KEY `fk_almacenes_usuarios1_idx` (`usuarios_id_encargado`),
  CONSTRAINT `fk_almacenes_usuarios1` FOREIGN KEY (`usuarios_id_encargado`) REFERENCES `usuarios` (`usuarios_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `almacenes`
--

LOCK TABLES `almacenes` WRITE;
/*!40000 ALTER TABLE `almacenes` DISABLE KEYS */;
INSERT INTO `almacenes` VALUES (2,'UNIR','Calle','43104','Rioja','Es',_binary '\0\0\0\0\0\0\0Bú¢\œ[D@ytD:ìÄR¿',1.0,26),(3,'UNIR','Calle','43104','Rioja','Es',_binary '\0\0\0\0\0\0\0Bú¢\œ[D@ytD:ìÄR¿',1.0,26);
/*!40000 ALTER TABLE `almacenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `camiones`
--

DROP TABLE IF EXISTS `camiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `camiones` (
  `camiones_id` int NOT NULL AUTO_INCREMENT,
  `matricula_camion` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacidad_maxima` decimal(12,2) NOT NULL,
  `estado` enum('Habilitado','Inactivo','Completo') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`camiones_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `camiones`
--

LOCK TABLES `camiones` WRITE;
/*!40000 ALTER TABLE `camiones` DISABLE KEYS */;
INSERT INTO `camiones` VALUES (2,'ABC1234',40.00,'Habilitado');
/*!40000 ALTER TABLE `camiones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias_materiales`
--

DROP TABLE IF EXISTS `categorias_materiales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias_materiales` (
  `categorias_materiales_id` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `comentario` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`categorias_materiales_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias_materiales`
--

LOCK TABLES `categorias_materiales` WRITE;
/*!40000 ALTER TABLE `categorias_materiales` DISABLE KEYS */;
INSERT INTO `categorias_materiales` VALUES (1,'frutas','frutas frescas');
/*!40000 ALTER TABLE `categorias_materiales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materiales`
--

DROP TABLE IF EXISTS `materiales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materiales` (
  `materiales_id` int NOT NULL AUTO_INCREMENT,
  `estado` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `peso` decimal(12,2) NOT NULL,
  `descripcion_material` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `categorias_materiales_id` int NOT NULL,
  `nombre` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`materiales_id`),
  KEY `fk_materiales_categorias_materiales1_idx` (`categorias_materiales_id`),
  CONSTRAINT `fk_materiales_categorias_materiales1` FOREIGN KEY (`categorias_materiales_id`) REFERENCES `categorias_materiales` (`categorias_materiales_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materiales`
--

LOCK TABLES `materiales` WRITE;
/*!40000 ALTER TABLE `materiales` DISABLE KEYS */;
INSERT INTO `materiales` VALUES (4,'Nuevo',2.38,'Fres√≥n ',1,NULL);
/*!40000 ALTER TABLE `materiales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `pedidos_id` int NOT NULL AUTO_INCREMENT,
  `fecha_salida` datetime DEFAULT NULL,
  `fecha_llegada` datetime DEFAULT NULL,
  `estado_pedido` enum('En revisi√≥n','En preparaci√≥n','En tr√°nsito','Entregado','Cancelado','Aprobado','Rechazado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `medida` decimal(3,1) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `usuarios_id_creador` int NOT NULL,
  `usuarios_id_revisador` int NOT NULL,
  `almacenes_id_origen` int NOT NULL,
  `almacenes_id_destion` int NOT NULL,
  `camiones_id` int NOT NULL,
  `usuario_id_aprobador` int NOT NULL,
  PRIMARY KEY (`pedidos_id`,`usuarios_id_revisador`),
  KEY `fk_pedidos_usuarios1_idx` (`usuarios_id_creador`),
  KEY `fk_pedidos_usuarios2_idx` (`usuarios_id_revisador`),
  KEY `fk_pedidos_almacenes1_idx` (`almacenes_id_origen`),
  KEY `fk_pedidos_almacenes2_idx` (`almacenes_id_destion`),
  KEY `fk_pedidos_camiones1_idx` (`camiones_id`),
  KEY `fk_pedidos_usuarios3_idx` (`usuario_id_aprobador`),
  CONSTRAINT `fk_pedidos_almacenes1` FOREIGN KEY (`almacenes_id_origen`) REFERENCES `almacenes` (`almacenes_id`),
  CONSTRAINT `fk_pedidos_almacenes2` FOREIGN KEY (`almacenes_id_destion`) REFERENCES `almacenes` (`almacenes_id`),
  CONSTRAINT `fk_pedidos_camiones1` FOREIGN KEY (`camiones_id`) REFERENCES `camiones` (`camiones_id`),
  CONSTRAINT `fk_pedidos_usuarios1` FOREIGN KEY (`usuarios_id_creador`) REFERENCES `usuarios` (`usuarios_id`),
  CONSTRAINT `fk_pedidos_usuarios2` FOREIGN KEY (`usuarios_id_revisador`) REFERENCES `usuarios` (`usuarios_id`),
  CONSTRAINT `fk_pedidos_usuarios3` FOREIGN KEY (`usuario_id_aprobador`) REFERENCES `usuarios` (`usuarios_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (3,'2023-06-10 16:30:30','2023-06-10 16:30:30','Entregado',2.3,'2023-06-10 16:30:30',34,27,2,3,2,28),(4,'2023-06-10 17:24:08','2023-06-10 17:24:08','Entregado',2.3,'2023-06-10 17:24:08',34,27,2,3,2,28),(5,'2023-06-10 17:27:09','2023-06-10 17:27:09','Entregado',2.3,'2023-06-10 17:27:09',34,27,2,3,2,28),(6,'2023-06-10 17:31:09','2023-06-10 17:31:09','Entregado',2.3,'2023-06-10 17:31:09',34,27,2,3,2,28),(7,'2023-06-10 17:32:23','2023-06-10 17:32:23','Entregado',2.3,'2023-06-10 17:32:23',34,27,2,3,2,28),(8,'2023-06-10 17:33:12','2023-06-10 17:33:12','Entregado',2.3,'2023-06-10 17:33:12',34,27,2,3,2,28),(9,'2023-06-10 17:33:50','2023-06-10 17:33:50','Entregado',2.3,'2023-06-10 17:33:50',34,27,2,3,2,28),(10,'2023-06-10 17:34:44','2023-06-10 17:34:44','Entregado',2.3,'2023-06-10 17:34:44',34,27,2,3,2,28),(11,'2023-06-10 18:16:11','2023-06-10 18:16:11','Entregado',2.3,'2023-06-10 18:16:11',34,27,2,3,2,28),(12,'2023-06-10 18:41:02','2023-06-10 18:41:02','Entregado',3.1,'2023-06-10 18:41:02',34,27,2,3,2,28);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos_have_stocks`
--

DROP TABLE IF EXISTS `pedidos_have_stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos_have_stocks` (
  `pedidos_id` int NOT NULL,
  `stocks_id` int NOT NULL,
  `unidades_utilizadas` int DEFAULT NULL,
  `posicion` int DEFAULT NULL,
  KEY `fk_pedidos_has_stock_stock1_idx` (`stocks_id`),
  KEY `fk_pedidos_has_stock_pedidos1_idx` (`pedidos_id`),
  CONSTRAINT `fk_pedidos_has_stock_pedidos1` FOREIGN KEY (`pedidos_id`) REFERENCES `pedidos` (`pedidos_id`),
  CONSTRAINT `fk_pedidos_has_stock_stock1` FOREIGN KEY (`stocks_id`) REFERENCES `stocks` (`stocks_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos_have_stocks`
--

LOCK TABLES `pedidos_have_stocks` WRITE;
/*!40000 ALTER TABLE `pedidos_have_stocks` DISABLE KEYS */;
INSERT INTO `pedidos_have_stocks` VALUES (10,3,50,NULL),(10,4,30,NULL),(11,4,30,NULL),(11,3,50,NULL);
/*!40000 ALTER TABLE `pedidos_have_stocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `roles_id` int NOT NULL AUTO_INCREMENT,
  `descripcion_rol` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `responsabilidad` int NOT NULL,
  `comentario` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`roles_id`),
  UNIQUE KEY `unique_description` (`descripcion_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Superusuario',50,NULL),(2,'Jefe de Equipo',40,NULL),(3,'Encargado',30,NULL),(4,'Operario de camion',20,NULL),(17,'Repostador de gasolina',10,'Repone los camiones con gasolina. Limpia los camiones.');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stocks`
--

DROP TABLE IF EXISTS `stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stocks` (
  `stocks_id` int NOT NULL AUTO_INCREMENT,
  `unidades` int DEFAULT NULL,
  `materiales_id` int NOT NULL,
  `almacenes_id` int NOT NULL,
  `posicion` int DEFAULT NULL,
  PRIMARY KEY (`stocks_id`),
  KEY `fk_stock_materiales1_idx` (`materiales_id`),
  KEY `fk_stock_almacenes1_idx` (`almacenes_id`),
  CONSTRAINT `fk_stock_almacenes1` FOREIGN KEY (`almacenes_id`) REFERENCES `almacenes` (`almacenes_id`),
  CONSTRAINT `fk_stock_materiales1` FOREIGN KEY (`materiales_id`) REFERENCES `materiales` (`materiales_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stocks`
--

LOCK TABLES `stocks` WRITE;
/*!40000 ALTER TABLE `stocks` DISABLE KEYS */;
INSERT INTO `stocks` VALUES (3,60,4,3,NULL),(4,60,4,3,NULL),(5,60,4,3,NULL);
/*!40000 ALTER TABLE `stocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `usuarios_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `edad` int DEFAULT NULL,
  `ciudad` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo_postal` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pais` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roles_id` int NOT NULL,
  `usuarios_id_lider` int NOT NULL,
  `imagen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`usuarios_id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `fk_usuarios_rol_idx` (`roles_id`),
  KEY `fk_usuarios_liderado_por` (`usuarios_id_lider`),
  CONSTRAINT `fk_usuarios_liderado_por` FOREIGN KEY (`usuarios_id_lider`) REFERENCES `usuarios` (`usuarios_id`),
  CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`roles_id`) REFERENCES `roles` (`roles_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (19,'super','usuario','superusuario@almacen.es','$2a$08$CGurYqfcr1/BR73zzxR.J.KqSX87mlONkVvbj6.OQc3yV1Dxd.x0G',1,NULL,NULL,NULL,NULL,1,19,NULL,NULL),(20,'super','usuario','superusuario1@almacen.es','$2a$08$ltz1Yt5HmcPqvqkjuq7JbuZTWCDIIuNjNxL1EYK2jET/DkgQoNfXy',1,NULL,NULL,NULL,NULL,1,20,NULL,NULL),(26,'Jefe','Primero','jefedeequipo2@almacen.es','$2a$08$5W4um/Sxxa9qYxACobNckesS1q4uazZDGj4tALgHIdGJDzKrrY3Aa',1,NULL,'Barcelona','08005',NULL,2,7,NULL,NULL),(27,'Encargado','Primero','encargadoprimero@almacen.es','$2a$08$wA9Q81kPfYqpZVdPFdvARek7a/30hfedyyaLp7PEeZVEe7o0PVGFa',1,NULL,'Barcelona','08005',NULL,3,26,NULL,NULL),(28,'Operario','Primero','operarioprimero@almacen.es','$2a$08$GAAByc3GUA0vpEJyV2nomuojakqoQjWdUeCNc/RfJ3PEIRzfkKiS6',1,NULL,'Barcelona','08005',NULL,3,26,NULL,NULL),(31,'pepito','Garrofe','pepitogarrofe@almacen.es','$2a$08$.L1QI6KLtCfySSwhHH0Bn.AqIeMotbSB8ZB26PGHMYFEIzlO7YcA2',1,NULL,'Barcelona','08005',NULL,2,26,NULL,NULL),(33,'transporter','transporter','transporter@almacen.es','$2a$08$PCaQd2/T749BSKB7U9kvvONX7crncNb5UFWhVAdTZ04GPYd/oq14a',1,NULL,'Barcelona','08005',NULL,2,26,NULL,NULL),(34,'cyril','operario','operario@almacen.es','$2a$08$GTcg8mPKblhTAnAShQAglebG6E2dDt9jETxeWcYcRzUMVY3V2KJhi',1,NULL,'Barcelona','08005',NULL,4,26,NULL,NULL),(36,'Pedro','Jimenez','encargado3@almacen.es','$2a$08$zvmU2ofdDDYTH15t/ksGsezpxnfpmaRQtBPiyfuHpRTgadWLLed/S',1,23,'Port d\'Alc√∫dia','07400','Espa√±a',3,26,'https://upload.wikimedia.org/wikipedia/commons/3/38/Rhinoc%C3%A9ros_blanc_JHE.jpg',NULL),(38,'Cyril Joseph','Attie','operario73@almacen.es','$2a$08$n9mj0MKwkVebsIToVgPP0uDvturAiWXb/sPzr96Lm7ZaAreQNlu4.',1,26,'Port d\'Alc√∫dia','07400','Spain',4,26,'https://upload.wikimedia.org/wikipedia/commons/3/38/Rhinoc%C3%A9ros_blanc_JHE.jpg',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-16  5:10:06
