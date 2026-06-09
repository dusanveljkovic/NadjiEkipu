-- =============================================
-- Skript za popunjavanje baze podataka nadji_ekipu
-- =============================================

USE `nadji_ekipu`;

-- =============================================
-- 1. Popunjavanje tabela uloga (roles)
-- =============================================
INSERT INTO `roles` (`name`) VALUES 
('Admin'),
('Moderator'),
('Korisnik');

-- =============================================
-- 2. Popunjavanje tabela korisnika (users)
-- Lozinka za sve korisnike je 'password123'
-- =============================================
INSERT INTO `users` (`username`, `email`, `password_hash`, `firstname`, `lastname`, `birthyear`, `role_id`, `avatar_id`) VALUES 
('admin', 'admin@nadjiekipu.com', SHA2('admin123', 256), 'Administrator', 'Sistema', 2004, 1, 1),
('tigar', 'tigar@nadjiekipu.com', SHA2('password123', 256), 'Tigar', 'Tigric', 2004, 2, 2),
('jana', 'jana@nadjiekipu.com', SHA2('password123', 256), 'Jana', 'Banana', 2004, 3, 3);

-- =============================================
-- 3. Popunjavanje tabela interesovanja (interests)
-- =============================================
INSERT INTO `interests` (`name`, `description`, `avatar_id`, `created_by`) VALUES 
('Fudbal', 'Fudbalske utakmice, treninzi i turniri', 1, 1),
('Kosarka', 'Kosarkaske utakmice i treninzi', 2, 1),
('Tenis', 'Tenis mecevi i treninzi', 3, 1),
('Plivanje', 'Casovi plivanja i takmicenja', 4, 2),
('Trcanje', 'Maratonski treninzi i grupno trcanje', 5, 2),
('Joga', 'Casovi joge i meditacije', 6, 2),
('Biciklizam', 'Grupne biciklisticke ture i trke', 7, 3),
('Planinarenje', 'Planinski pohodi i setnje u prirodi', 8, 3),
('Sah', 'Sahovski turniri i treninzi', 9, 3),
('Fotografija', 'Radionice fotografije i foto setnje', 10, 1),
('Kuvanje', 'Kulinarski casovi i dogadjaji', 11, 2),
('Ples', 'Casovi plesa i drustveni ples', 12, 3),
('Gaming', 'Esport turniri i gejming sesije', 13, 1),
('Citanje', 'Knjizevni klubovi i citalacke grupe', 14, 2),
('Umetnost', 'Umetnicke radionice i izlozbe', 15, 3);

-- =============================================
-- 4. Popunjavanje tabela korisnickih interesovanja (user_interests)
-- =============================================
INSERT INTO `user_interests` (`user_id`, `interest_id`, `skill_level`, `attended_count`) VALUES 
(2, 1, 4, 8),
(2, 2, 3, 5),
(2, 5, 3, 4),
(3, 1, 2, 3),
(3, 3, 3, 2),
(3, 6, 4, 6),
(3, 8, 2, 2);

-- =============================================
-- 5. Popunjavanje tabela aktivnosti (activities)
-- =============================================
INSERT INTO `activities` (`interest_id`, `created_by`, `title`, `description`, `event_time`, `lat`, `lon`, `location_name`, `max_participants`, `indoor`) VALUES 
(1, 2, 'Nedeljna Fudbalska Utakmica', 'Prijateljska fudbalska utakmica za sve nivoe znanja', DATE_ADD(NOW(), INTERVAL 7 DAY), 44.786568, 20.448922, 'Fudbalski teren SC Vozdovac', 22, 0),
(1, 2, 'Fudbalski Trening', 'Nedeljni fudbalski trening i vezbe', DATE_ADD(NOW(), INTERVAL 9 DAY), 44.817813, 20.456896, 'Sportska hala Pinki', 20, 1),
(2, 2, 'Vikend Kosarkaski Turnir', '3 na 3 kosarkaski turnir', DATE_ADD(NOW(), INTERVAL 8 DAY), 44.820556, 20.462083, 'Kosarkaski teren Kalemegdan', 16, 0),
(2, 3, 'Kosarkaska Skola', 'Trening kosarke za pocetnike', DATE_ADD(NOW(), INTERVAL 10 DAY), 44.803375, 20.363545, 'Hala sportova Novi Beograd', 12, 1),
(3, 3, 'Tenis Dubl Mecevi', 'Traze se partneri za dubl meceve', DATE_ADD(NOW(), INTERVAL 11 DAY), 44.786568, 20.448922, 'Teniski klub ''Dunav''', 4, 0),
(3, 3, 'Casovi Tenisa za Pocetnike', 'Osnovni tenis sa trenerom', DATE_ADD(NOW(), INTERVAL 12 DAY), 44.820556, 20.462083, 'Teniski centar Banjica', 8, 1),
(4, 2, 'Jutarnje Plivanje', 'Trening plivanja za rekreativce', DATE_ADD(NOW(), INTERVAL 7 DAY), 44.817813, 20.456896, 'Bazen SC Banjica', 10, 1),
(5, 2, 'Trka na 5km', 'Rekreativna trka za sve generacije', DATE_ADD(NOW(), INTERVAL 14 DAY), 44.803375, 20.363545, 'Ada Ciganlija', 50, 0),
(5, 3, 'Priprema za Maraton', 'Dug distance trening za maraton', DATE_ADD(NOW(), INTERVAL 15 DAY), 44.786568, 20.448922, 'Staza na Adi', 15, 0),
(6, 3, 'Joga u Parku', 'Jutarnja joga na svezem vazduhu', DATE_ADD(NOW(), INTERVAL 8 DAY), 44.820556, 20.462083, 'Park Tasmajdan', 20, 0),
(6, 2, 'Vecernja Meditacija', 'Vodjena meditacija za opustanje', DATE_ADD(NOW(), INTERVAL 9 DAY), 44.817813, 20.456896, 'Centar za wellness', 15, 1),
(7, 3, 'Biciklisticka Tura', '50km biciklisticke rute kroz Beograd', DATE_ADD(NOW(), INTERVAL 15 DAY), 44.803375, 20.363545, 'Start kod Brankovog mosta', 25, 0),
(8, 2, 'Planinarenje na Avali', 'Dnevni planinarski pohod na Avals', DATE_ADD(NOW(), INTERVAL 14 DAY), 44.786568, 20.448922, 'Avala - pocetak staze', 12, 0),
(9, 2, 'Sahovski Turnir', 'Brzopotezni sah turnir', DATE_ADD(NOW(), INTERVAL 12 DAY), 44.820556, 20.462083, 'Sah klub ''Dorcol''', 32, 1),
(10, 3, 'Ulicna Fotografija', 'Radionica ulicne fotografije', DATE_ADD(NOW(), INTERVAL 13 DAY), 44.817813, 20.456896, 'Umetnicki kvart Savamala', 10, 0);

-- =============================================
-- 6. Popunjavanje tabela ucesnika aktivnosti (activity_participants)
-- =============================================
INSERT INTO `activity_participants` (`activity_id`, `user_id`, `status`) VALUES 
(1, 3, 1),
(1, 2, 1),
(2, 3, 1),
(3, 2, 1),
(4, 2, 1),
(5, 2, 1),
(6, 2, 1),
(7, 3, 1),
(8, 2, 1),
(8, 3, 1),
(9, 3, 1),
(10, 2, 1),
(11, 3, 1),
(12, 2, 1),
(13, 3, 1),
(14, 2, 1),
(15, 2, 1);

-- =============================================
-- 7. Popunjavanje tabela caskanja (chats)
-- Automatsko kreiranje caskanja za svaku aktivnost
-- =============================================
INSERT INTO `chats` (`event_id`, `expires_at`) VALUES 
(1, DATE_ADD((SELECT event_time FROM activities WHERE idactivities = 1), INTERVAL 7 DAY)),
(2, DATE_ADD((SELECT event_time FROM activities WHERE idactivities = 2), INTERVAL 7 DAY)),
(3, DATE_ADD((SELECT event_time FROM activities WHERE idactivities = 3), INTERVAL 7 DAY)),
(4, DATE_ADD((SELECT event_time FROM activities WHERE idactivities = 4), INTERVAL 7 DAY)),
(5, DATE_ADD((SELECT event_time FROM activities WHERE idactivities = 5), INTERVAL 7 DAY)),
(6, DATE_ADD((SELECT event_time FROM activities WHERE idactivities = 6), INTERVAL 7 DAY)),
(7, DATE_ADD((SELECT event_time FROM activities WHERE idactivities = 7), INTERVAL 7 DAY)),
(8, DATE_ADD((SELECT event_time FROM activities WHERE idactivities = 8), INTERVAL 7 DAY)),
(9, DATE_ADD((SELECT event_time FROM activities WHERE idactivities = 9), INTERVAL 7 DAY)),
(10, DATE_ADD((SELECT event_time FROM activities WHERE idactivities = 10), INTERVAL 7 DAY)),
(11, DATE_ADD((SELECT event_time FROM activities WHERE idactivities = 11), INTERVAL 7 DAY)),
(12, DATE_ADD((SELECT event_time FROM activities WHERE idactivities = 12), INTERVAL 7 DAY)),
(13, DATE_ADD((SELECT event_time FROM activities WHERE idactivities = 13), INTERVAL 7 DAY)),
(14, DATE_ADD((SELECT event_time FROM activities WHERE idactivities = 14), INTERVAL 7 DAY)),
(15, DATE_ADD((SELECT event_time FROM activities WHERE idactivities = 15), INTERVAL 7 DAY));

-- =============================================
-- 8. Popunjavanje tabela poruka (messages)
-- =============================================
INSERT INTO `messages` (`chat_id`, `sender_id`, `message`) VALUES 
(1, 2, 'Cao svima, jedva cekam utakmicu!'),
(1, 3, 'I ja sam se prijavio, vidimo se u nedelju!'),
(2, 2, 'Trening je u utorak, ko je spreman?'),
(2, 3, 'Ja dolazim, moze neko da ponese loptu?'),
(3, 2, 'Prijavite se za turnir, mesta su ogranicena!'),
(4, 2, 'Dobrodosli svi pocetnici na trening'),
(5, 2, 'Fali jos jedan par za dubl, ko je zainteresovan?'),
(6, 3, 'Casovi tenisa pocinju sledece nedelje'),
(7, 3, 'Jutarnje plivanje je odlicno za pocetak dana'),
(8, 2, 'Trka na 5km, svi su dobrodosli!'),
(9, 3, 'Pripreme za maraton su u toku'),
(10, 2, 'Joga u parku - donesite svoje strunjace'),
(11, 3, 'Meditacija za opustanje nakon posla'),
(12, 2, 'Biciklisticka tura kroz Beograd'),
(13, 3, 'Planinarenje na Avali - vrhunski provod!'),
(14, 2, 'Sah turnir - prijavite se na vreme'),
(15, 2, 'Fotografisanje po Savamali');

-- =============================================
-- 9. Popunjavanje tabela zahteva za moderatore (moderator_requests)
-- =============================================
INSERT INTO `moderator_requests` (`user_id`, `status`, `created_at`) VALUES 
(3, 'PENDING', NOW()),
(2, 'APPROVED', DATE_SUB(NOW(), INTERVAL 5 DAY));

-- Azuriranje odobrenog zahteva
UPDATE `moderator_requests` 
SET `resolved_at` = NOW(), `status` = 'APPROVED' 
WHERE `user_id` = 2 AND `status` = 'PENDING';

-- =============================================
-- 10. Prikaz podataka za proveru
-- =============================================
SELECT 'Podaci su uspesno uneti!' AS Status;

-- Prikaz korisnika
SELECT '=== KORISNICI ===' AS '';
SELECT idusers, username, email, firstname, lastname, 
       CASE role_id 
           WHEN 1 THEN 'Admin'
           WHEN 2 THEN 'Moderator'
           ELSE 'Korisnik'
       END AS uloga
FROM users;

-- Prikaz aktivnosti
SELECT '=== AKTIVNOSTI ===' AS '';
SELECT a.idactivities, i.name AS interesovanje, a.title, a.event_time, a.location_name
FROM activities a
JOIN interests i ON a.interest_id = i.idinterests
ORDER BY a.event_time;

-- Prikaz ucesnika po aktivnostima
SELECT '=== UCESNICI PO AKTIVNOSTIMA ===' AS '';
SELECT a.title, u.username, u.firstname, u.lastname
FROM activity_participants ap
JOIN activities a ON ap.activity_id = a.idactivities
JOIN users u ON ap.user_id = u.idusers
ORDER BY a.title;