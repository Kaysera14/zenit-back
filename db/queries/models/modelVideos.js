const getPool = require('../../getDB.js');

const modelVideos = async (post, url, cover) => {
  let connection;

  try {
    let videoID;
    connection = await getPool();

    const [videoId] = await connection.query(
      `
      SELECT * FROM model_videos;
      `
    );

    if (videoId.length === 0) {
      videoID = 1;
    } else {
      videoID = videoId[videoId.length - 1].model_video_id + 1;
    }

    const [result] = await connection.query(
      `
      INSERT INTO model_videos (model_video_id, post, url, cover)
      VALUES (?, ?, ?, ?)
      `,
      [videoID, post, url, cover]
    );

    return result.data;
  } finally {
    if (connection) connection.release;
  }
};

module.exports = modelVideos;
