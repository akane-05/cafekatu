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
    updated_at     TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
    FOREIGN KEY (`prefecture_id`) REFERENCES prefectures(`id`)
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
    rating    INT NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
    updated_at     TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
    FOREIGN KEY (`user_id`) REFERENCES users(`id`) ,
    FOREIGN KEY (`cafe_id`) REFERENCES cafes(`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS favorites (
    user_id             INT UNSIGNED NOT NULL ,
    cafe_id             INT UNSIGNED NOT NULL ,
    created_at      TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
    updated_at     TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
    PRIMARY KEY (`user_id`, `cafe_id`) ,
    FOREIGN KEY (`user_id`) REFERENCES users(`id`) ,
    FOREIGN KEY (`cafe_id`) REFERENCES cafes(`id`)
) ENGINE = InnoDB;

INSERT INTO prefectures (prefecture) VALUES('北海道');
INSERT INTO prefectures (prefecture) VALUES('青森県');
INSERT INTO prefectures (prefecture) VALUES('岩手県');
INSERT INTO prefectures (prefecture) VALUES('宮城県');
INSERT INTO prefectures (prefecture) VALUES('秋田県');
INSERT INTO prefectures (prefecture) VALUES('山形県');
INSERT INTO prefectures(prefecture) VALUES('福島県');
INSERT INTO prefectures(prefecture) VALUES('茨城県');
INSERT INTO prefectures(prefecture) VALUES('栃木県');
INSERT INTO prefectures(prefecture) VALUES('群馬県');
INSERT INTO prefectures(prefecture) VALUES('埼玉県');
INSERT INTO prefectures(prefecture) VALUES('千葉県');
INSERT INTO prefectures(prefecture) VALUES('東京都');
INSERT INTO prefectures(prefecture) VALUES('神奈川県');
INSERT INTO prefectures(prefecture) VALUES('新潟県');
INSERT INTO prefectures(prefecture) VALUES('富山県');
INSERT INTO prefectures(prefecture) VALUES('石川県');
INSERT INTO prefectures(prefecture) VALUES('福井県');
INSERT INTO prefectures(prefecture) VALUES('山梨県');
INSERT INTO prefectures(prefecture) VALUES('長野県');
INSERT INTO prefectures(prefecture) VALUES('岐阜県');
INSERT INTO prefectures(prefecture) VALUES('静岡県');
INSERT INTO prefectures(prefecture) VALUES('愛知県');
INSERT INTO prefectures(prefecture) VALUES('三重県');
INSERT INTO prefectures(prefecture) VALUES('滋賀県');
INSERT INTO prefectures(prefecture) VALUES('京都府');
INSERT INTO prefectures(prefecture) VALUES('大阪府');
INSERT INTO prefectures(prefecture) VALUES('兵庫県');
INSERT INTO prefectures(prefecture) VALUES('奈良県');
INSERT INTO prefectures(prefecture) VALUES('和歌山県');
INSERT INTO prefectures(prefecture) VALUES('鳥取県');
INSERT INTO prefectures(prefecture) VALUES('島根県');
INSERT INTO prefectures(prefecture) VALUES('岡山県');
INSERT INTO prefectures(prefecture) VALUES('広島県');
INSERT INTO prefectures(prefecture) VALUES('山口県');
INSERT INTO prefectures(prefecture) VALUES('徳島県');
INSERT INTO prefectures(prefecture) VALUES('香川県');
INSERT INTO prefectures(prefecture) VALUES('愛媛県');
INSERT INTO prefectures(prefecture) VALUES('高知県');
INSERT INTO prefectures(prefecture) VALUES('福岡県');
INSERT INTO prefectures(prefecture) VALUES('佐賀県');
INSERT INTO prefectures(prefecture) VALUES('長崎県');
INSERT INTO prefectures(prefecture) VALUES('熊本県');
INSERT INTO prefectures(prefecture) VALUES('大分県');
INSERT INTO prefectures(prefecture) VALUES('宮崎県');
INSERT INTO prefectures(prefecture) VALUES('鹿児島県');
INSERT INTO prefectures(prefecture) VALUES('沖縄県');


INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved,created_at,updated_at) VALUES ('お菓子の家', '0600042',1,'札幌市','大通１','11時から15時まで',1,'2022-10-1 09:00:00','2022-11-01 12:00:00');
INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved,created_at,updated_at) VALUES ('coffee shop', '0300846',2,'青森市','青葉','8時から12時まで',1,'2022-10-1 09:00:00','2022-11-01 12:00:00');
INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved,created_at,updated_at) VALUES ('喫茶東京', '1040044',13,'中央区','明石町','毎週土曜日定休日',1,'2022-10-1 09:00:00','2022-11-01 12:00:00');
INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved,created_at,updated_at) VALUES ('海の家', '9000002',47,'那覇市','曙','13時から',1,'2022-10-1 09:00:00','2022-11-01 12:00:00');
INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved,created_at,updated_at) VALUES ('morning', '4520813',38,'名古屋市','西区','年中無休',1,'2022-10-1 09:00:00','2022-11-01 12:00:00');


INSERT INTO users (email, password_digest,nickname) VALUES ('user1@email.com', '$2a$10$lFv9r5L8re196/AjvRoN3uVNAKN7H23KbyOBMmpFCBlmGBy46glse','ユーザー1');
INSERT INTO users (email, password_digest,nickname) VALUES ('user2@email.com', '$2a$10$lFv9r5L8re196/AjvRoN3uVNAKN7H23KbyOBMmpFCBlmGBy46glse','ユーザー2');
INSERT INTO users (email, password_digest,nickname) VALUES ('user3@email.com', '$2a$10$lFv9r5L8re196/AjvRoN3uVNAKN7H23KbyOBMmpFCBlmGBy46glse','ユーザー3');
INSERT INTO users (email, password_digest,nickname) VALUES ('login@email.com', '$2a$10$lFv9r5L8re196/AjvRoN3uVNAKN7H23KbyOBMmpFCBlmGBy46glse','ログインテスト');


INSERT INTO reviews (user_id, cafe_id,comment,rating) VALUES ('1', '1','ケーキが美味しかった',2);
INSERT INTO reviews (user_id, cafe_id,comment,rating) VALUES ('2', '2','コーヒーが好き',3);
INSERT INTO reviews (user_id, cafe_id,comment,rating) VALUES ('3', '3','朝早くから営業して使いやすい',5);
INSERT INTO reviews (user_id, cafe_id,comment,rating) VALUES ('1', '1','ケーキが絶品',4);

INSERT INTO favorites (user_id, cafe_id) VALUES (1, 1);
INSERT INTO favorites (user_id, cafe_id) VALUES (2, 1);
INSERT INTO favorites (user_id, cafe_id) VALUES (1, 4);
