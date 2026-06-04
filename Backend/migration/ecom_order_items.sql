CREATE DATABASE  IF NOT EXISTS `ecom` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ecom`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ecom
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `qty` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_status` enum('pending','paid','failed') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,7,3,1,'2025-08-28 05:02:21','paid'),(2,14,2,2,'2025-08-28 05:02:21','paid'),(3,14,5,2,'2025-08-28 05:02:21','paid'),(4,14,2,2,'2025-08-28 05:02:21','paid'),(5,14,5,2,'2025-08-28 05:02:21','paid'),(6,15,2,2,'2025-08-28 05:02:21','paid'),(7,15,5,2,'2025-08-28 05:02:21','paid'),(8,15,4,1,'2025-08-28 05:02:21','paid'),(9,16,3,1,'2025-08-28 05:02:21','paid'),(10,17,5,1,'2025-08-28 05:02:21','paid'),(11,18,6,1,'2025-08-28 05:02:21','paid'),(12,19,5,1,'2025-08-28 05:02:21','paid'),(13,20,3,1,'2025-08-28 05:02:21','paid'),(14,21,5,2,'2025-08-28 05:02:21','paid'),(15,22,4,1,'2025-08-28 05:02:21','paid'),(16,23,1,1,'2025-08-28 05:03:21','paid'),(17,24,5,1,'2025-08-28 05:59:38','paid'),(18,25,5,1,'2025-08-28 06:07:59','paid'),(19,29,10,1,'2025-09-02 09:23:21','paid'),(20,29,12,1,'2025-09-02 09:23:21','paid'),(21,30,14,1,'2025-09-02 10:49:29','paid'),(22,37,15,2,'2025-09-03 07:34:06','paid'),(23,37,11,1,'2025-09-03 07:34:06','paid'),(24,41,14,3,'2025-09-04 05:53:13','paid'),(25,41,11,1,'2025-09-04 05:53:13','paid'),(26,41,3,1,'2025-09-04 05:53:13','paid'),(27,44,18,1,'2025-09-04 06:01:37','paid'),(33,50,6,1,'2025-09-04 07:30:01','paid'),(34,50,10,1,'2025-09-04 07:30:01','paid'),(35,51,20,1,'2025-09-04 07:47:24','paid'),(36,52,6,1,'2025-09-04 07:58:39','paid'),(37,52,10,1,'2025-09-04 07:58:39','paid'),(38,52,11,1,'2025-09-04 07:58:39','paid'),(39,52,16,1,'2025-09-04 07:58:39','paid'),(40,53,14,1,'2025-09-04 08:10:32','paid'),(41,54,3,1,'2025-09-04 08:32:18','pending'),(42,55,13,1,'2025-09-04 08:47:47','paid'),(43,56,14,1,'2025-09-05 05:47:56','pending'),(44,57,14,1,'2025-09-05 05:48:51','pending'),(45,58,14,1,'2025-09-05 05:49:01','pending'),(46,59,10,1,'2025-09-05 05:49:20','pending'),(47,59,11,1,'2025-09-05 05:49:20','pending'),(48,59,14,2,'2025-09-05 05:49:20','pending'),(49,59,15,1,'2025-09-05 05:49:20','pending'),(50,60,15,1,'2025-09-05 05:52:52','pending'),(51,61,15,1,'2025-09-05 05:54:05','pending'),(52,62,10,1,'2025-09-05 05:54:40','pending'),(53,62,11,1,'2025-09-05 05:54:40','pending'),(54,62,14,2,'2025-09-05 05:54:40','pending'),(55,62,15,1,'2025-09-05 05:54:40','pending'),(56,63,10,1,'2025-09-05 05:55:51','paid'),(57,63,11,1,'2025-09-05 05:55:51','paid'),(58,63,14,2,'2025-09-05 05:55:51','paid'),(59,63,15,1,'2025-09-05 05:55:51','paid'),(60,64,21,1,'2025-09-05 06:19:34','failed'),(61,64,16,1,'2025-09-05 06:19:34','failed'),(62,65,21,1,'2025-09-05 06:20:04','failed'),(63,65,16,1,'2025-09-05 06:20:04','failed'),(64,66,21,1,'2025-09-05 06:20:29','pending'),(65,67,20,1,'2025-09-05 06:25:04','paid'),(66,68,3,1,'2025-09-05 11:37:58','paid'),(67,69,10,1,'2025-09-09 06:36:11','pending'),(68,70,14,1,'2025-09-09 06:41:30','paid'),(69,70,11,1,'2025-09-09 06:41:30','paid'),(70,70,1,1,'2025-09-09 06:41:30','paid'),(71,70,5,1,'2025-09-09 06:41:30','paid'),(72,71,5,1,'2025-09-09 06:57:05','paid'),(73,72,21,1,'2025-09-09 07:04:11','paid'),(74,73,4,1,'2025-09-09 07:25:43','paid'),(75,74,3,1,'2025-09-09 07:41:31','paid'),(76,74,17,1,'2025-09-09 07:41:31','paid'),(77,74,20,1,'2025-09-09 07:41:31','paid'),(78,75,11,1,'2025-09-09 07:44:30','paid'),(79,76,16,1,'2025-09-09 07:48:45','paid'),(80,77,14,1,'2025-09-09 08:17:31','pending'),(81,78,10,1,'2025-09-09 09:18:57','pending'),(82,78,3,2,'2025-09-09 09:18:57','pending'),(83,79,10,1,'2025-09-09 09:20:14','paid'),(84,79,3,2,'2025-09-09 09:20:14','paid'),(85,80,11,1,'2025-09-09 09:24:34','pending'),(86,81,16,1,'2025-09-09 09:35:52','paid'),(87,82,1,1,'2025-09-09 09:56:34','paid'),(88,83,16,1,'2025-09-09 09:58:01','pending'),(89,84,21,1,'2025-09-09 10:09:39','paid'),(90,85,12,1,'2025-09-09 10:40:48','pending'),(91,86,2,1,'2025-09-09 12:34:26','paid'),(92,87,3,1,'2025-10-16 10:14:39','pending'),(93,87,4,1,'2025-10-16 10:14:39','pending');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-20  8:46:48
