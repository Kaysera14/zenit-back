const getPool = require('../../getDB.js');

const getOneModel = async (slug) => {
  let connection;

  try {
    connection = await getPool();

    const [result] = await connection.query(
      `
      SELECT *
      FROM models
      WHERE slug= ?
        `,
      [slug]
    );

    return result;
  } finally {
    if (connection) connection.release;
  }
};

module.exports = { getOneModel };
