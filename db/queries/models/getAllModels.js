const getPool = require('../../getDB.js');

const getAllModels = async () => {
  let connection;

  try {
    connection = await getPool();

    const [result] = await connection.query(`
      SELECT *
      FROM models
      ORDER BY createdAt DESC`);

    return result;
  } finally {
    if (connection) connection.release;
  }
};

module.exports = { getAllModels };
