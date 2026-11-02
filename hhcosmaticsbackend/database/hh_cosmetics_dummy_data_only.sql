-- H&H Hair & Cosmetics dummy data only.
-- Use only after Sequelize has created EMPTY tables in database hh_cosmetics.
-- SUPERADMIN: admin@hhcosmetics.co.uk / Admin@12345
-- CUSTOMER: customer@example.com / User@12345
USE hh_cosmetics;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

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

SET FOREIGN_KEY_CHECKS=1;
