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

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('06bd7e8a-9e01-4d66-99ea-bf6c09ae1096','045757487d23a9ab7165c1e1aece3cd35eb74016833f769deb8bec9cd46147f1','2026-01-28 22:53:54.199','20260128225354_added_different_recipient_types_for_notifications',NULL,NULL,'2026-01-28 22:53:54.188',1),('13cdede3-8fca-411d-8a07-c871985f6987','68f405952a29ed9c17e98a8416e61ef9479e91ea69c076c67174bf9891160fd1','2026-01-28 22:23:07.305','20260128221748_added_push_subscriptions',NULL,NULL,'2026-01-28 22:23:07.281',1),('21103f79-8d45-49b7-a175-2898e0546808','75b38675916224ba193b07cf6663ce5de8945f1cc9a9ac214251428a889ffbe4','2026-01-28 22:23:06.088','20260120163151_disabled_time_table',NULL,NULL,'2026-01-28 22:23:06.064',1),('21e803a4-d7d9-4f00-9e5d-b9d0d3e6e24a','3a50eb56375b68a2b4d0ed33fcefc8117b3d2229fcda028b3e1c7c0e5fbafb84','2026-01-28 22:23:07.262','20260126171506_plan_id_and_booking_type_fixes',NULL,NULL,'2026-01-28 22:23:07.196',1),('26acc2f4-b5c5-4c7a-ab0a-9babec3fa460','f170e5df128a8ea06a51bdaeba85368509906c9b3f80330a3ffca96e21e5424e','2026-01-28 22:23:06.631','20260122164148_modified_plan_and_added_clientplan_models',NULL,NULL,'2026-01-28 22:23:06.476',1),('2b728788-4c81-4373-8514-7b975ddc492b','b6a3d33c96dfc0555105fd3e9f3a2262b80aaba95f69b98f81e2f24095b284c8','2026-01-28 22:23:06.063','20260119220639_add_disabled_days',NULL,NULL,'2026-01-28 22:23:06.032',1),('2e607d5c-13a5-49d6-a488-647de0398712','223f1dcc28c68a33d2f1f7cf52410aeaa37241bbc8a2af658a46c55738bc44be','2026-01-28 22:23:05.981','20260115154247_barber_to_service_many_to_many_relations_fixed',NULL,NULL,'2026-01-28 22:23:05.925',1),('434b4d37-549a-4b12-a2f7-050884e598fc','acae1a9b07951c47abd80d5030776872ef4fbdd362679877cc85e23fecf3de5b','2026-01-28 22:23:05.998','20260115154604_image_path_addition_on_table_service',NULL,NULL,'2026-01-28 22:23:05.982',1),('5e0f51b3-6f94-4311-b8f1-34728e67a4cc','d6304182da666a621d5fd86aa77cbf89d0739fcb1399a7cfd0445812f17ecf92','2026-01-28 22:23:06.756','20260123162558_added_plan_keywords_for_better_searching',NULL,NULL,'2026-01-28 22:23:06.736',1),('6b39b0db-b0b6-4724-a123-83161aa95318','bbab4c491b657f2d1a6628dc2ca7a60bca42ab6b666ec36224497587c06fb518','2026-01-28 22:23:05.847','20260114220932_adding_barber_booking_service_and_roles_data',NULL,NULL,'2026-01-28 22:23:05.640',1),('6c622c1a-bab8-4f79-b41a-9590e94b295d','45e0eee29d90bcbb06454ab6af2878d20ed4caad70c097b6f5e99b67acddcc8b','2026-01-28 22:23:05.639','20260114194302_removing_provider_data_from_users',NULL,NULL,'2026-01-28 22:23:05.590',1),('7466a925-7a94-4e70-9572-a0e07b0a490f','48afa48af14346b5992301719d960c0d9e45da9f4acb93e1442837ca2ff946d8','2026-01-28 23:07:59.380','20260128230759_added_barber_relation_to_notifications',NULL,NULL,'2026-01-28 23:07:59.321',1),('77e92b75-4d04-4a99-9aae-345db1941697','0033e0e3db966d15896e022988f5e9b0673f6798637b4a5232b091d509c13440','2026-01-31 01:14:42.131','20260131011441_made_user_optional',NULL,NULL,'2026-01-31 01:14:42.018',1),('7dd21475-f660-44c4-97ee-1895d55af873','9f417caa0cbb9b1bdabdb7bf9a71a79e7392c1418c4180a5bc689dc23b7b2a9d','2026-01-28 22:23:06.132','20260120164039_fixes',NULL,NULL,'2026-01-28 22:23:06.096',1),('8980d898-6645-49ab-bae2-87de1df3da3d','abd6008f1cb0b20b8807aa46497fbad413492f8da90d9de649de30860c85e002','2026-01-28 22:23:06.009','20260115161942_added_unique_constraint',NULL,NULL,'2026-01-28 22:23:05.998',1),('931c0151-f929-4eed-b8ca-13a9ef323fdd','5ae098c20ed2e67bc2ad0cedb8f6bd053e99074eba0b6f5216acfeef7461cdd1','2026-01-28 22:23:06.031','20260115184447_added_time_interval_prop_to_barber_profiles',NULL,NULL,'2026-01-28 22:23:06.009',1),('95f1f049-0d6b-4b22-9cef-19f3f41fa01a','d8f377b7f7893e235ea29d13bb2ee6b1ef744044f43b624bba45317c35fae6b8','2026-01-28 22:23:07.195','20260126171258_added_plan_info_to_bookings',NULL,NULL,'2026-01-28 22:23:07.010',1),('a31e843e-309a-4d4f-ab49-8b58e0a8926a','a52e643a25c3c8d76a49ec1ebe2936408c1506a98c4a1b1f97262df9a94301a3','2026-01-28 22:23:06.304','20260121002554_adding_point_system',NULL,NULL,'2026-01-28 22:23:06.181',1),('a36693c0-7767-46f5-a3ba-d3ece9cf305d','22251cf7d98130a390f2eac46c12cb61d14881229d000e10a59b009b85099ad9','2026-01-28 22:23:06.180','20260120165424_more_fixes',NULL,NULL,'2026-01-28 22:23:06.133',1),('aa8c42b8-667e-447c-a440-387c657acc88','fe069f9584400dabc3039cb195e24b28684e38ff556c62b1dd9bb1bb33355eb1','2026-01-28 22:23:05.590','20260114194049_adding_user_data',NULL,NULL,'2026-01-28 22:23:05.517',1),('ad557a55-ec4e-4f6d-abc3-2b23100fcd5c','dcb4be5d5aeee20726ac6c1a10f4c3a446eb5c056eeef46896ee6c51ebd6235e','2026-02-07 17:18:34.786','20260207171834_added_booking_reminder_notification_type',NULL,NULL,'2026-02-07 17:18:34.773',1),('bfded71a-4076-4094-b918-2ab5480f736a','1b806a7cc4576422fcc9198fa1b41cbb381325adc8134462e150847fab072519','2026-01-28 22:23:05.924','20260115144501_allow_services_have_multiple_barbers',NULL,NULL,'2026-01-28 22:23:05.848',1),('c3d65cf7-2bcd-4dd9-a8a9-5c8f4b669ace','e57895f8ce1f61b744b725ae5e73de13c1763e57c191f4835ac495bbeae85457','2026-01-28 22:23:06.735','20260122165450_fixing_relation_with_plan_and_service',NULL,NULL,'2026-01-28 22:23:06.632',1),('c8a65ccb-8c62-4a43-89d8-219bc6ed814b','1816a3b1167756739e089acf68a39660ddb5d83f3ee91e6e524eab9f5659a9e2','2026-01-28 22:23:06.095','20260120163657_extratimeday_table_for_more_admin_control',NULL,NULL,'2026-01-28 22:23:06.089',1),('d3489f65-18e9-44ad-b933-b2d2b4d11324','533ffce5d2db66e23de8bd82efd61786327b590178d4018bdaa39bccef682314','2026-01-28 22:23:06.475','20260121164905_notification_system',NULL,NULL,'2026-01-28 22:23:06.304',1),('d88dd904-f57d-4c98-ba14-bc91c5a618e1','fb978458ab186f483066ee386d9e60dd958cffdbe9fa50e9cf88daf400e2ff5e','2026-01-28 22:23:07.280','20260128213839_indexed_status_in_booking_model',NULL,NULL,'2026-01-28 22:23:07.263',1),('e639314d-5a0b-41fa-a20e-4155c0efc425','f15b7816b6263f432e5e660e39029bfa8fb960d1a5cb374812b977a2354e9a11','2026-01-28 22:23:07.009','20260123171803_fixed_plan_and_client_plan_types',NULL,NULL,'2026-01-28 22:23:06.812',1),('fbf36784-75d0-4a5a-9b1d-34e080ec3d65','7d13ca35c15000eb754b9388fcc57da11e60453d6a54e8bb2e3ca5fc1755f90d','2026-01-28 22:23:06.812','20260123164713_added_barber_id_to_client_plans',NULL,NULL,'2026-01-28 22:23:06.758',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `BarberProfileToService` VALUES ('cmkfsgh1j0000c0ycy8k4sy05','cmkfo0i0d0000bsyc0ffv1avb'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo0i0d0000bsyc0ffv1avb'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo0i0n0001bsycjele03ug'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo63t80000h7yc81n2ul83'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo63t80001h7ycmowllsx4'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo63t80002h7ycexmn4kfn'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo63t80003h7ycrp1c0tnu'),('cmkfsgh1j0000c0ycy8k4sy05','cmkfo63t80004h7yc5vrwuyqx'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo63t80004h7yc5vrwuyqx'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo63t80005h7ycmtfsmg8u'),('cmkx0lrwa0000efyc3q2f1oam','cmkfo63t80006h7ycjpwszjyp'),('cmkx0lrwa0000efyc3q2f1oam','cml2eupd1000qr3ycj65k06du'),('cmkx0lrwa0000efyc3q2f1oam','cml2evx07000rr3ycu84w6zxp');
/*!40000 ALTER TABLE `BarberProfileToService` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Booking`
--

LOCK TABLES `Booking` WRITE;
/*!40000 ALTER TABLE `Booking` DISABLE KEYS */;
INSERT INTO `Booking` VALUES ('cml2ekrsr000lr3ycr687rvkm','2026-01-31 16:00:00.000','CONFIRMED','cmkfo7tji0000koyc1liexvel','cmkfsgh1j0000c0ycy8k4sy05',0,30,'2026-01-31 14:24:15.291','cmkvr4xi80000a4yci7a9d3t0'),('cml2elesm000nr3ycqhpyvrpe','2026-01-31 21:20:00.000','CONFIRMED','cmkfo7tji0000koyc1liexvel','cmkx0lrwa0000efyc3q2f1oam',25,30,'2026-01-31 14:24:45.094',NULL),('cmlcm2d1l000230ycpho0uq04','2026-02-09 11:00:00.000','CANCELED','cmkfsa11i0000seyc5lkrxnam','cmkx0lrwa0000efyc3q2f1oam',145,95,'2026-02-07 17:51:35.049',NULL),('cmlcm7u5v000430yc9iih2ktt','2026-02-14 11:00:00.000','CANCELED','cmkfsa11i0000seyc5lkrxnam','cmkx0lrwa0000efyc3q2f1oam',145,95,'2026-02-07 17:55:50.515',NULL),('cmlcmba3c000630yc6wcx86qb','2026-02-21 11:00:00.000','CANCELED','cmkfsa11i0000seyc5lkrxnam','cmkx0lrwa0000efyc3q2f1oam',145,95,'2026-02-07 17:58:31.128',NULL),('cmlcmcirt000830yc936x7qbo','2026-02-28 11:00:00.000','CANCELED','cmkfsa11i0000seyc5lkrxnam','cmkx0lrwa0000efyc3q2f1oam',150,95,'2026-02-07 17:59:29.033',NULL);
/*!40000 ALTER TABLE `Booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `BookingService`
--

LOCK TABLES `BookingService` WRITE;
/*!40000 ALTER TABLE `BookingService` DISABLE KEYS */;
INSERT INTO `BookingService` VALUES ('cml2ekrsr000lr3ycr687rvkm','cmkfo0i0d0000bsyc0ffv1avb'),('cml2elesm000nr3ycqhpyvrpe','cmkfo0i0d0000bsyc0ffv1avb'),('cmlcm2d1l000230ycpho0uq04','cmkfo63t80002h7ycexmn4kfn'),('cmlcm7u5v000430yc9iih2ktt','cmkfo63t80002h7ycexmn4kfn'),('cmlcmba3c000630yc6wcx86qb','cmkfo63t80002h7ycexmn4kfn'),('cmlcmcirt000830yc936x7qbo','cmkfo63t80002h7ycexmn4kfn'),('cmlcm2d1l000230ycpho0uq04','cmkfo63t80004h7yc5vrwuyqx'),('cmlcm7u5v000430yc9iih2ktt','cmkfo63t80004h7yc5vrwuyqx'),('cmlcmba3c000630yc6wcx86qb','cmkfo63t80004h7yc5vrwuyqx'),('cmlcmcirt000830yc936x7qbo','cmkfo63t80004h7yc5vrwuyqx'),('cmlcm2d1l000230ycpho0uq04','cmkfo63t80005h7ycmtfsmg8u'),('cmlcm7u5v000430yc9iih2ktt','cmkfo63t80006h7ycjpwszjyp'),('cmlcmba3c000630yc6wcx86qb','cmkfo63t80006h7ycjpwszjyp'),('cmlcmcirt000830yc936x7qbo','cmkfo63t80006h7ycjpwszjyp'),('cmlcm2d1l000230ycpho0uq04','cml2evx07000rr3ycu84w6zxp'),('cmlcm7u5v000430yc9iih2ktt','cml2evx07000rr3ycu84w6zxp'),('cmlcmba3c000630yc6wcx86qb','cml2evx07000rr3ycu84w6zxp'),('cmlcmcirt000830yc936x7qbo','cml2evx07000rr3ycu84w6zxp');
/*!40000 ALTER TABLE `BookingService` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ClientPlan`
--

LOCK TABLES `ClientPlan` WRITE;
/*!40000 ALTER TABLE `ClientPlan` DISABLE KEYS */;
INSERT INTO `ClientPlan` VALUES ('cmkvr4xi80000a4yci7a9d3t0','cmkfo7tji0000koyc1liexvel','cmkppsjia0005h1ycirrxc97r','2026-01-26 00:00:00.000','2031-07-30 00:00:00.000','2026-01-26 22:41:27.967','2026-01-31 14:24:15.299',9995,'cmkfsgh1j0000c0ycy8k4sy05');
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
INSERT INTO `Notification` VALUES ('cmkoaqn3x0002ixyc2a11w3ps','COUPON_REDEEMED','Coupon Resgatado!','Adrian resgatou um coupon de 40% de desconto!',1,'cmkfsgh1j0000c0ycy8k4sy05',NULL,NULL,NULL,NULL,NULL,'2026-01-21 17:28:04.202','BARBER'),('cmkol3alx00012oycm3j4vs4r','POINTS_ADJUSTED','Pontos Ajustados','+10 pontos para usuário',1,'cmkfsgh1j0000c0ycy8k4sy05','cmkfo7tji0000koyc1liexvel',NULL,NULL,NULL,NULL,'2026-01-21 22:17:50.708','BARBER'),('cmkoodgwg0001a8ycj0lkh2ci','POINTS_ADJUSTED','Pontos Ajustados','-10 pontos para usuário',1,'cmkfsgh1j0000c0ycy8k4sy05','cmkfo7tji0000koyc1liexvel',NULL,NULL,NULL,NULL,'2026-01-21 23:49:44.271','BARBER'),('cmkorka0p0002ohycbbw7srp3','COUPON_REDEEMED','Coupon Resgatado!','Adrian resgatou um coupon de 50% de desconto!',1,'cmkfsgh1j0000c0ycy8k4sy05',NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:19:00.775','BARBER'),('cmkpnkfsk0001dyyca2qy6v05','POINTS_ADJUSTED','Pontos Ajustados','+500 pontos para usuário',1,'cmkfsgh1j0000c0ycy8k4sy05','cmkfo7tji0000koyc1liexvel',NULL,NULL,NULL,NULL,'2026-01-22 16:14:55.986','BARBER'),('cml2ekrtb000mr3ychw7beuwh','BOOKING_CREATED','Agendamento confirmado ✂️','Horário marcado para 31/01 às 13:00.',1,'cmkfsgh1j0000c0ycy8k4sy05','cmkfo7tji0000koyc1liexvel','cml2ekrsr000lr3ycr687rvkm',NULL,NULL,NULL,'2026-01-31 14:24:15.308','USER'),('cml2elesw000or3yctvw24k7k','BOOKING_CREATED','Agendamento confirmado ✂️','Horário marcado para 31/01 às 18:20.',1,'cmkx0lrwa0000efyc3q2f1oam','cmkfo7tji0000koyc1liexvel','cml2elesm000nr3ycqhpyvrpe',NULL,NULL,NULL,'2026-01-31 14:24:45.101','USER'),('cmlcm2d23000330ycakegb920','BOOKING_CREATED','Agendamento confirmado ✂️','Horário marcado para 09/02 às 08:00.',1,'cmkx0lrwa0000efyc3q2f1oam','cmkfsa11i0000seyc5lkrxnam','cmlcm2d1l000230ycpho0uq04',NULL,NULL,NULL,'2026-02-07 17:51:35.063','USER'),('cmlcm7u6b000530ycn66ttdy9','BOOKING_CREATED','Agendamento confirmado ✂️','Horário marcado para 14/02 às 08:00.',1,'cmkx0lrwa0000efyc3q2f1oam','cmkfsa11i0000seyc5lkrxnam','cmlcm7u5v000430yc9iih2ktt',NULL,NULL,NULL,'2026-02-07 17:55:50.527','USER'),('cmlcmba3s000730yczz7brzn0','BOOKING_CREATED','Agendamento confirmado ✂️','Horário marcado para 21/02 às 08:00.',1,'cmkx0lrwa0000efyc3q2f1oam','cmkfsa11i0000seyc5lkrxnam','cmlcmba3c000630yc6wcx86qb',NULL,NULL,NULL,'2026-02-07 17:58:31.140','USER'),('cmlcmcis5000930yclydbxfx6','BOOKING_CREATED','Agendamento confirmado ✂️','Horário marcado para 28/02 às 08:00.',1,'cmkx0lrwa0000efyc3q2f1oam','cmkfsa11i0000seyc5lkrxnam','cmlcmcirt000830yc936x7qbo',NULL,NULL,NULL,'2026-02-07 17:59:29.042','USER'),('cmlcmjlpk000a30yckzhj9ba1','BOOKING_CANCELLED','Agendamento cancelado ❌','O agendamento para 21/02 às 08:00 com Playyo 1 foi cancelado.',0,'cmkx0lrwa0000efyc3q2f1oam','cmkfsa11i0000seyc5lkrxnam','cmlcmba3c000630yc6wcx86qb',NULL,NULL,NULL,'2026-02-07 18:04:59.428','BARBER'),('cmlcmjlpk000b30ycmcc873rv','BOOKING_CANCELLED','Agendamento cancelado ❌','O agendamento para 21/02 às 08:00 com Dantas foi cancelado.',1,'cmkx0lrwa0000efyc3q2f1oam','cmkfsa11i0000seyc5lkrxnam','cmlcmba3c000630yc6wcx86qb',NULL,NULL,NULL,'2026-02-07 18:04:59.429','USER'),('cmlcmk220000c30ycqlgb1s73','BOOKING_CANCELLED','Agendamento cancelado ❌','O agendamento para 14/02 às 08:00 com Playyo 1 foi cancelado.',0,'cmkx0lrwa0000efyc3q2f1oam','cmkfsa11i0000seyc5lkrxnam','cmlcm7u5v000430yc9iih2ktt',NULL,NULL,NULL,'2026-02-07 18:05:20.614','BARBER'),('cmlcmk221000d30ycmkf8324u','BOOKING_CANCELLED','Agendamento cancelado ❌','O agendamento para 14/02 às 08:00 com Dantas foi cancelado.',1,'cmkx0lrwa0000efyc3q2f1oam','cmkfsa11i0000seyc5lkrxnam','cmlcm7u5v000430yc9iih2ktt',NULL,NULL,NULL,'2026-02-07 18:05:20.614','USER');
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
INSERT INTO `PointTransaction` VALUES ('cmknamke80002v5ycgj1tzp0a','cmknaganp0000v5ycw1qmv8b1',-500,'REDEEMED','Cupom de 40% resgatado',NULL,'2026-01-21 00:37:07.904',NULL,NULL,'PENDING'),('cmknbsbfn000245ycypmy8f78','cmknaganp0000v5ycw1qmv8b1',5,'EARNED','Pontos ganhos pelo agendamento','cmknbsbey000145ychrf2xpnc','2026-01-21 01:09:35.842',NULL,NULL,'PENDING'),('cmknbua1w000445ycfzeibbms','cmknaganp0000v5ycw1qmv8b1',10,'EARNED','Pontos ganhos pelo agendamento','cmknbua19000345yceumdvg9e','2026-01-21 01:11:07.363',NULL,NULL,'PENDING'),('cmko876g6000398ycvk82aacn','cmknaganp0000v5ycw1qmv8b1',-500,'REDEEMED','Cupom de 40% resgatado',NULL,'2026-01-21 16:16:56.934',NULL,NULL,'PENDING'),('cmkoaqn350001ixycrhaywdcg','cmknaganp0000v5ycw1qmv8b1',-500,'REDEEMED','Cupom de 40% resgatado',NULL,'2026-01-21 17:28:04.193',NULL,NULL,'PENDING'),('cmkobp07b0001kdycu1wydmz6','cmknaganp0000v5ycw1qmv8b1',25,'EARNED','Pontos ganhos pelo agendamento','cmkobp06p0000kdych4w2nu4u','2026-01-21 17:54:47.494',NULL,NULL,'CONFIRMED'),('cmkobzqjq0005kdycvsoftxxh','cmknaganp0000v5ycw1qmv8b1',25,'EARNED','Pontos ganhos pelo agendamento','cmkobzqj90004kdycsxi7tn9c','2026-01-21 18:03:08.197',NULL,NULL,'CONFIRMED'),('cmkoc35mh0009kdycmisz7m9q','cmknaganp0000v5ycw1qmv8b1',25,'EARNED','Pontos ganhos pelo agendamento','cmkoc35lz0008kdyc03ob60x2','2026-01-21 18:05:47.705',NULL,NULL,'PENDING'),('cmkoc4f8j000bkdyclzshdycy','cmknaganp0000v5ycw1qmv8b1',0,'ADJUSTED','Rejeitado pelo barbeiro','cmkoc35lz0008kdyc03ob60x2','2026-01-21 18:06:46.819','2026-01-21 18:06:46.818','cmkfsgh1j0000c0ycy8k4sy05','REJECTED'),('cmkol3al500002oycuoy3d4yj','cmknaganp0000v5ycw1qmv8b1',10,'ADJUSTED','Teste',NULL,'2026-01-21 22:17:50.679','2026-01-21 22:17:50.670','cmkfsgh1j0000c0ycy8k4sy05','CONFIRMED'),('cmkoodgw50000a8ycdkzpqagn','cmknaganp0000v5ycw1qmv8b1',-10,'ADJUSTED','Teste',NULL,'2026-01-21 23:49:44.259','2026-01-21 23:49:44.255','cmkfsgh1j0000c0ycy8k4sy05','CONFIRMED'),('cmkork9zx0001ohyclk9xiua7','cmknaganp0000v5ycw1qmv8b1',-500,'REDEEMED','Cupom de 50% resgatado',NULL,'2026-01-22 01:19:00.765',NULL,NULL,'CONFIRMED'),('cmkpnkfs40000dyycio6t92x8','cmknaganp0000v5ycw1qmv8b1',500,'ADJUSTED','Teste',NULL,'2026-01-22 16:14:55.970','2026-01-22 16:14:55.967','cmkfsgh1j0000c0ycy8k4sy05','CONFIRMED'),('cmkpnmvr90001ivyclet0kokb','cmknaganp0000v5ycw1qmv8b1',-500,'REDEEMED','Cupom de 50% resgatado',NULL,'2026-01-22 16:16:49.989',NULL,NULL,'CONFIRMED'),('cmkyptqjx00025oycccn64ytp','cmknaganp0000v5ycw1qmv8b1',25,'EARNED','Pontos ganhos pelo agendamento','cmkyptptc00015oycno9j8yni','2026-01-29 00:28:04.644',NULL,NULL,'PENDING'),('cmkypwrlj00055oyctjsvxyn3','cmknaganp0000v5ycw1qmv8b1',25,'EARNED','Pontos ganhos pelo agendamento','cmkypwrkz00035oycaearznkw','2026-01-29 00:30:25.975',NULL,NULL,'PENDING'),('cmkypyijr00085oycvdf76ypa','cmknaganp0000v5ycw1qmv8b1',25,'EARNED','Pontos ganhos pelo agendamento','cmkypyij500065oycxeuxwz3g','2026-01-29 00:31:47.554',NULL,NULL,'PENDING'),('cmkypz52s000b5oycu0dm1pi2','cmknaganp0000v5ycw1qmv8b1',25,'EARNED','Pontos ganhos pelo agendamento','cmkypz52900095oyc5ki66lx9','2026-01-29 00:32:16.750',NULL,NULL,'PENDING'),('cmkyq2k4f000e5oycyypuj34p','cmknaganp0000v5ycw1qmv8b1',25,'EARNED','Pontos ganhos pelo agendamento','cmkyq2k3q000c5oycf8zn9hqb','2026-01-29 00:34:56.221',NULL,NULL,'PENDING'),('cmkyq4mmp0002l5ycirjmno55','cmknaganp0000v5ycw1qmv8b1',25,'EARNED','Pontos ganhos pelo agendamento','cmkyq4mlq0000l5ycdpx1oz3r','2026-01-29 00:36:32.784',NULL,NULL,'PENDING'),('cmkyq67kz0006l5ycwzat9qki','cmknaganp0000v5ycw1qmv8b1',25,'EARNED','Pontos ganhos pelo agendamento','cmkyq67k90004l5ycww3mbsb1','2026-01-29 00:37:46.586',NULL,NULL,'PENDING'),('cml2csypr0002r3ycjpywmlr6','cmknaganp0000v5ycw1qmv8b1',45,'EARNED','Pontos ganhos pelo agendamento','cml2csyp00000r3yce4liz669','2026-01-31 13:34:38.271',NULL,NULL,'PENDING'),('cml2dgnp10007r3ycwr2xf541','cmknaganp0000v5ycw1qmv8b1',25,'EARNED','Pontos ganhos pelo agendamento','cml2dgnog0005r3yccrza2k0d','2026-01-31 13:53:03.732',NULL,NULL,'PENDING'),('cml2dolzx000kr3yc4ut72ej9','cmknaganp0000v5ycw1qmv8b1',45,'EARNED','Pontos ganhos pelo agendamento','cml2dolzc000ir3yczrtz5kwl','2026-01-31 13:59:14.775',NULL,NULL,'PENDING'),('cml2elet2000pr3ycc9kiw43y','cmknaganp0000v5ycw1qmv8b1',25,'EARNED','Pontos ganhos pelo agendamento','cml2elesm000nr3ycqhpyvrpe','2026-01-31 14:24:45.108',NULL,NULL,'PENDING');
/*!40000 ALTER TABLE `PointTransaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `PushSubscription`
--

LOCK TABLES `PushSubscription` WRITE;
/*!40000 ALTER TABLE `PushSubscription` DISABLE KEYS */;
INSERT INTO `PushSubscription` VALUES ('cml2ct2ip0003r3ycmj5def3c','cmkfo7tji0000koyc1liexvel','https://updates.push.services.mozilla.com/wpush/v2/gAAAAABpfgTzWgg0KMv_JHMXtMHagP6iNcDsBdS3B4DLjnpiDpLe7eZWMdkQBj35n5gKng5RVfGFNiLKK65iPoX229U1iGjInxG2K92_ezoo9aHk3o4xAusyZTp0LFP27ORm3PxS4xp-2frBflqCv9uWqkqhkiznt5QgdCbM488HGk4DizQ61fc','BKfFu5WNuGgAlk94ysOO3bZxKyZu5D1oLHENPYaIf0wKa3gtQMT_-XNvGlbo4pasccaEcEnAkcqVCEXD2XWwmA8','41kVLfY537m7LRMLzcsOig',NULL,'2026-01-31 13:34:43.199'),('cmlcloah1000030ycvyg96pf2','cmkfsa11i0000seyc5lkrxnam','https://updates.push.services.mozilla.com/wpush/v2/gAAAAABph3kWgqbGy5Y-h5SmPeE9vdWHrspcHBlwgZaq8OTijJYq0uiThuy42xunapTmn8ykHQPS9krvAHiUIWNw6Jz49yoGEZZiVmxrwGataT0SRPKwwbu5whPNaDRs9fi0dqncV9Jn4j7qPWl0Qhf1YwNCPT1m9pyQA8ccwrVmf-7br31byho','BL9Yp-MYmfAs_LuO0zff43_iUIMdZH4nqWALqfO64AdUeh8uFhhF1925FLAiy5NM4iLGgGgv0UwP7_R69d1p_fc','-josfzaq_eFw9T1Tk1ItBQ',NULL,'2026-02-07 17:40:38.411');
/*!40000 ALTER TABLE `PushSubscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Service`
--

LOCK TABLES `Service` WRITE;
/*!40000 ALTER TABLE `Service` DISABLE KEYS */;
INSERT INTO `Service` VALUES ('cmkfo0i0d0000bsyc0ffv1avb','Corte Social',25,30,'CRS','/assets/CRS.jpg'),('cmkfo0i0n0001bsycjele03ug','Corte Degradê',30,30,'CRD','/assets/CRD.jpg'),('cmkfo63t80000h7yc81n2ul83','Corte Americano',30,30,'CRA','/assets/CRA.jpg'),('cmkfo63t80001h7ycmowllsx4','Corte Jaca',30,30,'CRJ','/assets/CRJ.jpg'),('cmkfo63t80002h7ycexmn4kfn','Corte Moicano',30,30,'CRM','/assets/CRM.jpg'),('cmkfo63t80003h7ycrp1c0tnu','Corte Low Fade',30,30,'CRLF','/assets/CRLF.jpg'),('cmkfo63t80004h7yc5vrwuyqx','Barba',20,15,'BR','/assets/BR.jpg'),('cmkfo63t80005h7ycmtfsmg8u','Pezinho',10,10,'PE','/assets/PE.jpg'),('cmkfo63t80006h7ycjpwszjyp','Sobrancelha',10,10,'SB','/assets/SB.jpg'),('cml2eupd1000qr3ycj65k06du','Luzes',80,40,'LZ','/assets/1769869918625-Screenshot_2026_01_30_at_23.06.55.png'),('cml2evx07000rr3ycu84w6zxp','Platinado',100,40,'PLA','/assets/1769869975201-Screenshot_2026_01_30_at_23.06.55.png');
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
INSERT INTO `User` VALUES ('cmkfo7tji0000koyc1liexvel','Adrian','adrianbezerra83@gmail.com',NULL,'https://lh3.googleusercontent.com/a/ACg8ocKmVRvVevhXmqd5GZNhXKpugJdij3FzuxYOgqw-dUhO2PFT3UHr=s96-c','5588999406080','2026-01-15 16:35:25.132','USER','2026-01-20 14:01:05.112'),('cmkfsa11i0000seyc5lkrxnam','Playyo 1','playyo059@gmail.com',NULL,'/assets/1770487557416-Screenshot_2026_01_30_at_23.06.55.png','5588999406080','2026-01-15 18:29:06.628','ADMIN','2026-02-07 18:05:57.465'),('cmkws11rq0000p4ycvbbn8pgh','silvino Dantas','silvino123dantas@gmail.com',NULL,'https://lh3.googleusercontent.com/a/ACg8ocLt9WDNmvn2f_FbCH0Dk0yho4U9rxAIjGgerx3dJOQGNcm03A=s96-c','5511985537254','2026-01-27 15:54:12.660','ADMIN','2026-01-27 15:54:40.307');
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

-- Dump completed on 2026-02-07 16:12:35
