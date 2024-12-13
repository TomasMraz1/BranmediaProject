-- Create Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique ID for each user
    email VARCHAR(255) NOT NULL UNIQUE,      -- User's email (must be unique)
    password VARCHAR(255) NOT NULL           -- Hashed password
);

-- Create Products Table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique ID for each product
    name VARCHAR(255) NOT NULL,              -- Name of the product
    stock INT NOT NULL                       -- Available stock for the product
);
