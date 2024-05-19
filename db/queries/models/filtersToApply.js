const getPool = require('../../getDB.js');

const filtersToApply = async (queryParams) => {
  const pool = await getPool();
  const { category1, category2 } = queryParams;

  let sqlQuery =
    'SELECT m.*, mi.url AS cover_url FROM models m JOIN model_images mi ON mi.post = m.slug WHERE mi.cover = 1';
  const values = [];
  let clause = 'AND';

  if (category1) {
    sqlQuery += ` ${clause} category1 LIKE ?`;
    values.push(`%${category1}%`);
    clause = 'AND';
  }

  if (category2) {
    sqlQuery += ` ${clause} category2 LIKE ?`;
    values.push(`%${category2}%`);
  }

  const [models] = await pool.query(sqlQuery, values);
  return models;
};

module.exports = filtersToApply;
