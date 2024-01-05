CREATE DATABASE IF NOT EXISTS `movie_database`;

USE `movie_database`;

CREATE TABLE IF NOT EXISTS `movies` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `producer` VARCHAR(255) NOT NULL,
    `release_date` DATETIME NOT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `idx_movie_id` (`id`)
) ENGINE = InnoDB;
