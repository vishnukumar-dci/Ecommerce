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
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_status` enum('pending','paid','declined','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (7,2,25000.00,'paid','2025-08-22 09:11:27'),(8,3,1000.00,'paid','2025-08-25 08:43:04'),(11,3,12000.00,'paid','2025-08-26 08:14:45'),(12,3,12000.00,'paid','2025-08-26 08:16:54'),(13,3,12000.00,'paid','2025-08-26 08:19:12'),(14,3,10000.00,'paid','2025-08-26 08:23:07'),(15,3,1500.00,'paid','2025-08-26 08:29:55'),(16,3,25000.00,'paid','2025-08-26 08:32:26'),(17,2,750.00,'paid','2025-08-26 08:41:37'),(18,3,1500.00,'paid','2025-08-26 08:46:39'),(19,2,750.00,'paid','2025-08-26 09:07:06'),(20,3,25000.00,'paid','2025-08-26 10:10:48'),(21,3,750.00,'paid','2025-08-26 12:26:00'),(22,4,10000.00,'paid','2025-08-28 04:59:01'),(23,4,12000.00,'paid','2025-08-28 05:02:48'),(24,4,750.00,'paid','2025-08-28 05:59:07'),(25,5,750.00,'paid','2025-08-28 06:07:17'),(26,1,NULL,'pending','2025-08-28 07:17:02'),(27,1,NULL,'pending','2025-08-28 07:17:22'),(28,5,NULL,'pending','2025-09-02 06:09:35'),(29,4,650.00,'paid','2025-09-02 09:21:44'),(30,4,0.00,'declined','2025-09-02 09:26:48'),(31,6,NULL,'pending','2025-09-03 07:12:21'),(32,6,NULL,'pending','2025-09-03 07:13:04'),(33,6,NULL,'pending','2025-09-03 07:19:10'),(34,6,NULL,'pending','2025-09-03 07:27:17'),(35,6,NULL,'pending','2025-09-03 07:32:49'),(36,6,NULL,'pending','2025-09-03 07:32:53'),(37,6,200.00,'paid','2025-09-03 07:33:28'),(38,5,NULL,'pending','2025-09-04 05:30:56'),(39,5,NULL,'pending','2025-09-04 05:35:46'),(40,5,NULL,'pending','2025-09-04 05:40:21'),(41,5,150.00,'paid','2025-09-04 05:44:18'),(42,5,150.00,'paid','2025-09-04 05:54:35'),(43,5,NULL,'pending','2025-09-04 06:00:09'),(44,5,2500.00,'paid','2025-09-04 06:00:25'),(45,5,NULL,'pending','2025-09-04 07:07:30'),(47,5,25000.00,'paid','2025-09-04 07:11:44'),(48,7,850.00,'paid','2025-09-04 07:17:17'),(49,8,NULL,'pending','2025-09-04 07:26:58'),(50,8,1850.00,'paid','2025-09-04 07:30:01'),(51,8,49999.00,'paid','2025-09-04 07:47:24'),(52,8,600.00,'paid','2025-09-04 07:58:39'),(53,8,150.00,'paid','2025-09-04 08:10:32'),(54,5,0.00,'declined','2025-09-04 08:32:18'),(55,5,300.00,'paid','2025-09-04 08:47:47'),(56,7,NULL,'pending','2025-09-05 05:47:56'),(57,7,NULL,'pending','2025-09-05 05:48:51'),(58,7,NULL,'pending','2025-09-05 05:49:01'),(59,7,0.00,'declined','2025-09-05 05:49:20'),(60,7,NULL,'pending','2025-09-05 05:52:52'),(61,7,NULL,'pending','2025-09-05 05:54:05'),(62,7,NULL,'pending','2025-09-05 05:54:40'),(63,7,330.00,'paid','2025-09-05 05:55:51'),(64,7,0.00,'declined','2025-09-05 06:19:34'),(65,7,0.00,'declined','2025-09-05 06:20:04'),(66,7,NULL,'pending','2025-09-05 06:20:29'),(67,7,49999.00,'paid','2025-09-05 06:25:04'),(68,4,25000.00,'paid','2025-09-05 11:37:58'),(69,4,NULL,'pending','2025-09-09 06:36:11'),(70,4,11699.00,'paid','2025-09-09 06:41:30'),(71,6,700.00,'paid','2025-09-09 06:57:05'),(72,6,399.00,'paid','2025-09-09 07:04:11'),(73,8,10000.00,'paid','2025-09-09 07:25:43'),(74,5,49999.00,'paid','2025-09-09 07:41:31'),(75,5,200.00,'paid','2025-09-09 07:44:30'),(76,3,600.00,'paid','2025-09-09 07:48:45'),(77,3,NULL,'pending','2025-09-09 08:17:31'),(78,3,NULL,'pending','2025-09-09 09:18:57'),(79,3,25000.00,'paid','2025-09-09 09:20:14'),(80,3,NULL,'cancelled','2025-09-09 09:24:34'),(81,2,600.00,'paid','2025-09-09 09:35:52'),(82,2,10999.00,'paid','2025-09-09 09:56:34'),(83,2,NULL,'declined','2025-09-09 09:58:01'),(84,7,399.00,'paid','2025-09-09 10:09:39'),(85,7,NULL,'cancelled','2025-09-09 10:40:48'),(86,3,50000.00,'paid','2025-09-09 12:34:26'),(87,3,NULL,'pending','2025-10-16 10:14:39');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
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
