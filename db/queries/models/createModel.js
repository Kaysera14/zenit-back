const getPool = require('../../getDB.js');

const createModel = async (
  slug,
  title,
  description,
  technologies,
  category1,
  category2
) => {
  let connection;

  try {
    connection = await getPool();

    const [result] = await connection.query(
      `
      INSERT INTO models (slug, title, description, technologies, category1, category2)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [slug, title, description, technologies, category1, category2]
    );

    return result.data;
  } finally {
    if (connection) connection.release;
  }
};

module.exports = { createModel };
