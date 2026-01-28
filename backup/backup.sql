-- MySQL dump 10.13  Distrib 9.4.0, for macos14.7 (x86_64)
--
-- Host: localhost    Database: mydb
-- ------------------------------------------------------
-- Server version	9.4.0

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
-- Dumping data for table `_prisma_migrations`
--

--
-- Dumping data for table `Account`
--

LOCK TABLES `Account` WRITE;
/*!40000 ALTER TABLE `Account` DISABLE KEYS */;
INSERT INTO `Account` VALUES ('cmkfo7tjt0001koyc6uesfcth','cmkfo7tji0000koyc1liexvel','oidc','google','102517850132774474914','1//0hHMsRUlR4bNICgYIARAAGBESNwF-L9Irb4I0hXT213Hhy2uatv56UKiDnIbdfIgkXmgZokxaqh3CWSFS_b9UVXOU_1vxtO1LNvA','ya29.a0AUMWg_KPeZZiCLkMibgP2spyPpikTkxv4OE-OzJf2B1uIWTfxIqLOM_KAbCrZoH-ANtr2XO8AN8MPicUeXyX-weC_HjWtsq3Xl-d81XbstrGWRm34xlmzGwMslYzp4bbGfUfDSHkl9xAe-DQJdtLsGBA6p8LOdgBNvSiG7N6gyezHL9rw3LBBSKb0MKM7oXwFUFSpOoaCgYKAb8SARQSFQHGX2Mi0uVwr2j0WcnB_jvULdrVqg0206',1768498524,'bearer','https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email','eyJhbGciOiJSUzI1NiIsImtpZCI6IjdiZjU5NTQ4OWEwYmIxNThiMDg1ZTIzZTdiNTJiZjk4OTFlMDQ1MzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2MjgwNjA5NjIxNzItcmVkNjI1ZnRkcHYyYzk0Nmd1aGc3cWllcTUwbDV2MG4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2MjgwNjA5NjIxNzItcmVkNjI1ZnRkcHYyYzk0Nmd1aGc3cWllcTUwbDV2MG4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI1MTc4NTAxMzI3NzQ0NzQ5MTQiLCJlbWFpbCI6ImFkcmlhbmJlemVycmE4M0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlU5Ql9iUUdiLUtadjFKYjFEOE05WFEiLCJuYW1lIjoiQWRyaWFuIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0ttVlJ2VmV2aFhtcWQ1R1pOaFhLcHVnSmRpajNGenV4WU9ncXctZFVoTzJQRlQzVUhyPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkFkcmlhbiIsImlhdCI6MTc2ODQ5NDkyNSwiZXhwIjoxNzY4NDk4NTI1fQ.rrUqX0zKB5j7aBWXNcVKHKLgVqdoSplemZKDA-lDR4P5Au4NPZf_Tj-qxnQzVGfqXrOu5XegxTSPFaKCu3uVVMXT8RVuV2up8Vy7uHoaYOJcBFvMIyyO00_zxJhwK0IDaTKZ_na7qIOLb-98vjyEf7Cfr17Rc3MvImBjkrPxaenjk33iCm-TSCSEdq0Jbi9Y47_fWzo-E9a5RSnn60VQgxT_maViIVg5n3YFupwucSg1CfdOy6pqMA5UXPxvdgTw00Q4Q_nUY6cFdWhSnwfYxY6HjonV820Ccas799v5cUbsC9bisG5enNlib5BhnLKTtrSVKpAMLgAW0cOY8dI-Tg',NULL),('cmkfsa11r0001seycip77wwkc','cmkfsa11i0000seyc5lkrxnam','oidc','google','113694017134818785772','1//0h1oVkPayBkCmCgYIARAAGBESNwF-L9Ir-S0QvuIYyD-GmCHfhnAVOFGJSalUxxt_6ciWIIYie9N0xX8ctibIft7SDrz44rFIpe8','ya29.a0AUMWg_L0htdOi1HabkhqV9Bps8TcksZdgsJCo6mOKbwq6YGcxc_ugEmX2Qs0KqAYRKVS3O0tjp_q_IfFU36ToX4ZKt1JN4NmB26pRrxVpSYQ6IO7T4PccCwpd9xmnjG1HX_bn4YNNzdMiuicgiV-z92x8c8_QY7uaQJzb3pBANYU_lzlhrotQgDRdQFvSIdjC5q4VLoaCgYKAaISARASFQHGX2Mi-pclov5qupw_ztFUu-ioHw0206',1768505345,'bearer','openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile','eyJhbGciOiJSUzI1NiIsImtpZCI6IjdiZjU5NTQ4OWEwYmIxNThiMDg1ZTIzZTdiNTJiZjk4OTFlMDQ1MzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2MjgwNjA5NjIxNzItcmVkNjI1ZnRkcHYyYzk0Nmd1aGc3cWllcTUwbDV2MG4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2MjgwNjA5NjIxNzItcmVkNjI1ZnRkcHYyYzk0Nmd1aGc3cWllcTUwbDV2MG4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM2OTQwMTcxMzQ4MTg3ODU3NzIiLCJlbWFpbCI6InBsYXl5bzA1OUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlljT3JmUmo0dy1PVlV4V05xdGVxc2ciLCJuYW1lIjoiUGxheXlvIDEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTE9GMkUzbmRkOUhEY1R5N040dE5QRFJUWkZUT3ZRQTVZajZtaTR5dkU4R1JIdWdnPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlBsYXl5byIsImZhbWlseV9uYW1lIjoiMSIsImlhdCI6MTc2ODUwMTc0NiwiZXhwIjoxNzY4NTA1MzQ2fQ.H0ZnN2zG76cbDHdt1k3ljPpCCU_uNpRhfbl2KUwN1o1i1EQ-iJzqflLivlwx88-j-pwDIkOapJcQvn6H0r11O_647lAoMB3dzW2W0C4GbI3VhynjvdewDNQR_94h5xD1-0ThEd2-uJGBHI53LI7pyVxN3JpZvaWck8Je-nXTkmvrD5y16Mdoa-YEmxbwa9fs9MQ2ArGLckHdobbqvZOr1qfoSPINhnHdWu_8SLRMvL4JDKe13DK2-BUQnN-NqMMzOXJQOJVjmpq3AatWZXtp9k6s5orxwkUoNtf_EFFTh6TSMWvEiJam6y5ejngQ5P4grUfndfqRyMmJNqrKPyrvoA',NULL),('cmkws11rx0001p4ycdicy5p1k','cmkws11rq0000p4ycvbbn8pgh','oidc','google','104325837355234874962','1//0hs3AHC9MaE3gCgYIARAAGBESNwF-L9IrAJMWBpnomcmCtbvQNAxxcMy1xrKVtGg9LErqjdXVC0ZveYOo0tn18Vg6VtUDv_Ti-L0','ya29.a0AUMWg_KYZoIXAPsd5przo7c8z_rp4DAU4MNxIA_UZEwEqTnVKbfN59jv-bO_4_LBdZeGL4YF96soLg8vyG0jaRgUQErcJH5NBsxRaQb9y1zckFbel5F7Ftbdgv_yfTjp7Set-AC6Nns6e8K85bbpDovv9MVvr6IJZBWkq3AKvv6XPXPAlqdpE1j1S3eQe1boIrUS8pkaCgYKARASARUSFQHGX2MikKgmt5fIpgYE4n1HIt2cYA0206',1769532851,'bearer','openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email','eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk1NDRkMGZmMDU5MGYwMjUzMDE2NDNmMzI3NWJmNjg3NzY3NjU4MjIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2MjgwNjA5NjIxNzItcmVkNjI1ZnRkcHYyYzk0Nmd1aGc3cWllcTUwbDV2MG4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2MjgwNjA5NjIxNzItcmVkNjI1ZnRkcHYyYzk0Nmd1aGc3cWllcTUwbDV2MG4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDQzMjU4MzczNTUyMzQ4NzQ5NjIiLCJlbWFpbCI6InNpbHZpbm8xMjNkYW50YXNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiI1M3pNbERTOGpsVllhLVkwRmVYREt3IiwibmFtZSI6InNpbHZpbm8gRGFudGFzIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0x0OVdETm12bjJmX0ZiQ0gwRGsweWhvNFU5cnhBSWpHZ2VyeDNkSk9RR05jbTAzQT1zOTYtYyIsImdpdmVuX25hbWUiOiJzaWx2aW5vIiwiZmFtaWx5X25hbWUiOiJEYW50YXMiLCJpYXQiOjE3Njk1MjkyNTIsImV4cCI6MTc2OTUzMjg1Mn0.CBjT2FsHlZYN8fG_3ZtG9Pmqmde8bxgyL7BL8neJdMFVcXHqdxBlLqBrCJT9PvVCGuA-3N3U1uTce15A4fOOwDUToNtdmz3alKh8DUP4HhXxWItvA2z-Zt8h6IiOUvR4nCuXWKZXNCy0LLOUhufmhtKiv4WWOrVTWpVLKXV1ObMQSp2PBs9D33hJmIDAo7C1zljHhiYbpolvDK8jB3qAs3KDIC015UBAH1-HJ7CNThx8SW4IUAf1W5IhUwFMGlp566BHOSmyAxSiV5Q9E82OiL0N2Im863k_Q5haSSc6Vi1e06Ei9DnWp2TnOC8bcyCj5SBlV_Z8OB5HjUnNqKdWxg',NULL);
/*!40000 ALTER TABLE `Account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `BarberProfile`
--

LOCK TABLES `BarberProfile` WRITE;
/*!40000 ALTER TABLE `BarberProfile` DISABLE KEYS */;
INSERT INTO `BarberProfile` VALUES ('cmkfsgh1j0000c0ycy8k4sy05','cmkfsa11i0000seyc5lkrxnam','Adrian','Apenas um barbeiro de teste 2','2026-01-15 18:34:07.301',40),('cmkx0lrwa0000efyc3q2f1oam','cmkws11rq0000p4ycvbbn8pgh','Dantas','Dono da Dantas Barbearia','2026-01-27 19:54:16.567',40);
/*!40000 ALTER TABLE `BarberProfile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `BarberProfileToService`
--

LOCK TABLES `BarberProfileToService` WRITE;
/*!40000 ALTER TABLE `BarberProfileToService` DISABLE KEYS */;
INSERT INTO `BarberProfileToService` VALUES ('cmkfsgh1j0000c0ycy8k4sy05','cmkfo0i0d0000bsyc0ffv1avb'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo0i0d0000bsyc0ffv1avb'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo0i0n0001bsycjele03ug'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo63t80000h7yc81n2ul83'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo63t80001h7ycmowllsx4'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo63t80002h7ycexmn4kfn'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo63t80003h7ycrp1c0tnu'),('cmkfsgh1j0000c0ycy8k4sy05','cmkfo63t80004h7yc5vrwuyqx'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo63t80004h7yc5vrwuyqx'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo63t80005h7ycmtfsmg8u'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo63t80006h7ycjpwszjyp');
/*!40000 ALTER TABLE `BarberProfileToService` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Booking`
--

LOCK TABLES `Booking` WRITE;
/*!40000 ALTER TABLE `Booking` DISABLE KEYS */;
INSERT INTO `Booking` VALUES ('cmkvgzare0002qyyc1du5p6v9','2026-01-27 11:00:00.000','CONFIRMED','cmkfo7tji0000koyc1liexvel','cmkfsgh1j0000c0ycy8k4sy05',40,45,'2026-01-26 17:57:09.050',NULL),('cmkvh1yl00003qyyczfysaiju','2026-01-28 11:00:00.000','CONFIRMED','cmkfo7tji0000koyc1liexvel','cmkfsgh1j0000c0ycy8k4sy05',20,45,'2026-01-26 17:59:13.236','cmkvr4xi80000a4yci7a9d3t0'),('cmkvh3lrn0004qyycv0oifep2','2026-01-30 17:40:00.000','CONFIRMED','cmkfo7tji0000koyc1liexvel','cmkfsgh1j0000c0ycy8k4sy05',20,45,'2026-01-26 18:00:29.939','cmkvr4xi80000a4yci7a9d3t0'),('cmkwtmq550000d6yc320ix6pd','2026-01-28 19:00:00.000','CONFIRMED','cmkws11rq0000p4ycvbbn8pgh','cmkfsgh1j0000c0ycy8k4sy05',25,30,'2026-01-27 16:39:03.641',NULL),('cmkwu737g0001d6yc6bwg0av8','2026-01-28 14:20:00.000','CONFIRMED','cmkws11rq0000p4ycvbbn8pgh','cmkfsgh1j0000c0ycy8k4sy05',25,30,'2026-01-27 16:54:53.692',NULL),('cmkwvjonq0002d6ycp3jd3rz0','2026-01-30 14:20:00.000','CONFIRMED','cmkws11rq0000p4ycvbbn8pgh','cmkfsgh1j0000c0ycy8k4sy05',25,30,'2026-01-27 17:32:40.982',NULL),('cmkx1i4gf0002hwycm0air9c6','2026-01-29 11:00:00.000','CONFIRMED','cmkfsa11i0000seyc5lkrxnam','cmkx0lrwa0000efyc3q2f1oam',25,30,'2026-01-27 20:19:25.839',NULL);
/*!40000 ALTER TABLE `Booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `BookingService`
--

LOCK TABLES `BookingService` WRITE;
/*!40000 ALTER TABLE `BookingService` DISABLE KEYS */;
INSERT INTO `BookingService` VALUES ('cmkvgzare0002qyyc1du5p6v9','cmkfo0i0d0000bsyc0ffv1avb'),('cmkvh1yl00003qyyczfysaiju','cmkfo0i0d0000bsyc0ffv1avb'),('cmkvh3lrn0004qyycv0oifep2','cmkfo0i0d0000bsyc0ffv1avb'),('cmkwtmq550000d6yc320ix6pd','cmkfo0i0d0000bsyc0ffv1avb'),('cmkwu737g0001d6yc6bwg0av8','cmkfo0i0d0000bsyc0ffv1avb'),('cmkwvjonq0002d6ycp3jd3rz0','cmkfo0i0d0000bsyc0ffv1avb'),('cmkx1i4gf0002hwycm0air9c6','cmkfo0i0d0000bsyc0ffv1avb'),('cmkvgzare0002qyyc1du5p6v9','cmkfo63t80004h7yc5vrwuyqx'),('cmkvh1yl00003qyyczfysaiju','cmkfo63t80004h7yc5vrwuyqx'),('cmkvh3lrn0004qyycv0oifep2','cmkfo63t80004h7yc5vrwuyqx');
/*!40000 ALTER TABLE `BookingService` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ClientPlan`
--

LOCK TABLES `ClientPlan` WRITE;
/*!40000 ALTER TABLE `ClientPlan` DISABLE KEYS */;
INSERT INTO `ClientPlan` VALUES ('cmkvr4xi80000a4yci7a9d3t0','cmkfo7tji0000koyc1liexvel','cmkppsjia0005h1ycirrxc97r','2026-01-26 00:00:00.000','2031-07-30 00:00:00.000','2026-01-26 22:41:27.967','2026-01-27 15:51:56.465',9999,'cmkfsgh1j0000c0ycy8k4sy05');
/*!40000 ALTER TABLE `ClientPlan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Coupon`
--

LOCK TABLES `Coupon` WRITE;
/*!40000 ALTER TABLE `Coupon` DISABLE KEYS */;
/*!40000 ALTER TABLE `Coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `DisabledDay`
--

LOCK TABLES `DisabledDay` WRITE;
/*!40000 ALTER TABLE `DisabledDay` DISABLE KEYS */;
/*!40000 ALTER TABLE `DisabledDay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `DisabledTime`
--

LOCK TABLES `DisabledTime` WRITE;
/*!40000 ALTER TABLE `DisabledTime` DISABLE KEYS */;
/*!40000 ALTER TABLE `DisabledTime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ExtraTimeDay`
--

LOCK TABLES `ExtraTimeDay` WRITE;
/*!40000 ALTER TABLE `ExtraTimeDay` DISABLE KEYS */;
/*!40000 ALTER TABLE `ExtraTimeDay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Notification`
--

LOCK TABLES `Notification` WRITE;
/*!40000 ALTER TABLE `Notification` DISABLE KEYS */;
INSERT INTO `Notification` VALUES ('cmkoaqn3x0002ixyc2a11w3ps','COUPON_REDEEMED','Coupon Resgatado!','Adrian resgatou um coupon de 40% de desconto!',1,'cmkfsgh1j0000c0ycy8k4sy05',NULL,NULL,NULL,NULL,NULL,'2026-01-21 17:28:04.202'),('cmkol3alx00012oycm3j4vs4r','POINTS_ADJUSTED','Pontos Ajustados','+10 pontos para usuário',1,'cmkfsgh1j0000c0ycy8k4sy05','cmkfo7tji0000koyc1liexvel',NULL,NULL,NULL,NULL,'2026-01-21 22:17:50.708'),('cmkoodgwg0001a8ycj0lkh2ci','POINTS_ADJUSTED','Pontos Ajustados','-10 pontos para usuário',1,'cmkfsgh1j0000c0ycy8k4sy05','cmkfo7tji0000koyc1liexvel',NULL,NULL,NULL,NULL,'2026-01-21 23:49:44.271'),('cmkorka0p0002ohycbbw7srp3','COUPON_REDEEMED','Coupon Resgatado!','Adrian resgatou um coupon de 50% de desconto!',1,'cmkfsgh1j0000c0ycy8k4sy05',NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:19:00.775'),('cmkpnkfsk0001dyyca2qy6v05','POINTS_ADJUSTED','Pontos Ajustados','+500 pontos para usuário',1,'cmkfsgh1j0000c0ycy8k4sy05','cmkfo7tji0000koyc1liexvel',NULL,NULL,NULL,NULL,'2026-01-22 16:14:55.986');
/*!40000 ALTER TABLE `Notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Plan`
--

LOCK TABLES `Plan` WRITE;
/*!40000 ALTER TABLE `Plan` DISABLE KEYS */;
INSERT INTO `Plan` VALUES ('cmkppsji90000h1yc7pf3ptv3','2026-01-22 17:17:13.278','Plano Bronze',60,'2026-01-22 17:17:13.278','BRO','cmkfsgh1j0000c0ycy8k4sy05',NULL),('cmkppsjia0001h1ycj1jb28op','2026-01-22 17:17:13.278','Plano Bronze',70,'2026-01-22 17:17:13.278','BRO','cmkfsgh1j0000c0ycy8k4sy05',NULL),('cmkppsjia0002h1ycns3tgll8','2026-01-22 17:17:13.278','Plano Prata',70,'2026-01-22 17:17:13.278','PLA','cmkfsgh1j0000c0ycy8k4sy05',NULL),('cmkppsjia0003h1yctu80plvv','2026-01-22 17:17:13.278','Plano Prata',80,'2026-01-22 17:17:13.278','PLA','cmkfsgh1j0000c0ycy8k4sy05',NULL),('cmkppsjia0004h1ycgeykmuzb','2026-01-22 17:17:13.278','Plano Ouro',80,'2026-01-22 17:17:13.278','OUR','cmkfsgh1j0000c0ycy8k4sy05',NULL),('cmkppsjia0005h1ycirrxc97r','2026-01-22 17:17:13.278','Plano Ouro',90,'2026-01-22 17:17:13.278','OUR','cmkfsgh1j0000c0ycy8k4sy05',NULL),('cmkppsjia0006h1yc7idonlu3','2026-01-22 17:17:13.278','Plano Diamante',100,'2026-01-22 17:17:13.278','DIA','cmkfsgh1j0000c0ycy8k4sy05',NULL),('cmkppsjia0007h1yckmxsm03d','2026-01-22 17:17:13.278','Plano Diamante',110,'2026-01-22 17:17:13.278','DIA','cmkfsgh1j0000c0ycy8k4sy05',NULL);
/*!40000 ALTER TABLE `Plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `PlanToService`
--

LOCK TABLES `PlanToService` WRITE;
/*!40000 ALTER TABLE `PlanToService` DISABLE KEYS */;
INSERT INTO `PlanToService` VALUES ('cmkppsji90000h1yc7pf3ptv3','cmkfo0i0d0000bsyc0ffv1avb'),('cmkppsjia0001h1ycj1jb28op','cmkfo0i0d0000bsyc0ffv1avb'),('cmkppsjia0002h1ycns3tgll8','cmkfo0i0d0000bsyc0ffv1avb'),('cmkppsjia0003h1yctu80plvv','cmkfo0i0d0000bsyc0ffv1avb'),('cmkppsjia0004h1ycgeykmuzb','cmkfo0i0d0000bsyc0ffv1avb'),('cmkppsjia0005h1ycirrxc97r','cmkfo0i0d0000bsyc0ffv1avb'),('cmkppsjia0006h1yc7idonlu3','cmkfo0i0d0000bsyc0ffv1avb'),('cmkppsjia0007h1yckmxsm03d','cmkfo0i0d0000bsyc0ffv1avb'),('cmkppsji90000h1yc7pf3ptv3','cmkfo0i0n0001bsycjele03ug'),('cmkppsjia0001h1ycj1jb28op','cmkfo0i0n0001bsycjele03ug'),('cmkppsjia0002h1ycns3tgll8','cmkfo0i0n0001bsycjele03ug'),('cmkppsjia0003h1yctu80plvv','cmkfo0i0n0001bsycjele03ug'),('cmkppsjia0004h1ycgeykmuzb','cmkfo0i0n0001bsycjele03ug'),('cmkppsjia0005h1ycirrxc97r','cmkfo0i0n0001bsycjele03ug'),('cmkppsjia0006h1yc7idonlu3','cmkfo0i0n0001bsycjele03ug'),('cmkppsjia0007h1yckmxsm03d','cmkfo0i0n0001bsycjele03ug'),('cmkppsji90000h1yc7pf3ptv3','cmkfo63t80000h7yc81n2ul83'),('cmkppsjia0001h1ycj1jb28op','cmkfo63t80000h7yc81n2ul83'),('cmkppsjia0002h1ycns3tgll8','cmkfo63t80000h7yc81n2ul83'),('cmkppsjia0003h1yctu80plvv','cmkfo63t80000h7yc81n2ul83'),('cmkppsjia0004h1ycgeykmuzb','cmkfo63t80000h7yc81n2ul83'),('cmkppsjia0005h1ycirrxc97r','cmkfo63t80000h7yc81n2ul83'),('cmkppsjia0006h1yc7idonlu3','cmkfo63t80000h7yc81n2ul83'),('cmkppsjia0007h1yckmxsm03d','cmkfo63t80000h7yc81n2ul83'),('cmkppsji90000h1yc7pf3ptv3','cmkfo63t80001h7ycmowllsx4'),('cmkppsjia0001h1ycj1jb28op','cmkfo63t80001h7ycmowllsx4'),('cmkppsjia0002h1ycns3tgll8','cmkfo63t80001h7ycmowllsx4'),('cmkppsjia0003h1yctu80plvv','cmkfo63t80001h7ycmowllsx4'),('cmkppsjia0004h1ycgeykmuzb','cmkfo63t80001h7ycmowllsx4'),('cmkppsjia0005h1ycirrxc97r','cmkfo63t80001h7ycmowllsx4'),('cmkppsjia0006h1yc7idonlu3','cmkfo63t80001h7ycmowllsx4'),('cmkppsjia0007h1yckmxsm03d','cmkfo63t80001h7ycmowllsx4'),('cmkppsji90000h1yc7pf3ptv3','cmkfo63t80002h7ycexmn4kfn'),('cmkppsjia0001h1ycj1jb28op','cmkfo63t80002h7ycexmn4kfn'),('cmkppsjia0002h1ycns3tgll8','cmkfo63t80002h7ycexmn4kfn'),('cmkppsjia0003h1yctu80plvv','cmkfo63t80002h7ycexmn4kfn'),('cmkppsjia0004h1ycgeykmuzb','cmkfo63t80002h7ycexmn4kfn'),('cmkppsjia0005h1ycirrxc97r','cmkfo63t80002h7ycexmn4kfn'),('cmkppsjia0006h1yc7idonlu3','cmkfo63t80002h7ycexmn4kfn'),('cmkppsjia0007h1yckmxsm03d','cmkfo63t80002h7ycexmn4kfn'),('cmkppsji90000h1yc7pf3ptv3','cmkfo63t80003h7ycrp1c0tnu'),('cmkppsjia0001h1ycj1jb28op','cmkfo63t80003h7ycrp1c0tnu'),('cmkppsjia0002h1ycns3tgll8','cmkfo63t80003h7ycrp1c0tnu'),('cmkppsjia0003h1yctu80plvv','cmkfo63t80003h7ycrp1c0tnu'),('cmkppsjia0004h1ycgeykmuzb','cmkfo63t80003h7ycrp1c0tnu'),('cmkppsjia0005h1ycirrxc97r','cmkfo63t80003h7ycrp1c0tnu'),('cmkppsjia0006h1yc7idonlu3','cmkfo63t80003h7ycrp1c0tnu'),('cmkppsjia0007h1yckmxsm03d','cmkfo63t80003h7ycrp1c0tnu'),('cmkppsjia0004h1ycgeykmuzb','cmkfo63t80004h7yc5vrwuyqx'),('cmkppsjia0005h1ycirrxc97r','cmkfo63t80004h7yc5vrwuyqx'),('cmkppsjia0006h1yc7idonlu3','cmkfo63t80004h7yc5vrwuyqx'),('cmkppsjia0007h1yckmxsm03d','cmkfo63t80004h7yc5vrwuyqx'),('cmkppsjia0004h1ycgeykmuzb','cmkfo63t80005h7ycmtfsmg8u'),('cmkppsjia0005h1ycirrxc97r','cmkfo63t80005h7ycmtfsmg8u'),('cmkppsjia0006h1yc7idonlu3','cmkfo63t80005h7ycmtfsmg8u'),('cmkppsjia0002h1ycns3tgll8','cmkfo63t80006h7ycjpwszjyp'),('cmkppsjia0003h1yctu80plvv','cmkfo63t80006h7ycjpwszjyp'),('cmkppsjia0004h1ycgeykmuzb','cmkfo63t80006h7ycjpwszjyp'),('cmkppsjia0005h1ycirrxc97r','cmkfo63t80006h7ycjpwszjyp'),('cmkppsjia0006h1yc7idonlu3','cmkfo63t80006h7ycjpwszjyp');
/*!40000 ALTER TABLE `PlanToService` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `PointSystem`
--

LOCK TABLES `PointSystem` WRITE;
/*!40000 ALTER TABLE `PointSystem` DISABLE KEYS */;
INSERT INTO `PointSystem` VALUES ('cmknaganp0000v5ycw1qmv8b1','cmkfo7tji0000koyc1liexvel',0,5,500,50,'2026-01-21 00:32:15.347','2026-01-22 16:16:49.978');
/*!40000 ALTER TABLE `PointSystem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `PointTransaction`
--

LOCK TABLES `PointTransaction` WRITE;
/*!40000 ALTER TABLE `PointTransaction` DISABLE KEYS */;
INSERT INTO `PointTransaction` VALUES ('cmknamke80002v5ycgj1tzp0a','cmknaganp0000v5ycw1qmv8b1',-500,'REDEEMED','Cupom de 40% resgatado',NULL,'2026-01-21 00:37:07.904',NULL,NULL,'PENDING'),('cmknbsbfn000245ycypmy8f78','cmknaganp0000v5ycw1qmv8b1',5,'EARNED','Pontos ganhos pelo agendamento','cmknbsbey000145ychrf2xpnc','2026-01-21 01:09:35.842',NULL,NULL,'PENDING'),('cmknbua1w000445ycfzeibbms','cmknaganp0000v5ycw1qmv8b1',10,'EARNED','Pontos ganhos pelo agendamento','cmknbua19000345yceumdvg9e','2026-01-21 01:11:07.363',NULL,NULL,'PENDING'),('cmko876g6000398ycvk82aacn','cmknaganp0000v5ycw1qmv8b1',-500,'REDEEMED','Cupom de 40% resgatado',NULL,'2026-01-21 16:16:56.934',NULL,NULL,'PENDING'),('cmkoaqn350001ixycrhaywdcg','cmknaganp0000v5ycw1qmv8b1',-500,'REDEEMED','Cupom de 40% resgatado',NULL,'2026-01-21 17:28:04.193',NULL,NULL,'PENDING'),('cmkobp07b0001kdycu1wydmz6','cmknaganp0000v5ycw1qmv8b1',25,'EARNED','Pontos ganhos pelo agendamento','cmkobp06p0000kdych4w2nu4u','2026-01-21 17:54:47.494',NULL,NULL,'CONFIRMED'),('cmkobzqjq0005kdycvsoftxxh','cmknaganp0000v5ycw1qmv8b1',25,'EARNED','Pontos ganhos pelo agendamento','cmkobzqj90004kdycsxi7tn9c','2026-01-21 18:03:08.197',NULL,NULL,'CONFIRMED'),('cmkoc35mh0009kdycmisz7m9q','cmknaganp0000v5ycw1qmv8b1',25,'EARNED','Pontos ganhos pelo agendamento','cmkoc35lz0008kdyc03ob60x2','2026-01-21 18:05:47.705',NULL,NULL,'PENDING'),('cmkoc4f8j000bkdyclzshdycy','cmknaganp0000v5ycw1qmv8b1',0,'ADJUSTED','Rejeitado pelo barbeiro','cmkoc35lz0008kdyc03ob60x2','2026-01-21 18:06:46.819','2026-01-21 18:06:46.818','cmkfsgh1j0000c0ycy8k4sy05','REJECTED'),('cmkol3al500002oycuoy3d4yj','cmknaganp0000v5ycw1qmv8b1',10,'ADJUSTED','Teste',NULL,'2026-01-21 22:17:50.679','2026-01-21 22:17:50.670','cmkfsgh1j0000c0ycy8k4sy05','CONFIRMED'),('cmkoodgw50000a8ycdkzpqagn','cmknaganp0000v5ycw1qmv8b1',-10,'ADJUSTED','Teste',NULL,'2026-01-21 23:49:44.259','2026-01-21 23:49:44.255','cmkfsgh1j0000c0ycy8k4sy05','CONFIRMED'),('cmkork9zx0001ohyclk9xiua7','cmknaganp0000v5ycw1qmv8b1',-500,'REDEEMED','Cupom de 50% resgatado',NULL,'2026-01-22 01:19:00.765',NULL,NULL,'CONFIRMED'),('cmkpnkfs40000dyycio6t92x8','cmknaganp0000v5ycw1qmv8b1',500,'ADJUSTED','Teste',NULL,'2026-01-22 16:14:55.970','2026-01-22 16:14:55.967','cmkfsgh1j0000c0ycy8k4sy05','CONFIRMED'),('cmkpnmvr90001ivyclet0kokb','cmknaganp0000v5ycw1qmv8b1',-500,'REDEEMED','Cupom de 50% resgatado',NULL,'2026-01-22 16:16:49.989',NULL,NULL,'CONFIRMED');
/*!40000 ALTER TABLE `PointTransaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Service`
--

LOCK TABLES `Service` WRITE;
/*!40000 ALTER TABLE `Service` DISABLE KEYS */;
INSERT INTO `Service` VALUES ('cmkfo0i0d0000bsyc0ffv1avb','Corte Social',25,30,'CRS','/assets/CRS.jpg'),('cmkfo0i0n0001bsycjele03ug','Corte Degradê',30,30,'CRD','/assets/CRD.jpg'),('cmkfo63t80000h7yc81n2ul83','Corte Americano',30,30,'CRA','/assets/CRA.jpg'),('cmkfo63t80001h7ycmowllsx4','Corte Jaca',30,30,'CRJ','/assets/CRJ.jpg'),('cmkfo63t80002h7ycexmn4kfn','Corte Moicano',30,30,'CRM','/assets/CRM.jpg'),('cmkfo63t80003h7ycrp1c0tnu','Corte Low Fade',30,30,'CRLF','/assets/CRLF.jpg'),('cmkfo63t80004h7yc5vrwuyqx','Barba',20,15,'BR','/assets/BR.jpg'),('cmkfo63t80005h7ycmtfsmg8u','Pezinho',10,10,'PE','/assets/PE.jpg'),('cmkfo63t80006h7ycjpwszjyp','Sobrancelha',10,10,'SB','/assets/SB.jpg');
/*!40000 ALTER TABLE `Service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Session`
--

LOCK TABLES `Session` WRITE;
/*!40000 ALTER TABLE `Session` DISABLE KEYS */;
/*!40000 ALTER TABLE `Session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('cmkfo7tji0000koyc1liexvel','Adrian','adrianbezerra83@gmail.com',NULL,'https://lh3.googleusercontent.com/a/ACg8ocKmVRvVevhXmqd5GZNhXKpugJdij3FzuxYOgqw-dUhO2PFT3UHr=s96-c','5588999406080','2026-01-15 16:35:25.132','USER','2026-01-20 14:01:05.112'),('cmkfsa11i0000seyc5lkrxnam','Playyo 1','playyo059@gmail.com',NULL,'https://advertising-neural-cash-porter.trycloudflare.com/assets/1769542228000-Screenshot_2026_01_14_at_22.16.37.png','5588999406080','2026-01-15 18:29:06.628','ADMIN','2026-01-27 19:30:28.413'),('cmkws11rq0000p4ycvbbn8pgh','silvino Dantas','silvino123dantas@gmail.com',NULL,'https://lh3.googleusercontent.com/a/ACg8ocLt9WDNmvn2f_FbCH0Dk0yho4U9rxAIjGgerx3dJOQGNcm03A=s96-c','5511985537254','2026-01-27 15:54:12.660','ADMIN','2026-01-27 15:54:40.307');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `VerificationToken`
--

LOCK TABLES `VerificationToken` WRITE;
/*!40000 ALTER TABLE `VerificationToken` DISABLE KEYS */;
/*!40000 ALTER TABLE `VerificationToken` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-28 19:22:21
