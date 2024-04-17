require('dotenv').config();
const getDB = require('./getDB.js');

const init = async () => {
  let connection;

  try {
    connection = await getDB();

    await connection.query('DROP DATABASE IF EXISTS zenit_back;');
    await connection.query('CREATE DATABASE IF NOT EXISTS zenit_back;');
    await connection.query('USE zenit_back;');

    console.log('Creando tablas');
    console.log('Creando tabla users');
    await connection.query(`
    CREATE TABLE IF NOT EXISTS users(
      username VARCHAR(20) PRIMARY KEY UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      active BOOLEAN DEFAULT false,
      registrationCode VARCHAR(100)	
    );
    `);

    console.log('Creando tabla models');
    await connection.query(`
    CREATE TABLE IF NOT EXISTS models(
      slug VARCHAR(30) PRIMARY KEY UNIQUE NOT NULL,
      title VARCHAR(50) NOT NULL,
      description VARCHAR(255) NOT NULL,
      technologies VARCHAR(255) NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT NOW()
    );
    `);

    console.log('Creando tabla model_images');
    await connection.query(`
    CREATE TABLE IF NOT EXISTS model_images(
      model_image_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      post VARCHAR(30) NOT NULL,
      url VARCHAR(255),
      createdAt DATETIME NOT NULL DEFAULT NOW(),
      FOREIGN KEY (post) REFERENCES models(slug)
    );
    `);

    console.log('Tablas creadas');
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release;
    process.exit();
  }
};

init();
