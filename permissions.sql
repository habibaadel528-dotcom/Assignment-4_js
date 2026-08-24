//Task 14
CREATE USER 'store_manager'@'localhost'
IDENTIFIED BY 'StoreManager@123';
GRANT SELECT, INSERT, UPDATE
ON store_db.*
TO 'store_manager'@'localhost';

//Task 15
REVOKE UPDATE
ON store_db.*
FROM 'store_manager'@'localhost';

//Task 16
GRANT DELETE
ON store_db.sales
TO 'store_manager'@'localhost';
