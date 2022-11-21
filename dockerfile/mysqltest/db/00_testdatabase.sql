CREATE DATABASE IF NOT EXISTS test_db;
use test_db;

CREATE TABLE IF NOT EXISTS prefectures (
    id             INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    prefecture     VARCHAR(5) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
    updated_at     TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS cafes (
    id             INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    zipcode       VARCHAR(7) NOT NULL,
    prefecture_id        INT UNSIGNED NOT NULL,
    city     VARCHAR(255) NOT NULL,
    street     VARCHAR(255),
    business_hours     VARCHAR(255) NOT NULL,
    approved        INT NOT NULL DEFAULT 0,
    deleted        INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
    updated_at     TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp
    -- FOREIGN KEY (`prefecture_id`) REFERENCES prefectures(`id`)
) ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS users (
    id             INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email          VARCHAR(255) UNIQUE NOT NULL,
    password_digest    VARCHAR(255) NOT NULL,
    nickname        VARCHAR(20) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
    updated_at     TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS reviews (
    id             INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id             INT UNSIGNED NOT NULL,
    cafe_id             INT UNSIGNED NOT NULL,
    comment          VARCHAR(255) NOT NULL,
    rating    FLOAT NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
    updated_at     TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp
    -- FOREIGN KEY (`user_id`) REFERENCES users(`id`) ,
    -- FOREIGN KEY (`cafe_id`) REFERENCES cafes(`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS favorites (
    user_id             INT UNSIGNED NOT NULL ,
    cafe_id             INT UNSIGNED NOT NULL ,
    created_at      TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
    updated_at     TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
    PRIMARY KEY (`user_id`, `cafe_id`)
    -- FOREIGN KEY (`user_id`) REFERENCES users(`id`) ,
    -- FOREIGN KEY (`cafe_id`) REFERENCES cafes(`id`)
) ENGINE = InnoDB;
