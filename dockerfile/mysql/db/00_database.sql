CREATE DATABASE IF NOT EXISTS cafekatu;
use cafekatu;

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
    email          VARCHAR(255) NOT NULL,
    password_digest    VARCHAR(20) NOT NULL,
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


INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved) VALUES ('お菓子の家', '1111111',1,'中央区','銀座','11時から15時まで',1);
INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved) VALUES ('coffee shop', '1111111',1,'新宿区','歌舞伎町','8時から12時まで',1);
INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved) VALUES ('お菓子の家', '1111111',1,'渋谷区','渋谷','毎週土曜日定休日',1);
INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved) VALUES ('お菓子の家', '1111111',1,'中央区','銀座','11時から15時まで',1);
INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved) VALUES ('coffee shop', '1111111',1,'新宿区','歌舞伎町','8時から12時まで',1);
INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved) VALUES ('お菓子の家', '1111111',1,'渋谷区','渋谷','毎週土曜日定休日',1);
INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved) VALUES ('お菓子の家', '1111111',1,'中央区','銀座','11時から15時まで',1);
INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved) VALUES ('coffee shop', '1111111',1,'新宿区','歌舞伎町','8時から12時まで',1);
INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved) VALUES ('お菓子の家', '1111111',1,'渋谷区','渋谷','毎週土曜日定休日',1);
INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved) VALUES ('お菓子の家', '1111111',1,'中央区','銀座','11時から15時まで',1);
INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved) VALUES ('coffee shop', '1111111',1,'新宿区','歌舞伎町','8時から12時まで',1);
INSERT INTO cafes (name, zipcode,prefecture_id,city,street,business_hours,approved) VALUES ('お菓子の家', '1111111',1,'渋谷区','渋谷','毎週土曜日定休日',1);


INSERT INTO users (email, password_digest,nickname) VALUES ('sample1@email.com', 'djeiv53','ユーザー1');
INSERT INTO users (email, password_digest,nickname) VALUES ('sample2@email.com', 'djeiv53','ユーザー2');
INSERT INTO users (email, password_digest,nickname) VALUES ('sample3@email.com', 'djeiv53','ユーザー3');

INSERT INTO reviews (user_id, cafe_id,comment,rating) VALUES ('1', '1','ケーキが美味しかった',3);
INSERT INTO reviews (user_id, cafe_id,comment,rating) VALUES ('2', '1','コーヒーが好き',3);
INSERT INTO reviews (user_id, cafe_id,comment,rating) VALUES ('3', '1','朝早くから営業して使いやすい',5);
