DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;
USE bamazon;



CREATE TABLE products (
  position INT NOT NULL AUTO_INCREMENT,
  item_id int NULL,
  product_name VARCHAR(45) NULL,
  manufacturer VARCHAR(45) NULL,
  price decimal (10,2) NULL,
  instock BIT NULL,
  stock_quantity INT NULL,
  backorder BIT NULL,
  PRIMARY KEY (position)
  );
  

INSERT INTO products (item_id, product_name, manufacturer, price, instock, stock_quantity, backorder)
VALUES ("654", "screwdriver_phillips", "stanley", 2.75, 1, 50, 0),
("458", "screwdriver_flat", "stanley", 2.50, 1, 42, 0),
("965", "hammer_sm", "craftsman", 8.99, 1, 27, 0),
("758", "hammer_sledge", "paul_bunyan", 29.99, 1, 10, 0),
("742", "drill_cordless", "dewalt", 199.99, 1, 12, 0),
("187", "drillbit_set_lg", "husky", 19.99, 1, 76, 0),
("761", "driver_set_lg", "stanley", 29.99, 1, 31, 0),
("254", "axe_hickory", "paul_bunyan", 15.99, 1, 11, 0),
("341", "axe_poly", "husky", 17.99, 1, 50, 0),
("465", "sandpaper_220", "stanley", 1.89, 1, 79, 0),
("679", "sandpaper_90", "stanley", 1.89, 1, 80, 0),
("123", "polish", "mothers", 4.99, 1, 27, 0),
("111", "key_blank", "stanley", 3.19, 1, 50, 0)
;