const getPool = require('../../getDB.js');

const getAllModels = async () => {
  let connection;

  try {
    connection = await getPool();

    const [result] = await connection.query(
      `
      SELECT 
        m.model_id, 
        m.slug, 
        m.title, 
        m.category1, 
        m.category2, 
        m.createdAt, 
        (SELECT mi.url FROM model_images mi WHERE mi.post = m.slug AND mi.cover = 1 LIMIT 1) AS cover, 
        (SELECT mv.url FROM model_videos mv WHERE mv.post = m.slug LIMIT 1) AS video
      FROM 
        models m
      ORDER BY 
        m.model_id ASC
      `
    );

    return result;
  } finally {
    if (connection) connection.release;
  }
};

module.exports = { getAllModels };
