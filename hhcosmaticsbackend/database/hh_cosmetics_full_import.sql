-- H&H Hair & Cosmetics backend database
-- MySQL 8.x recommended
-- Demo credentials after import:
-- SUPERADMIN: admin@hhcosmetics.co.uk / Admin@12345
-- CUSTOMER: customer@example.com / User@12345

CREATE DATABASE IF NOT EXISTS hh_cosmetics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hh_cosmetics;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS admin_activity_logs;
DROP TABLE IF EXISTS newsletter_subscribers;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS inventory_logs;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS banners;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS order_status_history;
DROP TABLE IF EXISTS coupon_usages;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS subcategories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('USER','SUPERADMIN') NOT NULL DEFAULT 'USER',
  status ENUM('ACTIVE','BLOCKED') NOT NULL DEFAULT 'ACTIVE',
  email_verified_at DATETIME NULL,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  PRIMARY KEY (id), UNIQUE KEY uq_users_email (email), KEY idx_users_role_status (role,status)
) ENGINE=InnoDB;

CREATE TABLE refresh_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash VARCHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  user_agent VARCHAR(500) NULL,
  ip_address VARCHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_refresh_token_hash (token_hash), KEY idx_refresh_user (user_id),
  CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE password_resets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash VARCHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_password_reset_hash (token_hash), KEY idx_reset_user (user_id),
  CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE addresses (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  label VARCHAR(50) NOT NULL DEFAULT 'Home',
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  address_line1 VARCHAR(191) NOT NULL,
  address_line2 VARCHAR(191) NULL,
  city VARCHAR(100) NOT NULL,
  county VARCHAR(100) NULL,
  postcode VARCHAR(20) NOT NULL,
  country VARCHAR(80) NOT NULL DEFAULT 'United Kingdom',
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_address_user (user_id),
  CONSTRAINT fk_address_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL,
  description TEXT NULL,
  image_url VARCHAR(500) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  PRIMARY KEY (id), UNIQUE KEY uq_category_name (name), UNIQUE KEY uq_category_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE subcategories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL,
  description TEXT NULL,
  image_url VARCHAR(500) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  PRIMARY KEY (id), UNIQUE KEY uq_subcategory_slug (slug), KEY idx_subcategory_category (category_id),
  CONSTRAINT fk_subcategory_category FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

CREATE TABLE products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  subcategory_id BIGINT UNSIGNED NULL,
  name VARCHAR(191) NOT NULL,
  slug VARCHAR(220) NOT NULL,
  sku VARCHAR(80) NULL,
  brand VARCHAR(120) NOT NULL DEFAULT 'H&H Hair & Cosmetics',
  short_description VARCHAR(500) NULL,
  description LONGTEXT NULL,
  ingredients LONGTEXT NULL,
  usage_notes LONGTEXT NULL,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  compare_at_price DECIMAL(10,2) NULL,
  cost_price DECIMAL(10,2) NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  low_stock_threshold INT UNSIGNED NOT NULL DEFAULT 5,
  track_inventory TINYINT(1) NOT NULL DEFAULT 1,
  badge VARCHAR(80) NULL,
  rating_average DECIMAL(3,2) NOT NULL DEFAULT 0,
  review_count INT UNSIGNED NOT NULL DEFAULT 0,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_new TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  metadata JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  PRIMARY KEY (id), UNIQUE KEY uq_product_slug (slug), UNIQUE KEY uq_product_sku (sku),
  KEY idx_product_category (category_id), KEY idx_product_subcategory (subcategory_id), KEY idx_product_active (is_active),
  CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT fk_product_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE product_variants (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  sku VARCHAR(80) NOT NULL,
  attributes JSON NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  compare_at_price DECIMAL(10,2) NULL,
  cost_price DECIMAL(10,2) NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  low_stock_threshold INT UNSIGNED NOT NULL DEFAULT 5,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  PRIMARY KEY (id), UNIQUE KEY uq_variant_sku (sku), KEY idx_variant_product (product_id),
  CONSTRAINT fk_variant_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_images (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  variant_id BIGINT UNSIGNED NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_image_product (product_id), KEY idx_image_variant (variant_id),
  CONSTRAINT fk_image_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_image_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE wishlists (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_wishlist_user_product (user_id,product_id),
  CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE carts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_cart_user (user_id),
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cart_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  cart_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  variant_id BIGINT UNSIGNED NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_cartitem_cart (cart_id), KEY idx_cartitem_product (product_id), KEY idx_cartitem_variant (variant_id),
  CONSTRAINT fk_cartitem_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  CONSTRAINT fk_cartitem_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_cartitem_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE coupons (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(120) NOT NULL,
  type ENUM('PERCENT','FIXED') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  min_order DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_discount DECIMAL(10,2) NULL,
  usage_limit INT UNSIGNED NULL,
  used_count INT UNSIGNED NOT NULL DEFAULT 0,
  per_user_limit INT UNSIGNED NOT NULL DEFAULT 1,
  starts_at DATETIME NULL,
  ends_at DATETIME NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  PRIMARY KEY (id), UNIQUE KEY uq_coupon_code (code)
) ENGINE=InnoDB;

CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  coupon_id BIGINT UNSIGNED NULL,
  order_number VARCHAR(40) NOT NULL,
  status ENUM('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','RETURN_REQUESTED','RETURNED') NOT NULL DEFAULT 'PENDING',
  payment_method ENUM('COD') NOT NULL DEFAULT 'COD',
  payment_status ENUM('COD_PENDING','PAID','REFUNDED','VOID') NOT NULL DEFAULT 'COD_PENDING',
  shipping_method ENUM('STANDARD','EXPRESS') NOT NULL DEFAULT 'STANDARD',
  currency VARCHAR(3) NOT NULL DEFAULT 'GBP',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  cod_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  coupon_code VARCHAR(50) NULL,
  customer_note VARCHAR(1000) NULL,
  admin_note VARCHAR(2000) NULL,
  shipping_address JSON NOT NULL,
  billing_address JSON NULL,
  tracking_number VARCHAR(120) NULL,
  carrier VARCHAR(120) NULL,
  confirmed_at DATETIME NULL,
  shipped_at DATETIME NULL,
  delivered_at DATETIME NULL,
  cancelled_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_order_number (order_number), KEY idx_order_user (user_id), KEY idx_order_status (status),
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_order_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  variant_id BIGINT UNSIGNED NULL,
  product_name VARCHAR(191) NOT NULL,
  variant_name VARCHAR(150) NULL,
  sku VARCHAR(80) NULL,
  image_url VARCHAR(500) NULL,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  quantity INT UNSIGNED NOT NULL,
  line_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_orderitem_order (order_id),
  CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE coupon_usages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  coupon_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  order_id BIGINT UNSIGNED NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_couponusage_coupon (coupon_id), KEY idx_couponusage_user (user_id), UNIQUE KEY uq_couponusage_order (order_id),
  CONSTRAINT fk_couponusage_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id),
  CONSTRAINT fk_couponusage_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_couponusage_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE order_status_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  status VARCHAR(40) NOT NULL,
  note VARCHAR(1000) NULL,
  changed_by_user_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_orderhistory_order (order_id),
  CONSTRAINT fk_orderhistory_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE reviews (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  order_id BIGINT UNSIGNED NULL,
  rating TINYINT UNSIGNED NOT NULL,
  title VARCHAR(120) NULL,
  comment TEXT NOT NULL,
  status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  is_verified_purchase TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_review_user_product (user_id,product_id), KEY idx_review_product_status (product_id,status),
  CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_review_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE banners (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(191) NOT NULL,
  subtitle VARCHAR(500) NULL,
  image_url VARCHAR(500) NOT NULL,
  mobile_image_url VARCHAR(500) NULL,
  link_url VARCHAR(500) NULL,
  position VARCHAR(80) NOT NULL DEFAULT 'HOME_HERO',
  sort_order INT NOT NULL DEFAULT 0,
  starts_at DATETIME NULL,
  ends_at DATETIME NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE settings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(120) NOT NULL,
  `value` JSON NULL,
  is_public TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_setting_key (`key`)
) ENGINE=InnoDB;

CREATE TABLE inventory_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  variant_id BIGINT UNSIGNED NULL,
  change_quantity INT NOT NULL,
  before_quantity INT UNSIGNED NOT NULL,
  after_quantity INT UNSIGNED NOT NULL,
  reason VARCHAR(120) NOT NULL,
  reference VARCHAR(120) NULL,
  changed_by_user_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_inventory_product (product_id), KEY idx_inventory_variant (variant_id),
  CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_inventory_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE admin_activity_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  admin_user_id BIGINT UNSIGNED NOT NULL,
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(80) NULL,
  entity_id VARCHAR(80) NULL,
  details JSON NULL,
  ip_address VARCHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_activity_admin (admin_user_id),
  CONSTRAINT fk_activity_admin FOREIGN KEY (admin_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE contact_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(30) NULL,
  subject VARCHAR(191) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('NEW','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL DEFAULT 'NEW',
  admin_note TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_contact_user (user_id), KEY idx_contact_status (status),
  CONSTRAINT fk_contact_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE newsletter_subscribers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(191) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  subscribed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_newsletter_email (email)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- USERS
INSERT INTO users (id,first_name,last_name,email,phone,password_hash,role,status,email_verified_at,created_at,updated_at) VALUES
(1,'H&H','Admin','admin@hhcosmetics.co.uk','+44 20 7946 0123','scrypt$9ae90640f9bfeee2c5008a6ff1da6d5f$9fe5d4bf4e4209aa3efc99b0c354a93bdaae86c8f6250727040783622b3363db41907ded875ffebcd4383db19991b0aca3d70e8b6927a4c9fda5d414a5f85732','SUPERADMIN','ACTIVE',NOW(),NOW(),NOW()),
(2,'Amelia','Brown','customer@example.com','07123456789','scrypt$b77d08664814e34a913792b791c925c3$82b7a33ff5c429e2938417cd037b681ef506e58a48c3b9ad32a03c6e1849b7e4a50c106c6ceb16a57dbf309335805acaeac9264bdf1e33fbeb13e4e65be6a05d','USER','ACTIVE',NOW(),NOW(),NOW());

INSERT INTO addresses (id,user_id,label,first_name,last_name,phone,address_line1,city,county,postcode,country,is_default) VALUES
(1,2,'Home','Amelia','Brown','07123456789','24 Kensington Gardens','London','Greater London','W8 4PX','United Kingdom',1);
INSERT INTO carts (id,user_id) VALUES (1,2);

-- CATEGORIES
INSERT INTO categories (id,name,slug,description,image_url,sort_order,is_active) VALUES
(1,'Hair Care','hair-care','Cleansers, masks, oils and scalp essentials.','https://placehold.co/900x1100/F7F1ED/5A1021?text=hair+care',1,1),
(2,'Wigs & Hairpieces','wigs-hairpieces','Wig care, lace styling and hairpiece essentials.','https://placehold.co/900x1100/F7F1ED/5A1021?text=wigs',2,1),
(3,'Extensions','extensions','Braids, extensions and protective-style care.','https://placehold.co/900x1100/F7F1ED/5A1021?text=extensions',3,1),
(4,'Styling & Finish','styling-finish','Edge control, curl definition and heat styling.','https://placehold.co/900x1100/F7F1ED/5A1021?text=styling',4,1),
(5,'Skin & Body','skin-body','Everyday cleansers and body care.','https://placehold.co/900x1100/F7F1ED/5A1021?text=skin+body',5,1),
(6,'Accessories','accessories','Brushes, bonnets and daily beauty essentials.','https://placehold.co/900x1100/F7F1ED/5A1021?text=accessories',6,1);

INSERT INTO subcategories (id,category_id,name,slug,description,sort_order,is_active) VALUES
(1,1,'Shampoo','shampoo','Hair shampoo range.',1,1),(2,1,'Conditioner & Masks','conditioner-masks','Conditioner and mask range.',2,1),(3,1,'Hair Oils & Serums','hair-oils-serums','Hair oil and serum range.',3,1),(4,1,'Scalp Care','scalp-care','Scalp care range.',4,1),
(5,2,'Lace Care','lace-care','Lace care range.',1,1),(6,2,'Wig Care','wig-care','Wig care range.',2,1),
(7,3,'Braids & Locs','braids-locs','Braids and locs range.',1,1),(8,3,'Extension Care','extension-care','Extension care range.',2,1),
(9,4,'Curl Styling','curl-styling','Curl styling range.',1,1),(10,4,'Edge Control','edge-control','Edge control range.',2,1),(11,4,'Heat Protection','heat-protection','Heat protection range.',3,1),
(12,5,'Face Care','face-care','Face care range.',1,1),(13,5,'Body Care','body-care','Body care range.',2,1),
(14,6,'Hair Tools','hair-tools','Hair tools.',1,1),(15,6,'Sleep Care','sleep-care','Night-time hair care.',2,1);

INSERT INTO products (id,category_id,subcategory_id,name,slug,sku,brand,short_description,description,ingredients,usage_notes,base_price,compare_at_price,cost_price,stock,low_stock_threshold,track_inventory,badge,rating_average,review_count,is_featured,is_new,is_active,metadata) VALUES
(1,1,3,'Signature Radiance Hair Oil','signature-radiance-hair-oil','HH-HC-001','H&H Hair & Cosmetics','Weightless shine for dry lengths and textured hair.','A lightweight finishing oil created to soften dry lengths, tame flyaways and add polished shine.','Argan-inspired oil blend, vitamin E and lightweight emollients.','Use as directed.',14.95,18.00,7.18,55,8,1,'Best seller',4.90,124,1,0,1,JSON_OBJECT('source','H&H frontend v7 dummy catalogue')),
(2,1,1,'Silk Moisture Shampoo','silk-moisture-shampoo','HH-HC-002','H&H Hair & Cosmetics','A gentle cleanse with a soft, conditioned finish.','A gentle everyday cleanser designed to refresh the scalp.','Demo cosmetic ingredient copy.','Use as directed.',9.50,NULL,4.56,75,8,1,'New',4.70,86,0,1,1,NULL),
(3,1,2,'Intensive Repair Mask','intensive-repair-mask','HH-HC-003','H&H Hair & Cosmetics','Rich weekly care for brittle-feeling, thirsty hair.','A rich conditioning mask for brittle-feeling hair.','Demo cosmetic ingredient copy.','Use as directed.',12.75,15.00,6.12,38,8,1,'Save 15%',4.80,72,0,0,1,NULL),
(4,4,9,'Defined Curl Cream','defined-curl-cream','HH-ST-004','H&H Hair & Cosmetics','Flexible definition without a stiff or crunchy feel.','A soft-hold curl cream that enhances shape and definition.','Demo cosmetic ingredient copy.','Use as directed.',8.95,NULL,4.30,66,8,1,'Curl favourite',4.60,98,1,0,1,NULL),
(5,2,5,'Invisible Lace Melt Spray','invisible-lace-melt-spray','HH-WG-005','H&H Hair & Cosmetics','A precise mist for seamless-looking lace styling.','A precise styling mist created for a seamless-looking lace finish.','Demo cosmetic ingredient copy.','Use as directed.',10.50,NULL,5.04,44,8,1,'Trending',4.90,141,1,0,1,NULL),
(6,4,10,'Precision Edge Control','precision-edge-control','HH-ST-006','H&H Hair & Cosmetics','Clean satin hold for detailed, polished edges.','A smooth edge styler with a clean satin finish.','Demo cosmetic ingredient copy.','Use as directed.',6.95,NULL,3.34,90,8,1,'Salon edit',4.50,64,0,0,1,NULL),
(7,1,4,'Root Revival Scalp Serum','root-revival-scalp-serum','HH-HC-007','H&H Hair & Cosmetics','A lightweight ritual for scalp massage and moisture.','A concentrated scalp serum with a light clean feel.','Demo cosmetic ingredient copy.','Use as directed.',16.50,NULL,7.92,31,8,1,'Editor’s pick',4.80,53,1,0,1,NULL),
(8,4,11,'Thermal Shield Protectant','thermal-shield-protectant','HH-ST-008','H&H Hair & Cosmetics','Fine pre-styling mist for heat-led routines.','A lightweight pre-styling mist for blow-drying and straightening.','Demo cosmetic ingredient copy.','Use as directed.',9.95,11.50,4.78,49,8,1,'Save 13%',4.70,77,0,0,1,NULL),
(9,5,13,'Velvet Body Butter','velvet-body-butter','HH-SB-009','H&H Hair & Cosmetics','A whipped body moisturiser with a satin finish.','A rich body moisturiser with a soft whipped texture.','Demo cosmetic ingredient copy.','Use as directed.',11.95,NULL,5.74,41,8,1,'Soft skin edit',4.60,43,0,0,1,NULL),
(10,5,12,'Rose Glow Cleanser','rose-glow-cleanser','HH-SB-010','H&H Hair & Cosmetics','A creamy everyday cleanser for a comfortable finish.','A creamy daily face cleanser.','Demo cosmetic ingredient copy.','Use as directed.',8.50,NULL,4.08,58,8,1,'New',4.40,39,0,1,1,NULL),
(11,2,6,'Wig Care Conditioning Mist','wig-care-conditioning-mist','HH-WG-011','H&H Hair & Cosmetics','Refresh, soften and detangle between wash days.','A refreshing conditioning mist for wig care.','Demo cosmetic ingredient copy.','Use as directed.',7.95,NULL,3.82,63,8,1,'Daily care',4.70,89,0,0,1,NULL),
(12,3,7,'Braid & Loc Finishing Mousse','braid-and-loc-finishing-mousse','HH-EX-012','H&H Hair & Cosmetics','Light foam for smooth braids, twists and locs.','A light finishing mousse to refine protective styles.','Demo cosmetic ingredient copy.','Use as directed.',8.95,NULL,4.30,72,8,1,'Protective style',4.80,118,1,0,1,NULL),
(13,6,14,'Flex Glide Detangling Brush','flex-glide-detangling-brush','HH-AC-013','H&H Hair & Cosmetics','Flexible rows for gentle detangling on wet or dry hair.','A flexible detangling brush for everyday routines.','Cosmetic-grade plastic.','Use gently.',7.95,NULL,3.82,100,8,1,'Routine essential',4.80,67,0,0,1,NULL),
(14,6,15,'Signature Satin Sleep Bonnet','signature-satin-sleep-bonnet','HH-AC-014','H&H Hair & Cosmetics','Soft satin protection for curls, braids and styled hair.','A roomy satin bonnet with a comfortable band.','Polyester satin fabric.','Wear overnight.',9.95,NULL,4.78,80,8,1,'Night-time care',4.90,102,0,0,1,NULL);

INSERT INTO product_images (product_id,image_url,alt_text,sort_order,is_primary) SELECT id, CONCAT('https://placehold.co/900x1100/F7F1ED/5A1021?text=',REPLACE(slug,'-','+')), name, 0, 1 FROM products;

INSERT INTO product_variants (id,product_id,name,sku,attributes,price,stock,low_stock_threshold,is_default,is_active) VALUES
(1,1,'50ml','HH-HC-001-50',JSON_OBJECT('size','50ml'),14.95,55,6,1,1),(2,1,'100ml','HH-HC-001-100',JSON_OBJECT('size','100ml'),22.95,30,6,0,1),(3,2,'300ml','HH-HC-002-300',JSON_OBJECT('size','300ml'),9.50,75,6,1,1),(4,14,'Burgundy','HH-AC-014-BUR',JSON_OBJECT('colour','Burgundy'),9.95,45,6,1,1),(5,14,'Black','HH-AC-014-BLK',JSON_OBJECT('colour','Black'),9.95,35,6,0,1),(6,13,'Burgundy','HH-AC-013-BUR',JSON_OBJECT('colour','Burgundy'),7.95,60,6,1,1);

INSERT INTO coupons (id,code,name,type,value,min_order,max_discount,usage_limit,used_count,per_user_limit,is_active) VALUES
(1,'HH10','10% Welcome Saving','PERCENT',10,20,25,1000,0,1,1),(2,'BEAUTY5','£5 Beauty Saving','FIXED',5,30,NULL,500,0,2,1);

INSERT INTO banners (id,title,subtitle,image_url,link_url,position,sort_order,is_active) VALUES
(1,'Premium hair & beauty, curated for every ritual','Discover H&H essentials for wash day, protective styling and everyday beauty.','https://placehold.co/1600x800/F7F1ED/5A1021?text=H%26H+Hair+%26+Cosmetics','/shop','HOME_HERO',1,1);

INSERT INTO settings (`key`,`value`,is_public) VALUES
('store_name',JSON_QUOTE('H&H Hair & Cosmetics'),1),('currency',JSON_QUOTE('GBP'),1),('support_email',JSON_QUOTE('hello@hhcosmetics.co.uk'),1),('support_phone',JSON_QUOTE('+44 20 7946 0123'),1),('free_delivery_threshold',CAST(45 AS JSON),1),('standard_delivery_fee',CAST(4.95 AS JSON),1),('express_delivery_fee',CAST(7.95 AS JSON),1),('cod_fee',CAST(0 AS JSON),1),('cod_enabled',CAST('true' AS JSON),1);

INSERT INTO orders (id,user_id,order_number,status,payment_method,payment_status,shipping_method,currency,subtotal,discount_amount,shipping_amount,cod_fee,total_amount,shipping_address,billing_address,confirmed_at,shipped_at,delivered_at) VALUES
(1,2,'HH-DEMO-1001','DELIVERED','COD','PAID','STANDARD','GBP',24.90,0,4.95,0,29.85,JSON_OBJECT('firstName','Amelia','lastName','Brown','phone','07123456789','addressLine1','24 Kensington Gardens','city','London','county','Greater London','postcode','W8 4PX','country','United Kingdom'),JSON_OBJECT('firstName','Amelia','lastName','Brown','phone','07123456789','addressLine1','24 Kensington Gardens','city','London','county','Greater London','postcode','W8 4PX','country','United Kingdom'),DATE_SUB(NOW(),INTERVAL 5 DAY),DATE_SUB(NOW(),INTERVAL 4 DAY),DATE_SUB(NOW(),INTERVAL 2 DAY));
INSERT INTO order_items (order_id,product_id,product_name,sku,image_url,unit_price,quantity,line_total) VALUES
(1,1,'Signature Radiance Hair Oil','HH-HC-001','https://placehold.co/900x1100/F7F1ED/5A1021?text=signature+radiance+hair+oil',14.95,1,14.95),
(1,14,'Signature Satin Sleep Bonnet','HH-AC-014','https://placehold.co/900x1100/F7F1ED/5A1021?text=signature+satin+sleep+bonnet',9.95,1,9.95);
INSERT INTO order_status_history (order_id,status,note,changed_by_user_id) VALUES
(1,'PENDING','Demo order placed',2),(1,'CONFIRMED','Confirmed by H&H',1),(1,'SHIPPED','Royal Mail demo shipment',1),(1,'DELIVERED','Delivered and COD collected',1);
INSERT INTO reviews (user_id,product_id,order_id,rating,title,comment,status,is_verified_purchase) VALUES
(2,1,1,5,'Lovely finish','Leaves my hair soft and glossy without feeling heavy.','APPROVED',1);
INSERT INTO contact_messages (user_id,name,email,phone,subject,message,status) VALUES
(2,'Amelia Brown','customer@example.com','07123456789','Product availability','Will the satin bonnet be available in more colours?','NEW');
INSERT INTO newsletter_subscribers (email,is_active,subscribed_at) VALUES ('customer@example.com',1,NOW());

ALTER TABLE users AUTO_INCREMENT=3;
ALTER TABLE categories AUTO_INCREMENT=7;
ALTER TABLE subcategories AUTO_INCREMENT=16;
ALTER TABLE products AUTO_INCREMENT=15;
ALTER TABLE product_variants AUTO_INCREMENT=7;
ALTER TABLE orders AUTO_INCREMENT=2;
