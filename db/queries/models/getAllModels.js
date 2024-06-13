const getPool = require('../../getDB.js');

const getAllModels = async () => {
  let connection;

  try {
    connection = await getPool();

    const [result] = await connection.query(
      `
      SELECT m.model_id, m.slug, m.title, m.category1, m.category2, m.createdAt, mi.url AS cover, mv.url AS video
      FROM models m
      LEFT JOIN model_images mi ON mi.post = m.slug AND mi.cover = 1
      LEFT JOIN model_videos mv ON mv.post = m.slug
      ORDER BY m.createdAt DESC
      `
    );

    return result;
  } finally {
    if (connection) connection.release;
  }
};

module.exports = { getAllModels };
