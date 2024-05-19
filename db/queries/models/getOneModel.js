const getPool = require('../../getDB.js');

const getOneModel = async (slug) => {
  let connection;

  try {
    connection = await getPool();

    const [info] = await connection.query(
      `
      SELECT *
      FROM models
      WHERE slug= ?
        `,
      [slug]
    );

    const [images] = await connection.query(
      `
      SELECT *
      FROM model_images
      WHERE post = ?
      `,
      [slug]
    );

    const [videos] = await connection.query(
      `
      SELECT *
      FROM model_videos
      WHERE post = ?
      `,
      [slug]
    );

    const result = [info[0], images, videos];

    return result;
  } finally {
    if (connection) connection.release;
  }
};

module.exports = { getOneModel };
