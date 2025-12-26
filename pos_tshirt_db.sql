-- MySQL dump 10.13  Distrib 8.0.38, for macos14 (arm64)
--
-- Host: 127.0.0.1    Database: pos_tshirt_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.28-MariaDB

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
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (10,'media/brands/1764976224_Screenshot 2025-12-06 at 12.10.05 AM.png','Griffa Store',NULL,1,'2025-11-25 20:42:50','2025-12-06 04:10:24');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'media/categories/1765032423_Screenshot 2025-12-06 at 12.10.05 AM.png','Autre',NULL,1,'2025-11-25 20:42:50','2025-12-06 19:47:03'),(2,'media/categories/1765030533_pngegg (1).png','T-Shirt',NULL,1,'2025-11-25 20:42:50','2025-12-06 19:15:33'),(10,'media/categories/1765030972_580b57fbd9996e24bc43bf2c.png','Veste',NULL,1,'2025-11-25 20:42:50','2025-12-06 19:22:52'),(11,'media/categories/1765030985_pngegg (2).png','Jeans',NULL,1,'2025-12-06 19:23:05','2025-12-06 19:23:05'),(12,'media/categories/1765032284_359-3597163_continental-80-core-black-hi-res-chaussure-berluti.png','Chaussures',NULL,1,'2025-12-06 19:25:01','2025-12-06 19:44:44'),(13,'media/categories/1765032321_vecteezy_ai-generated-black-blank-hoodie-mockup-isolated-on_34926617.png','Sweet',NULL,1,'2025-12-06 19:25:05','2025-12-06 19:45:21'),(15,'media/categories/1765032084_vecteezy_ai-generated-brown-trousers-isolated-on-transparent-background_36083621 (1).png','Survêtement',NULL,1,'2025-12-06 19:28:32','2025-12-06 19:41:24');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currencies`
--

DROP TABLE IF EXISTS `currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currencies` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `symbol` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `currencies_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currencies`
--

LOCK TABLES `currencies` WRITE;
/*!40000 ALTER TABLE `currencies` DISABLE KEYS */;
INSERT INTO `currencies` VALUES (1,'US Dollar','USD','$',0,'2025-11-25 20:42:49','2025-11-25 20:42:49'),(2,'Euro','EUR','€',0,'2025-11-25 20:42:49','2025-11-25 20:42:49'),(50,'Dinar','DA','د.ج',1,'2025-11-26 00:14:05','2025-11-26 00:14:21');
/*!40000 ALTER TABLE `currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `credit` double(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customers_phone_unique` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Walking Customer','012345678',NULL,'2025-11-25 20:42:49','2025-11-25 20:42:49',0.00),(12,'BELMOKHTAR IDIR','0556109446','Naciria, Bouassem','2025-11-26 00:08:35','2025-11-26 00:08:35',0.00),(68,'weeweq wqeqwe','123123123',NULL,'2025-12-24 18:11:38','2025-12-24 18:11:38',8500.00),(69,'dddddd','232132',NULL,'2025-12-24 18:36:53','2025-12-24 18:36:53',11000.00);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forget_passwords`
--

DROP TABLE IF EXISTS `forget_passwords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forget_passwords` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `otp` int(11) DEFAULT NULL,
  `failed_attempt` smallint(6) NOT NULL DEFAULT 0,
  `token` varchar(255) DEFAULT NULL,
  `suspend_duration` varchar(255) NOT NULL DEFAULT '0',
  `resent_count` smallint(6) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `forget_passwords_user_id_unique` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forget_passwords`
--

LOCK TABLES `forget_passwords` WRITE;
/*!40000 ALTER TABLE `forget_passwords` DISABLE KEYS */;
/*!40000 ALTER TABLE `forget_passwords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1),(2,'2014_10_12_100000_create_password_reset_tokens_table',1),(3,'2019_08_19_000000_create_failed_jobs_table',1),(4,'2019_12_14_000001_create_personal_access_tokens_table',1),(5,'2023_05_11_051813_create_forget_passwords_table',1),(6,'2023_07_18_170442_create_permission_tables',1),(7,'2024_09_10_161412_create_categories_table',1),(8,'2024_09_10_161420_create_brands_table',1),(9,'2024_09_10_161421_create_units_table',1),(10,'2024_09_10_161422_create_products_table',1),(11,'2024_09_10_161609_create_pos_carts_table',1),(12,'2024_09_10_161620_create_customers_table',1),(13,'2024_09_10_161625_create_orders_table',1),(14,'2024_09_10_161633_create_order_products_table',1),(15,'2024_10_15_144038_create_order_transactions_table',1),(16,'2024_10_16_123030_create_suppliers_table',1),(17,'2024_10_16_173030_create_purchases_table',1),(18,'2024_10_16_190049_create_purchase_items_table',1),(19,'2024_10_31_105132_create_currencies_table',1),(20,'2025_03_24_105855_modify_discount_columns_in_products_table',1),(21,'2025_11_30_044625_add_discount_to_pos_carts_table',2),(23,'2025_12_07_032307_add_credit_to_customers_table',3);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_permissions`
--

LOCK TABLES `model_has_permissions` WRITE;
/*!40000 ALTER TABLE `model_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_roles`
--

LOCK TABLES `model_has_roles` WRITE;
/*!40000 ALTER TABLE `model_has_roles` DISABLE KEYS */;
INSERT INTO `model_has_roles` VALUES (1,'App\\Models\\User',1),(2,'App\\Models\\User',2),(3,'App\\Models\\User',3),(4,'App\\Models\\User',5),(5,'App\\Models\\User',6);
/*!40000 ALTER TABLE `model_has_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_products`
--

DROP TABLE IF EXISTS `order_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_products` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) unsigned NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` double NOT NULL DEFAULT 0,
  `purchase_price` double NOT NULL DEFAULT 0,
  `discount` double NOT NULL DEFAULT 0,
  `sub_total` double NOT NULL DEFAULT 0,
  `total` double NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_products_order_id_foreign` (`order_id`),
  KEY `order_products_product_id_foreign` (`product_id`),
  CONSTRAINT `order_products_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_products_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=225 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_products`
--

LOCK TABLES `order_products` WRITE;
/*!40000 ALTER TABLE `order_products` DISABLE KEYS */;
INSERT INTO `order_products` VALUES (193,114,66,2,1500,1000,0,3000,3000,'2025-12-06 20:49:02','2025-12-06 20:49:02'),(194,114,53,2,4000,2000,0,8000,8000,'2025-12-06 20:49:02','2025-12-06 20:49:02'),(195,115,1,1,7000,5000,1000,7000,7000,'2025-12-06 20:49:47','2025-12-06 20:49:47'),(196,116,66,2,1500,1000,0,3000,3000,'2025-12-07 02:13:02','2025-12-07 02:13:02'),(197,117,66,3,1500,1000,0,4500,4500,'2025-12-07 03:24:18','2025-12-07 03:24:18'),(198,118,66,3,1500,1000,0,4500,4500,'2025-12-07 04:41:33','2025-12-07 04:41:33'),(199,119,66,3,1500,1000,0,4500,4500,'2025-12-07 04:41:35','2025-12-07 04:41:35'),(200,120,66,7,1500,1000,0,10500,10500,'2025-12-11 22:00:24','2025-12-11 22:00:24'),(201,120,53,2,4000,2000,0,8000,8000,'2025-12-11 22:00:24','2025-12-11 22:00:24'),(202,121,53,3,4000,2000,0,12000,12000,'2025-12-11 22:00:31','2025-12-11 22:00:31'),(203,122,66,2,1500,1000,0,3000,3000,'2025-12-14 21:25:26','2025-12-14 21:25:26'),(204,122,53,4,4000,2000,0,16000,16000,'2025-12-14 21:25:26','2025-12-14 21:25:26'),(205,123,66,2,1500,1000,0,3000,3000,'2025-12-14 21:27:08','2025-12-14 21:27:08'),(206,123,53,1,4000,2000,0,4000,4000,'2025-12-14 21:27:08','2025-12-14 21:27:08'),(207,124,66,2,1500,1000,0,3000,3000,'2025-12-14 21:39:12','2025-12-14 21:39:12'),(208,125,53,2,4000,2000,0,8000,8000,'2025-12-14 21:39:27','2025-12-14 21:39:27'),(209,126,66,2,1500,1000,0,3000,3000,'2025-12-20 11:03:35','2025-12-20 11:03:35'),(210,127,66,3,1500,1000,0,4500,4500,'2025-12-20 11:13:47','2025-12-20 11:13:47'),(216,133,66,2,1500,1000,0,3000,3000,'2025-12-24 18:35:52','2025-12-24 18:35:52'),(217,133,53,1,4000,2000,0,4000,4000,'2025-12-24 18:35:52','2025-12-24 18:35:52'),(218,134,53,9,4000,2000,0,36000,36000,'2025-12-24 18:36:20','2025-12-24 18:36:20'),(219,135,66,2,1500,1000,0,3000,3000,'2025-12-24 18:36:53','2025-12-24 18:36:53'),(220,135,53,2,4000,2000,0,8000,8000,'2025-12-24 18:36:53','2025-12-24 18:36:53'),(221,136,66,5,1500,1000,0,7500,7500,'2025-12-24 18:37:56','2025-12-24 18:37:56'),(222,137,66,4,1500,1000,0,6000,6000,'2025-12-24 18:56:19','2025-12-24 18:56:19'),(223,137,53,1,4000,2000,0,4000,4000,'2025-12-24 18:56:19','2025-12-24 18:56:19'),(224,138,53,3,4000,2000,0,12000,12000,'2025-12-24 18:59:28','2025-12-24 18:59:28');
/*!40000 ALTER TABLE `order_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_transactions`
--

DROP TABLE IF EXISTS `order_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_transactions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `amount` double(10,2) unsigned NOT NULL,
  `order_id` bigint(20) unsigned NOT NULL,
  `customer_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `paid_by` varchar(255) NOT NULL COMMENT 'bank,cash,card',
  `transaction_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_transactions_order_id_foreign` (`order_id`),
  KEY `order_transactions_customer_id_foreign` (`customer_id`),
  KEY `order_transactions_user_id_foreign` (`user_id`),
  CONSTRAINT `order_transactions_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_transactions_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_transactions`
--

LOCK TABLES `order_transactions` WRITE;
/*!40000 ALTER TABLE `order_transactions` DISABLE KEYS */;
INSERT INTO `order_transactions` VALUES (4,1000.00,116,1,1,'cash',NULL,'2025-12-07 02:13:02','2025-12-07 02:13:02');
/*!40000 ALTER TABLE `order_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `customer_id` bigint(20) unsigned NOT NULL,
  `discount` double NOT NULL DEFAULT 0,
  `sub_total` double NOT NULL DEFAULT 0 COMMENT 'sumOf(total) from order_products table',
  `total` double NOT NULL DEFAULT 0 COMMENT 'sub_total - discount',
  `paid` double NOT NULL DEFAULT 0 COMMENT 'customer paid amount',
  `due` double NOT NULL DEFAULT 0 COMMENT 'total - paid',
  `note` text DEFAULT NULL,
  `is_returned` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_user_id_foreign` (`user_id`),
  KEY `orders_customer_id_foreign` (`customer_id`),
  CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (114,6,1,0,11000,11000,0,11000,NULL,0,0,'2025-12-06 20:49:02','2025-12-06 20:49:02'),(115,6,1,1000,7000,6000,0,6000,NULL,0,0,'2025-12-06 20:49:47','2025-12-06 20:49:47'),(116,1,1,0,3000,3000,1000,2000,NULL,0,0,'2025-12-07 02:13:02','2025-12-07 02:13:02'),(117,1,1,0,4500,4500,0,4500,NULL,0,0,'2025-12-07 03:24:18','2025-12-07 03:24:18'),(118,1,1,0,4500,4500,0,4500,NULL,0,0,'2025-12-07 04:41:33','2025-12-07 04:41:33'),(119,1,1,0,4500,4500,0,4500,NULL,0,0,'2025-12-07 04:41:35','2025-12-07 04:41:35'),(120,2,1,0,18500,18500,0,18500,NULL,0,0,'2025-12-11 22:00:24','2025-12-11 22:00:24'),(121,2,1,0,12000,12000,0,12000,NULL,0,0,'2025-12-11 22:00:31','2025-12-11 22:00:31'),(122,6,1,0,19000,19000,0,19000,NULL,0,0,'2025-12-14 21:25:26','2025-12-14 21:25:26'),(123,6,1,0,7000,7000,0,7000,NULL,0,0,'2025-12-14 21:27:08','2025-12-14 21:27:08'),(124,6,1,0,3000,3000,0,3000,NULL,0,0,'2025-12-14 21:39:12','2025-12-14 21:39:12'),(125,6,1,0,8000,8000,0,8000,NULL,0,0,'2025-12-14 21:39:27','2025-12-14 21:39:27'),(126,1,1,0,3000,3000,0,3000,NULL,0,0,'2025-12-20 11:03:35','2025-12-20 11:03:35'),(127,1,1,0,4500,4500,0,4500,NULL,0,0,'2025-12-20 11:13:47','2025-12-20 11:13:47'),(133,1,1,0,7000,7000,0,7000,NULL,0,0,'2025-12-24 18:35:52','2025-12-24 18:35:52'),(134,1,1,12000,36000,24000,0,24000,NULL,0,0,'2025-12-24 18:36:20','2025-12-24 18:36:20'),(135,1,69,0,11000,11000,0,11000,NULL,0,0,'2025-12-24 18:36:53','2025-12-24 18:36:53'),(136,1,1,0,7500,7500,0,7500,NULL,0,0,'2025-12-24 18:37:56','2025-12-24 18:37:56'),(137,1,1,0,10000,10000,0,10000,NULL,0,0,'2025-12-24 18:56:19','2025-12-24 18:56:19'),(138,1,1,0,12000,12000,0,12000,NULL,0,0,'2025-12-24 18:59:28','2025-12-24 18:59:28');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'dashboard_view','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(2,'customer_create','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(3,'customer_view','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(4,'customer_update','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(5,'customer_delete','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(6,'customer_sales','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(7,'supplier_view','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(8,'supplier_create','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(9,'supplier_update','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(10,'supplier_delete','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(11,'product_create','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(12,'product_view','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(13,'product_update','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(14,'product_delete','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(15,'product_import','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(16,'brand_create','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(17,'brand_view','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(18,'brand_update','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(19,'brand_delete','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(20,'category_create','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(21,'category_view','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(22,'category_update','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(23,'category_delete','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(24,'unit_create','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(25,'unit_view','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(26,'unit_update','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(27,'unit_delete','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(28,'sale_create','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(29,'sale_view','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(30,'sale_update','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(31,'sale_delete','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(32,'purchase_create','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(33,'purchase_view','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(34,'purchase_update','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(35,'purchase_delete','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(36,'reports_summary','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(37,'reports_sales','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(38,'reports_inventory','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(39,'currency_create','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(40,'currency_view','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(41,'currency_update','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(42,'currency_delete','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(43,'currency_set_default','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(44,'role_create','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(45,'role_view','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(46,'role_update','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(47,'role_delete','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(48,'permission_view','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(49,'user_create','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(50,'user_view','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(51,'user_update','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(52,'user_delete','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(53,'user_suspend','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(54,'website_settings','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(55,'contact_settings','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(56,'socials_settings','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(57,'style_settings','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(58,'custom_settings','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(59,'notification_settings','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(60,'website_status_settings','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(61,'invoice_settings','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(62,'product_purchase','web','2025-11-25 20:42:50','2025-11-25 20:42:50'),(63,'sale_edit','web','2025-11-25 20:42:50','2025-11-25 20:42:50');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pos_carts`
--

DROP TABLE IF EXISTS `pos_carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pos_carts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `discount` double(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pos_carts_product_id_foreign` (`product_id`),
  KEY `pos_carts_user_id_foreign` (`user_id`),
  CONSTRAINT `pos_carts_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pos_carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=694 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pos_carts`
--

LOCK TABLES `pos_carts` WRITE;
/*!40000 ALTER TABLE `pos_carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `pos_carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `sku` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category_id` bigint(20) unsigned DEFAULT NULL,
  `brand_id` bigint(20) unsigned DEFAULT NULL,
  `unit_id` bigint(20) unsigned DEFAULT NULL,
  `price` double(10,2) NOT NULL DEFAULT 0.00,
  `discount` double(10,2) DEFAULT NULL,
  `discount_type` varchar(255) DEFAULT NULL,
  `purchase_price` double(10,2) NOT NULL DEFAULT 0.00,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `expire_date` date DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  UNIQUE KEY `products_sku_unique` (`sku`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `products_brand_id_foreign` (`brand_id`),
  KEY `products_unit_id_foreign` (`unit_id`),
  CONSTRAINT `products_brand_id_foreign` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'','Veste adidas','deleniti-voluptas-error-ratione-inventore-enim-occaecati','N00001',NULL,10,NULL,NULL,7000.00,0.00,'percentage',5000.00,50,'2026-10-21',1,'2025-11-25 20:42:50','2025-12-06 20:49:47'),(2,'media/products/1765032614_vecteezy_ai-generated-brown-trousers-isolated-on-transparent-background_36083621 (1).png','Pantalon','qui-at-nulla-porro-beatae-qui-enim','N00002',NULL,11,10,NULL,3000.00,0.00,'fixed',1500.00,61,'2026-11-02',1,'2025-11-25 20:42:50','2025-12-20 11:43:42'),(53,'media/products/1765032538_580b57fbd9996e24bc43bf2c.png','Veste 1','fay-contreras','N00003',NULL,10,NULL,NULL,4000.00,NULL,NULL,2000.00,63,NULL,1,'2025-11-26 02:43:05','2025-12-24 18:59:28'),(66,'media/products/1765032495_pngegg (1).png','Tshirt 1','tshirt-1','N00004',NULL,2,NULL,NULL,1500.00,NULL,NULL,1000.00,244,NULL,1,'2025-12-06 19:48:15','2025-12-24 18:56:19');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_items`
--

DROP TABLE IF EXISTS `purchase_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `purchase_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) unsigned NOT NULL,
  `purchase_price` double(10,2) NOT NULL DEFAULT 0.00,
  `price` double(10,2) NOT NULL DEFAULT 0.00,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchase_items_purchase_id_foreign` (`purchase_id`),
  KEY `purchase_items_product_id_foreign` (`product_id`),
  CONSTRAINT `purchase_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `purchase_items_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_items`
--

LOCK TABLES `purchase_items` WRITE;
/*!40000 ALTER TABLE `purchase_items` DISABLE KEYS */;
INSERT INTO `purchase_items` VALUES (31,12,53,400.00,474.00,10,'2025-11-26 02:44:16','2025-11-26 02:44:16'),(33,14,53,1000.00,2000.00,1000,'2025-11-28 19:27:00','2025-11-28 19:27:00'),(34,15,1,5000.00,7000.00,100,'2025-11-28 20:03:59','2025-11-28 20:03:59'),(35,16,2,1500.00,3000.00,100,'2025-11-28 20:04:19','2025-11-28 20:04:19');
/*!40000 ALTER TABLE `purchase_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchases` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `supplier_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `sub_total` double(10,2) NOT NULL DEFAULT 0.00,
  `tax` double(10,2) NOT NULL DEFAULT 0.00,
  `discount_value` double(10,2) NOT NULL DEFAULT 0.00,
  `discount_type` varchar(255) NOT NULL DEFAULT 'fixed',
  `shipping` double(10,2) NOT NULL DEFAULT 0.00,
  `grand_total` double(10,2) NOT NULL DEFAULT 0.00,
  `status` tinyint(4) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchases_supplier_id_foreign` (`supplier_id`),
  KEY `purchases_user_id_foreign` (`user_id`),
  CONSTRAINT `purchases_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `purchases_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchases`
--

LOCK TABLES `purchases` WRITE;
/*!40000 ALTER TABLE `purchases` DISABLE KEYS */;
INSERT INTO `purchases` VALUES (12,1,1,4000.00,0.00,0.00,'fixed',0.00,4000.00,1,'2025-11-11 23:00:00','2025-11-26 02:44:16','2025-11-26 02:44:16'),(13,1,1,998000.00,0.00,0.00,'fixed',0.00,998000.00,1,'2025-11-26 23:00:00','2025-11-28 19:26:28','2025-11-28 19:26:28'),(14,1,1,1000000.00,0.00,0.00,'fixed',0.00,1000000.00,1,'2025-11-26 23:00:00','2025-11-28 19:27:00','2025-11-28 19:27:00'),(15,1,1,500000.00,0.00,0.00,'fixed',0.00,500000.00,1,'2025-11-26 23:00:00','2025-11-28 20:03:59','2025-11-28 20:03:59'),(16,1,1,150000.00,0.00,0.00,'fixed',0.00,150000.00,1,'2025-11-26 23:00:00','2025-11-28 20:04:19','2025-11-28 20:04:19');
/*!40000 ALTER TABLE `purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `role_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_has_permissions`
--

LOCK TABLES `role_has_permissions` WRITE;
/*!40000 ALTER TABLE `role_has_permissions` DISABLE KEYS */;
INSERT INTO `role_has_permissions` VALUES (1,1),(1,5),(2,1),(2,5),(3,1),(3,5),(4,1),(4,5),(5,1),(5,5),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(11,5),(12,1),(12,2),(12,5),(13,1),(13,5),(14,1),(14,5),(15,1),(16,1),(17,1),(18,1),(19,1),(20,1),(20,5),(21,1),(21,5),(22,1),(22,5),(23,1),(23,5),(24,1),(25,1),(26,1),(27,1),(28,1),(28,2),(28,3),(28,4),(28,5),(29,1),(29,2),(29,3),(29,4),(29,5),(30,1),(30,5),(31,1),(31,5),(32,1),(33,1),(34,1),(35,1),(36,1),(36,5),(37,1),(37,5),(38,1),(38,5),(39,1),(40,1),(41,1),(42,1),(43,1),(44,1),(45,1),(46,1),(47,1),(48,1),(49,1),(50,1),(51,1),(52,1),(53,1),(54,1),(55,1),(56,1),(57,1),(58,1),(59,1),(60,1),(61,1),(63,3);
/*!40000 ALTER TABLE `role_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(2,'cashier','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(3,'sales_associate','web','2025-11-25 20:42:49','2025-11-25 20:42:49'),(4,'cas','web','2025-11-26 04:19:11','2025-11-26 04:19:11'),(5,'Admin_','web','2025-12-06 20:22:39','2025-12-06 20:22:39');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `suppliers_phone_unique` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'Own Supplier','012345678',NULL,'2025-11-25 20:42:49','2025-11-25 20:42:49'),(12,'BELMOKHTAR IDIR','0556109446','Naciria, Bouassem','2025-11-26 00:09:06','2025-11-26 00:09:06');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `units` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `short_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (1,'Piece','pcs','2025-11-25 20:42:49','2025-11-25 20:42:49');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `is_google_registered` tinyint(1) NOT NULL DEFAULT 0,
  `is_suspended` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_username_unique` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Mr Admin','belmokhtaridir@gmail.com',NULL,'$2y$10$JZfza2gKXpyQ5VkUiSKim.zEUDofiYHwCHM0TKQ/Fosc.x./qEumu','Y68Lu2qDx1XCacrCuG79o2R3xQqzHCmsyWw9tTPokE6ebkB3TPevom5xiaMV','6925ce79bb42e',NULL,NULL,0,0,'2025-11-25 20:42:49','2025-11-25 20:42:49'),(2,'Mr Cashier','caisse@gmail.com',NULL,'$2y$10$d2k6KJJpfl/IBhuKLzNjlOsd8L0ZqY8xHpydFGxNAXgch2FHvoDAC',NULL,'6925ce7a5d055',NULL,NULL,0,0,'2025-11-25 20:42:50','2025-11-25 20:42:50'),(3,'Mr Sales','sales@gmail.com',NULL,'$2y$10$WZDXtGgcXzZMGmVFljKT9udAdMqczDPg2n6xAy0AnnFZl4jr0ONZe',NULL,'6925ce7a6be04',NULL,NULL,0,0,'2025-11-25 20:42:50','2025-11-25 20:42:50'),(5,'Idir Belmokhtar','ibelmokhtar00@gmail.com',NULL,'$2y$10$qroG.xUaQNe1zStkb4D3wevXyD0MO6qfpWphdCXDELKsIx59LBVQe',NULL,'69262641e844b',NULL,NULL,0,0,'2025-11-26 02:57:21','2025-11-26 04:22:04'),(6,'Farid Baaziz','faridbaaziz@gmail.com',NULL,'$2y$10$5T.d3rszH1Epj9xKK4jlcez7xYbUVBlmxg8lSn.ZGYFoPm4Ajai7e',NULL,'69344b34a2a6e',NULL,NULL,0,0,'2025-12-06 20:26:44','2025-12-06 20:26:44');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-26 10:00:44
