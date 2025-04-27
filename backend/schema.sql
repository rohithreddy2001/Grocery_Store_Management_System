-- MySQL dump 10.13  Distrib 8.2.0, for Win64 (x86_64)
--
-- Host: localhost    Database: grocery_store
-- ------------------------------------------------------
-- Server version	8.2.0

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

USE defaultdb;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` double NOT NULL,
  `uom_id` int DEFAULT NULL,
  `total_price` double NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`,`product_id`),
  KEY `fk_product_id_idx` (`product_id`),
  KEY `fk_order_details_uom` (`uom_id`),
  CONSTRAINT `fk_order_details_uom` FOREIGN KEY (`uom_id`) REFERENCES `uom` (`uom_id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `fk_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (1,57,6,5,2,100),(2,57,23,3,2,297),(3,57,7,6,1,180),(4,58,12,1,2,49),(5,59,9,1,1,35),(6,59,20,1,2,100),(7,60,2,4,2,596),(8,60,12,3,2,147),(9,61,6,3,2,60),(10,61,12,2,2,98),(11,62,9,2,2,70),(12,62,7,6,1,180),(13,63,6,4,2,80),(14,63,8,4,2,160),(15,63,24,3,2,210),(16,64,23,3,2,297),(17,64,12,5,2,245),(18,64,6,3,2,60),(19,65,21,3,1,90),(20,66,23,1,2,149),(21,67,7,6,1,240),(22,68,23,2,2,240),(23,68,7,6,1,240),(24,69,20,5,1,500),(25,69,6,8,2,160),(26,69,2,5,2,745),(27,69,9,2,2,60),(28,69,12,4,2,236),(29,70,2,5,2,600),(30,70,12,4,2,320),(31,70,6,5,2,100),(32,71,2,5,2,600),(33,71,28,3,1,267),(34,71,7,6,1,240),(35,72,25,3,1,447),(36,73,12,3,2,240),(37,73,8,2,2,90),(38,73,31,5,1,50),(39,74,6,10,2,200),(40,74,30,10,1,200),(41,75,2,10,2,1200),(42,75,20,4,1,400),(43,76,29,5,1,300),(44,76,7,6,1,240),(45,77,25,2,1,298),(46,77,5,10,1,100),(47,78,20,3,2,300),(48,78,30,10,1,200),(49,79,12,3,2,240),(50,79,33,4,1,120),(51,80,30,5,1,100),(52,80,32,5,2,650);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(100) NOT NULL,
  `total` double NOT NULL,
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (57,'Rohith Reddy',577,'2025-04-19 12:42:56'),(58,'Bablu',49,'2025-04-19 16:01:28'),(59,'Rohan',135,'2025-04-19 16:02:22'),(60,'Iftequer',743,'2025-04-19 16:05:44'),(61,'Prem',158,'2025-04-19 16:12:55'),(62,'Aadithya',250,'2025-04-19 16:15:58'),(63,'Vinay',450,'2025-04-19 18:13:47'),(64,'Tarun',602,'2025-04-19 19:17:39'),(65,'Savan',90,'2025-04-20 14:53:01'),(66,'Akhil',149,'2025-04-23 12:59:54'),(67,'Shiva',240,'2025-04-23 13:05:29'),(68,'Nikshith',480,'2025-04-23 18:31:40'),(69,'Nithish',1701,'2025-04-23 22:46:23'),(70,'Sathish',1020,'2025-04-23 23:09:17'),(71,'Nithin',1107,'2025-04-25 15:58:12'),(72,'Pranav',447,'2025-04-25 16:01:01'),(73,'Karthik',380,'2025-04-26 11:43:49'),(74,'Ishan',400,'2025-04-26 11:47:26'),(75,'Ram',1600,'2025-04-26 11:48:57'),(76,'Nani',540,'2025-04-26 11:50:58'),(77,'Tarak',398,'2025-04-26 11:52:57'),(78,'Rakesh',500,'2025-04-26 11:54:40'),(79,'Venky',360,'2025-04-26 19:48:16'),(80,'Arya',750,'2025-04-26 23:12:40');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `uom_id` int NOT NULL,
  `price_per_unit` double NOT NULL,
  PRIMARY KEY (`product_id`),
  KEY `fk_uom_id_idx` (`uom_id`),
  CONSTRAINT `fk_uom_id` FOREIGN KEY (`uom_id`) REFERENCES `uom` (`uom_id`) ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Tooth Paste',1,50),(2,'Rice',2,120),(5,'Moong Daal',1,10),(6,'Onions',2,20),(7,'Apples',1,40),(8,'Bananas (Dozen)',1,40),(9,'Potatos',2,30),(10,'Dish Washer',1,25),(12,'Daal',2,80),(13,'Tooth Brush',1,40),(14,'Oranges',1,20),(20,'Tata Salt',2,100),(21,'Chat Masala Powder',1,35),(23,'Tea Powder',2,120),(24,'Sugar',2,60),(25,'Head and Shoulders Shampoo',1,149),(26,'Tomato',2,35),(27,'Carrots',2,35),(28,'Coffee Powder',2,89),(29,'Mysore Sandal Body Soap',1,60),(30,'Krack Jack Biscuits',1,20),(31,'Good Day Biscuits',1,10),(32,'Kaaju',2,130),(33,'Milk 1/2 Liter',1,30),(34,'Mangoes',1,20),(35,'Pineapple',1,65);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uom`
--

DROP TABLE IF EXISTS `uom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uom` (
  `uom_id` int NOT NULL AUTO_INCREMENT,
  `uom_name` varchar(100) NOT NULL,
  PRIMARY KEY (`uom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uom`
--

LOCK TABLES `uom` WRITE;
/*!40000 ALTER TABLE `uom` DISABLE KEYS */;
INSERT INTO `uom` VALUES (1,'Each'),(2,'Kg');
/*!40000 ALTER TABLE `uom` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-27 11:31:22