DROP DATABASE IF EXISTS zenit_back;
CREATE DATABASE IF NOT EXISTS zenit_back;
USE zenit_back;

CREATE TABLE IF NOT EXISTS users(
      username VARCHAR(20) PRIMARY KEY UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      active BOOLEAN DEFAULT false,
      registrationCode VARCHAR(100)	
    );

CREATE TABLE IF NOT EXISTS models(
      slug VARCHAR(30) PRIMARY KEY UNIQUE NOT NULL,
      title VARCHAR(50) NOT NULL,
      description VARCHAR(255) NOT NULL,
      technologies VARCHAR(255) NOT NULL,
      category1 ENUM('Personal', 'Professional') NOT NULL,
      category2 ENUM('Cartoon', 'Realistic', 'Stylized') NOT NULL,
    );

CREATE TABLE IF NOT EXISTS model_images(
      model_image_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      post VARCHAR(30) NOT NULL,
      url VARCHAR(255),
      createdAt DATETIME NOT NULL DEFAULT NOW(),
      FOREIGN KEY (post) REFERENCES models(slug)
    );