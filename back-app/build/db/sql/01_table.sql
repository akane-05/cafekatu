CREATE TABLE IF NOT EXISTS cafes (
    id             INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    prefecture_id        INT NOT NULL,
    city     VARCHAR(255) NOT NULL,
    street     VARCHAR(255),
    business_hours     VARCHAR(255) NOT NULL,
    approved        INT NOT NULL DEFAULT 0,
    deleted        INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp
    updated_at     TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp
)