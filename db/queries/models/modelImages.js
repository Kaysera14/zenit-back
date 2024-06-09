const getPool = require('../../getDB.js');

const modelImages = async (post, url, cover) => {
  let connection;

  try {
    let imageID;
    connection = await getPool();

    const [imageId] = await connection.query(
      `
      SELECT * FROM model_images;
      `
    );

    if (imageId.length === 0) {
      imageID = 1;
    } else {
      imageID = imageId[imageId.length - 1].model_image_id + 1;
    }

    const [result] = await connection.query(
      `
      INSERT INTO model_images (model_image_id, post, url, cover)
      VALUES (?, ?, ?, ?)
      `,
      [imageID, post, url, cover]
    );

    return result.data;
  } finally {
    if (connection) connection.release;
  }
};

module.exports = modelImages;
