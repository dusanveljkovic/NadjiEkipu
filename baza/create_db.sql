-- MySQL Workbench Forward Engineering

-- SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
-- SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
-- SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema nadji_ekipu
-- -----------------------------------------------------
-- CREATE SCHEMA IF NOT EXISTS `nadji_ekipu`;
-- USE `nadji_ekipu`;

-- -----------------------------------------------------
-- Table `nadji_ekipu`.`roles`
-- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`roles` (
--   `idroles` INT NOT NULL AUTO_INCREMENT,
--   `name` VARCHAR(50) NOT NULL,
--   PRIMARY KEY (`idroles`),
--   UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`users`
-- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`users` (
--   `idusers` INT NOT NULL AUTO_INCREMENT,
--   `username` VARCHAR(128) NOT NULL,
--   `email` VARCHAR(128) NOT NULL,
--   `password_hash` VARCHAR(255) NOT NULL,
--   `firstname` VARCHAR(128) NULL,
--   `lastname` VARCHAR(128) NULL,
--   `birthyear` INT NULL,
--   `role_id` INT NOT NULL DEFAULT 1,
--   `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
--   `avatar_id` TINYINT NULL DEFAULT 0,
--   PRIMARY KEY (`idusers`),
--   UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
--   UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
--   INDEX `fk_users_role_idx` (`role_id` ASC) VISIBLE,
--   CONSTRAINT `fk_users_role`
--     FOREIGN KEY (`role_id`)
--     REFERENCES `nadji_ekipu`.`roles` (`idroles`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION)
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`moderator_requests`
-- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`moderator_requests` (
--   `idmoderator_requests` INT NOT NULL AUTO_INCREMENT,
--   `user_id` INT NOT NULL,
--   `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NULL DEFAULT 'PENDING',
--   `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
--   `resolved_at` TIMESTAMP NULL DEFAULT NULL,
--   PRIMARY KEY (`idmoderator_requests`),
--   INDEX `fk_mr_user_idx` (`user_id` ASC) VISIBLE,
--   CONSTRAINT `fk_mr_user`
--     FOREIGN KEY (`user_id`)
--     REFERENCES `nadji_ekipu`.`users` (`idusers`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION)
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`interests`
-- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`interests` (
--   `idinterests` INT NOT NULL AUTO_INCREMENT,
--   `name` VARCHAR(128) NOT NULL,
--   `description` TEXT NULL,
--   `avatar_id` TINYINT NULL DEFAULT 0,
--   `created_by` INT NOT NULL,
--   `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
--   PRIMARY KEY (`idinterests`),
--   UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
--   INDEX `fk_interests_created_by_idx` (`created_by` ASC) VISIBLE,
--   CONSTRAINT `fk_interests_created_by`
--     FOREIGN KEY (`created_by`)
--     REFERENCES `nadji_ekipu`.`users` (`idusers`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION)
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`user_interests`
-- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`user_interests` (
--   `iduser_interests` INT NOT NULL AUTO_INCREMENT,
--   `user_id` INT NOT NULL,
--   `interest_id` INT NOT NULL,
--   `skill_level` TINYINT NULL DEFAULT 0,
--   `attended_count` INT NULL DEFAULT 0,
--   `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
--   PRIMARY KEY (`iduser_interests`),
--   UNIQUE INDEX `unique_ids` (`user_id` ASC, `interest_id` ASC) VISIBLE,
--   INDEX `fk_ui_interest_idx` (`interest_id` ASC) VISIBLE,
--   CONSTRAINT `fk_ui_users`
--     FOREIGN KEY (`user_id`)
--     REFERENCES `nadji_ekipu`.`users` (`idusers`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION,
--   CONSTRAINT `fk_ui_interests`
--     FOREIGN KEY (`interest_id`)
--     REFERENCES `nadji_ekipu`.`interests` (`idinterests`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION)
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`activities`
-- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`activities` (
--   `idactivities` INT NOT NULL AUTO_INCREMENT,
--   `interest_id` INT NOT NULL,
--   `created_by` INT NOT NULL,
--   `title` VARCHAR(128) NOT NULL,
--   `description` TEXT NULL,
--   `event_time` DATETIME NOT NULL,
--   `lat` DECIMAL(10,7) NULL,
--   `lon` DECIMAL(10,7) NULL,
--   `location_name` VARCHAR(128) NULL,
--   `max_participants` INT NULL,
--   `indoor` TINYINT NULL DEFAULT 0,
--   `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
--   PRIMARY KEY (`idactivities`),
--   INDEX `fk_activities_interest_idx` (`interest_id` ASC) VISIBLE,
--   INDEX `fk_activities_user_idx` (`created_by` ASC) VISIBLE,
--   CONSTRAINT `fk_activities_interests`
--     FOREIGN KEY (`interest_id`)
--     REFERENCES `nadji_ekipu`.`interests` (`idinterests`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION,
--   CONSTRAINT `fk_activities_users`
--     FOREIGN KEY (`created_by`)
--     REFERENCES `nadji_ekipu`.`users` (`idusers`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION)
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`activity_participants`
-- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`activity_participants` (
--   `idactivity_participants` INT NOT NULL AUTO_INCREMENT,
--   `activity_id` INT NOT NULL,
--   `user_id` INT NOT NULL,
--   `joined_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
--   `status` TINYINT NULL DEFAULT 0,
--   PRIMARY KEY (`idactivity_participants`),
--   UNIQUE INDEX `unique_activity_user` (`activity_id` ASC, `user_id` ASC) VISIBLE,
--   INDEX `fk_ap_user_idx` (`user_id` ASC) VISIBLE,
--   CONSTRAINT `fk_ap_events`
--     FOREIGN KEY (`activity_id`)
--     REFERENCES `nadji_ekipu`.`activities` (`idactivities`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION,
--   CONSTRAINT `fk_ap_users`
--     FOREIGN KEY (`user_id`)
--     REFERENCES `nadji_ekipu`.`users` (`idusers`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION)
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`chats`
-- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`chats` (
--   `idchats` INT NOT NULL AUTO_INCREMENT,
--   `event_id` INT NOT NULL,
--   `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
--   `expires_at` DATETIME NOT NULL,
--   PRIMARY KEY (`idchats`),
--   UNIQUE INDEX `event_id_UNIQUE` (`event_id` ASC) VISIBLE,
--   CONSTRAINT `fk_chats_events`
--     FOREIGN KEY (`event_id`)
--     REFERENCES `nadji_ekipu`.`activities` (`idactivities`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION)
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`messages`
-- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`messages` (
--   `idmessages` INT NOT NULL AUTO_INCREMENT,
--   `chat_id` INT NOT NULL,
--   `sender_id` INT NOT NULL,
--   `message` TEXT NOT NULL,
--   `sent_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
--   PRIMARY KEY (`idmessages`),
--   INDEX `fk_messages_chat_idx` (`chat_id` ASC) VISIBLE,
--   INDEX `fk_messages_user_idx` (`sender_id` ASC) VISIBLE,
--   CONSTRAINT `fk_messages_chats`
--     FOREIGN KEY (`chat_id`)
--     REFERENCES `nadji_ekipu`.`chats` (`idchats`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION,
--   CONSTRAINT `fk_messages_users`
--     FOREIGN KEY (`sender_id`)
--     REFERENCES `nadji_ekipu`.`users` (`idusers`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION)
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`user_sessions`
-- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`user_sessions` (
--   `iduser_sessions` INT NOT NULL AUTO_INCREMENT,
--   `user_id` INT NULL,
--   `token` VARCHAR(255) NOT NULL,
--   `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
--   `expires_at` DATETIME NOT NULL,
--   PRIMARY KEY (`iduser_sessions`),
--   UNIQUE INDEX `token_UNIQUE` (`token` ASC) VISIBLE,
--   INDEX `fk_sessions_user_idx` (`user_id` ASC) VISIBLE,
--   CONSTRAINT `fk_sessions_users`
--     FOREIGN KEY (`user_id`)
--     REFERENCES `nadji_ekipu`.`users` (`idusers`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION)
-- ENGINE = InnoDB;


-- SET SQL_MODE=@OLD_SQL_MODE;
-- SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
-- SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema nadji_ekipu
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `nadji_ekipu`;
USE `nadji_ekipu`;

-- -----------------------------------------------------
-- Table `nadji_ekipu`.`roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`roles` (
  `idroles` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`idroles`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`users` (
  `idusers` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(128) NOT NULL,
  `email` VARCHAR(128) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `firstname` VARCHAR(128) NULL,
  `lastname` VARCHAR(128) NULL,
  `birthyear` INT NULL,
  `role_id` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `avatar_id` TINYINT NULL DEFAULT 0,
  PRIMARY KEY (`idusers`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `fk_users_role_idx` (`role_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `nadji_ekipu`.`roles` (`idroles`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`moderator_requests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`moderator_requests` (
  `idmoderator_requests` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NULL DEFAULT 'PENDING',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`idmoderator_requests`),
  INDEX `fk_mr_user_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_mr_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `nadji_ekipu`.`users` (`idusers`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`interests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`interests` (
  `idinterests` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(128) NOT NULL,
  `description` TEXT NULL,
  `avatar_id` TINYINT NULL DEFAULT 0,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idinterests`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  INDEX `fk_interests_created_by_idx` (`created_by` ASC) VISIBLE,
  CONSTRAINT `fk_interests_created_by`
    FOREIGN KEY (`created_by`)
    REFERENCES `nadji_ekipu`.`users` (`idusers`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`user_interests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`user_interests` (
  `iduser_interests` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `interest_id` INT NOT NULL,
  `skill_level` TINYINT NULL DEFAULT 0,
  `attended_count` INT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`iduser_interests`),
  UNIQUE INDEX `unique_ids` (`user_id` ASC, `interest_id` ASC) VISIBLE,
  INDEX `fk_ui_interest_idx` (`interest_id` ASC) VISIBLE,
  CONSTRAINT `fk_ui_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `nadji_ekipu`.`users` (`idusers`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ui_interests`
    FOREIGN KEY (`interest_id`)
    REFERENCES `nadji_ekipu`.`interests` (`idinterests`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`activities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`activities` (
  `idactivities` INT NOT NULL AUTO_INCREMENT,
  `interest_id` INT NOT NULL,
  `created_by` INT NOT NULL,
  `title` VARCHAR(128) NOT NULL,
  `description` TEXT NULL,
  `event_time` DATETIME NOT NULL,
  `lat` DECIMAL(10,7) NULL,
  `lon` DECIMAL(10,7) NULL,
  `location_name` VARCHAR(128) NULL,
  `max_participants` INT NULL,
  `indoor` TINYINT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idactivities`),
  INDEX `fk_activities_interest_idx` (`interest_id` ASC) VISIBLE,
  INDEX `fk_activities_user_idx` (`created_by` ASC) VISIBLE,
  CONSTRAINT `fk_activities_interests`
    FOREIGN KEY (`interest_id`)
    REFERENCES `nadji_ekipu`.`interests` (`idinterests`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_activities_users`
    FOREIGN KEY (`created_by`)
    REFERENCES `nadji_ekipu`.`users` (`idusers`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`activity_participants`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`activity_participants` (
  `idactivity_participants` INT NOT NULL AUTO_INCREMENT,
  `activity_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `joined_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `status` TINYINT NULL DEFAULT 0,
  PRIMARY KEY (`idactivity_participants`),
  UNIQUE INDEX `unique_activity_user` (`activity_id` ASC, `user_id` ASC) VISIBLE,
  INDEX `fk_ap_user_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_ap_events`
    FOREIGN KEY (`activity_id`)
    REFERENCES `nadji_ekipu`.`activities` (`idactivities`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ap_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `nadji_ekipu`.`users` (`idusers`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`chats`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`chats` (
  `idchats` INT NOT NULL AUTO_INCREMENT,
  `event_id` INT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NOT NULL,
  PRIMARY KEY (`idchats`),
  UNIQUE INDEX `event_id_UNIQUE` (`event_id` ASC) VISIBLE,
  CONSTRAINT `fk_chats_events`
    FOREIGN KEY (`event_id`)
    REFERENCES `nadji_ekipu`.`activities` (`idactivities`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`messages` (
  `idmessages` INT NOT NULL AUTO_INCREMENT,
  `chat_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `message` TEXT NOT NULL,
  `sent_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idmessages`),
  INDEX `fk_messages_chat_idx` (`chat_id` ASC) VISIBLE,
  INDEX `fk_messages_user_idx` (`sender_id` ASC) VISIBLE,
  CONSTRAINT `fk_messages_chats`
    FOREIGN KEY (`chat_id`)
    REFERENCES `nadji_ekipu`.`chats` (`idchats`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_messages_users`
    FOREIGN KEY (`sender_id`)
    REFERENCES `nadji_ekipu`.`users` (`idusers`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nadji_ekipu`.`user_sessions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nadji_ekipu`.`user_sessions` (
  `iduser_sessions` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `token` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NOT NULL,
  PRIMARY KEY (`iduser_sessions`),
  UNIQUE INDEX `token_UNIQUE` (`token` ASC) VISIBLE,
  INDEX `fk_sessions_user_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_sessions_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `nadji_ekipu`.`users` (`idusers`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;