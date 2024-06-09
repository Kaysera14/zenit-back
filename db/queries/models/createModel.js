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
    let modelID;
    connection = await getPool();

    const [modelId] = await connection.query(
      `
      SELECT * FROM models;
      `
    );

    if (modelId.length === 0) {
      modelID = 1;
    } else {
      modelID = modelId[modelId.length - 1].model_id + 1;
    }

    const [result] = await connection.query(
      `
      INSERT INTO models (model_id, slug, title, description, technologies, category1, category2)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [modelID, slug, title, description, technologies, category1, category2]
    );

    return result.data;
  } finally {
    if (connection) connection.release;
  }
};

module.exports = { createModel };
