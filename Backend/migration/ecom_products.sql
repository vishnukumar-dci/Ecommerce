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
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(50) DEFAULT NULL,
  `descriptions` varchar(100) DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `image_path` varchar(100) DEFAULT NULL,
  `update_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Mobile Phone','Handhold Devices',10999,'/uploads/1755771721974-mobileimage.jpg','2025-09-03 07:44:46','2025-08-28 10:52:01'),(2,'AC','Home appliances',50000,'/uploads/1756458182336-download.jpg','2025-08-29 09:03:02','2025-08-28 10:52:01'),(3,'Washing Machines','Dishwasher and Home Appliances',25000,'/uploads/1755771786004-washingmachine.jpg','2025-08-28 10:20:57','2025-08-28 10:52:01'),(4,'Moniter','Computer Accessories',10000,'/uploads/1755771845111-moniter.jpg','2025-08-28 10:20:57','2025-08-28 10:52:01'),(5,'Wireless Mouse','2.4 GHZ,Computer Accessories',700,'/uploads/1755771895506-mouse.jpg','2025-09-04 04:53:51','2025-08-28 10:52:01'),(6,'Wireless Headset','Accessories',1500,'/uploads/1755771935093-headset.jpg','2025-08-28 10:20:57','2025-08-28 10:52:01'),(10,'Wallet','Brown Artificial Leather Wallet',350,'/uploads/1756383248321-wallet.jpg','2025-08-28 12:14:08','2025-08-28 10:52:01'),(11,'Water Bottle','500ml Flask ',200,'/uploads/1756377434606-waterbottle.jpg','2025-08-28 10:37:14','2025-08-28 10:52:01'),(12,'Shoulder Bag','Dark Brown Leather Women Shoulder Bag',300,'/uploads/1756383318861-ShoulderBag.jpg','2025-08-28 12:15:18','2025-08-28 10:52:01'),(13,'Mobile Charge Adapter','33w adapter with quick charge supports',300,'/uploads/1756383370103-Adapter.jpg','2025-10-16 10:11:13','2025-08-28 10:52:01'),(14,'Mobile Charger Cable','Data Cable and Type-C',150,'/uploads/1756383385929-Earin.jpg','2025-08-28 12:16:25','2025-08-28 10:52:01'),(15,'Mobile Phone Case','Transparent',180,'/uploads/1756383463188-phonecase.jpg','2025-08-28 12:17:43','2025-08-28 10:54:12'),(16,'Keyboard','26 Anti-Ghosting keys Suppor',600,'/uploads/1756383357282-Keyboard.jpg','2025-08-28 12:15:57','2025-08-28 10:56:00'),(17,'Rolling Chair','Comfort , 360 Rotation',8000,'/uploads/1756383338669-RollingChair.jpg','2025-08-28 12:15:38','2025-08-28 11:09:29'),(18,'Smart Watch','Style,Fitness Tracking and Message Aleart',2500,'/uploads/1756383292275-Smart Watches.jpg','2025-08-28 12:14:52','2025-08-28 11:11:13'),(19,'Analog Watch','Traditional and Leather straps',999,'/uploads/1756379548461-Watch.jpg','2025-09-04 11:03:01','2025-08-28 11:12:28'),(20,'HP Laptop ','Intel i5 1250HX',49999,'/uploads/1756882421884-Laptop.jpeg','2025-09-03 06:57:56','2025-09-03 06:53:41'),(21,'Boat Wired HeadPhone','3.5mm Cable and Pure Bass',399,'/uploads/1756983425589-boatheadset.jpeg','2025-09-04 10:57:42','2025-09-04 10:57:05'),(22,'Iron box','Automatic on&#x2F;off,For all Cloths',500,'/uploads/1758022401712-Ironbox.jpeg','2025-09-16 11:33:21','2025-09-16 05:59:02'),(23,'Ethernet Cable','RJ-45',200,'/uploads/1758022302961-Ethernet Network.jpeg','2025-09-16 11:31:42','2025-09-16 06:26:24'),(24,'asdfasdf','asdf',23,'/uploads/1758024308919-Ethernet Network.jpeg','2025-09-16 12:05:08','2025-09-16 12:05:08'),(25,'asdfq','fd',1000,'/uploads/1758024400227-Ethernet Network.jpeg','2025-09-16 12:06:40','2025-09-16 12:06:40'),(26,'chumma','sdfkn',234567,'/uploads/1758024861774-Ethernet Network.jpeg','2025-09-16 12:14:21','2025-09-16 12:14:21');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-20  8:46:47
