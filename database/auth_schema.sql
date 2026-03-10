-- ============================================================
--  BLAZE FITSS — Auth Addition
--  Run this in phpMyAdmin to add user auth tables
--  (Run AFTER the main schema.sql)
-- ============================================================

USE blaze_fitss;

-- ---- Users ----
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  email         VARCHAR(200) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('customer', 'admin') DEFAULT 'customer',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---- Sessions ----
CREATE TABLE IF NOT EXISTS user_sessions (
  id         VARCHAR(255) PRIMARY KEY,
  user_id    INT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Link orders to users (optional - won't break existing orders)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id INT NULL,
  ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
