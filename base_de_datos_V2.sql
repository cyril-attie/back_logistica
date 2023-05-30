CREATE DATABASE  IF NOT EXISTS `almacen` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `almacen`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: almacen
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
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
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_almacen` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `calle` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo postal` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `localidad` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pais` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitud` point NOT NULL,
  `longitud` point NOT NULL,
  `capacidad_almacen` decimal(3,1) NOT NULL,
  `encargado_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_almacenes_usuarios1_idx` (`encargado_id`),
  CONSTRAINT `fk_almacenes_usuarios1` FOREIGN KEY (`encargado_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `almacenes`
--

LOCK TABLES `almacenes` WRITE;
/*!40000 ALTER TABLE `almacenes` DISABLE KEYS */;
/*!40000 ALTER TABLE `almacenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `camiones`
--

DROP TABLE IF EXISTS `camiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `camiones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `matricula_camion` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacidad_maxima` decimal(12,2) NOT NULL,
  `estado` enum('Habilitado','Inactivo','Completo') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `camiones`
--

LOCK TABLES `camiones` WRITE;
/*!40000 ALTER TABLE `camiones` DISABLE KEYS */;
/*!40000 ALTER TABLE `camiones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias_materiales`
--

DROP TABLE IF EXISTS `categorias_materiales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias_materiales` (
  `id` int NOT NULL,
  `descripcion` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comentario` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias_materiales`
--

LOCK TABLES `categorias_materiales` WRITE;
/*!40000 ALTER TABLE `categorias_materiales` DISABLE KEYS */;
/*!40000 ALTER TABLE `categorias_materiales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materiales`
--

DROP TABLE IF EXISTS `materiales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materiales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estado` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `peso` decimal(12,2) NOT NULL,
  `descripcion_material` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria_material` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categorias_materiales_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_materiales_categorias_materiales1_idx` (`categorias_materiales_id`),
  CONSTRAINT `fk_materiales_categorias_materiales1` FOREIGN KEY (`categorias_materiales_id`) REFERENCES `categorias_materiales` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materiales`
--

LOCK TABLES `materiales` WRITE;
/*!40000 ALTER TABLE `materiales` DISABLE KEYS */;
/*!40000 ALTER TABLE `materiales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha_salida` datetime DEFAULT NULL,
  `fecha_llegada` datetime DEFAULT NULL,
  `estado_pedido` enum('En revisión','En preparación','En tránsito','Entregado','Cancelado','Aprobado','Rechazado') COLLATE utf8mb4_unicode_ci NOT NULL,
  `medida` decimal(3,1) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `usuarios_id_creador` int NOT NULL,
  `usuarios_id_revisador` int NOT NULL,
  `almacenes_id_origen` int NOT NULL,
  `almacenes_id_destion` int NOT NULL,
  `camiones_id` int NOT NULL,
  `usuario_id_aprobador` int NOT NULL,
  PRIMARY KEY (`id`,`usuarios_id_revisador`),
  KEY `fk_pedidos_usuarios1_idx` (`usuarios_id_creador`),
  KEY `fk_pedidos_usuarios2_idx` (`usuarios_id_revisador`),
  KEY `fk_pedidos_almacenes1_idx` (`almacenes_id_origen`),
  KEY `fk_pedidos_almacenes2_idx` (`almacenes_id_destion`),
  KEY `fk_pedidos_camiones1_idx` (`camiones_id`),
  KEY `fk_pedidos_usuarios3_idx` (`usuario_id_aprobador`),
  CONSTRAINT `fk_pedidos_almacenes1` FOREIGN KEY (`almacenes_id_origen`) REFERENCES `almacenes` (`id`),
  CONSTRAINT `fk_pedidos_almacenes2` FOREIGN KEY (`almacenes_id_destion`) REFERENCES `almacenes` (`id`),
  CONSTRAINT `fk_pedidos_camiones1` FOREIGN KEY (`camiones_id`) REFERENCES `camiones` (`id`),
  CONSTRAINT `fk_pedidos_usuarios1` FOREIGN KEY (`usuarios_id_creador`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `fk_pedidos_usuarios2` FOREIGN KEY (`usuarios_id_revisador`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `fk_pedidos_usuarios3` FOREIGN KEY (`usuario_id_aprobador`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos_has_stock`
--

DROP TABLE IF EXISTS `pedidos_has_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos_has_stock` (
  `id` int NOT NULL,
  `pedidos_id` int NOT NULL,
  `stock_id` int NOT NULL,
  `unidades_utilizadas` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pedidos_has_stock_stock1_idx` (`stock_id`),
  KEY `fk_pedidos_has_stock_pedidos1_idx` (`pedidos_id`),
  CONSTRAINT `fk_pedidos_has_stock_pedidos1` FOREIGN KEY (`pedidos_id`) REFERENCES `pedidos` (`id`),
  CONSTRAINT `fk_pedidos_has_stock_stock1` FOREIGN KEY (`stock_id`) REFERENCES `stock` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos_has_stock`
--

LOCK TABLES `pedidos_has_stock` WRITE;
/*!40000 ALTER TABLE `pedidos_has_stock` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidos_has_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descripcion_rol` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `responsibilidad` int NOT NULL,
  `comentario` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `unidades` int DEFAULT NULL,
  `materiales_id` int NOT NULL,
  `almacenes_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_stock_materiales1_idx` (`materiales_id`),
  KEY `fk_stock_almacenes1_idx` (`almacenes_id`),
  CONSTRAINT `fk_stock_almacenes1` FOREIGN KEY (`almacenes_id`) REFERENCES `almacenes` (`id`),
  CONSTRAINT `fk_stock_materiales1` FOREIGN KEY (`materiales_id`) REFERENCES `materiales` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `edad` int DEFAULT NULL,
  `ciudad` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo_postal` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pais` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rol_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `fk_usuarios_rol_idx` (`rol_id`),
  CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
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

-- Dump completed on 2023-05-29 21:52:11
