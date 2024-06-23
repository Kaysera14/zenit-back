const getPool = require('../../getDB.js');

const changeModel = async (
  url,
  oldTitle,
  model_id,
  title,
  description,
  technologies,
  category1,
  category2
) => {
  let connection;
  try {
    connection = await getPool();
    let newModelId;
    const setClauses = [];
    const values = [];

    const [checkID] = await connection.query(
      'SELECT model_id FROM models WHERE model_id = ?',
      [model_id]
    );

    if (checkID.length === 1) {
      const [getCurrentModelId] = await connection.query(
        'SELECT model_id FROM models WHERE slug = ?',
        [oldTitle]
      );
      newModelId = getCurrentModelId[0].model_id;
    }

    const [temporalID] = await connection.query(
      'UPDATE models SET model_id = 999 WHERE model_id = ?',
      [model_id]
    );

    if (url !== undefined && url !== null && url !== '') {
      setClauses.push('slug = ?');
      values.push(url);
    }

    if (model_id !== undefined && model_id !== null && model_id !== '') {
      setClauses.push('model_id = ?');
      values.push(model_id);
    }

    if (title !== undefined && title !== null && title !== '') {
      setClauses.push('title = ?');
      values.push(title);
    }

    if (
      description !== undefined &&
      description !== null &&
      description !== ''
    ) {
      setClauses.push('description = ?');
      values.push(description);
    }

    if (
      technologies !== undefined &&
      technologies !== null &&
      technologies !== ''
    ) {
      setClauses.push('technologies = ?');
      values.push(technologies);
    }

    if (category1 !== undefined && category1 !== null && category1 !== '') {
      setClauses.push('category1 = ?');
      values.push(category1);
    }

    if (category2 !== undefined && category2 !== null && category2 !== '') {
      setClauses.push('category2 = ?');
      values.push(category2);
    }

    const sql = ` UPDATE models SET ${setClauses.join(', ')} WHERE slug = ? `;
    values.push(oldTitle);

    const [{ result }] = await connection.query(sql, values);

    const [updateOldID] = await connection.query(
      'UPDATE models SET model_id = ? WHERE model_id = 999',
      [newModelId]
    );

    console.log(
      url,
      oldTitle,
      model_id,
      title,
      description,
      technologies,
      category1,
      category2
    );
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (connection) connection.release;
  }
};

module.exports = { changeModel };
