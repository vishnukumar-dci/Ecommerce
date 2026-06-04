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
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `email` varchar(20) DEFAULT NULL,
  `passwords` varchar(100) DEFAULT NULL,
  `roles` enum('admin','user') DEFAULT 'user',
  `image_path` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'Arun','arun@gmail.com','$2b$10$sYMbF0kJzVoSJDZiu2XnqOAQGjH60N3HUouYzNhNt/WgsWo98J0lG','admin',NULL,'2025-08-29 08:35:57','2025-09-03 07:11:02'),(2,'dinesh','dinesh@gmail.com','$2b$10$.Kq/6ESxcph/g/zVHt0x2eGq0OvQMf182MhjsJTN.dhgEw5zeZ5kW','user',NULL,'2025-08-29 08:35:57','2025-08-29 08:36:01'),(3,'alia','alia@gmail.com','$2b$10$4yFhjfn4.bQxkrnpwMsidO/I6Kq9iKCVSm1WSdAcGHw3ZrUEtqJJ2','user',NULL,'2025-08-29 08:35:57','2025-09-01 08:34:18'),(4,'Yogesh','yogesh@gmail.com','$2b$10$h7Mb/pEAwyT06M72pHGI8OCnyAEePgnR0fUwhS6bBxfAmFwLfb1ze','user',NULL,'2025-08-29 08:35:57','2025-09-03 07:43:23'),(5,'vishnu','vishnu@gmail.com','$2b$10$T07HZ7x/4MC0Q/zAU1NUxOac6K.wPPzoFEOJ93BsI8yx4eVB5hBgC','user','/uploads/profile/1757055324065-image.png.jpeg','2025-08-29 08:35:57','2025-09-05 06:55:24'),(6,'Abinaya','abinaya@gmail.com','$2b$10$ovb8FayfgAVjoaSv5Jv6ou5Gfj1R7SnOzu30I4TAJT2hSLWjxHPhC','user',NULL,'2025-09-03 06:20:52','2025-09-03 07:18:49'),(7,'sanjay','sanjay@gmail.com','$2b$10$XIY0dVSZd.h1ZnNXN/0Xc.vFZ1VisMPmASFXXCYznCGd1qp5ZDdKO','user',NULL,'2025-09-04 07:16:43','2025-09-04 07:16:43'),(8,'Dharani','dharani@gmail.com','$2b$10$yoFm87OfCsKx9VKCG0QS0uNa6dacI.SZsO8WeTyyxYishm7alzR3m','user',NULL,'2025-09-04 07:26:30','2025-09-04 07:26:30'),(9,'alia','vasu@gmail.com','$2b$10$EtPFWaHoK7vMu0MUgO9iHebNhDXOPdJGDI8nr.GxwW295Cf3TwrAy','user',NULL,'2025-11-15 14:49:13','2025-11-15 14:49:13');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
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
