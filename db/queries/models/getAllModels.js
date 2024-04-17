const getPool = require('../../getDB.js');

const getAllModels = async () => {
  let connection;

  try {
    let result = [];
    connection = await getPool();

    const [info] = await connection.query(
      `
        SELECT m.*, mi.url AS cover_url
        FROM models m
        JOIN model_images mi ON mi.post = m.slug
        WHERE mi.cover = 1
        ORDER BY m.createdAt DESC
      `
    );
    result.push(info);

    return result;
  } finally {
    if (connection) connection.release;
  }
};

module.exports = { getAllModels };
