const getPool = require('../../getDB.js');

const modelImages = async (post, url, cover) => {
  let connection;

  try {
    connection = await getPool();

    const [result] = await connection.query(
      `
      INSERT INTO model_images (post, url, cover)
      VALUES (?, ?, ?)
      `,
      [post, url, cover]
    );

    return result.data;
  } finally {
    if (connection) connection.release;
  }
};

module.exports = modelImages;
