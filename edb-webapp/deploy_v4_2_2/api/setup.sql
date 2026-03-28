CREATE TABLE IF NOT EXISTS `presentations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` ENUM('sp', 'lo', 'inne') COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_priority` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data
INSERT INTO `presentations` (`title`, `url`, `category`) VALUES
('Podstawy RKO (Szkoła Podstawowa)', 'https://docs.google.com/presentation', 'sp'),
('Cyberbezpieczeństwo w sieci', 'https://docs.google.com/presentation', 'sp'),
('Zagrożenie Powodziowe (Część 1)', 'https://docs.google.com/presentation', 'lo'),
('Zagrożenie Powodziowe (Część 2)', 'https://docs.google.com/presentation', 'lo'),
('Zaawansowana Pierwsza Pomoc', 'https://docs.google.com/presentation', 'lo'),
('Wymagania i kryteria oceny LO', 'https://docs.google.com/document', 'inne'),
('Podręcznik Bądź Gotów!', 'https://docs.google.com/document', 'inne');

CREATE TABLE IF NOT EXISTS `student_submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_type` ENUM('prezentki', 'nazaret') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `menu_links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(100) NOT NULL,
  `url` varchar(500) NOT NULL,
  `order_priority` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
