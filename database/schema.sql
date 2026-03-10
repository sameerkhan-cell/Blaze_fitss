-- ============================================================
--  BLAZE FITSS — MySQL Schema + Seed Data
--  Run this file once to set up your database:
--  mysql -u root -p < database/schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS blaze_fitss CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blaze_fitss;

-- ---- Categories ----
CREATE TABLE IF NOT EXISTS categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  image_url   VARCHAR(500),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---- Products ----
CREATE TABLE IF NOT EXISTS products (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  category_id  INT NOT NULL,
  name         VARCHAR(200) NOT NULL,
  description  TEXT,
  price        DECIMAL(10,2) NOT NULL,
  image_url    VARCHAR(500),
  tag          VARCHAR(50),
  tag_color    VARCHAR(20) DEFAULT '#e8d5b7',
  rating       DECIMAL(3,2) DEFAULT 4.50,
  review_count INT DEFAULT 0,
  stock        INT DEFAULT 100,
  is_active    TINYINT(1) DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ---- Sessions / Carts ----
CREATE TABLE IF NOT EXISTS carts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---- Cart Items ----
CREATE TABLE IF NOT EXISTS cart_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  cart_id    INT NOT NULL,
  product_id INT NOT NULL,
  quantity   INT NOT NULL DEFAULT 1,
  size       VARCHAR(20),
  added_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id)    REFERENCES carts(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_product_size (cart_id, product_id, size)
);

-- ---- Orders ----
CREATE TABLE IF NOT EXISTS orders (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  order_number    VARCHAR(50) NOT NULL UNIQUE,
  customer_name   VARCHAR(200) NOT NULL,
  customer_email  VARCHAR(200) NOT NULL,
  customer_phone  VARCHAR(50),
  shipping_address TEXT NOT NULL,
  city            VARCHAR(100),
  country         VARCHAR(100) DEFAULT 'Pakistan',
  total_amount    DECIMAL(10,2) NOT NULL,
  status          ENUM('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'pending',
  payment_method  VARCHAR(50) DEFAULT 'cod',
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---- Order Items ----
CREATE TABLE IF NOT EXISTS order_items (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  order_id     INT NOT NULL,
  product_id   INT NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  price        DECIMAL(10,2) NOT NULL,
  quantity     INT NOT NULL,
  size         VARCHAR(20),
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ---- Newsletter Subscribers ----
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(200) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  SEED DATA
-- ============================================================

INSERT INTO categories (slug, name, description, image_url) VALUES
('jerseys',      'Jerseys',       'Premium football jerseys',         '/images/jersey.webp'),
('footballshoes','Football Shoes','Performance football boots',       '/images/Footballshoes.webp'),
('footballs',    'Footballs',     'Match & training footballs',       '/images/Football.webp'),
('shopforkids',  'Shop for Kids', 'Football gear for young players',  '/images/Shopforkids.webp');

-- Jerseys
INSERT INTO products (category_id, name, description, price, image_url, tag, tag_color, rating, review_count, stock) VALUES
(1, 'Real Madrid Home 2026',   'Iconic white home jersey with Adidas Aeroready fabric.', 89.99,  '/images/products/rm-home.webp',   'NEW',    '#10b981', 4.8, 124, 80),
(1, 'Barcelona Away 2026',     'Dark blue away kit with subtle Barça crest detailing.',  84.99,  '/images/products/barca-away.webp', 'SALE',   '#ef4444', 4.7, 98,  60),
(1, 'Manchester City Third',   'Sky blue third kit inspired by Manchester city streets.',79.99,  '/images/products/mcity-third.webp','HOT',    '#f59e0b', 4.6, 77,  45),
(1, 'PSG Home 2026',           'Parisian elegance meets Dri-FIT tech in this home kit.', 94.99,  '/images/products/psg-home.webp',  'NEW',    '#10b981', 4.9, 212, 90),
(1, 'Argentina World Cup Kit', 'Blue & white stripes — the champions\' shirt.',          99.99,  '/images/products/arg-kit.webp',   'ICONIC', '#6366f1', 5.0, 341, 50);

-- Football Shoes
INSERT INTO products (category_id, name, description, price, image_url, tag, tag_color, rating, review_count, stock) VALUES
(2, 'Nike Mercurial Vapor 16', 'Speed-focused boot with flyknit upper for precision.',   159.99, '/images/products/mercurial.webp', 'TOP PICK','#6366f1', 4.9, 289, 40),
(2, 'Adidas Predator Elite',   'Control & spin technology for midfield dominance.',      149.99, '/images/products/predator.webp',  'HOT',    '#f59e0b', 4.8, 176, 35),
(2, 'Puma Future 8 FG',        'Innovative lacing system for adaptive fit.',             129.99, '/images/products/puma-future.webp','NEW',   '#10b981', 4.7, 92,  55),
(2, 'New Balance Furon v7',    'Lightweight leather upper, soft touch control.',         139.99, '/images/products/nb-furon.webp',  NULL,     '#e8d5b7', 4.6, 63,  30);

-- Footballs
INSERT INTO products (category_id, name, description, price, image_url, tag, tag_color, rating, review_count, stock) VALUES
(3, 'Adidas Al Rihla Match Ball','Official FIFA World Cup match ball, size 5.',          49.99,  '/images/products/al-rihla.webp',  'OFFICIAL','#6366f1',4.9, 412, 200),
(3, 'Nike Premier League Ball', 'Nike Flight tech for truer flight trajectory.',         44.99,  '/images/products/nike-pl.webp',   'LEAGUE', '#f59e0b', 4.8, 187, 150),
(3, 'Puma Orbita Training Ball','Durable rubber bladder for all-surface training.',      24.99,  '/images/products/puma-orbita.webp',NULL,    '#e8d5b7', 4.5, 55,  300),
(3, 'Select Brillant Super',   'Danish craftsmanship, soft touch microfiber surface.',  39.99,  '/images/products/select.webp',    'SALE',   '#ef4444', 4.7, 102, 120);

-- Kids
INSERT INTO products (category_id, name, description, price, image_url, tag, tag_color, rating, review_count, stock) VALUES
(4, 'Kids Real Madrid Kit',    'Full home kit set for ages 4–14. Breathable mesh.',      59.99,  '/images/products/kids-rm.webp',   'POPULAR','#10b981', 4.9, 234, 75),
(4, 'Junior Football Boots',   'Supportive heel cap and non-marking outsole.',           49.99,  '/images/products/kids-boots.webp', NULL,    '#e8d5b7', 4.7, 98,  60),
(4, 'Kids Training Ball Sz 3', 'Soft-touch size 3 ball, perfect for young learners.',   19.99,  '/images/products/kids-ball.webp',  'NEW',   '#10b981', 4.8, 71,  250),
(4, 'Mini Goalkeeper Set',     'Gloves + mini goal for backyard practice.',             34.99,  '/images/products/kids-gk.webp',   'SET',    '#6366f1', 4.6, 45,  80);
