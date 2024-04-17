const { generateError } = require('../../../helpers/');
const getPool = require('../../getDB.js');

const deleteModelSlug = async (slug) => {
  let connection;

  try {
    connection = await getPool();

    const [modelExists] = await connection.query(
      `SELECT * FROM models WHERE slug=?`,
      [slug]
    );

    if (modelExists.length === 0) {
      throw generateError(`¡Este modelo no existe!`, 403);
    }

    await connection.query(
      `
        DELETE FROM model_images WHERE post=?
      `,
      [slug]
    );

    await connection.query(
      `
        DELETE FROM models WHERE slug=?
      `,
      [slug]
    );

    return;
  } finally {
    if (connection) connection.release;
  }
};

module.exports = { deleteModelSlug };
