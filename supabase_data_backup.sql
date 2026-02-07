--
-- PostgreSQL database dump
--

\restrict MOcsOJo9vf1dgMFVxbjuNaRQcb3w5vUrBt8cNyMJ8Ylt1ocBzs35yQMONbWxdhU

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
06bd7e8a-9e01-4d66-99ea-bf6c09ae1096	045757487d23a9ab7165c1e1aece3cd35eb74016833f769deb8bec9cd46147f1	2026-01-28 22:53:54.199+00	20260128225354_added_different_recipient_types_for_notifications	\N	\N	2026-01-28 22:53:54.188+00	1
13cdede3-8fca-411d-8a07-c871985f6987	68f405952a29ed9c17e98a8416e61ef9479e91ea69c076c67174bf9891160fd1	2026-01-28 22:23:07.305+00	20260128221748_added_push_subscriptions	\N	\N	2026-01-28 22:23:07.281+00	1
21103f79-8d45-49b7-a175-2898e0546808	75b38675916224ba193b07cf6663ce5de8945f1cc9a9ac214251428a889ffbe4	2026-01-28 22:23:06.088+00	20260120163151_disabled_time_table	\N	\N	2026-01-28 22:23:06.064+00	1
21e803a4-d7d9-4f00-9e5d-b9d0d3e6e24a	3a50eb56375b68a2b4d0ed33fcefc8117b3d2229fcda028b3e1c7c0e5fbafb84	2026-01-28 22:23:07.262+00	20260126171506_plan_id_and_booking_type_fixes	\N	\N	2026-01-28 22:23:07.196+00	1
26acc2f4-b5c5-4c7a-ab0a-9babec3fa460	f170e5df128a8ea06a51bdaeba85368509906c9b3f80330a3ffca96e21e5424e	2026-01-28 22:23:06.631+00	20260122164148_modified_plan_and_added_clientplan_models	\N	\N	2026-01-28 22:23:06.476+00	1
2b728788-4c81-4373-8514-7b975ddc492b	b6a3d33c96dfc0555105fd3e9f3a2262b80aaba95f69b98f81e2f24095b284c8	2026-01-28 22:23:06.063+00	20260119220639_add_disabled_days	\N	\N	2026-01-28 22:23:06.032+00	1
2e607d5c-13a5-49d6-a488-647de0398712	223f1dcc28c68a33d2f1f7cf52410aeaa37241bbc8a2af658a46c55738bc44be	2026-01-28 22:23:05.981+00	20260115154247_barber_to_service_many_to_many_relations_fixed	\N	\N	2026-01-28 22:23:05.925+00	1
434b4d37-549a-4b12-a2f7-050884e598fc	acae1a9b07951c47abd80d5030776872ef4fbdd362679877cc85e23fecf3de5b	2026-01-28 22:23:05.998+00	20260115154604_image_path_addition_on_table_service	\N	\N	2026-01-28 22:23:05.982+00	1
5e0f51b3-6f94-4311-b8f1-34728e67a4cc	d6304182da666a621d5fd86aa77cbf89d0739fcb1399a7cfd0445812f17ecf92	2026-01-28 22:23:06.756+00	20260123162558_added_plan_keywords_for_better_searching	\N	\N	2026-01-28 22:23:06.736+00	1
6b39b0db-b0b6-4724-a123-83161aa95318	bbab4c491b657f2d1a6628dc2ca7a60bca42ab6b666ec36224497587c06fb518	2026-01-28 22:23:05.847+00	20260114220932_adding_barber_booking_service_and_roles_data	\N	\N	2026-01-28 22:23:05.64+00	1
6c622c1a-bab8-4f79-b41a-9590e94b295d	45e0eee29d90bcbb06454ab6af2878d20ed4caad70c097b6f5e99b67acddcc8b	2026-01-28 22:23:05.639+00	20260114194302_removing_provider_data_from_users	\N	\N	2026-01-28 22:23:05.59+00	1
7466a925-7a94-4e70-9572-a0e07b0a490f	48afa48af14346b5992301719d960c0d9e45da9f4acb93e1442837ca2ff946d8	2026-01-28 23:07:59.38+00	20260128230759_added_barber_relation_to_notifications	\N	\N	2026-01-28 23:07:59.321+00	1
77e92b75-4d04-4a99-9aae-345db1941697	0033e0e3db966d15896e022988f5e9b0673f6798637b4a5232b091d509c13440	2026-01-31 01:14:42.131+00	20260131011441_made_user_optional	\N	\N	2026-01-31 01:14:42.018+00	1
7dd21475-f660-44c4-97ee-1895d55af873	9f417caa0cbb9b1bdabdb7bf9a71a79e7392c1418c4180a5bc689dc23b7b2a9d	2026-01-28 22:23:06.132+00	20260120164039_fixes	\N	\N	2026-01-28 22:23:06.096+00	1
8980d898-6645-49ab-bae2-87de1df3da3d	abd6008f1cb0b20b8807aa46497fbad413492f8da90d9de649de30860c85e002	2026-01-28 22:23:06.009+00	20260115161942_added_unique_constraint	\N	\N	2026-01-28 22:23:05.998+00	1
931c0151-f929-4eed-b8ca-13a9ef323fdd	5ae098c20ed2e67bc2ad0cedb8f6bd053e99074eba0b6f5216acfeef7461cdd1	2026-01-28 22:23:06.031+00	20260115184447_added_time_interval_prop_to_barber_profiles	\N	\N	2026-01-28 22:23:06.009+00	1
95f1f049-0d6b-4b22-9cef-19f3f41fa01a	d8f377b7f7893e235ea29d13bb2ee6b1ef744044f43b624bba45317c35fae6b8	2026-01-28 22:23:07.195+00	20260126171258_added_plan_info_to_bookings	\N	\N	2026-01-28 22:23:07.01+00	1
a31e843e-309a-4d4f-ab49-8b58e0a8926a	a52e643a25c3c8d76a49ec1ebe2936408c1506a98c4a1b1f97262df9a94301a3	2026-01-28 22:23:06.304+00	20260121002554_adding_point_system	\N	\N	2026-01-28 22:23:06.181+00	1
a36693c0-7767-46f5-a3ba-d3ece9cf305d	22251cf7d98130a390f2eac46c12cb61d14881229d000e10a59b009b85099ad9	2026-01-28 22:23:06.18+00	20260120165424_more_fixes	\N	\N	2026-01-28 22:23:06.133+00	1
aa8c42b8-667e-447c-a440-387c657acc88	fe069f9584400dabc3039cb195e24b28684e38ff556c62b1dd9bb1bb33355eb1	2026-01-28 22:23:05.59+00	20260114194049_adding_user_data	\N	\N	2026-01-28 22:23:05.517+00	1
ad557a55-ec4e-4f6d-abc3-2b23100fcd5c	dcb4be5d5aeee20726ac6c1a10f4c3a446eb5c056eeef46896ee6c51ebd6235e	2026-02-07 17:18:34.786+00	20260207171834_added_booking_reminder_notification_type	\N	\N	2026-02-07 17:18:34.773+00	1
bfded71a-4076-4094-b918-2ab5480f736a	1b806a7cc4576422fcc9198fa1b41cbb381325adc8134462e150847fab072519	2026-01-28 22:23:05.924+00	20260115144501_allow_services_have_multiple_barbers	\N	\N	2026-01-28 22:23:05.848+00	1
c3d65cf7-2bcd-4dd9-a8a9-5c8f4b669ace	e57895f8ce1f61b744b725ae5e73de13c1763e57c191f4835ac495bbeae85457	2026-01-28 22:23:06.735+00	20260122165450_fixing_relation_with_plan_and_service	\N	\N	2026-01-28 22:23:06.632+00	1
c8a65ccb-8c62-4a43-89d8-219bc6ed814b	1816a3b1167756739e089acf68a39660ddb5d83f3ee91e6e524eab9f5659a9e2	2026-01-28 22:23:06.095+00	20260120163657_extratimeday_table_for_more_admin_control	\N	\N	2026-01-28 22:23:06.089+00	1
d3489f65-18e9-44ad-b933-b2d2b4d11324	533ffce5d2db66e23de8bd82efd61786327b590178d4018bdaa39bccef682314	2026-01-28 22:23:06.475+00	20260121164905_notification_system	\N	\N	2026-01-28 22:23:06.304+00	1
d88dd904-f57d-4c98-ba14-bc91c5a618e1	fb978458ab186f483066ee386d9e60dd958cffdbe9fa50e9cf88daf400e2ff5e	2026-01-28 22:23:07.28+00	20260128213839_indexed_status_in_booking_model	\N	\N	2026-01-28 22:23:07.263+00	1
e639314d-5a0b-41fa-a20e-4155c0efc425	f15b7816b6263f432e5e660e39029bfa8fb960d1a5cb374812b977a2354e9a11	2026-01-28 22:23:07.009+00	20260123171803_fixed_plan_and_client_plan_types	\N	\N	2026-01-28 22:23:06.812+00	1
fbf36784-75d0-4a5a-9b1d-34e080ec3d65	7d13ca35c15000eb754b9388fcc57da11e60453d6a54e8bb2e3ca5fc1755f90d	2026-01-28 22:23:06.812+00	20260123164713_added_barber_id_to_client_plans	\N	\N	2026-01-28 22:23:06.758+00	1
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb."user" (id, name, email, emailverified, image, phone, createdat, role, updatedat) FROM stdin;
cmkfo7tji0000koyc1liexvel	Adrian	adrianbezerra83@gmail.com	\N	https://lh3.googleusercontent.com/a/ACg8ocKmVRvVevhXmqd5GZNhXKpugJdij3FzuxYOgqw-dUhO2PFT3UHr=s96-c	5588999406080	2026-01-15 16:35:25.132+00	USER	2026-01-20 14:01:05.112+00
cmkfsa11i0000seyc5lkrxnam	Playyo 1	playyo059@gmail.com	\N	/assets/1770487557416-Screenshot_2026_01_30_at_23.06.55.png	5588999406080	2026-01-15 18:29:06.628+00	ADMIN	2026-02-07 18:05:57.465+00
cmkws11rq0000p4ycvbbn8pgh	silvino Dantas	silvino123dantas@gmail.com	\N	https://lh3.googleusercontent.com/a/ACg8ocLt9WDNmvn2f_FbCH0Dk0yho4U9rxAIjGgerx3dJOQGNcm03A=s96-c	5511985537254	2026-01-27 15:54:12.66+00	ADMIN	2026-01-27 15:54:40.307+00
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.account (id, userid, type, provider, provideraccountid, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
cmkfo7tjt0001koyc6uesfcth	cmkfo7tji0000koyc1liexvel	oidc	google	102517850132774474914	1//0hHMsRUlR4bNICgYIARAAGBESNwF-L9Irb4I0hXT213Hhy2uatv56UKiDnIbdfIgkXmgZokxaqh3CWSFS_b9UVXOU_1vxtO1LNvA	ya29.a0AUMWg_KPeZZiCLkMibgP2spyPpikTkxv4OE-OzJf2B1uIWTfxIqLOM_KAbCrZoH-ANtr2XO8AN8MPicUeXyX-weC_HjWtsq3Xl-d81XbstrGWRm34xlmzGwMslYzp4bbGfUfDSHkl9xAe-DQJdtLsGBA6p8LOdgBNvSiG7N6gyezHL9rw3LBBSKb0MKM7oXwFUFSpOoaCgYKAb8SARQSFQHGX2Mi0uVwr2j0WcnB_jvULdrVqg0206	1768498524	bearer	https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email	eyJhbGciOiJSUzI1NiIsImtpZCI6IjdiZjU5NTQ4OWEwYmIxNThiMDg1ZTIzZTdiNTJiZjk4OTFlMDQ1MzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2MjgwNjA5NjIxNzItcmVkNjI1ZnRkcHYyYzk0Nmd1aGc3cWllcTUwbDV2MG4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2MjgwNjA5NjIxNzItcmVkNjI1ZnRkcHYyYzk0Nmd1aGc3cWllcTUwbDV2MG4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI1MTc4NTAxMzI3NzQ0NzQ5MTQiLCJlbWFpbCI6ImFkcmlhbmJlemVycmE4M0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlU5Ql9iUUdiLUtadjFKYjFEOE05WFEiLCJuYW1lIjoiQWRyaWFuIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0ttVlJ2VmV2aFhtcWQ1R1pOaFhLcHVnSmRpajNGenV4WU9ncXctZFVoTzJQRlQzVUhyPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkFkcmlhbiIsImlhdCI6MTc2ODQ5NDkyNSwiZXhwIjoxNzY4NDk4NTI1fQ.rrUqX0zKB5j7aBWXNcVKHKLgVqdoSplemZKDA-lDR4P5Au4NPZf_Tj-qxnQzVGfqXrOu5XegxTSPFaKCu3uVVMXT8RVuV2up8Vy7uHoaYOJcBFvMIyyO00_zxJhwK0IDaTKZ_na7qIOLb-98vjyEf7Cfr17Rc3MvImBjkrPxaenjk33iCm-TSCSEdq0Jbi9Y47_fWzo-E9a5RSnn60VQgxT_maViIVg5n3YFupwucSg1CfdOy6pqMA5UXPxvdgTw00Q4Q_nUY6cFdWhSnwfYxY6HjonV820Ccas799v5cUbsC9bisG5enNlib5BhnLKTtrSVKpAMLgAW0cOY8dI-Tg	\N
cmkfsa11r0001seycip77wwkc	cmkfsa11i0000seyc5lkrxnam	oidc	google	113694017134818785772	1//0h1oVkPayBkCmCgYIARAAGBESNwF-L9Ir-S0QvuIYyD-GmCHfhnAVOFGJSalUxxt_6ciWIIYie9N0xX8ctibIft7SDrz44rFIpe8	ya29.a0AUMWg_L0htdOi1HabkhqV9Bps8TcksZdgsJCo6mOKbwq6YGcxc_ugEmX2Qs0KqAYRKVS3O0tjp_q_IfFU36ToX4ZKt1JN4NmB26pRrxVpSYQ6IO7T4PccCwpd9xmnjG1HX_bn4YNNzdMiuicgiV-z92x8c8_QY7uaQJzb3pBANYU_lzlhrotQgDRdQFvSIdjC5q4VLoaCgYKAaISARASFQHGX2Mi-pclov5qupw_ztFUu-ioHw0206	1768505345	bearer	openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile	eyJhbGciOiJSUzI1NiIsImtpZCI6IjdiZjU5NTQ4OWEwYmIxNThiMDg1ZTIzZTdiNTJiZjk4OTFlMDQ1MzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2MjgwNjA5NjIxNzItcmVkNjI1ZnRkcHYyYzk0Nmd1aGc3cWllcTUwbDV2MG4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2MjgwNjA5NjIxNzItcmVkNjI1ZnRkcHYyYzk0Nmd1aGc3cWllcTUwbDV2MG4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM2OTQwMTcxMzQ4MTg3ODU3NzIiLCJlbWFpbCI6InBsYXl5bzA1OUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlljT3JmUmo0dy1PVlV4V05xdGVxc2ciLCJuYW1lIjoiUGxheXlvIDEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTE9GMkUzbmRkOUhEY1R5N040dE5QRFJUWkZUT3ZRQTVZajZtaTR5dkU4R1JIdWdnPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlBsYXl5byIsImZhbWlseV9uYW1lIjoiMSIsImlhdCI6MTc2ODUwMTc0NiwiZXhwIjoxNzY4NTA1MzQ2fQ.H0ZnN2zG76cbDHdt1k3ljPpCCU_uNpRhfbl2KUwN1o1i1EQ-iJzqflLivlwx88-j-pwDIkOapJcQvn6H0r11O_647lAoMB3dzW2W0C4GbI3VhynjvdewDNQR_94h5xD1-0ThEd2-uJGBHI53LI7pyVxN3JpZvaWck8Je-nXTkmvrD5y16Mdoa-YEmxbwa9fs9MQ2ArGLckHdobbqvZOr1qfoSPINhnHdWu_8SLRMvL4JDKe13DK2-BUQnN-NqMMzOXJQOJVjmpq3AatWZXtp9k6s5orxwkUoNtf_EFFTh6TSMWvEiJam6y5ejngQ5P4grUfndfqRyMmJNqrKPyrvoA	\N
cmkws11rx0001p4ycdicy5p1k	cmkws11rq0000p4ycvbbn8pgh	oidc	google	104325837355234874962	1//0hs3AHC9MaE3gCgYIARAAGBESNwF-L9IrAJMWBpnomcmCtbvQNAxxcMy1xrKVtGg9LErqjdXVC0ZveYOo0tn18Vg6VtUDv_Ti-L0	ya29.a0AUMWg_KYZoIXAPsd5przo7c8z_rp4DAU4MNxIA_UZEwEqTnVKbfN59jv-bO_4_LBdZeGL4YF96soLg8vyG0jaRgUQErcJH5NBsxRaQb9y1zckFbel5F7Ftbdgv_yfTjp7Set-AC6Nns6e8K85bbpDovv9MVvr6IJZBWkq3AKvv6XPXPAlqdpE1j1S3eQe1boIrUS8pkaCgYKARASARUSFQHGX2MikKgmt5fIpgYE4n1HIt2cYA0206	1769532851	bearer	openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email	eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk1NDRkMGZmMDU5MGYwMjUzMDE2NDNmMzI3NWJmNjg3NzY3NjU4MjIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2MjgwNjA5NjIxNzItcmVkNjI1ZnRkcHYyYzk0Nmd1aGc3cWllcTUwbDV2MG4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2MjgwNjA5NjIxNzItcmVkNjI1ZnRkcHYyYzk0Nmd1aGc3cWllcTUwbDV2MG4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDQzMjU4MzczNTUyMzQ4NzQ5NjIiLCJlbWFpbCI6InNpbHZpbm8xMjNkYW50YXNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiI1M3pNbERTOGpsVllhLVkwRmVYREt3IiwibmFtZSI6InNpbHZpbm8gRGFudGFzIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0x0OVdETm12bjJmX0ZiQ0gwRGsweWhvNFU5cnhBSWpHZ2VyeDNkSk9RR05jbTAzQT1zOTYtYyIsImdpdmVuX25hbWUiOiJzaWx2aW5vIiwiZmFtaWx5X25hbWUiOiJEYW50YXMiLCJpYXQiOjE3Njk1MjkyNTIsImV4cCI6MTc2OTUzMjg1Mn0.CBjT2FsHlZYN8fG_3ZtG9Pmqmde8bxgyL7BL8neJdMFVcXHqdxBlLqBrCJT9PvVCGuA-3N3U1uTce15A4fOOwDUToNtdmz3alKh8DUP4HhXxWItvA2z-Zt8h6IiOUvR4nCuXWKZXNCy0LLOUhufmhtKiv4WWOrVTWpVLKXV1ObMQSp2PBs9D33hJmIDAo7C1zljHhiYbpolvDK8jB3qAs3KDIC015UBAH1-HJ7CNThx8SW4IUAf1W5IhUwFMGlp566BHOSmyAxSiV5Q9E82OiL0N2Im863k_Q5haSSc6Vi1e06Ei9DnWp2TnOC8bcyCj5SBlV_Z8OB5HjUnNqKdWxg	\N
\.


--
-- Data for Name: barberprofile; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.barberprofile (id, userid, displayname, bio, createdat, timeinterval) FROM stdin;
cmkfsgh1j0000c0ycy8k4sy05	cmkfsa11i0000seyc5lkrxnam	Adrian	Apenas um barbeiro de teste 2	2026-01-15 18:34:07.301+00	40
cmkx0lrwa0000efyc3q2f1oam	cmkws11rq0000p4ycvbbn8pgh	Dantas	Dono da Dantas Barbearia	2026-01-27 19:54:16.567+00	40
\.


--
-- Data for Name: service; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.service (id, name, price, duration, keyword, imagepath) FROM stdin;
cmkfo0i0d0000bsyc0ffv1avb	Corte Social	25	30	CRS	/assets/CRS.jpg
cmkfo0i0n0001bsycjele03ug	Corte Degradê	30	30	CRD	/assets/CRD.jpg
cmkfo63t80000h7yc81n2ul83	Corte Americano	30	30	CRA	/assets/CRA.jpg
cmkfo63t80001h7ycmowllsx4	Corte Jaca	30	30	CRJ	/assets/CRJ.jpg
cmkfo63t80002h7ycexmn4kfn	Corte Moicano	30	30	CRM	/assets/CRM.jpg
cmkfo63t80003h7ycrp1c0tnu	Corte Low Fade	30	30	CRLF	/assets/CRLF.jpg
cmkfo63t80004h7yc5vrwuyqx	Barba	20	15	BR	/assets/BR.jpg
cmkfo63t80005h7ycmtfsmg8u	Pezinho	10	10	PE	/assets/PE.jpg
cmkfo63t80006h7ycjpwszjyp	Sobrancelha	10	10	SB	/assets/SB.jpg
cml2eupd1000qr3ycj65k06du	Luzes	80	40	LZ	/assets/1769869918625-Screenshot_2026_01_30_at_23.06.55.png
cml2evx07000rr3ycu84w6zxp	Platinado	100	40	PLA	/assets/1769869975201-Screenshot_2026_01_30_at_23.06.55.png
\.


--
-- Data for Name: barberprofiletoservice; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.barberprofiletoservice (barberprofileid, serviceid) FROM stdin;
cmkfsgh1j0000c0ycy8k4sy05	cmkfo0i0d0000bsyc0ffv1avb
cmkx0lrwa0000efyc3q2f1oam	cmkfo0i0d0000bsyc0ffv1avb
cmkx0lrwa0000efyc3q2f1oam	cmkfo0i0n0001bsycjele03ug
cmkx0lrwa0000efyc3q2f1oam	cmkfo63t80000h7yc81n2ul83
cmkx0lrwa0000efyc3q2f1oam	cmkfo63t80001h7ycmowllsx4
cmkx0lrwa0000efyc3q2f1oam	cmkfo63t80002h7ycexmn4kfn
cmkx0lrwa0000efyc3q2f1oam	cmkfo63t80003h7ycrp1c0tnu
cmkfsgh1j0000c0ycy8k4sy05	cmkfo63t80004h7yc5vrwuyqx
cmkx0lrwa0000efyc3q2f1oam	cmkfo63t80004h7yc5vrwuyqx
cmkx0lrwa0000efyc3q2f1oam	cmkfo63t80005h7ycmtfsmg8u
cmkx0lrwa0000efyc3q2f1oam	cmkfo63t80006h7ycjpwszjyp
cmkx0lrwa0000efyc3q2f1oam	cml2eupd1000qr3ycj65k06du
cmkx0lrwa0000efyc3q2f1oam	cml2evx07000rr3ycu84w6zxp
\.


--
-- Data for Name: plan; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.plan (id, createdat, name, price, updatedat, keyword, barberid, description) FROM stdin;
cmkppsji90000h1yc7pf3ptv3	2026-01-22 17:17:13.278+00	Plano Bronze	60	2026-01-22 17:17:13.278+00	BRO	cmkfsgh1j0000c0ycy8k4sy05	\N
cmkppsjia0001h1ycj1jb28op	2026-01-22 17:17:13.278+00	Plano Bronze	70	2026-01-22 17:17:13.278+00	BRO	cmkfsgh1j0000c0ycy8k4sy05	\N
cmkppsjia0002h1ycns3tgll8	2026-01-22 17:17:13.278+00	Plano Prata	70	2026-01-22 17:17:13.278+00	PLA	cmkfsgh1j0000c0ycy8k4sy05	\N
cmkppsjia0003h1yctu80plvv	2026-01-22 17:17:13.278+00	Plano Prata	80	2026-01-22 17:17:13.278+00	PLA	cmkfsgh1j0000c0ycy8k4sy05	\N
cmkppsjia0004h1ycgeykmuzb	2026-01-22 17:17:13.278+00	Plano Ouro	80	2026-01-22 17:17:13.278+00	OUR	cmkfsgh1j0000c0ycy8k4sy05	\N
cmkppsjia0005h1ycirrxc97r	2026-01-22 17:17:13.278+00	Plano Ouro	90	2026-01-22 17:17:13.278+00	OUR	cmkfsgh1j0000c0ycy8k4sy05	\N
cmkppsjia0006h1yc7idonlu3	2026-01-22 17:17:13.278+00	Plano Diamante	100	2026-01-22 17:17:13.278+00	DIA	cmkfsgh1j0000c0ycy8k4sy05	\N
cmkppsjia0007h1yckmxsm03d	2026-01-22 17:17:13.278+00	Plano Diamante	110	2026-01-22 17:17:13.278+00	DIA	cmkfsgh1j0000c0ycy8k4sy05	\N
\.


--
-- Data for Name: clientplan; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.clientplan (id, userid, planid, starts, expires, createdat, updatedat, useamount, barberid) FROM stdin;
cmkvr4xi80000a4yci7a9d3t0	cmkfo7tji0000koyc1liexvel	cmkppsjia0005h1ycirrxc97r	2026-01-26 00:00:00+00	2031-07-30 00:00:00+00	2026-01-26 22:41:27.967+00	2026-01-31 14:24:15.299+00	9995	cmkfsgh1j0000c0ycy8k4sy05
\.


--
-- Data for Name: booking; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.booking (id, date, status, userid, barberid, totalprice, totalduration, createdat, planid) FROM stdin;
cml2ekrsr000lr3ycr687rvkm	2026-01-31 16:00:00+00	CONFIRMED	cmkfo7tji0000koyc1liexvel	cmkfsgh1j0000c0ycy8k4sy05	0	30	2026-01-31 14:24:15.291+00	cmkvr4xi80000a4yci7a9d3t0
cml2elesm000nr3ycqhpyvrpe	2026-01-31 21:20:00+00	CONFIRMED	cmkfo7tji0000koyc1liexvel	cmkx0lrwa0000efyc3q2f1oam	25	30	2026-01-31 14:24:45.094+00	\N
cmlcm2d1l000230ycpho0uq04	2026-02-09 11:00:00+00	CANCELED	cmkfsa11i0000seyc5lkrxnam	cmkx0lrwa0000efyc3q2f1oam	145	95	2026-02-07 17:51:35.049+00	\N
cmlcm7u5v000430yc9iih2ktt	2026-02-14 11:00:00+00	CANCELED	cmkfsa11i0000seyc5lkrxnam	cmkx0lrwa0000efyc3q2f1oam	145	95	2026-02-07 17:55:50.515+00	\N
cmlcmba3c000630yc6wcx86qb	2026-02-21 11:00:00+00	CANCELED	cmkfsa11i0000seyc5lkrxnam	cmkx0lrwa0000efyc3q2f1oam	145	95	2026-02-07 17:58:31.128+00	\N
cmlcmcirt000830yc936x7qbo	2026-02-28 11:00:00+00	CANCELED	cmkfsa11i0000seyc5lkrxnam	cmkx0lrwa0000efyc3q2f1oam	150	95	2026-02-07 17:59:29.033+00	\N
\.


--
-- Data for Name: bookingservice; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.bookingservice (bookingid, serviceid) FROM stdin;
cml2ekrsr000lr3ycr687rvkm	cmkfo0i0d0000bsyc0ffv1avb
cml2elesm000nr3ycqhpyvrpe	cmkfo0i0d0000bsyc0ffv1avb
cmlcm2d1l000230ycpho0uq04	cmkfo63t80002h7ycexmn4kfn
cmlcm7u5v000430yc9iih2ktt	cmkfo63t80002h7ycexmn4kfn
cmlcmba3c000630yc6wcx86qb	cmkfo63t80002h7ycexmn4kfn
cmlcmcirt000830yc936x7qbo	cmkfo63t80002h7ycexmn4kfn
cmlcm2d1l000230ycpho0uq04	cmkfo63t80004h7yc5vrwuyqx
cmlcm7u5v000430yc9iih2ktt	cmkfo63t80004h7yc5vrwuyqx
cmlcmba3c000630yc6wcx86qb	cmkfo63t80004h7yc5vrwuyqx
cmlcmcirt000830yc936x7qbo	cmkfo63t80004h7yc5vrwuyqx
cmlcm2d1l000230ycpho0uq04	cmkfo63t80005h7ycmtfsmg8u
cmlcm7u5v000430yc9iih2ktt	cmkfo63t80006h7ycjpwszjyp
cmlcmba3c000630yc6wcx86qb	cmkfo63t80006h7ycjpwszjyp
cmlcmcirt000830yc936x7qbo	cmkfo63t80006h7ycjpwszjyp
cmlcm2d1l000230ycpho0uq04	cml2evx07000rr3ycu84w6zxp
cmlcm7u5v000430yc9iih2ktt	cml2evx07000rr3ycu84w6zxp
cmlcmba3c000630yc6wcx86qb	cml2evx07000rr3ycu84w6zxp
cmlcmcirt000830yc936x7qbo	cml2evx07000rr3ycu84w6zxp
\.


--
-- Data for Name: pointsystem; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.pointsystem (id, userid, currentpoints, pointsperservice, pointsneededforreward, discountpercentage, createdat, updatedat) FROM stdin;
cmknaganp0000v5ycw1qmv8b1	cmkfo7tji0000koyc1liexvel	0	5	500	50	2026-01-21 00:32:15.347+00	2026-01-22 16:16:49.978+00
\.


--
-- Data for Name: coupon; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.coupon (id, pointsystemid, discountpercent, isused, usedat, bookingid, createdat, expiresat) FROM stdin;
\.


--
-- Data for Name: disabledday; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.disabledday (id, barberid, date, reason, createdat) FROM stdin;
\.


--
-- Data for Name: disabledtime; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.disabledtime (id, date, createdat, barberid) FROM stdin;
\.


--
-- Data for Name: extratimeday; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.extratimeday (id, date, amount, createdat, barberid) FROM stdin;
\.


--
-- Data for Name: pointtransaction; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.pointtransaction (id, pointsystemid, points, type, description, bookingid, createdat, confirmedat, confirmedby, status) FROM stdin;
cmknamke80002v5ycgj1tzp0a	cmknaganp0000v5ycw1qmv8b1	-500	REDEEMED	Cupom de 40% resgatado	\N	2026-01-21 00:37:07.904+00	\N	\N	PENDING
cmknbsbfn000245ycypmy8f78	cmknaganp0000v5ycw1qmv8b1	5	EARNED	Pontos ganhos pelo agendamento	cmknbsbey000145ychrf2xpnc	2026-01-21 01:09:35.842+00	\N	\N	PENDING
cmknbua1w000445ycfzeibbms	cmknaganp0000v5ycw1qmv8b1	10	EARNED	Pontos ganhos pelo agendamento	cmknbua19000345yceumdvg9e	2026-01-21 01:11:07.363+00	\N	\N	PENDING
cmko876g6000398ycvk82aacn	cmknaganp0000v5ycw1qmv8b1	-500	REDEEMED	Cupom de 40% resgatado	\N	2026-01-21 16:16:56.934+00	\N	\N	PENDING
cmkoaqn350001ixycrhaywdcg	cmknaganp0000v5ycw1qmv8b1	-500	REDEEMED	Cupom de 40% resgatado	\N	2026-01-21 17:28:04.193+00	\N	\N	PENDING
cmkobp07b0001kdycu1wydmz6	cmknaganp0000v5ycw1qmv8b1	25	EARNED	Pontos ganhos pelo agendamento	cmkobp06p0000kdych4w2nu4u	2026-01-21 17:54:47.494+00	\N	\N	CONFIRMED
cmkobzqjq0005kdycvsoftxxh	cmknaganp0000v5ycw1qmv8b1	25	EARNED	Pontos ganhos pelo agendamento	cmkobzqj90004kdycsxi7tn9c	2026-01-21 18:03:08.197+00	\N	\N	CONFIRMED
cmkoc35mh0009kdycmisz7m9q	cmknaganp0000v5ycw1qmv8b1	25	EARNED	Pontos ganhos pelo agendamento	cmkoc35lz0008kdyc03ob60x2	2026-01-21 18:05:47.705+00	\N	\N	PENDING
cmkoc4f8j000bkdyclzshdycy	cmknaganp0000v5ycw1qmv8b1	0	ADJUSTED	Rejeitado pelo barbeiro	cmkoc35lz0008kdyc03ob60x2	2026-01-21 18:06:46.819+00	2026-01-21 18:06:46.818+00	cmkfsgh1j0000c0ycy8k4sy05	REJECTED
cmkol3al500002oycuoy3d4yj	cmknaganp0000v5ycw1qmv8b1	10	ADJUSTED	Teste	\N	2026-01-21 22:17:50.679+00	2026-01-21 22:17:50.67+00	cmkfsgh1j0000c0ycy8k4sy05	CONFIRMED
cmkoodgw50000a8ycdkzpqagn	cmknaganp0000v5ycw1qmv8b1	-10	ADJUSTED	Teste	\N	2026-01-21 23:49:44.259+00	2026-01-21 23:49:44.255+00	cmkfsgh1j0000c0ycy8k4sy05	CONFIRMED
cmkork9zx0001ohyclk9xiua7	cmknaganp0000v5ycw1qmv8b1	-500	REDEEMED	Cupom de 50% resgatado	\N	2026-01-22 01:19:00.765+00	\N	\N	CONFIRMED
cmkpnkfs40000dyycio6t92x8	cmknaganp0000v5ycw1qmv8b1	500	ADJUSTED	Teste	\N	2026-01-22 16:14:55.97+00	2026-01-22 16:14:55.967+00	cmkfsgh1j0000c0ycy8k4sy05	CONFIRMED
cmkpnmvr90001ivyclet0kokb	cmknaganp0000v5ycw1qmv8b1	-500	REDEEMED	Cupom de 50% resgatado	\N	2026-01-22 16:16:49.989+00	\N	\N	CONFIRMED
cmkyptqjx00025oycccn64ytp	cmknaganp0000v5ycw1qmv8b1	25	EARNED	Pontos ganhos pelo agendamento	cmkyptptc00015oycno9j8yni	2026-01-29 00:28:04.644+00	\N	\N	PENDING
cmkypwrlj00055oyctjsvxyn3	cmknaganp0000v5ycw1qmv8b1	25	EARNED	Pontos ganhos pelo agendamento	cmkypwrkz00035oycaearznkw	2026-01-29 00:30:25.975+00	\N	\N	PENDING
cmkypyijr00085oycvdf76ypa	cmknaganp0000v5ycw1qmv8b1	25	EARNED	Pontos ganhos pelo agendamento	cmkypyij500065oycxeuxwz3g	2026-01-29 00:31:47.554+00	\N	\N	PENDING
cmkypz52s000b5oycu0dm1pi2	cmknaganp0000v5ycw1qmv8b1	25	EARNED	Pontos ganhos pelo agendamento	cmkypz52900095oyc5ki66lx9	2026-01-29 00:32:16.75+00	\N	\N	PENDING
cmkyq2k4f000e5oycyypuj34p	cmknaganp0000v5ycw1qmv8b1	25	EARNED	Pontos ganhos pelo agendamento	cmkyq2k3q000c5oycf8zn9hqb	2026-01-29 00:34:56.221+00	\N	\N	PENDING
cmkyq4mmp0002l5ycirjmno55	cmknaganp0000v5ycw1qmv8b1	25	EARNED	Pontos ganhos pelo agendamento	cmkyq4mlq0000l5ycdpx1oz3r	2026-01-29 00:36:32.784+00	\N	\N	PENDING
cmkyq67kz0006l5ycwzat9qki	cmknaganp0000v5ycw1qmv8b1	25	EARNED	Pontos ganhos pelo agendamento	cmkyq67k90004l5ycww3mbsb1	2026-01-29 00:37:46.586+00	\N	\N	PENDING
cml2csypr0002r3ycjpywmlr6	cmknaganp0000v5ycw1qmv8b1	45	EARNED	Pontos ganhos pelo agendamento	cml2csyp00000r3yce4liz669	2026-01-31 13:34:38.271+00	\N	\N	PENDING
cml2dgnp10007r3ycwr2xf541	cmknaganp0000v5ycw1qmv8b1	25	EARNED	Pontos ganhos pelo agendamento	cml2dgnog0005r3yccrza2k0d	2026-01-31 13:53:03.732+00	\N	\N	PENDING
cml2dolzx000kr3yc4ut72ej9	cmknaganp0000v5ycw1qmv8b1	45	EARNED	Pontos ganhos pelo agendamento	cml2dolzc000ir3yczrtz5kwl	2026-01-31 13:59:14.775+00	\N	\N	PENDING
cml2elet2000pr3ycc9kiw43y	cmknaganp0000v5ycw1qmv8b1	25	EARNED	Pontos ganhos pelo agendamento	cml2elesm000nr3ycqhpyvrpe	2026-01-31 14:24:45.108+00	\N	\N	PENDING
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.notification (id, type, title, message, read, barberid, userid, bookingid, couponid, transactionid, metadata, createdat, recipienttype) FROM stdin;
cmkoaqn3x0002ixyc2a11w3ps	COUPON_REDEEMED	Coupon Resgatado!	Adrian resgatou um coupon de 40% de desconto!	t	cmkfsgh1j0000c0ycy8k4sy05	\N	\N	\N	\N	\N	2026-01-21 17:28:04.202+00	BARBER
cmkol3alx00012oycm3j4vs4r	POINTS_ADJUSTED	Pontos Ajustados	+10 pontos para usuário	t	cmkfsgh1j0000c0ycy8k4sy05	cmkfo7tji0000koyc1liexvel	\N	\N	\N	\N	2026-01-21 22:17:50.708+00	BARBER
cmkoodgwg0001a8ycj0lkh2ci	POINTS_ADJUSTED	Pontos Ajustados	-10 pontos para usuário	t	cmkfsgh1j0000c0ycy8k4sy05	cmkfo7tji0000koyc1liexvel	\N	\N	\N	\N	2026-01-21 23:49:44.271+00	BARBER
cmkorka0p0002ohycbbw7srp3	COUPON_REDEEMED	Coupon Resgatado!	Adrian resgatou um coupon de 50% de desconto!	t	cmkfsgh1j0000c0ycy8k4sy05	\N	\N	\N	\N	\N	2026-01-22 01:19:00.775+00	BARBER
cmkpnkfsk0001dyyca2qy6v05	POINTS_ADJUSTED	Pontos Ajustados	+500 pontos para usuário	t	cmkfsgh1j0000c0ycy8k4sy05	cmkfo7tji0000koyc1liexvel	\N	\N	\N	\N	2026-01-22 16:14:55.986+00	BARBER
cml2ekrtb000mr3ychw7beuwh	BOOKING_CREATED	Agendamento confirmado ✂️	Horário marcado para 31/01 às 13:00.	t	cmkfsgh1j0000c0ycy8k4sy05	cmkfo7tji0000koyc1liexvel	cml2ekrsr000lr3ycr687rvkm	\N	\N	\N	2026-01-31 14:24:15.308+00	USER
cml2elesw000or3yctvw24k7k	BOOKING_CREATED	Agendamento confirmado ✂️	Horário marcado para 31/01 às 18:20.	t	cmkx0lrwa0000efyc3q2f1oam	cmkfo7tji0000koyc1liexvel	cml2elesm000nr3ycqhpyvrpe	\N	\N	\N	2026-01-31 14:24:45.101+00	USER
cmlcm2d23000330ycakegb920	BOOKING_CREATED	Agendamento confirmado ✂️	Horário marcado para 09/02 às 08:00.	t	cmkx0lrwa0000efyc3q2f1oam	cmkfsa11i0000seyc5lkrxnam	cmlcm2d1l000230ycpho0uq04	\N	\N	\N	2026-02-07 17:51:35.063+00	USER
cmlcm7u6b000530ycn66ttdy9	BOOKING_CREATED	Agendamento confirmado ✂️	Horário marcado para 14/02 às 08:00.	t	cmkx0lrwa0000efyc3q2f1oam	cmkfsa11i0000seyc5lkrxnam	cmlcm7u5v000430yc9iih2ktt	\N	\N	\N	2026-02-07 17:55:50.527+00	USER
cmlcmba3s000730yczz7brzn0	BOOKING_CREATED	Agendamento confirmado ✂️	Horário marcado para 21/02 às 08:00.	t	cmkx0lrwa0000efyc3q2f1oam	cmkfsa11i0000seyc5lkrxnam	cmlcmba3c000630yc6wcx86qb	\N	\N	\N	2026-02-07 17:58:31.14+00	USER
cmlcmcis5000930yclydbxfx6	BOOKING_CREATED	Agendamento confirmado ✂️	Horário marcado para 28/02 às 08:00.	t	cmkx0lrwa0000efyc3q2f1oam	cmkfsa11i0000seyc5lkrxnam	cmlcmcirt000830yc936x7qbo	\N	\N	\N	2026-02-07 17:59:29.042+00	USER
cmlcmjlpk000a30yckzhj9ba1	BOOKING_CANCELLED	Agendamento cancelado ❌	O agendamento para 21/02 às 08:00 com Playyo 1 foi cancelado.	f	cmkx0lrwa0000efyc3q2f1oam	cmkfsa11i0000seyc5lkrxnam	cmlcmba3c000630yc6wcx86qb	\N	\N	\N	2026-02-07 18:04:59.428+00	BARBER
cmlcmjlpk000b30ycmcc873rv	BOOKING_CANCELLED	Agendamento cancelado ❌	O agendamento para 21/02 às 08:00 com Dantas foi cancelado.	t	cmkx0lrwa0000efyc3q2f1oam	cmkfsa11i0000seyc5lkrxnam	cmlcmba3c000630yc6wcx86qb	\N	\N	\N	2026-02-07 18:04:59.429+00	USER
cmlcmk220000c30ycqlgb1s73	BOOKING_CANCELLED	Agendamento cancelado ❌	O agendamento para 14/02 às 08:00 com Playyo 1 foi cancelado.	f	cmkx0lrwa0000efyc3q2f1oam	cmkfsa11i0000seyc5lkrxnam	cmlcm7u5v000430yc9iih2ktt	\N	\N	\N	2026-02-07 18:05:20.614+00	BARBER
cmlcmk221000d30ycmkf8324u	BOOKING_CANCELLED	Agendamento cancelado ❌	O agendamento para 14/02 às 08:00 com Dantas foi cancelado.	t	cmkx0lrwa0000efyc3q2f1oam	cmkfsa11i0000seyc5lkrxnam	cmlcm7u5v000430yc9iih2ktt	\N	\N	\N	2026-02-07 18:05:20.614+00	USER
\.


--
-- Data for Name: plantoservice; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.plantoservice (planid, serviceid) FROM stdin;
cmkppsji90000h1yc7pf3ptv3	cmkfo0i0d0000bsyc0ffv1avb
cmkppsjia0001h1ycj1jb28op	cmkfo0i0d0000bsyc0ffv1avb
cmkppsjia0002h1ycns3tgll8	cmkfo0i0d0000bsyc0ffv1avb
cmkppsjia0003h1yctu80plvv	cmkfo0i0d0000bsyc0ffv1avb
cmkppsjia0004h1ycgeykmuzb	cmkfo0i0d0000bsyc0ffv1avb
cmkppsjia0005h1ycirrxc97r	cmkfo0i0d0000bsyc0ffv1avb
cmkppsjia0006h1yc7idonlu3	cmkfo0i0d0000bsyc0ffv1avb
cmkppsjia0007h1yckmxsm03d	cmkfo0i0d0000bsyc0ffv1avb
cmkppsji90000h1yc7pf3ptv3	cmkfo0i0n0001bsycjele03ug
cmkppsjia0001h1ycj1jb28op	cmkfo0i0n0001bsycjele03ug
cmkppsjia0002h1ycns3tgll8	cmkfo0i0n0001bsycjele03ug
cmkppsjia0003h1yctu80plvv	cmkfo0i0n0001bsycjele03ug
cmkppsjia0004h1ycgeykmuzb	cmkfo0i0n0001bsycjele03ug
cmkppsjia0005h1ycirrxc97r	cmkfo0i0n0001bsycjele03ug
cmkppsjia0006h1yc7idonlu3	cmkfo0i0n0001bsycjele03ug
cmkppsjia0007h1yckmxsm03d	cmkfo0i0n0001bsycjele03ug
cmkppsji90000h1yc7pf3ptv3	cmkfo63t80000h7yc81n2ul83
cmkppsjia0001h1ycj1jb28op	cmkfo63t80000h7yc81n2ul83
cmkppsjia0002h1ycns3tgll8	cmkfo63t80000h7yc81n2ul83
cmkppsjia0003h1yctu80plvv	cmkfo63t80000h7yc81n2ul83
cmkppsjia0004h1ycgeykmuzb	cmkfo63t80000h7yc81n2ul83
cmkppsjia0005h1ycirrxc97r	cmkfo63t80000h7yc81n2ul83
cmkppsjia0006h1yc7idonlu3	cmkfo63t80000h7yc81n2ul83
cmkppsjia0007h1yckmxsm03d	cmkfo63t80000h7yc81n2ul83
cmkppsji90000h1yc7pf3ptv3	cmkfo63t80001h7ycmowllsx4
cmkppsjia0001h1ycj1jb28op	cmkfo63t80001h7ycmowllsx4
cmkppsjia0002h1ycns3tgll8	cmkfo63t80001h7ycmowllsx4
cmkppsjia0003h1yctu80plvv	cmkfo63t80001h7ycmowllsx4
cmkppsjia0004h1ycgeykmuzb	cmkfo63t80001h7ycmowllsx4
cmkppsjia0005h1ycirrxc97r	cmkfo63t80001h7ycmowllsx4
cmkppsjia0006h1yc7idonlu3	cmkfo63t80001h7ycmowllsx4
cmkppsjia0007h1yckmxsm03d	cmkfo63t80001h7ycmowllsx4
cmkppsji90000h1yc7pf3ptv3	cmkfo63t80002h7ycexmn4kfn
cmkppsjia0001h1ycj1jb28op	cmkfo63t80002h7ycexmn4kfn
cmkppsjia0002h1ycns3tgll8	cmkfo63t80002h7ycexmn4kfn
cmkppsjia0003h1yctu80plvv	cmkfo63t80002h7ycexmn4kfn
cmkppsjia0004h1ycgeykmuzb	cmkfo63t80002h7ycexmn4kfn
cmkppsjia0005h1ycirrxc97r	cmkfo63t80002h7ycexmn4kfn
cmkppsjia0006h1yc7idonlu3	cmkfo63t80002h7ycexmn4kfn
cmkppsjia0007h1yckmxsm03d	cmkfo63t80002h7ycexmn4kfn
cmkppsji90000h1yc7pf3ptv3	cmkfo63t80003h7ycrp1c0tnu
cmkppsjia0001h1ycj1jb28op	cmkfo63t80003h7ycrp1c0tnu
cmkppsjia0002h1ycns3tgll8	cmkfo63t80003h7ycrp1c0tnu
cmkppsjia0003h1yctu80plvv	cmkfo63t80003h7ycrp1c0tnu
cmkppsjia0004h1ycgeykmuzb	cmkfo63t80003h7ycrp1c0tnu
cmkppsjia0005h1ycirrxc97r	cmkfo63t80003h7ycrp1c0tnu
cmkppsjia0006h1yc7idonlu3	cmkfo63t80003h7ycrp1c0tnu
cmkppsjia0007h1yckmxsm03d	cmkfo63t80003h7ycrp1c0tnu
cmkppsjia0004h1ycgeykmuzb	cmkfo63t80004h7yc5vrwuyqx
cmkppsjia0005h1ycirrxc97r	cmkfo63t80004h7yc5vrwuyqx
cmkppsjia0006h1yc7idonlu3	cmkfo63t80004h7yc5vrwuyqx
cmkppsjia0007h1yckmxsm03d	cmkfo63t80004h7yc5vrwuyqx
cmkppsjia0004h1ycgeykmuzb	cmkfo63t80005h7ycmtfsmg8u
cmkppsjia0005h1ycirrxc97r	cmkfo63t80005h7ycmtfsmg8u
cmkppsjia0006h1yc7idonlu3	cmkfo63t80005h7ycmtfsmg8u
cmkppsjia0002h1ycns3tgll8	cmkfo63t80006h7ycjpwszjyp
cmkppsjia0003h1yctu80plvv	cmkfo63t80006h7ycjpwszjyp
cmkppsjia0004h1ycgeykmuzb	cmkfo63t80006h7ycjpwszjyp
cmkppsjia0005h1ycirrxc97r	cmkfo63t80006h7ycjpwszjyp
cmkppsjia0006h1yc7idonlu3	cmkfo63t80006h7ycjpwszjyp
\.


--
-- Data for Name: pushsubscription; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.pushsubscription (id, userid, endpoint, p256dh, auth, useragent, createdat) FROM stdin;
cml2ct2ip0003r3ycmj5def3c	cmkfo7tji0000koyc1liexvel	https://updates.push.services.mozilla.com/wpush/v2/gAAAAABpfgTzWgg0KMv_JHMXtMHagP6iNcDsBdS3B4DLjnpiDpLe7eZWMdkQBj35n5gKng5RVfGFNiLKK65iPoX229U1iGjInxG2K92_ezoo9aHk3o4xAusyZTp0LFP27ORm3PxS4xp-2frBflqCv9uWqkqhkiznt5QgdCbM488HGk4DizQ61fc	BKfFu5WNuGgAlk94ysOO3bZxKyZu5D1oLHENPYaIf0wKa3gtQMT_-XNvGlbo4pasccaEcEnAkcqVCEXD2XWwmA8	41kVLfY537m7LRMLzcsOig	\N	2026-01-31 13:34:43.199+00
cmlcloah1000030ycvyg96pf2	cmkfsa11i0000seyc5lkrxnam	https://updates.push.services.mozilla.com/wpush/v2/gAAAAABph3kWgqbGy5Y-h5SmPeE9vdWHrspcHBlwgZaq8OTijJYq0uiThuy42xunapTmn8ykHQPS9krvAHiUIWNw6Jz49yoGEZZiVmxrwGataT0SRPKwwbu5whPNaDRs9fi0dqncV9Jn4j7qPWl0Qhf1YwNCPT1m9pyQA8ccwrVmf-7br31byho	BL9Yp-MYmfAs_LuO0zff43_iUIMdZH4nqWALqfO64AdUeh8uFhhF1925FLAiy5NM4iLGgGgv0UwP7_R69d1p_fc	-josfzaq_eFw9T1Tk1ItBQ	\N	2026-02-07 17:40:38.411+00
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.session (id, sessiontoken, userid, expires) FROM stdin;
\.


--
-- Data for Name: verificationtoken; Type: TABLE DATA; Schema: mydb; Owner: -
--

COPY mydb.verificationtoken (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-02-07 19:10:38
20211116045059	2026-02-07 19:10:40
20211116050929	2026-02-07 19:10:41
20211116051442	2026-02-07 19:10:42
20211116212300	2026-02-07 19:10:43
20211116213355	2026-02-07 19:10:44
20211116213934	2026-02-07 19:10:46
20211116214523	2026-02-07 19:10:47
20211122062447	2026-02-07 19:10:48
20211124070109	2026-02-07 19:10:49
20211202204204	2026-02-07 19:10:51
20211202204605	2026-02-07 19:10:52
20211210212804	2026-02-07 19:10:55
20211228014915	2026-02-07 19:10:57
20220107221237	2026-02-07 19:10:58
20220228202821	2026-02-07 19:10:59
20220312004840	2026-02-07 19:11:00
20220603231003	2026-02-07 19:11:02
20220603232444	2026-02-07 19:11:03
20220615214548	2026-02-07 19:11:04
20220712093339	2026-02-07 19:11:05
20220908172859	2026-02-07 19:11:07
20220916233421	2026-02-07 19:11:08
20230119133233	2026-02-07 19:11:09
20230128025114	2026-02-07 19:11:10
20230128025212	2026-02-07 19:11:12
20230227211149	2026-02-07 19:11:13
20230228184745	2026-02-07 19:11:14
20230308225145	2026-02-07 19:11:15
20230328144023	2026-02-07 19:11:16
20231018144023	2026-02-07 19:11:17
20231204144023	2026-02-07 19:11:19
20231204144024	2026-02-07 19:11:20
20231204144025	2026-02-07 19:11:22
20240108234812	2026-02-07 19:11:23
20240109165339	2026-02-07 19:11:24
20240227174441	2026-02-07 19:11:26
20240311171622	2026-02-07 19:11:27
20240321100241	2026-02-07 19:11:30
20240401105812	2026-02-07 19:11:33
20240418121054	2026-02-07 19:11:35
20240523004032	2026-02-07 19:11:39
20240618124746	2026-02-07 19:11:40
20240801235015	2026-02-07 19:11:41
20240805133720	2026-02-07 19:11:42
20240827160934	2026-02-07 19:11:43
20240919163303	2026-02-07 19:11:45
20240919163305	2026-02-07 19:11:46
20241019105805	2026-02-07 19:11:47
20241030150047	2026-02-07 19:11:52
20241108114728	2026-02-07 19:11:53
20241121104152	2026-02-07 19:11:54
20241130184212	2026-02-07 19:11:56
20241220035512	2026-02-07 19:11:57
20241220123912	2026-02-07 19:11:58
20241224161212	2026-02-07 19:11:59
20250107150512	2026-02-07 19:12:00
20250110162412	2026-02-07 19:12:01
20250123174212	2026-02-07 19:12:02
20250128220012	2026-02-07 19:12:04
20250506224012	2026-02-07 19:12:04
20250523164012	2026-02-07 19:12:06
20250714121412	2026-02-07 19:12:07
20250905041441	2026-02-07 19:12:08
20251103001201	2026-02-07 19:12:09
20251120212548	2026-02-07 19:12:11
20251120215549	2026-02-07 19:12:12
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-02-07 18:14:50.002812
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-02-07 18:14:50.060721
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2026-02-07 18:14:50.069574
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-02-07 18:14:50.122009
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-02-07 18:14:50.15506
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-02-07 18:14:50.162122
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2026-02-07 18:14:50.17182
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-02-07 18:14:50.180911
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-02-07 18:14:50.187813
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2026-02-07 18:14:50.194802
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2026-02-07 18:14:50.202236
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-02-07 18:14:50.209943
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-02-07 18:14:50.217808
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-02-07 18:14:50.224733
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-02-07 18:14:50.231955
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-02-07 18:14:50.258824
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-02-07 18:14:50.267767
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-02-07 18:14:50.274675
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-02-07 18:14:50.28148
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-02-07 18:14:50.292116
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-02-07 18:14:50.299333
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-02-07 18:14:50.307876
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-02-07 18:14:50.322124
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-02-07 18:14:50.334788
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-02-07 18:14:50.343053
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-02-07 18:14:50.350257
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2026-02-07 18:14:50.358289
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2026-02-07 18:14:50.372334
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2026-02-07 18:14:51.14906
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2026-02-07 18:14:51.157497
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2026-02-07 18:14:51.164767
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2026-02-07 18:14:51.170816
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2026-02-07 18:14:51.17691
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2026-02-07 18:14:51.182809
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2026-02-07 18:14:51.184911
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2026-02-07 18:14:51.192946
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2026-02-07 18:14:51.19975
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-02-07 18:14:51.209688
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2026-02-07 18:14:51.216808
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2026-02-07 18:14:51.230254
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2026-02-07 18:14:51.237744
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2026-02-07 18:14:51.247844
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2026-02-07 18:14:51.255417
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2026-02-07 18:14:51.263722
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-02-07 18:14:51.270861
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-02-07 18:14:51.277974
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-02-07 18:14:51.291443
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-02-07 18:14:51.299147
48	iceberg-catalog-ids	2666dff93346e5d04e0a878416be1d5fec345d6f	2026-02-07 18:14:51.305892
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-02-07 18:14:51.32341
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict MOcsOJo9vf1dgMFVxbjuNaRQcb3w5vUrBt8cNyMJ8Ylt1ocBzs35yQMONbWxdhU

