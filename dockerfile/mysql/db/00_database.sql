CREATE DATABASE IF NOT EXISTS cafekatu;
use cafekatu;

CREATE TABLE IF NOT EXISTS cafes (
    id             INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    prefecture_id        INT NOT NULL,
    city     VARCHAR(255) NOT NULL,
    street     VARCHAR(255),
    business_hours     VARCHAR(255) NOT NULL,
    approved        INT NOT NULL DEFAULT 0,
    deleted        INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
    updated_at     TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp
);

INSERT INTO cafes (name, prefecture_id,city,street,business_hours) VALUES ('お菓子の家', 1,'中央区','銀座','11時から15時まで');
INSERT INTO cafes (name, prefecture_id,city,street,business_hours) VALUES ('coffee shop', 1,'新宿区','歌舞伎町','8時から12時まで');
INSERT INTO cafes (name, prefecture_id,city,street,business_hours) VALUES ('お菓子の家', 1,'渋谷区','渋谷','毎週土曜日定休日');