const getPool = require('../../getDB.js');

const filtersToApply = async (queryParams) => {
  const pool = await getPool();
  const { category1, category2 } = queryParams;

  let sqlQuery = 'SELECT * FROM models';
  const values = [];
  let clause = 'WHERE';

  if (category1) {
    sqlQuery += ` ${clause} category1 LIKE ?`;
    values.push(`%${category1}%`);
    clause = 'AND';
  }

  if (category2) {
    sqlQuery += ` ${clause} category2 LIKE ?`;
    values.push(`%${category2}%`);
    clause = 'AND';
  }

  const [models] = await pool.query(sqlQuery, values);
  return models;
};

module.exports = filtersToApply;
